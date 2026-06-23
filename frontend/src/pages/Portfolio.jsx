import { useState } from "react";
import { Wallet, TrendUp, TrendDown, ChartPie, Coin } from "@phosphor-icons/react";
import { ResponsiveContainer, PieChart as RePieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";

const INR_RATE = 83;

const holdings = [
  { asset: "Bitcoin", symbol: "BTC", amount: 0.42, price: 64231, change: 2.4, color: "#FF4500" },
  { asset: "Ethereum", symbol: "ETH", amount: 4.8, price: 3421, change: -0.8, color: "#8c8cff" },
  { asset: "Solana", symbol: "SOL", amount: 15, price: 145.2, change: 4.5, color: "#22c55e" },
  { asset: "Ji Ledger", symbol: "JI", amount: 1250, price: 1.42, change: 5.2, color: "#eab308" },
  { asset: "Apple", symbol: "AAPL", amount: 10, price: 198.5, change: 1.2, color: "#a855f7" },
  { asset: "Tesla", symbol: "TSLA", amount: 5, price: 245.8, change: -1.5, color: "#3b82f6" },
];

const weeklyData = [
  { day: "Mon", value: 42000 }, { day: "Tue", value: 43500 }, { day: "Wed", value: 42800 },
  { day: "Thu", value: 45200 }, { day: "Fri", value: 44800 }, { day: "Sat", value: 46100 }, { day: "Sun", value: 46800 },
];

export default function PortfolioPage() {
  const [viewMode, setViewMode] = useState("inr"); // "inr" or "usd"

  const totalValueUSD = holdings.reduce((sum, h) => sum + h.amount * h.price, 0);
  const totalValueINR = totalValueUSD * INR_RATE;
  const dailyProfit = 342;
  const weeklyProfit = 1280;
  const monthlyProfit = 4560;
  const totalProfit = totalValueUSD * 0.15;
  const overallROI = 15;

  const allocationData = holdings.map(h => ({
    name: h.symbol,
    value: h.amount * h.price,
    color: h.color,
  }));

  const formatCurrency = (value) => {
    if (viewMode === "inr") {
      return `₹${(value * INR_RATE).toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
    }
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="p-6 md:p-12">
      <div className="flex justify-between items-center">
        <div>
          <div className="label-mini">// PORTFOLIO TRACKER</div>
          <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">Portfolio</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setViewMode("inr")} className={`px-3 py-1 text-xs uppercase tracking-wider font-bold ${viewMode === "inr" ? "bg-[#FF4500] text-black" : "border border-zinc-700 text-zinc-500"}`}>₹ INR</button>
          <button onClick={() => setViewMode("usd")} className={`px-3 py-1 text-xs uppercase tracking-wider font-bold ${viewMode === "usd" ? "bg-[#FF4500] text-black" : "border border-zinc-700 text-zinc-500"}`}>$ USD</button>
        </div>
      </div>

      {/* Portfolio Value Card */}
      <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="panel col-span-2 md:col-span-2">
          <div className="label-mini">Portfolio Value</div>
          <div className="font-display text-4xl mt-1">{formatCurrency(totalValueUSD)}</div>
          <div className="text-green-400 text-sm flex items-center gap-1 mt-1">
            <TrendUp size={16} weight="bold" /> +{formatCurrency(totalProfit)} (+{overallROI}%)
          </div>
          <button className="btn-primary mt-4 px-4 py-2 text-xs">Audit Portfolio</button>
        </div>
        <div className="panel text-center">
          <div className="label-mini">Today</div>
          <div className="font-mono text-lg text-green-400 mt-1">+{formatCurrency(dailyProfit)}</div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">Weekly</div>
          <div className="font-mono text-lg text-green-400 mt-1">+{formatCurrency(weeklyProfit)}</div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">Monthly</div>
          <div className="font-mono text-lg text-green-400 mt-1">+{formatCurrency(monthlyProfit)}</div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">ROI</div>
          <div className="font-mono text-lg text-green-400 mt-1">+{overallROI}%</div>
        </div>
      </div>

      <div className="mt-8 grid lg:grid-cols-3 gap-6">
        {/* Allocation Pie Chart */}
        <div className="panel lg:col-span-1">
          <div className="label-mini mb-4 flex items-center gap-2">
                <ChartPie size={16} className="text-[#FF4500]" /> Asset Allocation
          </div>
          <div className="flex flex-col items-center">
            <div className="h-48 w-48">
              <ResponsiveContainer width="100%" height="100%">
                <RePieChart>
                  <Pie data={allocationData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" stroke="none">
                    {allocationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)" }} />
                </RePieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 space-y-2 w-full">
              {holdings.map(h => (
                <div key={h.symbol} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: h.color }} />
                    <span>{h.symbol}</span>
                  </div>
                  <span className="font-mono">{(h.amount * h.price / totalValueUSD * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Chart */}
        <div className="panel lg:col-span-2">
          <div className="label-mini mb-4">Weekly Performance</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid stroke="#27272A" />
                <XAxis dataKey="day" tick={{ fill: "#71717a", fontSize: 10 }} />
                <YAxis tick={{ fill: "#71717a", fontSize: 10 }} tickFormatter={(v) => `$${v.toLocaleString()}`} />
                <Tooltip contentStyle={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)" }} />
                <Bar dataKey="value" fill="#FF4500" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Holdings */}
      <div className="mt-8">
        <div className="label-mini mb-4">Holdings</div>
        <div className="space-y-2">
          {holdings.map((h) => (
            <div key={h.symbol} className="panel flex items-center justify-between hover:border-[#FF4500]/30 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: `${h.color}20` }}>
                  <Coin size={20} weight="fill" style={{ color: h.color }} />
                </div>
                <div>
                  <div className="font-bold">{h.asset}</div>
                  <div className="text-xs text-zinc-500">{h.amount} {h.symbol}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono">{formatCurrency(h.amount * h.price)}</div>
                <div className={`text-xs flex items-center gap-1 justify-end ${h.change >= 0 ? "text-green-400" : "text-red-400"}`}>
                  {h.change >= 0 ? <TrendUp size={12} weight="bold" /> : <TrendDown size={12} weight="bold" />}
                  {h.change >= 0 ? "+" : ""}{h.change}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}