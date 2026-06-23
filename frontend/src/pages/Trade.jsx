import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowsLeftRight } from '@phosphor-icons/react';
import api from "@/lib/api";
import { toast } from 'sonner';
import PriceChart from "@/components/charts/PriceChart";

const PAIRS = ["JI/USD", "BTC/USD", "ETH/USD", "SOL/USD", "BNB/USD"];
const CANDLE_COUNT = 200;

const generateCandlestickData = (initialPrice, count) => {
    const data = [];
    let lastClose = initialPrice;
    for (let i = 0; i < count; i++) {
        const open = lastClose;
        // Slight upward bias with normal volatility
        const change = (Math.random() - 0.48) * 0.015 * open;
        const close = open + change;
        const volatility = 0.004 * open;
        const high = Math.max(open, close) + Math.random() * volatility;
        const low = Math.min(open, close) - Math.random() * volatility;
        const date = new Date(Date.now() - (count - 1 - i) * 60 * 1000);
        data.push({
            time: date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ts: date.getTime(),
            open: parseFloat(open.toFixed(4)),
            high: parseFloat(high.toFixed(4)),
            low: parseFloat(low.toFixed(4)),
            close: parseFloat(close.toFixed(4)),
            volume: parseFloat((Math.random() * 80 + 10 + Math.abs(change) * 200).toFixed(1)),
        });
        lastClose = close;
    }
    return data;
};

