import os
from groq import Groq
from app.models.resume import Resume
from app.models.ai_score import AIScoreResponse, CategoryScore, BulletFeedback, AIScore, AIFeedback
import json

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

async def parse_resume_from_pdf(pdf_text: str) -> dict:
    """
    Parse PDF text and extract structured resume data using Groq AI
    """
    prompt = f"""Extract resume information from this text and return ONLY valid JSON with this exact structure:

{{
  "full_name": "<full name>",
  "email": "<email address>",
  "phone": "<phone number>",
  "location": "<city, state/country>",
  "title": "<professional title/headline>",
  "summary": "<professional summary>",
  "skills": [
    {{"name": "<skill name>", "category": "technical", "level": "expert"}}
  ],
  "experience": [
    {{
      "company": "<company name>",
      "position": "<job title>",
      "location": "<location>",
      "start_date": "<start date>",
      "end_date": "<end date or 'Present'>",
      "description": "<brief description>",
      "achievements": ["<achievement 1>", "<achievement 2>"]
    }}
  ],
  "education": [
    {{
      "institution": "<school name>",
      "degree": "<degree type>",
      "field": "<field of study>",
      "location": "<location>",
      "start_date": "<start year>",
      "end_date": "<end year>",
      "gpa": "<gpa if available>",
      "achievements": ["<achievement 1>"]
    }}
  ],
  "projects": [
    {{
      "title": "<project name>",
      "description": "<description>",
      "technologies": ["<tech 1>", "<tech 2>"],
      "url": "<project url if available>",
      "github_url": "<github url if available>"
    }}
  ],
  "links": [
    {{"platform": "github", "url": "<github url>"}},
    {{"platform": "linkedin", "url": "<linkedin url>"}},
    {{"platform": "portfolio", "url": "<portfolio url>"}}
  ]
}}

Rules:
- Extract ALL information available in the text
- For skills, categorize as: technical, soft, language, or other
- For dates, use format like "Jan 2020" or "2020"
- If information is missing, use empty string "" or empty array []
- Return ONLY the JSON object, no markdown, no explanation

Resume Text:
{pdf_text}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=4096,
            temperature=0.2
        )
        
        response_text = response.choices[0].message.content
        
        # Extract JSON from response
        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()
        elif "```" in response_text:
            json_start = response_text.find("```") + 3
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()
        
        # Parse and return
        resume_data = json.loads(response_text)
        return resume_data
        
    except Exception as e:
        print(f"PDF parsing error: {str(e)}")
        raise Exception(f"Failed to parse resume: {str(e)}")

async def score_resume_v2(resume: Resume) -> AIScoreResponse:
    """
    Score resume using Groq API with Phase 2 structure
    Returns structured JSON with categories, bullet feedback, roast, strengths, and quick wins
    """
    
    # Build resume JSON for Groq
    resume_json = json.dumps(resume.model_dump(), indent=2)
    
    prompt = f"""You are a professional resume reviewer and career coach. Analyze this resume and return ONLY a valid JSON object. No explanation, no markdown, no backticks. Pure JSON only.

Resume data: {resume_json}

Return this exact JSON structure:
{{
  "overall_score": <0-100>,
  "categories": {{
    "ats_compatibility": {{"score": <0-100>, "label": "ATS Compatibility"}},
    "impact_language": {{"score": <0-100>, "label": "Impact Language"}},
    "skill_relevance": {{"score": <0-100>, "label": "Skill Relevance"}},
    "completeness": {{"score": <0-100>, "label": "Completeness"}}
  }},
  "bullet_feedback": [
    {{
      "original": "<original bullet text>",
      "issue": "<what is wrong>",
      "suggestion": "<improved version>",
      "severity": "<high|medium|low>"
    }}
  ],
  "roast": "<funny brutal honest 2-3 sentence roast>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "quick_wins": ["<action 1>", "<action 2>", "<action 3>"]
}}

Scoring criteria:
- ATS Compatibility: keyword optimization, formatting, section structure, ATS-friendly layout
- Impact Language: action verbs, quantifiable results, achievement focus, power words
- Skill Relevance: modern tech stack, in-demand skills, skill-job alignment, technical depth
- Completeness: all sections filled, sufficient detail, professional presentation

