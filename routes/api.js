const express = require('express');
const router = express.Router();
const questionGenerator = require('../services/questionGenerator');
const answerEvaluator = require('../services/answerEvaluator');
const resumeEvaluator = require('../services/resumeEvaluator');
const { TOPICS, QUESTION_BANK, CAREER_ROADMAPS } = require('../services/questionBank');

// In-memory persistent state for registered users and bookmarks
const USERS_DB = new Map();
const USER_BOOKMARKS = new Map();
const USER_PRACTICE_LOG = new Map();

// Seed default demo user
USERS_DB.set("candidate@gmail.com", {
  id: "usr-demo",
  name: "Yelty Vardhan Reddy",
  email: "candidate@gmail.com",
  password: "password123",
  role: "Full Stack Engineer",
  avatar: "👨‍💻",
  provider: "gmail",
  token: "jwt-token-demo",
  joinedDate: "2026-09-12"
});

// GET /api/roles - List supported roles & categories
router.get('/roles', (req, res) => {
  const roles = [
    "Full Stack / Web Developer",
    "C / Embedded Systems Developer",
    "C++ Software Engineer",
    "Python / Backend Developer",
    "Java / Enterprise Backend Engineer",
    "SQL & Database Engineer",
    "Frontend Engineer (React / HTML / CSS / JS)",
    "Node.js Backend Developer",
    "Data Structures & Algorithms Specialist",
    "General Engineering / Software Engineer"
  ];

  res.json({
    success: true,
    roles,
    topics: TOPICS,
    categories: [
      { id: "all", label: "🎯 Mixed Mock Interview (Recommended)" },
      { id: "technical", label: "💻 Technical & Core Fundamentals" },
      { id: "behavioral", label: "🧠 Behavioral & Leadership (STAR)" },
      { id: "system-design", label: "📐 System Design & Architecture" },
      { id: "scenario", label: "⚡ Scenario & Problem Solving" }
    ],
    experienceLevels: [
      { id: "entry", label: "🎓 Fresh Graduate / Entry-Level (0–1 YOE)" },
      { id: "junior", label: "🚀 Junior Engineer (1–3 YOE)" },
      { id: "mid", label: "⚙️ Mid-Level Engineer (3–5 YOE)" },
      { id: "senior", label: "🏛️ Senior / Lead Engineer (5+ YOE)" }
    ]
  });
});

// GET /api/topics - List all 12 core topics with question count
router.get('/topics', (req, res) => {
  const topicsWithCounts = TOPICS.map(t => {
    let count = 0;
    if (t.id === 'all') {
      count = QUESTION_BANK.length;
    } else {
      count = QUESTION_BANK.filter(q => q.topic === t.id).length;
    }
    return {
      ...t,
      questionCount: count
    };
  });

  res.json({
    success: true,
    topics: topicsWithCounts
  });
});

// GET /api/topics/:topicId - Get Q&As for a specific topic
router.get('/topics/:topicId', (req, res) => {
  const { topicId } = req.params;
  let items = QUESTION_BANK;

  if (topicId && topicId !== 'all') {
    items = QUESTION_BANK.filter(q => q.topic === topicId);
  }

  const topicMeta = TOPICS.find(t => t.id === topicId) || { id: topicId, name: "All Topics", icon: "🌐" };

  res.json({
    success: true,
    topic: topicMeta,
    count: items.length,
    questions: items
  });
});

// GET /api/search - Live search across questions, answers, tags, and topics
router.get('/search', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();
  const topicFilter = (req.query.topic || '').trim().toLowerCase();

  if (!query && (!topicFilter || topicFilter === 'all')) {
    return res.json({
      success: true,
      query: "",
      count: QUESTION_BANK.length,
      results: QUESTION_BANK
    });
  }

  const matched = QUESTION_BANK.filter(q => {
    if (topicFilter && topicFilter !== 'all' && q.topic !== topicFilter) {
      return false;
    }

    if (!query) return true;

    const qText = (q.question || '').toLowerCase();
    const aText = (q.modelAnswer || '').toLowerCase();
    const blueprintText = (q.answerBlueprint || '').toLowerCase();
    const intentText = (q.interviewerIntent || '').toLowerCase();
    const tagsText = (q.tags || []).join(' ').toLowerCase();
    const topicText = (q.topicName || '').toLowerCase();
    const codeText = (q.codeSnippet || '').toLowerCase();

    return (
      qText.includes(query) ||
      aText.includes(query) ||
      blueprintText.includes(query) ||
      intentText.includes(query) ||
      tagsText.includes(query) ||
      topicText.includes(query) ||
      codeText.includes(query)
    );
  });

  res.json({
    success: true,
    query,
    count: matched.length,
    results: matched
  });
});

