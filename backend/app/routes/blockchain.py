from fastapi import APIRouter, HTTPException
from app.models.resume import Resume
from app.services.ipfs_service import upload_to_ipfs, get_from_ipfs

router = APIRouter()

@router.post("/upload-ipfs")
async def upload_resume_to_ipfs(resume: Resume):
    """Upload resume to IPFS"""
    result = await upload_to_ipfs(resume)
    if result["success"]:
        return {
            "message": "Resume uploaded to IPFS",
            "ipfs_hash": result["ipfs_hash"],
            "ipfs_url": result["ipfs_url"]
        }
    else:
        raise HTTPException(status_code=500, detail=result["error"])

@router.get("/ipfs/{ipfs_hash}")
async def get_resume_from_ipfs(ipfs_hash: str):
    """Get resume from IPFS"""
    result = await get_from_ipfs(ipfs_hash)
    if result["success"]:
        return result["data"]
    else:
        raise HTTPException(status_code=500, detail=result["error"])

@router.post("/verify/{wallet_address}")
async def verify_credential(wallet_address: str):
    """Verify on-chain credential (placeholder - will connect to smart contract)"""
    # TODO: Connect to smart contract to verify
    return {
        "verified": False,
        "message": "Smart contract integration pending"
    }
