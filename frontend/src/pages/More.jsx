import React, { useState } from 'react';
import { DotsThreeOutlineVertical, Book, Bridge, Globe, Code, X, CheckCircle, Warning } from '@phosphor-icons/react';

const CONTENT = {
  Bridge: {
    icon: Bridge,
    title: "Bridge — Cross-Chain Transfer",
    body: (
      <div className="space-y-4 text-sm text-zinc-400">
        <p>Bridge your assets between Ji Ledger and other EVM-compatible chains.</p>
        <div className="panel p-4 bg-[var(--bg-primary)]">
          <div className="label-mini mb-3">Supported Networks</div>
          {["Ethereum Mainnet", "Sepolia Testnet", "Polygon", "BNB Chain"].map(n => (
            <div key={n} className="flex items-center gap-2 py-1 border-b border-[var(--border-color)] last:border-0 text-xs">
              <CheckCircle size={14} className="text-green-400" /> {n}
            </div>
          ))}
        </div>
        <div className="panel p-4 bg-[var(--bg-primary)]">
          <div className="label-mini mb-2 text-yellow-400">Bridge Coming Soon</div>
          <p className="text-xs">Cross-chain bridge contracts are currently in audit. Expected launch: Q3 2026.</p>
        </div>
        <button className="btn-primary w-full opacity-50 cursor-not-allowed" disabled>Bridge Assets (Coming Soon)</button>
      </div>
    )
  },
  "API Docs": {
    icon: Code,
    title: "API Documentation",
    body: (
      <div className="space-y-3 text-sm text-zinc-400">
        <p>Base URL: <code className="text-[#FF4500] font-mono">http://127.0.0.1:8000</code></p>
        <div className="space-y-2 font-mono text-xs">
          {[
            ["POST", "/api/auth/register", "Register new user"],
            ["POST", "/api/auth/login", "Login"],
            ["GET",  "/api/wallet/me", "Get wallet info"],
            ["POST", "/api/wallet/send", "Send JI tokens"],
            ["GET",  "/api/tokens/", "List all tokens"],
            ["POST", "/api/tokens/create", "Deploy a token"],
            ["GET",  "/api/nft/", "List NFTs"],
            ["POST", "/api/nft/mint", "Mint NFT"],
            ["GET",  "/api/explorer/blocks", "Get blocks"],
            ["GET",  "/api/voting/proposals", "List proposals"],
            ["POST", "/api/voting/vote", "Cast a vote"],
          ].map(([method, path, desc]) => (
            <div key={path} className="flex items-center gap-3 p-2 bg-[var(--bg-primary)] rounded">
              <span className={`w-12 text-center text-[10px] font-bold rounded px-1 ${method === 'GET' ? 'text-green-400 bg-green-400/10' : 'text-blue-400 bg-blue-400/10'}`}>{method}</span>
              <span className="text-[#FF4500] flex-1">{path}</span>
              <span className="text-zinc-600 hidden md:block">{desc}</span>
            </div>
          ))}
        </div>
      </div>
    )
  },
  Status: {
    icon: Globe,
    title: "Network Status",
    body: (
      <div className="space-y-4 text-sm text-zinc-400">
        <div className="flex items-center gap-2 text-green-400 font-display text-lg">
          <CheckCircle size={20} weight="fill" /> All Systems Operational
        </div>
        {[
          ["API Server", "Operational", "green"],
          ["Block Producer", "Operational", "green"],
          ["SQLite Database", "Operational", "green"],
          ["MongoDB", "Degraded", "yellow"],
          ["Sepolia Bridge", "Maintenance", "yellow"],
          ["Cross-chain Bridge", "Coming Soon", "zinc"],
        ].map(([service, status, color]) => (
          <div key={service} className="flex items-center justify-between p-3 panel bg-[var(--bg-primary)]">
            <span>{service}</span>
            <span className={`text-xs font-mono text-${color}-400 flex items-center gap-1`}>
              <span className={`w-2 h-2 rounded-full bg-${color}-400 inline-block`}></span>
              {status}
            </span>
          </div>
        ))}
        <div className="text-xs text-zinc-600 text-center">Last updated: {new Date().toLocaleString()}</div>
      </div>
    )
  },
  Whitepaper: {
    icon: Book,
    title: "Ji Ledger Whitepaper v1.0",
    body: (
      <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
        {[
          ["Abstract", "Ji Ledger is a sovereign Web3 protocol stack designed for developers and learners to explore decentralized finance in a sandboxed, fully-featured environment."],
          ["1. Architecture", "Ji Ledger runs a simulated blockchain backed by SQLite for persistent block storage. Each transaction is hashed and chained, forming an immutable ledger. The backend exposes a RESTful API consumed by a React frontend."],
          ["2. Token Economics", "Every account is auto-issued a primary 0x wallet seeded with 1000 JI tokens. JI is the native currency used across all modules — wallets, tokens, NFTs, staking, and DAO governance."],
          ["3. Consensus", "The current consensus model is a single-node proof-of-authority (PoA) system, suitable for sandbox environments. Multi-node consensus is planned for v2."],
          ["4. Roadmap", "Q1 2026: Cross-chain bridge audit. Q3 2026: Bridge launch. Q4 2026: Multi-node testnet. 2027: Mainnet candidate."],
        ].map(([heading, text]) => (
          <div key={heading}>
            <div className="font-display text-[#FF4500] uppercase tracking-wider mb-1">{heading}</div>
            <p>{text}</p>
          </div>
        ))}
      </div>
    )
  }
};

