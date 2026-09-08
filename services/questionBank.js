/**
 * Comprehensive Knowledge Base of Interview Questions & Answers across Topics, Roles, and Seniority Levels.
 */

const TOPICS = [
  { id: "all", name: "All Topics", icon: "🌐", description: "Comprehensive collection across all disciplines" },
  { id: "javascript", name: "JavaScript & Web", icon: "⚡", description: "Event loop, closures, DOM, promises, ES6+, async architecture" },
  { id: "python", name: "Python Core & Backend", icon: "🐍", description: "Memory management, GIL, generators, decorators, multiprocessing" },
  { id: "ml-ai", name: "Machine Learning & NLP", icon: "🤖", description: "NLP pipelines, TF-IDF, classification, embeddings, model evaluation" },
  { id: "sql-databases", name: "Databases & SQL", icon: "💾", description: "ACID transactions, MySQL, indexing, schema design, normalization" },
  { id: "system-design", name: "System Design", icon: "📐", description: "Scalability, caching with Redis, rate limiting, REST APIs, microservices" },
  { id: "accessibility", name: "Web Accessibility (a11y)", icon: "♿", description: "WCAG 2.x, WAI-ARIA, focus management, screen readers, semantic HTML" },
  { id: "behavioral", name: "Behavioral & STAR", icon: "🧠", description: "Conflict resolution, leadership, deadline challenges, team collaboration" }
];

