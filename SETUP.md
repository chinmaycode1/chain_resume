# ChainResume - Quick Setup Guide

## Phase 1 Complete! ✅

You now have:
- ✅ Full project structure
- ✅ Frontend (React + Vite + TypeScript + Tailwind)
- ✅ Backend (FastAPI with AI, IPFS, Supabase services)
- ✅ Smart Contracts (Solidity SBT with Hardhat)
- ✅ Auth system (Supabase + RainbowKit)
- ✅ Resume builder (multi-step form)
- ✅ Docker setup
- ✅ GitHub Actions CI/CD

## 🚀 Quick Start

### Option 1: Run Locally (Recommended for Development)

#### 1. Install Dependencies

**Frontend:**
```bash
cd frontend
npm install
```

**Backend:**
```bash
cd backend
pip install -r requirements.txt
```

**Contracts:**
```bash
cd contracts
npm install
```

#### 2. Set Up Environment Variables

Copy `.env.example` to `.env` in the root directory and fill in:

```bash
cp .env.example .env
```

**Required API Keys:**

1. **Supabase** (Free tier available)
   - Go to https://supabase.com
   - Create a new project
   - Get URL and anon key from Settings > API
   - Create a `resumes` table in your database

2. **Anthropic Claude API** (For AI scoring)
   - Go to https://console.anthropic.com
   - Get API key

3. **WalletConnect Project ID** (Free)
   - Go to https://cloud.walletconnect.com
   - Create a project
   - Get Project ID

4. **Pinata** (Free tier for IPFS)
   - Go to https://pinata.cloud
   - Get API key and secret

5. **Razorpay** (Optional - for payments)
   - Go to https://razorpay.com
   - Get test keys

#### 3. Run Services

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```
Backend runs on http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend runs on http://localhost:5173

**Terminal 3 - Smart Contracts (Optional):**
```bash
cd contracts
npx hardhat node  # Local blockchain
```

### Option 2: Run with Docker

**Note:** Docker is not currently installed on your system. To use Docker:

1. Install Docker Desktop from https://www.docker.com/products/docker-desktop
2. Create `.env` file with all environment variables
3. Run:

```bash
docker-compose up
```

## 📋 Supabase Database Setup

Create a `resumes` table in Supabase:

```sql
CREATE TABLE resumes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  location TEXT,
  title TEXT NOT NULL,
  summary TEXT NOT NULL,
  education JSONB DEFAULT '[]',
  experience JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  projects JSONB DEFAULT '[]',
  links JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add index for faster lookups
CREATE INDEX idx_resumes_user_id ON resumes(user_id);
```

## 🧪 Testing

**Frontend:**
```bash
cd frontend
npm run lint
npm run build
```

**Backend:**
```bash
cd backend
pytest
```

**Smart Contracts:**
```bash
cd contracts
npx hardhat test
npx hardhat compile
```

## 🌐 Deploy Smart Contract to Polygon Amoy

1. Get test MATIC from https://faucet.polygon.technology/
2. Add your private key to `contracts/.env`
3. Deploy:

```bash
cd contracts
npx hardhat run scripts/deploy.js --network amoy
```

4. Copy the deployed contract address to your `.env` as `VITE_CONTRACT_ADDRESS`

## 🎯 What's Working Now

1. **Auth Page** (`/auth`)
   - Email/password signup/login
   - Wallet connection with RainbowKit
   - Cyberpunk dark theme

2. **Resume Builder** (`/builder`)
   - Multi-step form (Personal Info, Experience, Skills)
   - Auto-save every 30 seconds
   - Progress bar
   - Smooth animations

3. **Dashboard** (`/dashboard`)
   - Stats display
   - Quick actions
   - Resume preview

4. **Backend API** (http://localhost:8000)
   - `/api/resume/save` - Save resume
   - `/api/resume/{user_id}` - Get resume
   - `/api/ai/score` - AI scoring (needs Claude API key)
   - `/api/blockchain/upload-ipfs` - Upload to IPFS

5. **Smart Contract**
   - Soul-Bound Token (non-transferable NFT)
   - Mint credential with IPFS hash and AI score
   - Update credential
   - Verify on-chain

## 🔜 Next Steps (Phase 2)

1. Integrate Claude API for resume scoring
2. Add animated circular progress bars for AI scores
3. Implement "Roast Mode" and "Polish Mode"
4. Add bullet-by-bullet feedback display

## 🐛 Troubleshooting

**Port already in use:**
```bash
# Kill process on port 5173 (frontend)
npx kill-port 5173

# Kill process on port 8000 (backend)
npx kill-port 8000
```

**Module not found errors:**
```bash
# Frontend
cd frontend && npm install

# Backend
cd backend && pip install -r requirements.txt
```

**Supabase connection issues:**
- Check your `.env` file has correct Supabase URL and keys
- Verify Supabase project is active
- Check if `resumes` table exists

## 📚 Documentation

- Frontend: http://localhost:5173
- Backend API Docs: http://localhost:8000/docs
- Hardhat: https://hardhat.org/docs
- Supabase: https://supabase.com/docs
- RainbowKit: https://www.rainbowkit.com/docs

## 🎨 Design System

All components follow the cyberpunk theme:
- Dark backgrounds (#020208, #0A0A1A)
- Neon green accents (#00FF94)
- Electric blue highlights (#00D4FF)
- Glassmorphism cards
- Glow effects on hover
- Terminal-style fonts (JetBrains Mono)

## 💡 Tips

1. Use the browser console to debug API calls
2. Check backend logs for errors
3. Test wallet connection with MetaMask on Polygon Amoy testnet
4. Use Supabase dashboard to view database records
5. All forms have validation and error handling

---

**Ready to build!** Start the frontend and backend, then navigate to http://localhost:5173/auth
