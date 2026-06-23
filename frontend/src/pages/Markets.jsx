import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChartLineUp, CaretUp, CaretDown, ArrowsLeftRight } from '@phosphor-icons/react';
import api from "@/lib/api";
import PriceChart from "@/components/charts/PriceChart";

const generateCandlestickData = (initialPrice, count) => {
    const data = [];
    let lastClose = initialPrice;
    for (let i = 0; i < count; i++) {
        const open = lastClose;
        const change = (Math.random() - 0.48) * 0.04 * open;
        const close = open + change;
        const high = Math.max(open, close) + Math.random() * 0.01 * open;
        const low = Math.min(open, close) - Math.random() * 0.01 * open;
        const time = new Date(Date.now() - (count - 1 - i) * 30 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        data.push({ time, open: parseFloat(open.toFixed(2)), high: parseFloat(high.toFixed(2)), low: parseFloat(low.toFixed(2)), close: parseFloat(close.toFixed(2)) });
        lastClose = close;
    }
    return data;
};

function formatPrice(val) {
    if (val == null) return "0.00";
    return val >= 1000 ? val.toLocaleString(undefined, { maximumFractionDigits: 2 }) : val.toFixed(val < 1 ? 4 : 2);
}

function formatVolume(val) {
    if (!val) return "0";
    if (val >= 1e9) return (val / 1e9).toFixed(2) + "B";
    if (val >= 1e6) return (val / 1e6).toFixed(2) + "M";
    if (val >= 1e3) return (val / 1e3).toFixed(1) + "K";
    return val.toFixed(0);
}

function formatMarketCap(val) {
    if (!val) return "N/A";
    if (val >= 1e12) return "$" + (val / 1e12).toFixed(2) + "T";
    if (val >= 1e9) return "$" + (val / 1e9).toFixed(2) + "B";
    if (val >= 1e6) return "$" + (val / 1e6).toFixed(2) + "M";
    return "$" + val.toLocaleString();
}

export default function MarketsPage() {
    const navigate = useNavigate();
    const [pairs, setPairs] = useState([]);
    const [activePair, setActivePair] = useState(null);
    const [data, setData] = useState(generateCandlestickData(1.42, 30));
    const [currentPrice, setCurrentPrice] = useState(1.42);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Try CoinGecko first, fallback to market pairs
        api.get("/crypto/prices")
            .then((r) => {
                const list = r.data.pairs || [];
                if (list.length > 0) {
                    setPairs(list);
                    const defaultPair = list.find((p) => p.symbol === "BTC/USD") || list[0];
                    if (defaultPair) {
                        setActivePair(defaultPair);
                        setCurrentPrice(defaultPair.price);
                        setData(generateCandlestickData(defaultPair.price, 30));
                    }
                    setLoading(false);
                    return;
                }
                // fallback
                return api.get("/markets/pairs");
            })
            .catch(() => api.get("/markets/pairs"))
            .then((r) => {
                if (!r) return;
                const list = r.data?.pairs || [];
                setPairs(list);
                const ji = list.find((p) => p.symbol === "JI/USD") || list[0];
                if (ji) { setActivePair(ji); setCurrentPrice(ji.price); setData(generateCandlestickData(ji.price, 30)); }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (!activePair) return;
        const interval = setInterval(() => {
            const change = (Math.random() - 0.48) * 0.04;
            const nextPrice = Math.max(0.5, currentPrice + change);
            setCurrentPrice(nextPrice);
            setData(prev => {
                const lastCandle = prev[prev.length - 1];
                const open = lastCandle.close;
                const close = nextPrice;
                const high = Math.max(open, close);
                const low = Math.min(open, close);
                const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                return [...prev.slice(1), { time, open: parseFloat(open.toFixed(2)), high: parseFloat(high.toFixed(2)), low: parseFloat(low.toFixed(2)), close: parseFloat(close.toFixed(2)) }];
            });
        }, 4000);
        return () => clearInterval(interval);
    }, [currentPrice, activePair]);

    const selectPair = (pair) => {
        setActivePair(pair);
        setCurrentPrice(pair.price);
        setData(generateCandlestickData(pair.price, 30));
    };

    if (loading) {
        return <div className="p-6 md:p-12"><div className="label-mini">// LOADING MARKETS...</div></div>;
    }

    return (
        <div className="p-6 md:p-12">
            <div className="label-mini">// MARKET TERMINAL</div>
            <h1 className="font-display text-4xl md:text-6xl uppercase mt-2 flex items-center gap-4 text-[#FF4500]">
                <ChartLineUp size={48} weight="bold" /> Markets
            </h1>

            <div className="grid lg:grid-cols-3 gap-6 mt-10">
                <div className="panel lg:col-span-2 bg-[var(--bg-panel)] p-6 border-[var(--border-color)] text-[var(--text-primary)]">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="bg-[#FF4500] text-black text-[10px] font-bold px-1 rounded">LIVE</span>
                                <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">{activePair?.symbol || "BTC / USD"}</span>
                            </div>
                            <div className="text-5xl font-display text-[var(--text-primary)] flex items-baseline gap-3">
                                ${formatPrice(currentPrice)}
                                <span className={`text-sm font-mono flex items-center ${(activePair?.change24h || 0) >= 0 ? "text-green-400" : "text-red-400"}`}>
                                    {(activePair?.change24h || 0) >= 0 ? <CaretUp weight="fill" /> : <CaretDown weight="fill" />}
                                    {(activePair?.change24h || 0) >= 0 ? "+" : ""}{activePair?.change24h?.toFixed(2) || "0.00"}%
                                </span>
                            </div>
                            <button
                                onClick={() => navigate(`/app/trade?pair=${encodeURIComponent(activePair?.symbol || "JI/USD")}&price=${currentPrice.toFixed(4)}&mode=buy`)}
                                className="btn-primary mt-4 px-6 py-2 text-sm uppercase tracking-widest font-bold flex items-center gap-2"
                            >
                                <ArrowsLeftRight size={18} weight="bold" /> Trade Now
                            </button>
                        </div>
                        <div className="hidden sm:grid grid-cols-2 gap-x-8 gap-y-2 text-right">
                            <div>
                                <div className="label-mini">24h High</div>
                                <div className="font-mono text-sm">${formatPrice(activePair?.high24h || currentPrice * 1.05)}</div>
                            </div>
                            <div>
                                <div className="label-mini">24h Low</div>
                                <div className="font-mono text-sm">${formatPrice(activePair?.low24h || currentPrice * 0.95)}</div>
                            </div>
                            <div>
                                <div className="label-mini">Volume</div>
                                <div className="font-mono text-sm">{formatVolume(activePair?.volume24h)}</div>
                            </div>
                            <div>
                                <div className="label-mini">Market Cap</div>
                                <div className="font-mono text-sm">{formatMarketCap(activePair?.marketCap)}</div>
                            </div>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <PriceChart data={data} currentPrice={currentPrice} height={300} />
                    </div>
                </div>

                <div className="space-y-4 text-[var(--text-primary)]">
                    <div className="label-mini mb-2">Live Markets (CoinGecko)</div>
                    {pairs.map((pair) => (
                        <MarketCard
                            key={pair.symbol}
                            symbol={pair.base || pair.symbol.split('/')[0]}
                            name={pair.name}
                            price={formatPrice(pair.price)}
                            change={`${pair.change24h >= 0 ? "+" : ""}${pair.change24h?.toFixed(2) || "0.00"}%`}
                            isUp={pair.change24h >= 0}
                            active={activePair?.symbol === pair.symbol}
                            onClick={() => selectPair(pair)}
                            marketCap={formatMarketCap(pair.marketCap)}
                            volume={formatVolume(pair.volume24h)}
                            onTrade={() => navigate(`/app/trade?pair=${encodeURIComponent(pair.symbol)}&price=${pair.price?.toFixed(4)}&mode=buy`)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

function MarketCard({ symbol, name, price, change, isUp, active, onClick, onTrade, marketCap, volume }) {
    return (
        <div
            className={`panel flex flex-col hover:border-[#FF4500] hover:bg-[var(--bg-panel)]/50 cursor-pointer transition-all group ${active ? "border-[#FF4500]" : ""}`}
            onClick={onClick}
        >
            <div className="flex justify-between items-center w-full">
                <div>
                    <div className="font-display text-xl uppercase group-hover:text-[#FF4500] transition-colors">{symbol}</div>
                    <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-tight">{name}</div>
                </div>
                <div className="text-right">
                    <div className="font-mono text-sm">${price}</div>
                    <div className={`text-[10px] font-mono flex items-center justify-end mt-0.5 ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                        {isUp ? <CaretUp weight="fill" /> : <CaretDown weight="fill" />} {change}
                    </div>
                </div>
            </div>
            <div className="flex justify-between text-[9px] text-zinc-600 font-mono mt-2 pt-2 border-t border-[var(--border-color)]">
                <span>MCap: {marketCap}</span>
                <span>Vol: {volume}</span>
                <button type="button" onClick={(e) => { e.stopPropagation(); onTrade(); }}
                    className="text-[#FF4500] uppercase tracking-wider hover:underline">Trade</button>
            </div>
        </div>
    );
}