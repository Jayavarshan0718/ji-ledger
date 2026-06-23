import { useEffect, useRef, useState } from "react";
import { UploadSimple, ShoppingCart, Tag, Gavel, ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { toast } from "sonner";
import api from "@/lib/api";

const MOCK_MARKETPLACE = [
  { id: "nft1", name: "Cyber Punk #001", description: "Rare digital artwork", image_url: null, price: 2.5, seller: "0xabc...", collection: "Genesis" },
  { id: "nft2", name: "Diamond Hand #042", description: "HODL till moon", image_url: null, price: 1.8, seller: "0xdef...", collection: "Genesis" },
  { id: "nft3", name: "JI Guardian", description: "Protector of the chain", image_url: null, price: 5.0, seller: "0x123...", collection: "Heroes" },
  { id: "nft4", name: "Pixel Warrior", description: "8-bit legend", image_url: null, price: 0.75, seller: "0x456...", collection: "Pixel" },
  { id: "nft5", name: "Golden JI", description: "Limited edition gold", image_url: null, price: 10.0, seller: "0x789...", collection: "Premium" },
  { id: "nft6", name: "DeFi Dragon", description: "Fire breathing DeFi", image_url: null, price: 3.2, seller: "0xaaa...", collection: "Mythical" },
];

export default function NFTPage() {
  const [tab, setTab] = useState("marketplace");
  const [all, setAll] = useState([]);
  const [mine, setMine] = useState([]);
  const [marketplace, setMarketplace] = useState(MOCK_MARKETPLACE);
  const [form, setForm] = useState({ name: "", description: "", image_url: "", collection: "Genesis" });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [sellMode, setSellMode] = useState(null);
  const [sellPrice, setSellPrice] = useState("");
  const [search, setSearch] = useState("");
  const fileRef = useRef(null);

  const refresh = async () => {
    try {
      const a = await api.get("/nft/");
      setAll(a.data.nfts);
      const b = await api.get("/nft/mine");
      setMine(b.data.nfts);
    } catch (err) {
      // Use mock data
    }
  };

  useEffect(() => {
    refresh();
  }, []);

  const mint = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/nft/mint", { ...form, attributes: [] });
      toast.success(`Minted ${form.name}`);
      setForm({ name: "", description: "", image_url: "", collection: "Genesis" });
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Mint failed");
    } finally {
      setBusy(false);
    }
  };

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Max 5MB");
      return;
    }
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await api.post("/files/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setForm((f) => ({ ...f, image_url: data.url }));
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Upload failed");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const listForSale = (nft) => {
    setSellMode(nft);
    setSellPrice(nft.price?.toString() || "1.0");
  };

  const confirmSale = () => {
    if (!sellPrice || parseFloat(sellPrice) <= 0) {
      toast.error("Enter a valid price");
      return;
    }
    const newListing = {
      id: `nft${Date.now()}`,
      name: sellMode.name,
      description: sellMode.description || "",
      image_url: sellMode.image_url,
      price: parseFloat(sellPrice),
      seller: "0xyou...",
      collection: sellMode.collection || "Genesis",
    };
    setMarketplace([newListing, ...marketplace]);
    toast.success(`Listed ${sellMode.name} for $${sellPrice}`);
    setSellMode(null);
    setSellPrice("");
  };

  const buyNFT = (nft) => {
    toast.success(`Purchased ${nft.name} for $${nft.price}`);
    setMarketplace(marketplace.filter(m => m.id !== nft.id));
    setMine([...mine, {
      id: nft.id,
      name: nft.name,
      description: nft.description,
      image_url: nft.image_url,
      collection: nft.collection,
      token_id: (mine.length + 1).toString(),
    }]);
  };

  const filteredMarket = marketplace.filter(nft =>
    !search || nft.name.toLowerCase().includes(search.toLowerCase()) || nft.collection.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 md:p-12">
      <div className="label-mini">// NFT STUDIO</div>
      <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">NFT Marketplace</h1>

      {/* Tabs */}
      <div className="flex gap-2 mt-6">
        {["marketplace", "mint", "mine"].map((t) => (
          <button key={t} className={`btn-ghost ${tab === t ? "border-[#FF4500] bg-[#FF4500]/10" : ""}`} onClick={() => setTab(t)}>
            {t === "marketplace" ? "Marketplace" : t === "mint" ? "Mint NFT" : "My NFTs"}
          </button>
        ))}
      </div>

      {/* Search for marketplace */}
      {tab === "marketplace" && (
        <div className="relative mt-4">
          <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
          <input type="text" placeholder="Search NFTs by name or collection..." className="input-field pl-12 py-3" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      )}

      {/* Sell Modal */}
      {sellMode && (
        <div className="mt-4 panel border-[#FF4500]/30 max-w-md">
          <div className="label-mini text-[#FF4500] mb-3">List for Sale: {sellMode.name}</div>
          <input className="input-field" type="number" placeholder="Price in ETH" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} step="0.01" min="0.01" />
          <div className="flex gap-2 mt-4">
            <button onClick={confirmSale} className="btn-primary flex-1">List for Sale</button>
            <button onClick={() => setSellMode(null)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Marketplace View */}
      {tab === "marketplace" && (
        <div className="mt-6">
          <div className="label-mini mb-4">Available NFTs ({filteredMarket.length})</div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredMarket.map((nft) => (
              <div key={nft.id} className="panel text-[var(--text-primary)] hover:border-[#FF4500]/30 transition-colors">
                <div className="aspect-square bg-gradient-to-br from-[#FF4500]/20 to-purple-500/20 flex items-center justify-center border border-[var(--border-color)]">
                  {nft.image_url ? (
                    <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-display text-[#FF4500]">#</span>
                  )}
                </div>
                <div className="mt-3">
                  <div className="font-bold">{nft.name}</div>
                  <div className="text-xs text-zinc-500">{nft.collection}</div>
                  <div className="flex justify-between items-center mt-2">
                    <div className="font-mono text-[#FF4500]">${nft.price.toFixed(2)}</div>
                    <div className="text-[10px] text-zinc-500">{nft.seller?.slice(0, 6)}...</div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button onClick={() => buyNFT(nft)} className="btn-primary text-xs py-2 flex-1 flex items-center justify-center gap-1">
                      <ShoppingCart size={14} /> Buy
                    </button>
                    <button onClick={() => listForSale(nft)} className="btn-ghost text-xs py-2 flex items-center gap-1">
                      <Tag size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {filteredMarket.length === 0 && (
              <div className="col-span-full panel text-center text-zinc-500">No NFTs in marketplace</div>
            )}
          </div>
        </div>
      )}

      {/* Mint View */}
      {tab === "mint" && (
        <div className="grid lg:grid-cols-2 gap-6 mt-6">
          <form onSubmit={mint} className="panel space-y-3">
            <div className="label-mini">Mint New NFT</div>
            <input className="input-field" placeholder="NFT Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <textarea className="input-field min-h-[80px]" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="input-field" placeholder="Collection" value={form.collection} onChange={(e) => setForm({ ...form, collection: e.target.value })} />
            <input className="input-field" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            <div className="flex flex-col gap-2">
              <button type="button" className="btn-ghost w-full inline-flex items-center justify-center gap-2" onClick={() => fileRef.current?.click()} disabled={uploading}>
                <UploadSimple size={18} /> {uploading ? "Uploading..." : "Upload Image"}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPickFile} />
            </div>
            <button className="btn-primary w-full" disabled={busy}>Mint NFT</button>
          </form>

          <div className="panel">
            <div className="label-mini mb-4">Preview</div>
            <div className="aspect-square bg-gradient-to-br from-[#FF4500]/20 to-purple-500/20 flex items-center justify-center border border-dashed border-zinc-600">
              {form.image_url ? (
                <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-zinc-500">
                  <UploadSimple size={48} className="mx-auto mb-2" />
                  <div className="text-xs">Upload or paste image URL</div>
                </div>
              )}
            </div>
            <div className="mt-3 text-sm">
              <div className="font-bold">{form.name || "NFT Name"}</div>
              <div className="text-xs text-zinc-500">{form.description || "Description"}</div>
              <div className="text-[10px] text-zinc-500 mt-1">Collection: {form.collection}</div>
            </div>
          </div>
        </div>
      )}

      {/* My NFTs View */}
      {tab === "mine" && (
        <div className="mt-6">
          <div className="label-mini mb-4">My NFTs ({mine.length})</div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mine.map((nft) => (
              <div key={nft.id} className="panel text-[var(--text-primary)]">
                <div className="aspect-square bg-gradient-to-br from-[#FF4500]/20 to-purple-500/20 flex items-center justify-center border border-[var(--border-color)]">
                  {nft.image_url ? (
                    <img src={nft.image_url} alt={nft.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl font-display text-[#FF4500]">#</span>
                  )}
                </div>
                <div className="mt-3">
                  <div className="font-bold">{nft.name}</div>
                  <div className="text-xs text-zinc-500">#{nft.token_id}</div>
                  <button onClick={() => listForSale(nft)} className="btn-ghost w-full mt-3 text-xs py-2 flex items-center justify-center gap-1">
                    <Tag size={14} /> List for Sale
                  </button>
                </div>
              </div>
            ))}
            {mine.length === 0 && (
              <div className="col-span-full panel text-center text-zinc-500">No NFTs owned yet. Mint or buy from marketplace!</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}