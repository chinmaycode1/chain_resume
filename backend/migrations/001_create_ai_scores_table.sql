-- Create ai_scores table for storing AI resume scoring results
CREATE TABLE IF NOT EXISTS ai_scores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    resume_id TEXT NOT NULL,
    user_id TEXT NOT NULL,
    overall_score INTEGER NOT NULL CHECK (overall_score >= 0 AND overall_score <= 100),
    categories_json JSONB NOT NULL,
    bullet_feedback_json JSONB NOT NULL,
    roast_text TEXT NOT NULL,
    strengths TEXT[] NOT NULL,
    quick_wins TEXT[] NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_ai_scores_resume_id ON ai_scores(resume_id);
CREATE INDEX IF NOT EXISTS idx_ai_scores_user_id ON ai_scores(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_scores_created_at ON ai_scores(created_at DESC);

-- Create a function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to auto-update updated_at
CREATE TRIGGER update_ai_scores_updated_at BEFORE UPDATE ON ai_scores
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Add RLS (Row Level Security) policies
ALTER TABLE ai_scores ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own scores
CREATE POLICY "Users can view their own scores"
ON ai_scores FOR SELECT
USING (auth.uid()::text = user_id);

-- Policy: Users can insert their own scores
CREATE POLICY "Users can insert their own scores"
ON ai_scores FOR INSERT
WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own scores
CREATE POLICY "Users can update their own scores"
ON ai_scores FOR UPDATE
USING (auth.uid()::text = user_id);
