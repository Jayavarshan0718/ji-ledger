import { useState } from "react";
import { TrendUp, TrendDown, MagnifyingGlass, CaretUp, CaretDown } from "@phosphor-icons/react";

const MARKET_INDICES = [
  { name: "S&P 500", value: 5432.16, change: 0.68 },
  { name: "NASDAQ", value: 17689.32, change: 1.24 },
  { name: "NIFTY 50", value: 25078.45, change: 0.44 },
  { name: "SENSEX", value: 82890.12, change: 0.38 },
  { name: "DOW JONES", value: 39876.54, change: -0.12 },
  { name: "FTSE 100", value: 8234.56, change: 0.25 },
];

const TOP_GAINERS = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2950, change: 5.2, vol: "12.4M" },
  { symbol: "TCS", name: "Tata Consultancy", price: 4120, change: 4.8, vol: "8.2M" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1680, change: 3.9, vol: "15.6M" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 785.3, change: 3.4, vol: "45.2M" },
  { symbol: "AAPL", name: "Apple Inc.", price: 198.5, change: 1.2, vol: "52.4M" },
];
const TOP_LOSERS = [
  { symbol: "WIPRO", name: "Wipro Ltd", price: 445, change: -3.1, vol: "6.8M" },
  { symbol: "INFY", name: "Infosys", price: 1520, change: -2.4, vol: "9.2M" },
  { symbol: "ITC", name: "ITC Limited", price: 425, change: -1.8, vol: "11.5M" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.8, change: -1.5, vol: "38.7M" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.5, change: -0.8, vol: "22.1M" },
];
const MOST_ACTIVE = [
  { symbol: "AAPL", name: "Apple Inc.", price: 198.5, change: 1.2, vol: "52.4M" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 785.3, change: 3.4, vol: "45.2M" },
  { symbol: "TSLA", name: "Tesla Inc.", price: 245.8, change: -1.5, vol: "38.7M" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.5, change: 0.8, vol: "22.1M" },
  { symbol: "AMZN", name: "Amazon.com", price: 178.2, change: 2.1, vol: "28.3M" },
];
const US_STOCKS = [
  { symbol: "AAPL", name: "Apple Inc.", price: 198.5, change: 1.2, vol: "52.4M" },
  { symbol: "GOOGL", name: "Alphabet Inc.", price: 142.5, change: 0.8, vol: "22.1M" },
  { symbol: "AMZN", name: "Amazon.com", price: 178.2, change: 2.1, vol: "28.3M" },
  { symbol: "NVDA", name: "NVIDIA Corp.", price: 785.3, change: 3.4, vol: "45.2M" },
  { symbol: "MSFT", name: "Microsoft Corp.", price: 425.8, change: 1.8, vol: "18.6M" },
];
const INDIAN_STOCKS = [
  { symbol: "RELIANCE", name: "Reliance Industries", price: 2950, change: 5.2, vol: "12.4M" },
  { symbol: "TCS", name: "Tata Consultancy", price: 4120, change: 4.8, vol: "8.2M" },
  { symbol: "HDFCBANK", name: "HDFC Bank", price: 1680, change: 3.9, vol: "15.6M" },
  { symbol: "INFY", name: "Infosys", price: 1520, change: -2.4, vol: "9.2M" },
  { symbol: "ICICIBANK", name: "ICICI Bank", price: 1120, change: 2.8, vol: "11.8M" },
];

const ALL_STOCKS = [...TOP_GAINERS, ...TOP_LOSERS, ...MOST_ACTIVE, ...US_STOCKS, ...INDIAN_STOCKS].filter(
  (stock, index, self) => index === self.findIndex((s) => s.symbol === stock.symbol)
);

