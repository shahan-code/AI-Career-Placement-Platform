const fs = require('fs');
const path = require('path');
try {
  const bEnv = path.join(__dirname, '..', '.env');
  const rEnv = path.join(__dirname, '..', '..', '.env');
  if (fs.existsSync(bEnv)) require('dotenv').config({ path: bEnv });
  if (fs.existsSync(rEnv)) require('dotenv').config({ path: rEnv, override: false });
  require('dotenv').config();
} catch (e) {}

let Pool = null;
try {
  Pool = require('pg').Pool;
} catch (e) {
  try {
    Pool = require(path.join(__dirname, '..', 'node_modules', 'pg')).Pool;
  } catch (err) {
    Pool = null;
  }
}

// In-Memory Storage Adapter (Fallback if PostgreSQL service is offline)
const inMemoryStore = {
  users: [],
  profiles: [],
  skills: [],
  quiz_attempts: [],
  roadmap_milestones: [],
  user_roadmaps: [],
  interview_attempts: [],
  project_analyses: [],
  resume_analyses: [],
  chat_messages: []
};

let pool = null;
let isPgConnected = false;

// Attempt PostgreSQL Connection
if (Pool) {
  try {
    const connectionString = process.env.DATABASE_URL;
    const poolConfig = connectionString 
      ? { connectionString, ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false }
      : {
          user: process.env.PGUSER || process.env.DB_USER || 'postgres',
          host: process.env.PGHOST || process.env.DB_HOST || 'localhost',
          database: process.env.PGDATABASE || process.env.DB_NAME || 'ai_placement_db',
          password: process.env.PGPASSWORD || process.env.DB_PASSWORD || 'postgres',
          port: parseInt(process.env.PGPORT || process.env.DB_PORT || '5432', 10),
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 3000
        };

    pool = new Pool(poolConfig);

    pool.on('error', (err) => {
      console.warn('⚠️ PostgreSQL pool warning:', err.message);
    });
  } catch (err) {
    pool = null;
  }
}

async function initDatabase() {
  try {
    const client = await pool.connect();
    isPgConnected = true;
    console.log('✅ Connected to PostgreSQL Database successfully.');

    // Execute schema.sql if exists
    const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const schemaSql = fs.readFileSync(schemaPath, 'utf8');
      await client.query(schemaSql);
      console.log('✅ PostgreSQL schema synchronized.');
    }
    client.release();
  } catch (err) {
    isPgConnected = false;
    console.warn(`⚠️ PostgreSQL connection not available (${err.message}).`);
    console.log('🔄 Operating with High-Performance Resilient In-Memory Storage Engine.');
  }
}

// Universal Query Executor
async function query(text, params = []) {
  if (isPgConnected && pool) {
    try {
      return await pool.query(text, params);
    } catch (err) {
      console.warn('PostgreSQL query error, falling back to memory adapter:', err.message);
    }
  }

  // Fallback In-Memory Query Engine for seamless dev execution
  return executeInMemoryQuery(text, params);
}

