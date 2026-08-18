'use client';

import { useRouter } from 'next/navigation';
import { ProblemForm } from '@/components/ProblemForm';

export default function NewProblemPage() {
  const router = useRouter();

  const handleSubmit = async (values: any) => {
    const payload = {
      title: values.title,
      url: values.url,
      platform: values.platform,
      platformProblemId: values.platformProblemId,
      platformDifficulty: values.platformDifficulty,
      normalizedDiff: Number(values.normalizedDiff) || 5,
      simplifiedStatement: values.simplifiedStatement,
      reviewTakeaways: values.reviewTakeaways,
      tags: values.tags
        .split(',')
        .map((tag: string) => tag.trim())
        .filter(Boolean),
    };

    const response = await fetch('/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      alert(data.error || 'Erro ao criar problema.');
      return;
    }

    router.push('/');
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6">
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-blue-600">Create</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">New problem</h1>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <ProblemForm submitLabel="Create problem" onSubmit={handleSubmit} />
      </div>
    </main>
  );
}
