import React from 'react';
import { HandCoins, ChartBar, Lightning, Lock } from '@phosphor-icons/react';
import { toast } from 'sonner';

export default function EarnPage() {
    const pools = [
        { id: 1, name: "JI Staking", apr: "12.5%", tvl: "$4.2M", icon: Lightning, color: "text-[#FF4500]" },
        { id: 2, name: "JI-ETH LP", apr: "42.1%", tvl: "$1.8M", icon: ChartBar, color: "text-blue-400" },
        { id: 3, name: "DAO Governance", apr: "5.0%", tvl: "$12.4M", icon: Lock, color: "text-purple-400" }
    ];

    return (
        <div className="p-6 md:p-12">
            <div className="label-mini">// YIELD PROTOCOL</div>
            <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500] flex items-center gap-4">
                <HandCoins size={48} weight="bold" /> Earn
            </h1>

            <div className="grid lg:grid-cols-3 gap-6 mt-10">
                <div className="lg:col-span-2 space-y-6">
                    {pools.map(pool => (
                        <div key={pool.id} className="panel bg-[var(--bg-panel)] p-6 flex flex-col md:flex-row justify-between items-center gap-6 hover:border-[#FF4500] transition-all text-[var(--text-primary)]">
                            <div className="flex items-center gap-6">
                                <div className={`p-4 bg-[var(--bg-primary)]/10 rounded border border-[var(--border-color)] ${pool.color}`}>
                                    <pool.icon size={32} />
                                </div>
                                <div>
                                    <div className="font-display text-2xl uppercase tracking-wider">{pool.name}</div>
                                    <div className="text-zinc-500 text-xs font-mono">TVL: {pool.tvl}</div>
                                </div>
                            </div>
                            <div className="flex gap-10 text-right">
                                <div>
                                    <div className="label-mini">Estimated APR</div>
                                    <div className="text-green-400 font-display text-3xl">{pool.apr}</div>
                                </div>
                                <button
                                    onClick={() => toast.success(`Redirecting to ${pool.name} pool...`)}
                                    className="btn-primary self-center px-8"
                                >Stake</button>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="space-y-6">
                    <div className="panel bg-[var(--bg-panel)] p-6 border-dashed">
                        <div className="label-mini mb-4 text-[#FF4500]">Your Rewards</div>
                        <div className="text-5xl font-display mb-2">0.00 JI</div>
                        <div className="text-zinc-500 text-xs font-mono mb-6">~ $0.00 USD</div>
                        <button className="btn-ghost w-full opacity-50 cursor-not-allowed" disabled>Claim Rewards</button>
                    </div>
                    <div className="panel p-6 bg-[var(--bg-panel)]">
                        <h3 className="font-bold uppercase text-xs mb-3 tracking-widest text-[#FF4500]">Protocol Health</h3>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                            The Ji Ledger Earn protocol utilizes isolated liquidity pools to ensure maximum security for stakers. APR is dynamically adjusted based on block emission rates.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}