/**
 * Answer Evaluator Service
 * Analyzes candidate practice responses against interview quality rubrics.
 */

class AnswerEvaluator {
  /**
   * Evaluate a candidate's answer for a given question.
   * @param {Object} params
   * @param {string} params.question - The question being answered
   * @param {string} params.answer - The user's submitted response
   * @param {string} params.category - 'technical', 'behavioral', etc.
   * @returns {Object} Evaluation report with score, strengths, and feedback
   */
  evaluate({ question, answer, category = "technical" }) {
    if (!answer || answer.trim().length === 0) {
      return {
        score: 0,
        verdict: "No Answer Provided",
        feedback: "Please provide a written response to receive constructive feedback."
      };
    }

    const trimmed = answer.trim();
    const wordCount = trimmed.split(/\s+/).length;
    const lower = trimmed.toLowerCase();

    let score = 5; // Base score
    const strengths = [];
    const improvements = [];

    // 1. Length & Depth Check
    if (wordCount < 40) {
      score -= 2;
      improvements.push("Your answer is too brief. Aim for at least 100-200 words to demonstrate depth, context, and clear reasoning.");
    } else if (wordCount >= 100 && wordCount <= 350) {
      score += 2;
      strengths.push("Good pacing and concise length — thorough without rambling.");
    } else if (wordCount > 500) {
      improvements.push("Your response is quite long. In an actual interview, keep initial responses under 2-3 minutes (approx. 250-350 words) to avoid losing the interviewer's attention.");
    }

    // 2. Behavioral STAR Structure Check
    if (category === "behavioral" || question.toLowerCase().includes("tell me about") || question.toLowerCase().includes("describe a time")) {
      const hasSituation = lower.includes("when") || lower.includes("at") || lower.includes("project") || lower.includes("company");
      const hasAction = lower.includes("i decided") || lower.includes("i built") || lower.includes("i analyzed") || lower.includes("i implemented") || lower.includes("i resolved");
      const hasResult = lower.includes("result") || lower.includes("achieved") || lower.includes("outcome") || lower.includes("reduced") || lower.includes("improved") || lower.includes("learned");

      if (hasSituation && hasAction && hasResult) {
        score += 2;
        strengths.push("Follows clear STAR structure (Situation -> Task -> Action -> Result).");
      } else {
        if (!hasResult) improvements.push("Missing a clear Result or quantifiable outcome: explicitly state what happened after your actions and what lesson was learned.");
        if (!hasAction) improvements.push("Focus more on 'I' actions rather than 'We': interviewers want to know specifically what YOU contributed.");
      }
    }

    // 3. Technical Specificity & Metric Grounding
    const containsNumbers = /\d+/.test(trimmed);
    if (containsNumbers) {
      score += 1;
      strengths.push("Includes quantifiable metrics or concrete parameters, which adds high credibility.");
    } else {
      improvements.push("Consider adding concrete metrics (e.g., latency reduction %, team size, dataset size, error rate drop).");
    }

    // 4. Overused Fluff Detection
    const fluffPhrases = ["i am passionate about", "i always give 110%", "i am a perfectionist", "to be honest"];
    const detectedFluff = fluffPhrases.filter(f => lower.includes(f));
    if (detectedFluff.length > 0) {
      score -= 1;
      improvements.push(`Avoid cliché phrases like "${detectedFluff.join(', ')}"; let your concrete engineering work and proof points speak for themselves.`);
    }

    // Normalize score between 1 and 10
    const finalScore = Math.max(1, Math.min(10, score));

    let verdict = "Solid Foundation";
    if (finalScore >= 8) verdict = "Interview-Ready / Strong Answer";
    else if (finalScore <= 4) verdict = "Needs Revision";

    return {
      score: finalScore,
      verdict,
      wordCount,
      strengths: strengths.length > 0 ? strengths : ["Communicates the general concept clearly."],
      improvements: improvements.length > 0 ? improvements : ["Continue practicing delivery under real-time pacing."],
      nextStepSuggestion: finalScore < 7 
        ? "Structure your answer: 1) One-line thesis, 2) Technical mechanism / Action taken, 3) Measurable outcome & reflection."
        : "Excellent answer. Try rehearsing this aloud to ensure fluid spoken delivery."
    };
  }
}

module.exports = new AnswerEvaluator();
