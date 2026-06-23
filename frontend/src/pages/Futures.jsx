import React, { useState, useEffect } from 'react';
import { TrendUp, Info, ShieldCheck, ArrowsLeftRight } from '@phosphor-icons/react';
import { toast } from 'sonner';
import api from "@/lib/api";

export default function FuturesPage() {
    const [leverage, setLeverage] = useState(10);
    const [mode, setMode] = useState('long');
    const [amount, setAmount] = useState('');
    const [wallets, setWallets] = useState([]);
    const [busy, setBusy] = useState(false);

    useEffect(() => {
        api.get("/wallet/me").then(r => setWallets(r.data.wallets));
    }, []);

    const primary = wallets[0];

    const handleOpenPosition = async (e) => {
        e.preventDefault();
        if (!amount || parseFloat(amount) <= 0) return toast.error("Invalid amount");
        if (primary && parseFloat(amount) > primary.balance) return toast.error("Insufficient margin");

        setBusy(true);
        setTimeout(() => {
            toast.success(`${mode.toUpperCase()} Position opened at ${leverage}x leverage`);
            setAmount('');
            setBusy(false);
        }, 1500);
    };

    return (
        <div className="p-6 md:p-12">
            <div className="label-mini">// DERIVATIVES ENGINE</div>
            <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500] flex items-center gap-4">
                <TrendUp size={48} weight="bold" /> Futures
            </h1>

            <div className="grid lg:grid-cols-3 gap-8 mt-10">
                {/* Trading Panel */}
                <div className="panel bg-[var(--bg-panel)] p-6 space-y-6">
                    <div className="flex bg-[var(--bg-primary)]/10 p-1 border border-[var(--border-color)] rounded">
                        <button
                            className={`flex-1 py-2 font-display text-lg uppercase transition-all ${mode === 'long' ? 'bg-green-500 text-black' : 'text-zinc-500'}`}
                            onClick={() => setMode('long')}
                        >Long</button>
                        <button
                            className={`flex-1 py-2 font-display text-lg uppercase transition-all ${mode === 'short' ? 'bg-red-500 text-black' : 'text-zinc-500'}`}
                            onClick={() => setMode('short')}
                        >Short</button>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="label-mini">Leverage</label>
                            <span className="text-[#FF4500] font-mono font-bold">{leverage}x</span>
                        </div>
                        <input
                            type="range" min="2" max="100" step="1"
                            className="w-full accent-[#FF4500] bg-[#1a1a1a]"
                            value={leverage} onChange={(e) => setLeverage(e.target.value)}
                        />
                        <div className="flex justify-between text-[10px] text-zinc-600 mt-1 font-mono uppercase">
                            <span>2x</span><span>25x</span><span>50x</span><span>100x</span>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-2">
                            <label className="label-mini">Margin (JI)</label>
                            <span className="text-[10px] text-zinc-500 uppercase font-mono">
                                Avail: {primary?.balance.toFixed(2) || '0.00'}
                            </span>
                        </div>
                        <input
                            className="input-field font-mono"
                            type="number" placeholder="0.00"
                            value={amount} onChange={(e) => setAmount(e.target.value)}
                        />
                    </div>

                    <div className="bg-[var(--bg-primary)]/10 border border-[var(--border-color)] p-4 space-y-2 text-xs font-mono text-[var(--text-primary)]">
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Liq. Price</span>
                            <span className="text-white">$1.2401</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-zinc-500">Position Size</span>
                            <span className="text-white">{(parseFloat(amount || 0) * leverage).toFixed(2)} JI</span>
                        </div>
                    </div>

                    <button
                        onClick={handleOpenPosition}
                        className={`w-full py-4 font-display text-2xl uppercase ${mode === 'long' ? 'btn-primary' : 'bg-red-500 text-black'}`}
                        disabled={busy}
                    >
                        {busy ? "Confirming..." : `Open ${mode}`}
                    </button>
                </div>

                {/* Positions and Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="panel bg-[var(--bg-panel)] p-6 h-full min-h-[400px]">
                        <div className="label-mini mb-6 text-[#FF4500]">Open Positions (0)</div>
                        <div className="flex flex-col items-center justify-center h-64 text-center">
                            <Info size={40} className="text-zinc-700 mb-4" />
                            <p className="text-zinc-500 font-mono text-sm uppercase">No active leveraged positions detected</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="panel p-4 flex items-center gap-4 bg-green-500/5 border-green-500/20">
                            <ShieldCheck size={32} className="text-green-500" />
                            <div>
                                <div className="text-[10px] text-zinc-500 uppercase">Insurance Fund</div>
                                <div className="font-display text-xl">$1,402,900</div>
                            </div>
                        </div>
                        <div className="panel p-4 flex items-center gap-4 bg-blue-500/5 border-blue-500/20">
                            <ArrowsLeftRight size={32} className="text-blue-500" />
                            <div>
                                <div className="text-[10px] text-zinc-500 uppercase">Next Funding</div>
                                <div className="font-display text-xl">00:42:10</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}