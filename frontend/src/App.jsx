import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';

import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Resume from './pages/Resume';
import SkillGap from './pages/SkillGap';
import Roadmap from './pages/Roadmap';
import Quiz from './pages/Quiz';
import Interview from './pages/Interview';
import ProjectAnalyzer from './pages/ProjectAnalyzer';
import AIAssistant from './pages/AIAssistant';

import { api } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [readinessData, setReadinessData] = useState(null);
  const [roadmapData, setRoadmapData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAppData = async () => {
    try {
      // 1. User
      try {
        const userRes = await api.getMe();
        if (userRes.user) setUser(userRes.user);
      } catch (e) {}

      // 2. Profile
      const profRes = await api.getProfile();
      if (profRes.data) {
        setProfile(profRes.data);
        setSkills(profRes.data.skills || []);
      }

      // 3. Readiness
      const readRes = await api.getReadiness();
      if (readRes.data) setReadinessData(readRes.data);

      // 4. Quizzes
      const quizRes = await api.getQuizHistory();
      if (quizRes.data) setQuizzes(quizRes.data);

      // 5. Roadmap
      const roadRes = await api.getRoadmap();
      if (roadRes.data) setRoadmapData(roadRes.data);
    } catch (err) {
      console.warn('Initial data load notice:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppData();
  }, []);

  const refreshReadiness = async () => {
    try {
      const readRes = await api.getReadiness();
      if (readRes.data) setReadinessData(readRes.data);
    } catch (e) {}
  };

  const handleProfileUpdated = (updatedProfile) => {
    setProfile(updatedProfile);
    refreshReadiness();
  };

  const handleSkillsUpdated = (updatedSkills) => {
    setSkills(updatedSkills);
    refreshReadiness();
  };

  const handleQuizCompleted = async (newAttempt) => {
    const quizRes = await api.getQuizHistory();
    if (quizRes.data) setQuizzes(quizRes.data);
    refreshReadiness();
  };

  const handleMilestoneToggled = async () => {
    const roadRes = await api.getRoadmap();
    if (roadRes.data) setRoadmapData(roadRes.data);
    refreshReadiness();
  };

  const handleUserAuthChanged = (newUser) => {
    setUser(newUser);
    fetchAppData();
  };

  return (
    <div className="h-screen bg-slate-950 text-slate-100 flex flex-col antialiased overflow-hidden">
      {/* Top Global Header Bar */}
      <Navbar
        user={user}
        profile={profile}
        readinessScore={readinessData?.compositeScore || 0}
        quizCount={quizzes.length}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onUserAuthChanged={handleUserAuthChanged}
        onToggleMobileMenu={() => setMobileOpen(!mobileOpen)}
      />

      <div className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
        />

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'dashboard' && (
            <Dashboard
              profile={profile}
              readinessData={readinessData}
              skills={skills}
              quizzes={quizzes}
              roadmapData={roadmapData}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'profile' && (
            <Profile
              profile={profile}
              skills={skills}
              onProfileUpdated={handleProfileUpdated}
              onSkillsUpdated={handleSkillsUpdated}
            />
          )}

          {activeTab === 'resume' && (
            <Resume
              profile={profile}
              targetRole={profile?.target_role || 'fullstack'}
            />
          )}

          {activeTab === 'skillgap' && (
            <SkillGap
              profile={profile}
              skills={skills}
              setActiveTab={setActiveTab}
            />
          )}

          {activeTab === 'roadmap' && (
            <Roadmap
              roadmapData={roadmapData}
              onMilestoneToggled={handleMilestoneToggled}
            />
          )}

          {activeTab === 'quiz' && (
            <Quiz
              quizzes={quizzes}
              onQuizCompleted={handleQuizCompleted}
            />
          )}

          {activeTab === 'interview' && (
            <Interview
              profile={profile}
              onInterviewCompleted={refreshReadiness}
            />
          )}

          {activeTab === 'project' && (
            <ProjectAnalyzer
              profile={profile}
            />
          )}

          {activeTab === 'assistant' && (
            <AIAssistant
              profile={profile}
            />
          )}
        </main>
      </div>
    </div>
  );
}
