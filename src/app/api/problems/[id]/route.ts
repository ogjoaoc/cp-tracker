import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: params.id },
      include: { tags: true, attempts: true },
    });

    if (!problem) {
      return NextResponse.json({ error: 'Problema não encontrado' }, { status: 404 });
    }

    return NextResponse.json(problem);
  } catch {
    return NextResponse.json({ error: 'Erro ao buscar problema' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
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
      reviewTakeaways,
      tags = [],
    } = body;

    const problem = await prisma.problem.update({
      where: { id: params.id },
      data: {
        title,
        url,
        platform,
        platformProblemId,
        platformDifficulty,
        normalizedDiff: Number(normalizedDiff) || 5,
        simplifiedStatement,
        reviewTakeaways,
        tags: {
          set: [],
          connectOrCreate: tags
            .map((tag: string) => tag.trim())
            .filter(Boolean)
            .map((tag: string) => ({
              where: { name: tag },
              create: { name: tag },
            })),
        },
      },
      include: { tags: true, attempts: true },
    });

    return NextResponse.json(problem);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar problema' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.problem.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Erro ao deletar problema' }, { status: 500 });
  }
}
