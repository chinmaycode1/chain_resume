from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class CategoryScore(BaseModel):
    score: int  # 0-100
    label: str

class BulletFeedback(BaseModel):
    original: str
    issue: str
    suggestion: str
    severity: str  # "high", "medium", "low"

class AIScoreResponse(BaseModel):
    overall_score: int  # 0-100
    categories: Dict[str, CategoryScore]
    bullet_feedback: List[BulletFeedback]
    roast: str
    strengths: List[str]
    quick_wins: List[str]

class AIScoreRecord(BaseModel):
    id: Optional[str] = None
    resume_id: str
    user_id: str
    overall_score: int
    categories_json: Dict[str, CategoryScore]
    bullet_feedback_json: List[BulletFeedback]
    roast_text: str
    strengths: List[str]
    quick_wins: List[str]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

# Legacy models for backward compatibility
class AIScore(BaseModel):
    ats_score: int  # 0-100
    impact_score: int  # 0-100
    skill_relevance_score: int  # 0-100
    overall_score: int  # 0-100
    
class AIFeedback(BaseModel):
    scores: AIScore
    bullet_feedback: List[BulletFeedback]
    general_feedback: List[str]
    top_strengths: List[str]
    top_weaknesses: List[str]
    mode: str  # "roast" or "polish"
