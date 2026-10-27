const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dns = require('dns');

// Prefer IPv4 to avoid IPv6 socket timeouts on Windows
try { dns.setDefaultResultOrder('ipv4first'); } catch (e) {}

// Ensure environment variables are loaded securely from backend/.env or root .env
const backendEnvPath = path.join(__dirname, '.env');
const rootEnvPath = path.join(__dirname, '..', '.env');
if (fs.existsSync(backendEnvPath)) {
  require('dotenv').config({ path: backendEnvPath });
}
if (fs.existsSync(rootEnvPath)) {
  require('dotenv').config({ path: rootEnvPath, override: false });
}
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const skillRoutes = require('./routes/skillRoutes');
const quizRoutes = require('./routes/quizRoutes');
const resumeRoutes = require('./routes/resumeRoutes');
const roadmapRoutes = require('./routes/roadmapRoutes');
const interviewRoutes = require('./routes/interviewRoutes');
const projectRoutes = require('./routes/projectRoutes');
const jobMatchingRoutes = require('./routes/jobMatchingRoutes');
const progressRoutes = require('./routes/progressRoutes');
const aiRoutes = require('./routes/aiRoutes');

const { errorHandler } = require('./middleware/errorHandler');
const db = require('./config/database');

const app = express();
const PORT = process.env.PORT || process.env.BACKEND_PORT || 5000;

// Security & Parsing Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health Check API
app.get('/health', (req, res) => {
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'AI Career & Placement Intelligence Platform API',
    database: db.isPgConnected() ? 'PostgreSQL (Active)' : 'Resilient In-Memory Storage (Ready)'
  });
});

// REST API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/jobs', jobMatchingRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/ai', aiRoutes);

// Serve Frontend Static Build if available
const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
app.use(express.static(frontendDist));

// Global Error Handler
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
  console.log('================================================================');
  console.log('🎓 AI Career & Placement Intelligence Platform - Backend API');
  console.log('================================================================');
  console.log(`📡 Backend Server URL: http://localhost:${PORT}`);
  console.log(`🩺 Health API Status:  http://localhost:${PORT}/health`);
  console.log(`🗄️ Database Mode:      ${db.isPgConnected() ? 'PostgreSQL Connected' : 'Resilient High-Speed Storage'}`);
  console.log('================================================================');
});

module.exports = app;
