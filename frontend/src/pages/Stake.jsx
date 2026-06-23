import { useState, useEffect } from "react";
import { Lock, Coins, CurrencyEth, Clock, ArrowCircleUp, ArrowCircleDown, ChartLine } from "@phosphor-icons/react";
import { toast } from "sonner";

const STAKING_OPTIONS = [
  { asset: "JI Token", symbol: "JI", apy: 12.5, lockPeriod: "30 days", minStake: 100, color: "#FF4500" },
  { asset: "Ethereum", symbol: "ETH", apy: 8.2, lockPeriod: "60 days", minStake: 0.1, color: "#8c8cff" },
  { asset: "Solana", symbol: "SOL", apy: 6.8, lockPeriod: "30 days", minStake: 1, color: "#22c55e" },
  { asset: "Bitcoin", symbol: "BTC", apy: 4.5, lockPeriod: "90 days", minStake: 0.01, color: "#eab308" },
];

export default function StakePage() {
  const [stakes, setStakes] = useState([
    { asset: "JI Token", amount: 500, apy: 12.5, rewards: 15.2, startDate: new Date(Date.now() - 15 * 86400000).toISOString(), lockDays: 30 },
    { asset: "Ethereum", amount: 0.5, apy: 8.2, rewards: 0.012, startDate: new Date(Date.now() - 5 * 86400000).toISOString(), lockDays: 60 },
  ]);
  const [showStake, setShowStake] = useState(null);
  const [amount, setAmount] = useState("");
  const [rewardHistory, setRewardHistory] = useState([]);

  // Simulate reward accumulation
  useEffect(() => {
    const interval = setInterval(() => {
      setStakes(prev => prev.map(s => ({
        ...s,
        rewards: s.rewards + (s.amount * s.apy / 100 / 365) * (Math.random() * 0.5 + 0.75),
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStake = (opt) => {
    if (!amount || parseFloat(amount) <= 0) {
      toast.error("Enter a valid amount");
      return;
    }
    if (parseFloat(amount) < opt.minStake) {
      toast.error(`Minimum stake is ${opt.minStake} ${opt.symbol}`);
      return;
    }
    const lockDays = parseInt(opt.lockPeriod);
    setStakes([...stakes, { 
      asset: opt.asset, 
      amount: parseFloat(amount), 
      apy: opt.apy, 
      rewards: 0,
      startDate: new Date().toISOString(),
      lockDays,
    }]);
    toast.success(`Staked ${amount} ${opt.symbol}`);
    setShowStake(null);
    setAmount("");
  };

  const handleUnstake = (index) => {
    const stake = stakes[index];
    const start = new Date(stake.startDate);
    const now = new Date();
    const daysStaked = Math.floor((now - start) / 86400000);
    if (daysStaked < stake.lockDays) {
      toast.error(`Lock period not over. ${stake.lockDays - daysStaked} days remaining`);
      return;
    }
    setStakes(stakes.filter((_, i) => i !== index));
    setRewardHistory([...rewardHistory, { 
      asset: stake.asset, 
      amount: stake.amount, 
      rewards: stake.rewards, 
      date: now.toISOString() 
    }]);
    toast.success(`Unstaked ${stake.amount} ${stake.asset} + ${stake.rewards.toFixed(4)} rewards`);
  };

  const totalStaked = stakes.reduce((sum, s) => sum + s.amount, 0);
  const totalRewards = stakes.reduce((sum, s) => sum + s.rewards, 0);

  return (
    <div className="p-6 md:p-12">
      <div className="label-mini">// STAKING</div>
      <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">Stake</h1>

      {/* Summary */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="panel text-center">
          <div className="label-mini">Total Staked</div>
          <div className="font-display text-2xl mt-1 text-[#FF4500]">{totalStaked.toFixed(2)}</div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">Total Rewards</div>
          <div className="font-display text-2xl mt-1 text-green-400">+{totalRewards.toFixed(4)}</div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">Active Stakes</div>
          <div className="font-display text-2xl mt-1">{stakes.length}</div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">Est. Annual Yield</div>
          <div className="font-display text-2xl mt-1 text-green-400">
            {stakes.length > 0 ? (stakes.reduce((sum, s) => sum + s.amount * s.apy / 100, 0)).toFixed(2) : "0.00"}
          </div>
        </div>
      </div>

      {/* Staking Options */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        {STAKING_OPTIONS.map((opt) => (
          <div key={opt.symbol} className="panel hover:border-[#FF4500]/30 transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <Lock size={24} weight="fill" style={{ color: opt.color }} />
              <div>
                <div className="font-bold">{opt.asset}</div>
                <div className="text-xs text-zinc-500">{opt.symbol}</div>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-zinc-500">APY</span><span className="text-green-400 font-bold">{opt.apy}%</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Lock Period</span><span>{opt.lockPeriod}</span></div>
              <div className="flex justify-between"><span className="text-zinc-500">Min Stake</span><span>{opt.minStake} {opt.symbol}</span></div>
            </div>
            <button onClick={() => setShowStake(opt)} className="btn-primary w-full mt-4 text-sm">Stake Now</button>
          </div>
        ))}
      </div>

      {/* Stake Form */}
      {showStake && (
        <div className="mt-6 panel border-[#FF4500]/30 max-w-md">
          <div className="label-mini text-[#FF4500] mb-3">Stake {showStake.asset}</div>
          <input className="input-field" type="number" placeholder={`Amount (min ${showStake.minStake} ${showStake.symbol})`} value={amount} onChange={(e) => setAmount(e.target.value)} />
          <div className="flex justify-between text-xs text-zinc-500 mt-2">
            <span>Est. Daily Reward: {((parseFloat(amount) || 0) * showStake.apy / 100 / 365).toFixed(4)} {showStake.symbol}</span>
            <span>Est. Monthly: {((parseFloat(amount) || 0) * showStake.apy / 100 / 12).toFixed(4)} {showStake.symbol}</span>
          </div>
          <div className="flex gap-2 mt-4">
            <button onClick={() => handleStake(showStake)} className="btn-primary flex-1">Confirm Stake</button>
            <button onClick={() => setShowStake(null)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Active Stakes */}
      <div className="mt-8">
        <div className="label-mini mb-4">Your Active Stakes</div>
        {stakes.length === 0 ? (
          <div className="panel text-zinc-500 text-center">No active stakes</div>
        ) : (
          <div className="space-y-2">
            {stakes.map((s, i) => {
              const start = new Date(s.startDate);
              const now = new Date();
              const daysStaked = Math.floor((now - start) / 86400000);
              const daysRemaining = Math.max(0, s.lockDays - daysStaked);
              const progressPct = Math.min(100, (daysStaked / s.lockDays) * 100);
              const isUnlockable = daysStaked >= s.lockDays;
              return (
                <div key={i} className="panel hover:border-[#FF4500]/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Coins size={24} weight="fill" className="text-[#FF4500]" />
                      <div>
                        <div className="font-bold">{s.asset}</div>
                        <div className="text-xs text-zinc-500">{s.amount} staked · {s.apy}% APY</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-green-400 font-mono">+{s.rewards.toFixed(4)} rewards</div>
                      <div className="text-xs text-zinc-500">Est. daily: {(s.amount * s.apy / 100 / 365).toFixed(4)}</div>
                    </div>
                  </div>
                  {/* Lock period progress */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-zinc-500 mb-1">
                      <span className="flex items-center gap-1"><Clock size={10} /> {daysStaked}d / {s.lockDays}d</span>
                      <span className={isUnlockable ? "text-green-400" : ""}>
                        {isUnlockable ? "Unlocked ✓" : `${daysRemaining}d remaining`}
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-500 ${isUnlockable ? "bg-green-500" : "bg-[#FF4500]"}`} 
                        style={{ width: `${progressPct}%` }} />
                    </div>
                  </div>
                  {isUnlockable && (
                    <button onClick={() => handleUnstake(i)} className="btn-secondary mt-3 w-full text-xs">
                      <ArrowCircleUp size={14} className="inline mr-1" /> Unstake & Claim Rewards
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Reward History */}
      {rewardHistory.length > 0 && (
        <div className="mt-8">
          <div className="label-mini mb-4">Reward History</div>
          <div className="space-y-2">
            {rewardHistory.map((r, i) => (
              <div key={i} className="panel flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <ChartLine size={20} className="text-green-400" />
                  <div>
                    <div className="font-bold">{r.asset}</div>
                    <div className="text-xs text-zinc-500">{new Date(r.date).toLocaleDateString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-green-400 font-mono">+{r.rewards.toFixed(4)} rewards</div>
                  <div className="text-xs text-zinc-500">{r.amount} unstaked</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}