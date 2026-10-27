# 🎓 AI Career & Placement Intelligence Platform

> **Full-Stack Engineering & Campus Placement Preparation Platform**
> Built with **React 18 + Vite**, **Node.js + Express**, **PostgreSQL**, and **AI Intelligence API**.

---

## 🌟 Key Features

1. **Placement Readiness Composite Index:** Live 0–100% weighted score calculated from real user skills, quiz scores, roadmap milestone progress, and mock interview attempts.
2. **Student Profile & Skills Management:** Full CRUD operations for candidate academic details, target role benchmarks, and verified technical competencies stored in PostgreSQL.
3. **Resume Intelligence & ATS Parser:** Upload or paste resume text to extract skills, compute ATS match scores, identify missing recruiter keywords, and receive actionable optimization suggestions.
4. **Skill Gap & Role Match Analyzer:** Compares student competencies against industry benchmark roles (Junior Full Stack, Backend Java/Spring Boot, Frontend React) to generate targeted study goals.
5. **Personalized Dynamic Roadmap:** Fully customizable career roadmap builder with 11+ career tracks, custom duration (days/weeks/months), daily study hours, topic customization, revision days, mock tests, and persistent milestone tracking.
6. **Aptitude & CS Quiz Arena:** Timed assessments (Quantitative Aptitude, DSA, DBMS, Operating Systems) with live scoring, detailed answer explanations, and persistent history.
7. **AI Mock Interview Studio:** Speech and text practice with role-specific questions and instant AI rubric evaluation (technical score, communication rating, missing edge cases, follow-up questions).
8. **STAR Project Analyzer & Viva Defense:** Transforms capstone projects into quantified resume bullet points and generates examiner Viva defense questions with model responses.
9. **AI Career Assistant:** Conversational chatbot powered by Google Gemini / OpenAI with built-in heuristic intelligence for offline campus prep.

---

## 📁 Repository Structure

```
ai-career-placement-platform/
│
├── frontend/                     # React 18 + Vite Application
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, DashboardCard, ProgressBar
│   │   ├── pages/                # Dashboard, Profile, Resume, SkillGap, Roadmap, Quiz, Interview, ProjectAnalyzer, AIAssistant
│   │   ├── services/             # api.js, ai.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── backend/                      # Node.js + Express REST API
│   ├── controllers/              # Auth, Profile, Skill, Quiz, Resume, Roadmap, Interview, Project, AI
│   ├── routes/                   # authRoutes, profileRoutes, skillRoutes, quizRoutes, etc.
│   ├── models/                   # User, Profile, Skill, QuizAttempt, RoadmapProgress, etc.
│   ├── middleware/               # authMiddleware (JWT), errorHandler
│   ├── services/                 # aiService (Gemini / OpenAI / Heuristics)
│   ├── config/                   # database.js (PostgreSQL Pool + Resilient Store)
│   ├── server.js                 # Main Express server entry point
│   └── package.json
│
├── database/
│   └── schema.sql                # PostgreSQL tables, relations, and indexes
│
├── docs/
│   ├── architecture.md           # System design & module breakdown
│   ├── database.md               # PostgreSQL schema & ER diagram
│   ├── api.md                    # REST API endpoint documentation
│   └── project-notes.md          # Technical engineering notes
│
├── .env.example                  # Environment configuration template
├── .gitignore
├── README.md
└── package.json                  # Root runner script
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (Optional: connects automatically if running, fallback storage provided)

### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env` in the project root:

```bash
cp .env.example .env
```

Set your preferred configuration in `.env`:
```env
PORT=5000
JWT_SECRET=your_secret_jwt_key
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_placement_db
GEMINI_API_KEY=your_gemini_api_key_optional
```

### 4. Database Setup
If using PostgreSQL locally:
```bash
# Create database
createdb ai_placement_db

# Run schema
psql -d ai_placement_db -f database/schema.sql
```
*(Note: The backend automatically runs `schema.sql` on startup when connected to PostgreSQL!)*

### 5. Running the Application

**Terminal 1 (Start Backend Server):**
```bash
cd backend
npm start
```
*Backend runs on `http://localhost:5000` (Health Check: `http://localhost:5000/health`)*

**Terminal 2 (Start Frontend Dev Server):**
```bash
cd frontend
npm run dev
```
*Frontend runs on `http://localhost:5173`*

---

## 🌐 Production Deployment Guide

### Option 1: Monolithic Deployment (Render / Railway / Heroku)
1. Build the frontend:
   ```bash
   cd frontend && npm run build
   ```
2. Start the backend:
   ```bash
   cd backend && npm start
   ```
The backend automatically serves the production frontend build from `frontend/dist`.

### Option 2: Decoupled Cloud Deployment (Vercel + Render)
- **Frontend:** Deploy `frontend/` to **Vercel** with build command `npm run build` and output directory `dist`.
- **Backend:** Deploy `backend/` to **Render / Railway** with start command `node server.js`.
- **Database:** Connect a managed **PostgreSQL** instance (Supabase, Neon, or Render PostgreSQL) by providing the `DATABASE_URL` in environment variables.

---

## 📜 License
MIT License. Created for B.Tech CSE Placement & Viva Defense Preparation.
