import type { Metadata } from 'next';
import { Web3Provider } from '@/components/Web3Provider';
import './globals.css';

export const metadata: Metadata = {
  title: 'Monad Blitz Arena',
  description: 'High-energy Monad hackathon arcade dApp',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-purple-900 text-white">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}

