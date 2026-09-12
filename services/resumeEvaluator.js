/**
 * AI & ATS Resume Evaluator Engine
 * Analyzes resumes against tech stack rubrics, action verb density,
 * quantifiable metrics, and ATS compatibility standards.
 */

class ResumeEvaluator {
  /**
   * Evaluates a candidate's resume text.
   * @param {Object} options
   * @param {string} options.resumeText - Full text of the resume
   * @param {string} [options.targetRole] - Target engineering role
   * @param {string} [options.jdText] - Optional Job Description text
   * @returns {Object} Evaluation report with score, breakdowns, matched/missing skills, and recommendations
   */
  evaluate({ resumeText, targetRole = "Full Stack / Web Developer", jdText = "" }) {
    if (!resumeText || resumeText.trim().length < 50) {
      return {
        success: false,
        error: "Resume text is too brief. Please paste at least 50 words of your resume to evaluate."
      };
    }

    const text = resumeText.trim();
    const lower = text.toLowerCase();
    const words = text.split(/\s+/).filter(w => w.length > 0);
    const wordCount = words.length;

    // 1. Core Section Detection
    const sections = {
      summary: /summary|profile|about me|objective/i.test(text),
      experience: /experience|employment|work history|career history/i.test(text),
      projects: /projects|portfolio|personal projects|key projects/i.test(text),
      skills: /skills|technical skills|technologies|proficiencies/i.test(text),
      education: /education|degree|university|college|b\.tech|b\.s|b\.e|m\.s/i.test(text)
    };

    let sectionScore = 0;
    Object.values(sections).forEach(present => {
      if (present) sectionScore += 20;
    });

    // 2. Action Verb Analysis
    const strongActionVerbs = [
      "architected", "engineered", "developed", "designed", "implemented", "deployed",
      "optimized", "accelerated", "reduced", "scaled", "automated", "streamlined",
      "built", "orchestrated", "refactored", "integrated", "spearheaded", "mentored",
      "migrated", "configured", "maintained", "collaborated", "published", "authored"
    ];

    const foundActionVerbs = strongActionVerbs.filter(verb => {
      const reg = new RegExp(`\\b${verb}\\b`, 'i');
      return reg.test(text);
    });

    const actionVerbScore = Math.min(100, Math.round((foundActionVerbs.length / 8) * 100));

    // 3. Metric & Quantifiable Outcome Detection
    const metricMatches = text.match(/\b\d+(\.\d+)?(%|k|x|ms|s|m|gb|tb|rps|users|req\/s|\+)?\b/gi) || [];
    const metricCount = metricMatches.filter(m => /\d/.test(m) && (/%|\+|\$|x|ms|k|users|million|thousand/i.test(m) || parseInt(m) > 10)).length;
    const metricScore = Math.min(100, Math.round((metricCount / 6) * 100));

    // 4. Tech Stack Keyword Matching across 12 disciplines
    const TECH_MAP = {
      "c": ["c programming", "c99", "c11", "pointers", "malloc", "embedded", "valgrind", "memory management"],
      "cpp": ["c++", "cpp", "smart pointers", "raii", "templates", "stl", "vtable", "oop"],
      "python": ["python", "django", "fastapi", "flask", "asyncio", "pandas", "numpy", "gil", "multiprocessing"],
      "java": ["java", "spring boot", "jvm", "multithreading", "hibernate", "microservices", "garbage collection"],
      "sql": ["sql", "postgresql", "joins", "indexing", "acid", "group by", "database design", "normalization"],
      "mysql": ["mysql", "innodb", "myisam", "explain", "replication", "query optimization"],
      "html": ["html", "html5", "semantic html", "accessibility", "a11y", "wcag", "aria"],
      "css": ["css", "css3", "flexbox", "grid", "responsive", "sass", "tailwind", "styled-components"],
      "javascript": ["javascript", "es6", "async/await", "promises", "event loop", "closures", "typescript"],
      "nodejs": ["node.js", "nodejs", "express", "libuv", "streams", "rest api", "backend"],
      "react": ["react", "react.js", "hooks", "virtual dom", "redux", "context api", "next.js", "jsx"],
      "ds": ["data structures", "algorithms", "arrays", "linked list", "trees", "graphs", "hash table", "big-o", "leetcode"]
    };

    // Find all present technologies
    const matchedTechs = [];
    const matchedKeywords = [];

    Object.entries(TECH_MAP).forEach(([techId, keywords]) => {
      const foundInTopic = keywords.filter(kw => {
        const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const reg = new RegExp(`\\b${escaped}\\b`, 'i');
        return reg.test(lower);
      });

      if (foundInTopic.length > 0) {
        matchedTechs.push(techId.toUpperCase());
        matchedKeywords.push(...foundInTopic);
      }
    });

    // 5. Recommended Core Engineering Competencies
    const coreRecommendations = ["JavaScript", "Python", "Java", "SQL", "React", "Node.js", "Docker", "Git", "Data Structures"];
    const missingSkills = coreRecommendations.filter(skill => {
      const normalized = skill.toLowerCase().replace(/[^a-z0-9]/g, '');
      return !lower.includes(normalized);
    });

    const techScore = Math.min(100, Math.round(((matchedKeywords.length) / 12) * 100));

    // 6. Fluff & Cliché Detection
    const fluffPhrases = [
      "hard worker", "team player", "out of the box", "go-getter", "self-motivated",
      "responsible for", "duties included", "detail-oriented", "passionate"
    ];
    const detectedFluff = fluffPhrases.filter(f => lower.includes(f));

    // 7. Calculate Overall ATS Readiness Score
    // Weightings: Tech Match (30%), Metrics (25%), Action Verbs (25%), Section Completeness (20%)
    const rawScore = (techScore * 0.30) + (metricScore * 0.25) + (actionVerbScore * 0.25) + (sectionScore * 0.20);
    const penalty = detectedFluff.length * 3;
    const finalScore = Math.max(25, Math.min(98, Math.round(rawScore - penalty)));

    let tier = "Standard Profile";
    let tierColor = "#f59e0b";
    let tierBadge = "⭐ Solid Foundation";

    if (finalScore >= 85) {
      tier = "Top 5% — High ATS Interview Passer";
      tierColor = "#10b981";
      tierBadge = "🏆 Interview-Ready / Exceptional";
    } else if (finalScore >= 70) {
      tier = "Competitive Candidate (Top 25%)";
      tierColor = "#6366f1";
      tierBadge = "🔥 Strong Candidate";
    } else {
      tier = "Needs Revision / ATS Bottlenecks Detected";
      tierColor = "#ef4444";
      tierBadge = "⚠️ Optimization Recommended";
    }

    // 8. Generate Specific, Actionable Recommendations (Role-Agnostic & Confidential)
    const recommendations = [];

    if (metricScore < 60) {
      recommendations.push("Quantify your project outcomes! Instead of saying 'Improved page speed', specify 'Reduced Largest Contentful Paint (LCP) by 38% for 200k monthly active users'.");
    }

    if (actionVerbScore < 60) {
      recommendations.push("Begin every experience bullet point with a decisive action verb (e.g. 'Architected', 'Engineered', 'Optimized') rather than passive phrasing like 'Assisted with' or 'Responsible for'.");
    }

    if (missingSkills.length > 0) {
      recommendations.push(`Consider highlighting hands-on experience with: ${missingSkills.slice(0, 3).join(', ')} to maximize ATS keyword alignment.`);
    }

    if (!sections.projects) {
      recommendations.push("Add a dedicated 'Projects' section featuring 2-3 production-grade applications with live demo URLs and GitHub repository links.");
    }

    if (detectedFluff.length > 0) {
      recommendations.push(`Remove overused clichés: Replace phrases like '${detectedFluff.slice(0, 2).join("', '")}' with tangible accomplishments and measurable metrics.`);
    }

    if (wordCount < 250) {
      recommendations.push("Your resume is brief (under 250 words). Aim for 350-500 words to provide adequate context for automated ATS keyword scanners.");
    } else if (wordCount > 900) {
      recommendations.push("Your resume exceeds 900 words. Keep it focused to 1-2 pages maximum by trimming older or less relevant responsibilities.");
    }

    return {
      success: true,
      score: finalScore,
      tier,
      tierColor,
      tierBadge,
      wordCount,
      rubric: {
        impactAndVerbs: actionVerbScore,
        techKeywordAlignment: techScore,
        quantifiedOutcomes: metricScore,
        atsStructure: sectionScore
      },
      sectionsFound: sections,
      matchedTechs: [...new Set(matchedTechs)],
      matchedKeywordsCount: matchedKeywords.length,
      missingSkills,
      detectedFluff,
      recommendations: recommendations.length > 0 ? recommendations : ["Your resume is well-structured and aligns strongly with engineering benchmarks!"]
    };
  }
}

module.exports = new ResumeEvaluator();
