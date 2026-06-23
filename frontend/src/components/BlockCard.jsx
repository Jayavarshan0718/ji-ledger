import React from 'react';
import { Cube, Hash, Clock, Code } from '@phosphor-icons/react';

const TYPE_COLORS = {
    genesis: "text-green-400",
    transfer: "text-blue-400",
    faucet: "text-yellow-400",
    token_create: "text-purple-400",
    nft_mint: "text-pink-400",
    vote: "text-cyan-400",
    supply_register: "text-orange-400",
    supply_checkpoint: "text-red-400",
    sepolia_log: "text-indigo-400",
    siwe_login: "text-teal-400",
    // Add any other transaction types from server.js if they appear in blocks
    account_created: "text-lime-400", // Often part of genesis or initial setup
    token_transfer: "text-blue-400", // Alias for transfer if used differently
    proposal_create: "text-cyan-400", // For DAO proposals
};

export default function BlockCard({ block }) {
    const blockTypeColor = TYPE_COLORS[block.tx_type] || "text-zinc-300";

    return (
        <div className="panel p-4 flex flex-col gap-2 hover:scale-[1.02] transition-transform duration-200 ease-in-out">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm">
                    <Cube size={16} className="text-[#FF4500]" />
                    <span className="font-bold">Block #{block.index}</span>
                </div>
                <span className={`text-xs font-mono ${blockTypeColor}`}>{block.tx_type.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Hash size={14} />
                <span className="truncate">{block.hash}</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-600">
                <Code size={14} />
                <span className="truncate">Prev: {block.prev_hash.slice(0, 12)}…</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
                <Clock size={14} />
                <span>{new Date(block.timestamp).toLocaleString()}</span>
            </div>
            {block.tx_data && (
                <div className="text-xs text-zinc-400 mt-1 max-h-12 overflow-hidden">
                    <pre className="whitespace-pre-wrap font-mono text-[10px] bg-[#111] p-1 rounded">
                        {JSON.stringify(block.tx_data, null, 2).slice(0, 100)}...
                    </pre>
                </div>
            )}
        </div>
    );
}