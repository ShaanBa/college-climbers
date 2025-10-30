'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Home() {
  const [query, setQuery] = useState('');
  const [player, setPlayer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!query.includes('#')) {
      setError('Use format: name#tag');
      return;
    }

    setLoading(true);
    setError('');
    setPlayer(null);

    try {
      const res = await fetch(`/api/summoner?name=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (!res.ok) throw new Error(data || 'Player not found');

      setPlayer(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
      <main className="w-full max-w-md space-y-8 text-center">
        <h1 className="text-4xl font-bold text-black dark:text-white">
          College Climbers
        </h1>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Doublelift#NA1"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && search()}
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-black dark:bg-zinc-800 dark:text-white"
          />
          <button
            onClick={search}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? '...' : 'Search'}
          </button>
        </div>

        {error && <p className="text-red-500">{error}</p>}

        {player && (
          <div className="space-y-4 rounded-xl bg-white p-6 shadow-lg dark:bg-zinc-900">
            <Image
              src={player.icon}
              alt="Profile icon"
              width={100}
              height={100}
              className="mx-auto rounded-full"
            />
            <div>
              <p className="text-2xl font-bold text-black dark:text-white">{player.name}</p>
              <p className="text-lg text-gray-600 dark:text-gray-400">Level {player.level}</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}