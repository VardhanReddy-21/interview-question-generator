const { QUESTION_BANK, SUPPORTED_ROLES } = require('./questionBank');

/**
 * Intelligent Question Generator Engine
 */

class QuestionGenerator {
  /**
   * Generates a curated or synthesized set of interview questions.
   * @param {Object} options
   * @param {string} options.role - Target job role
   * @param {string} options.experienceLevel - 'entry', 'junior', 'mid', 'senior'
   * @param {string} options.category - 'all', 'technical', 'behavioral', 'system-design', 'scenario'
   * @param {string} options.difficulty - 'all', 'easy', 'medium', 'hard'
   * @param {string} [options.jdText] - Optional Job Description text
   * @param {number} [options.count=5] - Number of questions to return
   * @returns {Promise<Array>} Array of question objects
   */
  async generate({
    role = "Full Stack / Web Developer",
    experienceLevel = "entry",
    category = "all",
    difficulty = "all",
    jdText = "",
    count = 5
  }) {
    // 1. Analyze JD if provided
    const jdKeywords = this.extractJdKeywords(jdText);

    // 2. Filter from curated question bank
    let candidateQuestions = [...QUESTION_BANK];

    // Role filtering (fuzzy match)
    const normalizedRole = role.toLowerCase();
    const roleMatched = candidateQuestions.filter(q => {
      const qRole = q.role.toLowerCase();
      return (
        qRole.includes(normalizedRole) ||
        normalizedRole.includes(qRole) ||
        q.role === "General Engineering / Software Engineer"
      );
    });

    if (roleMatched.length > 0) {
      candidateQuestions = roleMatched;
    }

    // Category filter
    if (category && category !== "all") {
      const categoryFiltered = candidateQuestions.filter(q => q.category === category);
      if (categoryFiltered.length > 0) {
        candidateQuestions = categoryFiltered;
      }
    }

    // Difficulty filter
    if (difficulty && difficulty !== "all") {
      const diffFiltered = candidateQuestions.filter(q => q.difficulty === difficulty);
      if (diffFiltered.length > 0) {
        candidateQuestions = diffFiltered;
      }
    }

    // Score and rank candidates based on JD relevance and experience level
    const scoredQuestions = candidateQuestions.map(q => {
      let score = 1;
      if (q.experienceLevel === experienceLevel) score += 2;
      
      // Bonus if tags match JD keywords
      if (jdKeywords.length > 0 && q.tags) {
        const matchingTags = q.tags.filter(tag =>
          jdKeywords.some(kw => kw.toLowerCase() === tag.toLowerCase())
        );
        score += matchingTags.length * 3;
      }
      return { ...q, relevanceScore: score };
    });

    scoredQuestions.sort((a, b) => b.relevanceScore - a.relevanceScore);

    // Take top count
    let results = scoredQuestions.slice(0, count);

    // If fewer than requested count or custom JD provided, synthesize dynamic questions
    if (results.length < count && jdKeywords.length > 0) {
      const synthesized = this.synthesizeFromJd(jdKeywords, role, experienceLevel, count - results.length);
      results = results.concat(synthesized);
    }

    // If still fewer, fill with general software engineering questions
    if (results.length < count) {
      const remaining = QUESTION_BANK.filter(q => !results.some(r => r.id === q.id)).slice(0, count - results.length);
      results = results.concat(remaining);
    }

    return results.slice(0, count);
  }

  /**
   * Extract meaningful technical and domain keywords from JD text.
   */
  extractJdKeywords(text) {
    if (!text || typeof text !== "string") return [];
    
    const commonTechTerms = [
      "python", "javascript", "node.js", "react", "html", "css", "mysql", "sql", "nosql",
      "mongodb", "postgresql", "docker", "kubernetes", "aws", "azure", "git", "ci/cd",
      "rest", "graphql", "accessibility", "wcag", "aria", "voiceover", "testing", "selenium",
      "jest", "nlp", "machine learning", "scikit-learn", "pandas", "numpy", "tensorflow",
      "pytorch", "security", "microservices", "redis", "fastapi", "django", "flask", "c++", "c#"
    ];

    const lower = text.toLowerCase();
    return commonTechTerms.filter(term => lower.includes(term));
  }

  /**
   * Synthesize tailored questions directly from identified JD keywords.
   */
  synthesizeFromJd(keywords, role, experienceLevel, countNeeded) {
    const dynamicList = [];

    keywords.forEach((keyword, idx) => {
      if (dynamicList.length >= countNeeded) return;

      const capitalized = keyword.charAt(0).toUpperCase() + keyword.slice(1);
      dynamicList.push({
        id: `synth-${Date.now()}-${idx}`,
        role: role,
        category: "technical",
        difficulty: experienceLevel === "senior" ? "hard" : "medium",
        experienceLevel: experienceLevel,
        question: `How have you used ${capitalized} in your previous projects to solve a complex engineering or architectural requirement? What trade-offs did you evaluate?`,
        interviewerIntent: `Probes practical, hands-on production depth with ${capitalized}, going beyond textbook definitions into real-world trade-offs and decision making.`,
        answerBlueprint: `Structure with STAR: Specify the project context where ${capitalized} was selected, the exact implementation challenges (concurrency, throughput, data consistency), alternatives considered, and measurable outcomes achieved.`,
        followUpQuestions: [
          `What are the known failure modes or scaling bottlenecks when using ${capitalized}?`,
          `How did you monitor and debug performance issues with ${capitalized} in production?`
        ],
        tags: [capitalized, "JD-Tailored", "Architecture", "Hands-on"],
        relevanceScore: 10
      });
    });

    return dynamicList;
  }
}

module.exports = new QuestionGenerator();
