/**
 * InterviewIQ Client Controller
 * Handles Navigation, Topic Q&As, Search, Career Hub, Auth, and Practice Mode.
 */

document.addEventListener('DOMContentLoaded', () => {
  // DOM References - Navigation & Views
  const brandHome = document.getElementById('brand-home');
  const navHome = document.getElementById('nav-home');
  const navStudy = document.getElementById('nav-study');
  const navTopics = document.getElementById('nav-topics');
  const navCareer = document.getElementById('nav-career');
  const btnBackHome = document.getElementById('btn-back-home');
  const breadcrumbBar = document.getElementById('breadcrumb-bar');
  const breadcrumbCurrentView = document.getElementById('breadcrumb-current-view');

  const viewHome = document.getElementById('view-home');
  const viewStudy = document.getElementById('view-study');
  const viewTopics = document.getElementById('view-topics');
  const viewCareer = document.getElementById('view-career');
  const viewSearch = document.getElementById('view-search');

  // DOM References - Search
  const globalSearchInput = document.getElementById('global-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchResultsHeading = document.getElementById('search-results-heading');
  const searchResultsSubheading = document.getElementById('search-results-subheading');
  const searchResultsContainer = document.getElementById('search-results-container');

  // DOM References - Generator Form
  const form = document.getElementById('generator-form');
  const roleSelect = document.getElementById('role-select');
  const customRoleInput = document.getElementById('custom-role-input');
  const experienceSelect = document.getElementById('experience-select');
  const categorySelect = document.getElementById('category-select');
  const difficultySelect = document.getElementById('difficulty-select');
  const countSelect = document.getElementById('count-select');
  const jdInput = document.getElementById('jd-input');
  const generateBtn = document.getElementById('generate-btn');
  const btnText = generateBtn.querySelector('.btn-text');
  const btnSpinner = generateBtn.querySelector('.btn-spinner');

  const welcomeCard = document.getElementById('welcome-card');
  const resultsHeader = document.getElementById('results-header');
  const resultsTitle = document.getElementById('results-title');
  const resultsMeta = document.getElementById('results-meta');
  const questionsContainer = document.getElementById('questions-container');

  const btnExportMd = document.getElementById('btn-export-md');
  const btnCopyAll = document.getElementById('btn-copy-all');
  const btnPrint = document.getElementById('btn-print');

  // DOM References - Topic Library
  const topicChipsContainer = document.getElementById('topic-chips-container');
  const activeTopicTitle = document.getElementById('active-topic-title');
  const activeTopicDesc = document.getElementById('active-topic-desc');
  const topicQuestionsContainer = document.getElementById('topic-questions-container');

  // DOM References - Career Hub
  const careerCardsContainer = document.getElementById('career-cards-container');

  // DOM References - Auth Modal & Profile
  const btnOpenLogin = document.getElementById('btn-open-login');
  const userProfileMenu = document.getElementById('user-profile-menu');
  const userDisplayName = document.getElementById('user-display-name');
  const btnLogout = document.getElementById('btn-logout');
  const loginModal = document.getElementById('login-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const tabSignin = document.getElementById('tab-signin');
  const tabSignup = document.getElementById('tab-signup');
  const authForm = document.getElementById('auth-form');
  const groupName = document.getElementById('group-name');
  const authName = document.getElementById('auth-name');
  const authEmail = document.getElementById('auth-email');
  const authPassword = document.getElementById('auth-password');
  const btnAuthSubmit = document.getElementById('btn-auth-submit');
  const btnDemoLogin = document.getElementById('btn-demo-login');

  let currentQuestions = [];
  let currentMeta = {};
  let activeView = 'home';
  let activeTopicId = 'all';
  let searchTimeout = null;

  // ==========================================
  // 1. Navigation & View Switching
  // ==========================================
  function switchView(viewName, label) {
    activeView = viewName;

    // Reset all nav buttons
    navHome.classList.remove('active');
    navStudy.classList.remove('active');
    navTopics.classList.remove('active');
    navCareer.classList.remove('active');

    // Hide all view containers
    viewHome.classList.add('hidden');
    viewStudy.classList.add('hidden');
    viewTopics.classList.add('hidden');
    viewCareer.classList.add('hidden');
    viewSearch.classList.add('hidden');

    if (viewName === 'home') {
      navHome.classList.add('active');
      viewHome.classList.remove('hidden');
      breadcrumbBar.classList.add('hidden');
    } else if (viewName === 'study') {
      navStudy.classList.add('active');
      viewStudy.classList.remove('hidden');
      breadcrumbBar.classList.remove('hidden');
      breadcrumbCurrentView.textContent = label || 'Get Ready for Study';
    } else if (viewName === 'topics') {
      navTopics.classList.add('active');
      viewTopics.classList.remove('hidden');
      breadcrumbBar.classList.remove('hidden');
      breadcrumbCurrentView.textContent = label || 'Topic Q&As';
      loadTopicsView(activeTopicId);
    } else if (viewName === 'career') {
      navCareer.classList.add('active');
      viewCareer.classList.remove('hidden');
      breadcrumbBar.classList.remove('hidden');
      breadcrumbCurrentView.textContent = label || 'Career Hub';
      loadCareerHub();
    } else if (viewName === 'search') {
      viewSearch.classList.remove('hidden');
      breadcrumbBar.classList.remove('hidden');
      breadcrumbCurrentView.textContent = label || 'Search Results';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Brand and Home button handlers
  brandHome.addEventListener('click', () => switchView('home'));
  navHome.addEventListener('click', () => switchView('home'));
  btnBackHome.addEventListener('click', () => switchView('home'));

  navStudy.addEventListener('click', () => switchView('study', 'Get Ready for Study'));
  navTopics.addEventListener('click', () => switchView('topics', 'Topic Q&As'));
  navCareer.addEventListener('click', () => switchView('career', 'Career Hub'));

  // Quick topic pills on Home view
  document.querySelectorAll('.q-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      const topicId = pill.dataset.topic;
      activeTopicId = topicId;
      switchView('topics', `Topic: ${pill.textContent}`);
    });
  });

  // Custom role input toggle
  roleSelect.addEventListener('change', () => {
    if (roleSelect.value === 'custom') {
      customRoleInput.classList.remove('hidden');
      customRoleInput.focus();
    } else {
      customRoleInput.classList.add('hidden');
    }
  });

  // ==========================================
  // 2. Global Search System
  // ==========================================
  globalSearchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim();

    if (query.length > 0) {
      searchClearBtn.classList.remove('hidden');
    } else {
      searchClearBtn.classList.add('hidden');
      if (activeView === 'search') {
        switchView('home');
      }
      return;
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      executeSearch(query);
    }, 250);
  });

  searchClearBtn.addEventListener('click', () => {
    globalSearchInput.value = '';
    searchClearBtn.classList.add('hidden');
    switchView('home');
  });

  async function executeSearch(query) {
    if (!query) return;

    switchView('search', `Search: "${query}"`);
    searchResultsHeading.textContent = `🔍 Search Results for "${query}"`;
    searchResultsSubheading.textContent = 'Searching across questions, verified model answers, and tags...';
    searchResultsContainer.innerHTML = '<div style="color: #94a3b8; padding: 2rem; text-align: center;">Searching...</div>';

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.results)) {
        searchResultsSubheading.textContent = `Found ${data.count} matching question${data.count === 1 ? '' : 's'}.`;
        renderCardList(data.results, searchResultsContainer, true);
      } else {
        searchResultsContainer.innerHTML = '<p style="color: #94a3b8;">No results found. Try searching for "Python", "SQL", "Event Loop", or "STAR".</p>';
      }
    } catch (err) {
      console.error(err);
      searchResultsContainer.innerHTML = '<p style="color: #ef4444;">Search request failed. Please check local server.</p>';
    }
  }

  // ==========================================
  // 3. Topic Q&A Library
  // ==========================================
  async function loadTopicsView(selectedTopicId = 'all') {
    try {
      const res = await fetch('/api/topics');
      const data = await res.json();

      if (data.success && Array.isArray(data.topics)) {
        renderTopicChips(data.topics, selectedTopicId);
        loadQuestionsForTopic(selectedTopicId);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function renderTopicChips(topics, selectedId) {
    topicChipsContainer.innerHTML = '';

    topics.forEach(t => {
      const chip = document.createElement('button');
      chip.className = `chip-btn ${t.id === selectedId ? 'active' : ''}`;
      chip.innerHTML = `${t.icon} ${escapeHtml(t.name)} <span style="opacity: 0.75; font-size: 0.75rem;">(${t.questionCount})</span>`;

      chip.addEventListener('click', () => {
        document.querySelectorAll('.chip-btn').forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        activeTopicId = t.id;
        breadcrumbCurrentView.textContent = `Topic: ${t.name}`;
        loadQuestionsForTopic(t.id);
      });

      topicChipsContainer.appendChild(chip);
    });
  }

  async function loadQuestionsForTopic(topicId) {
    topicQuestionsContainer.innerHTML = '<div style="color: #94a3b8; padding: 2rem; text-align: center;">Loading topic questions & answers...</div>';

    try {
      const res = await fetch(`/api/topics/${topicId}`);
      const data = await res.json();

      if (data.success && Array.isArray(data.questions)) {
        activeTopicTitle.textContent = `${data.topic?.icon || '📌'} ${data.topic?.name || 'Topic'}`;
        activeTopicDesc.textContent = `${data.topic?.description || 'Curated question and answer set.'} (${data.count} Questions Available)`;
        renderCardList(data.questions, topicQuestionsContainer, true);
      }
    } catch (err) {
      console.error(err);
      topicQuestionsContainer.innerHTML = '<p style="color: #ef4444;">Failed to load topic questions.</p>';
    }
  }

  // ==========================================
  // 4. Career Hub Roadmaps
  // ==========================================
  async function loadCareerHub() {
    if (careerCardsContainer.children.length > 0) return; // already loaded

    try {
      const res = await fetch('/api/career/roadmaps');
      const data = await res.json();

      if (data.success && Array.isArray(data.roadmaps)) {
        careerCardsContainer.innerHTML = '';

        data.roadmaps.forEach(r => {
          const card = document.createElement('div');
          card.className = 'career-card';

          card.innerHTML = `
            <div class="career-card-top">
              <div class="career-icon">${r.icon}</div>
              <div>
                <h3 class="career-card-title">${escapeHtml(r.title)}</h3>
                <span class="career-level-badge">${escapeHtml(r.level)}</span>
              </div>
            </div>

            <div class="career-salary-box">
              <span class="salary-label">Verified Comp Benchmark</span>
              <div class="salary-val">${escapeHtml(r.salaryRange)}</div>
            </div>

            <div class="career-skills-box">
              <div class="career-section-heading">Core Competencies</div>
              <div class="career-skills-chips">
                ${r.coreSkills.map(s => `<span class="career-skill-pill">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>

            <div class="career-section-heading">Career Milestones</div>
            <ul class="milestones-list">
              ${r.careerMilestones.map(m => `<li>${escapeHtml(m)}</li>`).join('')}
            </ul>

            <div class="prep-focus-box">
              <strong>🎯 Interview Focus:</strong> ${escapeHtml(r.interviewPrepFocus)}
            </div>
          `;

          careerCardsContainer.appendChild(card);
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  // ==========================================
  // 5. Auth & User Profile Management
  // ==========================================
  function initAuth() {
    const savedUser = localStorage.getItem('interviewiq_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setLoggedInState(user);
      } catch (e) {
        localStorage.removeItem('interviewiq_user');
      }
    }
  }

  function setLoggedInState(user) {
    btnOpenLogin.classList.add('hidden');
    userProfileMenu.classList.remove('hidden');
    userDisplayName.textContent = user.name || 'Candidate';
    if (user.avatar) document.getElementById('user-avatar-badge').textContent = user.avatar;
  }

  function setLoggedOutState() {
    localStorage.removeItem('interviewiq_user');
    btnOpenLogin.classList.remove('hidden');
    userProfileMenu.classList.add('hidden');
  }

  btnOpenLogin.addEventListener('click', () => {
    loginModal.classList.remove('hidden');
  });

  modalCloseBtn.addEventListener('click', () => {
    loginModal.classList.add('hidden');
  });

  loginModal.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.classList.add('hidden');
  });

  // Modal tab switching
  tabSignin.addEventListener('click', () => {
    tabSignin.classList.add('active');
    tabSignup.classList.remove('active');
    groupName.classList.add('hidden');
    btnAuthSubmit.textContent = 'Sign In';
  });

  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabSignin.classList.remove('active');
    groupName.classList.remove('hidden');
    btnAuthSubmit.textContent = 'Create Account';
  });

  // Auth form submit
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = authEmail.value.trim();
    const password = authPassword.value.trim();
    const name = authName.value.trim();

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      const data = await res.json();
      if (data.success && data.user) {
        localStorage.setItem('interviewiq_user', JSON.stringify(data.user));
        setLoggedInState(data.user);
        loginModal.classList.add('hidden');
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Demo 1-click Login
  btnDemoLogin.addEventListener('click', () => {
    const demoUser = {
      id: 'usr-yelty-demo',
      name: 'Yelty Vardhan Reddy',
      email: 'reddyvardhan68@gmail.com',
      avatar: '👨‍💻',
      role: 'Candidate (Software & Web Developer)'
    };
    localStorage.setItem('interviewiq_user', JSON.stringify(demoUser));
    setLoggedInState(demoUser);
    loginModal.classList.add('hidden');
  });

  btnLogout.addEventListener('click', () => {
    setLoggedOutState();
  });

  initAuth();

  // Handle URL routing / deep-linking (e.g. #get-ready-for-study)
  if (window.location.hash.includes('study') || window.location.search.includes('study')) {
    switchView('study', 'Get Ready for Study');
  } else if (window.location.hash.includes('topics')) {
    switchView('topics', 'Topic Q&As');
  } else if (window.location.hash.includes('career')) {
    switchView('career', 'Career Hub');
  }

  // ==========================================
  // 6. Question Generator Form Handler
  // ==========================================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedRole = roleSelect.value === 'custom' 
      ? customRoleInput.value.trim() || 'Software Engineer'
      : roleSelect.value;

    const payload = {
      role: selectedRole,
      experienceLevel: experienceSelect.value,
      category: categorySelect.value,
      difficulty: difficultySelect.value,
      count: parseInt(countSelect.value, 10),
      jdText: jdInput.value.trim()
    };

    setLoading(true);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success && Array.isArray(data.questions)) {
        currentQuestions = data.questions;
        currentMeta = data.meta;

        welcomeCard.classList.add('hidden');
        resultsHeader.classList.remove('hidden');

        resultsTitle.textContent = `${data.meta.role} — (${data.questions.length} Questions)`;
        resultsMeta.textContent = `Level: ${data.meta.experienceLevel.toUpperCase()} | Track: ${data.meta.category} ${data.meta.hasJdContext ? ' | (Custom JD Context Attached)' : ''}`;

        renderCardList(data.questions, questionsContainer, false);
      } else {
        alert(data.error || 'Failed to generate questions. Please check the backend connection.');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Could not connect to the local server. Make sure node server.js is running!');
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    if (isLoading) {
      btnText.textContent = 'Generating...';
      btnSpinner.classList.remove('hidden');
      generateBtn.disabled = true;
    } else {
      btnText.textContent = 'Generate Questions';
      btnSpinner.classList.add('hidden');
      generateBtn.disabled = false;
    }
  }

  // ==========================================
  // 7. Generic Question Card Renderer
  // ==========================================
  function renderCardList(questions, container, showModelAnswerByDefault = false) {
    container.innerHTML = '';

    if (!questions || questions.length === 0) {
      container.innerHTML = '<p style="color: #94a3b8; padding: 1.5rem; text-align: center;">No questions found matching your criteria.</p>';
      return;
    }

    questions.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'question-card';

      const diffClass = `badge-${q.difficulty || 'medium'}`;

      card.innerHTML = `
        <div class="card-top">
          <span class="q-index">Question ${idx + 1} of ${questions.length}</span>
          <div class="badges">
            <span class="badge ${diffClass}">${q.difficulty || 'Medium'}</span>
            <span class="badge badge-category">${q.topicName || q.category || 'General'}</span>
          </div>
        </div>

        <h3 class="q-title">${escapeHtml(q.question)}</h3>

        ${q.tags && q.tags.length ? `
          <div class="tags-list">
            ${q.tags.map(t => `<span class="tag-item">#${escapeHtml(t)}</span>`).join('')}
          </div>
        ` : ''}

        <!-- Model Answer (for Topic Q&A / Search) -->
        ${q.modelAnswer ? `
          <div class="accordion-item">
            <div class="accordion-title" onclick="toggleAccordion(this)">
              <span>📖 Comprehensive Model Answer</span>
              <span class="acc-icon">${showModelAnswerByDefault ? '▲' : '▼'}</span>
            </div>
            <div class="accordion-content ${showModelAnswerByDefault ? '' : 'hidden'}">
              <div class="model-answer-box">
                ${escapeHtml(q.modelAnswer)}
              </div>
            </div>
          </div>
        ` : ''}

        <!-- Why the Interviewer Asks This -->
        <div class="accordion-item">
          <div class="accordion-title" onclick="toggleAccordion(this)">
            <span>💡 Why the Interviewer Asks This (Secret Intent)</span>
            <span class="acc-icon">▼</span>
          </div>
          <div class="accordion-content hidden">
            <div class="intent-box">
              ${escapeHtml(q.interviewerIntent || 'Evaluates foundational problem-solving and domain mastery.')}
            </div>
          </div>
        </div>

        <!-- Ideal Answer Blueprint -->
        <div class="accordion-item">
          <div class="accordion-title" onclick="toggleAccordion(this)">
            <span>🎯 Ideal Answer Blueprint (Key Points & STAR Structure)</span>
            <span class="acc-icon">▼</span>
          </div>
          <div class="accordion-content hidden">
            <div class="blueprint-box">
              ${escapeHtml(q.answerBlueprint || 'Structure your response clearly. State the core concept, provide a practical project example, and detail trade-offs.')}
            </div>
          </div>
        </div>

        <!-- Follow-Up Questions -->
        ${q.followUpQuestions && q.followUpQuestions.length ? `
          <div class="accordion-item">
            <div class="accordion-title" onclick="toggleAccordion(this)">
              <span>🔄 Likely Follow-Up Probes</span>
              <span class="acc-icon">▼</span>
            </div>
            <div class="accordion-content hidden">
              <ul class="follow-ups-list">
                ${q.followUpQuestions.map(fu => `<li>${escapeHtml(fu)}</li>`).join('')}
              </ul>
            </div>
          </div>
        ` : ''}

        <!-- Interactive Practice Mode -->
        <div class="accordion-item">
          <div class="accordion-title" onclick="toggleAccordion(this)">
            <span>🎙️ Interactive Practice & Instant Grading</span>
            <span class="acc-icon">▼</span>
          </div>
          <div class="accordion-content hidden">
            <div class="practice-container">
              <textarea class="practice-textarea" placeholder="Type your practice response here (aim for 100-250 words following the STAR method or core technical mechanics)..."></textarea>
              <button class="btn-evaluate" onclick="evaluateCardAnswer(this, '${escapeQuotes(q.question)}', '${q.category || 'technical'}')">Evaluate My Answer</button>
              <div class="eval-result hidden"></div>
            </div>
          </div>
        </div>
      `;

      container.appendChild(card);
    });
  }

  // Accordion Toggle
  window.toggleAccordion = function(element) {
    const content = element.nextElementSibling;
    const icon = element.querySelector('.acc-icon');
    if (content.classList.contains('hidden')) {
      content.classList.remove('hidden');
      icon.textContent = '▲';
    } else {
      content.classList.add('hidden');
      icon.textContent = '▼';
    }
  };

  // Evaluate Card Answer
  window.evaluateCardAnswer = async function(buttonEl, questionText, category) {
    const card = buttonEl.closest('.question-card');
    const textarea = card.querySelector('.practice-textarea');
    const resultBox = card.querySelector('.eval-result');

    const answerText = textarea.value.trim();
    if (!answerText) {
      alert('Please type an answer first before requesting evaluation.');
      return;
    }

    buttonEl.disabled = true;
    buttonEl.textContent = 'Analyzing response...';

    try {
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          answer: answerText,
          category: category
        })
      });

      const data = await res.json();
      if (data.success && data.evaluation) {
        const ev = data.evaluation;
        resultBox.classList.remove('hidden');
        resultBox.innerHTML = `
          <div class="eval-score-row">
            <strong>Verdict: ${escapeHtml(ev.verdict)}</strong>
            <span class="score-badge">${ev.score} / 10</span>
          </div>
          <p style="font-size: 0.85rem; color: #94a3b8;">Word count: ${ev.wordCount} words</p>
          <div class="eval-feedback-list">
            <div><strong>Strengths:</strong></div>
            <ul>${ev.strengths.map(s => `<li class="strength-item">✓ ${escapeHtml(s)}</li>`).join('')}</ul>
            <div style="margin-top: 0.4rem;"><strong>Improvement Areas:</strong></div>
            <ul>${ev.improvements.map(i => `<li class="improve-item">⚠ ${escapeHtml(i)}</li>`).join('')}</ul>
          </div>
          <div style="margin-top: 0.6rem; font-size: 0.82rem; color: #e2e8f0; background: #1e293b; padding: 0.5rem; border-radius: 6px;">
            <strong>💡 Suggestion:</strong> ${escapeHtml(ev.nextStepSuggestion)}
          </div>
        `;
      } else {
        alert('Evaluation failed.');
      }
    } catch (err) {
      console.error(err);
      alert('Could not submit evaluation.');
    } finally {
      buttonEl.disabled = false;
      buttonEl.textContent = 'Evaluate My Answer';
    }
  };

  // Export Markdown
  btnExportMd.addEventListener('click', async () => {
    if (!currentQuestions.length) return;

    try {
      const res = await fetch('/api/export/markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: currentQuestions, meta: currentMeta })
      });
      const data = await res.json();
      if (data.success && data.markdown) {
        const blob = new Blob([data.markdown], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-questions-${(currentMeta.role || 'role').toLowerCase().replace(/[^a-z0-9]/g, '-')}.md`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch (err) {
      console.error(err);
    }
  });

  // Copy All to Clipboard
  btnCopyAll.addEventListener('click', () => {
    if (!currentQuestions.length) return;
    let fullText = `INTERVIEW QUESTIONS FOR: ${currentMeta.role}\n\n`;
    currentQuestions.forEach((q, i) => {
      fullText += `Q${i + 1}: ${q.question}\n`;
      fullText += `Intent: ${q.interviewerIntent}\n`;
      fullText += `Answer Blueprint: ${q.answerBlueprint}\n\n`;
    });
    navigator.clipboard.writeText(fullText).then(() => {
      alert('All questions and blueprints copied to clipboard!');
    });
  });

  // Print / PDF
  btnPrint.addEventListener('click', () => {
    window.print();
  });

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function escapeQuotes(str) {
    if (!str) return '';
    return str.replace(/'/g, "\\'");
  }
});
