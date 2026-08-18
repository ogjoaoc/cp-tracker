'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewProblemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    platform: 'Codeforces',
    platformProblemId: '',
    platformDifficulty: '',
    normalizedDiff: 5,
    simplifiedStatement: '',
    tags: '',
  });

  const [attempts, setAttempts] = useState([
    {
      title: '',
      status: 'AC',
      keyQuestions: '',
      keyObservation: '',
      proofSketch: '',
      heuristicsUsed: '',
      notes: '',
    },
  ]);

  const addAttempt = () => {
    setAttempts([
      ...attempts,
      {
        title: '',
        status: 'ABANDONED',
        keyQuestions: '',
        keyObservation: '',
        proofSketch: '',
        heuristicsUsed: '',
        notes: '',
      },
    ]);
  };

  const updateAttempt = (index: number, field: string, value: string) => {
    const next = [...attempts];
    next[index] = { ...next[index], [field]: value };
    setAttempts(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
      attempts: attempts.filter((a) => a.title.trim() !== ''),
    };

    const res = await fetch('/api/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push('/');
    } else {
      alert('Erro ao cadastrar o problema.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Adicionar Problema & Thought Process</h1>
        <Link href="/" className="text-sm text-blue-600 hover:underline">← Voltar</Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Título</label>
            <input
              required
              className="w-full border rounded p-2 text-sm"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="E. Covering Points with Circles"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">URL</label>
            <input
              required
              className="w-full border rounded p-2 text-sm"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              placeholder="https://codeforces.com/contest/..."
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Plataforma</label>
            <select
              className="w-full border rounded p-2 text-sm bg-white"
              value={formData.platform}
              onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
            >
              <option value="Codeforces">Codeforces</option>
              <option value="LeetCode">LeetCode</option>
              <option value="AtCoder">AtCoder</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">ID na Plataforma</label>
            <input
              className="w-full border rounded p-2 text-sm"
              value={formData.platformProblemId}
              onChange={(e) => setFormData({ ...formData, platformProblemId: e.target.value })}
              placeholder="2225E"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Dificuldade Normalizada (1-10)</label>
            <input
              type="number"
              min="1"
              max="10"
              className="w-full border rounded p-2 text-sm"
              value={formData.normalizedDiff}
              onChange={(e) => setFormData({ ...formData, normalizedDiff: Number(e.target.value) })}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Tags (separadas por vírgula)</label>
          <input
            className="w-full border rounded p-2 text-sm"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="Game Theory, Nim, Bitwise XOR"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase text-gray-600 mb-1">Enunciado Simplificado (Abstração)</label>
          <textarea
            rows={3}
            className="w-full border rounded p-2 text-sm font-mono"
            value={formData.simplifiedStatement}
            onChange={(e) => setFormData({ ...formData, simplifiedStatement: e.target.value })}
            placeholder="Temos N pilhas... Um movimento válido remove b_i com XOR = 0..."
          />
        </div>

        <hr className="my-6" />

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-700">Hipóteses / Linhas de Raciocínio</h2>
          <button
            type="button"
            onClick={addAttempt}
            className="text-xs bg-gray-100 hover:bg-gray-200 border px-3 py-1.5 rounded font-semibold"
          >
            + Adicionar Hipótese/Ideia
          </button>
        </div>

        {attempts.map((att, idx) => (
          <div key={idx} className="p-4 border rounded-md bg-gray-50 space-y-3">
            <div className="flex gap-3">
              <input
                required
                placeholder="Título da Ideia (Ex: Caracterizar valores via Sprague-Grundy)"
                className="flex-1 border rounded p-2 text-sm bg-white"
                value={att.title}
                onChange={(e) => updateAttempt(idx, 'title', e.target.value)}
              />
              <select
                className="border rounded p-2 text-sm bg-white font-semibold"
                value={att.status}
                onChange={(e) => updateAttempt(idx, 'status', e.target.value)}
              >
                <option value="AC">AC (Solução Final)</option>
                <option value="ABANDONED">No Solution / Abandonada</option>
                <option value="WA">WA / Incorreta</option>
                <option value="TLE">TLE / Complexidade Alta</option>
              </select>
            </div>

            <textarea
              rows={2}
              placeholder="Key Question (O que perguntei para mim mesmo?)"
              className="w-full border rounded p-2 text-sm bg-white"
              value={att.keyQuestions}
              onChange={(e) => updateAttempt(idx, 'keyQuestions', e.target.value)}
            />

            <textarea
              rows={2}
              placeholder="Key Observation (Qual fato invariante/redução percebi?)"
              className="w-full border rounded p-2 text-sm bg-white"
              value={att.keyObservation}
              onChange={(e) => updateAttempt(idx, 'keyObservation', e.target.value)}
            />

            <textarea
              rows={3}
              placeholder="Proof Sketch / Raciocínio Formal (Aceita Markdown e fórmulas LaTeX como $X \oplus Y = 0$)"
              className="w-full border rounded p-2 text-sm bg-white font-mono"
              value={att.proofSketch}
              onChange={(e) => updateAttempt(idx, 'proofSketch', e.target.value)}
            />
          </div>
        ))}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded transition"
        >
          Salvar Problema no Catálogo
        </button>
      </form>
    </div>
  );
}