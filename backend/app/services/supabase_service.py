import os
from supabase import create_client, Client
from app.models.resume import Resume
from app.models.ai_score import AIScoreResponse, AIScoreRecord
from typing import Optional, List
from datetime import datetime

supabase: Client = create_client(
    os.getenv("SUPABASE_URL"),
    os.getenv("SUPABASE_SERVICE_KEY")
)

async def save_resume(resume: Resume) -> dict:
    """Save or update resume in Supabase"""
    try:
        data = resume.model_dump()
        
        # Check if resume exists
        existing = supabase.table("resumes").select("*").eq("user_id", resume.user_id).execute()
        
        if existing.data:
            # Update existing
            result = supabase.table("resumes").update(data).eq("user_id", resume.user_id).execute()
        else:
            # Insert new
            result = supabase.table("resumes").insert(data).execute()
        
        return {"success": True, "data": result.data}
    except Exception as e:
        return {"success": False, "error": str(e)}

async def get_resume(user_id: str) -> Optional[Resume]:
    """Get resume by user_id"""
    try:
        result = supabase.table("resumes").select("*").eq("user_id", user_id).execute()
        if result.data:
            return Resume(**result.data[0])
        return None
    except Exception as e:
        print(f"Error fetching resume: {e}")
        return None

async def get_public_resume(username: str) -> Optional[dict]:
    """Get public resume by username"""
    try:
        result = supabase.table("resumes").select("*").eq("username", username).execute()
        if result.data:
            return result.data[0]
        return None
    except Exception as e:
        print(f"Error fetching public resume: {e}")
        return None

async def save_ai_score(resume_id: str, user_id: str, score_data: AIScoreResponse) -> dict:
    """Save AI score to Supabase"""
    try:
        data = {
            "resume_id": resume_id,
            "user_id": user_id,
            "overall_score": score_data.overall_score,
            "categories_json": {k: v.model_dump() for k, v in score_data.categories.items()},
            "bullet_feedback_json": [b.model_dump() for b in score_data.bullet_feedback],
            "roast_text": score_data.roast,
            "strengths": score_data.strengths,
            "quick_wins": score_data.quick_wins,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        result = supabase.table("ai_scores").insert(data).execute()
        return {"success": True, "data": result.data}
    except Exception as e:
        print(f"Error saving AI score: {e}")
        return {"success": False, "error": str(e)}

async def get_latest_score(resume_id: str) -> Optional[AIScoreRecord]:
    """Get latest AI score for a resume"""
    try:
        result = supabase.table("ai_scores")\
            .select("*")\
            .eq("resume_id", resume_id)\
            .order("created_at", desc=True)\
            .limit(1)\
            .execute()
        
        if result.data:
            return AIScoreRecord(**result.data[0])
        return None
    except Exception as e:
        print(f"Error fetching latest score: {e}")
        return None

async def get_score_history(resume_id: str) -> List[AIScoreRecord]:
    """Get all AI scores for a resume (history)"""
    try:
        result = supabase.table("ai_scores")\
            .select("*")\
            .eq("resume_id", resume_id)\
            .order("created_at", desc=True)\
            .execute()
        
        if result.data:
            return [AIScoreRecord(**score) for score in result.data]
        return []
    except Exception as e:
        print(f"Error fetching score history: {e}")
        return []
