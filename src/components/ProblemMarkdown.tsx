'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';

export function ProblemMarkdown({ content }: { content?: string | null }) {
  if (!content) return null;

  return (
    <div className="markdown-content text-[15px] leading-7 text-slate-700">
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{content}</ReactMarkdown>
    </div>
  );
}
