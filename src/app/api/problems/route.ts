import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const problems = await prisma.problem.findMany({
      include: {
        tags: true,
        attempts: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(problems);
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar problemas' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      url,
      platform,
      platformProblemId,
      platformDifficulty,
      normalizedDiff,
      simplifiedStatement,
      tags = [],
      attempts = [],
    } = body;

    const problem = await prisma.problem.create({
      data: {
        title,
        url,
        platform,
        platformProblemId,
        platformDifficulty,
        normalizedDiff: Number(normalizedDiff) || 5,
        simplifiedStatement,
        tags: {
          connectOrCreate: tags.map((tag: string) => ({
            where: { name: tag.trim() },
            create: { name: tag.trim() },
          })),
        },
        attempts: {
          create: attempts.map((att: any) => ({
            title: att.title,
            status: att.status,
            keyQuestions: att.keyQuestions,
            keyObservation: att.keyObservation,
            proofSketch: att.proofSketch,
            heuristicsUsed: att.heuristicsUsed,
            notes: att.notes,
          })),
        },
      },
      include: {
        tags: true,
        attempts: true,
      },
    });

    return NextResponse.json(problem, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao salvar problema' }, { status: 500 });
  }
}