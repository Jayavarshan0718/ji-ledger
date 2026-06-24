import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  ArrowRight, Coins, Cube, Image, Package, Scales, Wallet, Gear,
  ChartLineUp, ArrowsLeftRight, TrendUp, HandCoins, DotsThreeOutlineVertical,
  PiggyBank, Briefcase, Star, ChartBar, Robot, Lock, Rocket, Bell
} from "@phosphor-icons/react";
import ConnectWallet from "@/components/ConnectWallet";
import ThemeToggle from "@/components/ThemeToggle";
import api from "@/lib/api";

const MODS = [
  { to: "/app/markets", label: "Markets", icon: ChartLineUp, code: "01" },
  { to: "/app/trade", label: "Trade", icon: ArrowsLeftRight, code: "02" },
  { to: "/app/portfolio", label: "Portfolio", icon: Briefcase, code: "03" },
  { to: "/app/sip", label: "SIP", icon: PiggyBank, code: "04" },
  { to: "/app/watchlist", label: "Watchlist", icon: Star, code: "05" },
  { to: "/app/stocks", label: "Stocks", icon: ChartBar, code: "06" },
  { to: "/app/futures", label: "Futures", icon: TrendUp, code: "07" },
  { to: "/app/earn", label: "Earn", icon: HandCoins, code: "08" },
  { to: "/app/wallet", label: "Wallet", icon: Wallet, code: "09" },
  { to: "/app/tokens", label: "Tokens", icon: Coins, code: "10" },
  { to: "/app/nft", label: "NFT Studio", icon: Image, code: "11" },
  { to: "/app/stake", label: "Stake", icon: Lock, code: "12" },
  { to: "/app/launchpad", label: "Launchpad", icon: Rocket, code: "13" },
  { to: "/app/ai-advisor", label: "AI Advisor", icon: Robot, code: "14" },
  { to: "/app/voting", label: "DAO", icon: Scales, code: "15" },
  { to: "/app/supply", label: "Supply", icon: Package, code: "16" },
  { to: "/app/explorer", label: "Explorer", icon: Cube, code: "17" },
  { to: "/app/settings", label: "Settings", icon: Gear, code: "18" },
];

