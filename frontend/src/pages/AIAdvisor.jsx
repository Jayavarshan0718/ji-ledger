import { useState } from "react";
import { Robot, Lightbulb, ChartLineUp, ShieldCheck, Newspaper, TrendUp, TrendDown } from "@phosphor-icons/react";

const NEWS_ITEMS = [
  { asset: "Bitcoin", change: "+4.2%", sentiment: "positive", text: "BTC breaks $68K as institutional inflows surge" },
  { asset: "Ethereum", change: "+2.1%", sentiment: "positive", text: "ETH 2.0 staking reaches 35M ETH milestone" },
  { asset: "NIFTY", change: "-0.8%", sentiment: "negative", text: "Markets dip on global trade concerns" },
  { asset: "Solana", change: "+5.6%", sentiment: "positive", text: "SOL network activity hits all-time high" },
  { asset: "Tesla", change: "-1.5%", sentiment: "negative", text: "TSLA faces production slowdown concerns" },
  { asset: "Gold", change: "+0.8%", sentiment: "positive", text: "Gold prices rise as safe-haven demand grows" },
];

const getRecommendation = (age, amount, risk, goal) => {
  const plans = {
    low: {
      allocation: [
        { name: "Stocks (Index Funds)", pct: 50, color: "#3b82f6" },
        { name: "Gold", pct: 20, color: "#eab308" },
        { name: "Bonds", pct: 20, color: "#22c55e" },
        { name: "Cash", pct: 10, color: "#a855f7" },
      ],
      score: 85,
      suggestions: [
        "Conservative portfolio — capital preservation focus",
        "50% in diversified index funds (NIFTY 50 / S&P 500)",
        "20% Gold as inflation hedge",
        "20% Government bonds for stable returns",
        "10% Cash for liquidity & emergencies",
      ],
    },
    medium: {
      allocation: [
        { name: "Stocks", pct: 50, color: "#3b82f6" },
        { name: "Crypto", pct: 20, color: "#FF4500" },
        { name: "Gold", pct: 20, color: "#eab308" },
        { name: "Cash", pct: 10, color: "#a855f7" },
      ],
      score: 78,
      suggestions: [
        "Balanced portfolio — growth with moderate risk",
        "50% Stocks — large cap + tech companies",
        "20% Crypto (Bitcoin 12% + Ethereum 8%)",
        "20% Gold as portfolio hedge",
        "10% Cash — emergency fund & opportunities",
      ],
    },
    high: {
      allocation: [
        { name: "Stocks", pct: 50, color: "#3b82f6" },
        { name: "Crypto", pct: 20, color: "#FF4500" },
        { name: "Gold", pct: 20, color: "#eab308" },
        { name: "Cash", pct: 10, color: "#a855f7" },
      ],
      score: 72,
      suggestions: [
        "Aggressive portfolio — high growth potential",
        "50% Stocks — growth stocks + mid-cap opportunities",
        "20% Crypto — Bitcoin 10%, Ethereum 7%, Solana 3%",
        "20% Gold as volatility hedge",
        "10% Cash — ready for market dips",
        "Set stop-loss at 15% for crypto positions",
      ],
    },
  };
  return plans[risk] || plans.medium;
};

