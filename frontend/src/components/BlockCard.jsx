import React, { useState } from 'react';
import { Cube, Hash, Clock, CaretDown, CaretUp } from '@phosphor-icons/react';

const TYPE_COLORS = {
  genesis: "text-green-400", transfer: "text-blue-400", faucet: "text-yellow-400",
  token_create: "text-purple-400", nft_mint: "text-pink-400", vote: "text-cyan-400",
  supply_register: "text-orange-400", supply_checkpoint: "text-red-400",
  sepolia_log: "text-indigo-400", siwe_login: "text-teal-400",
  account_created: "text-lime-400", token_transfer: "text-blue-400", proposal_create: "text-cyan-400",
};

const TX_LABELS = {
  genesis: (d) => `Wallet created • ${d?.address?.slice(0, 10)}…`,
  faucet: (d) => `Faucet • +${d?.amount} JI`,
  transfer: (d) => `${d?.amount} ${d?.symbol || "JI"} → ${d?.to?.slice(0, 10)}…`,
  token_transfer: (d) => `${d?.amount} ${d?.symbol} → ${d?.to?.slice(0, 10)}…`,
  token_create: (d) => `Token deployed: ${d?.name} (${d?.symbol})`,
  nft_mint: (d) => `NFT minted: ${d?.name}`,
  vote: (d) => `Voted ${d?.vote} on proposal #${d?.proposal_id}`,
  proposal_create: (d) => `Proposal: "${d?.title?.slice(0, 30)}…"`,
  siwe_login: (d) => `SIWE login • ${d?.address?.slice(0, 10)}…`,
  supply_register: (d) => `Product registered: ${d?.name}`,
  supply_checkpoint: (d) => `Checkpoint: ${d?.status}`,
};

export default function BlockCard({ block }) {
  const [open, setOpen] = useState(false);
  const color = TYPE_COLORS[block.tx_type] || "text-zinc-300";
  const summary = TX_LABELS[block.tx_type]?.(block.tx_data) || block.tx_type.replace(/_/g, ' ');

  return (
    <div className="panel p-4 flex flex-col gap-2 hover:border-[#FF4500]/50 transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-bold">
          <Cube size={15} className="text-[#FF4500]" />
          Block #{block.index}
        </div>
        <span className={`text-xs font-mono px-2 py-0.5 rounded bg-[var(--bg-primary)] ${color}`}>
          {block.tx_type.replace(/_/g, ' ')}
        </span>
      </div>

      <div className="text-xs text-[var(--text-secondary)] font-medium">{summary}</div>

      <div className="flex items-center gap-1 text-xs text-zinc-500 font-mono">
        <Hash size={12} />
        <span className="truncate">{block.hash}</span>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-600">
        <span className="flex items-center gap-1">
          <Clock size={12} />
          {new Date(block.timestamp).toLocaleString()}
        </span>
        {block.tx_data && Object.keys(block.tx_data).length > 0 && (
          <button onClick={() => setOpen(!open)} className="flex items-center gap-1 text-[#FF4500] hover:underline">
            {open ? <><CaretUp size={12} /> Hide</> : <><CaretDown size={12} /> Details</>}
          </button>
        )}
      </div>

      {open && block.tx_data && (
        <div className="mt-1 bg-[var(--bg-primary)] rounded p-2 text-[11px] font-mono text-zinc-400 space-y-0.5">
          {Object.entries(block.tx_data).map(([k, v]) => (
            <div key={k} className="flex gap-2">
              <span className="text-[#FF4500] min-w-[80px]">{k}:</span>
              <span className="truncate">{String(v)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
