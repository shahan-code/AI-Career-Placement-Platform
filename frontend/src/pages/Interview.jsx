import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProgressBar from '../components/ProgressBar';

export default function Interview({ profile, onInterviewCompleted }) {
  const [role, setRole] = useState(profile?.target_role || 'fullstack');
  const [questions, setQuestions] = useState([]);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [evaluating, setEvaluating] = useState(false);
  const [evaluationResult, setEvaluationResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadQuestions(role);
  }, [role]);

  const loadQuestions = async (targetRole) => {
    try {
      const res = await api.getInterviewQuestions(targetRole);
      setQuestions(res.questions || []);
      setCurrentQIndex(0);
      setEvaluationResult(null);
      setUserAnswer('');
    } catch (err) {
      console.error('Failed to load questions:', err);
    }
  };

  const handleEvaluate = async (e) => {
    e.preventDefault();
    if (!userAnswer.trim() || !questions[currentQIndex]) return;

    setEvaluating(true);
    setError('');

    try {
      const res = await api.evaluateInterview({
        role,
        question: questions[currentQIndex],
        userAnswer
      });
      setEvaluationResult(res.data);
      onInterviewCompleted?.(res.data);
    } catch (err) {
      setError(err.message || 'Evaluation failed');
    } finally {
      setEvaluating(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">AI Technical Mock Interview Studio</h2>
        <p className="text-xs text-slate-400">
          Simulate real technical interviews for your target role. The AI Evaluator grades your response against industry rubrics, highlights missing production edge cases, and provides intelligent follow-ups.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold">
          {error}
        </div>
      )}

      {/* Role & Question Selector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Studio Input: 7 cols */}
        <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <div>
              <label className="block text-[10px] font-mono text-slate-400 uppercase font-bold">Interview Track</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white mt-1 focus:outline-none focus:border-indigo-500"
              >
                <option value="fullstack">Junior Full Stack Developer</option>
                <option value="backend_java">Backend Java / Spring Boot</option>
                <option value="frontend_react">Frontend React Developer</option>
              </select>
            </div>

            <span className="text-xs font-mono text-slate-400">
              Question {currentQIndex + 1} of {questions.length}
            </span>
          </div>

          {/* Question Card */}
          <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-500/30 space-y-1.5">
            <div className="text-[10px] uppercase font-mono text-indigo-400 font-bold">Interviewer Question:</div>
            <div className="text-sm sm:text-base font-bold text-white leading-relaxed">
              {questions[currentQIndex] || 'Loading question...'}
            </div>
          </div>

          {/* Candidate Answer Input */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-300">Your Technical Response</label>
            <textarea
              rows="8"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Explain your approach clearly: mention core principles, real-world examples, time/space complexity, and architecture trade-offs..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              onClick={() => {
                setCurrentQIndex((currentQIndex + 1) % questions.length);
                setUserAnswer('');
                setEvaluationResult(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition"
            >
              🔄 Next Question
            </button>

            <button
              onClick={handleEvaluate}
              disabled={evaluating || !userAnswer.trim()}
              className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-xs shadow-lg shadow-indigo-600/30 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {evaluating ? 'AI Evaluating Response...' : '⚡ Submit Answer for AI Evaluation'}
            </button>
          </div>
        </div>

        {/* Right Evaluation Result: 5 cols */}
        <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-5 flex flex-col justify-between">
          <div>
            <div className="border-b border-slate-800 pb-3 flex justify-between items-center">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">AI Evaluation Rubric</h3>
              {evaluationResult && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Evaluated
                </span>
              )}
            </div>

            {evaluationResult ? (
              <div className="space-y-4 mt-4 animate-fade-in">
                {/* Score & Rating */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-1.5">
                  <div className="text-[11px] font-mono text-slate-400 uppercase font-semibold">Technical Score</div>
                  <div className="text-3xl font-extrabold text-indigo-400 font-mono">
                    {evaluationResult.score} / 100
                  </div>
                  <ProgressBar value={evaluationResult.score} color="indigo" height="h-2" />
                  <div className="text-xs text-slate-300 font-medium pt-1">
                    Communication: <span className="text-emerald-400 font-semibold">{evaluationResult.communication}</span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-slate-300">Interviewer Feedback:</div>
                  <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                    {evaluationResult.feedback}
                  </p>
                </div>

                {/* Missing Concepts */}
                {evaluationResult.missingConcepts?.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-xs font-semibold text-rose-400">Missing Production Concepts:</div>
                    <ul className="text-xs text-slate-400 list-disc list-inside space-y-1">
                      {evaluationResult.missingConcepts.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Follow Up */}
                {evaluationResult.followUp && (
                  <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/30 text-xs text-purple-300 space-y-1">
                    <div className="font-bold text-[10px] uppercase font-mono">💡 In-Depth Follow Up Question:</div>
                    <div>{evaluationResult.followUp}</div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-16 text-center text-slate-500 text-xs space-y-2">
                <div className="text-3xl">🎙️</div>
                <div>Write your answer on the left and submit to receive instant AI evaluation.</div>
              </div>
            )}
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
            📌 <strong>Placement Strategy:</strong> Always begin with high-level definitions, then dive into runtime complexities and real production trade-offs.
          </div>
        </div>
      </div>
    </div>
  );
}
