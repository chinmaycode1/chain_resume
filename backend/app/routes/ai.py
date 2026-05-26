from fastapi import APIRouter, HTTPException
from app.models.resume import Resume
from app.services.ai_service import score_resume

router = APIRouter()

@router.post("/score")
async def score_user_resume(resume: Resume, mode: str = "polish"):
    """
    Score resume using Claude AI
    mode: "polish" or "roast"
    """
    if mode not in ["polish", "roast"]:
        raise HTTPException(status_code=400, detail="Mode must be 'polish' or 'roast'")
    
    try:
        feedback = await score_resume(resume, mode)
        return feedback
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI scoring failed: {str(e)}")
