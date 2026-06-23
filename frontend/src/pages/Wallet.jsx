import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Copy, Drop, PaperPlaneRight, ArrowSquareOut, TrendUp, TrendDown } from "@phosphor-icons/react";
import { toast } from "sonner";
import api from "@/lib/api";

// Simulated live market news data
const LIVE_NEWS = [
  { id: 1, text: "SENSEX surges 342 pts to close at 82,342", type: "up" },
  { id: 2, text: "NIFTY 50 hits fresh all-time high of 25,078", type: "up" },
  { id: 3, text: "Bitcoin trades above $68,500 — up 3.2% in 24h", type: "up" },
  { id: 4, text: "Fed holds rates steady at 5.25-5.50%", type: "neutral" },
  { id: 5, text: "Gold prices dip 0.8% to $2,342/oz", type: "down" },
  { id: 6, text: "Crude oil falls below $78/bbl amid demand concerns", type: "down" },
  { id: 7, text: "Tesla shares jump 5% on Q2 delivery beat", type: "up" },
  { id: 8, text: "Indian rupee strengthens to 83.12 against USD", type: "up" },
  { id: 9, text: "NASDAQ composite gains 1.4% led by tech stocks", type: "up" },
  { id: 10, text: "European markets mixed; DAX up 0.3%, FTSE flat", type: "neutral" },
  { id: 11, text: "SENSEX today: Bank Nifty rises 400 pts, IT stocks rally", type: "up" },
  { id: 12, text: "Reliance Industries market cap crosses ₹20 lakh crore", type: "up" },
  { id: 13, text: "HDFC Bank Q1 net profit up 15% YoY to ₹16,500 cr", type: "up" },
  { id: 14, text: "SEBI introduces new F&O regulations effective Aug 1", type: "neutral" },
  { id: 15, text: "Wipro announces ₹10,000 cr share buyback program", type: "up" },
];

