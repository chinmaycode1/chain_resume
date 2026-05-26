-- Create resumes table
CREATE TABLE IF NOT EXISTS resumes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    location TEXT,
    title TEXT,
    summary TEXT,
    education JSONB DEFAULT '[]'::jsonb,
    experience JSONB DEFAULT '[]'::jsonb,
    skills JSONB DEFAULT '[]'::jsonb,
    projects JSONB DEFAULT '[]'::jsonb,
    links JSONB DEFAULT '[]'::jsonb,
    username TEXT UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);

-- Create index on username for public profile lookups
CREATE INDEX IF NOT EXISTS idx_resumes_username ON resumes(username);

-- Enable Row Level Security
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can read their own resumes
CREATE POLICY "Users can read own resume"
    ON resumes FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy: Users can insert their own resumes
CREATE POLICY "Users can insert own resume"
    ON resumes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own resumes
CREATE POLICY "Users can update own resume"
    ON resumes FOR UPDATE
    USING (auth.uid() = user_id);

-- Create policy: Anyone can read public resumes (with username)
CREATE POLICY "Anyone can read public resumes"
    ON resumes FOR SELECT
    USING (username IS NOT NULL);
