import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import ProgressBar from '../components/ProgressBar';

const PRESET_CAREER_OPTIONS = [
  {
    id: 'fullstack',
    name: 'Full Stack Development',
    icon: '🌐',
    badge: 'Popular',
    desc: 'Frontend, Backend REST APIs, Databases, Caching & Cloud Capstones',
    defaultSubjects: [
      'HTML5 & Modern CSS3 (Grid/Flexbox/Tailwind)',
      'Modern JavaScript (ES6+, Async/Await, DOM)',
      'React.js (Components, Hooks, State & Routing)',
      'Node.js & Express.js REST APIs',
      'PostgreSQL, Relational Databases & SQL Queries',
      'Database Indexing, ACID & Transactions',
      'Git, GitHub & Version Control Collaboration',
      'JWT Authentication & Web Security (OWASP)',
      'System Design Fundamentals & Caching (Redis)',
      'Full-Stack Capstone Project & Docker Deployment'
    ]
  },
  {
    id: 'ai_ml',
    name: 'AI / Machine Learning Engineer',
    icon: '🤖',
    badge: 'Trending',
    desc: 'Deep Learning, Computer Vision, NLP, Transformers & LLM Systems',
    defaultSubjects: [
      'Python for AI & Object-Oriented Programming',
      'Mathematics for ML (Linear Algebra, Calculus & Statistics)',
      'NumPy & Vectorized Matrix Computations',
      'Pandas Data Cleaning & Feature Transformation',
      'Exploratory Data Analysis (EDA) & Seaborn Visualization',
      'Scikit-Learn & Classical Supervised Learning (Regression/Trees)',
      'Unsupervised Learning, Clustering & Dimensionality Reduction',
      'Deep Learning & Artificial Neural Networks (Backpropagation)',
      'PyTorch / TensorFlow Frameworks & Model Training',
      'CNNs for Vision, RNNs & Transformers for NLP Basics',
      'LLM Prompt Engineering, RAG & Vector Databases (FAISS)',
      'ML Model Serving (FastAPI, Docker & ONNX)'
    ]
  },
  {
    id: 'data_science',
    name: 'Data Science',
    icon: '📊',
    badge: 'High Demand',
    desc: 'Advanced SQL, Statistical Modeling, Predictive Analytics & BI Dashboards',
    defaultSubjects: [
      'Python & Jupyter Ecosystem for Scientific Computing',
      'Advanced SQL (Window Functions, CTEs, Joins & Aggregations)',
      'Probability Distributions, Inferential Statistics & Hypothesis Testing',
      'A/B Testing Methodologies & Experiment Design',
      'Data Cleaning, Imputation & Feature Engineering',
      'Exploratory Data Analysis & Statistical Modeling',
      'Ensemble Methods (Random Forest, XGBoost, LightGBM)',
      'Model Evaluation Metrics (ROC-AUC, Precision-Recall, F1)',
      'Interactive BI Dashboards (Power BI / Tableau)',
      'Big Data Fundamentals (PySpark & Cloud Data Warehouses)',
      'Data Storytelling & Executive Presentation'
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & Ethical Hacking',
    icon: '🛡️',
    badge: 'Critical',
    desc: 'Network Protocols, Linux, Cryptography, OWASP Web Security & Pentesting',
    defaultSubjects: [
      'Computer Networking (OSI, TCP/IP, Subnetting, Routing & DNS)',
      'Linux Administration, Bash Scripting & Command Line Power Tools',
      'Security Fundamentals & Threat Modeling (CIA Triad, STRIDE)',
      'Web Application Security & OWASP Top 10 Vulnerabilities',
      'Cryptography Fundamentals (Symmetric/Asymmetric, PKI & Hashing)',
      'Network Packet Analysis & Reconnaissance (Wireshark, Nmap)',
      'Authentication Protocols (OAuth 2.0, OpenID, SAML & MFA)',
      'Vulnerability Assessment & Penetration Testing Methodologies',
      'Identity & Access Management (IAM & Zero Trust Architecture)',
      'Security Incident Event Management (SIEM & Log Auditing)',
      'Secure Software Development Lifecycle (SSDLC) & Defensive Coding'
    ]
  },
  {
    id: 'backend_java',
    name: 'Java Development (Spring Boot)',
    icon: '☕',
    badge: 'Enterprise',
    desc: 'Core Java, JVM Internals, Spring Boot, Microservices, Kafka & PostgreSQL',
    defaultSubjects: [
      'Core Java OOP, Collections Framework & Generics',
      'Java Multithreading, Concurrency (Executors) & Streams API',
      'JVM Memory Management, Heap/Stack & Garbage Collection Tuning',
      'Relational Databases, PostgreSQL & Advanced SQL Queries',
      'JDBC, Hibernate ORM & Spring Data JPA',
      'Spring Boot Architecture, Dependency Injection & RESTful APIs',
      'Spring Security 6, OAuth2 & JWT Token Auth',
      'Microservices Architecture (Spring Cloud, Eureka, API Gateway)',
      'Asynchronous Event Streaming with Apache Kafka / RabbitMQ',
      'Unit & Integration Testing (JUnit 5, Mockito & Testcontainers)',
      'Dockerization & CI/CD Deployment for Java Microservices'
    ]
  },
  {
    id: 'python_dev',
    name: 'Python Development (FastAPI / Django)',
    icon: '🐍',
    badge: 'Flexible',
    desc: 'AsyncIO, FastAPI, SQLAlchemy, Redis, Celery & Microservices',
    defaultSubjects: [
      'Python Mastery (OOP, Decorators, Generators, Context Managers)',
      'Data Structures, Algorithms & Time Complexity in Python',
      'Asynchronous Programming (asyncio, Coroutines & Event Loop)',
      'FastAPI / Django Frameworks & OpenAPI Documentation',
      'Pydantic Data Validation, Typing & Serialization',
      'SQLAlchemy ORM, PostgreSQL & Database Migrations (Alembic)',
      'Distributed Task Queues (Celery, Redis & RabbitMQ)',
      'JWT Authentication, Password Hashing & Role-Based Security',
      'Automated Testing with Pytest, Mocking & Fixtures',
      'Dockerization, Multi-Stage Builds & Cloud Deployment'
    ]
  },
  {
    id: 'mobile_dev',
    name: 'Mobile App Development (React Native/Flutter)',
    icon: '📱',
    badge: 'Cross-Platform',
    desc: 'Mobile UI/UX, Navigation, State Management, SQLite & App Store Releases',
    defaultSubjects: [
      'Mobile UI/UX Design, Layout Systems & Responsive Touch Interfaces',
      'React Native / Flutter Core Components & Lifecycle',
      'Mobile State Management (Redux Toolkit / Zustand / Riverpod)',
      'Navigation & Screen Hierarchy (Stack, Tab & Modal Routers)',
      'Asynchronous REST API Integration & Offline-First Networking',
      'Local Persistence & Mobile Databases (AsyncStorage, SQLite)',
      'Native Device Hardware Integration (Camera, GPS, Biometrics)',
      'Push Notifications (Firebase Cloud Messaging / Expo Notifications)',
      'Mobile Performance Optimization, 60fps Animations & Memory Profiling',
      'Production Release Pipelines (Google Play Console & Apple App Store)'
    ]
  },
  {
    id: 'cloud_computing',
    name: 'Cloud Computing (AWS / Azure / GCP)',
    icon: '☁️',
    badge: 'Infrastructure',
    desc: 'VPC Architecture, IAM, Serverless, Terraform, Load Balancers & S3',
    defaultSubjects: [
      'Cloud Architecture Fundamentals & Shared Responsibility Model',
      'Linux Command Line, Networking (CIDR, Subnets, DNS) & SSH',
      'Identity & Access Management (IAM Policies, Roles & MFA)',
      'Cloud Compute Services (EC2, Auto Scaling Groups & Load Balancers)',
      'Serverless Architecture & Event-Driven Functions (AWS Lambda)',
      'Cloud Storage & Relational/NoSQL Databases (S3, RDS, DynamoDB)',
      'Virtual Private Clouds (VPC, Subnets, Internet Gateways & NAT)',
      'Content Delivery Networks (CloudFront), Caching & Route 53 DNS',
      'Infrastructure as Code (IaC) with Terraform & CloudFormation',
      'Cloud Security, Encryption at Rest/Transit & Cost Optimization'
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Platform Engineering',
    icon: '♾️',
    badge: 'Automation',
    desc: 'Docker, Kubernetes, CI/CD Pipelines, Helm, Terraform & Prometheus/Grafana',
    defaultSubjects: [
      'Linux System Administration, Shell Scripting & Process Automation',
      'Git Workflows, Branching Strategies & GitOps Foundations',
      'Docker Containerization, Multi-Stage Builds & Image Optimization',
      'Kubernetes Architecture (Pods, Deployments, Services & Ingress)',
      'Kubernetes ConfigMaps, Secrets, Volumes & Helm Chart Packaging',
      'Continuous Integration / Continuous Deployment (GitHub Actions / Jenkins)',
      'Infrastructure as Code (IaC) with Terraform & State Management',
      'Monitoring & Metrics Collection (Prometheus, Grafana & Node Exporter)',
      'Centralized Log Aggregation (ELK Stack / Loki & Promtail)',
      'DevSecOps, Container Vulnerability Scanning (Trivy) & Hardening'
    ]
  },
  {
    id: 'data_analytics',
    name: 'Data Analytics (SQL & Power BI)',
    icon: '📈',
    badge: 'Business Ops',
    desc: 'Advanced SQL, Excel Power Query, Power BI Dashboards & Business Metrics',
    defaultSubjects: [
      'Advanced SQL (Aggregations, Window Functions, CTEs & Subqueries)',
      'Data Extraction, Cleaning & Complex Multi-Source Data Blending',
      'Advanced Microsoft Excel (Pivot Tables, Power Query, XLOOKUP & Macros)',
      'Python for Analytics (Pandas, NumPy, Matplotlib & Seaborn)',
      'Exploratory Data Analysis (EDA) & Descriptive Business Statistics',
      'Interactive Dashboard Building (Power BI / Tableau / Metabase)',
      'Data Warehousing Principles & Dimensional Modeling (Star Schema)',
      'ETL / ELT Data Pipeline Fundamentals',
      'Business KPI Formulation, Funnel Analysis & Executive Reporting',
      'Data Storytelling, Presentation & Strategic Insights Formulation'
    ]
  },
  {
    id: 'dsa_competitive',
    name: 'DSA & Competitive Programming',
    icon: '🧩',
    badge: 'Coding Rounds',
    desc: 'Dynamic Programming, Graphs, Trees, Heaps, LeetCode Patterns & Speed OAs',
    defaultSubjects: [
      'Asymptotic Notation & Time/Space Complexity Mastery',
      'Arrays, Two Pointers, Sliding Window & Prefix Sums',
      'String Algorithms, Hashing & Set Operations',
      'Linked Lists (Singly/Doubly, Fast & Slow Pointers, Reversal)',
      'Stacks, Queues & Monotonic Stack / Deque Patterns',
      'Binary Trees, BSTs & Traversals (In/Pre/Post/Level Order)',
      'Heaps, Priority Queues & Top-K Frequent Elements',
      'Recursion & Backtracking (Subsets, Permutations, N-Queens)',
      'Graph Traversals (BFS, DFS, Dijkstra, Kahn’s TopoSort, Disjoint Sets)',
      '1D & 2D Dynamic Programming (Knapsack, LCS, LIS, Matrix DP)',
      'Bit Manipulation, Number Theory & Greedy Strategies',
      'Timed Online Assessment (OA) Simulation & 45-min Speed Contests'
    ]
  },
  {
    id: 'other',
    name: 'Other / Custom Career Track',
    icon: '🚀',
    badge: 'Custom',
    desc: 'Configure your custom tech stack, duration, study hours, and subjects.',
    defaultSubjects: [
      'Core Programming Fundamentals & Prerequisite Tools',
      'Language Syntax, OOP & Primary Architecture',
      'Practical Problem Solving & Hands-on Coding Drills',
      'Intermediate Design Patterns & Best Practices',
      'Data Persistence, Database Queries & Integrations',
      'Testing, Debugging & Performance Optimization',
      'Advanced Industry Standards & Security Measures',
      'Comprehensive Capstone Project & Portfolio Review'
    ]
  }
];

export default function Roadmap({ roadmapData, onMilestoneToggled }) {
  const [selectedPhase, setSelectedPhase] = useState(1);
  const [updatingKey, setUpdatingKey] = useState(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [filterType, setFilterType] = useState('all'); // all, pending, completed, projects, revisions
  const [searchQuery, setSearchQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [builderSuccess, setBuilderSuccess] = useState('');
  const [builderError, setBuilderError] = useState('');

  // Local active roadmap state (synced with prop)
  const [activeRoadmapData, setActiveRoadmapData] = useState(roadmapData);

  useEffect(() => {
    if (roadmapData) {
      setActiveRoadmapData(roadmapData);
    }
  }, [roadmapData]);

  // Builder Form State
  const initialConfig = activeRoadmapData?.config || {};
  const [formCareerGoal, setFormCareerGoal] = useState(initialConfig.careerGoal || 'Full Stack Development');
  const [customCareerGoal, setCustomCareerGoal] = useState('');
  const [formDurationValue, setFormDurationValue] = useState(initialConfig.durationValue || 6);
  const [formDurationUnit, setFormDurationUnit] = useState(initialConfig.durationUnit || 'months');
  const [formDailyHours, setFormDailyHours] = useState(initialConfig.dailyStudyHours || 4.0);
  const [formCurrentLevel, setFormCurrentLevel] = useState(initialConfig.currentLevel || 'Beginner');
  const [formTargetLevel, setFormTargetLevel] = useState(initialConfig.targetLevel || 'Job/Placement Ready');
  const [formSubjects, setFormSubjects] = useState(initialConfig.selectedSubjects || PRESET_CAREER_OPTIONS[0].defaultSubjects);
  const [customSubjectInput, setCustomSubjectInput] = useState('');

  // When career goal changes in builder, update suggested subjects
  const handleCareerGoalSelect = (goalObj) => {
    setFormCareerGoal(goalObj.name);
    setFormSubjects([...goalObj.defaultSubjects]);
  };

  // Toggle subject in builder
  const toggleSubject = (subject) => {
    if (formSubjects.includes(subject)) {
      if (formSubjects.length > 1) {
        setFormSubjects(formSubjects.filter(s => s !== subject));
      }
    } else {
      setFormSubjects([...formSubjects, subject]);
    }
  };

  // Add custom subject in builder
  const handleAddCustomSubject = (e) => {
    e.preventDefault();
    const trimmed = customSubjectInput.trim();
    if (!trimmed) return;
    if (!formSubjects.includes(trimmed)) {
      setFormSubjects([...formSubjects, trimmed]);
    }
    setCustomSubjectInput('');
  };

  // Remove subject
  const handleRemoveSubject = (subjectToRemove) => {
    if (formSubjects.length > 1) {
      setFormSubjects(formSubjects.filter(s => s !== subjectToRemove));
    }
  };

  // Submit Builder Form & Generate Personalized Roadmap
  const handleGenerateRoadmap = async (e) => {
    if (e) e.preventDefault();
    setIsGenerating(true);
    setBuilderError('');
    setBuilderSuccess('');

    const targetGoal = formCareerGoal === 'Other / Custom Career Track' && customCareerGoal.trim()
      ? customCareerGoal.trim()
      : formCareerGoal;

    try {
      const res = await api.generateRoadmap({
        career_goal: targetGoal,
        duration_value: parseInt(formDurationValue, 10) || 6,
        duration_unit: formDurationUnit,
        daily_study_hours: parseFloat(formDailyHours) || 4.0,
        selected_subjects: formSubjects,
        custom_subjects: [],
        current_level: formCurrentLevel,
        target_level: formTargetLevel
      });

      if (res.data) {
        setActiveRoadmapData(res.data);
        setSelectedPhase(1);
        setBuilderSuccess('🎉 Personalized Roadmap dynamically calculated and synchronized with database!');
        setTimeout(() => {
          setShowBuilder(false);
          setBuilderSuccess('');
        }, 1200);
      }
    } catch (err) {
      setBuilderError(err.message || 'Failed to generate personalized roadmap.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Milestone toggle handler
  const handleCheckboxToggle = async (milestone) => {
    setUpdatingKey(milestone.key);
    const newCompleted = !milestone.completed;

    try {
      await api.toggleMilestone({
        milestone_key: milestone.key,
        month_index: activePhaseData?.month || activePhaseData?.phase || 1,
        week_index: milestone.week || 1,
        title: milestone.title,
        completed: newCompleted
      });

      // Update local state instantly for snappy UI
      const updatedPhases = (activeRoadmapData?.roadmap || []).map(phase => ({
        ...phase,
        weeks: (phase.weeks || []).map(w => w.key === milestone.key ? { ...w, completed: newCompleted } : w)
      }));

      let compCount = 0;
      let totalCount = 0;
      updatedPhases.forEach(p => {
        (p.weeks || []).forEach(w => {
          totalCount++;
          if (w.completed) compCount++;
        });
      });

      const updatedData = {
        ...activeRoadmapData,
        roadmap: updatedPhases,
        completedTasks: compCount,
        totalTasks: totalCount,
        overallProgress: totalCount > 0 ? Math.round((compCount / totalCount) * 100) : 0,
        stats: {
          ...(activeRoadmapData?.stats || {}),
          completedTasks: compCount,
          totalTasks: totalCount,
          overallProgress: totalCount > 0 ? Math.round((compCount / totalCount) * 100) : 0
        }
      };

      setActiveRoadmapData(updatedData);

      if (onMilestoneToggled) {
        onMilestoneToggled(milestone.key, newCompleted);
      }
    } catch (err) {
      console.error('Failed to toggle milestone:', err);
    } finally {
      setUpdatingKey(null);
    }
  };

  const phases = activeRoadmapData?.roadmap || [];
  const activePhaseData = phases.find(p => (p.month === selectedPhase || p.phase === selectedPhase)) || phases[0];
  const stats = activeRoadmapData?.stats || {};
  const config = activeRoadmapData?.config || {};

  // Filter and search active phase milestones
  const activeMilestones = (activePhaseData?.weeks || []).filter(item => {
    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchFocus = item.focus?.toLowerCase().includes(q);
      const matchTopics = (item.topics || []).some(t => t.toLowerCase().includes(q));
      if (!matchTitle && !matchFocus && !matchTopics) return false;
    }

    // Tab filter
    if (filterType === 'pending') return !item.completed;
    if (filterType === 'completed') return item.completed;
    if (filterType === 'projects') return item.type === 'project' || item.priority === 'Capstone Project';
    if (filterType === 'revisions') return item.type === 'revision' || item.type === 'mock_test' || item.type === 'viva_defense';
    return true;
  });

  const getPriorityBadgeStyle = (priority) => {
    switch (priority) {
      case 'Critical':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Capstone Project':
        return 'bg-purple-500/10 text-purple-300 border-purple-500/30 font-bold';
      case 'Spaced Revision':
        return 'bg-sky-500/10 text-sky-300 border-sky-500/30 font-bold';
      case 'Mock Assessment':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold';
      case 'High':
        return 'bg-amber-500/10 text-amber-300 border-amber-500/30';
      default:
        return 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'project':
        return '💻 Project';
      case 'revision':
        return '🔁 Spaced Revision';
      case 'mock_test':
        return '🎯 Mock Assessment';
      case 'viva_defense':
        return '🎙️ Viva Defense';
      default:
        return '📚 Technical Core';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header & Personalized Configuration Summary */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono mb-2">
              <span>🎯 Active Path:</span>
              <span className="text-white font-bold">{config.careerGoal || stats.careerGoal || 'Full Stack Development'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">Personalized Roadmap & Milestone Engine</h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Dynamically synthesized curriculum calibrated to your available study hours, target deadline, skill level, revision days, and mock placement drills.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setShowBuilder(!showBuilder)}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/30 transition flex items-center gap-2"
            >
              <span>⚙️</span>
              <span>{showBuilder ? 'Close Roadmap Builder' : 'Personalize / Recalculate Roadmap'}</span>
            </button>
          </div>
        </div>

        {/* Configuration Metric Badges */}
        <div className="pt-2 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Target Timeline</div>
            <div className="text-white font-semibold mt-0.5">{stats.durationLabel || `${config.durationValue || 6} ${(config.durationUnit || 'months').toUpperCase()}`}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Daily Study Target</div>
            <div className="text-indigo-400 font-semibold mt-0.5">{config.dailyStudyHours || stats.dailyHours || 4.0} Hours / Day</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Skill Baseline</div>
            <div className="text-emerald-400 font-semibold mt-0.5">{config.currentLevel || stats.currentLevel || 'Beginner'}</div>
          </div>
          <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
            <div className="text-slate-500 text-[10px] uppercase font-bold">Target Outcome</div>
            <div className="text-amber-400 font-semibold mt-0.5">{config.targetLevel || stats.targetLevel || 'Job/Placement Ready'}</div>
          </div>
        </div>
      </div>

      {/* Interactive Personalized Roadmap Builder Modal/Section */}
      {showBuilder && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-indigo-500/40 shadow-2xl space-y-6 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>🛠️ Personalized Roadmap Builder</span>
              </h3>
              <p className="text-xs text-slate-400">
                Choose your career target, duration, available daily hours, and topics to calculate a custom milestone schedule.
              </p>
            </div>
            <button
              onClick={() => setShowBuilder(false)}
              className="text-slate-400 hover:text-white text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-800 border border-slate-700"
            >
              ✕ Close
            </button>
          </div>

          {builderSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
              <span>✅</span> {builderSuccess}
            </div>
          )}

          {builderError && (
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
              <span>⚠️</span> {builderError}
            </div>
          )}

          <form onSubmit={handleGenerateRoadmap} className="space-y-6">
            {/* Step 1: Career Goal Selection */}
            <div className="space-y-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                1. Select Career Goal / Target Role
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
                {PRESET_CAREER_OPTIONS.map((opt) => {
                  const isSelected = formCareerGoal === opt.name;
                  return (
                    <button
                      type="button"
                      key={opt.id}
                      onClick={() => handleCareerGoalSelect(opt)}
                      className={`p-3 rounded-2xl text-left border transition-all flex flex-col justify-between ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/20 ring-1 ring-indigo-500'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xl">{opt.icon}</span>
                        {opt.badge && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 text-xs font-bold">{opt.name}</div>
                    </button>
                  );
                })}
              </div>

              {formCareerGoal === 'Other / Custom Career Track' && (
                <div className="pt-2">
                  <label className="block text-xs text-slate-400 mb-1">Enter Custom Career Goal</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Embedded Systems Engineer, Game Developer (Unity), QA Automation..."
                    value={customCareerGoal}
                    onChange={(e) => setCustomCareerGoal(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              )}
            </div>

            {/* Step 2: Duration, Unit & Daily Study Hours */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-950 border border-slate-800/80">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  2. Target Duration
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="365"
                    required
                    value={formDurationValue}
                    onChange={(e) => setFormDurationValue(e.target.value)}
                    className="w-24 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={formDurationUnit}
                    onChange={(e) => setFormDurationUnit(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                  >
                    <option value="days">Days</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                  </select>
                </div>
                {/* Quick Presets */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  <button
                    type="button"
                    onClick={() => { setFormDurationValue(30); setFormDurationUnit('days'); }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  >
                    30 Days
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormDurationValue(12); setFormDurationUnit('weeks'); }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  >
                    12 Weeks
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormDurationValue(6); setFormDurationUnit('months'); }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  >
                    6 Months
                  </button>
                  <button
                    type="button"
                    onClick={() => { setFormDurationValue(8); setFormDurationUnit('months'); }}
                    className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                  >
                    8 Months
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  3. Daily Study Hours
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="1"
                    max="16"
                    required
                    value={formDailyHours}
                    onChange={(e) => setFormDailyHours(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-indigo-500"
                  />
                  <span className="text-xs text-slate-400 shrink-0 font-mono">hrs/day</span>
                </div>
                <div className="text-[10px] text-slate-500 mt-1 font-mono">
                  = ~{Math.round(parseFloat(formDailyHours || 4) * 7)} hrs/week
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  4. Current Skill Level
                </label>
                <select
                  value={formCurrentLevel}
                  onChange={(e) => setFormCurrentLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Beginner">Beginner (Foundations first)</option>
                  <option value="Intermediate">Intermediate (Core & Projects)</option>
                  <option value="Advanced">Advanced (Speed & Architecture)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5 font-mono">
                  5. Target Level
                </label>
                <select
                  value={formTargetLevel}
                  onChange={(e) => setFormTargetLevel(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="Job/Placement Ready">Job / Placement Ready</option>
                  <option value="Interview Ready">Interview Ready (DSA & Viva)</option>
                  <option value="Project Ready">Project Ready (Full Capstone)</option>
                  <option value="Custom Goal">Custom Goal</option>
                </select>
              </div>
            </div>

            {/* Step 3: Subjects & Skills Customizer */}
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
                  6. Customize Subjects & Topics to Study ({formSubjects.length} Selected)
                </label>
                <span className="text-[11px] text-slate-500">Click a topic to toggle on/off or add custom ones below.</span>
              </div>

              {/* Subject Tag Pills */}
              <div className="flex flex-wrap gap-2 p-3 rounded-2xl bg-slate-950 border border-slate-800 min-h-16">
                {formSubjects.map((sub, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-indigo-600/20 border border-indigo-500/40 text-indigo-200 group"
                  >
                    <span>{sub}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubject(sub)}
                      className="text-indigo-400 hover:text-rose-300 ml-1 text-xs"
                      title="Remove Topic"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Custom Subject Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Type a custom subject/topic (e.g. GraphQL, Rust, Prompt Engineering, Kafka)..."
                  value={customSubjectInput}
                  onChange={(e) => setCustomSubjectInput(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSubject}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition shrink-0"
                >
                  + Add Custom Topic
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setShowBuilder(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 font-semibold text-slate-300 text-xs transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isGenerating || formSubjects.length === 0}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 font-bold text-white text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Synthesizing Plan...</span>
                  </>
                ) : (
                  <>
                    <span>🚀 Generate Personalized Roadmap</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Progress & Milestone Metric Banner */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Main Progress Card */}
        <div className="md:col-span-2 p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col justify-between space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono">
                Personalized Roadmap Progress
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold text-white font-mono mt-1">
                {activeRoadmapData?.overallProgress || 0}% Completed
              </div>
              <div className="text-xs text-slate-400 mt-1">
                <span className="text-emerald-400 font-semibold font-mono">{activeRoadmapData?.completedTasks || 0}</span> of{' '}
                <span className="font-mono text-slate-300">{activeRoadmapData?.totalTasks || 0}</span> milestones checked
              </div>
            </div>

            <div className="w-full sm:w-64">
              <ProgressBar value={activeRoadmapData?.overallProgress || 0} color="purple" height="h-3.5" showLabel />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
            <div>
              <span className="text-slate-500 block">Total Est. Study</span>
              <span className="text-slate-200 font-bold">{stats.totalHours || 0} Hours</span>
            </div>
            <div>
              <span className="text-slate-500 block">Completed</span>
              <span className="text-emerald-400 font-bold">{stats.completedHours || 0} Hours</span>
            </div>
            <div>
              <span className="text-slate-500 block">Remaining</span>
              <span className="text-indigo-400 font-bold">{stats.remainingHours || 0} Hours</span>
            </div>
          </div>
        </div>

        {/* Milestone Portfolio Summary */}
        <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl flex flex-col justify-between space-y-3">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-400 font-mono mb-2">
              Curriculum Composition
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">💻 Capstone Projects</span>
                <span className="text-purple-400 font-mono font-bold">{phases.length} Sprints</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">🔁 Spaced Revision Days</span>
                <span className="text-sky-400 font-mono font-bold">Scheduled</span>
              </div>
              <div className="flex justify-between items-center p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-300">🎯 Mock OA & Viva Sprints</span>
                <span className="text-emerald-400 font-mono font-bold">Active</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setShowBuilder(true)}
            className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold transition text-center"
          >
            Adjust Hours or Deadline &rarr;
          </button>
        </div>
      </div>

      {/* Phase / Timeframe Navigation Pills */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
            Roadmap Stages &amp; Phases ({phases.length})
          </span>
          <span className="text-[11px] text-slate-500">Select a phase to view weekly targets</span>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {phases.map((p, idx) => {
            const phaseIndex = p.month || p.phase || (idx + 1);
            const isActive = (selectedPhase === phaseIndex);
            const completedCount = (p.weeks || []).filter(w => w.completed).length;
            const totalCount = (p.weeks || []).length;
            const isDone = totalCount > 0 && completedCount === totalCount;

            return (
              <button
                key={phaseIndex}
                onClick={() => setSelectedPhase(phaseIndex)}
                className={`px-4 py-3 rounded-2xl text-xs font-semibold shrink-0 transition-all flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400'
                    : 'bg-slate-900/80 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                }`}
              >
                <span>{p.title?.split(':')[0] || `Phase ${phaseIndex}`}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  isDone
                    ? 'bg-emerald-500/20 text-emerald-300 font-bold'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {isDone ? '✓ Done' : `${completedCount}/${totalCount}`}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Phase Content & Milestones */}
      {activePhaseData && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
          {/* Phase Header & Filter Toolbar */}
          <div className="border-b border-slate-800 pb-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-mono text-indigo-400 uppercase font-bold tracking-wider">
                  Phase Curriculum &amp; Deliverables
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">{activePhaseData.title}</h3>
                <p className="text-xs text-slate-400 mt-1">Core Subject Focus: {activePhaseData.focus}</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  Target: <span className="text-indigo-300 font-bold">{activePhaseData.targetHours || 80} Hours</span>
                </span>
              </div>
            </div>

            {/* Filter Pills & Search */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                <button
                  onClick={() => setFilterType('all')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    filterType === 'all' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  All Tasks ({activePhaseData.weeks?.length || 0})
                </button>
                <button
                  onClick={() => setFilterType('pending')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    filterType === 'pending' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Pending ({activePhaseData.weeks?.filter(w => !w.completed).length || 0})
                </button>
                <button
                  onClick={() => setFilterType('completed')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    filterType === 'completed' ? 'bg-slate-800 text-white border border-slate-700' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Completed ({activePhaseData.weeks?.filter(w => w.completed).length || 0})
                </button>
                <button
                  onClick={() => setFilterType('projects')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    filterType === 'projects' ? 'bg-purple-900/40 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  💻 Capstones
                </button>
                <button
                  onClick={() => setFilterType('revisions')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                    filterType === 'revisions' ? 'bg-sky-900/40 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  🔁 Revisions &amp; Mocks
                </button>
              </div>

              <div className="w-full sm:w-60">
                <input
                  type="text"
                  placeholder="Filter topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Milestone Cards List */}
          <div className="space-y-4">
            {activeMilestones.length === 0 ? (
              <div className="text-center py-8 text-slate-500 text-xs">
                No milestones found matching your current filter.
              </div>
            ) : (
              activeMilestones.map((milestone) => {
                const isUpdating = updatingKey === milestone.key;

                return (
                  <div
                    key={milestone.key}
                    onClick={() => handleCheckboxToggle(milestone)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer space-y-3 ${
                      milestone.completed
                        ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Top Row: Checkbox, Title, Priority & Type Badges */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3.5">
                        <input
                          type="checkbox"
                          checked={milestone.completed}
                          disabled={isUpdating}
                          onChange={() => {}} // Controlled by container onClick
                          className="w-5 h-5 mt-0.5 rounded-lg bg-slate-900 border-slate-700 text-indigo-600 focus:ring-0 cursor-pointer shrink-0"
                        />
                        <div>
                          <div className={`text-sm font-semibold leading-snug ${
                            milestone.completed ? 'text-emerald-300 line-through' : 'text-white'
                          }`}>
                            Target {milestone.week}: {milestone.title}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-1 flex flex-wrap items-center gap-2 font-mono">
                            <span>Target Time: <strong className="text-slate-200">{milestone.targetHours} Hours</strong></span>
                            <span>&bull;</span>
                            <span>Category: <strong className="text-indigo-300">{milestone.category || 'Core'}</strong></span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 shrink-0">
                        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${getPriorityBadgeStyle(milestone.priority)}`}>
                          {milestone.priority || 'Core'}
                        </span>
                        <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border ${
                          milestone.completed
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-bold'
                            : 'bg-slate-900 text-slate-400 border-slate-800'
                        }`}>
                          {milestone.completed ? 'COMPLETED' : 'PENDING'}
                        </span>
                      </div>
                    </div>

                    {/* Topics Chips */}
                    {milestone.topics && milestone.topics.length > 0 && (
                      <div className="pl-8 flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[10px] uppercase font-mono text-slate-500 font-bold mr-1">Topics:</span>
                        {milestone.topics.map((top, tIdx) => (
                          <span
                            key={tIdx}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900 border border-slate-800 text-slate-300"
                          >
                            {top}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Deliverable Actionable Checkpoint */}
                    {milestone.deliverable && (
                      <div className="pl-8 pt-1">
                        <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] text-slate-300 flex items-start gap-2">
                          <span className="text-indigo-400 font-bold shrink-0">🎯 Deliverable:</span>
                          <span>{milestone.deliverable}</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
