# InterviewIQ — Interview Question Generator & Practice Studio

An end-to-end full-stack web application designed to help candidates prepare for software engineering, web development, AI/ML, and system design interviews. It features an intelligent question generation engine, interviewer intent breakdowns, answer blueprints, follow-up probes, and real-time response grading.

---

## 🌟 Key Features

1. **Role-Tailored Generation:**
   - Pre-configured tracks for **Full Stack Developers**, **Python Developers**, **AI / ML Engineers**, **Web Accessibility Engineers**, **Backend / Frontend Engineers**, and custom roles.
   - Seniority adaptation across **Fresh Graduate / Entry-Level (0–1 YOE)**, **Junior (1–3 YOE)**, **Mid-Level (3–5 YOE)**, and **Senior / Lead (5+ YOE)**.

2. **Categorized Tracks:**
   - 💻 **Technical Core & Deep-dive:** Concurrency, event loop, memory management, algorithmic trade-offs.
   - 🧠 **Behavioral & Leadership (STAR Method):** Conflict resolution, deadline pressure, technical disagreement.
   - 📐 **System Design & Scalability:** REST API design, caching, database indexing, latency mitigation.
   - ⚡ **Scenario & Problem Solving:** Real-world production incidents, memory-constrained processing.

3. **Interviewer Intent & Answer Blueprints:**
   - **Interviewer's Secret Intent:** Explains *why* the interviewer is asking this question and what red flags they are screening for.
   - **Ideal Answer Blueprint:** Gives step-by-step key talking points, technical mechanisms, and STAR structure.
   - **Likely Follow-Up Probes:** Anticipates deeper follow-up questions an interviewer will ask.

4. **Interactive Practice Studio & Instant Evaluator:**
   - Type your answer in the practice box.
   - Click **Evaluate My Answer** to receive an instant analysis:
     - Numerical score out of 10.
     - Word count & depth check.
     - STAR format detection (Situation, Task, Action, Result).
     - Technical specificity and metric grounding check.
     - Constructive feedback on strengths and improvement areas.

5. **Job Description (JD) Synthesizer:**
   - Paste any raw Job Description text to dynamically extract required skills and synthesize bespoke interview questions.

6. **Export & Portability:**
   - One-click export to **Markdown (.md)** for offline study.
   - One-click copy to clipboard.
   - Clean printable layout / PDF export via browser print (`Ctrl+P` or Print button).

---

## 🏗️ Architecture & Tech Stack

```
interview-question-generator/
├── public/                       # Frontend SPA (Vanilla JS + HTML5 + Modern CSS)
│   ├── index.html                # App UI structure & controls
│   ├── style.css                 # Dark theme, glassmorphism, responsive grid
│   └── app.js                    # Client-side controller & API client
├── routes/
│   └── api.js                    # REST API Endpoints (/generate, /evaluate, /roles)
├── services/
│   ├── questionGenerator.js      # Core synthesis & JD keyword extraction engine
│   ├── questionBank.js           # Curated technical & behavioral knowledge base
│   └── answerEvaluator.js        # Rubric-based answer evaluation service
├── server.js                     # Express server & middleware setup
├── package.json                  # Dependencies & start scripts
└── .env.example                  # Environment configuration
```

### **Backend:**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Middleware:** CORS, JSON body-parser, Dotenv
- **Zero Heavy External Dependencies:** Runs 100% locally and offline out-of-the-box.

### **Frontend:**
- **Modern Vanilla Web Technologies:** Semantic HTML5, Modular JavaScript (ES6+), CSS3 Grid & Flexbox.
- **Typography:** Plus Jakarta Sans & JetBrains Mono.
- **Design System:** Dark glassmorphic aesthetic with high-contrast cyan/indigo accents.

---

## 🚀 How to Run the Application

### 1. Install Dependencies
Open your terminal in the `interview-question-generator` directory:

```bash
cd interview-question-generator
npm install
```

*(Note: `express`, `cors`, and `dotenv` are the only lightweight dependencies needed!)*

### 2. Start the Server
```bash
npm start
```

For development mode with auto-reload:
```bash
npm run dev
```

### 3. Open in Browser
Visit:
```
http://localhost:3000
```

---

## 📡 REST API Documentation

### 1. `GET /api/roles`
Returns all supported roles, categories, and experience levels.

### 2. `POST /api/generate`
Generates questions matching the provided criteria.
**Payload:**
```json
{
  "role": "Full Stack / Web Developer",
  "experienceLevel": "entry",
  "category": "technical",
  "difficulty": "medium",
  "count": 5,
  "jdText": ""
}
```

### 3. `POST /api/evaluate`
Analyzes a candidate's practice response.
**Payload:**
```json
{
  "question": "How does the browser event loop work in JavaScript?",
  "answer": "JavaScript is single-threaded...",
  "category": "technical"
}
```
**Response:**
```json
{
  "success": true,
  "evaluation": {
    "score": 8,
    "verdict": "Interview-Ready / Strong Answer",
    "wordCount": 142,
    "strengths": ["Good pacing and concise length", "Includes quantifiable metrics"],
    "improvements": [],
    "nextStepSuggestion": "Try rehearsing this aloud to ensure fluid spoken delivery."
  }
}
```

### 4. `POST /api/export/markdown`
Converts question list into clean GitHub-flavored markdown.

---

## 📄 License
MIT License. Created by Yelty Vardhan Reddy.
