-- =======================================================================
-- AI Career & Placement Intelligence Platform
-- PostgreSQL Database Schema
-- =======================================================================

-- Enable UUID extension if supported
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Authentication & Account Management)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    role VARCHAR(50) DEFAULT 'student',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CANDIDATE PROFILES TABLE (Academic Details & Placement Preferences)
CREATE TABLE IF NOT EXISTS profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    college VARCHAR(255) DEFAULT '',
    degree VARCHAR(255) DEFAULT 'B.Tech Computer Science & Engineering',
    semester VARCHAR(50) DEFAULT '7th Semester',
    gpa NUMERIC(4, 2) DEFAULT 8.00,
    target_role VARCHAR(100) DEFAULT 'fullstack',
    daily_study_hours NUMERIC(3, 1) DEFAULT 4.0,
    bio TEXT DEFAULT '',
    github_url TEXT DEFAULT '',
    linkedin_url TEXT DEFAULT '',
    portfolio_url TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. SKILLS TABLE (Student Technical & Core CS Skills)
CREATE TABLE IF NOT EXISTS skills (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Technical',
    proficiency_level VARCHAR(50) DEFAULT 'Intermediate', -- Beginner, Intermediate, Advanced, Expert
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. QUIZ ATTEMPTS TABLE (Aptitude, DSA, DBMS & CS Assessments)
CREATE TABLE IF NOT EXISTS quiz_attempts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    time_taken_seconds INTEGER DEFAULT 0,
    passed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. ROADMAP MILESTONES TABLE (Personalized Roadmap Milestone Progress Tracking)
CREATE TABLE IF NOT EXISTS roadmap_milestones (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    milestone_key VARCHAR(100) NOT NULL,
    month_index INTEGER NOT NULL,
    week_index INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP WITH TIME ZONE,
    notes TEXT DEFAULT '',
    UNIQUE(user_id, milestone_key)
);

-- 6. INTERVIEW ATTEMPTS TABLE (AI Mock Interview Responses & Evaluations)
CREATE TABLE IF NOT EXISTS interview_attempts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(100) NOT NULL,
    question TEXT NOT NULL,
    user_answer TEXT NOT NULL,
    ai_score INTEGER DEFAULT 75,
    feedback TEXT DEFAULT '',
    communication_rating VARCHAR(50) DEFAULT 'Good',
    missing_concepts TEXT DEFAULT '',
    follow_up_question TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. PROJECT ANALYSES TABLE (STAR Framework & Viva Defense Optimizations)
CREATE TABLE IF NOT EXISTS project_analyses (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    tech_stack TEXT DEFAULT '',
    complexity_score INTEGER DEFAULT 80,
    star_bullets JSONB DEFAULT '[]'::jsonb,
    viva_questions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. RESUME ANALYSES TABLE (ATS Score & Keyword Parser Results)
CREATE TABLE IF NOT EXISTS resume_analyses (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    file_name VARCHAR(255),
    target_role VARCHAR(100),
    extracted_text TEXT,
    ats_score INTEGER NOT NULL,
    parsed_skills JSONB DEFAULT '[]'::jsonb,
    missing_keywords JSONB DEFAULT '[]'::jsonb,
    suggestions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. CHAT MESSAGES TABLE (AI Assistant Conversation History)
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    sender VARCHAR(20) NOT NULL, -- 'user' or 'ai'
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. USER ROADMAPS TABLE (Personalized Roadmap Configuration & Generated Plan)
CREATE TABLE IF NOT EXISTS user_roadmaps (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    career_goal VARCHAR(100) NOT NULL,
    duration_value INTEGER NOT NULL DEFAULT 6,
    duration_unit VARCHAR(20) NOT NULL DEFAULT 'months', -- 'days', 'weeks', 'months'
    daily_study_hours NUMERIC(3, 1) DEFAULT 4.0,
    current_level VARCHAR(50) DEFAULT 'Beginner', -- 'Beginner', 'Intermediate', 'Advanced'
    target_level VARCHAR(50) DEFAULT 'Job/Placement Ready', -- 'Job/Placement Ready', 'Interview Ready', 'Project Ready', 'Custom Goal'
    selected_subjects JSONB DEFAULT '[]'::jsonb,
    custom_subjects JSONB DEFAULT '[]'::jsonb,
    generated_plan JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-frequency queries
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_skills_user_id ON skills(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_id ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_roadmap_milestones_user_id ON roadmap_milestones(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roadmaps_user_id ON user_roadmaps(user_id);
CREATE INDEX IF NOT EXISTS idx_interview_attempts_user_id ON interview_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_project_analyses_user_id ON project_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_resume_analyses_user_id ON resume_analyses(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);

