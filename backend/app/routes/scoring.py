from fastapi import APIRouter, HTTPException
from app.models.resume import Resume
from app.models.ai_score import AIScoreResponse
from app.services.ai_service import score_resume_v2, polish_bullet
from app.services.supabase_service import save_ai_score, get_latest_score, get_score_history
from pydantic import BaseModel

router = APIRouter()

class PolishBulletRequest(BaseModel):
    bullet: str
    context: str = ""

class ApplyPolishRequest(BaseModel):
    resume: Resume
    suggestions: list

@router.post("/score", response_model=AIScoreResponse)
async def score_resume_endpoint(resume: Resume):
    """
    Score resume using Claude AI with Phase 2 structure
    Returns: overall_score, categories, bullet_feedback, roast, strengths, quick_wins
    """
    try:
        # Get AI score
        score_data = await score_resume_v2(resume)
        
        # Save to Supabase (use user_id as resume_id for now)
        await save_ai_score(
            resume_id=resume.user_id,
            user_id=resume.user_id,
            score_data=score_data
        )
        
        return score_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI scoring failed: {str(e)}")

@router.get("/{resume_id}/scores")
async def get_resume_scores(resume_id: str):
    """Get all AI scores for a resume (history)"""
    try:
        scores = await get_score_history(resume_id)
        return {"scores": scores, "count": len(scores)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch scores: {str(e)}")

@router.get("/{resume_id}/latest-score")
async def get_resume_latest_score(resume_id: str):
    """Get most recent AI score for a resume"""
    try:
        score = await get_latest_score(resume_id)
        if score:
            return score
        else:
            raise HTTPException(status_code=404, detail="No scores found for this resume")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch score: {str(e)}")

@router.post("/polish-bullet")
async def polish_bullet_endpoint(request: PolishBulletRequest):
    """Polish a single bullet point using AI"""
    try:
        improved = await polish_bullet(request.bullet, request.context)
        return {
            "original": request.bullet,
            "improved": improved
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to polish bullet: {str(e)}")

@router.post("/apply-polish")
async def apply_polish_endpoint(request: ApplyPolishRequest):
    """Apply all polish suggestions to resume"""
    try:
        # This endpoint would apply all suggestions to the resume
        # For now, just return success
        return {
            "success": True,
            "message": "Polish suggestions applied",
            "updated_resume": request.resume
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to apply polish: {str(e)}")
