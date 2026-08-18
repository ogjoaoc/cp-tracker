'use client';

import { useRouter } from 'next/navigation';

export function DeleteProblemButton({ problemId }: { problemId: string }) {
  const router = useRouter();

  const handleDelete = async () => {
    const confirmed = window.confirm('Tem certeza que deseja excluir este problema?');
    if (!confirmed) return;

    const response = await fetch(`/api/problems/${problemId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      alert('Erro ao excluir o problema.');
      return;
    }

    router.push('/');
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100"
    >
      Excluir
    </button>
  );
}
