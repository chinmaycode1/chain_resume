# 🚀 ChainResume - Quick Start

## ✅ Phase 1 Complete!

Everything is set up and ready to run. Here's how to get started in 5 minutes.

## 📋 Prerequisites Checklist

Before starting, make sure you have:
- ✅ Node.js 20+ installed
- ✅ Python 3.10+ installed
- ✅ npm installed
- ⚠️ Docker (optional - not detected on your system)

## 🎯 3-Step Quick Start

### Step 1: Install Dependencies

```bash
# Frontend
cd frontend
npm install

# Backend (in new terminal)
cd backend
pip install -r requirements.txt

# Contracts (in new terminal - optional)
cd contracts
npm install
```

### Step 2: Set Up Environment Variables

Create `.env` file in the root directory:

```bash
# Copy the example
cp .env.example .env
```

**Minimum required to run locally (get these first):**

1. **Supabase** (Free - 5 minutes setup)
   - Go to https://supabase.com
   - Click "New Project"
   - Copy URL and anon key
   - Add to `.env`:
     ```
     VITE_SUPABASE_URL=https://your-project.supabase.co
     VITE_SUPABASE_ANON_KEY=your_anon_key
     SUPABASE_URL=https://your-project.supabase.co
     SUPABASE_SERVICE_KEY=your_service_key
     ```

2. **Create Supabase Table**
   - In Supabase dashboard, go to SQL Editor
   - Run this SQL:
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
     
     CREATE INDEX idx_resumes_user_id ON resumes(user_id);
     ```

3. **WalletConnect** (Free - 2 minutes)
   - Go to https://cloud.walletconnect.com
   - Create project
   - Copy Project ID
   - Add to `.env`:
     ```
     VITE_WALLETCONNECT_PROJECT_ID=your_project_id
     ```

**Optional (for full features):**
- Anthropic Claude API (for AI scoring)
- Pinata (for IPFS)
- Razorpay (for payments)

### Step 3: Run the App

**Terminal 1 - Backend:**
```bash
cd backend
uvicorn app.main:app --reload
```
✅ Backend running at http://localhost:8000

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
✅ Frontend running at http://localhost:5173

**Terminal 3 - Contracts (Optional):**
```bash
cd contracts
npx hardhat test
```

## 🎉 You're Ready!

Open http://localhost:5173/auth in your browser.

### What You Can Do Now:

1. **Sign Up** with email/password
2. **Build Resume** - Fill out the 3-step form
3. **View Dashboard** - See your stats
4. **Connect Wallet** - Use RainbowKit to connect MetaMask

## 🧪 Test the Smart Contract

```bash
cd contracts
npx hardhat test
```

You should see all tests passing ✅

## 📱 Pages Available

- `/auth` - Login/Signup page
- `/builder` - Resume builder (3 steps)
- `/dashboard` - User dashboard

## 🎨 What You'll See

- **Dark cyberpunk theme** - No white backgrounds
- **Neon green accents** - Primary color
- **Glassmorphism cards** - Blurred transparent cards
- **Smooth animations** - Framer Motion transitions
- **Terminal fonts** - JetBrains Mono

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Windows
npx kill-port 5173
npx kill-port 8000

# Or change ports in:
# - frontend/vite.config.ts (port: 5173)
# - backend: uvicorn app.main:app --port 8001
```

### Module Not Found

```bash
# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Backend
cd backend
pip install -r requirements.txt --force-reinstall
```

### Supabase Connection Error

- Check `.env` has correct Supabase URL and keys
- Verify Supabase project is active
- Make sure `resumes` table exists

### TypeScript Errors

```bash
cd frontend
npm run build
```

If build succeeds, errors are just IDE warnings.

## 📊 API Endpoints

Backend API docs: http://localhost:8000/docs

Available endpoints:
- `POST /api/resume/save` - Save resume
- `GET /api/resume/{user_id}` - Get resume
- `POST /api/ai/score` - AI score (needs Claude API key)
- `POST /api/blockchain/upload-ipfs` - Upload to IPFS (needs Pinata)

## 🚀 Next Steps

Once running, you can:

1. **Create a resume** - Use the builder
2. **Test AI scoring** - Add Claude API key
3. **Deploy contract** - To Polygon Amoy testnet
4. **Mint credential** - Create on-chain proof

## 📚 Full Documentation

- `README.md` - Project overview
- `SETUP.md` - Detailed setup guide
- `PHASE1_COMPLETE.md` - What's been built
- Backend API: http://localhost:8000/docs

## 💡 Pro Tips

1. **Auto-save works** - Resume saves every 30 seconds
2. **Hot reload enabled** - Changes reflect instantly
3. **TypeScript strict mode** - No `any` types allowed
4. **Responsive design** - Works on mobile (desktop-first)
5. **Error boundaries** - Graceful error handling

## 🎯 Current Features

✅ Authentication (Supabase + Wallet)
✅ Multi-step resume builder
✅ Auto-save functionality
✅ Dashboard with stats
✅ Cyberpunk UI theme
✅ Smart contract (SBT)
✅ Backend API
✅ Docker setup
✅ CI/CD pipeline

## 🔜 Coming in Phase 2

- AI resume scoring with Claude
- Animated score displays
- Roast mode / Polish mode
- Bullet-by-bullet feedback

---

**Need help?** Check the full `SETUP.md` or `README.md`

**Ready to code?** Open http://localhost:5173/auth and start building! 🚀
