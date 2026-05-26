"""
Test script for Phase 2 AI Scoring with Groq
Run this to test the scoring endpoint with a mock resume
"""

import asyncio
import json
from app.models.resume import Resume, Experience, Skill, Education, Project, Link
from app.services.ai_service import score_resume_v2

async def test_scoring():
    # Create a mock resume
    mock_resume = Resume(
        user_id="test_user_123",
        full_name="John Doe",
        email="john.doe@example.com",
        phone="555-0100",
        location="San Francisco, CA",
        title="Senior Software Engineer",
        summary="Experienced software engineer with 5+ years building scalable web applications",
        education=[
            Education(
                institution="University of California",
                degree="Bachelor of Science",
                field="Computer Science",
                start_date="2015-09",
                end_date="2019-05",
                gpa="3.8"
            )
        ],
        experience=[
            Experience(
                company="Tech Corp",
                position="Senior Software Engineer",
                location="San Francisco, CA",
                start_date="2021-01",
                end_date=None,  # Current
                description="Lead developer for customer-facing applications",
                achievements=[
                    "Worked on React apps",
                    "Fixed bugs and improved performance",
                    "Collaborated with team members"
                ]
            ),
            Experience(
                company="StartupXYZ",
                position="Software Engineer",
                location="Remote",
                start_date="2019-06",
                end_date="2020-12",
                description="Full-stack developer",
                achievements=[
                    "Built features using Node.js and React",
                    "Participated in code reviews"
                ]
            )
        ],
        skills=[
            Skill(name="React", category="technical", level="expert"),
            Skill(name="Node.js", category="technical", level="expert"),
            Skill(name="TypeScript", category="technical", level="intermediate"),
            Skill(name="Python", category="technical", level="intermediate"),
            Skill(name="Leadership", category="soft", level="expert"),
        ],
        projects=[
            Project(
                title="E-commerce Platform",
                description="Built a full-stack e-commerce platform",
                technologies=["React", "Node.js", "PostgreSQL"],
                url="https://example.com",
                github_url="https://github.com/example/project"
            )
        ],
        links=[
            Link(platform="github", url="https://github.com/johndoe"),
            Link(platform="linkedin", url="https://linkedin.com/in/johndoe")
        ]
    )

    print("🚀 Testing AI Resume Scoring...")
    print("=" * 60)
    print(f"Resume: {mock_resume.full_name} - {mock_resume.title}")
    print("=" * 60)
    
    try:
        # Score the resume
        result = await score_resume_v2(mock_resume)
        
        print("\n✅ SCORING COMPLETE!\n")
        print("=" * 60)
        print(f"📊 OVERALL SCORE: {result.overall_score}/100")
        print("=" * 60)
        
        print("\n📈 CATEGORY SCORES:")
        for key, category in result.categories.items():
            print(f"  • {category.label}: {category.score}/100")
        
        print("\n💪 STRENGTHS:")
        for strength in result.strengths:
            print(f"  ✓ {strength}")
        
        print("\n🎯 QUICK WINS:")
        for win in result.quick_wins:
            print(f"  → {win}")
        
        print("\n🔥 ROAST:")
        print(f"  {result.roast}")
        
        print("\n📝 BULLET FEEDBACK:")
        for i, feedback in enumerate(result.bullet_feedback, 1):
            severity_emoji = {"high": "🔴", "medium": "🟡", "low": "🟢"}.get(feedback.severity, "⚪")
            print(f"\n  {severity_emoji} Bullet {i} ({feedback.severity.upper()}):")
            print(f"     Original: {feedback.original}")
            print(f"     Issue: {feedback.issue}")
            print(f"     Suggestion: {feedback.suggestion}")
        
        print("\n" + "=" * 60)
        print("✨ Test completed successfully!")
        print("=" * 60)
        
        # Save to JSON file for inspection
        with open("test_score_result.json", "w") as f:
            json.dump(result.model_dump(), f, indent=2)
        print("\n💾 Full result saved to: test_score_result.json")
        
    except Exception as e:
        print(f"\n❌ ERROR: {str(e)}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("\n" + "=" * 60)
    print("  CHAINRESUME - PHASE 2 SCORING TEST")
    print("=" * 60 + "\n")
    
    asyncio.run(test_scoring())
