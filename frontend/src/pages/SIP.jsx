import { useState, useEffect } from "react";
import { PiggyBank, CurrencyCircleDollar, TrendUp, TrendDown, CalendarBlank, Clock, ChartLine } from "@phosphor-icons/react";
import { toast } from "sonner";

const calculateSIPReturns = (amount, duration, expectedReturn) => {
  const monthlyRate = expectedReturn / 100 / 12;
  const months = duration;
  const totalInvested = amount * months;
  const futureValue = amount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
  const profit = futureValue - totalInvested;
  return { totalInvested, futureValue: Math.round(futureValue), profit: Math.round(profit) };
};

const getMarketTrend = () => {
  const trends = ["Bullish 📈", "Bearish 📉", "Sideways ↔️", "Volatile ⚡"];
  return trends[Math.floor(Math.random() * trends.length)];
};

const ASSETS = [
  { name: "Bitcoin", symbol: "BTC", price: 64231, change: 2.4, expectedReturn: 15 },
  { name: "Ethereum", symbol: "ETH", price: 3421, change: -0.8, expectedReturn: 12 },
  { name: "Solana", symbol: "SOL", price: 145.2, change: 4.5, expectedReturn: 18 },
  { name: "Ji Ledger", symbol: "JI", price: 1.42, change: 5.2, expectedReturn: 25 },
  { name: "Apple", symbol: "AAPL", price: 198.5, change: 1.2, expectedReturn: 10 },
  { name: "Tesla", symbol: "TSLA", price: 245.8, change: -1.5, expectedReturn: 14 },
];

const sampleSIPs = [
  { amount: 5000, freq: "Monthly", asset: "Bitcoin", duration: 12, start: "2025-06-01", expectedReturn: 15, activeMonths: 6 },
  { amount: 2000, freq: "Monthly", asset: "Ethereum", duration: 6, start: "2025-08-01", expectedReturn: 12, activeMonths: 4 },
  { amount: 1000, freq: "Weekly", asset: "Solana", duration: 3, start: "2025-11-01", expectedReturn: 18, activeMonths: 2 },
];

