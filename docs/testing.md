# Testing & Quality Assurance Guide

## Overview

This guide details automated and manual testing procedures for the AI Career & Placement Intelligence Platform across frontend, backend, PostgreSQL database, and AI service layers.

---

## 1. Backend REST API Testing

### Health Check Test
```bash
curl http://localhost:5000/health
```
**Expected Response:**
```json
{
  "status": "online",
  "service": "AI Career & Placement Intelligence Platform API"
}
```

### Authentication Test
```bash
# User Registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Alex Johnson","email":"alex.dev@btech.edu","password":"Password@123"}'

# User Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alex.dev@btech.edu","password":"Password@123"}'
```

### Profile & Placement Readiness Test
```bash
# Get Placement Readiness Composite Score
curl http://localhost:5000/api/profile/readiness \
  -H "Authorization: Bearer <TOKEN>"
```

### Quiz Submission Test
```bash
curl -X POST http://localhost:5000/api/quizzes/submit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"category":"aptitude","answers":{"apt_1":0,"apt_2":0,"apt_3":0},"time_taken_seconds":45}'
```

### AI Career Assistant Test
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <TOKEN>" \
  -d '{"message":"Explain Runtime Polymorphism and Dynamic Method Dispatch in Java"}'
```

---

## 2. Frontend Component & Flow Testing

| Test Case ID | Feature Flow | Expected Behavior |
| :--- | :--- | :--- |
| **TC-FE-01** | Student Profile Update | Submitting academic details updates the candidate database record and recalculates the header readiness badge. |
| **TC-FE-02** | Skills Add/Delete | Adding a new skill tag (e.g. `Docker`) immediately updates the list and adjusts the skill-gap match percentage. |
| **TC-FE-03** | Timed Quiz Assessment | Starting a quiz initiates the 3-minute timer; submitting grades answers and records the attempt in history. |
| **TC-FE-04** | Resume ATS Parser | Submitting resume text returns an ATS score (0-100%), matched keywords, missing keywords, and suggestions. |
| **TC-FE-05** | Roadmap Checkboxes | Toggling weekly milestone checkboxes immediately persists completion state in PostgreSQL. |
| **TC-FE-06** | AI Mock Interview | Submitting an answer grades the response against rubrics and provides an in-depth follow-up question. |

---

## 3. Database Schema Verification

Run the following query in PostgreSQL to verify all 8 relational tables and indexes exist:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

**Expected Tables:**
- `chat_messages`
- `interview_attempts`
- `profiles`
- `project_analyses`
- `quiz_attempts`
- `resume_analyses`
- `roadmap_milestones`
- `skills`
- `users`
