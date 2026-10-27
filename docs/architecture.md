# Architecture Overview: AI Career & Placement Intelligence Platform

## System Architecture

The application is structured as a decoupled full-stack platform consisting of a high-performance React 18 frontend, a RESTful Node.js + Express backend, a PostgreSQL relational database with auto-initialization, and an AI intelligence service layer.

```
┌────────────────────────────────────────────────────────┐
│               React 18 Frontend (Vite)                 │
│  - Placement Readiness Dashboard                       │
│  - Live Candidate Profile & Skills CRUD                │
│  - Resume Intelligence & ATS Scoring                   │
│  - Skill Gap Benchmark Comparison                      │
│  - Personalized Dynamic Roadmap & Milestones           │
│  - Aptitude & CS Speed Assessments                     │
│  - AI Mock Interview Studio (Speech / Text)            │
│  - STAR Framework Project Optimizer & Viva Prep        │
│  - AI Placement Career Mentor Chat                     │
└───────────────────────────┬────────────────────────────┘
                            │ HTTP / JSON API (JWT Auth)
                            ▼
┌────────────────────────────────────────────────────────┐
│           Node.js + Express REST API Backend           │
│  - JWT Authentication & Bcrypt Password Hashing        │
│  - Candidate Profile & Skill Controllers               │
│  - Weighted Algorithmic Readiness Scoring Engine       │
│  - ATS Keyword Analysis Engine                         │
│  - AI Service Layer (Gemini API / Fallback Engine)     │
└───────────────────────────┬────────────────────────────┘
                            │ SQL Queries (pg Pool)
                            ▼
┌────────────────────────────────────────────────────────┐
│            PostgreSQL Relational Database              │
│  - users, profiles, skills, quiz_attempts              │
│  - roadmap_milestones, interview_attempts              │
│  - project_analyses, resume_analyses, chat_messages    │
└────────────────────────────────────────────────────────┘
```

## Module Responsibilities

1. **Frontend (`frontend/src`)**:
   - `components/`: Reusable navigation headers, mobile responsive sidebar, progress meters, and metric cards.
   - `pages/`: Dedicated view controllers for all 9 application modules.
   - `services/api.js`: Unified API layer with automatic JWT token attachment in `Authorization: Bearer` headers.
   - `services/ai.js`: Real-time streaming and conversational client.

2. **Backend (`backend/`)**:
   - `controllers/`: Request validation, business logic, algorithmic scoring, and database interactions.
   - `routes/`: Modular REST route declarations.
   - `models/`: Database entity abstractions with parameterized SQL queries.
   - `middleware/`: Token authentication verification and standardized error handling.
   - `services/aiService.js`: Integration with Google Gemini / OpenAI with built-in heuristic fallback.
   - `config/database.js`: PostgreSQL connection pool with automated schema execution and fallback resilience.
