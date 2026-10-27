import React, { useState, useEffect } from 'react';
import { api } from '../services/api';

export default function Profile({ profile, skills = [], onProfileUpdated, onSkillsUpdated }) {
  const [formData, setFormData] = useState({
    name: profile?.name || '',
    college: profile?.college || '',
    degree: profile?.degree || 'B.Tech Computer Science & Engineering',
    semester: profile?.semester || '7th Semester',
    gpa: profile?.gpa || 8.4,
    target_role: profile?.target_role || 'fullstack',
    daily_study_hours: profile?.daily_study_hours || 4.0,
    bio: profile?.bio || '',
    github_url: profile?.github_url || '',
    linkedin_url: profile?.linkedin_url || ''
  });

  const [newSkill, setNewSkill] = useState({
    name: '',
    category: 'Languages',
    proficiency_level: 'Intermediate'
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        college: profile.college || 'National Institute of Engineering & Technology',
        degree: profile.degree || 'B.Tech Computer Science & Engineering',
        semester: profile.semester || '7th Semester',
        gpa: profile.gpa || 8.4,
        target_role: profile.target_role || 'fullstack',
        daily_study_hours: profile.daily_study_hours || 4.0,
        bio: profile.bio || '',
        github_url: profile.github_url || '',
        linkedin_url: profile.linkedin_url || ''
      });
    }
  }, [profile]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSaveSuccess('');

    try {
      const res = await api.updateProfile(formData);
      setSaveSuccess('Candidate Profile successfully synchronized with PostgreSQL database.');
      onProfileUpdated(res.data);
      setTimeout(() => setSaveSuccess(''), 4000);
    } catch (err) {
      setError(err.message || 'Failed to save candidate profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkill.name.trim()) return;

    try {
      const res = await api.addSkill(newSkill);
      onSkillsUpdated([...skills, res.data]);
      setNewSkill({ name: '', category: 'Languages', proficiency_level: 'Intermediate' });
    } catch (err) {
      setError(err.message || 'Failed to add skill');
    }
  };

  const handleDeleteSkill = async (id) => {
    try {
      await api.deleteSkill(id);
      onSkillsUpdated(skills.filter(s => s.id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete skill');
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Student Candidate Profile & Skills</h2>
        <p className="text-xs text-slate-400">
          Configure your academic details, target placement role, and technical competencies. Data is stored securely in PostgreSQL and dynamically updates your Placement Readiness score.
        </p>
      </div>

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
          <span>✅</span> {saveSuccess}
        </div>
      )}

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Main Profile Form */}
        <form onSubmit={handleProfileSubmit} className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
          <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">Academic & Placement Preferences</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Candidate Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Candidate Full Name"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Target Placement Role</label>
              <select
                value={formData.target_role}
                onChange={(e) => setFormData({ ...formData, target_role: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="fullstack">Full Stack Developer</option>
                <option value="ai_ml">AI / Machine Learning Engineer</option>
                <option value="data_science">Data Scientist</option>
                <option value="backend_java">Java / Spring Boot Developer</option>
                <option value="python_dev">Python / Backend Developer</option>
                <option value="cybersecurity">Cybersecurity Specialist</option>
                <option value="cloud_devops">Cloud & DevOps Engineer</option>
                <option value="mobile_dev">Mobile App Developer (React Native/Flutter)</option>
                <option value="data_analytics">Data Analyst (SQL/BI)</option>
                <option value="frontend_react">Frontend React Engineer</option>
                <option value="dsa_competitive">DSA & Competitive Programmer</option>
                <option value="other">Other / Custom Career Track</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">College / University</label>
              <input
                type="text"
                value={formData.college}
                onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Degree Program</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Current Semester</label>
              <select
                value={formData.semester}
                onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500 font-medium"
              >
                <option value="1st Semester">1st Semester</option>
                <option value="2nd Semester">2nd Semester</option>
                <option value="3rd Semester">3rd Semester</option>
                <option value="4th Semester">4th Semester</option>
                <option value="5th Semester">5th Semester</option>
                <option value="6th Semester">6th Semester</option>
                <option value="7th Semester">7th Semester</option>
                <option value="8th Semester">8th Semester</option>
                <option value="Graduated">Graduated / Alumni</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Cumulative GPA / CGPA (out of 10)</label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="10"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Daily Placement Prep Commitment (Hours)</label>
              <input
                type="number"
                step="0.5"
                min="1"
                max="16"
                value={formData.daily_study_hours}
                onChange={(e) => setFormData({ ...formData, daily_study_hours: parseFloat(e.target.value) || 0 })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">GitHub Profile URL</label>
              <input
                type="url"
                value={formData.github_url}
                onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                placeholder="https://github.com/your-handle"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Professional Summary & Bio</label>
            <textarea
              rows="3"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Brief summary of your technical focus, capstone project, and career aspirations..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
          >
            {saving ? 'Saving to Database...' : '💾 Save Profile to Database'}
          </button>
        </form>

        {/* Right 1 Col: Skills Manager */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-base font-bold text-white">Technical Skills ({skills.length})</h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Live CRUD
            </span>
          </div>

          {/* Add Skill Form */}
          <form onSubmit={handleAddSkill} className="space-y-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div>
              <input
                type="text"
                required
                placeholder="Skill name (e.g. Docker, Redux)"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={newSkill.category}
                onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300"
              >
                <option value="Languages">Languages</option>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Databases">Databases</option>
                <option value="Core CS">Core CS</option>
                <option value="DevOps & Tools">DevOps</option>
              </select>

              <select
                value={newSkill.proficiency_level}
                onChange={(e) => setNewSkill({ ...newSkill, proficiency_level: e.target.value })}
                className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1.5 text-xs text-slate-300"
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-indigo-600/80 hover:bg-indigo-600 font-semibold text-white text-xs transition"
            >
              + Add Skill to Profile
            </button>
          </form>

          {/* Current Skills List */}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
            {skills.map((skill) => (
              <div
                key={skill.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700"
              >
                <div>
                  <div className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <span>{skill.name}</span>
                    {skill.verified && <span className="text-[10px] text-emerald-400" title="Verified Skill">✓</span>}
                  </div>
                  <div className="text-[10px] text-slate-500">
                    {skill.category} &bull; <span className="text-indigo-400">{skill.proficiency_level}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteSkill(skill.id)}
                  className="text-slate-500 hover:text-rose-400 p-1 text-xs transition"
                  title="Remove Skill"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