// GET /api/career/roadmaps - Get career paths & salary benchmarks
router.get('/career/roadmaps', (req, res) => {
  res.json({
    success: true,
    roadmaps: CAREER_ROADMAPS
  });
});

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// POST /api/auth/register - Register with Gmail/Email & Password
router.post('/auth/register', (req, res) => {
  const { name, email, password, targetRole } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(normalizedEmail)) {
    return res.status(400).json({ success: false, error: "Please enter a valid email address (e.g. name@gmail.com)." });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, error: "Password must be at least 6 characters long." });
  }

  if (USERS_DB.has(normalizedEmail)) {
    return res.status(409).json({ success: false, error: "An account with this email already exists. Please log in." });
  }

  const user = {
    id: "usr-" + Date.now(),
    name: name ? name.trim() : normalizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
    email: normalizedEmail,
    password: password, // In production, hash with bcrypt
    role: targetRole || "Full Stack Developer",
    avatar: "🎓",
    provider: normalizedEmail.endsWith("@gmail.com") ? "gmail" : "email",
    token: "jwt-token-" + Buffer.from(normalizedEmail + Date.now()).toString('base64'),
    joinedDate: new Date().toISOString().split('T')[0]
  };

  USERS_DB.set(normalizedEmail, user);
  USER_BOOKMARKS.set(user.email, new Set());
  USER_PRACTICE_LOG.set(user.email, []);

  // Return user without password
  const { password: _, ...userSafe } = user;
  res.status(201).json({
    success: true,
    message: "Registration successful! Welcome aboard.",
    user: userSafe
  });
});

// POST /api/auth/login - Log in with Email & Password
router.post('/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: "Email and password are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingUser = USERS_DB.get(normalizedEmail);

  if (!existingUser) {
    // Auto-create on demand for seamless experience or return credentials prompt
    const newUser = {
      id: "usr-" + Date.now(),
      name: normalizedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      email: normalizedEmail,
      password: password,
      role: "Software Engineer",
      avatar: "👨‍💻",
      provider: normalizedEmail.endsWith("@gmail.com") ? "gmail" : "email",
      token: "jwt-token-" + Buffer.from(normalizedEmail).toString('base64'),
      joinedDate: new Date().toISOString().split('T')[0]
    };
    USERS_DB.set(normalizedEmail, newUser);
    const { password: _, ...userSafe } = newUser;
    return res.json({
      success: true,
      message: "Welcome! New account registered and signed in.",
      user: userSafe
    });
  }

  if (existingUser.password && existingUser.password !== password) {
    return res.status(401).json({ success: false, error: "Incorrect password. Please try again." });
  }

  const { password: _, ...userSafe } = existingUser;
  res.json({
    success: true,
    message: "Welcome back!",
    user: userSafe
  });
});

// POST /api/auth/google - Direct 1-click Sign-In with Google
router.post('/auth/google', (req, res) => {
  const { email, name, avatar } = req.body;

  const googleEmail = (email || "google.candidate@gmail.com").toLowerCase().trim();
  let user = USERS_DB.get(googleEmail);

  if (!user) {
    user = {
      id: "usr-google-" + Date.now(),
      name: name || "Google Candidate",
      email: googleEmail,
      role: "Candidate",
      avatar: avatar || "🌐",
      provider: "google",
      token: "google-oauth-" + Buffer.from(googleEmail + Date.now()).toString('base64'),
      joinedDate: new Date().toISOString().split('T')[0]
    };
    USERS_DB.set(googleEmail, user);
  }

  const { password: _, ...userSafe } = user;
  res.json({
    success: true,
    message: "Google authentication successful!",
    user: userSafe
  });
});

// ==========================================
// DASHBOARD & BOOKMARKS ROUTES
// ==========================================

// POST /api/bookmarks/toggle - Bookmark or unbookmark a question
router.post('/bookmarks/toggle', (req, res) => {
  const { email, questionId } = req.body;
  if (!email || !questionId) {
    return res.status(400).json({ success: false, error: "Email and questionId are required." });
  }

  const normalizedEmail = email.toLowerCase().trim();
  if (!USER_BOOKMARKS.has(normalizedEmail)) {
    USER_BOOKMARKS.set(normalizedEmail, new Set());
  }

  const bookmarks = USER_BOOKMARKS.get(normalizedEmail);
  let isBookmarked = false;
  if (bookmarks.has(questionId)) {
    bookmarks.delete(questionId);
    isBookmarked = false;
  } else {
    bookmarks.add(questionId);
    isBookmarked = true;
  }

  res.json({
    success: true,
    isBookmarked,
    totalBookmarks: bookmarks.size,
    bookmarkedIds: Array.from(bookmarks)
  });
});

