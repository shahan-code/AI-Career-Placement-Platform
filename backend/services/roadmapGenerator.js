/**
 * Comprehensive Dynamic Roadmap Generator Engine
 * Generates personalized learning paths based on Career Goal, Duration, Daily Hours, Current Level, and Target Level.
 */

const CAREER_CATALOG = {
  fullstack: {
    id: 'fullstack',
    name: 'Full Stack Development',
    icon: '🌐',
    description: 'Master frontend, backend, databases, REST APIs, system architecture, and cloud deployment.',
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
    ],
    sampleProjects: [
      'Full-Stack Placement & Job Board SaaS with Auth & Database',
      'Real-time Collaborative Whiteboard & Chat Application',
      'E-Commerce Platform with Cart, Stripe/Razorpay Checkout & Admin Dashboard'
    ],
    mockAssessments: [
      'Frontend React & JavaScript DOM Machine Coding Sprint',
      'Backend Node.js/Express REST API Live Coding OA',
      'Full-Stack Architecture & Viva Defense Mock Round'
    ]
  },
  ai_ml: {
    id: 'ai_ml',
    name: 'AI / Machine Learning Engineer',
    icon: '🤖',
    description: 'Build predictive machine learning models, neural networks, computer vision, and LLM applications.',
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
      'LLM Prompt Engineering, RAG & Vector Databases (FAISS/Pinecone)',
      'ML Model Serving (FastAPI, Docker & ONNX)'
    ],
    sampleProjects: [
      'End-to-End Predictive Health Analytics Pipeline with Streamlit',
      'RAG-Powered AI Document Intelligence Search Engine',
      'Computer Vision Defect Detection & Image Classification API'
    ],
    mockAssessments: [
      'ML Theory & Algorithm Trade-offs (Bias-Variance, Gradient Descent)',
      'Python Data Wrangling & Modeling OA Speed Drill',
      'AI System Design & Model Deployment Viva Defense'
    ]
  },
  data_science: {
    id: 'data_science',
    name: 'Data Science',
    icon: '📊',
    description: 'Analyze complex datasets, extract business intelligence, formulate statistical models, and build ML systems.',
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
    ],
    sampleProjects: [
      'Customer Lifetime Value & Churn Prediction Dashboard',
      'Financial Market Algorithmic Risk Assessment & Anomaly Detection',
      'E-Commerce Market Basket & Recommendation Engine'
    ],
    mockAssessments: [
      'Complex SQL Multi-Table Queries & CTE Speed Challenge',
      'Statistical Inference & Business Case Study Interview',
      'Applied Data Science Project Walkthrough & Viva Defense'
    ]
  },
  cybersecurity: {
    id: 'cybersecurity',
    name: 'Cybersecurity & Ethical Hacking',
    icon: '🛡️',
    description: 'Protect networks, audit web application vulnerabilities, implement cryptographic security, and defend against threats.',
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
    ],
    sampleProjects: [
      'Automated Web Vulnerability & Port Scanner Tool in Python',
      'Zero-Trust Authentication & Role-Based Access Proxy',
      'Network Intrusion Detection & Packet Anomaly Analyzer'
    ],
    mockAssessments: [
      'Network Protocols & Cryptographic Handshake Deep Dive',
      'OWASP Top 10 Web Exploitation & Mitigation Viva Sprint',
      'Enterprise Incident Response & Defense Simulation'
    ]
  },
  backend_java: {
    id: 'backend_java',
    name: 'Java Development (Spring Boot & Microservices)',
    icon: '☕',
    description: 'Build robust enterprise backend architectures, scalable REST microservices, and high-throughput systems in Java.',
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
    ],
    sampleProjects: [
      'Distributed Banking & Payment Processing Microservice Gateway',
      'High-Throughput Inventory Reservation System with Kafka & Redis',
      'Multi-Tenant Enterprise SaaS Backend with Role-Based Access'
    ],
    mockAssessments: [
      'Core Java & Concurrency Whiteboard Coding Assessment',
      'Spring Boot Microservices & Database Transaction Tuning Viva',
      'System Design: Scalable URL Shortener / Rate Limiter in Java'
    ]
  },
  python_dev: {
    id: 'python_dev',
    name: 'Python Development (Backend & Microservices)',
    icon: '🐍',
    description: 'Develop high-performance asynchronous backends, REST/GraphQL APIs, background workers, and cloud services in Python.',
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
    ],
    sampleProjects: [
      'Async High-Throughput Webhook Processing Pipeline with FastAPI & Celery',
      'Real-time Chat & Notification Engine with WebSockets & Redis',
      'RESTful Content Management & Subscription API with PostgreSQL'
    ],
    mockAssessments: [
      'Pythonic Algorithms & DSA Problem Solving Challenge',
      'FastAPI / Async Backend Architecture Technical Interview',
      'Database Optimization & SQL Query Tuning Viva Defense'
    ]
  },
  mobile_dev: {
    id: 'mobile_dev',
    name: 'Mobile App Development (React Native / Flutter)',
    icon: '📱',
    description: 'Build native-grade, responsive mobile applications for iOS and Android with modern cross-platform frameworks.',
    defaultSubjects: [
      'Mobile UI/UX Design, Layout Systems & Responsive Touch Interfaces',
      'React Native / Flutter Core Components & Lifecycle',
      'Mobile State Management (Redux Toolkit / Zustand / Riverpod)',
      'Navigation & Screen Hierarchy (Stack, Tab & Modal Routers)',
      'Asynchronous REST API Integration & Offline-First Networking',
      'Local Persistence & Mobile Databases (AsyncStorage, SQLite, WatermelonDB)',
      'Native Device Hardware Integration (Camera, GPS, Biometrics)',
      'Push Notifications (Firebase Cloud Messaging / Expo Notifications)',
      'Mobile Performance Optimization, 60fps Animations & Memory Profiling',
      'Production Release Pipelines (Google Play Console & Apple App Store)'
    ],
    sampleProjects: [
      'Cross-Platform Fitness & Habit Tracking App with Offline Sync',
      'Real-time Food Delivery Tracking App with Interactive Maps',
      'Social Media / Community Mobile App with Media Uploads & Dark Mode'
    ],
    mockAssessments: [
      'Mobile Architecture & State Management Live Coding',
      'Offline Synchronization & Device API Integration Viva',
      'Mobile App Performance & Memory Leak Handling Interview'
    ]
  },
  cloud_computing: {
    id: 'cloud_computing',
    name: 'Cloud Computing (AWS / Azure / GCP)',
    icon: '☁️',
    description: 'Design resilient, fault-tolerant cloud architectures, manage virtual networks, serverless compute, and cloud security.',
    defaultSubjects: [
      'Cloud Architecture Fundamentals & Shared Responsibility Model',
      'Linux Command Line, Networking (CIDR, Subnets, DNS) & SSH',
      'Identity & Access Management (IAM Policies, Roles & Multi-Factor Auth)',
      'Cloud Compute Services (EC2, Auto Scaling Groups & Elastic Load Balancing)',
      'Serverless Architecture & Event-Driven Functions (AWS Lambda / Azure Functions)',
      'Cloud Storage & Relational/NoSQL Databases (S3, RDS, DynamoDB)',
      'Virtual Private Clouds (VPC, Subnets, Internet Gateways & NAT Gateways)',
      'Content Delivery Networks (CloudFront), Caching & Route 53 DNS',
      'Infrastructure as Code (IaC) with Terraform & CloudFormation',
      'Cloud Security, Encryption at Rest/Transit & Cost Optimization'
    ],
    sampleProjects: [
      'Multi-Tier High-Availability Web Architecture on AWS via Terraform',
      'Serverless Event-Driven Image Processing & Notification Pipeline',
      'Disaster Recovery & Automated Multi-Region Backup System'
    ],
    mockAssessments: [
      'Cloud Architecture Trade-offs & High Availability Design Round',
      'Terraform Infrastructure Deployment Speed Assessment',
      'Enterprise Cloud Security & IAM Governance Viva Defense'
    ]
  },
  devops: {
    id: 'devops',
    name: 'DevOps & Platform Engineering',
    icon: '♾️',
    description: 'Automate build and deployment pipelines, containerize microservices, orchestrate Kubernetes, and ensure 99.99% uptime.',
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
    ],
    sampleProjects: [
      'End-to-End Automated Production CI/CD Pipeline on GitHub Actions with Kubernetes Deploy',
      'Multi-Service Kubernetes Cluster with Helm, Ingress Controller & SSL Automation',
      'Full-Stack Observability Stack with Grafana Dashboards & Alertmanager'
    ],
    mockAssessments: [
      'Dockerfile & Kubernetes Manifest Optimization Drill',
      'CI/CD Pipeline Failure Debugging & Triage Interview',
      'Production Outage Post-Mortem & Incident Management Viva'
    ]
  },
  data_analytics: {
    id: 'data_analytics',
    name: 'Data Analytics',
    icon: '📈',
    description: 'Transform raw data into business decisions with SQL, Power BI, Excel, statistics, and business intelligence.',
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
    ],
    sampleProjects: [
      'Executive Sales & Customer Revenue Performance Dashboard in Power BI',
      'SaaS Subscription Cohort & Churn Retention Analytics in SQL + Python',
      'Supply Chain & Inventory Optimization Business Intelligence Report'
    ],
    mockAssessments: [
      'Timed Complex SQL Window Functions & Aggregation Drill',
      'Live Power BI / Tableau Dashboard Building Challenge',
      'Business Problem Case Study & Insight Presentation Viva'
    ]
  },
  dsa_competitive: {
    id: 'dsa_competitive',
    name: 'DSA & Competitive Programming',
    icon: '🧩',
    description: 'Crack coding rounds at tier-1 product companies with mastery over algorithms, data structures, and speed problem solving.',
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
    ],
    sampleProjects: [
      'Algorithmic Pattern Cheat Engine with 150 Solved LeetCode Medium/Hard Patterns',
      'Visual Graph Algorithm & Pathfinding Interactive Simulator',
      'Automated Coding Benchmark & Test Suite Evaluator'
    ],
    mockAssessments: [
      'Tier-1 Product Company 60-Minute OA Coding Simulation',
      'Live Whiteboard DSA Coding & Complexity Explanation Mock',
      'Dynamic Programming & Graph Edge Case Mastery Interview'
    ]
  },
  other: {
    id: 'other',
    name: 'Custom / Other Career Goal',
    icon: '🚀',
    description: 'A completely customized engineering curriculum tailored to your specific technologies, duration, and goals.',
    defaultSubjects: [
      'Core Programming Fundamentals & Prerequisite Tools',
      'Language Syntax, OOP & Primary Architecture',
      'Practical Problem Solving & Hands-on Coding Drills',
      'Intermediate Design Patterns & Best Practices',
      'Data Persistence, Database Queries & Integrations',
      'Testing, Debugging & Performance Optimization',
      'Advanced Industry Standards & Security Measures',
      'Comprehensive Capstone Project & Portfolio Review'
    ],
    sampleProjects: [
      'End-to-End Practical Capstone Project demonstrating full technology mastery',
      'Specialized Tool / Utility Library with unit tests and documentation'
    ],
    mockAssessments: [
      'Technical Core Competencies Speed Assessment',
      'Portfolio Walkthrough & Viva Defense Mock Round'
    ]
  }
};

