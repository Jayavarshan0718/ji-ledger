import mongoose from "mongoose";

const URI_CANDIDATES = [
  process.env.MONGODB_URI,
  "mongodb://admin:Mongo12345@127.0.0.1:27017/ji_ledger?authSource=admin",
  "mongodb://127.0.0.1:27017/ji_ledger",
].filter(Boolean);

let connected = false;
let reconnectTimer = null;

const marketPairSchema = new mongoose.Schema({
  symbol: { type: String, required: true, unique: true },
  name: String,
  base: String,
  quote: { type: String, default: "USD" },
  price: { type: Number, default: 1 },
  change24h: { type: Number, default: 0 },
  volume24h: { type: Number, default: 0 },
  high24h: Number,
  low24h: Number,
  updated_at: { type: Date, default: Date.now },
});

const tradeRecordSchema = new mongoose.Schema({
  user_id: String,
  symbol: String,
  side: { type: String, enum: ["buy", "sell"] },
  price: Number,
  amount: Number,
  total: Number,
  created_at: { type: Date, default: Date.now },
});

export const MarketPair = mongoose.models.MarketPair || mongoose.model("MarketPair", marketPairSchema);
export const TradeRecord = mongoose.models.TradeRecord || mongoose.model("TradeRecord", tradeRecordSchema);

const SEED_PAIRS = [
  { symbol: "JI/USD", name: "Ji Ledger", base: "JI", price: 1.4231, change24h: 5.24, volume24h: 2400000, high24h: 1.48, low24h: 1.18 },
  { symbol: "BTC/USD", name: "Bitcoin", base: "BTC", price: 64231.1, change24h: 1.28, volume24h: 18200000000, high24h: 65100, low24h: 62800 },
  { symbol: "ETH/USD", name: "Ethereum", base: "ETH", price: 3421.44, change24h: -0.82, volume24h: 8900000000, high24h: 3480, low24h: 3350 },
  { symbol: "SOL/USD", name: "Solana", base: "SOL", price: 145.2, change24h: 4.51, volume24h: 2100000000, high24h: 149.8, low24h: 138.5 },
  { symbol: "BNB/USD", name: "BNB", base: "BNB", price: 592.1, change24h: 0.12, volume24h: 980000000, high24h: 598, low24h: 585 },
  { symbol: "XRP/USD", name: "Ripple", base: "XRP", price: 0.48, change24h: -2.33, volume24h: 1200000000, high24h: 0.51, low24h: 0.46 },
];

mongoose.connection.on("disconnected", () => {
  connected = false;
  console.warn("MongoDB disconnected — will retry in 10s");
  if (reconnectTimer) clearTimeout(reconnectTimer);
  reconnectTimer = setTimeout(() => {
    connectMongo();
  }, 10000);
});

mongoose.connection.on("error", (err) => {
  console.warn("MongoDB connection error:", err.message);
});

export async function connectMongo() {
  if (connected && mongoose.connection.readyState === 1) return true;
  
  for (const uri of URI_CANDIDATES) {
    try {
      await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
      connected = true;
      const count = await MarketPair.countDocuments();
      if (count === 0) {
        await MarketPair.insertMany(SEED_PAIRS);
        console.log("MongoDB: seeded market pairs");
      }
      console.log("MongoDB connected:", mongoose.connection.name);
      return true;
    } catch (err) {
      console.warn(`MongoDB connect failed (${uri}):`, err.message);
    }
  }
  console.warn("MongoDB unavailable, using in-memory market data");
  return false;
}

export function isMongoReady() {
  return connected && mongoose.connection.readyState === 1;
}

const memoryPairs = SEED_PAIRS.map((p) => ({ ...p, _id: p.symbol }));
const memoryTrades = [];

export async function getMarketPairs() {
  if (isMongoReady()) {
    return MarketPair.find().sort({ symbol: 1 }).lean();
  }
  return memoryPairs;
}

export async function getTickerPairs() {
  const pairs = await getMarketPairs();
  return pairs.map(({ symbol, name, price, change24h, volume24h }) => ({
    symbol, name, price, change24h, volume24h,
  }));
}

export async function updatePairPrice(symbol, priceDelta = 0) {
  if (isMongoReady()) {
    const pair = await MarketPair.findOne({ symbol });
    if (!pair) return null;
    const newPrice = Math.max(0.0001, pair.price + priceDelta);
    pair.price = newPrice;
    pair.high24h = Math.max(pair.high24h || newPrice, newPrice);
    pair.low24h = Math.min(pair.low24h || newPrice, newPrice);
    pair.updated_at = new Date();
    await pair.save();
    return pair.toObject();
  }
  const idx = memoryPairs.findIndex((p) => p.symbol === symbol);
  if (idx >= 0) {
    memoryPairs[idx].price = Math.max(0.0001, memoryPairs[idx].price + priceDelta);
    return memoryPairs[idx];
  }
  return null;
}

export function generateOrderBook(basePrice) {
  const asks = Array.from({ length: 10 }, (_, i) => {
    const price = basePrice + (i + 1) * 0.01 + Math.random() * 0.01;
    const amount = Math.random() * 500 + 10;
    return { price: price.toFixed(4), amount: amount.toFixed(2), total: (price * amount).toFixed(2) };
  }).sort((a, b) => b.price - a.price);

  const bids = Array.from({ length: 10 }, (_, i) => {
    const price = basePrice - (i + 1) * 0.01 - Math.random() * 0.01;
    const amount = Math.random() * 500 + 10;
    return { price: price.toFixed(4), amount: amount.toFixed(2), total: (price * amount).toFixed(2) };
  }).sort((a, b) => b.price - a.price);

  return { asks, bids, spread: basePrice };
}

export async function recordTrade({ user_id, symbol, side, price, amount }) {
  const total = price * amount;
  const record = { user_id, symbol, side, price, amount, total, created_at: new Date() };
  if (isMongoReady()) {
    await TradeRecord.create(record);
    const recent = await TradeRecord.find({ symbol }).sort({ created_at: -1 }).limit(20).lean();
    return recent;
  }
  memoryTrades.unshift(record);
  return memoryTrades.filter((t) => t.symbol === symbol).slice(0, 20);
}

export async function getRecentTrades(symbol, limit = 20) {
  if (isMongoReady()) {
    return TradeRecord.find({ symbol }).sort({ created_at: -1 }).limit(limit).lean();
  }
  return memoryTrades.filter((t) => t.symbol === symbol).slice(0, limit);
}