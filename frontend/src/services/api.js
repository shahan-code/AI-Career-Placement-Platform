const BASE_URL = '/api';
const TOKEN_KEY = 'ai_placement_auth_token';

export const tokenStorage = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token) => localStorage.setItem(TOKEN_KEY, token),
  remove: () => localStorage.removeItem(TOKEN_KEY)
};

async function request(endpoint, options = {}) {
  const token = tokenStorage.get();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers
  };

  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error [${endpoint}]:`, err);
    throw err;
  }
}

export const api = {
  // Auth
  register: (payload) => request('/auth/register', { method: 'POST', body: JSON.stringify(payload) }),
  login: (payload) => request('/auth/login', { method: 'POST', body: JSON.stringify(payload) }),
  getMe: () => request('/auth/me'),

  // Profile & Placement Readiness
  getProfile: () => request('/profile'),
  updateProfile: (profileData) => request('/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
  getReadiness: () => request('/profile/readiness'),

  // Skills
  getSkills: () => request('/skills'),
  addSkill: (skill) => request('/skills', { method: 'POST', body: JSON.stringify(skill) }),
  deleteSkill: (id) => request(`/skills/${id}`, { method: 'DELETE' }),

  // Quizzes
  getQuizQuestions: (category) => request(`/quizzes/questions?category=${category || 'aptitude'}`),
  submitQuizAttempt: (payload) => request('/quizzes/submit', { method: 'POST', body: JSON.stringify(payload) }),
  getQuizHistory: () => request('/quizzes/history'),

  // Resume
  analyzeResume: (payload) => request('/resume/analyze', { method: 'POST', body: JSON.stringify(payload) }),
  getResumeHistory: () => request('/resume/history'),

  // Roadmap
  getRoadmap: () => request('/roadmap'),
  getRoadmapPresets: () => request('/roadmap/presets'),
  generateRoadmap: (payload) => request('/roadmap/generate', { method: 'POST', body: JSON.stringify(payload) }),
  toggleMilestone: (payload) => request('/roadmap/toggle', { method: 'POST', body: JSON.stringify(payload) }),
  resetRoadmap: () => request('/roadmap/reset', { method: 'POST' }),

  // Mock Interviews
  getInterviewQuestions: (role) => request(`/interviews/questions?role=${role || 'fullstack'}`),
  evaluateInterview: (payload) => request('/interviews/evaluate', { method: 'POST', body: JSON.stringify(payload) }),
  getInterviewHistory: () => request('/interviews/history'),

  // Project Analyzer (STAR)
  analyzeProject: (payload) => request('/projects/analyze', { method: 'POST', body: JSON.stringify(payload) }),
  getProjectHistory: () => request('/projects/history')
};
