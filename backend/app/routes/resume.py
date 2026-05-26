from fastapi import APIRouter, HTTPException
from app.models.resume import Resume
from app.services.supabase_service import save_resume, get_resume, get_public_resume

router = APIRouter()

@router.post("/save")
async def save_user_resume(resume: Resume):
    """Save or update resume"""
    result = await save_resume(resume)
    if result["success"]:
        return {"message": "Resume saved successfully", "data": result["data"]}
    else:
        raise HTTPException(status_code=500, detail=result["error"])

@router.get("/{user_id}")
async def get_user_resume(user_id: str):
    """Get resume by user_id"""
    resume = await get_resume(user_id)
    if resume:
        return resume
    else:
        raise HTTPException(status_code=404, detail="Resume not found")

@router.get("/public/{username}")
async def get_public_user_resume(username: str):
    """Get public resume by username"""
    resume = await get_public_resume(username)
    if resume:
        return resume
    else:
        raise HTTPException(status_code=404, detail="Resume not found")
