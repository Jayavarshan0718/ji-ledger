import { useState, useEffect } from "react";
import { Star, Bell, Trash, Plus, TrendUp, TrendDown, Alarm, ArrowDown } from "@phosphor-icons/react";
import { toast } from "sonner";

const ASSETS = [
  { symbol: "BTC", name: "Bitcoin", price: 64231.1, change: 2.4 },
  { symbol: "ETH", name: "Ethereum", price: 3421.44, change: -0.8 },
  { symbol: "SOL", name: "Solana", price: 145.2, change: 4.5 },
  { symbol: "AAPL", name: "Apple Inc.", price: 198.5, change: 1.2 },
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.8, change: -1.5 },
  { symbol: "NIFTY", name: "Nifty 50", price: 25078.45, change: 0.44 },
  { symbol: "JI", name: "Ji Ledger", price: 1.42, change: 5.2 },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.5, change: 0.8 },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 785.3, change: 3.4 },
];

const INITIAL_WATCHLIST = ["BTC", "ETH", "SOL"];

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState(INITIAL_WATCHLIST);
  const [alerts, setAlerts] = useState({});
  const [alertThresholds, setAlertThresholds] = useState({});
  const [showThreshold, setShowThreshold] = useState(null);
  const [thresholdValue, setThresholdValue] = useState("");
  const [prices, setPrices] = useState({});
  const [changes, setChanges] = useState({});

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setPrices(prev => {
        const newPrices = { ...prev };
        ASSETS.forEach(asset => {
          const basePrice = asset.price;
          const currentPrice = newPrices[asset.symbol] || basePrice;
          const change = (Math.random() - 0.48) * 0.02 * currentPrice;
          newPrices[asset.symbol] = Math.max(0.01, currentPrice + change);
        });
        return newPrices;
      });
      setChanges(prev => {
        const newChanges = { ...prev };
        ASSETS.forEach(asset => {
          const baseChange = asset.change;
          newChanges[asset.symbol] = baseChange + (Math.random() - 0.5) * 0.5;
        });
        return newChanges;
      });

      // Check alerts
      Object.entries(alertThresholds).forEach(([symbol, threshold]) => {
        const currentPrice = prices[symbol] || ASSETS.find(a => a.symbol === symbol)?.price;
        if (currentPrice && threshold) {
          if (currentPrice >= parseFloat(threshold)) {
            toast.success(`🔔 ${symbol} hit target: $${currentPrice.toFixed(2)}`);
            setAlertThresholds(prev => {
              const newThresholds = { ...prev };
              delete newThresholds[symbol];
              return newThresholds;
            });
            setAlerts(prev => ({ ...prev, [symbol]: false }));
          }
        }
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [alertThresholds, prices]);

  const toggleWatch = (symbol) => {
    if (watchlist.includes(symbol)) {
      setWatchlist(watchlist.filter((s) => s !== symbol));
      toast.success(`Removed ${symbol} from watchlist`);
    } else {
      setWatchlist([...watchlist, symbol]);
      toast.success(`Added ${symbol} to watchlist`);
    }
  };

  const toggleAlert = (symbol) => {
    if (alerts[symbol]) {
      setAlerts({ ...alerts, [symbol]: false });
      setAlertThresholds(prev => {
        const newThresholds = { ...prev };
        delete newThresholds[symbol];
        return newThresholds;
      });
      toast.success(`Alert disabled for ${symbol}`);
    } else {
      setShowThreshold(symbol);
      setThresholdValue("");
    }
  };

  const setAlert = () => {
    if (!thresholdValue) return;
    setAlerts({ ...alerts, [showThreshold]: true });
    setAlertThresholds({ ...alertThresholds, [showThreshold]: thresholdValue });
    toast.success(`Alert set for ${showThreshold} at $${thresholdValue}`);
    setShowThreshold(null);
    setThresholdValue("");
  };

  const getPrice = (symbol) => {
    return prices[symbol] || ASSETS.find(a => a.symbol === symbol)?.price || 0;
  };

  const getChange = (symbol) => {
    return changes[symbol] || ASSETS.find(a => a.symbol === symbol)?.change || 0;
  };

  const watchedAssets = ASSETS.filter(a => watchlist.includes(a.symbol));
  const availableAssets = ASSETS.filter(a => !watchlist.includes(a.symbol));

  return (
    <div className="p-6 md:p-12">
      <div className="flex justify-between items-center">
        <div>
          <div className="label-mini">// WATCHLIST</div>
          <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">Watchlist</h1>
        </div>
        <div className="text-xs text-zinc-500 font-mono">Live Prices · Auto-update</div>
      </div>

      {/* Alert threshold modal */}
      {showThreshold && (
        <div className="mt-4 panel border-[#FF4500]/30 max-w-md">
          <div className="label-mini text-[#FF4500] mb-3">Set Price Alert for {showThreshold}</div>
          <div className="flex gap-2">
            <input className="input-field" type="number" placeholder="Target price $" value={thresholdValue} onChange={(e) => setThresholdValue(e.target.value)} />
            <button onClick={setAlert} className="btn-primary px-6">Set</button>
            <button onClick={() => setShowThreshold(null)} className="btn-ghost">Cancel</button>
          </div>
          <div className="text-xs text-zinc-500 mt-2">Current: ${getPrice(showThreshold).toFixed(2)}</div>
        </div>
      )}

      {/* Watched Assets */}
      <div className="mt-8">
        <div className="label-mini mb-4">Watched ({watchedAssets.length})</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {watchedAssets.map((asset) => {
            const currentPrice = getPrice(asset.symbol);
            const currentChange = getChange(asset.symbol);
            const isUp = currentChange >= 0;
            return (
              <div key={asset.symbol} className="panel border-[#FF4500]/40 transition-all hover:border-[#FF4500]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-lg">{asset.symbol}</div>
                    <div className="text-xs text-zinc-500">{asset.name}</div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => toggleAlert(asset.symbol)} 
                      className={`p-1.5 rounded transition-colors ${alerts[asset.symbol] ? "bg-[#FF4500] text-black" : "hover:bg-white/10 text-zinc-500"}`}
                      title={alerts[asset.symbol] ? "Alert active" : "Set price alert"}>
                      <Alarm size={16} weight={alerts[asset.symbol] ? "fill" : "regular"} />
                    </button>
                    <button onClick={() => toggleWatch(asset.symbol)} 
                      className="p-1.5 rounded hover:bg-white/10 text-zinc-500 transition-colors"
                      title="Remove from watchlist">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
                <div className="mt-4 flex justify-between items-end">
                  <div>
                    <div className="font-display text-2xl">${currentPrice.toLocaleString(undefined, { maximumFractionDigits: 2 })}</div>
                    {alertThresholds[asset.symbol] && (
                      <div className="text-[10px] text-[#FF4500] flex items-center gap-1 mt-1">
                        <Alarm size={10} weight="fill" /> Alert: ${alertThresholds[asset.symbol]}
                      </div>
                    )}
                  </div>
                  <div className={`text-sm flex items-center gap-1 ${isUp ? "text-green-400" : "text-red-400"}`}>
                    {isUp ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
                    {isUp ? "+" : ""}{currentChange.toFixed(2)}%
                  </div>
                </div>
                {/* Mini price bar */}
                <div className="mt-2 flex gap-1">
                  {Array.from({ length: 20 }, (_, i) => (
                    <div key={i} className="h-1 flex-1 rounded" style={{
                      backgroundColor: Math.random() > 0.5 ? "#FF4500" : "#27272A",
                      opacity: 0.3 + Math.random() * 0.7,
                    }} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* All Assets */}
      <div className="mt-8">
        <div className="label-mini mb-4">All Assets</div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ASSETS.map((asset) => {
            const isWatched = watchlist.includes(asset.symbol);
            const currentPrice = getPrice(asset.symbol);
            const currentChange = getChange(asset.symbol);
            const isUp = currentChange >= 0;
            return (
              <div key={asset.symbol} className={`panel transition-all ${isWatched ? "border-[#FF4500]/40" : "opacity-60 hover:opacity-100"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold text-lg">{asset.symbol}</div>
                    <div className="text-xs text-zinc-500">{asset.name}</div>
                  </div>
                  <button onClick={() => toggleWatch(asset.symbol)} 
                    className={`p-1.5 rounded transition-colors ${isWatched ? "bg-[#FF4500] text-black" : "hover:bg-white/10 text-zinc-500"}`}
                    title={isWatched ? "Remove" : "Add to watchlist"}>
                    {isWatched ? <Star size={16} weight="fill" /> : <Plus size={16} />}
                  </button>
                </div>
                <div className="mt-4 flex justify-between items-end">
                  <div className="font-display text-2xl">${currentPrice.toLocaleString(undefined, { maximumFractionDigits: currentPrice < 10 ? 4 : 2 })}</div>
                  <div className={`text-sm flex items-center gap-1 ${isUp ? "text-green-400" : "text-red-400"}`}>
                    {isUp ? <TrendUp size={14} weight="bold" /> : <TrendDown size={14} weight="bold" />}
                    {isUp ? "+" : ""}{currentChange.toFixed(2)}%
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}