function Modal({ item, onClose }) {
  const content = CONTENT[item.t] || item;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="panel bg-[var(--bg-panel)] p-8 w-full max-w-lg max-h-[80vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-zinc-500 hover:text-white"><X size={20} /></button>
        <div className="flex items-center gap-3 mb-6">
          <content.icon size={28} className="text-[#FF4500]" />
          <div className="font-display text-xl uppercase text-[var(--text-primary)]">{content.title}</div>
        </div>
        {content.body}
      </div>
    </div>
  );
}

const VALIDATOR_CONTENT = {
  t: "Validator",
  title: "Become a Validator",
  icon: DotsThreeOutlineVertical,
  body: (
    <div className="space-y-4 text-sm text-zinc-400 leading-relaxed">
      {[
        ["Minimum Stake", "10,000 JI tokens locked for a minimum of 30 epochs."],
        ["Hardware Requirements", "4-core CPU, 8GB RAM, 100GB SSD, stable 100 Mbps connection."],
        ["Uptime SLA", "Validators must maintain ≥ 99% uptime. Downtime results in slashing penalties."],
        ["Responsibilities", "Block validation, transaction ordering, governance participation, and network security."],
        ["Rewards", "Validators earn 8% APR on staked JI plus a share of transaction fees from every block."],
        ["Registration", "Node registration opens in the next epoch (Q4 2026). Whitelist your address early to reserve a slot."],
      ].map(([heading, text]) => (
        <div key={heading} className="p-3 panel bg-[var(--bg-primary)]">
          <div className="font-display text-[#FF4500] uppercase tracking-wider text-xs mb-1">{heading}</div>
          <p>{text}</p>
        </div>
      ))}
      <button className="btn-primary w-full opacity-50 cursor-not-allowed" disabled>Register Node (Opens Q4 2026)</button>
    </div>
  )
};

export default function MorePage() {
  const [selected, setSelected] = useState(null);

  const links = [
    { t: "Bridge", d: "Transfer assets across chains", icon: Bridge },
    { t: "API Docs", d: "Build on Ji Ledger", icon: Code },
    { t: "Status", d: "Real-time network monitoring", icon: Globe },
    { t: "Whitepaper", d: "Protocol specifications", icon: Book },
  ];

  return (
    <div className="p-6 md:p-12">
      <div className="label-mini">// ECOSYSTEM HUB</div>
      <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500] flex items-center gap-4">
        <DotsThreeOutlineVertical size={48} weight="bold" /> More
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
        {links.map(link => (
          <div
            key={link.t}
            onClick={() => setSelected(link)}
            className="panel p-8 bg-[var(--bg-panel)] group hover:bg-[var(--bg-panel)]/50 transition-all cursor-pointer border-[var(--border-color)] hover:border-[#FF4500]"
          >
            <link.icon size={40} className="text-[#FF4500] mb-6 group-hover:scale-110 transition-transform" />
            <div className="font-display text-2xl uppercase mb-2">{link.t}</div>
            <p className="text-zinc-500 text-xs leading-relaxed">{link.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 panel p-8 border-dashed flex flex-col items-center justify-center text-center">
        <div className="text-[#FF4500] font-display text-3xl mb-2 tracking-widest">BECOME A VALIDATOR</div>
        <p className="text-zinc-500 max-w-lg text-sm mb-6">
          Join the decentralized backbone of Ji Ledger. Node registration opens in the next epoch.
        </p>
        <button onClick={() => setSelected(VALIDATOR_CONTENT)} className="btn-ghost">Read Requirements</button>
      </div>

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}

    </div>
  );
}
