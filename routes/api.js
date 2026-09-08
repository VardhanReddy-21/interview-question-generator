const express = require('express');
const router = express.Router();
const questionGenerator = require('../services/questionGenerator');
const answerEvaluator = require('../services/answerEvaluator');
const { TOPICS, QUESTION_BANK, CAREER_ROADMAPS } = require('../services/questionBank');

// GET /api/roles - List supported roles
router.get('/roles', (req, res) => {
  const roles = [
    "Full Stack / Web Developer",
    "Python Developer",
    "AI / ML Engineer",
    "Web Accessibility Engineer",
    "Frontend Engineer",
    "Backend Engineer",
    "QA / Test Automation Engineer",
    "General Engineering / Software Engineer"
  ];

  res.json({
    success: true,
    roles,
    categories: [
      { id: "all", label: "🎯 Mixed Mock Interview (Recommended)" },
      { id: "technical", label: "💻 Technical & Core CS" },
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

// GET /api/topics - List all topics with count
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

  const topicMeta = TOPICS.find(t => t.id === topicId) || { id: topicId, name: "Topic", icon: "📌" };

  res.json({
    success: true,
    topic: topicMeta,
    count: items.length,
    questions: items
  });
});

// GET /api/search - Search across questions, answers, and tags
router.get('/search', (req, res) => {
  const query = (req.query.q || '').trim().toLowerCase();

  if (!query) {
    return res.json({
      success: true,
      query: "",
      count: 0,
      results: []
    });
  }

  const matched = QUESTION_BANK.filter(q => {
    const qText = (q.question || '').toLowerCase();
    const aText = (q.modelAnswer || '').toLowerCase();
    const intentText = (q.interviewerIntent || '').toLowerCase();
    const tagsText = (q.tags || []).join(' ').toLowerCase();
    const topicText = (q.topicName || '').toLowerCase();

    return (
      qText.includes(query) ||
      aText.includes(query) ||
      intentText.includes(query) ||
      tagsText.includes(query) ||
      topicText.includes(query)
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

// POST /api/auth/login - Authentication endpoint (handles demo accounts & local profiles)
router.post('/auth/login', (req, res) => {
  const { email, password, name } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: "Email is required." });
  }

  // Generate mock user profile
  const user = {
    id: "usr-" + Date.now(),
    name: name || (email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase())),
    email: email.toLowerCase().trim(),
    role: "Candidate",
    avatar: "👨‍💻",
    token: "mock-jwt-token-" + Buffer.from(email).toString('base64'),
    joinedDate: new Date().toISOString().split('T')[0]
  };

  res.json({
    success: true,
    message: "Login successful",
    user
  });
});

// POST /api/generate - Generate questions
router.post('/generate', async (req, res) => {
  try {
    const { role, experienceLevel, category, difficulty, jdText, count } = req.body;

    const questions = await questionGenerator.generate({
      role: role || "Full Stack / Web Developer",
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

// POST /api/evaluate - Evaluate a candidate's answer
router.post('/evaluate', (req, res) => {
  try {
    const { question, answer, category } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: "Both question and answer are required for evaluation."
      });
    }

    const evaluation = answerEvaluator.evaluate({ question, answer, category });

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

// POST /api/export/markdown - Export question set to markdown string
router.post('/export/markdown', (req, res) => {
  try {
    const { questions, meta } = req.body;

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ success: false, error: "No questions to export." });
    }

    let md = `# Interview Preparation Sheet: ${meta?.role || "Engineering Role"}\n\n`;
    md += `**Experience Level:** ${meta?.experienceLevel || "All"} | **Date:** ${new Date().toISOString().split('T')[0]}\n\n`;
    md += `---\n\n`;

    questions.forEach((q, index) => {
      md += `### Question ${index + 1}: ${q.question}\n\n`;
      md += `- **Topic:** \`${q.topicName || q.topic || 'General'}\` | **Category:** \`${q.category}\` | **Difficulty:** \`${q.difficulty}\`\n`;
      if (q.tags && q.tags.length > 0) {
        md += `- **Tags:** ${q.tags.map(t => `\`${t}\``).join(', ')}\n`;
      }
      md += `\n**💡 Why the Interviewer Asks This:**\n> ${q.interviewerIntent}\n\n`;
      if (q.modelAnswer) {
        md += `**📖 Model Answer:**\n${q.modelAnswer}\n\n`;
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

module.exports = router;
