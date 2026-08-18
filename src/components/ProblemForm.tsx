'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export type ProblemFormValues = {
  title: string;
  url: string;
  platform: string;
  platformProblemId: string;
  platformDifficulty: string;
  normalizedDiff: number;
  simplifiedStatement: string;
  reviewTakeaways: string;
  tags: string;
};

const defaultValues: ProblemFormValues = {
  title: '',
  url: '',
  platform: 'Codeforces',
  platformProblemId: '',
  platformDifficulty: '',
  normalizedDiff: 5,
  simplifiedStatement: '',
  reviewTakeaways: '',
  tags: '',
};

export function ProblemForm({
  initialValues,
  onSubmit,
  submitLabel,
}: {
  initialValues?: Partial<ProblemFormValues>;
  onSubmit: (values: ProblemFormValues) => Promise<void> | void;
  submitLabel: string;
}) {
  const [formData, setFormData] = useState<ProblemFormValues>({
    ...defaultValues,
    ...initialValues,
  });
  const [saving, setSaving] = useState(false);

  const tagSuggestions = useMemo(
    () => [
      'Math',
      'Greedy',
      'DP',
      'Graph',
      'Binary Search',
      'Geometry',
      'Data Structures',
      'Implementation',
      'Constructive',
    ],
    [],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSubmit(formData);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Título *</label>
          <input
            required
            value={formData.title}
            onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
            placeholder="E. Covering Points with Circles"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">URL *</label>
          <input
            required
            value={formData.url}
            onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
            placeholder="https://codeforces.com/contest/2225/problem/E"
          />
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Plataforma *</label>
          <select
            value={formData.platform}
            onChange={(e) => setFormData((prev) => ({ ...prev, platform: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
          >
            <option value="Codeforces">Codeforces</option>
            <option value="LeetCode">LeetCode</option>
            <option value="AtCoder">AtCoder</option>
            <option value="ICPC">ICPC</option>
            <option value="Other">Outro</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">ID do problema</label>
          <input
            value={formData.platformProblemId}
            onChange={(e) => setFormData((prev) => ({ ...prev, platformProblemId: e.target.value }))}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
            placeholder="2225E"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-semibold text-slate-700">Dificuldade (1-10)</label>
          <input
            type="number"
            min={1}
            max={10}
            value={formData.normalizedDiff}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                normalizedDiff: Number(e.target.value || 1),
              }))
            }
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Tags</label>
        <input
          value={formData.tags}
          onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
          placeholder="Math, Greedy, Geometry"
        />
        <div className="flex flex-wrap gap-2">
          {tagSuggestions.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  tags: prev.tags ? `${prev.tags}, ${tag}` : tag,
                }))
              }
              className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Dificuldade da plataforma</label>
        <input
          value={formData.platformDifficulty}
          onChange={(e) => setFormData((prev) => ({ ...prev, platformDifficulty: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
          placeholder="Div. 1 / 800 / Difícil"
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Enunciado simplificado</label>
        <textarea
          rows={6}
          value={formData.simplifiedStatement}
          onChange={(e) => setFormData((prev) => ({ ...prev, simplifiedStatement: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
          placeholder="Temos n pontos..."
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-semibold text-slate-700">Observações / aprendizados</label>
        <textarea
          rows={5}
          value={formData.reviewTakeaways}
          onChange={(e) => setFormData((prev) => ({ ...prev, reviewTakeaways: e.target.value }))}
          className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base shadow-sm outline-none transition focus:border-blue-400 focus:ring-3 focus:ring-blue-100"
          placeholder="Primeiro, percebi que..."
        />
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <Link href="/" className="text-sm font-medium text-slate-600 transition hover:text-slate-900">
          ← Voltar
        </Link>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  );
}
