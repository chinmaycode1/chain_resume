from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables BEFORE importing routes
load_dotenv()

from app.routes import resume, ai, blockchain, scoring

app = FastAPI(
    title="ChainResume API",
    description="Blockchain-verified AI-powered resume platform",
    version="1.0.0"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://frontend:5173",
        "https://chainresume.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(resume.router, prefix="/api/resume", tags=["resume"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(blockchain.router, prefix="/api/blockchain", tags=["blockchain"])
app.include_router(scoring.router, prefix="/api/resume", tags=["scoring"])

@app.get("/")
async def root():
    return {
        "message": "ChainResume API",
        "status": "online",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