class RoadmapGenerator {
  /**
   * Get all preset catalog options
   */
  static getCatalog() {
    return Object.values(CAREER_CATALOG).map(c => ({
      id: c.id,
      name: c.name,
      icon: c.icon,
      description: c.description,
      defaultSubjects: c.defaultSubjects
    }));
  }

  /**
   * Find career definition by ID or name
   */
  static findCareerDefinition(careerGoal) {
    if (!careerGoal) return CAREER_CATALOG.fullstack;

    const normalized = careerGoal.toLowerCase().trim();
    if (CAREER_CATALOG[normalized]) return CAREER_CATALOG[normalized];

    // Search by key fragments
    for (const key in CAREER_CATALOG) {
      const item = CAREER_CATALOG[key];
      if (
        item.name.toLowerCase().includes(normalized) ||
        normalized.includes(item.id.toLowerCase()) ||
        normalized.includes(item.name.toLowerCase())
      ) {
        return item;
      }
    }

    // Keyword heuristics
    if (normalized.includes('full') || normalized.includes('web') || normalized.includes('mern') || normalized.includes('mean')) return CAREER_CATALOG.fullstack;
    if (normalized.includes('ai') || normalized.includes('machine') || normalized.includes('deep learning') || normalized.includes('ml')) return CAREER_CATALOG.ai_ml;
    if (normalized.includes('data sci')) return CAREER_CATALOG.data_science;
    if (normalized.includes('cyber') || normalized.includes('security') || normalized.includes('hack')) return CAREER_CATALOG.cybersecurity;
    if (normalized.includes('java') || normalized.includes('spring')) return CAREER_CATALOG.backend_java;
    if (normalized.includes('python') || normalized.includes('django') || normalized.includes('fastapi')) return CAREER_CATALOG.python_dev;
    if (normalized.includes('mobile') || normalized.includes('react native') || normalized.includes('flutter') || normalized.includes('android') || normalized.includes('ios')) return CAREER_CATALOG.mobile_dev;
    if (normalized.includes('cloud') || normalized.includes('aws') || normalized.includes('azure') || normalized.includes('gcp')) return CAREER_CATALOG.cloud_computing;
    if (normalized.includes('devops') || normalized.includes('kubernetes') || normalized.includes('docker') || normalized.includes('ci/cd')) return CAREER_CATALOG.devops;
    if (normalized.includes('analytic') || normalized.includes('power bi') || normalized.includes('tableau')) return CAREER_CATALOG.data_analytics;
    if (normalized.includes('dsa') || normalized.includes('algo') || normalized.includes('competitive') || normalized.includes('leetcode')) return CAREER_CATALOG.dsa_competitive;

    return CAREER_CATALOG.other;
  }

