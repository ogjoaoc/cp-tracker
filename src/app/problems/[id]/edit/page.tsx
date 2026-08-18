import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { EditProblemClient } from '@/components/EditProblemClient';

export const dynamic = 'force-dynamic';

export default async function EditProblemPage({ params }: { params: { id: string } }) {
  const problem = await prisma.problem.findUnique({
    where: { id: params.id },
    include: { tags: true },
  });

  if (!problem) notFound();

  const initialValues = {
    title: problem.title,
    url: problem.url,
    platform: problem.platform,
    platformProblemId: problem.platformProblemId,
    platformDifficulty: problem.platformDifficulty ?? '',
    normalizedDiff: problem.normalizedDiff,
    simplifiedStatement: problem.simplifiedStatement,
    reviewTakeaways: problem.reviewTakeaways ?? '',
    tags: problem.tags.map((t) => t.name).join(', '),
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-blue-600">Update</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Edit problem</h1>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <EditProblemClient problemId={params.id} initialValues={initialValues} />
      </div>
    </main>
  );
}
