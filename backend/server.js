import bcrypt from "bcryptjs";
import cors from "cors";
import crypto from "crypto";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";
import Razorpay from "razorpay";
import {
  connectMongo,
  getMarketPairs,
  getTickerPairs,
  getRecentTrades,
  generateOrderBook,
  recordTrade,
  updatePairPrice,
} from "./db/mongo.js";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "data");
const UPLOAD_DIR = path.join(__dirname, "uploads");
const DB_FILE = path.join(DATA_DIR, "ji_ledger.db");
const JWT_SECRET = process.env.JWT_SECRET || "ji-ledger-local-dev-secret-change-me";
const PORT = Number(process.env.PORT || 8000);
const CORS_ORIGINS = (process.env.CORS_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000").split(",");

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

let db;
const SQL = await initSqlJs();

function saveDb() {
  const data = db.export();
  fs.writeFileSync(DB_FILE, Buffer.from(data));
}

function loadDb() {
  if (fs.existsSync(DB_FILE)) {
    db = new SQL.Database(fs.readFileSync(DB_FILE));
  } else {
    db = new SQL.Database();
  }
}

function run(sql, params = []) {
  db.run(sql, params);
  saveDb();
}

function get(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const row = stmt.step() ? stmt.getAsObject() : null;
  stmt.free();
  return row;
}

function all(sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function initSchema() {
  // First, check if phone column exists - if not, drop and recreate
  try {
    db.run("ALTER TABLE users ADD COLUMN phone TEXT");
  } catch (e) { /* column already exists */ }

  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      username TEXT NOT NULL,
      phone TEXT DEFAULT NULL,
      password_hash TEXT,
      wallet_address TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS wallets (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      address TEXT UNIQUE NOT NULL,
      balance REAL NOT NULL DEFAULT 0,
      is_primary INTEGER NOT NULL DEFAULT 0
    );
    CREATE TABLE IF NOT EXISTS blocks (
      id TEXT PRIMARY KEY,
      block_index INTEGER NOT NULL,
      hash TEXT NOT NULL,
      prev_hash TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      tx_type TEXT NOT NULL,
      tx_data TEXT NOT NULL,
      user_id TEXT
    );
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      from_address TEXT NOT NULL,
      to_address TEXT NOT NULL,
      amount REAL NOT NULL,
      memo TEXT,
      tx_hash TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      symbol TEXT NOT NULL,
      total_supply REAL NOT NULL,
      description TEXT,
      creator_address TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS token_holdings (
      id TEXT PRIMARY KEY,
      token_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      balance REAL NOT NULL,
      UNIQUE(token_id, user_id)
    );
    CREATE TABLE IF NOT EXISTS nfts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      description TEXT,
      image_url TEXT,
      collection TEXT,
      token_id TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS proposals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      options TEXT NOT NULL,
      duration_hours INTEGER NOT NULL,
      created_at TEXT NOT NULL,
      votes TEXT NOT NULL DEFAULT '{}'
    );
    CREATE TABLE IF NOT EXISTS products (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      public_id TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      sku TEXT NOT NULL,
      description TEXT,
      origin TEXT,
      category TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS checkpoints (
      id TEXT PRIMARY KEY,
      product_id TEXT NOT NULL,
      location TEXT,
      handler TEXT,
      status TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS siwe_nonces (
      nonce TEXT PRIMARY KEY,
      address TEXT NOT NULL,
      message TEXT NOT NULL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS sepolia_logs (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      tx_hash TEXT NOT NULL,
      action TEXT NOT NULL,
      amount REAL,
      created_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS kyc (
      id TEXT PRIMARY KEY,
      user_id TEXT UNIQUE NOT NULL,
      full_name TEXT NOT NULL,
      pan TEXT NOT NULL,
      dob TEXT NOT NULL,
      address TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending',
      submitted_at TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS payments (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      order_id TEXT NOT NULL,
      payment_id TEXT,
      amount REAL NOT NULL,
      currency TEXT NOT NULL DEFAULT 'INR',
      status TEXT NOT NULL DEFAULT 'created',
      created_at TEXT NOT NULL
    );
  `);
  saveDb();
}
loadDb();

const newId = (prefix = "") => prefix + crypto.randomBytes(6).toString("hex");
const newAddress = () => "0x" + crypto.randomBytes(20).toString("hex");
const nowIso = () => new Date().toISOString();
const txHash = (payload) => "0x" + crypto.createHash("sha256").update(JSON.stringify(payload)).digest("hex");

function publicUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    wallet_address: user.wallet_address,
    created_at: user.created_at,
    phone: user.phone || null,
  };
}

function latestBlock() {
  return get("SELECT * FROM blocks ORDER BY block_index DESC LIMIT 1");
}

function appendBlock(txType, txData, userId = null) {
  const prev = latestBlock();
  const blockIndex = prev ? prev.block_index + 1 : 0;
  const prevHash = prev ? prev.hash : "0x" + "0".repeat(64);
  const timestamp = nowIso();
  const payload = { index: blockIndex, prev_hash: prevHash, timestamp, tx_type: txType, tx_data: txData, user_id: userId };
  const hash = txHash(payload);
  run(
    "INSERT INTO blocks (id, block_index, hash, prev_hash, timestamp, tx_type, tx_data, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [newId("blk_"), blockIndex, hash, prevHash, timestamp, txType, JSON.stringify(txData), userId]
  );
  return { index: blockIndex, hash, prev_hash: prevHash, timestamp, tx_type: txType, tx_data: txData };
}

function createUserWithWallet({ email, username, phone = null, passwordHash = null, address = null }) {
  const userId = newId("usr_");
  const walletAddress = address || newAddress();
  const createdAt = nowIso();
  run(
    "INSERT INTO users (id, email, username, phone, password_hash, wallet_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [userId, email.toLowerCase(), username, phone, passwordHash, walletAddress, createdAt]
  );
  run(
    "INSERT INTO wallets (id, user_id, address, balance, is_primary) VALUES (?, ?, ?, ?, 1)",
    [newId("wal_"), userId, walletAddress, 1000]
  );
  appendBlock("genesis", { action: "account_created", address: walletAddress, initial_balance: 1000 }, userId);
  return get("SELECT * FROM users WHERE id = ?", [userId]);
}

function getWallets(userId) {
  return all("SELECT id, address, balance, is_primary FROM wallets WHERE user_id = ? ORDER BY is_primary DESC", [userId]).map((w) => ({
    ...w,
    is_primary: Boolean(w.is_primary),
  }));
}

function createToken(userId) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "72h" });
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return res.status(401).json({ detail: "Not authenticated" });
  try {
    const payload = jwt.verify(header.slice(7), JWT_SECRET);
    const user = get("SELECT * FROM users WHERE id = ?", [payload.sub]);
    if (!user) return res.status(401).json({ detail: "User not found" });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ detail: "Invalid token" });
  }
}

initSchema();

const app = express();
app.use(cors({ origin: CORS_ORIGINS, credentials: true }));
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) => cb(null, newId("img_") + path.extname(file.originalname).toLowerCase()),
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const COINGECKO_CACHE = { data: null, updatedAt: 0 };
const COINGECKO_CACHE_TTL = 60_000; // 1 minute

async function fetchCoinGeckoPrices() {
  const now = Date.now();
  if (COINGECKO_CACHE.data && now - COINGECKO_CACHE.updatedAt < COINGECKO_CACHE_TTL) {
    return COINGECKO_CACHE.data;
  }
  try {
    const url = "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple,cardano,dogecoin,polkadot,chainlink,avalanche-2&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true";
    const res = await fetch(url);
    if (!res.ok) throw new Error(`CoinGecko HTTP ${res.status}`);
    const data = await res.json();
    const mapped = {
      "BTC/USD": {
        price: data.bitcoin?.usd || 64231.1,
        change24h: data.bitcoin?.usd_24h_change || 1.28,
        volume24h: data.bitcoin?.usd_24h_vol || 18200000000,
        marketCap: data.bitcoin?.usd_market_cap || 1250000000000,
        name: "Bitcoin",
        base: "BTC",
        high24h: (data.bitcoin?.usd || 64231.1) * 1.03,
        low24h: (data.bitcoin?.usd || 64231.1) * 0.97,
      },
      "ETH/USD": {
        price: data.ethereum?.usd || 3421.44,
        change24h: data.ethereum?.usd_24h_change || -0.82,
        volume24h: data.ethereum?.usd_24h_vol || 8900000000,
        marketCap: data.ethereum?.usd_market_cap || 410000000000,
        name: "Ethereum",
        base: "ETH",
        high24h: (data.ethereum?.usd || 3421.44) * 1.03,
        low24h: (data.ethereum?.usd || 3421.44) * 0.97,
      },
      "SOL/USD": {
        price: data.solana?.usd || 145.2,
        change24h: data.solana?.usd_24h_change || 4.51,
        volume24h: data.solana?.usd_24h_vol || 2100000000,
        marketCap: data.solana?.usd_market_cap || 65000000000,
        name: "Solana",
        base: "SOL",
        high24h: (data.solana?.usd || 145.2) * 1.03,
        low24h: (data.solana?.usd || 145.2) * 0.97,
      },
      "BNB/USD": {
        price: data.binancecoin?.usd || 592.1,
        change24h: data.binancecoin?.usd_24h_change || 0.12,
        volume24h: data.binancecoin?.usd_24h_vol || 980000000,
        marketCap: data.binancecoin?.usd_market_cap || 91000000000,
        name: "BNB",
        base: "BNB",
        high24h: (data.binancecoin?.usd || 592.1) * 1.03,
        low24h: (data.binancecoin?.usd || 592.1) * 0.97,
      },
      "XRP/USD": {
        price: data.ripple?.usd || 0.48,
        change24h: data.ripple?.usd_24h_change || -2.33,
        volume24h: data.ripple?.usd_24h_vol || 1200000000,
        marketCap: data.ripple?.usd_market_cap || 26000000000,
        name: "Ripple",
        base: "XRP",
        high24h: (data.ripple?.usd || 0.48) * 1.03,
        low24h: (data.ripple?.usd || 0.48) * 0.97,
      },
    };
    // Add remaining local pairs
    const pairs = [
      { symbol: "JI/USD", name: "Ji Ledger", base: "JI", price: 1.4231, change24h: 5.24, volume24h: 2400000, marketCap: 42000000, high24h: 1.48, low24h: 1.18 },
    ];
    for (const [sym, info] of Object.entries(mapped)) {
      pairs.push({ symbol: sym, ...info });
    }
    COINGECKO_CACHE.data = pairs;
    COINGECKO_CACHE.updatedAt = now;
    return pairs;
  } catch (err) {
    console.warn("CoinGecko fetch failed:", err.message);
    if (COINGECKO_CACHE.data) return COINGECKO_CACHE.data;
    // Fallback defaults
    return [
      { symbol: "BTC/USD", name: "Bitcoin", base: "BTC", price: 64231.1, change24h: 1.28, volume24h: 18200000000, marketCap: 1250000000000, high24h: 65100, low24h: 62800 },
      { symbol: "ETH/USD", name: "Ethereum", base: "ETH", price: 3421.44, change24h: -0.82, volume24h: 8900000000, marketCap: 410000000000, high24h: 3480, low24h: 3350 },
      { symbol: "SOL/USD", name: "Solana", base: "SOL", price: 145.2, change24h: 4.51, volume24h: 2100000000, marketCap: 65000000000, high24h: 149.8, low24h: 138.5 },
      { symbol: "BNB/USD", name: "BNB", base: "BNB", price: 592.1, change24h: 0.12, volume24h: 980000000, marketCap: 91000000000, high24h: 598, low24h: 585 },
      { symbol: "XRP/USD", name: "Ripple", base: "XRP", price: 0.48, change24h: -2.33, volume24h: 1200000000, marketCap: 26000000000, high24h: 0.51, low24h: 0.46 },
      { symbol: "JI/USD", name: "Ji Ledger", base: "JI", price: 1.4231, change24h: 5.24, volume24h: 2400000, marketCap: 42000000, high24h: 1.48, low24h: 1.18 },
    ];
  }
}

await connectMongo();

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));

app.get("/api/crypto/prices", async (_req, res) => {
  try {
    const pairs = await fetchCoinGeckoPrices();
    res.json({ pairs });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get("/api/markets/pairs", async (_req, res) => {
  try {
    const pairs = await getMarketPairs();
    res.json({ pairs });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get("/api/markets/ticker", async (_req, res) => {
  try {
    const pairs = await getTickerPairs();
    res.json({ pairs });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get("/api/markets/orderbook/:symbol", async (req, res) => {
  try {
    const pairs = await getMarketPairs();
    const pair = pairs.find((p) => p.symbol === req.params.symbol) || pairs[0];
    const basePrice = pair?.price || 1.4231;
    res.json({ symbol: pair?.symbol || "JI/USD", ...generateOrderBook(basePrice) });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.get("/api/markets/trades/:symbol", async (req, res) => {
  try {
    const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
    const trades = await getRecentTrades(req.params.symbol, limit);
    res.json({
      trades: trades.map((t) => ({
        id: t._id || t.created_at,
        price: t.price?.toFixed?.(4) || String(t.price),
        amount: t.amount?.toFixed?.(2) || String(t.amount),
        side: t.side,
        time: new Date(t.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      })),
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.post("/api/markets/trade", authMiddleware, async (req, res) => {
  const { symbol = "JI/USD", side, price, amount } = req.body || {};
  const amountNum = Number(amount);
  const priceNum = Number(price);
  if (!side || !amountNum || amountNum <= 0 || !priceNum || priceNum <= 0) {
    return res.status(400).json({ detail: "Invalid trade parameters" });
  }

  const wallet = get("SELECT * FROM wallets WHERE user_id = ? AND is_primary = 1", [req.user.id]);
  if (!wallet) return res.status(404).json({ detail: "Primary wallet not found" });

  const MARKET_ADDRESS = "0xMARKET_LIQUIDITY_POOL_0x123";

  try {
    if (side === "sell") {
      if (wallet.balance < amountNum) return res.status(400).json({ detail: "Insufficient balance" });
      run("UPDATE wallets SET balance = balance - ? WHERE id = ?", [amountNum, wallet.id]);
      const hash = txHash({ from_address: wallet.address, to_address: MARKET_ADDRESS, amount: amountNum });
      run(
        "INSERT INTO transactions (id, user_id, from_address, to_address, amount, memo, tx_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
        [newId("tx_"), req.user.id, wallet.address, MARKET_ADDRESS, amountNum, `Market Sell: ${amountNum} ${symbol} @ $${priceNum}`, hash, nowIso()]
      );
      appendBlock("market_sell", { symbol, amount: amountNum, price: priceNum }, req.user.id);
    } else {
      run("UPDATE wallets SET balance = balance + ? WHERE id = ?", [amountNum, wallet.id]);
      appendBlock("market_buy", { symbol, amount: amountNum, price: priceNum }, req.user.id);
    }

    await updatePairPrice(symbol, (Math.random() - 0.5) * 0.01);
    const trades = await recordTrade({
      user_id: req.user.id,
      symbol,
      side,
      price: priceNum,
      amount: amountNum,
    });

    const updated = get("SELECT balance FROM wallets WHERE id = ?", [wallet.id]);
    res.json({
      status: "ok",
      new_balance: updated?.balance,
      trades,
    });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.post("/api/auth/register", async (req, res) => {
  try {
    const { email, username, password, phone } = req.body || {};
    if (!email || !username || !password) return res.status(400).json({ detail: "Missing required fields: email, username, password" });

    const emailLower = email.toLowerCase().trim();
    const existingEmail = get("SELECT id FROM users WHERE email = ?", [emailLower]);
    if (existingEmail) return res.status(400).json({ detail: "Email already registered" });

    if (phone) {
      const phoneTrimmed = phone.trim();
      const existingPhone = get("SELECT id FROM users WHERE phone = ? AND phone IS NOT NULL", [phoneTrimmed]);
      if (existingPhone) return res.status(400).json({ detail: "Phone number already registered" });
    }

    const user = createUserWithWallet({
      email: emailLower,
      username: username.trim(),
      phone: phone ? phone.trim() : null,
      passwordHash: await bcrypt.hash(password, 10),
    });
    res.json({ token: createToken(user.id), user: publicUser(user) });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ detail: "Registration failed: " + err.message });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) return res.status(400).json({ detail: "Missing email and password" });

    const emailLower = email.toLowerCase().trim();
    // Try email first, then phone
    let user = get("SELECT * FROM users WHERE email = ?", [emailLower]);
    if (!user) {
      user = get("SELECT * FROM users WHERE phone = ?", [emailLower]);
    }

    if (!user) return res.status(401).json({ detail: "Invalid credentials - account not found" });
    if (!user.password_hash) return res.status(401).json({ detail: "Invalid credentials - no password set (try MetaMask)" });

    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ detail: "Invalid credentials - wrong password" });

    res.json({ token: createToken(user.id), user: publicUser(user) });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ detail: "Login failed: " + err.message });
  }
});

app.get("/api/auth/me", authMiddleware, (req, res) => res.json(publicUser(req.user)));

app.post("/api/siwe/nonce", (req, res) => {
  const address = req.body?.address;
  if (!address?.startsWith("0x")) return res.status(400).json({ detail: "Invalid address" });
  const nonce = crypto.randomBytes(16).toString("hex");
  const message = `Ji Ledger wants you to sign in with your Ethereum account:\n${address}\n\nSign in to Ji Ledger — Web3 Protocol Stack\n\nNonce: ${nonce}`;
  run("INSERT INTO siwe_nonces (nonce, address, message, created_at) VALUES (?, ?, ?, ?)", [nonce, address.toLowerCase(), message, nowIso()]);
  res.json({ nonce, message });
});

app.post("/api/siwe/verify", (req, res) => {
  const { address, signature, nonce } = req.body || {};
  const row = get("SELECT * FROM siwe_nonces WHERE nonce = ?", [nonce]);
  if (!row) return res.status(400).json({ detail: "Invalid nonce" });
  if (row.address !== address.toLowerCase()) return res.status(400).json({ detail: "Address mismatch" });
  if (!signature) return res.status(400).json({ detail: "Invalid signature" });

  let user = get("SELECT * FROM users WHERE lower(wallet_address) = lower(?)", [address]);
  if (!user) {
    user = createUserWithWallet({
      email: `${address.toLowerCase()}@wallet.local`,
      username: `wallet_${address.slice(-6)}`,
      address,
    });
    appendBlock("siwe_login", { address, signature: signature.slice(0, 20) + "..." }, user.id);
  }
  run("DELETE FROM siwe_nonces WHERE nonce = ?", [nonce]);
  res.json({ token: createToken(user.id), user: publicUser(user) });
});

app.get("/api/wallet/me", authMiddleware, (req, res) => res.json({ wallets: getWallets(req.user.id) }));

app.get("/api/wallet/transactions", authMiddleware, (req, res) => {
  res.json({ transactions: all("SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC LIMIT 100", [req.user.id]) });
});

app.post("/api/wallet/send", authMiddleware, (req, res) => {
  const { from_address, to_address, amount, memo = "" } = req.body || {};
  const wallet = get("SELECT * FROM wallets WHERE user_id = ? AND lower(address) = lower(?)", [req.user.id, from_address]);
  if (!wallet) return res.status(404).json({ detail: "Wallet not found" });
  if (wallet.balance < amount) return res.status(400).json({ detail: "Insufficient balance" });
  run("UPDATE wallets SET balance = balance - ? WHERE id = ?", [amount, wallet.id]);
  const recipient = get("SELECT * FROM wallets WHERE lower(address) = lower(?)", [to_address]);
  if (recipient) run("UPDATE wallets SET balance = balance + ? WHERE id = ?", [amount, recipient.id]);
  const hash = txHash({ from_address, to_address, amount, memo });
  run(
    "INSERT INTO transactions (id, user_id, from_address, to_address, amount, memo, tx_hash, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [newId("tx_"), req.user.id, from_address, to_address, amount, memo, hash, nowIso()]
  );
  appendBlock("transfer", { from_address, to_address, amount, memo, tx_hash: hash }, req.user.id);
  res.json({ tx_hash: hash, amount });
});

app.post("/api/wallet/faucet", authMiddleware, (req, res) => {
  const wallet = get("SELECT * FROM wallets WHERE user_id = ? AND is_primary = 1", [req.user.id]);
  if (!wallet) return res.status(404).json({ detail: "Primary wallet not found" });
  run("UPDATE wallets SET balance = balance + 500 WHERE id = ?", [wallet.id]);
  appendBlock("faucet", { address: wallet.address, amount: 500 }, req.user.id);
  res.json({ new_balance: wallet.balance + 500 });
});

app.get("/api/tokens/", (_req, res) => res.json({ tokens: all("SELECT * FROM tokens ORDER BY created_at DESC") }));
app.get("/api/tokens/mine", authMiddleware, (req, res) => {
  res.json({
    tokens: all(
      `SELECT t.*, h.balance FROM token_holdings h JOIN tokens t ON t.id = h.token_id WHERE h.user_id = ? ORDER BY t.created_at DESC`,
      [req.user.id]
    ),
  });
});

app.post("/api/tokens/create", authMiddleware, (req, res) => {
  const { name, symbol, total_supply, description = "" } = req.body || {};
  const wallets = getWallets(req.user.id);
  const creator = wallets[0]?.address || req.user.wallet_address;
  const tokenId = newId("tok_");
  run(
    "INSERT INTO tokens (id, user_id, name, symbol, total_supply, description, creator_address, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [tokenId, req.user.id, name, symbol.toUpperCase(), total_supply, description, creator, nowIso()]
  );
  run("INSERT INTO token_holdings (id, token_id, user_id, balance) VALUES (?, ?, ?, ?)", [newId("th_"), tokenId, req.user.id, total_supply]);
  appendBlock("token_create", { token_id: tokenId, symbol: symbol.toUpperCase(), supply: total_supply }, req.user.id);
  res.json({ id: tokenId, symbol: symbol.toUpperCase() });
});

app.post("/api/tokens/transfer", authMiddleware, (req, res) => {
  const { token_id, to_address, amount } = req.body || {};
  const holding = get("SELECT * FROM token_holdings WHERE token_id = ? AND user_id = ?", [token_id, req.user.id]);
  if (!holding || holding.balance < amount) return res.status(400).json({ detail: "Insufficient token balance" });
  const recipient = get("SELECT * FROM users WHERE lower(wallet_address) = lower(?)", [to_address]);
  if (!recipient) return res.status(404).json({ detail: "Recipient wallet not found on Ji Ledger" });
  run("UPDATE token_holdings SET balance = balance - ? WHERE id = ?", [amount, holding.id]);
  const existing = get("SELECT * FROM token_holdings WHERE token_id = ? AND user_id = ?", [token_id, recipient.id]);
  if (existing) run("UPDATE token_holdings SET balance = balance + ? WHERE id = ?", [amount, existing.id]);
  else run("INSERT INTO token_holdings (id, token_id, user_id, balance) VALUES (?, ?, ?, ?)", [newId("th_"), token_id, recipient.id, amount]);
  appendBlock("token_transfer", { token_id, to_address, amount }, req.user.id);
  res.json({ status: "ok" });
});

app.get("/api/nft/", (_req, res) => res.json({ nfts: all("SELECT * FROM nfts ORDER BY created_at DESC") }));
app.get("/api/nft/mine", authMiddleware, (req, res) => res.json({ nfts: all("SELECT * FROM nfts WHERE user_id = ? ORDER BY created_at DESC", [req.user.id]) }));

app.post("/api/nft/mint", authMiddleware, (req, res) => {
  const { name, description = "", image_url = "", collection = "Genesis" } = req.body || {};
  const nftId = newId("nft_");
  const countRow = get("SELECT COUNT(*) AS c FROM nfts");
  const tokenId = String((countRow?.c || 0) + 1);
  run(
    "INSERT INTO nfts (id, user_id, name, description, image_url, collection, token_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [nftId, req.user.id, name, description, image_url, collection, tokenId, nowIso()]
  );
  appendBlock("nft_mint", { nft_id: nftId, name, collection }, req.user.id);
  res.json({ id: nftId, token_id: tokenId });
});

app.get("/api/voting/proposals", (_req, res) => {
  const proposals = all("SELECT * FROM proposals ORDER BY created_at DESC").map((p) => {
    const created = new Date(p.created_at);
    return {
      ...p,
      options: JSON.parse(p.options),
      votes: JSON.parse(p.votes),
      expires_at: new Date(created.getTime() + p.duration_hours * 3600000).toISOString(),
    };
  });
  res.json({ proposals });
});

app.post("/api/voting/proposals", authMiddleware, (req, res) => {
  const { title, description = "", options = ["YES", "NO"], duration_hours = 72 } = req.body || {};
  const id = newId("prop_");
  run(
    "INSERT INTO proposals (id, user_id, title, description, options, duration_hours, created_at, votes) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [id, req.user.id, title, description, JSON.stringify(options), duration_hours, nowIso(), "{}"]
  );
  appendBlock("proposal_create", { proposal_id: id, title }, req.user.id);
  res.json({ id });
});

app.post("/api/voting/vote", authMiddleware, (req, res) => {
  const { proposal_id, option } = req.body || {};
  const proposal = get("SELECT * FROM proposals WHERE id = ?", [proposal_id]);
  if (!proposal) return res.status(404).json({ detail: "Proposal not found" });
  const options = JSON.parse(proposal.options);
  if (!options.includes(option)) return res.status(400).json({ detail: "Invalid vote option" });
  const votes = JSON.parse(proposal.votes);
  if (votes[req.user.id]) return res.status(400).json({ detail: "Already voted" });
  votes[req.user.id] = option;
  run("UPDATE proposals SET votes = ? WHERE id = ?", [JSON.stringify(votes), proposal_id]);
  appendBlock("vote", { proposal_id, option }, req.user.id);
  res.json({ status: "ok" });
});

app.get("/api/supply/products", authMiddleware, (req, res) => {
  const products = all("SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC", [req.user.id]).map((p) => ({
    ...p,
    checkpoints: all("SELECT * FROM checkpoints WHERE product_id = ? ORDER BY created_at ASC", [p.id]),
  }));
  res.json({ products });
});

app.get("/api/supply/products/:id", authMiddleware, (req, res) => {
  const product = get("SELECT * FROM products WHERE id = ? AND user_id = ?", [req.params.id, req.user.id]);
  if (!product) return res.status(404).json({ detail: "Product not found" });
  res.json({ ...product, checkpoints: all("SELECT * FROM checkpoints WHERE product_id = ? ORDER BY created_at ASC", [product.id]) });
});

app.post("/api/supply/register", authMiddleware, (req, res) => {
  const { name, sku, description = "", origin = "", category = "GENERAL" } = req.body || {};
  const id = newId("prod_");
  const publicId = newId("p_");
  run(
    "INSERT INTO products (id, user_id, public_id, name, sku, description, origin, category, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
    [id, req.user.id, publicId, name, sku, description, origin, category, nowIso()]
  );
  appendBlock("supply_register", { product_id: id, sku }, req.user.id);
  res.json({ id, public_id: publicId });
});

app.post("/api/supply/checkpoint", authMiddleware, (req, res) => {
  const { product_id, location = "", handler = "", status = "", notes = "" } = req.body || {};
  const product = get("SELECT * FROM products WHERE id = ? AND user_id = ?", [product_id, req.user.id]);
  if (!product) return res.status(404).json({ detail: "Product not found" });
  const cpId = newId("cp_");
  run(
    "INSERT INTO checkpoints (id, product_id, location, handler, status, notes, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [cpId, product_id, location, handler, status, notes, nowIso()]
  );
  appendBlock("supply_checkpoint", { product_id, status }, req.user.id);
  res.json({ id: cpId });
});

app.get("/api/supply/public/:publicId", (req, res) => {
  const product = get("SELECT * FROM products WHERE public_id = ?", [req.params.publicId]);
  if (!product) return res.status(404).json({ detail: "Product not found" });
  res.json({ ...product, checkpoints: all("SELECT location, handler, status, notes, created_at FROM checkpoints WHERE product_id = ? ORDER BY created_at ASC", [product.id]) });
});

app.get("/api/explorer/stats", (_req, res) => {
  const latest = latestBlock();
  res.json({
    total_blocks: all("SELECT COUNT(*) AS c FROM blocks")[0]?.c || 0,
    total_tokens: all("SELECT COUNT(*) AS c FROM tokens")[0]?.c || 0,
    total_nfts: all("SELECT COUNT(*) AS c FROM nfts")[0]?.c || 0,
    total_proposals: all("SELECT COUNT(*) AS c FROM proposals")[0]?.c || 0,
    total_products: all("SELECT COUNT(*) AS c FROM products")[0]?.c || 0,
    latest_block: latest?.block_index || 0,
  });
});

app.get("/api/explorer/blocks", (req, res) => {
  const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 200);
  const blocks = all(
    "SELECT block_index AS idx, hash, prev_hash, timestamp, tx_type, tx_data FROM blocks ORDER BY block_index DESC LIMIT ?",
    [limit]
  ).map((b) => ({ ...b, tx_data: JSON.parse(b.tx_data) }));
  res.json({ blocks });
});

app.get("/api/analytics/overview", (_req, res) => {
  const daily = all(`
    SELECT substr(timestamp, 1, 10) AS date, COUNT(*) AS count
    FROM blocks GROUP BY substr(timestamp, 1, 10) ORDER BY date DESC LIMIT 14
  `).reverse();
  const by_type = all("SELECT tx_type AS type, COUNT(*) AS count FROM blocks GROUP BY tx_type");
  const top_tokens = all("SELECT name, symbol, total_supply FROM tokens ORDER BY total_supply DESC LIMIT 5");
  res.json({ daily, by_type, top_tokens });
});

app.post("/api/files/upload", authMiddleware, upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ detail: "No file provided" });
  res.json({ url: `/uploads/${req.file.filename}` });
});

app.get("/api/sepolia/history", authMiddleware, (req, res) => {
  res.json({ history: all("SELECT * FROM sepolia_logs WHERE user_id = ? ORDER BY created_at DESC LIMIT 50", [req.user.id]) });
});

app.post("/api/sepolia/log", authMiddleware, (req, res) => {
  const { tx_hash, action, amount = null } = req.body || {};
  const id = newId("sep_");
  run(
    "INSERT INTO sepolia_logs (id, user_id, tx_hash, action, amount, created_at) VALUES (?, ?, ?, ?, ?, ?)",
    [id, req.user.id, tx_hash, action, amount, nowIso()]
  );
  appendBlock("sepolia_log", { tx_hash, action }, req.user.id);
  res.json({ id });
});

const frontendBuild = path.join(__dirname, "..", "frontend", "build");
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  app.get("*", (_req, res) => res.sendFile(path.join(frontendBuild, "index.html")));
}

// ── KYC routes ───────────────────────────────────────────────
app.post("/api/kyc/submit", authMiddleware, upload.none(), (req, res) => {
  const { full_name, pan, dob, address } = req.body || {};
  if (!full_name || !pan || !dob || !address)
    return res.status(400).json({ detail: "All KYC fields are required" });
  const existing = get("SELECT * FROM kyc WHERE user_id = ?", [req.user.id]);
  if (existing && existing.status === "approved")
    return res.status(400).json({ detail: "KYC already approved" });
  const id = newId("kyc_");
  if (existing) {
    run("UPDATE kyc SET full_name=?, pan=?, dob=?, address=?, status='pending', submitted_at=? WHERE user_id=?",
      [full_name, pan.toUpperCase(), dob, address, nowIso(), req.user.id]);
  } else {
    run("INSERT INTO kyc (id, user_id, full_name, pan, dob, address, status, submitted_at) VALUES (?,?,?,?,?,?,?,?)",
      [id, req.user.id, full_name, pan.toUpperCase(), dob, address, "pending", nowIso()]);
  }
  res.json({ status: "pending", message: "KYC submitted successfully. Verification takes 1-2 business days." });
});

app.get("/api/kyc/status", authMiddleware, (req, res) => {
  const kyc = get("SELECT status, submitted_at FROM kyc WHERE user_id = ?", [req.user.id]);
  res.json({ kyc: kyc || null });
});

// ── Razorpay payment routes ────────────────────────────────
const razorpay = process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET
  ? new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET })
  : null;

app.post("/api/payment/create-order", authMiddleware, async (req, res) => {
  if (!razorpay) return res.status(503).json({ detail: "Payment gateway not configured" });
  const { amount_inr } = req.body || {};
  const amountPaise = Math.round(Number(amount_inr) * 100);
  if (!amountPaise || amountPaise < 100)
    return res.status(400).json({ detail: "Minimum deposit is ₹1" });
  try {
    const order = await razorpay.orders.create({
      amount: amountPaise, currency: "INR",
      receipt: newId("rcpt_"),
      notes: { user_id: req.user.id },
    });
    run("INSERT INTO payments (id, user_id, order_id, amount, currency, status, created_at) VALUES (?,?,?,?,?,?,?)",
      [newId("pay_"), req.user.id, order.id, amount_inr, "INR", "created", nowIso()]);
    res.json({ order_id: order.id, amount: amountPaise, currency: "INR", key: process.env.RAZORPAY_KEY_ID });
  } catch (err) {
    res.status(500).json({ detail: err.message });
  }
});

app.post("/api/payment/verify", authMiddleware, async (req, res) => {
  if (!razorpay) return res.status(503).json({ detail: "Payment gateway not configured" });
  const { order_id, payment_id, signature, amount_inr } = req.body || {};
  const body = order_id + "|" + payment_id;
  const expectedSig = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body).digest("hex");
  if (expectedSig !== signature)
    return res.status(400).json({ detail: "Payment verification failed" });
  // Credit JI tokens at rate: ₹1 = 1 JI
  const jiAmount = Number(amount_inr);
  const wallet = get("SELECT * FROM wallets WHERE user_id = ? AND is_primary = 1", [req.user.id]);
  if (wallet) {
    run("UPDATE wallets SET balance = balance + ? WHERE id = ?", [jiAmount, wallet.id]);
    appendBlock("deposit", { payment_id, amount_inr, ji_credited: jiAmount }, req.user.id);
  }
  run("UPDATE payments SET payment_id=?, status='paid' WHERE order_id=?", [payment_id, order_id]);
  res.json({ status: "ok", ji_credited: jiAmount, new_balance: (wallet?.balance || 0) + jiAmount });
});

app.listen(PORT, () => {
  console.log(`Ji Ledger backend running at http://127.0.0.1:${PORT}`);
});