const QUESTION_BANK = [
  // ==========================================
  // JAVASCRIPT & WEB DEVELOPMENT
  // ==========================================
  {
    id: "js-01",
    topic: "javascript",
    topicName: "JavaScript & Web",
    role: "Full Stack / Web Developer",
    category: "technical",
    difficulty: "easy",
    experienceLevel: "entry",
    question: "How does the browser event loop work in JavaScript, and what is the difference between the call stack, microtask queue, and macrotask queue?",
    modelAnswer: `JavaScript is single-threaded, meaning it has one call stack and executes one piece of code at a time. The Event Loop enables non-blocking asynchronous execution:

1. **Call Stack:** Executes synchronous functions in LIFO order (Last In, First Out).
2. **Web APIs / Node APIs:** Handles background timers (setTimeout), HTTP requests (fetch), and DOM events. Once completed, their callbacks are pushed to the task queues.
3. **Microtask Queue:** Holds callbacks from Promises (.then, .catch, .finally), queueMicrotask(), and MutationObserver (or process.nextTick in Node.js).
4. **Macrotask Queue (Task Queue):** Holds callbacks from setTimeout, setInterval, setImmediate, and I/O events.

**Priority Rule:** When the Call Stack becomes empty, the Event Loop *completely drains the Microtask Queue* before picking the single next task from the Macrotask Queue. This is why Promise callbacks always execute before setTimeout(..., 0).`,
    interviewerIntent: "Evaluates whether the candidate truly understands JavaScript concurrency and asynchronous execution, rather than just copying async/await syntax.",
    answerBlueprint: "Explain single-threaded execution, Call Stack, Web APIs, Microtask Queue (Promises), and Macrotask Queue (setTimeout). Emphasize that microtasks drain completely before the next macrotask is picked up.",
    followUpQuestions: [
      "What happens if a microtask recursively spawns another microtask?",
      "How does process.nextTick in Node.js differ from Promise.resolve()?"
    ],
    tags: ["JavaScript", "Async", "Event Loop", "Core CS"]
  },
  {
    id: "js-02",
    topic: "javascript",
    topicName: "JavaScript & Web",
    role: "Full Stack / Web Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What are JavaScript Closures, how do they work in memory, and what is a practical real-world use case for them?",
    modelAnswer: `A **closure** is the combination of a function bundled together (enclosed) with references to its surrounding state (the lexical environment). In JavaScript, every inner function retains access to variables declared in its outer enclosing scope, even after the outer function has finished executing and returned.

**Memory Mechanism:** Normally, a function's local variables are allocated on the call stack and garbage-collected when the function finishes. With closures, if an inner function outlives the outer function (e.g. returned or passed as callback), the JavaScript engine retains the outer lexical environment in heap memory.

**Practical Use Cases:**
1. **Data Privacy / Encapsulation:** Creating private state that cannot be modified directly from outside.
2. **Function Factories:** Creating specialized functions (e.g., multiplier(2)).
3. **Event Handlers & Currying:** Preserving state across asynchronous callbacks and debounce/throttle utilities.`,
    interviewerIntent: "Checks deep comprehension of scope chains, lexical environment retention in heap memory, and functional programming patterns in JavaScript.",
    answerBlueprint: "Define closure as function + lexical environment. Explain how outer scope variables remain accessible in memory. Provide a concrete example: data privacy or a debounce/memoize utility.",
    followUpQuestions: [
      "Can closures cause memory leaks, and how do you prevent them?",
      "How did closures help before ES6 'let' and 'const' blocked scope in loops?"
    ],
    tags: ["JavaScript", "Closures", "Memory", "Scope"]
  },

  // ==========================================
  // PYTHON CORE & BACKEND
  // ==========================================
  {
    id: "py-01",
    topic: "python",
    topicName: "Python Core & Backend",
    role: "Python Developer",
    category: "technical",
    difficulty: "easy",
    experienceLevel: "entry",
    question: "What is the Global Interpreter Lock (GIL) in CPython, and how does it impact multi-threaded versus multi-process applications?",
    modelAnswer: `The **Global Interpreter Lock (GIL)** is a mutual exclusion lock (mutex) used by CPython (the standard reference implementation of Python) to prevent multiple native OS threads from executing Python bytecodes simultaneously.

**Why it exists:** CPython uses reference counting for memory management. Without the GIL, concurrent threads could race to increment or decrement reference counters, causing memory leaks or premature deallocation of live objects.

**Impact on Applications:**
- **CPU-Bound Tasks (e.g., image processing, heavy mathematical operations):** Multi-threading provides NO speedup in Python because threads compete for the GIL. For CPU-bound speedup, developers must use the \`multiprocessing\` module (which spawns separate OS processes with independent memory spaces) or C extensions (like NumPy).
- **I/O-Bound Tasks (e.g., network API calls, database queries, reading disk files):** Multi-threading or \`asyncio\` is highly effective because Python releases the GIL whenever a thread blocks on an I/O system call.`,
    interviewerIntent: "Checks deep comprehension of Python's runtime memory management and concurrency mechanisms.",
    answerBlueprint: "Explain that the GIL is a mutex protecting reference counting. State that CPU-bound tasks require multiprocessing or C-extensions, while I/O-bound tasks benefit from threading or asyncio.",
    followUpQuestions: [
      "How has Python 3.13 free-threaded mode (PEP 703) addressed this?",
      "When would you prefer asyncio over the threading module?"
    ],
    tags: ["Python", "GIL", "Concurrency", "Memory Management"]
  },
  {
    id: "py-02",
    topic: "python",
    topicName: "Python Core & Backend",
    role: "Python Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "What are Python Decorators and Generators? How do they promote clean, memory-efficient code?",
    modelAnswer: `**Decorators:**
A decorator is a design pattern in Python used to extend or modify the behavior of a function or class without permanently modifying its source code. In Python, functions are first-class citizens. A decorator is a higher-order function that takes another function as an argument, defines a wrapper function, and returns the wrapper.
*Example use cases:* Authentication checks in Flask/FastAPI, logging, execution timing, and caching (\`@functools.lru_cache\`).

**Generators:**
A generator is a function that returns an iterator object producing a sequence of values lazily on demand using the \`yield\` keyword instead of \`return\`.
*Memory Efficiency:* Unlike a standard list that stores all elements in RAM simultaneously (O(N) memory), a generator computes each element on the fly and maintains only its internal execution state (O(1) memory). This makes generators indispensable when reading multi-gigabyte log files or infinite streams.`,
    interviewerIntent: "Validates functional programming concepts in Python, closures, memory efficiency, and lazy evaluation.",
    answerBlueprint: "Define decorators as higher-order functions wrapping another function using functools.wraps. Explain generators yield items lazily to save memory (O(1) space).",
    followUpQuestions: [
      "What is the difference between functools.lru_cache and a simple dict memoization?",
      "How do generator expressions handle stop iteration under the hood?"
    ],
    tags: ["Python", "Decorators", "Generators", "Clean Code"]
  },

  // ==========================================
  // MACHINE LEARNING & NLP
  // ==========================================
  {
    id: "ml-01",
    topic: "ml-ai",
    topicName: "Machine Learning & NLP",
    role: "AI / ML Engineer",
    category: "technical",
    difficulty: "easy",
    experienceLevel: "entry",
    question: "Explain the steps in an NLP text classification pipeline. How does TF-IDF vectorization work, and what are its limitations compared to word embeddings?",
    modelAnswer: `An end-to-end NLP text classification pipeline consists of 5 core stages:

1. **Text Preprocessing:** Cleaning (removing HTML/special characters), lowercasing, tokenization (splitting text into individual words), stop-word removal ('the', 'is'), and lemmatization/stemming.
2. **Feature Extraction (Vectorization):** Converting raw strings into numerical vectors.
   - **TF (Term Frequency):** Frequency of word $t$ in document $d$: $TF(t, d) = \\frac{\\text{count}(t, d)}{\\text{total words in } d}$.
   - **IDF (Inverse Document Frequency):** Penalizes words common across all documents: $IDF(t) = \\log\\left(\\frac{N}{DF(t)}\\right)$.
   - **TF-IDF:** Multiplies $TF \\times IDF$. Words that appear frequently in a specific article but rarely across the whole corpus receive the highest weights.
3. **Model Selection & Training:** Training a classifier such as Logistic Regression, Naive Bayes, or Support Vector Machines (SVM).
4. **Evaluation:** Assessing performance using Precision, Recall, F1-Score, and Confusion Matrix (accuracy alone is deceptive if classes are imbalanced).

**Limitations of TF-IDF vs. Dense Embeddings:**
- **Sparse High-Dimensional Vectors:** Vocabulary sizes create huge, mostly zero vectors.
- **No Semantic Context:** 'Car' and 'automobile' are treated as completely unrelated independent features.
- **Ignores Word Order:** 'Not good, bad' and 'Not bad, good' yield identical TF-IDF bags of words, whereas modern transformers (BERT/GPT) encode directional syntax and semantic similarity.`,
    interviewerIntent: "Evaluates NLP fundamentals: preprocessing, statistical feature extraction vs dense representation, and evaluation metrics.",
    answerBlueprint: "Break down: Raw text -> Preprocessing -> TF-IDF (Term Frequency * Inverse Document Frequency) -> Classifier training -> Evaluation. Explain that TF-IDF lacks semantic context and word order compared to embeddings.",
    followUpQuestions: [
      "How do you handle class imbalance in text datasets?",
      "When is precision more critical than recall in an ML production system?"
    ],
    tags: ["NLP", "Machine Learning", "TF-IDF", "Scikit-Learn"]
  },
  {
    id: "ml-02",
    topic: "ml-ai",
    topicName: "Machine Learning & NLP",
    role: "AI / ML Engineer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "Explain the Bias-Variance tradeoff. If your ML model gets 98% training accuracy but only 65% validation accuracy, what is happening and how do you fix it?",
    modelAnswer: `The **Bias-Variance Tradeoff** represents the tension between two fundamental sources of error in predictive models:

- **Bias (Underfitting):** Error resulting from overly simplistic assumptions. The model fails to capture underlying patterns, causing poor performance on both training and test data.
- **Variance (Overfitting):** Error resulting from excessive sensitivity to noise and fluctuations in training data. The model memorizes training samples instead of generalizing.

**Diagnostic for 98% Train / 65% Validation:**
This massive divergence is a classic symptom of **Overfitting (High Variance)**.

**Concrete Remediation Strategies:**
1. **Regularization:** Introduce penalties on model weight magnitude (L1 Lasso for feature sparsity; L2 Ridge to penalize large weights; Dropout in neural nets).
2. **Data Augmentation & More Training Data:** Exposing the model to diverse samples prevents memorizing specific idiosyncrasies.
3. **Feature Selection & Dimensionality Reduction:** Eliminate collinear or noisy features using PCA or feature importance ranking.
4. **Early Stopping & Cross-Validation:** Monitor validation loss during training and halt before overfitting begins. Use Stratified 5-Fold Cross Validation.`,
    interviewerIntent: "Tests diagnostic reasoning for overfitting vs underfitting and practical regularization techniques.",
    answerBlueprint: "High train accuracy + low validation accuracy = Overfitting (High Variance). Detail remediation: Regularization (L1/L2), more training data, feature reduction, and early stopping.",
    followUpQuestions: [
      "How does L1 (Lasso) differ mathematically from L2 (Ridge)?",
      "What is data leakage and how can it cause falsely high cross-validation scores?"
    ],
    tags: ["Machine Learning", "Bias-Variance", "Model Tuning", "Scikit-Learn"]
  },

  // ==========================================
  // DATABASES & SQL
  // ==========================================
  {
    id: "db-01",
    topic: "sql-databases",
    topicName: "Databases & SQL",
    role: "Full Stack / Web Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "entry",
    question: "Explain ACID properties in relational databases (MySQL/PostgreSQL) with a real-world banking or inventory example.",
    modelAnswer: `**ACID** represents the four fundamental guarantees of relational database transactions:

1. **Atomicity ('All or Nothing'):** The entire transaction executes successfully, or none of it takes effect.
   *Example:* Transferring ₹5,000 from Account A to Account B. If deducting from A succeeds but crediting B crashes, the transaction rolls back completely. Money never vanishes.
2. **Consistency (Integrity Rules):** The database moves from one valid state to another valid state, satisfying all schemas, constraints, and foreign keys.
   *Example:* An account balance constraint cannot drop below zero. If an operation violates this, the transaction is rejected.
3. **Isolation (Concurrent Execution):** Multiple transactions occurring concurrently execute without interfering with one another.
   *Example:* Two users simultaneously purchasing the last available blood unit in an inventory table. Isolation levels (Read Committed, Repeatable Read, Serializable) prevent race conditions and dirty reads.
4. **Durability (Permanence):** Once a transaction commits, the changes persist even in the event of an immediate power outage or server crash, guaranteed via Write-Ahead Logging (WAL).`,
    interviewerIntent: "Tests foundational knowledge of database reliability, transactional integrity, and data safety.",
    answerBlueprint: "Define each letter: Atomicity, Consistency, Isolation, Durability. Use a clear transaction example like a bank transfer or inventory checkout.",
    followUpQuestions: [
      "What are the four SQL transaction isolation levels?",
      "What is the performance trade-off between Read Committed and Serializable isolation?"
    ],
    tags: ["SQL", "Databases", "ACID", "MySQL", "Transactions"]
  },
  {
    id: "db-02",
    topic: "sql-databases",
    topicName: "Databases & SQL",
    role: "Full Stack / Web Developer",
    category: "technical",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "How do B-Tree indexes work in MySQL/PostgreSQL, and when does adding an index actually hurt database performance?",
    modelAnswer: `A database index is an auxiliary data structure (predominantly a **B+ Tree**) that accelerates data retrieval queries from an $O(N)$ full table scan down to an $O(\\log N)$ logarithmic tree lookup.

**How B+ Trees work:**
- The root and internal nodes store search keys that guide traversal.
- Leaf nodes store the actual record pointers or clustered primary key data, linked sequentially in a doubly-linked list. This enables rapid range scans (\`WHERE age BETWEEN 20 AND 30\`).

**When adding an index hurts performance:**
1. **Write-Heavy Tables (INSERT / UPDATE / DELETE):** Every write must not only modify the table rows, but also re-balance and write to every corresponding index tree, slowing down write throughput.
2. **Low-Cardinality Columns:** Indexing a column with few distinct values (e.g. \`is_active\` boolean or \`gender\`) is inefficient because the database query planner will often ignore the index and prefer a sequential scan.
3. **Disk & Buffer Pool Overhead:** Indexes consume disk space and compete for memory in the database buffer pool (e.g. InnoDB Buffer Pool), pushing hot data pages out of cache.`,
    interviewerIntent: "Assesses understanding of database performance tuning, indexing internals, and architectural trade-offs.",
    answerBlueprint: "Explain B+ Tree structure and O(log N) lookup. Detail when indexes hurt: slow INSERT/UPDATE operations, low-cardinality columns, and memory/disk bloat.",
    followUpQuestions: [
      "What is a composite index and why does the 'Leftmost Prefix Rule' matter?",
      "What does EXPLAIN analyze reveal about query execution plans?"
    ],
    tags: ["SQL", "Indexing", "B-Tree", "MySQL", "Performance"]
  },

  // ==========================================
  // SYSTEM DESIGN & ARCHITECTURE
  // ==========================================
  {
    id: "sys-01",
    topic: "system-design",
    topicName: "System Design",
    role: "Full Stack / Web Developer",
    category: "system-design",
    difficulty: "medium",
    experienceLevel: "mid",
    question: "How would you design a scalable RESTful API with rate limiting and caching for a web service serving 100,000 daily active users?",
    modelAnswer: `To design a resilient, scalable REST API for 100k DAU:

1. **Architecture Overview:**
   - **DNS & CDN (Cloudflare):** Offloads static assets and caches idempotent GET responses.
   - **Load Balancer (Nginx / ALB):** Distributes traffic across horizontally scaled, stateless Node.js / Python application containers.
   - **In-Memory Cache (Redis):** Caches frequent database queries, user session tokens, and rate-limit counters.
   - **Primary Database (PostgreSQL / MySQL):** Relational DB with Master-Read Replica topology.

2. **Rate Limiting Strategy:**
   - Implement the **Token Bucket** or **Sliding Window Log** algorithm using Redis.
   - Identify clients by API Key or JWT user ID (with IP fallback for public routes).
   - If limits are exceeded (e.g., 60 requests/minute), return HTTP \`429 Too Many Requests\` with \`Retry-After\` header.

3. **Authentication & Security:**
   - Stateless JWT authentication signed with asymmetric keys (RS256).
   - Store access tokens in \`HttpOnly\`, \`Secure\`, \`SameSite=Strict\` cookies to mitigate XSS and CSRF.

4. **Idempotency:**
   - For sensitive POST endpoints (e.g., payments or reservations), mandate an \`Idempotency-Key\` header stored in Redis with an expiration window to prevent duplicate charges.`,
    interviewerIntent: "Assesses API design principles (REST, HTTP status codes, idempotency), security (JWT, OAuth2), and scalability (caching with Redis, token bucket rate limiting).",
    answerBlueprint: "Outline stateless architecture: API Gateway -> Load Balancer -> Node.js service -> Redis cache & MySQL cluster. Detail Token Bucket or Leaky Bucket algorithm using Redis for rate limiting (429 Too Many Requests), and secure JWT storage.",
    followUpQuestions: [
      "How do you ensure idempotency for payment POST requests?",
      "How would you invalidate cached user permissions when a role is revoked?"
    ],
    tags: ["REST API", "System Design", "Node.js", "Redis", "Security"]
  },

  // ==========================================
  // WEB ACCESSIBILITY & INCLUSIVE DESIGN
  // ==========================================
  {
    id: "a11y-01",
    topic: "accessibility",
    topicName: "Web Accessibility (a11y)",
    role: "Web Accessibility Engineer",
    category: "technical",
    difficulty: "easy",
    experienceLevel: "entry",
    question: "What is the difference between semantic HTML and ARIA attributes? Why is the first rule of ARIA 'Do not use ARIA if a native HTML element exists'?",
    modelAnswer: `**Semantic HTML:**
Semantic HTML elements (\`<button>\`, \`<nav>\`, \`<header>\`, \`<main>\`, \`<input type="checkbox">\`, \`<dialog>\`) convey structural meaning to both browsers and assistive technologies (like screen readers). Crucially, browsers automatically provide:
- Proper accessibility roles, names, and states in the accessibility tree.
- Built-in keyboard accessibility (e.g., \`<button>\` receives tab focus and triggers on Space and Enter).
- Native focus styling and touch interaction behavior.

**ARIA (Accessible Rich Internet Applications):**
ARIA attributes (\`role="button"\`, \`aria-expanded\`, \`aria-label\`) only modify or augment the accessibility tree metadata exposed to screen readers. ARIA **does not**:
- Add keyboard focusability (\`tabindex\`).
- Bind keyboard listeners (Space / Enter activation).
- Change rendering or styling behavior.

**The First Rule of ARIA:**
*'If you can use a native HTML5 element or attribute with the semantics and behavior you require already built in, then do so.'*
Using \`<div role="button">\` instead of \`<button>\` requires manually wiring up \`tabindex="0"\`, Enter key handlers, Space key handlers, and state toggles, creating high risk of accessible bugs. Native HTML gives you robust accessibility for free.`,
    interviewerIntent: "Evaluates knowledge of accessible web foundations and whether the candidate understands that native HTML provides free accessibility features out of the box.",
    answerBlueprint: "Semantic elements natively provide keyboard focus, role, state, and screen reader announcements. ARIA only changes the accessibility tree label but does not provide keyboard handlers unless manually scripted.",
    followUpQuestions: [
      "When is an `aria-label` necessary versus visible text?",
      "What is the difference between `aria-hidden='true'` and CSS `display: none`?"
    ],
    tags: ["Accessibility", "WCAG", "HTML5", "WAI-ARIA", "VoiceOver"]
  },
  {
    id: "a11y-02",
    topic: "accessibility",
    topicName: "Web Accessibility (a11y)",
    role: "Web Accessibility Engineer",
    category: "scenario",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "You are tasked with auditing a complex modal dialog on an enterprise web app. What accessibility criteria must be met for WCAG 2.1 AA compliance?",
    modelAnswer: `To achieve full WCAG 2.1 AA compliance on a modal dialog:

1. **Focus Trap Management (WCAG 2.1.2 - No Keyboard Trap & 2.4.3 - Focus Order):**
   - When the modal opens, keyboard focus must automatically move inside the modal (e.g. to the first interactive element or dialog title).
   - Tabbing forward from the last interactive element must cycle back to the first interactive element inside the modal (focus trap).
2. **Focus Restoration:**
   - When the modal is dismissed, keyboard focus must return precisely to the button/trigger element that originally opened it.
3. **Escape Key Dismissal:**
   - Pressing the \`Escape\` key must immediately close the modal.
4. **Semantic Roles & Labeling (WCAG 4.1.2 - Name, Role, Value):**
   - The container must have \`role="dialog"\` (or \`role="alertdialog"\` for critical alerts) and \`aria-modal="true"\`.
   - Use \`aria-labelledby="modal-title-id"\` and \`aria-describedby="modal-desc-id"\` so screen readers announce the context upon opening.
5. **Background Inactivity:**
   - Background content must be marked \`inert\` or \`aria-hidden="true"\` so screen reader users cannot wander into background elements while the modal is active.`,
    interviewerIntent: "Tests hands-on knowledge of accessible interactive components, focus trapping, and screen reader announcements.",
    answerBlueprint: "Key requirements: (1) Focus trap inside modal; (2) Focus restoration to trigger on close; (3) Escape key closes; (4) role='dialog', aria-modal='true', aria-labelledby; (5) Background inert.",
    followUpQuestions: [
      "How does the native HTML5 `<dialog>` element simplify this implementation?",
      "How do screen readers announce dynamically injected content inside a modal?"
    ],
    tags: ["WCAG", "Focus Management", "JavaScript", "Modal", "Screen Readers"]
  },

  // ==========================================
  // BEHAVIORAL & STAR METHOD
  // ==========================================
  {
    id: "beh-01",
    topic: "behavioral",
    topicName: "Behavioral & STAR",
    role: "General Engineering / Software Engineer",
    category: "behavioral",
    difficulty: "medium",
    experienceLevel: "entry",
    question: "Tell me about a time when you faced a difficult technical bug or unexpected challenge during a project deadline. How did you diagnose and resolve it?",
    modelAnswer: `**Situation:** During the development of our Online Blood Bank Management System, we were conducting multi-user stress testing one week prior to our project presentation. We encountered intermittent database lock errors where simultaneous blood requests caused duplicate inventory deductions.

**Task:** As the backend developer, my responsibility was to diagnose the root cause of these concurrent race conditions, safeguard inventory data consistency, and ensure zero failed transactions before the deadline.

**Action:**
1. I replicated the concurrency issue locally using a Node.js script that spawned 50 simultaneous asynchronous checkout requests.
2. I inspected the MySQL query logs and identified that our query read the available blood stock and subsequently issued an update in two separate statements without transactional isolation.
3. I refactored the query to wrap the operation inside a single atomic MySQL transaction using \`SELECT ... FOR UPDATE\` (pessimistic locking) and added database-level check constraints to guarantee inventory could never drop below zero.

**Result:** Under subsequent simulated load tests of 100 concurrent requests, the system processed all transactions in serial consistency with 0 duplicate allocations and 100% data integrity.

**Reflection:** This experience taught me that data integrity must be designed into the transactional schema rather than assumed at the application layer, and that automated concurrency testing is crucial before production delivery.`,
    interviewerIntent: "Tests problem-solving resilience, systematic debugging methodology, and emotional maturity under pressure.",
    answerBlueprint: "Structure using STAR+R (Situation, Task, Action, Result, Reflection). Detail the technical bug without blaming external factors, step-by-step diagnostic actions (logs, test cases, isolation), the verified fix, and what preventive practices you established.",
    followUpQuestions: [
      "What would you do differently if faced with the same deadline today?",
      "How did you keep your team or stakeholders updated while resolving the issue?"
    ],
    tags: ["STAR Method", "Problem Solving", "Debugging", "Ownership"]
  },
  {
    id: "beh-02",
    topic: "behavioral",
    topicName: "Behavioral & STAR",
    role: "General Engineering / Software Engineer",
    category: "behavioral",
    difficulty: "medium",
    experienceLevel: "junior",
    question: "Describe a situation where you had a disagreement with a team member regarding a technical design or project choice. How did you handle it?",
    modelAnswer: `**Situation:** During our university technical project, my team member wanted to build our platform entirely with a NoSQL database (MongoDB) because of its quick setup, while I strongly advocated for a relational database (MySQL).

**Task:** We needed to agree on the database architecture without stalling development or creating team friction, as our timeline was limited to three weeks.

**Action:**
1. Rather than arguing personal preferences, I suggested we evaluate our decision against objective project requirements: ACID transactions, relational foreign keys connecting patients, donors, and hospital inventories, and query complexity.
2. I built a quick 30-minute prototype schema for both databases. I demonstrated that while MongoDB was fast to initialize, modeling many-to-many relationships (multiple patients requesting multiple blood units across multiple hospitals) required complex manual document referencing and left us vulnerable to data anomalies without native transactions.
3. I actively listened to my peer's concern about agile schema evolution and agreed to create modular database migration scripts to address their velocity concerns.

**Result:** We mutually chose MySQL. Development proceeded smoothly, and our database constraints prevented multiple potential data integrity bugs during testing. My teammate and I maintained a strong collaborative relationship throughout the project.

**Reflection:** I learned that technical disagreements should always be resolved with objective criteria and quick empirical prototypes rather than subjective debate.`,
    interviewerIntent: "Evaluates emotional intelligence, collaborative negotiation, data-driven reasoning, and focus on product outcomes over personal ego.",
    answerBlueprint: "STAR format: Focus on objective criteria (performance benchmarks, maintainability, user experience) rather than personal opinion. Describe actively listening to their viewpoint, proposing a small POC or benchmark comparison, agreeing on the best approach, and executing cohesively.",
    followUpQuestions: [
      "Have you ever had to commit to an approach you initially disagreed with (Disagree and Commit)?",
      "How do you give constructive code review feedback without offending peers?"
    ],
    tags: ["Collaboration", "Conflict Resolution", "Communication", "Teamwork"]
  }
];

