'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const QR_BASE = 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=10&data=';

export function LandingContent() {
  const [arenaUrl, setArenaUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setArenaUrl(`${window.location.origin}/arena`);
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-3xl w-full text-center space-y-8">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">
          Monad Blitz Arena
        </h1>
        <p className="text-lg md:text-2xl text-white/80">
          Interactive hackathon arcade dApp showcasing 1-second blocks, parallel
          execution, and 10k TPS on Monad.
        </p>

        {arenaUrl && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-white/70">Scan to enter the arena</p>
            <img
              src={`${QR_BASE}${encodeURIComponent(arenaUrl)}`}
              alt="QR code to arena"
              width={200}
              height={200}
              className="rounded-xl bg-white p-2"
            />
            <a
              href={arenaUrl}
              className="text-lg text-green-400 hover:text-green-300 underline"
            >
              {arenaUrl}
            </a>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-4 pt-4">
          <Link
            href="/arena"
            className="px-6 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-100 transition"
          >
            Enter Arena
          </Link>
          <Link
            href="/admin"
            className="px-6 py-3 rounded-full bg-white/10 text-white font-bold border border-white/30 hover:bg-white/20 transition"
          >
            Demo Control Panel
          </Link>
        </div>

        <p className="text-sm text-white/50 pt-4">
          Mint a Pizza Pass · Play the reflex game · Bet on winners · Watch live pizza orders
        </p>
      </div>
    </main>
  );
}