export default function SIPPage() {
  const [showForm, setShowForm] = useState(false);
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState("Monthly");
  const [asset, setAsset] = useState("Bitcoin");
  const [duration, setDuration] = useState("12");
  const [startDate, setStartDate] = useState("");
  const [sips, setSips] = useState(sampleSIPs);

  // Simulate monthly growth
  useEffect(() => {
    const interval = setInterval(() => {
      setSips(prev => prev.map(sip => ({
        ...sip,
        activeMonths: Math.min(sip.activeMonths + 1, sip.duration),
        expectedReturn: sip.expectedReturn + (Math.random() - 0.5) * 0.2,
      })));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const addSIP = (e) => {
    e.preventDefault();
    if (!startDate) {
      toast.error("Please select a start date");
      return;
    }
    const selectedAsset = ASSETS.find(a => a.name === asset);
    const newSip = {
      amount: parseFloat(amount),
      freq: frequency,
      asset,
      duration: parseInt(duration),
      start: startDate,
      expectedReturn: selectedAsset?.expectedReturn || 12,
      activeMonths: 0,
    };
    setSips([newSip, ...sips]);
    toast.success(`SIP started: ${asset} - ₹${amount}/${frequency}`);
    setShowForm(false);
    setAmount(""); setFrequency("Monthly"); setAsset("Bitcoin"); setDuration("12"); setStartDate("");
  };

  // Calculate totals
  const totalInvested = sips.reduce((sum, s) => sum + s.amount * Math.min(s.activeMonths || s.duration, s.duration), 0);
  const totalExpected = sips.reduce((sum, s) => {
    const { futureValue } = calculateSIPReturns(s.amount, s.duration, s.expectedReturn);
    return sum + futureValue;
  }, 0);
  const totalProfit = totalExpected - totalInvested;
  const currentValue = sips.reduce((sum, s) => {
    const monthsPassed = Math.min(s.activeMonths || 0, s.duration);
    const invested = s.amount * monthsPassed;
    const growth = invested * (s.expectedReturn / 100) * (monthsPassed / s.duration);
    return sum + invested + growth;
  }, 0);
  const currentProfit = currentValue - totalInvested;

  return (
    <div className="p-6 md:p-12">
      <div className="flex justify-between items-center">
        <div>
          <div className="label-mini">// SYSTEMATIC INVESTMENT PLAN</div>
          <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">SIP</h1>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">+ New SIP</button>
      </div>

      {showForm && (
        <form onSubmit={addSIP} className="mt-6 panel border-[#FF4500]/30 max-w-2xl">
          <div className="label-mini text-[#FF4500] mb-4">Create Systematic Investment Plan</div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-mini block mb-1">Investment Amount (₹)</label>
              <input className="input-field" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required placeholder="1000" min="100" />
            </div>
            <div>
              <label className="label-mini block mb-1">Frequency</label>
              <select className="input-field" value={frequency} onChange={(e) => setFrequency(e.target.value)}>
                <option>Daily</option><option>Weekly</option><option>Monthly</option>
              </select>
            </div>
            <div>
              <label className="label-mini block mb-1">Asset</label>
              <select className="input-field" value={asset} onChange={(e) => setAsset(e.target.value)}>
                {ASSETS.map(a => <option key={a.symbol}>{a.name}</option>)}
              </select>
            </div>
            <div>
              <label className="label-mini block mb-1">Duration (months)</label>
              <input className="input-field" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} required placeholder="12" min="1" max="120" />
            </div>
            <div className="col-span-2">
              <label className="label-mini block mb-1">Start Date</label>
              <input className="input-field" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
          </div>
          {amount && duration && (
            <div className="mt-4 p-4 bg-[#FF4500]/5 border border-[#FF4500]/20 rounded">
              <div className="text-xs text-zinc-500 mb-2">Projected Returns</div>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500">Investment:</span>
                  <span className="ml-2 font-mono">₹{(parseFloat(amount) * parseInt(duration)).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-zinc-500">Est. Returns:</span>
                  <span className="ml-2 font-mono text-green-400">@ {ASSETS.find(a => a.name === asset)?.expectedReturn || 12}%</span>
                </div>
                <div>
                  <span className="text-zinc-500">Expected Value:</span>
                  <span className="ml-2 font-mono text-[#FF4500]">
                    ₹{calculateSIPReturns(parseFloat(amount), parseInt(duration), ASSETS.find(a => a.name === asset)?.expectedReturn || 12).futureValue.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}
          <button className="btn-primary mt-4 w-full" type="submit">Start SIP</button>
        </form>
      )}

      {/* Market Overview */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
        {ASSETS.slice(0, 4).map(a => (
          <div key={a.symbol} className="panel py-3 px-4 text-center">
            <div className="text-xs font-bold">{a.symbol}</div>
            <div className="font-mono text-sm mt-1">₹{(a.price * 83).toLocaleString()}</div>
            <div className={`text-xs flex items-center justify-center gap-1 ${a.change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {a.change >= 0 ? <TrendUp size={10} /> : <TrendDown size={10} />}
              {a.change >= 0 ? "+" : ""}{a.change}%
            </div>
          </div>
        ))}
      </div>

      {/* Summary Cards */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="panel text-center">
          <div className="label-mini">Total Invested</div>
          <div className="font-display text-3xl mt-1 text-[#FF4500]">₹{totalInvested.toLocaleString()}</div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">Current Value</div>
          <div className={`font-display text-3xl mt-1 ${currentProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
            ₹{Math.round(currentValue).toLocaleString()}
          </div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">Profit / Loss</div>
          <div className={`font-display text-3xl mt-1 flex items-center justify-center gap-1 ${currentProfit >= 0 ? "text-green-400" : "text-red-400"}`}>
            {currentProfit >= 0 ? <TrendUp size={24} weight="bold" /> : <TrendDown size={24} weight="bold" />}
            {currentProfit >= 0 ? "+" : ""}₹{Math.round(currentProfit).toLocaleString()}
          </div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">Expected Value</div>
          <div className="font-display text-3xl mt-1 text-[#FF4500]">₹{totalExpected.toLocaleString()}</div>
        </div>
      </div>

      {/* Active SIPs */}
      <div className="mt-8">
        <div className="label-mini mb-4">Active SIP Plans</div>
        <div className="space-y-3">
          {sips.map((sip, i) => {
            const effectiveMonths = Math.min(sip.activeMonths || 0, sip.duration);
            const invested = sip.amount * effectiveMonths;
            const growth = invested * (sip.expectedReturn / 100) * (effectiveMonths / sip.duration);
            const currentVal = invested + growth;
            const monthlyReturn = sip.expectedReturn / 12;
            const progressPct = (effectiveMonths / sip.duration) * 100;
            return (
              <div key={i} className="panel hover:border-[#FF4500]/30 transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <PiggyBank size={32} weight="fill" className="text-[#FF4500]" />
                    <div>
                      <div className="font-bold uppercase">{sip.asset}</div>
                      <div className="text-xs text-zinc-500">{sip.freq} · {sip.duration} months · Since {sip.start}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono font-bold">₹{sip.amount}/{sip.freq === "Daily" ? "day" : sip.freq === "Weekly" ? "wk" : "mo"}</div>
                    <div className="text-xs text-zinc-500">Invested: ₹{invested.toLocaleString()}</div>
                  </div>
                  <div className="text-right min-w-[120px]">
                    <div className={`font-mono ${currentVal >= invested ? "text-green-400" : "text-red-400"}`}>₹{Math.round(currentVal).toLocaleString()}</div>
                    <div className={`text-xs flex items-center gap-1 justify-end ${currentVal >= invested ? "text-green-400" : "text-red-400"}`}>
                      <TrendUp size={12} weight="bold" />
                      {currentVal >= invested ? "+" : ""}{Math.round(growth).toLocaleString()} ({sip.expectedReturn.toFixed(1)}%)
                    </div>
                  </div>
                </div>
                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-zinc-500 mb-1">
                    <span>{effectiveMonths} of {sip.duration} months</span>
                    <span>{Math.round(progressPct)}% complete</span>
                  </div>
                  <div className="w-full h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                    <div className="h-full bg-[#FF4500] rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
                  </div>
                </div>
                <div className="mt-2 flex gap-2 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Clock size={10} /> Est. maturity: {(() => {
                    const start = new Date(sip.start);
                    start.setMonth(start.getMonth() + sip.duration);
                    return start.toLocaleDateString();
                  })()}</span>
                  <span className="flex items-center gap-1"><ChartLine size={10} /> Market: {getMarketTrend()}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}