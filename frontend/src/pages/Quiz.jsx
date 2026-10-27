import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProgressBar from '../components/ProgressBar';
import QuizCard from '../components/QuizCard';

export default function Quiz({ quizzes = [], onQuizCompleted }) {
  const [category, setCategory] = useState('aptitude');
  const [inTest, setInTest] = useState(false);
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes
  const [testResult, setTestResult] = useState(null);

  // Timer Effect during active test
  useEffect(() => {
    let timer = null;
    if (inTest && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timer);
            handleSubmitTest();
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [inTest, timeLeft]);

  const handleStartTest = async (selectedCat) => {
    const cat = selectedCat || category;
    setCategory(cat);
    setLoading(true);
    setTestResult(null);
    setUserAnswers({});
    setCurrentIndex(0);
    setTimeLeft(180);

    try {
      const res = await api.getQuizQuestions(cat);
      setQuestions(res.questions || []);
      setInTest(true);
    } catch (err) {
      console.error('Failed to load questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOption = (optIndex) => {
    setUserAnswers({
      ...userAnswers,
      [questions[currentIndex].id]: optIndex
    });
  };

  const handleSubmitTest = async () => {
    setLoading(true);
    try {
      const res = await api.submitQuizAttempt({
        category,
        answers: userAnswers,
        time_taken_seconds: 180 - timeLeft
      });
      setTestResult(res.data);
      setInTest(false);
      onQuizCompleted(res.data);
    } catch (err) {
      console.error('Failed to submit quiz:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Aptitude & Core Computer Science Arena</h2>
        <p className="text-xs text-slate-400">
          Timed speed practice on Quantitative Aptitude, Data Structures, DBMS, and Operating Systems. All attempts and scores are saved in PostgreSQL to calculate placement readiness.
        </p>
      </div>

      {/* Active Test Screen */}
      {inTest && questions.length > 0 ? (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl space-y-6">
          {/* Header with Timer and Category */}
          <div className="flex justify-between items-center border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                {category} Assessment
              </span>
              <div className="text-xs text-slate-400 mt-1">
                Question {currentIndex + 1} of {questions.length}
              </div>
            </div>

            <div className={`px-3.5 py-1.5 rounded-xl border font-mono font-bold text-sm ${
              timeLeft < 30 ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 animate-pulse' : 'bg-slate-950 border-slate-800 text-indigo-400'
            }`}>
              ⏱️ {formatTime(timeLeft)}
            </div>
          </div>

          {/* Question Text */}
          <div className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {questions[currentIndex]?.question}
          </div>

          {/* Options Grid */}
          <div className="space-y-3">
            {questions[currentIndex]?.options.map((opt, oIdx) => {
              const isSelected = userAnswers[questions[currentIndex].id] === oIdx;
              return (
                <button
                  key={oIdx}
                  onClick={() => handleSelectOption(oIdx)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                      : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <span className="text-sm font-medium">{opt}</span>
                  <span className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-mono font-bold ${
                    isSelected ? 'border-indigo-400 bg-indigo-500 text-white' : 'border-slate-700 text-slate-500'
                  }`}>
                    {String.fromCharCode(65 + oIdx)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Footer Controls */}
          <div className="flex justify-between items-center pt-4 border-t border-slate-800">
            <button
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex(i => i - 1)}
              className="px-4 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white text-xs disabled:opacity-40"
            >
              &larr; Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(i => i + 1)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/30"
              >
                Next Question &rarr;
              </button>
            ) : (
              <button
                onClick={handleSubmitTest}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-600/30"
              >
                Submit Test & View Results
              </button>
            )}
          </div>
        </div>
      ) : testResult ? (
        /* Results Breakdown Screen */
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-2xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-mono px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Assessment Evaluated & Saved
              </span>
              <h3 className="text-2xl font-extrabold text-white mt-1">
                Score: {testResult.score} / {testResult.totalQuestions} ({testResult.percentage}%)
              </h3>
            </div>

            <button
              onClick={() => handleStartTest(category)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg"
            >
              🔄 Retake Test
            </button>
          </div>

          {/* Detailed Question Review */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">Detailed Explanations</h4>
            {testResult.detailedResults?.map((res, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-2xl border ${
                  res.isCorrect ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-rose-950/20 border-rose-500/30'
                } space-y-2`}
              >
                <div className="flex justify-between items-start">
                  <div className="text-sm font-semibold text-white">
                    {idx + 1}. {res.question}
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    res.isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {res.isCorrect ? 'CORRECT' : 'INCORRECT'}
                  </span>
                </div>

                <div className="text-xs text-slate-300">
                  <span className="font-semibold text-emerald-400">Correct Answer:</span> {res.options[res.correctIndex]}
                </div>

                <div className="text-xs text-slate-400 bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80">
                  💡 <strong>Explanation:</strong> {res.explanation}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Test Category Picker & Past History */
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { id: 'aptitude', name: 'Quantitative & Logic', desc: 'Speed math, time-work, profit-loss, trains', icon: '🧮' },
              { id: 'dsa', name: 'DSA & Algorithms', desc: 'Trees, Graphs, DP, Sorting, Two Pointers', icon: '🌳' },
              { id: 'dbms', name: 'DBMS & SQL', desc: 'ACID, Indexes, Joins, Normalization, Transactions', icon: '🗄️' },
              { id: 'os', name: 'Operating Systems', desc: 'Processes, Threads, Deadlocks, Memory, Scheduling', icon: '💻' }
            ].map((cat) => (
              <QuizCard
                key={cat.id}
                id={cat.id}
                title={cat.name}
                description={cat.desc}
                icon={cat.icon}
                onStart={(id) => handleStartTest(id)}
              />
            ))}
          </div>

          {/* Past Assessment History */}
          <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Assessment Attempt History ({quizzes.length})
            </h3>

            {quizzes.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                No quiz attempts yet. Start any test above to record your score!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-slate-500 border-b border-slate-800 uppercase font-mono">
                    <tr>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3">Score</th>
                      <th className="py-2.5 px-3">Percentage</th>
                      <th className="py-2.5 px-3">Status</th>
                      <th className="py-2.5 px-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800 text-slate-300">
                    {quizzes.map((q) => (
                      <tr key={q.id}>
                        <td className="py-2.5 px-3 font-semibold uppercase text-white font-mono">{q.category}</td>
                        <td className="py-2.5 px-3 font-mono">{q.score} / {q.total_questions}</td>
                        <td className="py-2.5 px-3 font-mono font-bold text-indigo-400">{q.percentage}%</td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            q.passed ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                          }`}>
                            {q.passed ? 'PASSED' : 'NEEDS REVIEW'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-slate-500">{new Date(q.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