const CAREER_ROADMAPS = [
  {
    id: "full-stack",
    title: "Full Stack / Web Developer",
    icon: "💻",
    level: "Junior to Mid-Level",
    salaryRange: "₹6L – ₹18L PA (India) / $85k – $140k (Global)",
    coreSkills: ["HTML5 & CSS3", "JavaScript (ES6+) / TypeScript", "Node.js & Express", "SQL (PostgreSQL / MySQL)", "REST APIs & Caching"],
    careerMilestones: [
      "Master DOM manipulation, responsive layouts, and modern CSS (Flexbox/Grid).",
      "Build full-stack CRUD applications with authenticated sessions and relational databases.",
      "Implement automated testing (Jest, Playwright) and CI/CD pipelines.",
      "Design scalable microservices, Redis caching, and containerized deployments (Docker)."
    ],
    interviewPrepFocus: "Event loop, closures, async/await, database normalization, transaction isolation, and system design."
  },
  {
    id: "python-dev",
    title: "Python / Backend Engineer",
    icon: "🐍",
    level: "Entry to Senior",
    salaryRange: "₹6L – ₹22L PA (India) / $90k – $150k (Global)",
    coreSkills: ["Python 3.x", "FastAPI / Django / Flask", "Database ORMs & Raw SQL", "Concurrency (asyncio, multiprocessing)", "Docker & Linux"],
    careerMilestones: [
      "Master Python data structures, memory management, generators, and decorators.",
      "Design high-throughput REST / GraphQL APIs with background workers (Celery/Redis).",
      "Optimize database queries, indexing, and connection pooling under high concurrency.",
      "Architect event-driven systems using Kafka/RabbitMQ."
    ],
    interviewPrepFocus: "CPython GIL, memory profiling, streaming large datasets, decorators, and system architecture."
  },
  {
    id: "ai-ml",
    title: "AI / Machine Learning Engineer",
    icon: "🤖",
    level: "Associate to Lead",
    salaryRange: "₹8L – ₹28L PA (India) / $110k – $180k (Global)",
    coreSkills: ["Python", "Scikit-learn, PyTorch / TensorFlow", "NLP & LLM Architectures", "Pandas & NumPy", "MLOps & Docker"],
    careerMilestones: [
      "Solidify linear algebra, probability, loss functions, and optimization algorithms.",
      "Build end-to-end classification and NLP pipelines with rigorous cross-validation.",
      "Deploy models to production using ONNX runtime, FastAPI, and containerization.",
      "Implement continuous model monitoring, feature stores, and automated retraining."
    ],
    interviewPrepFocus: "Bias-variance tradeoff, evaluation metrics (Precision/Recall/F1), NLP vectorization vs embeddings, and low-latency inference."
  },
  {
    id: "a11y-engineer",
    title: "Web Accessibility (a11y) Engineer",
    icon: "♿",
    level: "Associate to Specialist (High Big Tech Demand)",
    salaryRange: "₹12L – ₹30L+ PA (Apple, Microsoft, Google ICT2/L4)",
    coreSkills: ["WCAG 2.1 / 2.2 Standards", "WAI-ARIA Specifications", "Screen Readers (VoiceOver, NVDA, JAWS)", "Semantic HTML5", "Front-End Remediation"],
    careerMilestones: [
      "Master native HTML5 semantics and keyboard navigation fundamentals.",
      "Perform comprehensive accessibility audits across enterprise web applications.",
      "Integrate automated axe-core accessibility testing into CI/CD pipelines.",
      "Consult cross-functionally across design and engineering to embed inclusive design."
    ],
    interviewPrepFocus: "First rule of ARIA, focus trapping, modal accessible implementation, and screen reader announcements."
  }
];

module.exports = {
  TOPICS,
  QUESTION_BANK,
  CAREER_ROADMAPS
};
