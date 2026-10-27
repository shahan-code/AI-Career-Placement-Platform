import React, { useState } from 'react';
import ProgressBar from '../components/ProgressBar';

const BENCHMARKS = {
  "fullstack": {
    title: "Full Stack Developer",
    expectedHours: 4,
    skills: [
      { name: "JavaScript", importance: "Critical", weight: 95 },
      { name: "React", importance: "Critical", weight: 90 },
      { name: "Node.js", importance: "Critical", weight: 85 },
      { name: "PostgreSQL", importance: "Critical", weight: 85 },
      { name: "REST APIs", importance: "Critical", weight: 90 },
      { name: "Git & GitHub", importance: "Critical", weight: 85 },
      { name: "Docker", importance: "Important", weight: 70 },
      { name: "Tailwind CSS", importance: "Recommended", weight: 75 },
      { name: "DSA & Algorithms", importance: "Critical", weight: 80 }
    ],
    companies: ["Amazon", "TCS Digital", "Swiggy", "Zomato", "Accenture", "Infosys", "Startups"]
  },
  "ai_ml": {
    title: "AI / Machine Learning Engineer",
    expectedHours: 5,
    skills: [
      { name: "Python", importance: "Critical", weight: 95 },
      { name: "NumPy", importance: "Critical", weight: 90 },
      { name: "Pandas", importance: "Critical", weight: 90 },
      { name: "Scikit-Learn", importance: "Critical", weight: 90 },
      { name: "Deep Learning", importance: "Critical", weight: 85 },
      { name: "PyTorch / TensorFlow", importance: "Important", weight: 85 },
      { name: "Statistics & Math", importance: "Critical", weight: 90 },
      { name: "FastAPI / Model Serving", importance: "Important", weight: 75 }
    ],
    companies: ["Google", "Microsoft", "OpenAI", "Meta", "NVIDIA", "Uber", "Amazon AI"]
  },
  "data_science": {
    title: "Data Scientist",
    expectedHours: 4.5,
    skills: [
      { name: "Python", importance: "Critical", weight: 95 },
      { name: "SQL", importance: "Critical", weight: 95 },
      { name: "Statistics & Probability", importance: "Critical", weight: 90 },
      { name: "Exploratory Data Analysis", importance: "Critical", weight: 90 },
      { name: "Machine Learning", importance: "Critical", weight: 85 },
      { name: "Power BI / Tableau", importance: "Important", weight: 80 },
      { name: "Feature Engineering", importance: "Important", weight: 80 }
    ],
    companies: ["JPMorgan Chase", "Deloitte", "Amazon", "Walmart Global Tech", "Mu Sigma", "Fractal"]
  },
  "cybersecurity": {
    title: "Cybersecurity Specialist",
    expectedHours: 4.5,
    skills: [
      { name: "Computer Networking (TCP/IP)", importance: "Critical", weight: 95 },
      { name: "Linux Administration", importance: "Critical", weight: 90 },
      { name: "OWASP Top 10", importance: "Critical", weight: 95 },
      { name: "Cryptography & PKI", importance: "Critical", weight: 85 },
      { name: "Wireshark / Nmap", importance: "Important", weight: 80 },
      { name: "Identity & Access (IAM)", importance: "Important", weight: 80 },
      { name: "Penetration Testing", importance: "Important", weight: 80 }
    ],
    companies: ["Palo Alto Networks", "CrowdStrike", "Cisco", "EY", "KPMG", "PwC", "Mandiant"]
  },
  "backend_java": {
    title: "Java / Spring Boot Developer",
    expectedHours: 4.5,
    skills: [
      { name: "Java", importance: "Critical", weight: 95 },
      { name: "OOP Concepts", importance: "Critical", weight: 95 },
      { name: "Spring Boot", importance: "Critical", weight: 90 },
      { name: "PostgreSQL", importance: "Critical", weight: 85 },
      { name: "RESTful Web Services", importance: "Critical", weight: 90 },
      { name: "DSA & Algorithms", importance: "Critical", weight: 90 },
      { name: "Docker", importance: "Important", weight: 75 },
      { name: "Microservices", importance: "Important", weight: 75 }
    ],
    companies: ["Oracle", "Morgan Stanley", "JPMorgan Chase", "Goldman Sachs", "Cisco", "TCS"]
  },
  "python_dev": {
    title: "Python / Backend Developer",
    expectedHours: 4,
    skills: [
      { name: "Python", importance: "Critical", weight: 95 },
      { name: "FastAPI / Django", importance: "Critical", weight: 90 },
      { name: "SQLAlchemy / PostgreSQL", importance: "Critical", weight: 85 },
      { name: "Asyncio & Concurrency", importance: "Important", weight: 80 },
      { name: "Redis & Celery", importance: "Important", weight: 80 },
      { name: "REST APIs & OpenAPI", importance: "Critical", weight: 90 },
      { name: "Docker", importance: "Important", weight: 75 }
    ],
    companies: ["Instagram", "Dropbox", "Spotify", "Pinterest", "Stripe", "CRED"]
  },
  "mobile_dev": {
    title: "Mobile App Developer",
    expectedHours: 4,
    skills: [
      { name: "React Native / Flutter", importance: "Critical", weight: 95 },
      { name: "JavaScript / Dart", importance: "Critical", weight: 90 },
      { name: "Mobile UI/UX Design", importance: "Critical", weight: 85 },
      { name: "State Management", importance: "Critical", weight: 85 },
      { name: "REST APIs & Offline Storage", importance: "Important", weight: 80 },
      { name: "Push Notifications", importance: "Important", weight: 75 }
    ],
    companies: ["Uber", "Zomato", "Swiggy", "PhonePe", "CRED", "Dream11"]
  },
  "cloud_devops": {
    title: "Cloud & DevOps Engineer",
    expectedHours: 4.5,
    skills: [
      { name: "Linux Administration", importance: "Critical", weight: 95 },
      { name: "Docker Containerization", importance: "Critical", weight: 95 },
      { name: "Kubernetes Orchestration", importance: "Critical", weight: 90 },
      { name: "CI/CD (GitHub Actions)", importance: "Critical", weight: 90 },
      { name: "AWS / Azure Cloud", importance: "Critical", weight: 85 },
      { name: "Terraform (IaC)", importance: "Important", weight: 85 },
      { name: "Prometheus & Grafana", importance: "Important", weight: 75 }
    ],
    companies: ["Amazon Web Services", "Microsoft", "Red Hat", "HashiCorp", "Infosys", "Wipro"]
  },
  "data_analytics": {
    title: "Data Analyst",
    expectedHours: 3.5,
    skills: [
      { name: "Advanced SQL", importance: "Critical", weight: 95 },
      { name: "Power BI / Tableau", importance: "Critical", weight: 90 },
      { name: "Microsoft Excel & Pivot", importance: "Critical", weight: 85 },
      { name: "Python (Pandas, Seaborn)", importance: "Important", weight: 85 },
      { name: "Exploratory Data Analysis", importance: "Critical", weight: 85 },
      { name: "Business KPI Modeling", importance: "Important", weight: 80 }
    ],
    companies: ["Accenture", "EY", "KPMG", "Target", "Amazon", "Dell"]
  },
  "dsa_competitive": {
    title: "DSA & Competitive Programmer",
    expectedHours: 5,
    skills: [
      { name: "Data Structures (Trees/Graphs/Heaps)", importance: "Critical", weight: 95 },
      { name: "Dynamic Programming (1D/2D)", importance: "Critical", weight: 95 },
      { name: "Time & Space Complexity (Big-O)", importance: "Critical", weight: 95 },
      { name: "Two Pointers & Sliding Window", importance: "Critical", weight: 90 },
      { name: "Recursion & Backtracking", importance: "Critical", weight: 90 },
      { name: "Graph BFS / DFS / Dijkstra", importance: "Critical", weight: 90 }
    ],
    companies: ["Google", "Meta", "Amazon", "Microsoft", "Directi", "Adobe", "Uber"]
  },
  "frontend_react": {
    title: "Frontend React Engineer",
    expectedHours: 3.5,
    skills: [
      { name: "JavaScript", importance: "Critical", weight: 95 },
      { name: "React", importance: "Critical", weight: 95 },
      { name: "TypeScript", importance: "Important", weight: 85 },
      { name: "HTML5/CSS3", importance: "Critical", weight: 90 },
      { name: "Tailwind CSS", importance: "Important", weight: 80 },
      { name: "Redux / State Mgmt", importance: "Important", weight: 80 },
      { name: "Git & GitHub", importance: "Critical", weight: 85 }
    ],
    companies: ["Swiggy", "Flipkart", "Razorpay", "BrowserStack", "Cognizant", "Wipro"]
  }
};

