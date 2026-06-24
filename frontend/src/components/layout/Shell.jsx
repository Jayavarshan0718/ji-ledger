import React, { useState, useEffect, useRef } from 'react';
import { NavLink, Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ChartLineUp, ArrowsLeftRight, TrendUp, HandCoins, Wallet,
  Coins, Image, Scales, Package, Cube, DotsThreeOutlineVertical,
  Gear, House, List, PiggyBank, Briefcase, Star, ChartBar,
  Robot, Lock, Rocket, GlobeHemisphereWest, SignOut, X
} from "@phosphor-icons/react";
import ThemeToggle from "@/components/ThemeToggle";
import ConnectWallet from "@/components/ConnectWallet";
import CryptoBackground from "@/components/CryptoBackground";
import MarketTicker from "@/components/MarketTicker";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
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
  { to: "/app/sepolia", label: "Sepolia", icon: GlobeHemisphereWest },
  { to: "/app/explorer", label: "Explorer", icon: Cube },
  { to: "/app/profile", label: "Profile", icon: Briefcase },
  { to: "/app/more", label: "More", icon: DotsThreeOutlineVertical },
  { to: "/app/settings", label: "Settings", icon: Gear },
];

export default function Shell() {
  const [blockHeight, setBlockHeight] = useState(0);
  const [gasPrice, setGasPrice] = useState(12);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { theme } = useTheme();
  const logo = theme === 'dark' ? '/ji-ledger-logo-dark.png' : '/ji-ledger-logo-light.png';
  const [showSprinkle, setShowSprinkle] = useState(false);
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (prevPath.current !== location.pathname) {
      setShowSprinkle(true);
      setMobileOpen(false);
      const t = setTimeout(() => setShowSprinkle(false), 2000);
      prevPath.current = location.pathname;
      return () => clearTimeout(t);
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get("/explorer/stats");
        setBlockHeight(data.latest_block || 0);
        setGasPrice(p => Math.max(1, p + Math.floor(Math.random() * 5) - 2));
      } catch {}
    };
    fetch();
    const iv = setInterval(fetch, 10000);
    return () => clearInterval(iv);
  }, []);

  const isConsolePage = location.pathname === "/app";

  const onLogout = () => { logout(); navigate("/auth"); };

  const SidebarContent = ({ collapsed }) => (
    <>
      {/* Logo */}
      <div className={`flex items-center border-b border-[var(--border-color)] ${collapsed ? "justify-center p-4" : "justify-between px-5 py-4"}`}>
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2 group">
            <img src={logo} alt="Ji Ledger" className="w-10 h-10 object-contain shrink-0" />
            <span className="font-display text-lg tracking-tighter bg-gradient-to-r from-[#FF4500] to-[#ff8c00] bg-clip-text text-transparent group-hover:opacity-80 transition-opacity">JI LEDGER</span>
          </Link>
        )}
        {collapsed && (
          <Link to="/" title="Ji Ledger">
            <img src={logo} alt="JI" className="w-11 h-11 object-contain" />
          </Link>
        )}
        <button
          onClick={() => setIsCollapsed(!collapsed)}
          className="p-1.5 rounded hover:bg-[#FF4500]/10 text-zinc-500 hover:text-[#FF4500] transition-colors hidden md:flex"
          title={collapsed ? "Expand" : "Collapse"}
        >
          <List size={18} />
        </button>
      </div>

      {/* User badge */}
      {!collapsed && user && (
        <div className="mx-4 mt-3 mb-1 px-3 py-2 rounded bg-[#FF4500]/8 border border-[#FF4500]/20 flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-[#FF4500] flex items-center justify-center text-[10px] font-bold text-black shrink-0">
            {user.username?.[0]?.toUpperCase()}
          </div>
          <span className="text-xs text-zinc-400 truncate font-mono">{user.username}</span>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5 scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center rounded-lg transition-all duration-150 group relative
              ${collapsed ? "justify-center p-2.5" : "gap-3 px-3 py-2"}
              ${isActive
                ? "bg-[#FF4500] text-black shadow-[0_0_12px_rgba(255,69,0,0.25)]"
                : "text-zinc-500 hover:text-[var(--text-primary)] hover:bg-white/5"
              }`
            }
          >
            <item.icon size={18} weight="bold" className="shrink-0" />
            {!collapsed && (
              <span className="font-mono text-[11px] uppercase tracking-widest font-bold whitespace-nowrap">
                {item.label}
              </span>
            )}
            {collapsed && (
              <div className="absolute left-full ml-3 px-2.5 py-1 bg-[#1a1a1a] border border-[#FF4500]/30 text-[#FF4500] text-[10px] font-bold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-lg">
                {item.label}
              </div>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 border-t border-[var(--border-color)] space-y-3">
        {!collapsed && (
          <div className="px-2 space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
              <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Mainnet Live</span>
            </div>
            <div className="text-[10px] font-mono text-zinc-500">
              BLOCK <span className="text-[var(--text-primary)]">#{blockHeight.toLocaleString()}</span>
              <span className="mx-2">·</span>
              GAS <span className="text-[#FF4500]">{gasPrice} GWEI</span>
            </div>
          </div>
        )}
        <div className={`flex ${collapsed ? "flex-col items-center gap-2" : "items-center justify-between"}`}>
          <ThemeToggle />
          {!collapsed && <ConnectWallet />}
        </div>
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-2 text-zinc-500 hover:text-red-400 transition-colors text-xs font-mono uppercase tracking-widest py-1 px-2 rounded hover:bg-red-500/10 ${collapsed ? "justify-center" : ""}`}
        >
          <SignOut size={15} />
          {!collapsed && "Sign Out"}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-300 font-inter">

      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--bg-panel)] border border-[var(--border-color)] rounded-lg text-zinc-400 hover:text-[#FF4500]"
      >
        <List size={20} />
      </button>

      {/* Mobile drawer overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 flex flex-col bg-[var(--bg-panel)] border-r border-[var(--border-color)] h-full z-10">
            <button onClick={() => setMobileOpen(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white">
              <X size={18} />
            </button>
            <SidebarContent collapsed={false} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={`hidden md:flex flex-col sticky top-0 h-screen border-r border-[var(--border-color)] bg-[var(--bg-panel)] z-40 transition-all duration-300 ${isCollapsed ? "w-[60px]" : "w-60"}`}>
        <SidebarContent collapsed={isCollapsed} />
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <MarketTicker />
        {/* Top-right home button */}
        <div className="fixed top-2 right-4 z-50 flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--bg-panel)] border border-[var(--border-color)] hover:border-[#FF4500] text-zinc-500 hover:text-[#FF4500] transition-all text-[10px] font-mono uppercase tracking-widest rounded-lg shadow-lg backdrop-blur-sm"
            title="Back to Home"
          >
            <House size={13} weight="bold" /> Home
          </Link>
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[var(--bg-primary)] relative">
          {isConsolePage
            ? <CryptoBackground density={18} variant="console" />
            : <CryptoBackground density={14} variant="sprinkle" />
          }

          {showSprinkle && (
            <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden" key={location.pathname}>
              {Array.from({ length: 16 }, (_, i) => {
                const colors = ["#FF4500","#ff8c00","#22c55e","#3b82f6","#a855f7"];
                const w = 8 + (i % 4) * 6;
                const h = 3 + (i % 3) * 4;
                return (
                  <div
                    key={i}
                    className="absolute animate-shatter"
                    style={{
                      top: `${10 + (i * 37) % 80}%`,
                      left: `${5 + (i * 53) % 90}%`,
                      width: `${w}px`,
                      height: `${h}px`,
                      background: colors[i % colors.length],
                      opacity: 0.7,
                      '--drift-x': `${(i % 2 === 0 ? 1 : -1) * (40 + (i % 5) * 30)}px`,
                      '--drift-y': `${-60 - (i % 4) * 40}px`,
                      '--rot': `${(i % 2 === 0 ? 1 : -1) * (90 + i * 15)}deg`,
                      animationDelay: `${i * 0.04}s`,
                      animationDuration: `${0.6 + (i % 3) * 0.2}s`,
                    }}
                  />
                );
              })}
              {/* Scanline flash */}
              <div className="absolute inset-0 animate-glitch-flash bg-[#FF4500]/5" />
            </div>
          )}

          <div className="relative z-10 animate-page-in" key={location.pathname}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
