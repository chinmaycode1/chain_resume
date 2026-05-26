from fastapi import APIRouter, HTTPException, File, UploadFile, Form
from app.models.resume import Resume
from app.services.supabase_service import save_resume, get_resume, get_public_resume
from app.services.ai_service import parse_resume_from_pdf
import io

router = APIRouter()

@router.post("/parse-pdf")
async def parse_pdf_resume(
    file: UploadFile = File(...),
    text: str = Form(...)
):
    """Parse PDF resume and extract structured data using AI"""
    try:
        # Validate file type
        if file.content_type != "application/pdf":
            raise HTTPException(status_code=400, detail="File must be a PDF")
        
        # Parse using AI service
        resume_data = await parse_resume_from_pdf(text)
        
        return resume_data
        
    except Exception as e:
        print(f"PDF parsing error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to parse PDF: {str(e)}")

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