  /**
   * Main Dynamic Plan Generator
   */
  static generatePlan(options = {}) {
    const {
      careerGoal = 'Full Stack Development',
      durationValue = 6,
      durationUnit = 'months', // 'days', 'weeks', 'months'
      dailyStudyHours = 4.0,
      selectedSubjects = [],
      customSubjects = [],
      currentLevel = 'Beginner', // 'Beginner', 'Intermediate', 'Advanced'
      targetLevel = 'Job/Placement Ready' // 'Job/Placement Ready', 'Interview Ready', 'Project Ready', 'Custom Goal'
    } = options;

    const careerDef = this.findCareerDefinition(careerGoal);

    // 1. Calculate Time & Target Hours
    const rawVal = Math.max(1, parseInt(durationValue, 10) || 6);
    const dailyHours = Math.max(0.5, Math.min(16, parseFloat(dailyStudyHours) || 4.0));
    const weeklyHours = Math.round(dailyHours * 7);

    let totalDays = 180;
    let totalWeeks = 24;
    let durationLabel = '';

    if (durationUnit === 'days') {
      totalDays = rawVal;
      totalWeeks = Math.max(1, Math.ceil(totalDays / 7));
      durationLabel = `${totalDays} Days (${totalWeeks} ${totalWeeks === 1 ? 'Week' : 'Weeks'})`;
    } else if (durationUnit === 'weeks') {
      totalWeeks = rawVal;
      totalDays = totalWeeks * 7;
      durationLabel = `${totalWeeks} Weeks (~${Math.round(totalWeeks / 4)} Months)`;
    } else {
      // months
      const months = rawVal;
      totalWeeks = months * 4;
      totalDays = totalWeeks * 7;
      durationLabel = `${months} ${months === 1 ? 'Month' : 'Months'} (${totalWeeks} Weeks)`;
    }

    const totalAvailableHours = Math.round(totalDays * dailyHours);

    // 2. Resolve Active Subjects
    let allSubjects = [];
    if (Array.isArray(selectedSubjects) && selectedSubjects.length > 0) {
      allSubjects = [...selectedSubjects];
    } else {
      allSubjects = [...careerDef.defaultSubjects];
    }

    if (Array.isArray(customSubjects) && customSubjects.length > 0) {
      customSubjects.forEach(s => {
        if (s && s.trim() && !allSubjects.includes(s.trim())) {
          allSubjects.push(s.trim());
        }
      });
    }

    if (allSubjects.length === 0) {
      allSubjects = [...careerDef.defaultSubjects];
    }

    // 3. Determine Number of Phases & Grouping
    let phaseCount = 6;
    let phaseType = 'month'; // 'month', 'week', 'sprint'

    if (durationUnit === 'months') {
      phaseCount = rawVal;
      phaseType = 'month';
    } else if (durationUnit === 'weeks') {
      if (rawVal <= 6) {
        phaseCount = rawVal;
        phaseType = 'week';
      } else {
        phaseCount = Math.max(2, Math.round(rawVal / 4));
        phaseType = 'phase';
      }
    } else {
      // days
      if (rawVal <= 21) {
        phaseCount = Math.max(2, Math.ceil(rawVal / 7));
        phaseType = 'sprint';
      } else {
        phaseCount = Math.max(2, Math.round(rawVal / 30));
        phaseType = 'phase';
      }
    }

    phaseCount = Math.max(1, phaseCount);

    // 4. Distribute subjects across phases
    const phases = [];
    const subjectsPerPhase = Math.max(1, Math.ceil(allSubjects.length / phaseCount));

    for (let p = 1; p <= phaseCount; p++) {
      const pStartIndex = (p - 1) * subjectsPerPhase;
      const phaseSubjects = allSubjects.slice(pStartIndex, pStartIndex + subjectsPerPhase);
      const isFirstPhase = p === 1;
      const isLastPhase = p === phaseCount;
      const isMidPhase = p === Math.ceil(phaseCount / 2);

      // Phase title & focus
      let phaseTitle = `Phase ${p}`;
      let phaseFocus = '';

      if (phaseType === 'month') {
        phaseTitle = `Month ${p}: ${this.getPhaseTheme(p, phaseCount, careerDef.name, currentLevel, targetLevel)}`;
      } else if (phaseType === 'week') {
        phaseTitle = `Week ${p}: ${this.getPhaseTheme(p, phaseCount, careerDef.name, currentLevel, targetLevel)}`;
      } else if (phaseType === 'sprint') {
        phaseTitle = `Sprint ${p}: ${this.getPhaseTheme(p, phaseCount, careerDef.name, currentLevel, targetLevel)}`;
      } else {
        phaseTitle = `Phase ${p} of ${phaseCount}: ${this.getPhaseTheme(p, phaseCount, careerDef.name, currentLevel, targetLevel)}`;
      }

      if (phaseSubjects.length > 0) {
        phaseFocus = phaseSubjects.join(', ');
      } else {
        phaseFocus = `${careerDef.name} Advanced Synthesis, Project Building & Mock Sprints`;
      }

      // Generate 4 weekly milestones (or 3-4 sub-targets) for this phase
      const milestones = [];
      const daysInThisPhase = Math.max(7, Math.round(totalDays / phaseCount));
      const phaseStudyHours = Math.round(daysInThisPhase * dailyHours);
      const milestoneTargetHours = Math.max(4, Math.round(phaseStudyHours / 4));

      for (let w = 1; w <= 4; w++) {
        const key = `p${p}_w${w}`;
        const milestoneObj = this.createMilestone({
          key,
          phaseIndex: p,
          totalPhases: phaseCount,
          weekIndex: w,
          phaseSubjects,
          careerDef,
          currentLevel,
          targetLevel,
          dailyHours,
          milestoneTargetHours,
          isFirstPhase,
          isLastPhase,
          isMidPhase
        });

        milestones.push(milestoneObj);
      }

      phases.push({
        month: p, // Keep 'month' property for backwards compatibility with existing UI
        phase: p,
        title: phaseTitle,
        focus: phaseFocus,
        targetHours: phaseStudyHours,
        weeks: milestones // Keep 'weeks' property for backwards compatibility with existing UI
      });
    }

    // 5. Compute Plan Statistics
    let totalTasks = 0;
    phases.forEach(ph => {
      totalTasks += ph.weeks.length;
    });

    const stats = {
      careerGoal: careerDef.name,
      careerId: careerDef.id,
      durationValue: rawVal,
      durationUnit,
      durationLabel,
      totalDays,
      totalWeeks,
      dailyHours,
      weeklyHours,
      totalHours: totalAvailableHours,
      totalTasks,
      completedTasks: 0,
      overallProgress: 0,
      currentLevel,
      targetLevel
    };

    return {
      config: {
        careerGoal: careerDef.name,
        durationValue: rawVal,
        durationUnit,
        dailyStudyHours: dailyHours,
        currentLevel,
        targetLevel,
        selectedSubjects: allSubjects,
        customSubjects
      },
      stats,
      roadmap: phases // 'roadmap' alias for 100% frontend compatibility
    };
  }

