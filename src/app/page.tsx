'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { DeleteProblemButton } from '@/components/DeleteProblemButton';

export default function DashboardPage() {
  const [problems, setProblems] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [platform, setPlatform] = useState('all');
  const [tag, setTag] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const response = await fetch('/api/problems');
        const data = await response.json();
        setProblems(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(error);
        setProblems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProblems();
  }, []);

  const platforms = useMemo(
    () => [...new Set(problems.map((problem) => problem.platform))],
    [problems],
  );

  const tagsList = useMemo(
    () => [...new Set(problems.flatMap((problem) => problem.tags.map((item: any) => item.name)))],
    [problems],
  );

  const filteredProblems = useMemo(() => {
    return problems.filter((problem) => {
      const matchesSearch =
        !search ||
        problem.title.toLowerCase().includes(search.toLowerCase()) ||
        problem.platform.toLowerCase().includes(search.toLowerCase()) ||
        problem.tags.some((item: any) => item.name.toLowerCase().includes(search.toLowerCase()));

      const matchesPlatform = platform === 'all' || problem.platform === platform;
      const matchesTag = tag === 'all' || problem.tags.some((item: any) => item.name === tag);

      return matchesSearch && matchesPlatform && matchesTag;
    });
  }, [problems, search, platform, tag]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur-sm">
        <div className="mb-5 flex flex-col gap-4 border-b border-slate-200 pb-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Painel Admin</h1>
            <p className="mt-1 text-sm text-slate-500">Gerenciamento e documentação de problemas e ideias de programação competitiva</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/problems/new" className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">
              + Adicionar problema
            </Link>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 pb-3 text-sm font-medium">
          {['Problemas', 'Tags', 'Plataformas', 'Hierarquias'].map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={`rounded-full px-3 py-1.5 ${index === 0 ? 'border-b-2 border-blue-500 text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-900">Problemas</h2>
        </div>

        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-3">
          <div className="grid gap-3 md:grid-cols-[1.4fr_0.8fr_0.8fr]">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Pesquisar por título, tag ou plataforma"
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none ring-0 focus:border-blue-400"
            />

            <select
              value={platform}
              onChange={(event) => setPlatform(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
            >
              <option value="all">Todas as plataformas</option>
              {platforms.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>

            <select
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-400"
            >
              <option value="all">Todas as tags</option>
              {tagsList.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mb-4 flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            Mostrando {filteredProblems.length} de {problems.length}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">Apenas bons</button>
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">Primeiro</button>
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">Anterior</button>
            <span className="rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 font-semibold text-slate-800">Página 1 / 1</span>
            <button type="button" className="rounded-lg border border-slate-200 bg-white px-3 py-1.5">Próximo</button>
          </div>
        </div>

        <div className="space-y-4">
          {loading ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-6 py-10 text-center text-slate-500">Carregando problemas...</div>
          ) : filteredProblems.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-6 py-14 text-center text-slate-500">
              Nenhum problema encontrado. Clique em <Link href="/problems/new" className="font-semibold text-blue-600">adicionar</Link> para começar.
            </div>
          ) : (
            filteredProblems.map((problem) => (
              <article key={problem.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <span className="text-2xl font-bold tracking-tight text-slate-900">{problem.platformProblemId ? `${problem.platformProblemId}. ` : ''}{problem.title}</span>
                    </div>

                    <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium">{problem.platform}</span>
                      <span className="rounded-full bg-purple-100 px-2.5 py-1 font-medium text-purple-700">Dificuldade {problem.normalizedDiff}/10</span>
                      {problem.platformDifficulty ? <span className="rounded-full bg-emerald-100 px-2.5 py-1 font-medium text-emerald-700">{problem.platformDifficulty}</span> : null}
                    </div>

                    <a href={problem.url} target="_blank" rel="noreferrer" className="block break-all text-sm text-blue-600 hover:underline">
                      {problem.url}
                    </a>

                    {problem.simplifiedStatement ? (
                      <p className="mt-3 max-w-4xl text-sm leading-6 text-slate-600">{problem.simplifiedStatement}</p>
                    ) : null}

                    <div className="mt-3 flex flex-wrap gap-2">
                      {problem.tags.map((tag: any) => (
                        <span key={tag.id} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                          {tag.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-row gap-2 xl:flex-col">
                    <Link href={`/problems/${problem.id}`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      Abrir
                    </Link>
                    <Link href={`/problems/${problem.id}/edit`} className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">
                      Editar
                    </Link>
                    <DeleteProblemButton problemId={problem.id} />
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </main>
  );
}