import { useState, useRef } from "react";
import { Rocket, Coins, Image, UploadSimple, MagnifyingGlass, TrendUp } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function TokenLaunchpadPage() {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [symbol, setSymbol] = useState("");
  const [supply, setSupply] = useState("");
  const [description, setDescription] = useState("");
  const [logo, setLogo] = useState(null);
  const [search, setSearch] = useState("");
  const fileRef = useRef(null);
  const [tokens, setTokens] = useState([
    { name: "Ji Token", symbol: "JI", supply: 1000000, creator: "0xabc...", launched: "2025-06-01", price: 1.42, change: 5.2, logo: null },
    { name: "MemeCoin", symbol: "MEME", supply: 500000, creator: "0xdef...", launched: "2025-06-15", price: 0.05, change: -2.1, logo: null },
    { name: "DeFi Forge", symbol: "DFF", supply: 2500000, creator: "0x123...", launched: "2025-07-01", price: 2.85, change: 8.4, logo: null },
  ]);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Logo must be under 2MB");
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => setLogo(event.target.result);
    reader.readAsDataURL(file);
  };

  const createToken = (e) => {
    e.preventDefault();
    if (!name || !symbol || !supply) {
      toast.error("Fill all required fields");
      return;
    }
    const newToken = {
      name,
      symbol: symbol.toUpperCase(),
      supply: parseFloat(supply),
      creator: "0xyou...",
      launched: new Date().toISOString().split("T")[0],
      price: Math.random() * 10 + 0.01,
      change: (Math.random() - 0.4) * 20,
      logo,
    };
    setTokens([newToken, ...tokens]);
    toast.success(`Token ${symbol.toUpperCase()} created successfully!`);
    setShowForm(false);
    setName(""); setSymbol(""); setSupply(""); setDescription(""); setLogo(null);
  };

  const filteredTokens = tokens.filter(t => 
    !search || 
    t.symbol.toLowerCase().includes(search.toLowerCase()) || 
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12">
      <div className="flex justify-between items-center">
        <div>
          <div className="label-mini">// TOKEN LAUNCHPAD</div>
          <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">Launchpad</h1> 
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">+ Create Token</button>
      </div>

      {showForm && (
        <form onSubmit={createToken} className="mt-6 panel border-[#FF4500]/30 max-w-lg">
          <div className="label-mini text-[#FF4500] mb-4">Launch New Token</div>
          <div className="space-y-3">
            <input className="input-field" placeholder="Token Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <input className="input-field" placeholder="Symbol (e.g. BTC)" value={symbol} onChange={(e) => setSymbol(e.target.value)} required />
            <input className="input-field" type="number" placeholder="Total Supply" value={supply} onChange={(e) => setSupply(e.target.value)} required />
            <textarea className="input-field min-h-[60px]" placeholder="Description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
            
            {/* Logo upload */}
            <div className="flex items-center gap-4">
              {logo ? (
                <img src={logo} alt="Token logo" className="w-16 h-16 rounded-full object-cover border border-[#FF4500]" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[var(--bg-primary)] border border-dashed border-zinc-600 flex items-center justify-center">
                  <Image size={24} className="text-zinc-500" />
                </div>
              )}
              <div>
                <button type="button" onClick={() => fileRef.current?.click()} className="btn-ghost text-xs">
                  <UploadSimple size={14} className="inline mr-1" /> Upload Logo
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
                <div className="text-[10px] text-zinc-500 mt-1">PNG, JPG, SVG (max 2MB)</div>
              </div>
            </div>

            <div className="p-3 bg-[#FF4500]/5 border border-[#FF4500]/20 rounded text-xs">
              <div className="text-zinc-500 mb-1">Token Details</div>
              <div>Name: {name || "—"}</div>
              <div>Symbol: {symbol ? symbol.toUpperCase() : "—"}</div>
              <div>Supply: {supply ? parseFloat(supply).toLocaleString() : "—"}</div>
            </div>

            <button className="btn-primary w-full" type="submit">
              <Rocket size={18} className="inline mr-2" /> Deploy Token
            </button>
          </div>
        </form>
      )}

      {/* Search */}
      <div className="relative mt-6">
        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
        <input type="text" placeholder="Search tokens by name or symbol..." className="input-field pl-12 py-3" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      {/* Token List */}
      <div className="mt-6 space-y-2">
        {filteredTokens.map((t, i) => (
          <div key={i} className="panel flex items-center justify-between hover:border-[#FF4500]/30 transition-colors">
            <div className="flex items-center gap-4">
              {t.logo ? (
                <img src={t.logo} alt={t.symbol} className="w-10 h-10 rounded-full object-cover" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#FF4500]/20 flex items-center justify-center">
                  <Rocket size={20} weight="fill" className="text-[#FF4500]" />
                </div>
              )}
              <div>
                <div className="font-bold">{t.name} <span className="text-[#FF4500]">({t.symbol})</span></div>
                <div className="text-xs text-zinc-500">By {t.creator} · {t.launched}</div>
              </div>
            </div>
            <div className="text-right flex items-center gap-6">
              <div>
                <div className="font-mono">${t.price?.toFixed(t.price < 1 ? 4 : 2)}</div>
                <div className={`text-xs flex items-center gap-1 justify-end ${(t.change || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                  <TrendUp size={10} weight="bold" />
                  {(t.change || 0) >= 0 ? "+" : ""}{t.change?.toFixed(1)}%
                </div>
              </div>
              <div className="text-right">
                <div className="font-mono text-sm">{t.supply.toLocaleString()}</div>
                <div className="text-[10px] text-green-400">Live</div>
              </div>
            </div>
          </div>
        ))}
        {filteredTokens.length === 0 && (
          <div className="panel text-center text-zinc-500">No tokens found</div>
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 panel bg-[#FF4500]/5 border-[#FF4500]/20">
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div>
            <div className="text-zinc-500 text-[10px] uppercase">Total Tokens</div>
            <div className="font-display text-2xl mt-1">{tokens.length}</div>
          </div>
          <div>
            <div className="text-zinc-500 text-[10px] uppercase">Total Supply</div>
            <div className="font-display text-2xl mt-1">{(tokens.reduce((s, t) => s + t.supply, 0) / 1e6).toFixed(1)}M</div>
          </div>
          <div>
            <div className="text-zinc-500 text-[10px] uppercase">Market Cap</div>
            <div className="font-display text-2xl mt-1">${(tokens.reduce((s, t) => s + t.supply * (t.price || 0), 0) / 1e6).toFixed(1)}M</div>
          </div>
        </div>
      </div>
    </div>
  );
}