  /**
   * Helper to derive meaningful thematic phase titles
   */
  static getPhaseTheme(phaseIndex, totalPhases, careerName, currentLevel, targetLevel) {
    if (totalPhases === 1) {
      return `${careerName} Comprehensive Fast-Track Sprint`;
    }

    const progressRatio = phaseIndex / totalPhases;

    if (progressRatio <= 0.25) {
      return currentLevel === 'Beginner'
        ? `Foundational Concepts & Core Programming Syntax`
        : `Architecture Foundations, Clean Code & Tooling Setup`;
    } else if (progressRatio <= 0.50) {
      return `Core Data Structures, Algorithms & Framework Essentials`;
    } else if (progressRatio <= 0.75) {
      return `Production Backend/APIs, Database Optimization & System Design`;
    } else {
      if (targetLevel === 'Job/Placement Ready') {
        return `Placement Drive Speed Drills, Viva Defense & Mock Interviews`;
      } else if (targetLevel === 'Interview Ready') {
        return `Technical Interview Whiteboard Rounds & Advanced DSA Sprints`;
      } else if (targetLevel === 'Project Ready') {
        return `Full Capstone Project Deployment, CI/CD & Portfolio Showcase`;
      } else {
        return `Advanced Practical Mastery, Capstone Polish & Final Evaluation`;
      }
    }
  }

