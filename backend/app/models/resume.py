from pydantic import BaseModel, EmailStr, HttpUrl
from typing import List, Optional
from datetime import datetime

class Link(BaseModel):
    platform: str  # github, linkedin, twitter, portfolio, etc.
    url: HttpUrl

class Skill(BaseModel):
    name: str
    category: str  # technical, soft, language, etc.
    level: Optional[str] = None  # beginner, intermediate, expert

class Project(BaseModel):
    title: str
    description: str
    technologies: List[str]
    url: Optional[HttpUrl] = None
    github_url: Optional[HttpUrl] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None

class Experience(BaseModel):
    company: str
    position: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None  # None means current
    description: str
    achievements: List[str]

class Education(BaseModel):
    institution: str
    degree: str
    field: str
    location: Optional[str] = None
    start_date: str
    end_date: Optional[str] = None
    gpa: Optional[str] = None
    achievements: Optional[List[str]] = []

class Resume(BaseModel):
    user_id: str
    full_name: str
    email: EmailStr
    phone: Optional[str] = None
    location: Optional[str] = None
    title: str  # Professional title/headline
    summary: str
    education: List[Education]
    experience: List[Experience]
    skills: List[Skill]
    projects: List[Project]
    links: List[Link]
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
