# ChainResume

Blockchain-verified, AI-powered resume platform with 3D animated resume cards.

## 🚀 Tech Stack

- **Frontend:** React 18 + Vite + TypeScript + Tailwind CSS
- **3D Graphics:** Three.js + React Three Fiber
- **Animations:** Framer Motion + GSAP
- **AI:** Groq API (Llama 3 70B)
- **Blockchain:** Solidity + Hardhat + Polygon Amoy
- **Wallet:** RainbowKit + wagmi + ethers.js
- **Backend:** Python FastAPI
- **Database:** Supabase
- **Storage:** IPFS (Pinata)
- **CI/CD:** GitHub Actions
- **Containerization:** Docker + Docker Compose

## 📁 Project Structure

```
chainresume/
├── frontend/          # React + Vite app
├── backend/           # Python FastAPI
├── contracts/         # Solidity smart contracts
├── .github/           # GitHub Actions workflows
├── docker-compose.yml
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 20+
- Python 3.10+
- Docker (optional)
- MetaMask or compatible Web3 wallet

### 1. Clone Repository

```bash
git clone https://github.com/chinmaycode1/chain_resume.git
cd chain_resume/chainresume
```

### 2. Environment Variables

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required API keys:
- Supabase (database & auth)
- Groq API (AI scoring with Llama 3)
- WalletConnect Project ID (wallet connection)
- Pinata (IPFS storage - optional)

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

### 4. Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs on `http://localhost:8000`

### 5. Smart Contracts Setup

```bash
cd contracts
npm install
npx hardhat compile
npx hardhat test
```

Deploy to Polygon Amoy testnet:

```bash
npx hardhat run scripts/deploy.js --network amoy
```

### 6. Docker Setup (Alternative)

```bash
docker-compose up
```

## 🎨 Design System

- **Theme:** Dark mode cyberpunk aesthetic
- **Colors:**
  - Neon Green: `#00FF94`
  - Electric Blue: `#00D4FF`
  - Deep Black: `#020208`
  - Dark Navy: `#0A0A1A`
  - Purple Glow: `#7C3AED`
  - Hot Pink: `#FF006E`
- **Fonts:** JetBrains Mono, Space Grotesk

## 📝 Phase 1 Features (Current)

- ✅ Project structure setup
- ✅ Docker configuration
- ✅ Supabase authentication
- ✅ Multi-step resume builder
- ✅ FastAPI backend with AI service
- ✅ Smart contract (Soul-Bound Token)
- ✅ GitHub Actions CI/CD pipeline

## 🔜 Next Phases

**Phase 2:** AI scoring with Claude API + animated score display

**Phase 3:** Three.js 3D resume card + holographic shader

**Phase 4:** Smart contract deployment + minting functionality

**Phase 5:** GitHub OAuth + CI/CD auto-sync

**Phase 6:** Public profile + verification + OG images

**Phase 7:** Dashboard + leaderboard + final polish

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm run test
```

### Backend Tests
```bash
cd backend
pytest
```

### Smart Contract Tests
```bash
cd contracts
npx hardhat test
```

## 🚢 Deployment

- **Frontend:** Vercel
- **Backend:** Railway
- **Smart Contracts:** Polygon Amoy Testnet

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or PR.