export default function TradePage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [symbol, setSymbol] = useState(searchParams.get('pair') || 'JI/USD');
    const [mode, setMode] = useState(searchParams.get('mode') || 'buy');
    const [marketPrice, setMarketPrice] = useState(parseFloat(searchParams.get('price')) || 1.4231);
    const [orderForm, setOrderForm] = useState({
        price: searchParams.get('price') || '1.4231',
        amount: ''
    });
    const [wallets, setWallets] = useState([]);
    const [busy, setBusy] = useState(false);
    const [recentTrades, setRecentTrades] = useState([]);
    const [candlestickData, setCandlestickData] = useState(generateCandlestickData(1.4231, CANDLE_COUNT));
    const [orderBook, setOrderBook] = useState({ asks: [], bids: [] });
    const [pairs, setPairs] = useState([]);

    const refreshWallets = useCallback(async () => {
        try {
            const { data } = await api.get("/wallet/me");
            setWallets(data.wallets || []);
        } catch (err) {
            console.error("Failed to fetch wallets", err);
        }
    }, []);

    const loadMarketData = useCallback(async (pair, priceOverride) => {
        try {
            const [pairsRes, bookRes, tradesRes] = await Promise.all([
                api.get("/markets/pairs"),
                api.get(`/markets/orderbook/${encodeURIComponent(pair)}`),
                api.get(`/markets/trades/${encodeURIComponent(pair)}?limit=15`),
            ]);
            setPairs(pairsRes.data.pairs || []);
            const pairData = pairsRes.data.pairs?.find((p) => p.symbol === pair);
            const price = priceOverride || pairData?.price || 1.4231;
            setMarketPrice(price);
            setOrderForm((prev) => ({ ...prev, price: price.toFixed(4) }));
            setOrderBook({ asks: bookRes.data.asks || [], bids: bookRes.data.bids || [] });
            setRecentTrades(tradesRes.data.trades || []);
            if (!priceOverride) {
                setCandlestickData(generateCandlestickData(price, CANDLE_COUNT));
            }
        } catch (err) {
            console.error("Market data load failed", err);
        }
    }, []);

    useEffect(() => {
        const pair = searchParams.get('pair') || 'JI/USD';
        const price = searchParams.get('price');
        const nextMode = searchParams.get('mode') || 'buy';
        setSymbol(pair);
        setMode(nextMode);
        loadMarketData(pair, price ? parseFloat(price) : undefined);
    }, [searchParams, loadMarketData]);

    useEffect(() => {
        refreshWallets();
    }, [refreshWallets]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const { data } = await api.get(`/markets/orderbook/${encodeURIComponent(symbol)}`);
                const newPrice = data.spread || marketPrice;
                setMarketPrice(newPrice);
                setOrderBook({ asks: data.asks || [], bids: data.bids || [] });

                setCandlestickData(prev => {
                    const lastCandle = prev[prev.length - 1];
                    const open = lastCandle.close;
                    const close = newPrice;
                    const high = Math.max(open, close);
                    const low = Math.min(open, close);
                    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    return [...prev.slice(1), {
                        time,
                        open: parseFloat(open.toFixed(4)),
                        high: parseFloat(high.toFixed(4)),
                        low: parseFloat(low.toFixed(4)),
                        close: parseFloat(close.toFixed(4)),
                        volume: parseFloat((Math.random() * 20 + 5).toFixed(1)),
                    }];
                });
            } catch {
                // keep last snapshot
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [symbol, marketPrice]);

    const handlePairChange = (next) => {
        setSymbol(next);
        setSearchParams({ pair: next, mode });
    };

    const primary = wallets[0];

    const handleTrade = async (e) => {
        e.preventDefault();
        const amountNum = parseFloat(orderForm.amount);
        const priceNum = parseFloat(orderForm.price);
        if (!amountNum || amountNum <= 0) {
            return toast.error("Please enter a valid amount");
        }
        if (!priceNum || priceNum <= 0) {
            return toast.error("Please enter a valid price");
        }
        if (!primary) {
            return toast.error("Sign in and open your Ji Ledger wallet to trade");
        }

        setBusy(true);
        try {
            await api.post("/markets/trade", {
                symbol,
                side: mode,
                price: priceNum,
                amount: amountNum,
            });
            toast.success(`Successfully ${mode === 'buy' ? 'bought' : 'sold'} ${amountNum} ${symbol.split('/')[0]}`);
            setOrderForm({ ...orderForm, amount: '' });
            refreshWallets();
            const { data } = await api.get(`/markets/trades/${encodeURIComponent(symbol)}?limit=15`);
            setRecentTrades(data.trades || []);
        } catch (err) {
            toast.error(err.response?.data?.detail || "Trade failed");
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="p-6 md:p-12 relative">
            <div className="label-mini">// TRADE TERMINAL</div>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                <h1 className="font-display text-4xl md:text-6xl uppercase flex items-center gap-4 text-[#FF4500]">
                    <ArrowsLeftRight size={48} weight="bold" /> Trade
                </h1>
                <div className="flex flex-wrap gap-2">
                    {(pairs.length ? pairs : PAIRS.map((s) => ({ symbol: s }))).map((p) => (
                        <button
                            key={p.symbol}
                            type="button"
                            onClick={() => handlePairChange(p.symbol)}
                            className={`px-3 py-1.5 text-xs font-mono uppercase border transition-all ${symbol === p.symbol
                                ? "bg-[#FF4500] text-black border-[#FF4500]"
                                : "border-[var(--border-color)] text-zinc-400 hover:border-[#FF4500]"
                            }`}
                        >
                            {p.symbol}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6 mt-10">
                <div className="panel lg:col-span-1 bg-[var(--bg-panel)] p-4 flex flex-col h-[600px]">
                    <div className="label-mini mb-4">Order Book — {symbol}</div>
                    <div className="grid grid-cols-2 text-[10px] text-zinc-500 uppercase mb-2 px-2 font-mono">
                        <span>Price</span>
                        <span className="text-right">Amount</span>
                    </div>

                    <div className="flex-1 overflow-hidden flex flex-col justify-end">
                        {orderBook.asks.map((order, i) => (
                            <div key={`ask-${i}`} className="grid grid-cols-2 text-xs py-1 px-2 hover:bg-red-500/10 font-mono transition-colors cursor-pointer" onClick={() => setOrderForm({ ...orderForm, price: order.price })}>
                                <span className="text-red-400">{order.price}</span>
                                <span className="text-right text-zinc-400">{order.amount}</span>
                            </div>
                        ))}
                    </div>

                    <div className="my-4 py-2 border-y border-[var(--border-color)] text-center">
                        <div className="text-2xl font-display text-[var(--text-primary)]">${marketPrice.toFixed(4)}</div>
                        <div className="text-[10px] text-zinc-500 uppercase font-mono tracking-tighter">Market Index</div>
                    </div>

                    <div className="flex-1 overflow-hidden">
                        {orderBook.bids.map((order, i) => (
                            <div key={`bid-${i}`} className="grid grid-cols-2 text-xs py-1 px-2 hover:bg-green-500/10 font-mono transition-colors cursor-pointer" onClick={() => setOrderForm({ ...orderForm, price: order.price })}>
                                <span className="text-green-400">{order.price}</span>
                                <span className="text-right text-zinc-400">{order.amount}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="panel lg:col-span-2 bg-[var(--bg-panel)] p-0 flex flex-col relative overflow-hidden h-[600px]">
                    <div className="relative z-10 flex flex-col h-full p-6">
                        <div className="label-mini mb-4 text-[var(--text-primary)]">Price Chart ({symbol})</div>
                        <div className="flex-1 h-[calc(100%-40px)] text-[var(--text-primary)]">
                            <PriceChart data={candlestickData} currentPrice={marketPrice} />
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="panel bg-[var(--bg-panel)] p-6">
                        <div className="flex bg-[var(--bg-primary)]/10 p-1 border border-[var(--border-color)] rounded mb-6">
                            <button
                                type="button"
                                className={`flex-1 py-2 font-display text-lg uppercase transition-all ${mode === 'buy' ? 'bg-green-500 text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'text-zinc-500'}`}
                                onClick={() => setMode('buy')}
                            >
                                Buy
                            </button>
                            <button
                                type="button"
                                className={`flex-1 py-2 font-display text-lg uppercase transition-all ${mode === 'sell' ? 'bg-red-500 text-black shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'text-zinc-500'}`}
                                onClick={() => setMode('sell')}
                            >
                                Sell
                            </button>
                        </div>

                        <form onSubmit={handleTrade} className="space-y-4">
                            <div>
                                <label className="label-mini mb-2 block">Price (USD)</label>
                                <input
                                    type="number"
                                    step="0.0001"
                                    className="input-field font-mono"
                                    value={orderForm.price}
                                    onChange={(e) => setOrderForm({ ...orderForm, price: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="label-mini block">Amount ({symbol.split('/')[0]})</label>
                                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono uppercase tracking-tighter">
                                        <span>Available: <span className="text-[#FF4500] font-bold">{primary ? primary.balance.toLocaleString(undefined, { maximumFractionDigits: 2 }) : "0.00"} JI</span></span>
                                        <button
                                            type="button"
                                            onClick={() => primary && setOrderForm({ ...orderForm, amount: primary.balance.toString() })}
                                            className="bg-[#FF4500]/10 text-[#FF4500] px-1 rounded hover:bg-[#FF4500]/20 transition-colors font-bold"
                                        >
                                            MAX
                                        </button>
                                    </div>
                                </div>
                                <input
                                    type="number"
                                    step="0.1"
                                    className="input-field font-mono"
                                    placeholder="0.00"
                                    value={orderForm.amount}
                                    onChange={(e) => setOrderForm({ ...orderForm, amount: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="py-4 border-t border-[var(--border-color)] mt-6">
                                <div className="flex justify-between text-xs text-zinc-500 mb-1">
                                    <span>Est. Total</span>
                                    <span>$ {(parseFloat(orderForm.price || 0) * parseFloat(orderForm.amount || 0)).toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-4 font-display text-2xl uppercase transition-all ${mode === 'buy' ? 'btn-primary' : 'bg-red-500 text-black hover:bg-red-600'}`}
                                disabled={busy}
                            >
                                {busy ? "Executing..." : `Execute ${mode}`}
                            </button>
                        </form>
                    </div>

                    <div className="panel bg-[var(--bg-panel)] p-6 flex-1 flex flex-col relative overflow-hidden">
                        <div className="relative z-10 flex flex-col h-full">
                            <div className="label-mini mb-4">Recent Trades</div>
                            <div className="grid grid-cols-3 text-[10px] text-zinc-500 uppercase mb-2 px-2 font-mono">
                                <span>Price (USD)</span>
                                <span className="text-center">Amount</span>
                                <span className="text-right">Time</span>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-1">
                                {recentTrades.map((trade) => (
                                    <div key={trade.id} className="grid grid-cols-3 text-xs py-1.5 px-2 hover:bg-white/5 font-mono transition-colors border-b border-[var(--border-color)] last:border-0">
                                        <span className={trade.side === 'buy' ? 'text-green-400' : 'text-red-400'}>
                                            {trade.price}
                                        </span>
                                        <span className="text-center text-zinc-300">{trade.amount}</span>
                                        <span className="text-right text-zinc-500">{trade.time}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}