Analyze every bullet point in experience and achievements. Be specific and actionable."""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=4096,
            temperature=0.3
        )
        
        # Parse Groq's response
        response_text = response.choices[0].message.content
        
        # Extract JSON from response (might be wrapped in markdown)
        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()
        elif "```" in response_text:
            json_start = response_text.find("```") + 3
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()
        
        # Parse and validate
        score_data = json.loads(response_text)
        
        return AIScoreResponse(**score_data)
        
    except Exception as e:
        # Return default scores if API fails
        print(f"AI scoring error: {str(e)}")
        return AIScoreResponse(
            overall_score=50,
            categories={
                "ats_compatibility": CategoryScore(score=50, label="ATS Compatibility"),
                "impact_language": CategoryScore(score=50, label="Impact Language"),
                "skill_relevance": CategoryScore(score=50, label="Skill Relevance"),
                "completeness": CategoryScore(score=50, label="Completeness")
            },
            bullet_feedback=[],
            roast="Unable to roast your resume right now — the AI is taking a coffee break ☕",
            strengths=["Unable to analyze at this time"],
            quick_wins=["Try again in a moment"]
        )

async def polish_bullet(bullet: str, context: str = "") -> str:
    """
    Polish a single bullet point using Groq API
    """
    prompt = f"""You are a professional resume writer. Rewrite this bullet point to be more impactful.

Original bullet: {bullet}
Context: {context}

Rules:
- Start with a strong action verb
- Include quantifiable metrics if possible
- Focus on impact and results
- Keep it concise (1-2 lines max)
- Make it ATS-friendly

Return ONLY the improved bullet point, nothing else."""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=256,
            temperature=0.3
        )
        
        return response.choices[0].message.content.strip()
        
    except Exception as e:
        print(f"Bullet polish error: {str(e)}")
        return bullet

# Legacy function for backward compatibility
async def score_resume(resume: Resume, mode: str = "polish") -> AIFeedback:
    """
    Score resume using Groq API (legacy version)
    mode: "polish" for constructive feedback, "roast" for brutal honesty
    """
    
    # Build prompt based on mode
    if mode == "roast":
        tone = "brutally honest with dark humor. Be savage but helpful."
    else:
        tone = "constructive and professional. Focus on actionable improvements."
    
    prompt = f"""You are an expert resume reviewer. Analyze this resume and be {tone}

Resume Data:
{json.dumps(resume.model_dump(), indent=2)}

Provide a JSON response with this exact structure:
{{
  "scores": {{
    "ats_score": <0-100>,
    "impact_score": <0-100>,
    "skill_relevance_score": <0-100>,
    "overall_score": <0-100>
  }},
  "bullet_feedback": [
    {{
      "original": "<original bullet point>",
      "issue": "<what is wrong>",
      "suggestion": "<how to improve>",
      "severity": "<high|medium|low>"
    }}
  ],
  "general_feedback": ["<feedback 1>", "<feedback 2>"],
  "top_strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "top_weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"]
}}

Scoring criteria:
- ATS Score: keyword optimization, formatting, section structure
- Impact Score: action verbs, quantifiable results, achievement focus
- Skill Relevance: modern tech stack, in-demand skills, skill-job alignment
- Overall: weighted average considering all factors

Analyze every bullet point in experience and achievements. Be specific."""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-70b-versatile",
            messages=[
                {"role": "user", "content": prompt}
            ],
            max_tokens=4096,
            temperature=0.3
        )
        
        # Parse Groq's response
        response_text = response.choices[0].message.content
        
        # Extract JSON from response
        if "```json" in response_text:
            json_start = response_text.find("```json") + 7
            json_end = response_text.find("```", json_start)
            response_text = response_text[json_start:json_end].strip()
        
        feedback_data = json.loads(response_text)
        feedback_data["mode"] = mode
        
        return AIFeedback(**feedback_data)
        
    except Exception as e:
        # Return default scores if API fails
        return AIFeedback(
            scores=AIScore(
                ats_score=50,
                impact_score=50,
                skill_relevance_score=50,
                overall_score=50
            ),
            bullet_feedback=[],
            general_feedback=[f"Error analyzing resume: {str(e)}"],
            top_strengths=["Unable to analyze"],
            top_weaknesses=["Unable to analyze"],
            mode=mode
        )