export default function SkillGap({ profile, skills = [], setActiveTab }) {
  const [selectedRoleKey, setSelectedRoleKey] = useState(profile?.target_role || 'fullstack');

  const benchmark = BENCHMARKS[selectedRoleKey] || BENCHMARKS['fullstack'];
  const userSkillNames = skills.map(s => s.name.toLowerCase());

  const acquired = [];
  const missing = [];

  benchmark.skills.forEach(req => {
    const isAcquired = userSkillNames.some(uName => 
      uName === req.name.toLowerCase() || req.name.toLowerCase().includes(uName) || uName.includes(req.name.toLowerCase())
    );

    if (isAcquired) {
      acquired.push(req);
    } else {
      missing.push(req);
    }
  });

  const matchPercent = Math.round((acquired.length / benchmark.skills.length) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-2">
        <h2 className="text-xl sm:text-2xl font-bold text-white">Skill Gap Analysis & Benchmark Comparison</h2>
        <p className="text-xs text-slate-400">
          Compares your candidate profile against tier-1 company hiring expectations to highlight missing competencies and guide your roadmap sprint.
        </p>
      </div>

      {/* Role Selector & Match Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Select Industry Benchmark Role</label>
            <select
              value={selectedRoleKey}
              onChange={(e) => setSelectedRoleKey(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-4 py-2 text-sm text-white font-semibold focus:outline-none focus:border-indigo-500"
            >
              <option value="fullstack">Full Stack Developer</option>
              <option value="ai_ml">AI / Machine Learning Engineer</option>
              <option value="data_science">Data Scientist</option>
              <option value="cybersecurity">Cybersecurity Specialist</option>
              <option value="backend_java">Java / Spring Boot Developer</option>
              <option value="python_dev">Python / Backend Developer</option>
              <option value="mobile_dev">Mobile App Developer</option>
              <option value="cloud_devops">Cloud & DevOps Engineer</option>
              <option value="data_analytics">Data Analyst</option>
              <option value="dsa_competitive">DSA & Competitive Programmer</option>
              <option value="frontend_react">Frontend React Engineer</option>
            </select>
          </div>

          <div className="flex items-center gap-4 bg-slate-950 px-5 py-3 rounded-2xl border border-slate-800">
            <div>
              <div className="text-[10px] uppercase font-mono text-slate-500 font-bold">Role Match Index</div>
              <div className="text-2xl font-extrabold text-indigo-400 font-mono">{matchPercent}%</div>
            </div>
            <div className="w-28">
              <ProgressBar value={matchPercent} color={matchPercent >= 75 ? 'emerald' : 'indigo'} />
            </div>
          </div>
        </div>

        {/* Top Hiring Companies */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Active Hiring Companies:</span>
          {benchmark.companies.map((c, i) => (
            <span key={i} className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-950 border border-slate-800 text-slate-300">
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* 2-Column Competency Audit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Acquired Skills */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Acquired Competencies ({acquired.length})</span>
            </h3>
            <span className="text-xs font-mono text-emerald-400 font-bold">{matchPercent}% Covered</span>
          </div>

          {acquired.length === 0 ? (
            <div className="text-xs text-slate-500 py-6 text-center">
              No matching skills found yet. Add your skills in the Student Profile.
            </div>
          ) : (
            <div className="space-y-2">
              {acquired.map((sk, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-emerald-500/20">
                  <div className="text-xs font-semibold text-white flex items-center gap-2">
                    <span className="text-emerald-400 font-bold">✓</span>
                    <span>{sk.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    {sk.importance}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Missing Skills & Gap */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span>
              <span>Missing High-Priority Skills ({missing.length})</span>
            </h3>
            <span className="text-xs font-mono text-rose-400 font-bold">Action Needed</span>
          </div>

          {missing.length === 0 ? (
            <div className="text-xs text-emerald-400 py-6 text-center font-semibold">
              🎉 Outstanding! You meet 100% of the benchmark skill requirements for this role.
            </div>
          ) : (
            <div className="space-y-2">
              {missing.map((sk, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-slate-950 border border-rose-500/20">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <span className="text-rose-400 font-bold">+</span>
                    <span>{sk.name}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20">
                    Priority: {sk.importance}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
