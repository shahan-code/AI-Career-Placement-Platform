import React, { useState } from 'react';
import { api, tokenStorage } from '../services/api';

export default function Navbar({
  user,
  profile,
  readinessScore = 0,
  quizCount = 0,
  activeTab,
  setActiveTab,
  onUserAuthChanged,
  onToggleMobileMenu
}) {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    setIsSubmitting(true);

    try {
      if (authMode === 'register') {
        const res = await api.register({
          name: authForm.name,
          email: authForm.email,
          password: authForm.password
        });
        tokenStorage.set(res.token);
        onUserAuthChanged(res.user);
      } else {
        const res = await api.login({
          email: authForm.email,
          password: authForm.password
        });
        tokenStorage.set(res.token);
        onUserAuthChanged(res.user);
      }
      setShowAuthModal(false);
      setAuthForm({ name: '', email: '', password: '' });
    } catch (err) {
      setAuthError(err.message || 'Authentication failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    tokenStorage.remove();
    onUserAuthChanged(null);
  };

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 50) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10';
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-4 lg:px-8 py-3 flex items-center justify-between">
        {/* Left: Brand Logo & Title */}
        <div className="flex items-center gap-3.5">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            aria-label="Toggle Navigation"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg shadow-indigo-600/30 text-base font-mono group-hover:scale-105 transition-transform">
              AI
            </div>
            <div>
              <h1 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2">
                <span>Career & Placement Intelligence</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono hidden sm:inline-block">
                  B.Tech Engineering
                </span>
              </h1>
              <p className="text-[11px] text-slate-400 font-medium">Analyze &bull; Decide &bull; Plan &bull; Learn &bull; Test &bull; Evaluate</p>
            </div>
          </div>
        </div>

        {/* Right: Quick Candidate Metrics & Auth Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Active Candidate Badge */}
          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 rounded-xl px-3 py-1.5 shadow-sm transition group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-semibold text-slate-300 group-hover:text-white max-w-[120px] truncate">
              {profile?.name || user?.name || 'Setup Profile'}
            </span>
          </button>

          {/* Live Readiness Pill */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border ${getScoreColor(readinessScore)}`}>
            <span className="text-[11px] text-slate-400 font-semibold hidden sm:inline">Readiness:</span>
            <span className="text-xs font-mono font-bold">{readinessScore}%</span>
          </div>

          {/* Quiz Counter */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-xs font-mono text-slate-300">
            <span>{quizCount} {quizCount === 1 ? 'Test' : 'Tests'}</span>
          </div>

          {/* Auth Button */}
          {user ? (
            <button
              onClick={handleLogout}
              className="text-xs font-medium text-slate-400 hover:text-rose-400 px-2.5 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-rose-500/40 transition"
              title="Sign Out"
            >
              Sign Out
            </button>
          ) : (
            <button
              onClick={() => { setAuthMode('login'); setShowAuthModal(true); }}
              className="text-xs font-semibold text-white px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30 transition"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Authentication Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {authMode === 'login' ? 'Welcome Back Student' : 'Create Candidate Account'}
                </h3>
                <p className="text-xs text-slate-400">
                  {authMode === 'login' ? 'Sign in to sync your placement progress & quiz attempts' : 'Register your profile on the placement portal'}
                </p>
              </div>
              <button
                onClick={() => setShowAuthModal(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {authError}
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'register' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    value={authForm.name}
                    onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                    placeholder="e.g. Alex Johnson"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={authForm.email}
                  onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                  placeholder="student@btech.edu"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">Password</label>
                <input
                  type="password"
                  required
                  value={authForm.password}
                  onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Processing...' : (authMode === 'login' ? 'Sign In' : 'Create Account')}
              </button>
            </form>

            <div className="text-center text-xs text-slate-400">
              {authMode === 'login' ? (
                <>
                  Don't have an account?{' '}
                  <button
                    onClick={() => { setAuthMode('register'); setAuthError(''); }}
                    className="text-indigo-400 hover:underline font-semibold"
                  >
                    Register here
                  </button>
                </>
              ) : (
                <>
                  Already registered?{' '}
                  <button
                    onClick={() => { setAuthMode('login'); setAuthError(''); }}
                    className="text-indigo-400 hover:underline font-semibold"
                  >
                    Sign In
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
