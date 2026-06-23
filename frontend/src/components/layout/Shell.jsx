import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import {
  ChartLineUp, ArrowsLeftRight, TrendUp, HandCoins, Wallet,
  Coins, Image, Scales, Package, Cube, DotsThreeOutlineVertical,
  Gear, House, List, PiggyBank, Briefcase, Star, ChartBar,
  Robot, Lock, Rocket, Newspaper
} from "@phosphor-icons/react";
import ThemeToggle from "@/components/ThemeToggle";
import ConnectWallet from "@/components/ConnectWallet";
import CryptoBackground from "@/components/CryptoBackground";
import MarketTicker from "@/components/MarketTicker";
import api from "@/lib/api";

const NAV_ITEMS = [
  { to: "/app", label: "Console", icon: House, end: true },
  { to: "/app/markets", label: "Markets", icon: ChartLineUp },
  { to: "/app/trade", label: "Trade", icon: ArrowsLeftRight },
  { to: "/app/portfolio", label: "Portfolio", icon: Briefcase },
  { to: "/app/sip", label: "SIP", icon: PiggyBank },
  { to: "/app/watchlist", label: "Watchlist", icon: Star },
  { to: "/app/stocks", label: "Stocks", icon: ChartBar },
  { to: "/app/futures", label: "Futures", icon: TrendUp },
  { to: "/app/earn", label: "Earn", icon: HandCoins },
  { to: "/app/wallet", label: "Wallet", icon: Wallet },
  { to: "/app/tokens", label: "Tokens", icon: Coins },
  { to: "/app/nft", label: "NFT Studio", icon: Image },
  { to: "/app/stake", label: "Stake", icon: Lock },
  { to: "/app/launchpad", label: "Launchpad", icon: Rocket },
  { to: "/app/ai-advisor", label: "AI Advisor", icon: Robot },
  { to: "/app/voting", label: "DAO", icon: Scales },
  { to: "/app/supply", label: "Supply", icon: Package },
  { to: "/app/explorer", label: "Explorer", icon: Cube },
  { to: "/app/profile", label: "Profile", icon: Briefcase },
  { to: "/app/more", label: "More", icon: DotsThreeOutlineVertical },
  { to: "/app/settings", label: "Settings", icon: Gear },
];

export default function Shell() {
  const [blockHeight, setBlockHeight] = useState(0);
  const [gasPrice, setGasPrice] = useState(12);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  const [showSprinkle, setShowSprinkle] = useState(false);
  const prevPath = useRef(location.pathname);

  // Trigger sprinkle effect on page change
  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      setShowSprinkle(true);
      const timer = setTimeout(() => setShowSprinkle(false), 2000);
      prevPath.current = location.pathname;
      return () => clearTimeout(timer);
    }
  }, [location.pathname]);

  const isConsolePage = location.pathname === "/app";

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/explorer/stats");
        setBlockHeight(data.latest_block || 0);

        // Simulate gas price fluctuation
        setGasPrice(prev => {
          const delta = Math.floor(Math.random() * 5) - 2; // Range: -2 to +2
          return Math.max(1, prev + delta);
        });
      } catch (err) {
        console.error("Failed to fetch network stats", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // Polling every 10 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 font-inter">
      {/* Persistent Sidebar */}
      <aside className={`${isCollapsed ? "w-20" : "w-20 md:w-64"} transition-all duration-300 border-r border-[var(--border-color)] flex flex-col sticky top-0 h-screen bg-[var(--bg-panel)] z-50`}>
        <div className="p-6 border-b border-[#27272A] flex items-center justify-between overflow-hidden">
          {!isCollapsed && (
            <Link to="/" className="font-display text-xl md:text-2xl tracking-tighter text-[#FF4500] hover:scale-105 transition-transform hidden md:block whitespace-nowrap">
              / JI LEDGER
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-zinc-400 hover:text-white mx-auto md:mx-0 shrink-0"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <List size={24} />
          </button>
        </div>

        {/* Navigation Modules */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-4 p-3 rounded transition-all group relative ${isActive
                  ? "bg-[#FF4500] text-black shadow-[0_0_15px_rgba(255,69,0,0.3)]"
                  : "text-zinc-500 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              <item.icon size={isCollapsed ? 36 : 22} weight="bold" className="transition-all hover:scale-110 shrink-0" />
              <span className={`${isCollapsed ? "hidden" : "hidden md:block"} font-mono text-[10px] uppercase tracking-widest font-bold whitespace-nowrap`}>
                {item.label}
              </span>
              {/* Tooltip for collapsed mobile view */}
              <div className={`${isCollapsed ? "" : "md:hidden"} absolute left-full ml-4 px-2 py-1 bg-[#FF4500] text-black text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50`}>
                {item.label}
              </div>
            </NavLink>
          ))}
        </nav>

        {/* Global Persistence Footer */}
        <div className="p-4 border-t border-[var(--border-color)] space-y-4 text-[var(--text-primary)]">
          {/* Network Status Indicator */}
          <div className={`${isCollapsed ? "hidden" : "hidden md:block"} px-2 overflow-hidden`}>
            <div className="flex items-center gap-2 mb-1 whitespace-nowrap">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest font-bold">Mainnet Live</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono whitespace-nowrap">
              HEIGHT: <span className="text-white">#{blockHeight.toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-zinc-400 font-mono mt-0.5 whitespace-nowrap">
              GAS: <span className="text-[#FF4500] font-bold">{gasPrice} GWEI</span>
            </div>
          </div>

          <div className="flex items-center justify-center md:justify-between gap-2">
            <ThemeToggle />
            <div className={`${isCollapsed ? "hidden" : "hidden md:block"}`}>
              <ConnectWallet />
            </div>
          </div>
        </div>
      </aside>

      {/* Dynamic Module Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <MarketTicker />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--bg-primary)] relative">
          {/* Console page gets the console variant, other pages get sprinkle + fun effect */}
          {isConsolePage ? (
            <CryptoBackground density={18} variant="console" />
          ) : (
            <CryptoBackground density={14} variant="sprinkle" />
          )}
          
          {/* Sprinkle burst overlay on page transitions */}
          {showSprinkle && (
            <div className="absolute inset-0 pointer-events-none z-50" key={location.pathname}>
              {Array.from({ length: 12 }, (_, i) => (
                <div
                  key={i}
                  className="absolute animate-sprinkle"
                  style={{
                    top: "50%",
                    left: "50%",
                    '--travel-x': `${Math.cos((i * 30 * Math.PI) / 180) * (80 + (i % 4) * 30)}px`,
                    '--travel-y': `${Math.sin((i * 30 * Math.PI) / 180) * (80 + (i % 4) * 30)}px`,
                    animationDelay: `${i * 0.05}s`,
                    animationDuration: `${1 + (i % 3) * 0.3}s`,
                  }}
                >
                  <span className="font-display text-lg" style={{ color: ["#FF4500", "#22c55e", "#3b82f6", "#eab308", "#a855f7"][i % 5] }}>
                    {["$", "₿", "Ξ", "◎", "◈"][i % 5]}
                  </span>
                </div>
              ))}
            </div>
          )}
          
          <div className="relative z-10 animate-fade-slide-up" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}