const MOCK_PORTFOLIO = { value: 48500, profit: 7500, roi: 15.2 };
const MOCK_WATCHED = ["BTC", "ETH", "SOL"];
const ASSET_PRICES = {
  BTC: { price: 64231, change: 2.4 },
  ETH: { price: 3421, change: -0.8 },
  SOL: { price: 145.2, change: 4.5 },
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [wallets, setWallets] = useState([]);
  const [recentBlocks, setRecentBlocks] = useState([]);
  const [analytics, setAnalytics] = useState({ daily: [], by_type: [], top_tokens: [] });

  useEffect(() => {
    api.get("/explorer/stats").then((r) => setStats(r.data));
    api.get("/wallet/me").then((r) => setWallets(r.data.wallets));
    api.get("/explorer/blocks?limit=8").then((r) => setRecentBlocks(r.data.blocks));
    api.get("/analytics/overview").then((r) => setAnalytics(r.data));
  }, []);

  const primary = wallets[0];

  return (
    <div className="p-6 md:p-12">
      <div className="flex justify-between items-end">
        <div>
          <div className="label-mini">// NETWORK CONSOLE</div>
          <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">Control Room</h1>
        </div>
        <div className="text-right hidden md:block">
          <div className="flex items-center gap-2 justify-end mb-2">
            <ThemeToggle />
            <ConnectWallet />
          </div>
          <div className="text-xs text-zinc-500 font-mono">NODE STATUS</div>
          <div className="text-green-400 font-mono text-sm animate-pulse">● SYNCHRONIZED</div>
        </div>
      </div>

      {/* Portfolio Summary Card */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="panel md:col-span-2 bg-gradient-to-r from-[#FF4500]/10 to-transparent border-[#FF4500]/30">
          <div className="label-mini text-[#FF4500]">Portfolio Summary</div>
          <div className="flex items-end justify-between mt-2">
            <div>
              <div className="font-display text-4xl">₹{(MOCK_PORTFOLIO.value * 83).toLocaleString()}</div>
              <div className="text-green-400 text-sm flex items-center gap-1 mt-1">
                <TrendUp size={16} weight="bold" /> +₹{(MOCK_PORTFOLIO.profit * 83).toLocaleString()} (+{MOCK_PORTFOLIO.roi}%)
              </div>
            </div>
            <Link to="/app/portfolio" className="btn-primary text-xs px-4 py-2">View Portfolio →</Link>
          </div>
        </div>

        <div className="panel text-center">
          <div className="label-mini">Watchlist</div>
          <div className="mt-2 space-y-1">
            {MOCK_WATCHED.map(sym => (
              <div key={sym} className="flex justify-between text-xs">
                <span className="font-bold">{sym}</span>
                <span className={`font-mono ${(ASSET_PRICES[sym]?.change || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  ${ASSET_PRICES[sym]?.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
          <Link to="/app/watchlist" className="text-[10px] text-[#FF4500] mt-2 inline-block">Manage →</Link>
        </div>

        <div className="panel text-center">
          <div className="label-mini">Quick Actions</div>
          <div className="mt-3 space-y-2">
            <Link to="/app/sip" className="flex items-center gap-2 text-xs p-2 bg-[var(--bg-primary)] rounded hover:text-[#FF4500]">
              <PiggyBank size={14} /> Start SIP
            </Link>
            <Link to="/app/stake" className="flex items-center gap-2 text-xs p-2 bg-[var(--bg-primary)] rounded hover:text-[#FF4500]">
              <Lock size={14} /> Stake Tokens
            </Link>
            <Link to="/app/ai-advisor" className="flex items-center gap-2 text-xs p-2 bg-[var(--bg-primary)] rounded hover:text-[#FF4500]">
              <Robot size={14} /> AI Advisor
            </Link>
          </div>
        </div>
      </div>

      {/* Global Network Protocol Load Matrix */}
      <div className="mt-4 panel py-4 px-6 bg-[#FF4500]/5 border-[#FF4500]/20">
        <div className="label-mini text-[#FF4500] mb-3 tracking-widest uppercase">Global Network Protocol Load Matrix</div>
        <div className="flex flex-wrap gap-x-8 gap-y-3 text-[11px] font-mono text-zinc-400 uppercase">
          <span>USA: 42.1%</span> <span>GER: 18.2%</span> <span>IND: 22.4%</span>
          <span>JPN: 18.0%</span> <span>UK: 12.5%</span> <span>FRA: 9.2%</span>
          <span>BRA: 7.1%</span> <span>CAN: 5.4%</span> <span>AUS: 4.8%</span>
          <span>UAE: 3.9%</span> <span>SGP: 3.5%</span> <span>ZAF: 2.1%</span>
          <span>KOR: 6.8%</span> <span>MEX: 4.2%</span> <span>RUS: 3.1%</span>
          <span>ITA: 2.9%</span> <span>ESP: 2.5%</span> <span>TUR: 2.4%</span>
          <span>CHN: 15.2%</span> <span>VNM: 3.1%</span> <span>ARG: 1.8%</span>
        </div>
      </div>

      {/* Balance & Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-px bg-[#27272A] border border-[#27272A]">
        <div className="bg-[var(--bg-panel)] p-8 border-r border-[var(--border-color)] text-[var(--text-primary)]">
          <div className="label-mini">Primary Balance</div>
          <div className="font-display text-5xl md:text-6xl mt-3 text-[#FF4500]">
            {primary ? primary.balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "—"}
          </div>
          <div className="text-[#FF4500] font-bold mt-2 tracking-widest text-sm">JI</div>
        </div>
        <div className="bg-[var(--bg-panel)] p-8 md:col-span-2 text-[var(--text-primary)]">
          <div className="label-mini">Network Stats</div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-4 text-sm">
            <Stat label="Blocks" value={stats?.total_blocks} />
            <Stat label="Tokens" value={stats?.total_tokens} />
            <Stat label="NFTs" value={stats?.total_nfts} />
            <Stat label="Proposals" value={stats?.total_proposals} />
            <Stat label="Products" value={stats?.total_products} />
          </div>
        </div>
      </div>

      {/* All Modules */}
      <div className="mt-6 grid md:grid-cols-3 gap-px bg-[#27272A] border border-[#27272A]">
        {MODS.map((mod) => (
          <Link
            key={mod.to}
            to={mod.to}
            className="bg-[var(--bg-panel)] p-6 hover:bg-[var(--bg-panel)]/50 transition-colors flex items-center justify-between group text-[var(--text-primary)]"
          >
            <div className="flex items-center gap-4">
              <span className="label-mini">{mod.code}</span>
              <mod.icon size={32} weight="bold" className="text-[#FF4500] shrink-0" />
              <span className="uppercase tracking-wider">{mod.label}</span>
            </div>
            <ArrowRight className="opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid lg:grid-cols-2 gap-6">
        <div className="panel">
          <div className="label-mini mb-4 text-[var(--text-primary)]">Activity (14d)</div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={analytics.daily}>
                <CartesianGrid stroke="#27272A" />
                <XAxis dataKey="date" tick={{ fill: "#71717a", fontSize: 10 }} />
                <YAxis tick={{ fill: "#71717a", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "var(--bg-panel)", border: "1px solid var(--border-color)" }} />
                <Bar dataKey="count" fill="#FF4500" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="panel">
          <div className="label-mini mb-4 text-[var(--text-primary)]">Recent Blocks</div>
          <div className="space-y-2">
            {recentBlocks.length === 0 && (
              <div className="text-xs text-zinc-500 font-mono py-4 text-center">// No blocks yet — start transacting</div>
            )}
            {recentBlocks.map((b) => {
              const typeColor = {
                genesis: "text-green-400", transfer: "text-blue-400", faucet: "text-yellow-400",
                token_create: "text-purple-400", nft_mint: "text-pink-400", vote: "text-cyan-400",
                market_buy: "text-green-400", market_sell: "text-red-400",
                supply_register: "text-orange-400", proposal_create: "text-cyan-400",
              }[b.tx_type] || "text-zinc-400";
              return (
                <div key={b.hash} className="flex items-center gap-3 py-2 border-b border-[var(--border-color)] last:border-0 text-xs">
                  <span className="text-[#FF4500] font-mono font-bold w-10 shrink-0">#{b.index}</span>
                  <span className={`font-mono px-2 py-0.5 rounded bg-[var(--bg-primary)] shrink-0 ${typeColor}`}>
                    {b.tx_type.replace(/_/g, " ")}
                  </span>
                  <span className="text-zinc-500 font-mono truncate flex-1">{b.hash.slice(0, 18)}…</span>
                  <span className="text-zinc-600 shrink-0 hidden md:block">
                    {new Date(b.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              );
            })}
          </div>
          <Link to="/app/explorer" className="mt-3 text-[10px] text-[#FF4500] inline-block hover:underline">View all blocks →</Link>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div>
      <div className="text-zinc-500 uppercase text-[10px] tracking-wider">{label}</div>
      <div className="text-xl font-bold mt-1">{value ?? "—"}</div>
    </div>
  );
}