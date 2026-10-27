import React, { useState, useRef, useEffect } from 'react';
import { aiService } from '../services/ai';

export default function AIAssistant({ profile }) {
  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: `👋 Hello ${profile?.name || 'Student'}! I am your **AI Placement & Career Intelligence Assistant**.\n\nI can help you with:\n- **Technical Interview Questions** (DSA, Java, Spring Boot, React, DBMS)\n- **System Design & Architecture Trade-offs**\n- **Viva Defense Strategies & Examiner Traps**\n- **Customized Personalized Roadmap Guidance**\n\nWhat would you like to discuss today?`
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [aiStatus, setAiStatus] = useState({ configured: false, mode: 'loading', model: null });
  const [errorMessage, setErrorMessage] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Check backend AI service health and active model on load
  useEffect(() => {
    let mounted = true;
    aiService.getStatus()
      .then(status => {
        if (mounted && status) {
          setAiStatus(status);
        }
      })
      .catch(() => {
        if (mounted) {
          setAiStatus({ configured: false, mode: 'offline', model: null });
        }
      });
    return () => { mounted = false; };
  }, []);

  const handleSendMessage = async (textToSend) => {
    const text = (textToSend || inputText).trim();
    if (!text || isTyping) return;

    setErrorMessage(null);
    const userMessage = { sender: 'user', text };
    // Pass existing messages as conversation history to maintain context
    const currentHistory = [...messages];
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await aiService.sendChatMessage(text, currentHistory);
      const replyText = typeof response === 'object' && response.reply ? response.reply : response;
      setMessages(prev => [...prev, {
        sender: 'ai',
        text: replyText,
        isLive: typeof response === 'object' ? response.isLive : true,
        model: typeof response === 'object' ? response.model : null
      }]);
    } catch (err) {
      const errorText = err.message || 'Unable to connect to AI server. Please check your backend connection.';
      setErrorMessage(errorText);
      setMessages(prev => [
        ...prev,
        {
          sender: 'ai',
          text: `⚠️ **Connection Error:** ${errorText}\n\nPlease verify that the backend server is running and your network allows outgoing requests.`
        }
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const promptChips = [
    { label: '☕ Polymorphism & Dynamic Dispatch', prompt: 'Explain Compile-time vs Runtime Polymorphism in Java and Dynamic Method Dispatch with interview tips.' },
    { label: '🗄️ SQL WHERE vs HAVING & ACID', prompt: 'Explain the difference between WHERE and HAVING in SQL, and describe the 4 ACID properties.' },
    { label: '🌳 DSA Two-Pointer Strategy', prompt: 'How do I identify and apply the Two-Pointer and Sliding Window technique in tech coding rounds?' },
    { label: '🎓 Defend Full-Stack Capstone Project', prompt: 'Give me 3 tough viva defense questions an examiner might ask on a Full-Stack React + Node.js + PostgreSQL platform.' },
    { label: '🔥 Top 10 DSA Placement Problems', prompt: 'Give me 10 important DSA questions for placements' }
  ];

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4 animate-fade-in">
      {/* Header */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white text-base shadow-md shadow-indigo-500/20">
            🤖
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              AI Placement Career Mentor
            </h2>
            <p className="text-[11px] text-slate-400">
              {aiStatus.mode === 'live'
                ? `Live AI Intelligence Active (${aiStatus.model || 'Gemini'})`
                : 'Resilient Offline Intelligence & Pre-loaded Guidance'}
            </p>
          </div>
        </div>

        {/* Dynamic Status Badge */}
        {aiStatus.mode === 'live' ? (
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Online &bull; {aiStatus.model ? aiStatus.model.replace('gemini-', '') : 'Gemini AI'}
          </span>
        ) : (
          <span className="text-[10px] font-mono px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
            Offline Fallback Mode
          </span>
        )}
      </div>

      {/* Error Banner if any */}
      {errorMessage && (
        <div className="px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button
            onClick={() => setErrorMessage(null)}
            className="text-red-400 hover:text-white text-xs underline ml-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Quick Prompt Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {promptChips.map((chip, idx) => (
          <button
            key={idx}
            disabled={isTyping}
            onClick={() => handleSendMessage(chip.prompt)}
            className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/60 text-[11px] font-medium text-slate-300 hover:text-white shrink-0 transition disabled:opacity-50"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4 sm:p-6 overflow-y-auto space-y-4 shadow-inner">
        {messages.map((msg, i) => {
          const isAi = msg.sender === 'ai';
          return (
            <div
              key={i}
              className={`flex gap-3 max-w-3xl ${isAi ? 'mr-auto' : 'ml-auto flex-row-reverse'}`}
            >
              <div className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                isAi ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-200'
              }`}>
                {isAi ? 'AI' : 'YOU'}
              </div>

              <div className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                isAi
                  ? 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
                  : 'bg-indigo-600 text-white shadow-indigo-600/20'
              }`}>
                <div className="whitespace-pre-wrap font-sans selection:bg-indigo-500/30">{msg.text}</div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex gap-3 mr-auto max-w-lg">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white shrink-0 flex items-center justify-center text-xs font-bold">
              AI
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              <span>AI Mentor is thinking and generating answer...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }}
        className="flex items-center gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl p-2 shadow-xl"
      >
        <input
          type="text"
          value={inputText}
          disabled={isTyping}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isTyping ? "Please wait for AI to finish responding..." : "Ask any technical concept, coding strategy, or viva defense question..."}
          className="flex-1 bg-transparent px-4 py-2 text-sm text-white focus:outline-none placeholder:text-slate-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isTyping}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-semibold text-white text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-40 flex items-center gap-1.5"
        >
          {isTyping ? (
            <>
              <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
              <span>Thinking...</span>
            </>
          ) : (
            <span>Send &rarr;</span>
          )}
        </button>
      </form>
    </div>
  );
}
