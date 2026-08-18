'use client';

import { useRouter } from 'next/navigation';
import { ProblemForm, ProblemFormValues } from './ProblemForm';

export function EditProblemClient({
  problemId,
  initialValues,
}: {
  problemId: string;
  initialValues: Partial<ProblemFormValues>;
}) {
  const router = useRouter();

  const handleSubmit = async (values: ProblemFormValues) => {
    const response = await fetch(`/api/problems/${problemId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
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
          .map((tag) => tag.trim())
          .filter(Boolean),
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      alert(data.error || 'Erro ao atualizar o problema.');
      return;
    }

    router.push(`/problems/${problemId}`);
  };

  return (
    <ProblemForm
      initialValues={initialValues}
      submitLabel="Save changes"
      onSubmit={handleSubmit}
    />
  );
}
