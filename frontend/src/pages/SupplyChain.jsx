import { useEffect, useState } from "react";
import { Copy, Package, Plus, QrCode, X } from "@phosphor-icons/react";
import { QRCodeSVG } from "qrcode.react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function SupplyPage() {
  const [products, setProducts] = useState([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [form, setForm] = useState({ name: "", sku: "", description: "", origin: "", category: "GENERAL" });
  const [cpForm, setCpForm] = useState({ location: "", handler: "", status: "", notes: "" });
  const [busy, setBusy] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);

  const refresh = async () => {
    const { data } = await api.get("/supply/products");
    setProducts(data.products);
  };

  useEffect(() => {
    refresh();
  }, []);

  const register = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/supply/register", form);
      toast.success("Product registered on chain");
      setCreateOpen(false);
      setForm({ name: "", sku: "", description: "", origin: "", category: "GENERAL" });
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const checkpoint = async (e) => {
    e.preventDefault();
    if (!active) return;
    setBusy(true);
    try {
      await api.post("/supply/checkpoint", { product_id: active.id, ...cpForm });
      toast.success(`Checkpoint logged: ${cpForm.status.toUpperCase()}`);
      const { data } = await api.get(`/supply/products/${active.id}`);
      setActive(data);
      setCpForm({ location: "", handler: "", status: "", notes: "" });
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed");
    } finally {
      setBusy(false);
    }
  };

  const publicUrl = active ? `${window.location.origin}/p/${active.public_id}` : "";

  return (
    <div className="p-6 md:p-12">
      <div className="flex flex-wrap items-end justify-between gap-4 text-[#FF4500]">
        <div>
          <div className="label-mini">// MODULE 05</div>
          <h1 className="font-display text-4xl md:text-6xl uppercase mt-2">Supply Chain</h1>
        </div>
        <button className="btn-primary inline-flex items-center gap-2" onClick={() => setCreateOpen(true)}>
          <Plus size={16} /> Register Product
        </button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-10">
        <div className="space-y-3">
          {products.map((p) => ( // Added key for list rendering
            <button
              key={p.id}
              className={`panel w-full text-left ${active?.id === p.id ? "border-[#FF4500]" : ""}`}
              onClick={() => setActive(p)}
            >
              <div className="flex items-center gap-3">
                <Package size={20} className="text-[#FF4500]" />
                <div>
                  <div className="font-bold">{p.name}</div>
                  <div className="text-xs text-zinc-500">SKU: {p.sku}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {active ? (
          <div className="panel space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-display text-2xl uppercase">{active.name}</div>
                <div className="text-xs text-zinc-500 mt-1">{active.public_id}</div>
              </div>
              <button className="btn-ghost" onClick={() => setQrOpen(true)}>
                <QrCode size={18} />
              </button>
            </div>
            <form onSubmit={checkpoint} className="space-y-2">
              <div className="label-mini">Add Checkpoint</div>
              <input className="input-field" placeholder="Location" value={cpForm.location} onChange={(e) => setCpForm({ ...cpForm, location: e.target.value })} />
              <input className="input-field" placeholder="Handler" value={cpForm.handler} onChange={(e) => setCpForm({ ...cpForm, handler: e.target.value })} />
              <input className="input-field" placeholder="Status" value={cpForm.status} onChange={(e) => setCpForm({ ...cpForm, status: e.target.value })} />
              <input className="input-field" placeholder="Notes" value={cpForm.notes} onChange={(e) => setCpForm({ ...cpForm, notes: e.target.value })} />
              <button className="btn-primary w-full" disabled={busy}>Log Checkpoint</button>
            </form>
            <div className="space-y-2 text-sm">
              {(active.checkpoints || []).map((cp) => (
                <div key={cp.id} className="border-b border-[#27272A] py-2">
                  <div className="font-bold">{cp.status}</div>
                  <div className="text-zinc-500">{cp.location} · {cp.handler}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="panel text-zinc-500">Select a product to manage checkpoints</div>
        )}
      </div>

      {createOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={register} className="panel w-full max-w-lg space-y-3">
            <div className="flex justify-between"><div className="font-display text-2xl uppercase">Register</div><button type="button" onClick={() => setCreateOpen(false)}><X /></button></div>
            <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="input-field" placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} required />
            <input className="input-field" placeholder="Origin" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} />
            <textarea className="input-field" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <button className="btn-primary w-full" disabled={busy}>Register</button>
          </form>
        </div>
      )}

      {qrOpen && active && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="panel text-center">
            <QRCodeSVG value={publicUrl} size={200} />
            <div className="mt-4 text-xs break-all">{publicUrl}</div>
            <button className="btn-ghost mt-4 inline-flex items-center gap-2" onClick={() => { navigator.clipboard.writeText(publicUrl); toast.success("Copied"); }}>
              <Copy size={14} /> Copy Link
            </button>
            <button className="btn-primary mt-4 block w-full" onClick={() => setQrOpen(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