  /**
   * Helper to create rich milestone item
   */
  static createMilestone({
    key,
    phaseIndex,
    totalPhases,
    weekIndex,
    phaseSubjects,
    careerDef,
    currentLevel,
    targetLevel,
    dailyHours,
    milestoneTargetHours,
    isFirstPhase,
    isLastPhase,
    isMidPhase
  }) {
    // Subject for this specific week
    const subject = phaseSubjects[(weekIndex - 1) % Math.max(1, phaseSubjects.length)] || careerDef.name;

    // Determine milestone type
    let type = 'concept';
    let priority = 'Critical';
    let title = '';
    let category = 'Technical Core';
    let topics = [];
    let deliverable = '';

    // Last week of final phase -> Mock tests / Placement drives
    if (isLastPhase && weekIndex === 4) {
      type = 'mock_test';
      priority = 'Mock Assessment';
      category = 'Interview Assessment';
      title = targetLevel === 'Job/Placement Ready'
        ? `Tier-1 Campus Placement Speed Drills & Online Assessment Simulation`
        : `Comprehensive ${careerDef.name} Final Evaluation & System Review`;
      topics = [
        'Timed Online Assessment (OA) Simulation',
        'Technical Viva Defense Strategies',
        'Behavioral STAR Framework Answers',
        'Resume ATS Keyword Validation'
      ];
      deliverable = 'Complete 1 full timed OA assessment drill and record mock interview score.';
    }
    // Week 3 of final phase -> AI Mock Interview & Viva
    else if (isLastPhase && weekIndex === 3) {
      type = 'viva_defense';
      priority = 'Mock Assessment';
      category = 'Viva & Interview';
      title = `AI Technical Mock Interview & Viva Defense on ${careerDef.name} Projects`;
      topics = [
        'Architecture Decision Justifications',
        'Edge Case Handling & Error Scenarios',
        'Examiner Viva Defense Traps',
        'Communication & Solution Structuring'
      ];
      deliverable = 'Pass AI Mock Interview evaluation with >= 80% rubric score.';
    }
    // Last week of mid phase OR week 4 of intermediate phases -> Spaced Revision & Mini Project
    else if (weekIndex === 4 && (isMidPhase || totalPhases <= 3)) {
      type = 'revision';
      priority = 'Spaced Revision';
      category = 'Revision & Practice';
      title = `Spaced Repetition Sprint & Mid-Curriculum Diagnostics Checkpoint`;
      topics = [
        'Active Recall on Core Theoretical Concepts',
        'Timed Problem-Solving Drills on Weak Areas',
        'Formula & Cheat Sheet Synthesis',
        'Diagnostic Knowledge Assessment'
      ];
      deliverable = 'Complete chapter-wise revision tests and resolve 10 targeted practice problems.';
    }
    // Week 3 -> Hands-on Implementation / Project Sprint
    else if (weekIndex === 3) {
      type = 'project';
      priority = isLastPhase ? 'Capstone Project' : 'High';
      category = 'Hands-on Implementation';
      const sampleProj = careerDef.sampleProjects[(phaseIndex - 1) % careerDef.sampleProjects.length] || 'Modular Portfolio Capstone';
      title = isLastPhase
        ? `Production Capstone Integration: ${sampleProj}`
        : `Practical Implementation & Architecture Sprint for ${subject}`;
      topics = [
        'Modular Component / Architecture Design',
        'API & Data Flow Integration',
        'Automated Unit & Integration Testing',
        'Dockerization & Local Environment Setup'
      ];
      deliverable = `Implement and test the working repository for ${sampleProj}.`;
    }
    // Week 2 -> Deep Dive & Advanced Mechanics
    else if (weekIndex === 2) {
      type = 'concept';
      priority = 'High';
      category = 'Applied Mechanics';
      title = `${subject} — Deep Dive, Patterns & Optimization`;
      topics = [
        'Intermediate Design Patterns',
        'Performance & Execution Flow',
        'Handling Complex Corner Cases',
        'Best Practices & Industry Standards'
      ];
      deliverable = `Build 3 interactive test examples exercising ${subject} mechanisms.`;
    }
    // Week 1 -> Core Foundations
    else {
      type = 'concept';
      priority = 'Critical';
      category = 'Fundamental Theory';
      title = `${subject} — Core Architecture, Principles & Hands-on Setup`;
      topics = [
        'Fundamental Syntax & Underlying Principles',
        'Development Environment & Tooling',
        'Core Data Models & Structures',
        'Standard Library & API Interactions'
      ];
      deliverable = `Complete foundational exercises and implement baseline proof of concept for ${subject}.`;
    }

    return {
      key,
      week: weekIndex,
      title,
      focus: subject,
      targetHours: milestoneTargetHours,
      priority,
      category,
      type,
      topics,
      deliverable,
      completed: false
    };
  }
}

module.exports = {
  CAREER_CATALOG,
  RoadmapGenerator
};
