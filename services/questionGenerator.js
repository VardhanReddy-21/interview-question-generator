const { QUESTION_BANK } = require('./questionBank');

/**
 * Intelligent Question Generator Engine
 * Supports role, topic, experience, category, and difficulty filtering with fallback synthesis.
 */
class QuestionGenerator {
  /**
   * Generates a curated or synthesized set of interview questions.
   * @param {Object} options
   * @param {string} [options.role] - Target job role
   * @param {string} [options.topic] - Specific topic (e.g. 'c', 'python', 'java', 'sql', 'mysql', 'cpp', 'html', 'css', 'javascript', 'nodejs', 'react', 'ds', or 'all')
   * @param {string} [options.experienceLevel='entry'] - 'entry', 'junior', 'mid', 'senior'
   * @param {string} [options.category='all'] - 'all', 'technical', 'behavioral', 'system-design', 'scenario'
   * @param {string} [options.difficulty='all'] - 'all', 'easy', 'medium', 'hard'
   * @param {string} [options.jdText=''] - Optional Job Description text
   * @param {number} [options.count=5] - Number of questions to return
   * @returns {Promise<Array>} Array of question objects
   */
  async generate({
    role = "Full Stack / Web Developer",
    topic = "all",
    experienceLevel = "entry",
    category = "all",
    difficulty = "all",
    jdText = "",
    count = 5
  }) {
    const jdKeywords = this.extractJdKeywords(jdText);
    let candidateQuestions = [...QUESTION_BANK];

    // 1. Topic filtering (if specified and not 'all')
    if (topic && topic !== "all") {
      const topicMatches = candidateQuestions.filter(q => q.topic === topic);
      if (topicMatches.length > 0) {
        candidateQuestions = topicMatches;
      }
    }

    // 2. Role filtering (if topic was not strictly matched)
    if (role && role !== "All" && (!topic || topic === "all")) {
      const normalizedRole = role.toLowerCase();
      const roleMatched = candidateQuestions.filter(q => {
        const qRole = (q.role || '').toLowerCase();
        const qTopicName = (q.topicName || '').toLowerCase();
        return (
          qRole.includes(normalizedRole) ||
          normalizedRole.includes(qRole) ||
          normalizedRole.includes(qTopicName) ||
          qTopicName.includes(normalizedRole)
        );
      });

      if (roleMatched.length > 0) {
        candidateQuestions = roleMatched;
      }
    }

    // 3. Category filter
    if (category && category !== "all") {
      const categoryFiltered = candidateQuestions.filter(q => q.category === category);
      if (categoryFiltered.length > 0) {
        candidateQuestions = categoryFiltered;
      }
    }

    // 4. Difficulty filter
    if (difficulty && difficulty !== "all") {
      const diffFiltered = candidateQuestions.filter(q => q.difficulty === difficulty);
      if (diffFiltered.length > 0) {
        candidateQuestions = diffFiltered;
      }
    }

    // 5. Score and rank candidates based on experience level and JD keywords
    const scoredQuestions = candidateQuestions.map(q => {
      let score = 1;
      if (q.experienceLevel === experienceLevel) score += 3;
      
      // Bonus if tags match JD keywords
      if (jdKeywords.length > 0 && q.tags) {
        const matchingTags = q.tags.filter(tag =>
          jdKeywords.some(kw => kw.toLowerCase() === tag.toLowerCase())
        );
        score += matchingTags.length * 3;
      }

      // Bonus if topic matches role
      if (role && q.topicName && role.toLowerCase().includes(q.topicName.toLowerCase())) {
        score += 2;
      }

      return { ...q, relevanceScore: score };
    });

    // Sort by relevance score descending, then shuffle slightly for variety
    scoredQuestions.sort((a, b) => b.relevanceScore - a.relevanceScore);

    let results = scoredQuestions.slice(0, count);

    // 6. Synthesize dynamic questions from JD if needed
    if (results.length < count && jdKeywords.length > 0) {
      const synthesized = this.synthesizeFromJd(jdKeywords, role, experienceLevel, count - results.length);
      results = results.concat(synthesized);
    }

    // 7. Fallback to general question bank items if still short
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
      "c", "c++", "cpp", "python", "java", "sql", "mysql", "html", "css", "javascript", "node.js", "nodejs",
      "react", "ds", "data structures", "algorithms", "mongodb", "postgresql", "docker", "kubernetes",
      "aws", "git", "ci/cd", "rest", "graphql", "accessibility", "wcag", "aria", "testing", "jest",
      "spring boot", "fastapi", "django", "express", "redis", "linux", "concurrency", "oop"
    ];

    const lower = text.toLowerCase();
    return commonTechTerms.filter(term => {
      const regex = new RegExp(`\\b${term.replace('.', '\\.')}\\b`, 'i');
      return regex.test(lower);
    });
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
        topic: "all",
        topicName: capitalized,
        role: role,
        category: "technical",
        difficulty: experienceLevel === "senior" ? "hard" : "medium",
        experienceLevel: experienceLevel,
        question: `How have you used ${capitalized} in production to solve a mission-critical engineering requirement? What performance trade-offs did you evaluate?`,
        modelAnswer: `In production environments, ${capitalized} is utilized to address core architectural challenges around throughput, latency, maintainability, and scalability.\n\nWhen implementing ${capitalized}, experienced engineers evaluate:\n1. **Design & Separation of Concerns:** Establishing modular boundaries and defensive error handling.\n2. **Resource & Memory Management:** Avoiding memory leaks, connection pool exhaustion, or CPU thread contention.\n3. **Monitoring & Resiliency:** Implementing logging, metrics (p99 latency), and automated fallback strategies.`,
        interviewerIntent: `Probes practical, hands-on production depth with ${capitalized}, evaluating trade-offs, architecture decisions, and failure management.`,
        answerBlueprint: `Structure with STAR: 1) Specify the business context where ${capitalized} was selected. 2) Detail the exact technical constraints. 3) Describe your specific implementation decisions. 4) Quantify measurable improvements (speed, stability, cost).`,
        codeSnippet: `// Example: Production ${capitalized} Implementation Pattern\n// Always validate inputs, handle edge cases, and log unexpected failures.\nfunction process${capitalized.replace(/[^a-zA-Z0-9]/g, '')}Task(payload) {\n    if (!payload) throw new Error("Invalid payload");\n    console.log("Executing ${capitalized} task with metrics tracking...");\n    return { success: true, timestamp: Date.now() };\n}`,
        complexity: "Time: O(N) optimized | Space: O(1) bounded resource usage",
        commonMistakes: `Focusing purely on textbook theory of ${capitalized} rather than discussing real-world production trade-offs and edge cases.`,
        followUpQuestions: [
          `What are the known failure modes or bottlenecks when scaling ${capitalized}?`,
          `How did you monitor and debug performance issues with ${capitalized} under high load?`
        ],
        tags: [capitalized, "JD-Tailored", "Architecture", "Hands-on"],
        relevanceScore: 10
      });
    });

    return dynamicList;
  }
}

module.exports = new QuestionGenerator();