export default function StocksPage() {
  const [tab, setTab] = useState("gainers");
  const [search, setSearch] = useState("");
  
  const getData = () => {
    switch(tab) {
      case "gainers": return TOP_GAINERS;
      case "losers": return TOP_LOSERS;
      case "active": return MOST_ACTIVE;
      case "us": return US_STOCKS;
      case "indian": return INDIAN_STOCKS;
      case "all": return ALL_STOCKS;
      default: return TOP_GAINERS;
    }
  };

  const data = getData().filter(s => 
    !search || 
    s.symbol.toLowerCase().includes(search.toLowerCase()) || 
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderList = (items, showVol = false) => items.map((s) => (
    <div key={s.symbol} className="panel flex items-center justify-between hover:border-[#FF4500]/30 transition-colors">
      <div className="flex items-center gap-3">
        <div>
          <div className="font-bold">{s.symbol}</div>
          <div className="text-xs text-zinc-500">{s.name || ""}</div>
        </div>
      </div>
      <div className="text-right flex items-center gap-6">
        <div className="font-mono">${s.price.toLocaleString()}</div>
        <div className={`text-sm flex items-center gap-1 ${s.change >= 0 ? "text-green-400" : "text-red-400"}`}>
          {s.change >= 0 ? <CaretUp weight="fill" /> : <CaretDown weight="fill" />}
          {s.change >= 0 ? "+" : ""}{s.change}%
        </div>
        {showVol && <div className="text-xs text-zinc-500 w-16 text-right">{s.vol}</div>}
      </div>
    </div>
  ));

  return (
    <div className="p-6 md:p-12">
      <div className="label-mini">// STOCK MARKET</div>
      <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 text-[#FF4500]">Stocks</h1>

      {/* Market Indices */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-6 gap-3">
        {MARKET_INDICES.map(index => (
          <div key={index.name} className="panel py-3 px-4 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider">{index.name}</div>
            <div className="font-mono text-sm mt-1">{index.value.toLocaleString()}</div>
            <div className={`text-[10px] flex items-center justify-center gap-0.5 ${index.change >= 0 ? "text-green-400" : "text-red-400"}`}>
              {index.change >= 0 ? <CaretUp weight="fill" size={10} /> : <CaretDown weight="fill" size={10} />}
              {index.change >= 0 ? "+" : ""}{index.change}%
            </div>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative mt-6">
        <MagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
        <input
          type="text"
          placeholder="Search stocks by symbol or name..."
          className="input-field pl-12 py-3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Tabs */}
      <div className="mt-4 flex gap-2 flex-wrap border-b border-[var(--border-color)] pb-4">
        {[
          { key: "gainers", label: "Top Gainers" },
          { key: "losers", label: "Top Losers" },
          { key: "active", label: "Most Active" },
          { key: "us", label: "US Stocks" },
          { key: "indian", label: "Indian Stocks" },
          { key: "all", label: "All Stocks" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setTab(key)} 
            className={`px-4 py-2 text-xs uppercase tracking-widest font-bold transition-colors ${tab === key ? "bg-[#FF4500] text-black" : "hover:text-[#FF4500] text-zinc-500"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Stock List */}
      <div className="mt-4 space-y-2">
        {data.length > 0 ? (
          renderList(data, tab === "active")
        ) : (
          <div className="panel text-center text-zinc-500">No stocks found matching "{search}"</div>
        )}
      </div>

      {/* Market Summary */}
      <div className="mt-8 panel bg-[#FF4500]/5 border-[#FF4500]/20">
        <div className="text-xs text-zinc-500 uppercase tracking-wider mb-3">Market Summary</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <span className="text-zinc-500">Advancing:</span>
            <span className="ml-2 text-green-400 font-mono">1,842</span>
          </div>
          <div>
            <span className="text-zinc-500">Declining:</span>
            <span className="ml-2 text-red-400 font-mono">1,123</span>
          </div>
          <div>
            <span className="text-zinc-500">Unchanged:</span>
            <span className="ml-2 text-zinc-400 font-mono">234</span>
          </div>
          <div>
            <span className="text-zinc-500">Total Volume:</span>
            <span className="ml-2 font-mono">2.4B</span>
          </div>
        </div>
      </div>
    </div>
  );
}