// GET /api/dashboard/stats - Retrieve user progress, stats, and saved questions
router.get('/dashboard/stats', (req, res) => {
  const email = (req.query.email || '').toLowerCase().trim();
  const bookmarksSet = USER_BOOKMARKS.get(email) || new Set();
  const bookmarkedQuestions = QUESTION_BANK.filter(q => bookmarksSet.has(q.id));

  // Compute topic breakdown
  const topicStats = TOPICS.filter(t => t.id !== 'all').map(t => {
    const totalInTopic = QUESTION_BANK.filter(q => q.topic === t.id).length;
    const bookmarkedInTopic = bookmarkedQuestions.filter(q => q.topic === t.id).length;
    return {
      topicId: t.id,
      topicName: t.name,
      icon: t.icon,
      color: t.color,
      totalQuestions: totalInTopic,
      bookmarked: bookmarkedInTopic,
      masteryPercentage: Math.min(100, Math.round(((bookmarkedInTopic + 1) / (totalInTopic || 1)) * 60))
    };
  });

  res.json({
    success: true,
    stats: {
      totalQuestionsInBank: QUESTION_BANK.length,
      topicsAvailable: TOPICS.length - 1,
      savedQuestionsCount: bookmarkedQuestions.length,
      readinessScore: Math.min(98, 65 + (bookmarkedQuestions.length * 4)),
      bookmarkedQuestions,
      topicStats
    }
  });
});

// POST /api/generate - Generate questions with topic & role support
router.post('/generate', async (req, res) => {
  try {
    const { role, topic, experienceLevel, category, difficulty, jdText, count } = req.body;

    const questions = await questionGenerator.generate({
      role: role || "Full Stack / Web Developer",
      topic: topic || "all",
      experienceLevel: experienceLevel || "entry",
      category: category || "all",
      difficulty: difficulty || "all",
      jdText: jdText || "",
      count: parseInt(count, 10) || 5
    });

    res.json({
      success: true,
      meta: {
        role,
        topic,
        experienceLevel,
        category,
        count: questions.length,
        hasJdContext: Boolean(jdText && jdText.trim().length > 0)
      },
      questions
    });
  } catch (error) {
    console.error("Question Generation Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to generate interview questions. Please try again."
    });
  }
});

// POST /api/evaluate - Evaluate candidate's answer
router.post('/evaluate', (req, res) => {
  try {
    const { question, answer, category, email } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: "Both question and answer are required for evaluation."
      });
    }

    const evaluation = answerEvaluator.evaluate({ question, answer, category });

    // Track in user practice history
    if (email) {
      const normalizedEmail = email.toLowerCase().trim();
      if (!USER_PRACTICE_LOG.has(normalizedEmail)) {
        USER_PRACTICE_LOG.set(normalizedEmail, []);
      }
      USER_PRACTICE_LOG.get(normalizedEmail).push({
        question,
        score: evaluation.score,
        date: new Date().toISOString()
      });
    }

    res.json({
      success: true,
      evaluation
    });
  } catch (error) {
    console.error("Answer Evaluation Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to evaluate answer."
    });
  }
});

// POST /api/export/markdown - Export questions with detailed blueprints and codes
router.post('/export/markdown', (req, res) => {
  try {
    const { questions, meta } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, error: "No questions to export." });
    }

    let md = `# Interview Preparation Sheet: ${meta?.role || meta?.topic || "Engineering Master Sheet"}\n\n`;
    md += `**Experience Level:** ${meta?.experienceLevel || "All"} | **Date:** ${new Date().toISOString().split('T')[0]}\n\n`;
    md += `---\n\n`;

    questions.forEach((q, index) => {
      md += `### Question ${index + 1}: ${q.question}\n\n`;
      md += `- **Topic:** \`${q.topicName || q.topic || 'General'}\` | **Difficulty:** \`${q.difficulty}\`\n`;
      if (q.tags && q.tags.length > 0) {
        md += `- **Tags:** ${q.tags.map(t => `\`${t}\``).join(', ')}\n`;
      }
      md += `\n**💡 Why the Interviewer Asks This:**\n> ${q.interviewerIntent}\n\n`;
      if (q.modelAnswer) {
        md += `**📖 In-Depth Model Answer:**\n${q.modelAnswer}\n\n`;
      }
      if (q.codeSnippet) {
        md += `**💻 Code / Syntax Example:**\n\`\`\`\n${q.codeSnippet}\n\`\`\`\n\n`;
      }
      if (q.complexity) {
        md += `**⏱️ Complexity / Performance:** ${q.complexity}\n\n`;
      }
      md += `**🎯 Key Points to Cover (Answer Blueprint):**\n${q.answerBlueprint}\n\n`;
      
      if (q.followUpQuestions && q.followUpQuestions.length > 0) {
        md += `**🔄 Likely Follow-Up Questions:**\n`;
        q.followUpQuestions.forEach(fu => {
          md += `- ${fu}\n`;
        });
        md += `\n`;
      }
      md += `---\n\n`;
    });

    res.json({
      success: true,
      markdown: md
    });
  } catch (error) {
    res.status(500).json({ success: false, error: "Markdown export failed." });
  }
});

// POST /api/resume/analyze - ATS Resume analysis & scoring
router.post('/resume/analyze', (req, res) => {
  try {
    const { resumeText, targetRole, jdText } = req.body;
    const result = resumeEvaluator.evaluate({ resumeText, targetRole, jdText });
    res.json(result);
  } catch (err) {
    console.error("Resume Evaluation Error:", err);
    res.status(500).json({ success: false, error: "Failed to analyze resume." });
  }
});

module.exports = router;
