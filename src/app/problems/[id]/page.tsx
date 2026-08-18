import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { ProblemMarkdown } from '@/components/ProblemMarkdown';

export const dynamic = 'force-dynamic';

export default async function ProblemDetailPage({ params }: { params: { id: string } }) {
  const problem = await prisma.problem.findUnique({
    where: { id: params.id },
    include: { tags: true, attempts: true },
  });

  if (!problem) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm text-slate-500">
            <Link href="/" className="text-blue-600 hover:underline">Dashboard</Link>
            <span>›</span>
            <span>Detalhes</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{problem.title}</h1>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/problems/${problem.id}/edit`}
            className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
          >
            Editar
          </Link>
          <a
            href={problem.url}
            target="_blank"
            rel="noreferrer"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Abrir original
          </a>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{problem.platform}</span>
            {problem.platformProblemId ? <span className="rounded-full bg-blue-50 px-2.5 py-1 font-medium text-blue-700">#{problem.platformProblemId}</span> : null}
            <span className="rounded-full bg-purple-100 px-2.5 py-1 font-medium text-purple-700">Dificuldade {problem.normalizedDiff}/10</span>
            {problem.platformDifficulty ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">{problem.platformDifficulty}</span> : null}
          </div>

          <div className="mb-5 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold uppercase tracking-[0.08em] text-slate-500">URL</p>
            <a href={problem.url} className="break-all text-sm text-blue-600 hover:underline" target="_blank" rel="noreferrer">
              {problem.url}
            </a>
          </div>

          <div className="mb-6">
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Enunciado simplificado</h2>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-[15px] leading-7 text-slate-700">
              {problem.simplifiedStatement || 'Ainda não há enunciado simplificado.'}
            </div>
          </div>

          {problem.reviewTakeaways ? (
            <div className="mb-6">
              <h2 className="mb-3 text-lg font-semibold text-slate-900">Observações</h2>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                <ProblemMarkdown content={problem.reviewTakeaways} />
              </div>
            </div>
          ) : null}

          <div>
            <h2 className="mb-3 text-lg font-semibold text-slate-900">Tags</h2>
            <div className="flex flex-wrap gap-2">
              {problem.tags.length ? (
                problem.tags.map((tag) => (
                  <span key={tag.id} className="rounded-full bg-slate-100 px-2.5 py-1 text-sm font-medium text-slate-600">
                    {tag.name}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">Ainda sem tags.</span>
              )}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-slate-900">Tentativas</h2>
            <div className="space-y-4">
              {problem.attempts.length ? (
                problem.attempts.map((attempt) => (
                  <div key={attempt.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-slate-900">{attempt.title}</h3>
                      <span className="rounded-full bg-blue-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-blue-700">
                        {attempt.status}
                      </span>
                    </div>

                    {attempt.keyQuestions ? (
                      <div className="mb-2">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Perguntas</p>
                        <ProblemMarkdown content={attempt.keyQuestions} />
                      </div>
                    ) : null}

                    {attempt.keyObservation ? (
                      <div className="mb-2">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Observação</p>
                        <ProblemMarkdown content={attempt.keyObservation} />
                      </div>
                    ) : null}

                    {attempt.proofSketch ? (
                      <div className="mb-2">
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Rascunho da prova</p>
                        <ProblemMarkdown content={attempt.proofSketch} />
                      </div>
                    ) : null}

                    {attempt.notes ? (
                      <div>
                        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Notas</p>
                        <p className="text-sm leading-6 text-slate-600">{attempt.notes}</p>
                      </div>
                    ) : null}
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-500">Ainda não há tentativas registradas.</p>
              )}
            </div>
          </section>
        </aside>
      </div>
    </main>
  );
}
