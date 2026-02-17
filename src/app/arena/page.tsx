import Link from 'next/link';
import { PizzaPassMint } from '@/components/PizzaPassMint';
import { ReflexGame } from '@/components/ReflexGame';
import { PizzaOrderDashboard } from '@/components/PizzaOrderDashboard';
import { PredictionMarket } from '@/components/PredictionMarket';
import { LiveStats } from '@/components/LiveStats';
import { ConnectButton } from '@/components/ConnectButton';

export default function ArenaPage() {
  return (
    <div className="bg-background-light dark:bg-background-dark text-white min-h-screen">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-primary/20 bg-background-dark/80 backdrop-blur-md px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary p-1.5 rounded-sm">
              <span className="text-black font-bold">⚡</span>
            </div>
            <h1 className="text-xl font-bold tracking-tighter text-white">
              MONAD <span className="text-primary">BLITZ</span> ARENA <span className="ml-2">🍕⚡</span>
            </h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-primary font-bold">
                Pizza Pass Status
              </span>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <div className="w-3 h-3 bg-primary rounded-full" />
                  <div className="w-3 h-3 bg-primary rounded-full" />
                </div>
                <span className="text-sm font-bold text-white">LIVE</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-primary/20" />
            <ConnectButton />
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 grid grid-cols-12 gap-6">
        {/* Left Sidebar: Arena Stats + Pizza Pass / Prediction */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-terminal-gray border border-primary/20 p-5 rounded relative overflow-hidden">
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              Arena Stats
            </h3>
            <LiveStats />
            <div className="mt-6 pt-6 border-t border-primary/10">
              <p className="text-[10px] uppercase font-bold text-primary/60 tracking-wider mb-2">
                Network Load (demo)
              </p>
              <div className="grid grid-cols-12 gap-1 h-8">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="bg-primary/40 h-full rounded-sm" />
                ))}
              </div>
            </div>
          </div>

          <div className="bg-primary/10 border border-primary/20 p-5 rounded space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">
              Pizza Pass Mint
            </h3>
            <PizzaPassMint />
          </div>

          <div className="bg-primary/10 border border-primary/20 p-5 rounded space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-[0.2em]">
              Prediction Market
            </h3>
            <PredictionMarket />
          </div>
        </aside>

        {/* Center: Reflex Challenge + Parallel Pizza Terminal */}
        <div className="col-span-12 lg:col-span-6 flex flex-col gap-6">
          {/* Reflex Challenge */}
          <div className="bg-terminal-gray border-2 border-primary/40 p-6 rounded relative overflow-hidden">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-xl font-bold italic tracking-tighter text-white uppercase">
                  REFLEX CHALLENGE
                </h2>
                <p className="text-xs text-primary/60 font-medium">
                  Earn glory for every sub-500ms reaction
                </p>
              </div>
              <div className="text-right">
                <span className="block text-[10px] font-bold text-primary uppercase">Current Tier</span>
                <span className="text-sm font-bold text-white">LEGENDARY BAKER</span>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-10 gap-8 relative">
              {/* Our actual ReflexGame wired to the contract */}
              <div className="rounded-full glow-green">
                <ReflexGame />
              </div>

              <div className="w-full">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm text-primary">🏆</span>
                  <span className="text-xs font-bold uppercase tracking-widest text-primary">
                    Live Leaderboard (demo copy)
                  </span>
                </div>
                <div className="bg-black/40 rounded border border-primary/10 overflow-hidden">
                  <table className="w-full text-left text-[11px] font-mono">
                    <tbody className="divide-y divide-primary/5">
                      <tr className="hover:bg-primary/5 transition-colors">
                        <td className="px-4 py-2 text-primary/60">01</td>
                        <td className="px-4 py-2 font-bold">PizzaWhale.mon</td>
                        <td className="px-4 py-2 text-neon-green font-bold">142ms</td>
                        <td className="px-4 py-2 text-right text-primary/40">2m ago</td>
                      </tr>
                      <tr className="hover:bg-primary/5 transition-colors bg-primary/5">
                        <td className="px-4 py-2 text-primary/60">02</td>
                        <td className="px-4 py-2 font-bold">You (wallet)</td>
                        <td className="px-4 py-2 text-neon-green font-bold">&lt; 500ms</td>
                        <td className="px-4 py-2 text-right text-primary/40">Just now</td>
                      </tr>
                      <tr className="hover:bg-primary/5 transition-colors">
                        <td className="px-4 py-2 text-primary/60">03</td>
                        <td className="px-4 py-2 font-bold">OvenMaster.mon</td>
                        <td className="px-4 py-2 text-neon-green font-bold">168ms</td>
                        <td className="px-4 py-2 text-right text-primary/40">5m ago</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Parallel Pizza Terminal */}
          <div className="flex-1 bg-black border border-primary/20 rounded relative flex flex-col min-h-[400px]">
            <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20 bg-terminal-gray">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-neon-green rounded-full" />
                <span className="text-[10px] font-bold tracking-widest text-white uppercase">
                  PARALLEL PIZZA TERMINAL
                </span>
              </div>
              <span className="text-[10px] font-mono text-primary/60">v1.0.4-LATEST</span>
            </div>
            <div className="p-4">
              {/* Use our dashboard for live orders inside the terminal shell */}
              <PizzaOrderDashboard />
            </div>
          </div>
        </div>

        {/* Right Sidebar: GhostSlice Wall + Promo (static demo content) */}
        <aside className="col-span-12 lg:col-span-3 space-y-6">
          <div className="bg-terminal-gray border border-primary/20 p-5 rounded">
            <h3 className="text-xs font-bold text-primary uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
              GhostSlice Wall
            </h3>
            <div className="space-y-4 text-sm">
              <div className="bg-black/40 border border-primary/10 p-4 rounded">
                <p className="font-medium mb-4 text-white/90 italic">
                  &quot;I like pineapple on pizza... and I don&apos;t care who knows it.&quot;
                </p>
              </div>
              <div className="bg-black/40 border border-primary/10 p-4 rounded">
                <p className="font-medium mb-4 text-white/90 italic">
                  &quot;Monad TPS is so fast I accidentally ordered 40 pizzas while testing a script.&quot;
                </p>
              </div>
            </div>
            <button className="w-full mt-6 py-3 border border-dashed border-primary/30 text-primary/60 text-[10px] uppercase font-bold tracking-widest hover:bg-primary/5 hover:text-primary transition-all rounded">
              Submit Anonymous Slice
            </button>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-transparent border border-primary/20 p-5 rounded">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-primary">🏅</span>
              <span className="text-xs font-bold uppercase text-white">Daily Prize Pool</span>
            </div>
            <div className="text-2xl font-black text-white">42,000 $CRUST</div>
            <p className="text-[10px] text-primary/60 mt-1 uppercase tracking-tight">Ends in 04H 21M 55S</p>
            <button className="w-full mt-4 bg-primary text-black font-bold py-2 rounded text-xs uppercase hover:bg-primary/80 transition-colors">
              Join Tournament
            </button>
          </div>
        </aside>
      </main>
    </div>
  );
}

