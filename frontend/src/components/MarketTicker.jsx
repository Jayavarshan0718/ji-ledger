import { useEffect, useState } from "react";
import api from "@/lib/api";

const FALLBACK = [
  { symbol: "JI/USD", price: 1.42, change24h: 5.24 },
  { symbol: "BTC/USD", price: 64231.1, change24h: 1.28 },
  { symbol: "ETH/USD", price: 3421.44, change24h: -0.82 },
  { symbol: "SOL/USD", price: 145.2, change24h: 4.51 },
  { symbol: "BNB/USD", price: 592.1, change24h: 0.12 },
];

function formatPrice(price) {
  if (price >= 1000) return price.toLocaleString(undefined, { maximumFractionDigits: 2 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

export default function MarketTicker() {
  const [pairs, setPairs] = useState(FALLBACK);

  useEffect(() => {
    api.get("/markets/ticker")
      .then((r) => setPairs(r.data.pairs || FALLBACK))
      .catch(() => setPairs(FALLBACK));
    const id = setInterval(() => {
      api.get("/markets/ticker")
        .then((r) => setPairs(r.data.pairs || FALLBACK))
        .catch(() => {});
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const text = pairs
    .map((p) => {
      const sign = p.change24h >= 0 ? "+" : "";
      return `${p.symbol} $${formatPrice(p.price)} (${sign}${p.change24h.toFixed(2)}%)`;
    })
    .join(" • ");

  return (
    <div className="bg-[#FF4500] text-black overflow-hidden whitespace-nowrap py-1.5 font-mono text-xs font-bold uppercase tracking-widest relative z-30 shrink-0">
      <div className="animate-marquee inline-block">{text} • JI LEDGER MAINNET: ONLINE •</div>
      <div className="animate-marquee inline-block ml-8">{text} • GAS: 12 GWEI •</div>
    </div>
  );
}