export default function AIAdvisorPage() {
  const [age, setAge] = useState("30");
  const [amount, setAmount] = useState("50000");
  const [risk, setRisk] = useState("medium");
  const [goal, setGoal] = useState("retirement");
  const [showResult, setShowResult] = useState(false);

  const advice = showResult ? getRecommendation(age, amount, risk, goal) : { allocation: [], score: 0, suggestions: [] };

  return (
    <div className="p-6 md:p-12">
      <div className="label-mini">// AI INVESTMENT ADVISOR</div>
      <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500] flex items-center gap-4">
        <Robot size={48} weight="bold" /> AI Advisor
      </h1>

      {/* Market News Summary */}
      <div className="mt-6 panel bg-[#FF4500]/5 border-[#FF4500]/20">
        <div className="label-mini mb-4 flex items-center gap-2">
          <Newspaper size={16} className="text-[#FF4500]" /> Today's Market Summary
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {NEWS_ITEMS.map((news, i) => (
            <div key={i} className="flex items-start gap-2 p-2 bg-[var(--bg-primary)] rounded">
              <div className={`text-xs font-bold px-1 py-0.5 rounded ${news.sentiment === "positive" ? "text-green-400 bg-green-400/10" : "text-red-400 bg-red-400/10"}`}>
                {news.change}
              </div>
              <div>
                <div className="text-xs font-bold">{news.asset}</div>
                <div className="text-[10px] text-zinc-500">{news.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <div className="panel">
          <div className="label-mini mb-4">Your Profile</div>
          <div className="space-y-4">
            <div>
              <label className="label-mini block mb-1">Age</label>
              <input className="input-field" type="number" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
            <div>
              <label className="label-mini block mb-1">Investment Amount ($)</label>
              <input className="input-field" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />
            </div>
            <div>
              <label className="label-mini block mb-1">Risk Level</label>
              <select className="input-field" value={risk} onChange={(e) => setRisk(e.target.value)}>
                <option value="low">Low — Conservative</option>
                <option value="medium">Medium — Balanced</option>
                <option value="high">High — Aggressive</option>
              </select>
            </div>
            <div>
              <label className="label-mini block mb-1">Goal</label>
              <select className="input-field" value={goal} onChange={(e) => setGoal(e.target.value)}>
                <option value="retirement">Retirement (20+ years)</option>
                <option value="wealth">Wealth Building (5-10 years)</option>
                <option value="income">Passive Income (short-term)</option>
              </select>
            </div>
            <button className="btn-primary w-full" onClick={() => setShowResult(true)}>
              <Robot size={18} className="inline mr-2" /> Get AI Recommendation
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {showResult && (
            <>
              <div className="panel">
                <div className="label-mini mb-4 flex items-center gap-2">
                  <ChartLineUp size={16} className="text-[#FF4500]" /> Recommended Portfolio
                </div>
                <div className="space-y-3">
                  {advice.allocation.map((a) => (
                    <div key={a.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }} />
                        <span className="font-mono">{a.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-32 h-2 bg-[var(--bg-primary)] rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${a.pct}%`, backgroundColor: a.color }} />
                        </div>
                        <span className="font-mono text-sm" style={{ color: a.color }}>{a.pct}%</span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mini portfolio visualization */}
                <div className="mt-4 flex h-4 rounded-full overflow-hidden">
                  {advice.allocation.map((a, i) => (
                    <div key={i} style={{ width: `${a.pct}%`, backgroundColor: a.color }} className="h-full first:rounded-l-full last:rounded-r-full" />
                  ))}
                </div>
              </div>

              <div className="panel">
                <div className="label-mini mb-4 flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#FF4500]" /> Portfolio Health Score
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <svg className="w-20 h-20 transform -rotate-90">
                      <circle cx="40" cy="40" r="36" fill="none" stroke="#27272A" strokeWidth="6" />
                      <circle cx="40" cy="40" r="36" fill="none" stroke={advice.score >= 80 ? "#22c55e" : advice.score >= 70 ? "#eab308" : "#ef4444"} 
                        strokeWidth="6" strokeDasharray={`${(advice.score / 100) * 226} 226`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{advice.score}</span>
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-display" style={{ color: advice.score >= 80 ? "#22c55e" : advice.score >= 70 ? "#eab308" : "#ef4444" }}>
                      {advice.score >= 80 ? "Excellent" : advice.score >= 70 ? "Good" : "Needs Improvement"}
                    </div>
                    <div className="text-xs text-zinc-500">Score: {advice.score}/100</div>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {advice.suggestions.map((s, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs font-mono p-2 bg-[var(--bg-primary)] rounded">
                      <Lightbulb size={14} className="text-[#FF4500] shrink-0" />
                      <span>{s}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}