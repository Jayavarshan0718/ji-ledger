import { useEffect, useState } from "react";
import { MagnifyingGlass } from "@phosphor-icons/react";
import api from "@/lib/api";
import BlockCard from "@/components/BlockCard"; // Import the new component

export default function ExplorerPage() {
  const [blocks, setBlocks] = useState([]);
  const [stats, setStats] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      api.get("/explorer/blocks?limit=200"),
      api.get("/explorer/stats"),
    ]).then(([b, s]) => {
      setBlocks(b.data.blocks);
      setStats(s.data);
    });
  }, []);

  const filteredBlocks = blocks.filter((b) => {
    if (!search) return true;
    const query = search.toLowerCase();
    const data = b.tx_data || {};

    return (
      data.symbol?.toLowerCase().includes(query) ||
      b.tx_type.toLowerCase().includes(query) ||
      b.index.toString().includes(query) ||
      b.hash.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-6 md:p-12">
      <div className="label-mini">// MODULE 10</div>
      <h1 className="font-display text-4xl md:text-6xl uppercase mt-2">Block Explorer</h1>
      <p className="text-zinc-400 mt-2">Inspect every immutable block on the Ji Ledger.</p>

      {/* Token & Block Search */}
      <div className="relative mt-8 group">
        <MagnifyingGlass
          className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-[#FF4500] transition-colors"
          size={20}
        />
        <input
          type="text"
          placeholder="Search by token symbol (e.g. JI), transaction type, or block hash..."
          className="input-field pl-12 py-4 bg-[var(--bg-panel)] border-[var(--border-color)] focus:border-[#FF4500] transition-colors font-mono text-sm w-full"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8">
        <Stat label="Blocks" value={stats?.total_blocks} />
        <Stat label="Tokens" value={stats?.total_tokens} />
        <Stat label="NFTs" value={stats?.total_nfts} />
        <Stat label="Proposals" value={stats?.total_proposals} />
        <Stat label="Latest" value={stats?.latest_block} />
      </div>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredBlocks.map((block) => (
          <BlockCard key={block.hash} block={block} />
        ))}
      </div>
      {!filteredBlocks.length && (
        <div className="mt-20 text-center text-zinc-500 font-mono text-sm uppercase tracking-widest">
          // No matching blocks found
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }) {
  return ( // Added text-[var(--text-primary)] for visibility in light mode
    <div className="panel text-[var(--text-primary)]">
      <div className="label-mini">{label}</div>
      <div className="text-2xl font-bold mt-2">{value ?? "—"}</div>
    </div>
  );
}
