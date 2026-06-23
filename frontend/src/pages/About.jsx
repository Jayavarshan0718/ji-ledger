import { Link } from "react-router-dom";
import { ArrowRight } from "@phosphor-icons/react";
import CryptoBackground from "@/components/CryptoBackground";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] relative">
      <CryptoBackground density={20} variant="sprinkle" />
      <div className="relative z-10 max-w-4xl mx-auto p-6 md:p-12">
        <Link to="/" className="font-display text-xl tracking-wider text-[#FF4500]">/ JI LEDGER</Link>
        <h1 className="font-display text-5xl md:text-7xl uppercase mt-8 text-[#FF4500]">About Us</h1>
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest mt-2">Building the Future of Web3 Finance</p>

        {/* Founder */}
        <div className="panel mt-10 p-8">
          <div className="label-mini mb-6">// FOUNDER</div>
          <div className="flex items-center gap-6">
            <img
              src="/images/founder.jpeg"
              alt="Jayavarshan V"
              className="w-24 h-24 rounded-full object-cover border-2 border-[#FF4500] shrink-0"
            />
            <div>
              <div className="font-display text-4xl text-[#FF4500]">Jayavarshan V</div>
              <div className="text-sm text-zinc-400 font-mono mt-1">Founder & Developer of Ji Ledger</div>
              <p className="text-sm text-zinc-500 mt-3 max-w-xl">
                A passionate blockchain developer building decentralized finance tools 
                for the next generation of Web3 users.
              </p>
            </div>
          </div>
        </div>

        {/* Mission */}
        <div className="panel mt-6 p-8">
          <div className="label-mini mb-4">// MISSION</div>
          <p className="text-zinc-300 text-lg leading-relaxed">
            Ji Ledger aims to simplify crypto investing, portfolio management, 
            blockchain analytics, and Web3 adoption through an easy-to-use platform.
          </p>
        </div>

        {/* Vision */}
        <div className="panel mt-6 p-8">
          <div className="label-mini mb-4">// VISION</div>
          <p className="text-zinc-300 text-lg leading-relaxed">
            To build a trusted blockchain ecosystem for investors, businesses, and innovators.
          </p>
        </div>

        <div className="mt-8 flex gap-4">
          <Link to="/auth?mode=register" className="btn-primary">Start Building</Link>
          <Link to="/" className="btn-ghost">← Back Home</Link>
        </div>
      </div>
    </div>
  );
}