import { useEffect, useState } from "react";
import { Plus } from "@phosphor-icons/react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function TokensPage() {
  const [tokens, setTokens] = useState([]);
  const [mine, setMine] = useState([]);
  const [form, setForm] = useState({ name: "", symbol: "", total_supply: "", description: "" });
  const [busy, setBusy] = useState(false);
  const [transferOpen, setTransferOpen] = useState(null);
  const [tForm, setTForm] = useState({ to_address: "", amount: "" });

  const refresh = async () => {
    const a = await api.get("/tokens/");
    setTokens(a.data.tokens);
    const b = await api.get("/tokens/mine");
    setMine(b.data.tokens);
  };

  useEffect(() => {
    refresh();
  }, []);

  const create = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/tokens/create", {
        name: form.name,
        symbol: form.symbol.toUpperCase(),
        total_supply: parseFloat(form.total_supply),
        description: form.description,
      });
      toast.success(`${form.symbol.toUpperCase()} deployed`);
      setForm({ name: "", symbol: "", total_supply: "", description: "" });
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Deploy failed");
    } finally {
      setBusy(false);
    }
  };

  const transfer = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await api.post("/tokens/transfer", {
        token_id: transferOpen.id,
        to_address: tForm.to_address,
        amount: parseFloat(tForm.amount),
      });
      toast.success("Transfer submitted");
      setTransferOpen(null);
      setTForm({ to_address: "", amount: "" });
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Transfer failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="p-6 md:p-12">
      <div className="label-mini">// MODULE 02</div>
      <h1 className="font-display text-4xl md:text-6xl uppercase mt-2">Token Foundry</h1>

      <div className="grid lg:grid-cols-5 gap-px bg-[#27272A] border border-[#27272A] mt-10">
        <form onSubmit={create} className="bg-[#0A0A0A] p-8 lg:col-span-2 space-y-3">
          <div className="label-mini flex items-center gap-2">
            <Plus size={14} /> Deploy Token
          </div>
          <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input-field" placeholder="Symbol" value={form.symbol} onChange={(e) => setForm({ ...form, symbol: e.target.value })} required />
          <input className="input-field" type="number" placeholder="Total Supply" value={form.total_supply} onChange={(e) => setForm({ ...form, total_supply: e.target.value })} required />
          <textarea className="input-field min-h-[80px]" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="btn-primary w-full" disabled={busy}>Deploy</button>
        </form>

        <div className="bg-[#0A0A0A] p-8 lg:col-span-3">
          <div className="label-mini mb-4">My Tokens</div>
          <div className="space-y-2">
            {mine.map((t) => (
              <div key={t.id} className="flex justify-between items-center border border-[#27272A] p-3">
                <div>
                  <div className="font-bold">{t.symbol}</div>
                  <div className="text-xs text-zinc-500">{t.name}</div>
                </div>
                <div className="text-right">
                  <div>{t.balance ?? t.total_supply}</div>
                  <button className="text-xs text-[#FF4500] mt-1" onClick={() => setTransferOpen(t)}>Transfer</button>
                </div>
              </div>
            ))}
          </div>
          <div className="label-mini mt-8 mb-4">All Tokens</div>
          <div className="space-y-2 text-sm">
            {tokens.map((t) => (
              <div key={t.id} className="flex justify-between border-b border-[#27272A] py-2">
                <span>{t.symbol}</span>
                <span className="text-zinc-500">{t.total_supply}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {transferOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <form onSubmit={transfer} className="panel w-full max-w-md space-y-3">
            <div className="font-display text-2xl uppercase">Transfer {transferOpen.symbol}</div>
            <input className="input-field" placeholder="To address" value={tForm.to_address} onChange={(e) => setTForm({ ...tForm, to_address: e.target.value })} required />
            <input className="input-field" type="number" placeholder="Amount" value={tForm.amount} onChange={(e) => setTForm({ ...tForm, amount: e.target.value })} required />
            <div className="flex gap-2">
              <button type="button" className="btn-ghost flex-1" onClick={() => setTransferOpen(null)}>Cancel</button>
              <button className="btn-primary flex-1" disabled={busy}>Send</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
