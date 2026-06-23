import { useEffect, useState } from "react";
import { toast } from "sonner";
import api from "@/lib/api";

export default function SepoliaPage() {
  const [history, setHistory] = useState([]);
  const [txHash, setTxHash] = useState("");
  const [action, setAction] = useState("bridge");
  const [amount, setAmount] = useState("");

  const refresh = async () => {
    const { data } = await api.get("/sepolia/history");
    setHistory(data.history);
  };

  useEffect(() => {
    refresh();
  }, []);

  const logTx = async (e) => {
    e.preventDefault();
    try {
      await api.post("/sepolia/log", {
        tx_hash: txHash,
        action,
        amount: amount ? parseFloat(amount) : null,
      });
      toast.success("Sepolia transaction logged");
      setTxHash("");
      setAmount("");
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Failed to log");
    }
  };

  return (
    <div className="p-6 md:p-12">
      <div className="label-mini">// SEPOLIA BRIDGE</div>
      <h1 className="font-display text-4xl md:text-6xl uppercase mt-2">Sepolia Testnet</h1>
      <p className="text-zinc-400 mt-2 max-w-2xl">
        Connect MetaMask to Sepolia and log testnet transactions against your Ji Ledger account.
      </p>

      <form onSubmit={logTx} className="panel mt-10 max-w-lg space-y-3">
        <input className="input-field" placeholder="Transaction hash (0x...)" value={txHash} onChange={(e) => setTxHash(e.target.value)} required />
        <input className="input-field" placeholder="Action (e.g. bridge, swap)" value={action} onChange={(e) => setAction(e.target.value)} />
        <input className="input-field" type="number" step="0.0001" placeholder="Amount (optional)" value={amount} onChange={(e) => setAmount(e.target.value)} />
        <button className="btn-primary w-full">Log Transaction</button>
      </form>

      <div className="panel mt-10">
        <div className="label-mini mb-4">History</div>
        <div className="space-y-2 text-sm">
          {history.map((h) => (
            <div key={h.id} className="grid md:grid-cols-4 gap-2 border-b border-[#27272A] py-2">
              <span className="truncate">{h.tx_hash.slice(0, 18)}…</span>
              <span>{h.action}</span>
              <span>{h.amount ?? "—"}</span>
              <span className="text-zinc-500">{new Date(h.created_at).toLocaleString()}</span>
            </div>
          ))}
          {!history.length && <div className="text-zinc-500">No Sepolia logs yet</div>}
        </div>
      </div>
    </div>
  );
}