export default function WalletPage() {
  const [wallets, setWallets] = useState([]);
  const [txs, setTxs] = useState([]);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [busy, setBusy] = useState(false);
  const [faucetBusy, setFaucetBusy] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [showDeposit, setShowDeposit] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  const refresh = async () => {
    const w = await api.get("/wallet/me");
    setWallets(w.data.wallets);
    const t = await api.get("/wallet/transactions");
    setTxs(t.data.transactions);
  };

  useEffect(() => {
    refresh();
  }, []);

  const primary = wallets[0];

  const send = async (e) => {
    e.preventDefault();
    if (!primary) return;
    setBusy(true);
    try {
      const { data } = await api.post("/wallet/send", {
        from_address: primary.address,
        to_address: to,
        amount: parseFloat(amount),
        memo,
      });
      toast.success(`Sent. tx ${data.tx_hash.slice(0, 14)}…`);
      setTo("");
      setAmount("");
      setMemo("");
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Transfer failed");
    } finally {
      setBusy(false);
    }
  };

  const faucet = async () => {
    setFaucetBusy(true);
    try {
      const { data } = await api.post("/wallet/faucet");
      toast.success(`+500 JI. Balance: ${data.new_balance}`);
      refresh();
    } catch (err) {
      toast.error(err.response?.data?.detail || "Faucet failed");
    } finally {
      setFaucetBusy(false);
    }
  };

  const copy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied");
  };

  const handleDeposit = (e) => {
    e.preventDefault();
    toast.success(`Deposit request for ${depositAmount} JI submitted. Check your external wallet.`);
    setDepositAmount("");
    setShowDeposit(false);
  };

  const handleWithdraw = (e) => {
    e.preventDefault();
    if (!primary || parseFloat(withdrawAmount) > primary.balance) {
      return toast.error("Insufficient balance");
    }
    toast.success(`Withdrawal of ${withdrawAmount} JI initiated to your external wallet.`);
    setWithdrawAmount("");
    setShowWithdraw(false);
  };

  return (
    <div className="p-6 md:p-12">
      <div className="label-mini">// MODULE 05</div>
      <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">Wallet</h1>

      {/* Deposit / Withdraw Action Bar */}
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          onClick={() => { setShowDeposit(!showDeposit); setShowWithdraw(false); }}
          className="btn-secondary flex items-center gap-2"
        >
          <TrendUp size={18} weight="bold" /> Deposit
        </button>
        <button
          onClick={() => { setShowWithdraw(!showWithdraw); setShowDeposit(false); }}
          className="btn-secondary flex items-center gap-2"
        >
          <TrendDown size={18} weight="bold" /> Withdraw
        </button>
      </div>

      {/* Deposit form */}
      {showDeposit && (
        <form onSubmit={handleDeposit} className="mt-4 panel border-[#FF4500]/30 max-w-md">
          <div className="label-mini mb-3 text-[#FF4500]">Deposit Funds</div>
          <input
            className="input-field"
            type="number"
            step="0.01"
            placeholder="Amount (JI)"
            value={depositAmount}
            onChange={(e) => setDepositAmount(e.target.value)}
            required
          />
          <p className="text-[10px] text-zinc-500 mt-2">Deposit from external wallet. Processing time: ~2-5 min.</p>
          <button className="btn-primary mt-3 w-full" type="submit">Request Deposit</button>
        </form>
      )}

      {/* Withdraw form */}
      {showWithdraw && (
        <form onSubmit={handleWithdraw} className="mt-4 panel border-[#FF4500]/30 max-w-md">
          <div className="label-mini mb-3 text-[#FF4500]">Withdraw Funds</div>
          <input
            className="input-field"
            type="number"
            step="0.01"
            placeholder="Amount (JI)"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            required
          />
          <p className="text-[10px] text-zinc-500 mt-2">Max: {primary ? primary.balance.toLocaleString() : "0"} JI</p>
          <button className="btn-primary mt-3 w-full" type="submit">Request Withdrawal</button>
        </form>
      )}

      <div className="grid lg:grid-cols-3 gap-px bg-[#27272A] border border-[#27272A] mt-6">
        <div className="bg-[var(--bg-panel)] p-8 lg:col-span-2">
          <div className="label-mini">Primary Account</div>
          {primary ? (
            <>
              <div className="font-display text-4xl mt-3">
                {primary.balance.toLocaleString(undefined, { maximumFractionDigits: 2 })} JI
              </div>
              <div className="mt-4 flex items-center gap-2 text-sm text-zinc-400">
                <span className="truncate">{primary.address}</span>
                <button onClick={() => copy(primary.address)}>
                  <Copy size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="mt-4 text-zinc-500">No wallet found</div>
          )}
          <button className="btn-ghost mt-6 inline-flex items-center gap-2" onClick={faucet} disabled={faucetBusy}>
            <Drop size={16} /> {faucetBusy ? "Claiming..." : "Faucet +500 JI"}
          </button>
        </div>

        <form onSubmit={send} className="bg-[var(--bg-panel)] p-8 space-y-3">
          <div className="label-mini">Send JI</div>
          <input className="input-field" placeholder="To address (0x...)" value={to} onChange={(e) => setTo(e.target.value)} required />
          <input className="input-field" type="number" step="0.01" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <input className="input-field" placeholder="Memo (optional)" value={memo} onChange={(e) => setMemo(e.target.value)} />
          <button className="btn-primary w-full inline-flex items-center justify-center gap-2" disabled={busy || !primary}>
            <PaperPlaneRight size={16} /> Send
          </button>
        </form>
      </div>

      {/* Live Market News Ticker */}
      <div className="mt-8 panel bg-[#FF4500]/5 border-[#FF4500]/20 overflow-hidden">
        <div className="label-mini text-[#FF4500] mb-3 flex items-center gap-2">
          <span className="w-2 h-2 bg-[#FF4500] rounded-full animate-pulse" />
          LIVE MARKET NEWS · SENSEX · NIFTY · CRYPTO · COMMODITIES
        </div>
        <div className="overflow-hidden whitespace-nowrap">
          <div className="animate-news-ticker inline-flex">
            {[...LIVE_NEWS, ...LIVE_NEWS].map((news, i) => (
              <span key={`${news.id}-${i}`} className="news-item">
                <span className={`news-dot ${news.type === "up" ? "bg-green-400" : news.type === "down" ? "bg-red-400" : "bg-yellow-400"}`} />
                <span className="text-xs font-mono">{news.text}</span>
                {news.type === "up" ? (
                  <TrendUp size={12} weight="bold" className="text-green-400" />
                ) : news.type === "down" ? (
                  <TrendDown size={12} weight="bold" className="text-red-400" />
                ) : null}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Sensex & Nifty Mini Dashboard */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="panel text-center">
          <div className="label-mini">SENSEX</div>
          <div className="font-display text-2xl mt-1 text-green-400">82,342.15</div>
          <div className="text-[10px] text-green-400 flex items-center justify-center gap-1">
            <TrendUp size={12} weight="bold" /> +342.28 (0.42%)
          </div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">NIFTY 50</div>
          <div className="font-display text-2xl mt-1 text-green-400">25,078.45</div>
          <div className="text-[10px] text-green-400 flex items-center justify-center gap-1">
            <TrendUp size={12} weight="bold" /> +108.90 (0.44%)
          </div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">BTC/USD</div>
          <div className="font-display text-2xl mt-1 text-green-400">$68,524</div>
          <div className="text-[10px] text-green-400 flex items-center justify-center gap-1">
            <TrendUp size={12} weight="bold" /> +3.2%
          </div>
        </div>
        <div className="panel text-center">
          <div className="label-mini">GOLD (INR)</div>
          <div className="font-display text-2xl mt-1 text-red-400">₹63,450</div>
          <div className="text-[10px] text-red-400 flex items-center justify-center gap-1">
            <TrendDown size={12} weight="bold" /> -0.8%
          </div>
        </div>
      </div>

      {/* Transactions */}
      <div className="panel mt-8">
        <div className="label-mini mb-4">Recent Transactions</div>
        <div className="grid grid-cols-5 text-[10px] text-zinc-500 uppercase mb-2 px-2 font-mono">
          <span>Hash</span>
          <span>From</span>
          <span>To</span>
          <span>Amount</span>
          <span className="text-right">Explorer</span>
        </div>
        <div className="space-y-1">
          {txs.map((tx) => (
            <div key={tx.id} className="grid grid-cols-5 gap-2 border-b border-[#27272A]/30 py-2 px-2 text-xs font-mono items-center hover:bg-white/5 transition-colors">
              <span className="text-[#FF4500] truncate">{tx.tx_hash.slice(0, 10)}…</span>
              <span className="truncate text-zinc-400">{tx.from_address.slice(0, 8)}…</span>
              <span className="truncate text-zinc-400">{tx.to_address.slice(0, 8)}…</span>
              <span className="font-bold">{tx.amount} JI</span>
              <div className="text-right">
                <Link to="/app/explorer" className="text-zinc-500 hover:text-[#FF4500] inline-flex items-center gap-1">
                  <ArrowSquareOut size={14} />
                </Link>
              </div>
            </div>
          ))}
          {!txs.length && <div className="text-zinc-500 p-2">No transactions yet</div>}
        </div>
      </div>
    </div>
  );
}