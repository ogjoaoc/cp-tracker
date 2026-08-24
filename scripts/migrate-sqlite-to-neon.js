/* eslint-disable no-console */
const path = require('path');
const Database = require('better-sqlite3');
const { PrismaClient } = require('@prisma/client');

const sqlitePath = path.join(process.cwd(), 'prisma', 'dev.db');
const sqlite = new Database(sqlitePath, { readonly: true });
const prisma = new PrismaClient();

function optional(value) {
  return value === undefined || value === null || value === '' ? null : value;
}

async function main() {
  const problems = sqlite.prepare('SELECT * FROM Problem ORDER BY createdAt ASC').all();
  const tags = sqlite.prepare('SELECT * FROM Tag ORDER BY name ASC').all();
  const attempts = sqlite.prepare('SELECT * FROM ThoughtAttempt ORDER BY createdAt ASC').all();
  const links = sqlite.prepare('SELECT A, B FROM _ProblemToTag').all();

  console.log(`Encontrados: ${problems.length} problemas, ${tags.length} tags e ${attempts.length} tentativas.`);

  for (const tag of tags) {
    await prisma.tag.upsert({
      where: { id: tag.id },
      update: { name: tag.name, category: optional(tag.category) },
      create: { id: tag.id, name: tag.name, category: optional(tag.category) },
    });
  }

  const tagIdsByProblem = new Map();
  for (const link of links) {
    if (!tagIdsByProblem.has(link.B)) tagIdsByProblem.set(link.B, []);
    tagIdsByProblem.get(link.B).push(link.A);
  }

  for (const problem of problems) {
    const problemTagIds = tagIdsByProblem.get(problem.id) || [];
    await prisma.problem.upsert({
      where: { id: problem.id },
      update: {
        title: problem.title,
        url: problem.url,
        platform: problem.platform,
        platformProblemId: problem.platformProblemId || '',
        platformDifficulty: optional(problem.platformDifficulty),
        normalizedDiff: Number(problem.normalizedDiff) || 5,
        simplifiedStatement: problem.simplifiedStatement || '',
        reviewTakeaways: optional(problem.reviewTakeaways),
        createdAt: new Date(problem.createdAt),
        updatedAt: new Date(problem.updatedAt),
        tags: { set: problemTagIds.map((id) => ({ id })) },
      },
      create: {
        id: problem.id,
        title: problem.title,
        url: problem.url,
        platform: problem.platform,
        platformProblemId: problem.platformProblemId || '',
        platformDifficulty: optional(problem.platformDifficulty),
        normalizedDiff: Number(problem.normalizedDiff) || 5,
        simplifiedStatement: problem.simplifiedStatement || '',
        reviewTakeaways: optional(problem.reviewTakeaways),
        createdAt: new Date(problem.createdAt),
        updatedAt: new Date(problem.updatedAt),
        tags: { connect: problemTagIds.map((id) => ({ id })) },
      },
    });
  }

  for (const attempt of attempts) {
    await prisma.thoughtAttempt.upsert({
      where: { id: attempt.id },
      update: {
        problemId: attempt.problemId,
        title: attempt.title,
        status: attempt.status,
        keyQuestions: optional(attempt.keyQuestions),
        keyObservation: optional(attempt.keyObservation),
        proofSketch: optional(attempt.proofSketch),
        heuristicsUsed: optional(attempt.heuristicsUsed),
        notes: optional(attempt.notes),
        createdAt: new Date(attempt.createdAt),
      },
      create: {
        id: attempt.id,
        problemId: attempt.problemId,
        title: attempt.title,
        status: attempt.status,
        keyQuestions: optional(attempt.keyQuestions),
        keyObservation: optional(attempt.keyObservation),
        proofSketch: optional(attempt.proofSketch),
        heuristicsUsed: optional(attempt.heuristicsUsed),
        notes: optional(attempt.notes),
        createdAt: new Date(attempt.createdAt),
      },
    });
  }

  console.log('Migração concluída com sucesso.');
}

main()
  .catch((error) => {
    console.error('Falha na migração:', error.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    sqlite.close();
    await prisma.$disconnect();
  });
