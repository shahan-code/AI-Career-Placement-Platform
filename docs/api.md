# REST API Specifications

All endpoints return standardized JSON format with `success: true/false`.

## Authentication Endpoints

- `POST /api/auth/register`: Create candidate account.
  - Body: `{ name, email, password }`
  - Response: `{ success: true, token, user }`
- `POST /api/auth/login`: Authenticate candidate.
  - Body: `{ email, password }`
  - Response: `{ success: true, token, user }`
- `GET /api/auth/me`: Retrieve currently authenticated user context.

## Profile & Placement Readiness

- `GET /api/profile`: Retrieve candidate profile with skills.
- `PUT /api/profile`: Update candidate academic details and target role.
- `GET /api/profile/readiness`: Compute live composite placement readiness score (0-100%) and 5-pillar breakdown.

## Skills CRUD

- `GET /api/skills`: List all candidate skills.
- `POST /api/skills`: Add skill `{ name, category, proficiency_level, verified }`.
- `DELETE /api/skills/:id`: Remove skill by ID.

## Assessments & Quizzes

- `GET /api/quizzes/questions?category=aptitude`: Fetch assessment questions.
- `POST /api/quizzes/submit`: Submit answers and record score in PostgreSQL `{ category, answers, time_taken_seconds }`.
- `GET /api/quizzes/history`: Retrieve past test scores.

## Resume Intelligence & ATS Parser

- `POST /api/resume/analyze`: Run ATS keyword extraction and match against role benchmark `{ text, fileName, targetRole }`.
- `GET /api/resume/history`: Fetch resume analysis history.

## Personalized Roadmap

- `GET /api/roadmap`: Retrieve student's personalized roadmap milestones and progress.
- `GET /api/roadmap/presets`: Retrieve all career goal presets and recommended subjects.
- `POST /api/roadmap/generate`: Dynamically synthesize and save custom roadmap plan.
- `POST /api/roadmap/toggle`: Toggle milestone completion `{ milestone_key, completed }`.
- `POST /api/roadmap/reset`: Reset roadmap to default recommendations.

## Mock Interview Studio

- `GET /api/interviews/questions?role=fullstack`: Fetch role-specific questions.
- `POST /api/interviews/evaluate`: Submit answer for AI rubric evaluation `{ role, question, userAnswer }`.
- `GET /api/interviews/history`: Fetch mock interview history.

## Project Analyzer (STAR)

- `POST /api/projects/analyze`: Optimize project with STAR framework bullets and Viva questions `{ title, description, techStack }`.
- `GET /api/projects/history`: Fetch project analysis history.

## AI Career Assistant

- `POST /api/ai/chat`: Interactive career mentor endpoint `{ message, conversationHistory }`.
