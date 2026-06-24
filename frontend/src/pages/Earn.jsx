import React, { useState } from 'react';
import { HandCoins, ChartBar, Lightning, Lock, X } from '@phosphor-icons/react';
import { toast } from 'sonner';

const pools = [
  { id: 1, name: "JI Staking", apr: "12.5%", tvl: "$4.2M", icon: Lightning, color: "text-[#FF4500]", min: 10, token: "JI" },
  { id: 2, name: "JI-ETH LP",  apr: "42.1%", tvl: "$1.8M", icon: ChartBar,  color: "text-blue-400",   min: 0.01, token: "JI-ETH" },
  { id: 3, name: "DAO Governance", apr: "5.0%", tvl: "$12.4M", icon: Lock, color: "text-purple-400", min: 100, token: "JI" },
];

function StakeModal({ pool, onClose }) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleStake = () => {
    if (!amount || isNaN(amount) || Number(amount) < pool.min) {
      toast.error(`Minimum stake is ${pool.min} ${pool.token}`);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      toast.success(`Successfully staked ${amount} ${pool.token} in ${pool.name}!`);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="panel bg-[var(--bg-panel)] p-8 w-full max-w-md relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20} /></button>
        <div className="font-display text-2xl uppercase text-[#FF4500] mb-1">{pool.name}</div>
        <div className="text-xs text-zinc-500 font-mono mb-6">APR: <span className="text-green-400">{pool.apr}</span> · TVL: {pool.tvl}</div>

        <label className="label-mini mb-2 block">Amount to Stake ({pool.token})</label>
        <input
          type="number"
          min={pool.min}
          placeholder={`Min. ${pool.min} ${pool.token}`}
          value={amount}
          onChange={e => setAmount(e.target.value)}
          className="input-field w-full mb-4"
        />

        <div className="text-xs text-zinc-500 mb-6">
          Estimated daily yield: <span className="text-green-400">
            {amount ? ((Number(amount) * parseFloat(pool.apr) / 100) / 365).toFixed(4) : '0.0000'} {pool.token}
          </span>
        </div>

        <button onClick={handleStake} disabled={loading} className="btn-primary w-full">
          {loading ? 'Staking...' : `Stake ${pool.token}`}
        </button>
      </div>
    </div>
  );
}

export default function EarnPage() {
  const [selected, setSelected] = useState(null);

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
                <button onClick={() => setSelected(pool)} className="btn-primary self-center px-8">Stake</button>
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

      {selected && <StakeModal pool={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