function executeInMemoryQuery(text, params = []) {
  const normalized = text.trim().toLowerCase();
  
  // USERS
  if (normalized.startsWith('select') && normalized.includes('from users')) {
    if (normalized.includes('where email =')) {
      const email = params[0];
      const found = inMemoryStore.users.filter(u => u.email === email);
      return { rows: found, rowCount: found.length };
    }
    if (normalized.includes('where id =')) {
      const id = params[0];
      const found = inMemoryStore.users.filter(u => u.id === id);
      return { rows: found, rowCount: found.length };
    }
    return { rows: inMemoryStore.users, rowCount: inMemoryStore.users.length };
  }

  if (normalized.startsWith('insert into users')) {
    const user = {
      id: params[0],
      name: params[1],
      email: params[2],
      password_hash: params[3],
      avatar_url: params[4] || null,
      role: params[5] || 'student',
      created_at: new Date(),
      updated_at: new Date()
    };
    inMemoryStore.users.push(user);
    return { rows: [user], rowCount: 1 };
  }

  // PROFILES
  if (normalized.startsWith('select') && normalized.includes('from profiles')) {
    const userId = params[0];
    const found = inMemoryStore.profiles.filter(p => p.user_id === userId);
    return { rows: found, rowCount: found.length };
  }

  if (normalized.startsWith('insert into profiles') || normalized.startsWith('update profiles')) {
    const userId = params[1] || params[0];
    const existingIndex = inMemoryStore.profiles.findIndex(p => p.user_id === userId);
    const profile = {
      id: params[0] || 'prof_' + Date.now(),
      user_id: userId,
      college: params[2] || '',
      degree: params[3] || 'B.Tech Computer Science & Engineering',
      semester: params[4] || '7th Semester',
      gpa: params[5] || 8.0,
      target_role: params[6] || 'fullstack',
      daily_study_hours: params[7] || 4.0,
      bio: params[8] || '',
      github_url: params[9] || '',
      linkedin_url: params[10] || '',
      portfolio_url: params[11] || '',
      updated_at: new Date()
    };
    if (existingIndex >= 0) {
      inMemoryStore.profiles[existingIndex] = { ...inMemoryStore.profiles[existingIndex], ...profile };
    } else {
      inMemoryStore.profiles.push(profile);
    }
    return { rows: [profile], rowCount: 1 };
  }

  // SKILLS
  if (normalized.startsWith('select') && normalized.includes('from skills')) {
    const userId = params[0];
    const found = inMemoryStore.skills.filter(s => s.user_id === userId);
    return { rows: found, rowCount: found.length };
  }

  if (normalized.startsWith('insert into skills')) {
    const skill = {
      id: params[0],
      user_id: params[1],
      name: params[2],
      category: params[3] || 'Technical',
      proficiency_level: params[4] || 'Intermediate',
      verified: params[5] === true,
      created_at: new Date()
    };
    inMemoryStore.skills.push(skill);
    return { rows: [skill], rowCount: 1 };
  }

  if (normalized.startsWith('delete from skills')) {
    const skillId = params[0];
    const userId = params[1];
    inMemoryStore.skills = inMemoryStore.skills.filter(s => !(s.id === skillId && s.user_id === userId));
    return { rows: [], rowCount: 1 };
  }

  // QUIZ ATTEMPTS
  if (normalized.startsWith('select') && normalized.includes('from quiz_attempts')) {
    const userId = params[0];
    const found = inMemoryStore.quiz_attempts.filter(q => q.user_id === userId);
    found.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: found, rowCount: found.length };
  }

  if (normalized.startsWith('insert into quiz_attempts')) {
    const attempt = {
      id: params[0],
      user_id: params[1],
      category: params[2],
      score: params[3],
      total_questions: params[4],
      percentage: params[5],
      time_taken_seconds: params[6] || 0,
      passed: params[7] !== false,
      created_at: new Date()
    };
    inMemoryStore.quiz_attempts.unshift(attempt);
    return { rows: [attempt], rowCount: 1 };
  }

  // ROADMAP MILESTONES
  if (normalized.startsWith('select') && normalized.includes('from roadmap_milestones')) {
    const userId = params[0];
    const found = inMemoryStore.roadmap_milestones.filter(m => m.user_id === userId);
    return { rows: found, rowCount: found.length };
  }

  if (normalized.includes('roadmap_milestones')) {
    const userId = params[1];
    const milestoneKey = params[2];
    const completed = params[6] === true;
    const existingIndex = inMemoryStore.roadmap_milestones.findIndex(
      m => m.user_id === userId && m.milestone_key === milestoneKey
    );
    const item = {
      id: params[0] || 'ms_' + Date.now(),
      user_id: userId,
      milestone_key: milestoneKey,
      month_index: params[3] || 1,
      week_index: params[4] || 1,
      title: params[5] || '',
      completed: completed,
      completed_at: completed ? new Date() : null,
      notes: params[7] || ''
    };
    if (existingIndex >= 0) {
      inMemoryStore.roadmap_milestones[existingIndex] = item;
    } else {
      inMemoryStore.roadmap_milestones.push(item);
    }
    return { rows: [item], rowCount: 1 };
  }

  // USER ROADMAPS (Personalized Roadmap Plans)
  if (normalized.startsWith('select') && normalized.includes('from user_roadmaps')) {
    const userId = params[0];
    const found = inMemoryStore.user_roadmaps.filter(r => r.user_id === userId);
    return { rows: found, rowCount: found.length };
  }

  if (normalized.includes('user_roadmaps')) {
    const userId = params[1] || params[0];
    const existingIndex = inMemoryStore.user_roadmaps.findIndex(r => r.user_id === userId);
    const item = {
      id: params[0] || 'roadmap_' + Date.now(),
      user_id: userId,
      career_goal: params[2] || 'Full Stack Development',
      duration_value: typeof params[3] === 'number' ? params[3] : (parseInt(params[3], 10) || 6),
      duration_unit: params[4] || 'months',
      daily_study_hours: typeof params[5] === 'number' ? params[5] : (parseFloat(params[5]) || 4.0),
      current_level: params[6] || 'Beginner',
      target_level: params[7] || 'Job/Placement Ready',
      selected_subjects: typeof params[8] === 'string' ? JSON.parse(params[8]) : (params[8] || []),
      custom_subjects: typeof params[9] === 'string' ? JSON.parse(params[9]) : (params[9] || []),
      generated_plan: typeof params[10] === 'string' ? JSON.parse(params[10]) : (params[10] || []),
      created_at: existingIndex >= 0 ? inMemoryStore.user_roadmaps[existingIndex].created_at : new Date(),
      updated_at: new Date()
    };
    if (existingIndex >= 0) {
      inMemoryStore.user_roadmaps[existingIndex] = { ...inMemoryStore.user_roadmaps[existingIndex], ...item };
    } else {
      inMemoryStore.user_roadmaps.push(item);
    }
    return { rows: [item], rowCount: 1 };
  }

  // INTERVIEWS
  if (normalized.startsWith('select') && normalized.includes('from interview_attempts')) {
    const userId = params[0];
    const found = inMemoryStore.interview_attempts.filter(i => i.user_id === userId);
    found.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return { rows: found, rowCount: found.length };
  }

  if (normalized.startsWith('insert into interview_attempts')) {
    const interview = {
      id: params[0],
      user_id: params[1],
      role: params[2],
      question: params[3],
      user_answer: params[4],
      ai_score: params[5] || 75,
      feedback: params[6] || '',
      communication_rating: params[7] || 'Good',
      missing_concepts: params[8] || '',
      follow_up_question: params[9] || '',
      created_at: new Date()
    };
    inMemoryStore.interview_attempts.unshift(interview);
    return { rows: [interview], rowCount: 1 };
  }

  // PROJECTS
  if (normalized.startsWith('select') && normalized.includes('from project_analyses')) {
    const userId = params[0];
    const found = inMemoryStore.project_analyses.filter(p => p.user_id === userId);
    return { rows: found, rowCount: found.length };
  }

  if (normalized.startsWith('insert into project_analyses')) {
    const project = {
      id: params[0],
      user_id: params[1],
      title: params[2],
      description: params[3],
      tech_stack: params[4] || '',
      complexity_score: params[5] || 80,
      star_bullets: params[6] || [],
      viva_questions: params[7] || [],
      created_at: new Date()
    };
    inMemoryStore.project_analyses.unshift(project);
    return { rows: [project], rowCount: 1 };
  }

  // RESUME ANALYSES
  if (normalized.startsWith('select') && normalized.includes('from resume_analyses')) {
    const userId = params[0];
    const found = inMemoryStore.resume_analyses.filter(r => r.user_id === userId);
    return { rows: found, rowCount: found.length };
  }

  if (normalized.startsWith('insert into resume_analyses')) {
    const resume = {
      id: params[0],
      user_id: params[1],
      file_name: params[2],
      target_role: params[3],
      extracted_text: params[4],
      ats_score: params[5],
      parsed_skills: params[6] || [],
      missing_keywords: params[7] || [],
      suggestions: params[8] || [],
      created_at: new Date()
    };
    inMemoryStore.resume_analyses.unshift(resume);
    return { rows: [resume], rowCount: 1 };
  }

  // CHAT MESSAGES
  if (normalized.startsWith('select') && normalized.includes('from chat_messages')) {
    const userId = params[0];
    const found = inMemoryStore.chat_messages.filter(c => c.user_id === userId);
    return { rows: found, rowCount: found.length };
  }

  if (normalized.startsWith('insert into chat_messages')) {
    const chat = {
      id: params[0],
      user_id: params[1],
      sender: params[2],
      message: params[3],
      created_at: new Date()
    };
    inMemoryStore.chat_messages.push(chat);
    return { rows: [chat], rowCount: 1 };
  }

  return { rows: [], rowCount: 0 };
}

// Auto-initialize on module load
initDatabase();

module.exports = {
  query,
  pool,
  isPgConnected: () => isPgConnected
};
