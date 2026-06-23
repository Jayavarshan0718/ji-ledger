# Ji Ledger — DeFi Forge Lab

Local development copy of your **Ji Ledger Web3 Protocol Stack** blockchain sandbox app.

## What this includes

- **Frontend** (`frontend/`): React + Vite + Tailwind — wallet, tokens, NFTs, DAO voting, supply chain, block explorer, Sepolia logging
- **Backend** (`backend/`): Node.js Express + SQLite — auth, simulated blockchain, all `/api/*` routes

## Quick start

### 1. Backend

```powershell
cd C:\Users\jayav\defi-forge-lab\backend
npm install
copy .env.example .env
npm start
```

Backend runs at **http://127.0.0.1:8000** — health check: `http://127.0.0.1:8000/api/health`

### 2. Frontend

```powershell
cd C:\Users\jayav\defi-forge-lab\frontend
npm install
npm run dev
```

App opens at **http://localhost:3000**

### 3. Open in VS Code

```powershell
code C:\Users\jayav\defi-forge-lab\defi-forge-lab.code-workspace
```

Or in VS Code: **File → Open Workspace from File** → select `defi-forge-lab.code-workspace`

Use the **Full Stack** debug configuration to run backend + frontend together.

## First use

1. Go to http://localhost:3000/auth
2. Click **Register** and create an account
3. You receive a primary `0x` wallet with **1000 JI**
4. Explore modules from the console dashboard

## Live preview vs local

Your Emergent preview is at:
https://defi-forge-lab.preview.emergentagent.com/app

This local project mirrors the same API structure so you can develop offline. To export the original Emergent source code:

1. Open your project at [app.emergent.sh](https://app.emergent.sh)
2. Close the preview and click **Code**
3. Download folders or use **Save to GitHub**

## API endpoints

| Module | Routes |
|--------|--------|
| Auth | `/api/auth/register`, `/api/auth/login`, `/api/auth/me` |
| SIWE | `/api/siwe/nonce`, `/api/siwe/verify` |
| Wallet | `/api/wallet/me`, `/api/wallet/send`, `/api/wallet/faucet` |
| Tokens | `/api/tokens/`, `/api/tokens/create`, `/api/tokens/transfer` |
| NFT | `/api/nft/`, `/api/nft/mint`, `/api/files/upload` |
| DAO | `/api/voting/proposals`, `/api/voting/vote` |
| Supply | `/api/supply/products`, `/api/supply/register`, `/api/supply/checkpoint` |
| Explorer | `/api/explorer/stats`, `/api/explorer/blocks` |

## Production build

To publish the application, build the frontend and serve it through the Node.js backend:

```powershell
cd frontend
npm run build
cd ../backend
npm start
```

The backend serves the built frontend from `frontend/build/` when present.
