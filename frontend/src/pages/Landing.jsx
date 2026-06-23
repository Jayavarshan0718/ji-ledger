import { Link } from "react-router-dom";
import { ArrowRight, CurrencyBtc, CurrencyEth, CurrencyDollar } from "@phosphor-icons/react";
import { useAuth } from "@/context/AuthContext";
import ConnectWallet from "@/components/ConnectWallet";
import ThemeToggle from "@/components/ThemeToggle";
import CryptoBackground from "@/components/CryptoBackground";
import MarketTicker from "@/components/MarketTicker";

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] overflow-hidden relative">
      <CryptoBackground density={35} variant="hero" />
      <MarketTicker />

      {/* Extra Crypto Graphics - clearly visible in both dark & light mode */}
      <div className="absolute inset-0 pointer-events-none select-none z-[1]" aria-hidden>
        <div className="animate-float-graphic" style={{ position: "absolute", top: "12%", left: "4%", animationDelay: "0s", animationDuration: "6s" }}>
          <CurrencyBtc size={72} weight="fill" color="#f7931a" className="graphic-hero" />
        </div>
        <div className="animate-float-graphic" style={{ position: "absolute", top: "65%", left: "6%", animationDelay: "1.5s", animationDuration: "7s" }}>
          <CurrencyEth size={56} weight="fill" color="#8c8cff" className="graphic-hero" />
        </div>
        <div className="animate-float-graphic" style={{ position: "absolute", top: "25%", right: "8%", animationDelay: "0.8s", animationDuration: "5.5s" }}>
          <CurrencyDollar size={64} weight="fill" color="#22c55e" className="graphic-hero" />
        </div>
        <div className="animate-float-graphic" style={{ position: "absolute", top: "75%", right: "3%", animationDelay: "2.5s", animationDuration: "8s" }}>
          <CurrencyBtc size={48} weight="fill" color="#f7931a" className="graphic-hero" />
        </div>
        <div className="animate-float-graphic" style={{ position: "absolute", top: "50%", left: "55%", animationDelay: "0.3s", animationDuration: "6.5s" }}>
          <CurrencyEth size={40} weight="fill" color="#8c8cff" className="graphic-hero" />
        </div>
        <div className="animate-float-graphic" style={{ position: "absolute", top: "35%", left: "30%", animationDelay: "1s", animationDuration: "7.5s" }}>
          <CurrencyDollar size={44} weight="fill" color="#22c55e" className="graphic-hero" />
        </div>
      </div>

      <header className="flex items-center justify-between p-6 md:p-10 border-b border-[var(--border-color)] relative z-20 bg-[var(--bg-primary)]/40 backdrop-blur-md">
        <Link to="/" className="font-display text-2xl md:text-3xl tracking-wider text-[#FF4500]">
          / JI LEDGER
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
          <div className="hidden md:block">
            <ConnectWallet />
          </div>
          <Link to={user ? "/app" : "/auth"} className="btn-primary inline-flex items-center gap-2">
            {user ? "Open Console" : "Sign In"} <ArrowRight />
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative p-6 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden z-10">
        <div className="max-w-3xl z-10">
          <h1 className="font-display text-3xl md:text-5xl uppercase mt-4 leading-[0.9] text-[#FF4500]">
            Ji Ledger: The Sovereign Web3 Stack.
          </h1>
          <p className="mt-8 text-[var(--text-secondary)] max-w-2xl text-xl leading-relaxed border-l-4 border-[#FF4500] pl-6 font-medium">
            Explore, Build, and Innovate on Your Own Decentralized Chain. Every account is auto-issued a primary 0x wallet seeded with 1000 JI. Your private blockchain sandbox awaits.
          </p>
          <div className="mt-12 flex flex-wrap gap-4">
            <Link to="/auth?mode=register" className="btn-primary text-lg px-8 py-3">
              Start Building Now →
            </Link>
            <Link to="/auth" className="btn-ghost text-lg px-8 py-3">
              Sign In
            </Link>
          </div>
        </div>
        <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-full bg-gradient-to-l from-[var(--bg-primary)] to-transparent z-0"></div>
        <div className="hidden md:block absolute right-16 top-1/2 -translate-y-1/2 z-10">
          <div className="font-display text-[200px] leading-none text-[#FF4500] select-none ji-watermark">
            JI
          </div>
        </div>
      </section>

      {/* Existing Feature Section */}
      <section className="grid md:grid-cols-3 gap-px bg-[var(--border-color)] border-y border-[var(--border-color)] relative z-10">
        {[
          { t: "01 Wallet", d: "Register an account. Spawn a primary 0x address with 1000 JI pre-funded." },
          { t: "02 Tokens", d: "Deploy tokens, mint NFTs, transfer assets — every action hashes into a block." },
          { t: "03 Explorer", d: "Inspect every immutable block on the Ji Ledger." },
        ].map((item) => (
          <div key={item.t} className="bg-[var(--bg-panel)] p-8">
            <div className="text-[#FF4500] font-display text-2xl uppercase">{item.t}</div>
            <p className="mt-4 text-[var(--text-secondary)] text-sm">{item.d}</p>
          </div>
        ))}
      </section>

      {/* New Feature Section — Binance-style exchange */}
      <section className="grid md:grid-cols-3 gap-px bg-[var(--border-color)] border-b border-[var(--border-color)] mt-10 relative z-10">
        {[
          { t: "04 Spot Trading", d: "Buy and sell JI, BTC, ETH and more with live order books, charts, and instant execution." },
          { t: "05 Futures & Earn", d: "Leverage positions and stake assets to earn yield — Binance-style modules built into Ji Ledger." },
          { t: "06 Market Ticker", d: "Real-time price feeds across major pairs with 24h volume, high/low, and one-click trade." },
        ].map((item) => (
          <div key={item.t} className="bg-[var(--bg-panel)] p-8">
            <div className="text-[#FF4500] font-display text-2xl uppercase">{item.t}</div>
            <p className="mt-4 text-[var(--text-secondary)] text-sm">{item.d}</p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="p-6 md:p-10 bg-[var(--bg-primary)] relative z-10 border-t border-[var(--border-color)]">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 text-left">
          <div>
            <div className="font-display text-xl tracking-wider text-[#FF4500]">/ JI LEDGER</div>
            <p className="text-xs text-zinc-500 mt-2">Building the Future of Web3 Finance</p>
            <div className="text-xs text-zinc-600 mt-4 font-mono">
              <span className="text-[#FF4500]">Founded by</span> Jayavarshan V
            </div>
          </div>
          <div>
            <div className="label-mini mb-3">Platform</div>
            <div className="space-y-2">
              <Link to="/auth?mode=register" className="block text-xs text-zinc-500 hover:text-[#FF4500]">Get Started</Link>
              <Link to="/auth" className="block text-xs text-zinc-500 hover:text-[#FF4500]">Sign In</Link>
              <Link to="/app/markets" className="block text-xs text-zinc-500 hover:text-[#FF4500]">Markets</Link>
            </div>
          </div>
          <div>
            <div className="label-mini mb-3">Company</div>
            <div className="space-y-2">
              <Link to="/about" className="block text-xs text-zinc-500 hover:text-[#FF4500]">About Us</Link>
              <Link to="/contact" className="block text-xs text-zinc-500 hover:text-[#FF4500]">Contact Us</Link>
            </div>
          </div>
          <div>
            <div className="label-mini mb-3">Legal</div>
            <div className="space-y-2">
              <Link to="/privacy" className="block text-xs text-zinc-500 hover:text-[#FF4500]">Privacy Policy</Link>
              <Link to="/terms" className="block text-xs text-zinc-500 hover:text-[#FF4500]">Terms & Conditions</Link>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-6 border-t border-[var(--border-color)] text-center text-[10px] text-zinc-600 font-mono">
          &copy; 2026 Ji Ledger. All rights reserved. | Built by Jayavarshan V
        </div>
      </footer>
    </div>
  );
}