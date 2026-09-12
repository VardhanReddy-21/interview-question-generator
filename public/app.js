/**
 * Get Ready for Study - Client Application Controller
 * Handles Navigation, 12-Topic Exploration, AI Generator, Dark/Light Mode,
 * Authentication (Gmail & Direct Google), Bookmarks, Dashboard, and Detailed Q&A Options.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  let currentUser = JSON.parse(localStorage.getItem('study_user') || 'null');
  let currentTheme = localStorage.getItem('study_theme') || 'dark';
  let currentQuestions = [];
  let currentMeta = {};
  let activeView = 'home';
  let activeTopic = 'all';
  let searchTimeout = null;
  let bookmarkedIds = new Set(JSON.parse(localStorage.getItem('study_bookmarks') || '[]'));
  let practiceCount = parseInt(localStorage.getItem('study_practice_count') || '0', 10);

  // Apply initial theme
  applyTheme(currentTheme);

  // ==========================================================================
  // DOM ELEMENT REFERENCES
  // ==========================================================================
  // Navigation
  const brandHome = document.getElementById('brand-home');
  const navHome = document.getElementById('nav-home');
  const navExplore = document.getElementById('nav-explore');
  const navDashboard = document.getElementById('nav-dashboard');
  const navStudy = document.getElementById('nav-study');
  const navCareer = document.getElementById('nav-career');
  const btnBackHome = document.getElementById('btn-back-home');
  const breadcrumbBar = document.getElementById('breadcrumb-bar');
  const breadcrumbCurrentView = document.getElementById('breadcrumb-current-view');

  // Views
  const viewHome = document.getElementById('view-home');
  const viewExplore = document.getElementById('view-explore');
  const viewDashboard = document.getElementById('view-dashboard');
  const viewStudy = document.getElementById('view-study');
  const viewCareer = document.getElementById('view-career');
  const viewSearch = document.getElementById('view-search');

  // Search & Filters
  const headerSearchTopic = document.getElementById('header-search-topic');
  const globalSearchInput = document.getElementById('global-search-input');
  const searchClearBtn = document.getElementById('search-clear-btn');
  const searchResultsHeading = document.getElementById('search-results-heading');
  const searchResultsSubheading = document.getElementById('search-results-subheading');
  const searchResultsContainer = document.getElementById('search-results-container');
  const shortcutPillsList = document.getElementById('shortcut-pills-list');

  // Theme Toggle
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  // Generator Form
  const form = document.getElementById('generator-form');
  const topicSelect = document.getElementById('topic-select');
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

  // Results & Containers
  const welcomeCard = document.getElementById('welcome-card');
  const resultsHeader = document.getElementById('results-header');
  const resultsTitle = document.getElementById('results-title');
  const resultsMeta = document.getElementById('results-meta');
  const questionsContainer = document.getElementById('questions-container');
  const btnExportMd = document.getElementById('btn-export-md');
  const btnCopyAll = document.getElementById('btn-copy-all');
  const btnPrint = document.getElementById('btn-print');

  // Welcome CTA buttons
  const btnWelcomeExplore = document.getElementById('btn-welcome-explore');
  const btnWelcomeDemo = document.getElementById('btn-welcome-demo');

  // Explore View Elements
  const exploreTopicTabs = document.getElementById('explore-topic-tabs');
  const exploreQuestionsContainer = document.getElementById('explore-questions-container');
  const bannerTopicIcon = document.getElementById('banner-topic-icon');
  const bannerTopicName = document.getElementById('banner-topic-name');
  const bannerTopicDesc = document.getElementById('banner-topic-desc');
  const bannerTopicCount = document.getElementById('banner-topic-count');

  // Dashboard Elements
  const dashUserAvatar = document.getElementById('dash-user-avatar');
  const dashUserEmail = document.getElementById('dash-user-email');
  const dashReadinessScore = document.getElementById('dash-readiness-score');
  const metricTotalQuestions = document.getElementById('metric-total-questions');
  const metricSavedQuestions = document.getElementById('metric-saved-questions');
  const metricPracticeSessions = document.getElementById('metric-practice-sessions');
  const dashTopicMasteryGrid = document.getElementById('dash-topic-mastery-grid');
  const dashSavedQuestionsContainer = document.getElementById('dash-saved-questions-container');
  const savedCountBadge = document.getElementById('saved-count-badge');

  // Auth & Profile Elements
  const btnOpenLogin = document.getElementById('btn-open-login');
  const userProfileMenu = document.getElementById('user-profile-menu');
  const userDisplayName = document.getElementById('user-display-name');
  const userRoleBadge = document.getElementById('user-role-badge');
  const btnOpenProfile = document.getElementById('btn-open-profile');
  const btnLogout = document.getElementById('btn-logout');
  const loginModal = document.getElementById('login-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const btnGoogleAuth = document.getElementById('btn-google-auth');
  const tabSignup = document.getElementById('tab-signup');
  const tabSignin = document.getElementById('tab-signin');
  const authForm = document.getElementById('auth-form');
  const authAlert = document.getElementById('auth-alert');
  const groupName = document.getElementById('group-name');
  const groupRole = document.getElementById('group-role');
  const authName = document.getElementById('auth-name');
  const authEmail = document.getElementById('auth-email');
  const authPassword = document.getElementById('auth-password');
  const authTargetRole = document.getElementById('auth-target-role');
  const btnAuthSubmit = document.getElementById('btn-auth-submit');
  const btnDemoLogin = document.getElementById('btn-demo-login');

  // Profile Modal Elements
  const profileModal = document.getElementById('profile-modal');
  const profileCloseBtn = document.getElementById('profile-close-btn');
  const modalProfileName = document.getElementById('modal-profile-name');
  const modalProfileEmail = document.getElementById('modal-profile-email');
  const profileProviderBadge = document.getElementById('profile-provider-badge');
  const profileRoleVal = document.getElementById('profile-role-val');
  const profileSavedVal = document.getElementById('profile-saved-val');
  const profileJoinedVal = document.getElementById('profile-joined-val');
  const btnProfileToDashboard = document.getElementById('btn-profile-to-dashboard');
  const btnProfileLogout = document.getElementById('btn-profile-logout');

  // Career Hub Grid
  const careerCardsContainer = document.getElementById('career-cards-container');

  // ==========================================================================
  // 1. THEME SWITCHING (DARK / LIGHT MODE)
  // ==========================================================================
  function applyTheme(theme) {
    currentTheme = theme;
    localStorage.setItem('study_theme', theme);
    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    document.documentElement.setAttribute('data-theme', theme);

    if (themeIcon && themeLabel) {
      if (theme === 'dark') {
        themeIcon.textContent = '☀️';
        themeLabel.textContent = 'Light';
      } else {
        themeIcon.textContent = '🌙';
        themeLabel.textContent = 'Dark';
      }
    }
  }

  themeToggleBtn.addEventListener('click', () => {
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });

  // ==========================================================================
  // 2. VIEW NAVIGATION
  // ==========================================================================
  function switchView(viewName, label) {
    activeView = viewName;

    // Reset nav active states
    [navHome, navExplore, navDashboard, navStudy, navCareer].forEach(b => b.classList.remove('active'));
    [viewHome, viewExplore, viewDashboard, viewStudy, viewCareer, viewSearch].forEach(v => v.classList.add('hidden'));

    if (viewName === 'home') {
      navHome.classList.add('active');
      viewHome.classList.remove('hidden');
      breadcrumbBar.classList.add('hidden');
    } else if (viewName === 'explore') {
      navExplore.classList.add('active');
      viewExplore.classList.remove('hidden');
      breadcrumbBar.classList.remove('hidden');
      breadcrumbCurrentView.textContent = label || 'Explore All Topics';
      loadExploreView(activeTopic);
    } else if (viewName === 'dashboard') {
      navDashboard.classList.add('active');
      viewDashboard.classList.remove('hidden');
      breadcrumbBar.classList.remove('hidden');
      breadcrumbCurrentView.textContent = 'Candidate Dashboard';
      loadDashboard();
    } else if (viewName === 'study') {
      navStudy.classList.add('active');
      viewStudy.classList.remove('hidden');
      breadcrumbBar.classList.remove('hidden');
      breadcrumbCurrentView.textContent = '7-Day Study Sprint';
    } else if (viewName === 'career') {
      navCareer.classList.add('active');
      viewCareer.classList.remove('hidden');
      breadcrumbBar.classList.remove('hidden');
      breadcrumbCurrentView.textContent = 'Career Hub & Roadmaps';
      loadCareerRoadmaps();
    } else if (viewName === 'search') {
      viewSearch.classList.remove('hidden');
      breadcrumbBar.classList.remove('hidden');
      breadcrumbCurrentView.textContent = 'Search Results';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  brandHome.addEventListener('click', () => switchView('home'));
  navHome.addEventListener('click', () => switchView('home'));
  navExplore.addEventListener('click', () => switchView('explore'));
  navDashboard.addEventListener('click', () => switchView('dashboard'));
  navStudy.addEventListener('click', () => switchView('study'));
  navCareer.addEventListener('click', () => switchView('career'));
  btnBackHome.addEventListener('click', () => switchView('home'));

  if (btnWelcomeExplore) btnWelcomeExplore.addEventListener('click', () => switchView('explore'));
  if (btnWelcomeDemo) {
    btnWelcomeDemo.addEventListener('click', () => {
      topicSelect.value = 'all';
      countSelect.value = '5';
      generateBtn.click();
    });
  }

  // ==========================================================================
  // 3. TOPIC SHORTCUT PILLS & SELECTION
  // ==========================================================================
  shortcutPillsList.addEventListener('click', (e) => {
    const pill = e.target.closest('.s-pill');
    if (!pill) return;

    document.querySelectorAll('.s-pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    const topicId = pill.dataset.topic;
    activeTopic = topicId;

    // Sync header dropdown & generator select
    if (headerSearchTopic) headerSearchTopic.value = topicId;
    if (topicSelect) topicSelect.value = topicId;

    if (activeView === 'explore') {
      loadExploreView(topicId);
    } else {
      switchView('explore', `Topic: ${pill.textContent}`);
    }
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

  // ==========================================================================
  // 4. QUESTION GENERATOR FORM SUBMISSION
  // ==========================================================================
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const selectedRole = roleSelect.value === 'custom'
      ? customRoleInput.value.trim() || 'Software Engineer'
      : roleSelect.value;

    const payload = {
      role: selectedRole,
      topic: topicSelect.value,
      experienceLevel: experienceSelect.value,
      category: categorySelect.value,
      difficulty: difficultySelect.value,
      count: parseInt(countSelect.value, 10),
      jdText: jdInput.value.trim()
    };

    // UI Loading state
    btnText.textContent = 'Generating verified Q&As...';
    btnSpinner.classList.remove('hidden');
    generateBtn.disabled = true;

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Generation failed');

      currentQuestions = data.questions;
      currentMeta = data.meta;

      // Render questions
      renderQuestionsList(currentQuestions, questionsContainer);

      // Show header & hide welcome
      welcomeCard.classList.add('hidden');
      resultsHeader.classList.remove('hidden');
      resultsTitle.textContent = `${payload.topic !== 'all' ? payload.topic.toUpperCase() + ' - ' : ''}${payload.role} (${currentQuestions.length} Questions)`;
      resultsMeta.textContent = `Target Level: ${payload.experienceLevel.toUpperCase()} | Track: ${payload.category} | Verified Detailed Answers Ready`;

      // Track practice activity
      practiceCount += currentQuestions.length;
      localStorage.setItem('study_practice_count', practiceCount);

    } catch (err) {
      console.error(err);
      alert('Error generating questions: ' + err.message);
    } finally {
      btnText.textContent = '✨ Generate Questions & Detailed Answers';
      btnSpinner.classList.add('hidden');
      generateBtn.disabled = false;
    }
  });

  // ==========================================================================
  // 5. RENDER QUESTION CARDS WITH DETAILED "SHOW MORE OPTIONS"
  // ==========================================================================
  function renderQuestionsList(questions, container) {
    container.innerHTML = '';

    if (!questions || questions.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <p>No questions found matching your criteria. Try switching topics or search terms.</p>
        </div>
      `;
      return;
    }

    questions.forEach((q, idx) => {
      const card = document.createElement('div');
      card.className = 'question-card';
      card.id = `q-card-${q.id || idx}`;

      const isBookmarked = bookmarkedIds.has(q.id);
      const topicColor = getTopicColor(q.topic);

      card.innerHTML = `
        <div class="q-header">
          <div class="q-badges">
            <span class="badge-topic" style="background: ${topicColor};">
              ${q.topicName || q.topic || 'General'}
            </span>
            <span class="badge-diff ${q.difficulty || 'medium'}">${q.difficulty || 'medium'}</span>
            <span class="badge-cat">${q.category || 'technical'}</span>
          </div>
          <button class="btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" data-qid="${q.id}" title="${isBookmarked ? 'Remove from Saved' : 'Save to Dashboard'}">
            ${isBookmarked ? '★' : '☆'}
          </button>
        </div>

        <h3 class="q-title">${idx + 1}. ${escapeHtml(q.question)}</h3>

        <!-- Clear, Detailed Model Answer -->
        <div class="q-answer-box">
          <div class="q-answer-label">
            <span>📖 Verified Model Answer</span>
          </div>
          <div class="q-answer-content">${formatMarkdownAnswer(q.modelAnswer || 'Answer provided in blueprint.')}</div>
        </div>

        <!-- "Show More Options" Accordion Toggle -->
        <button class="btn-toggle-options" data-target="drawer-${q.id || idx}">
          <span>🔍 Show More Details (Blueprint, Code, Complexity & Probes)</span>
          <span class="toggle-arrow">▼</span>
        </button>

        <!-- Expanded Details Drawer -->
        <div class="q-options-drawer hidden" id="drawer-${q.id || idx}">
          <!-- 1. Why Interviewer Asks This -->
          <div class="drawer-section">
            <div class="drawer-header">
              <span>💡 Why the Interviewer Asks This</span>
            </div>
            <div class="drawer-body">${escapeHtml(q.interviewerIntent || 'Evaluates real-world production reasoning and depth.')}</div>
          </div>

          <!-- 2. Answer Blueprint & Key Points to Hit -->
          <div class="drawer-section">
            <div class="drawer-header">
              <span>🎯 Answer Blueprint (Key Points to Hit)</span>
            </div>
            <div class="drawer-body">${escapeHtml(q.answerBlueprint || 'State main definition, explain mechanism, and cite production trade-offs.')}</div>
          </div>

          <!-- 3. Code Snippet & Syntax Example -->
          ${q.codeSnippet ? `
            <div class="drawer-section">
              <div class="drawer-header">
                <span>💻 Working Code & Syntax Example</span>
              </div>
              <div class="code-block-wrapper">
                <div class="code-header">
                  <span class="code-lang">${q.topicName || 'Code'}</span>
                  <button class="btn-copy-code" data-code="${encodeURIComponent(q.codeSnippet)}">📋 Copy Code</button>
                </div>
                <pre class="code-content"><code>${escapeHtml(q.codeSnippet)}</code></pre>
              </div>
            </div>
          ` : ''}

          <!-- 4. Time & Space Complexity -->
          ${q.complexity ? `
            <div class="drawer-section">
              <div class="drawer-header">
                <span>⏱️ Complexity & Performance Analysis</span>
              </div>
              <div class="drawer-body"><strong>${escapeHtml(q.complexity)}</strong></div>
            </div>
          ` : ''}

          <!-- 5. Common Pitfalls & Mistakes to Avoid -->
          ${q.commonMistakes ? `
            <div class="drawer-section">
              <div class="drawer-header">
                <span>⚠️ Common Mistakes Candidates Make</span>
              </div>
              <div class="drawer-body" style="color: #ef4444;">${escapeHtml(q.commonMistakes)}</div>
            </div>
          ` : ''}

          <!-- 6. Likely Follow-Up Probes -->
          ${q.followUpQuestions && q.followUpQuestions.length > 0 ? `
            <div class="drawer-section">
              <div class="drawer-header">
                <span>🔄 Likely Follow-Up Questions by Interviewer</span>
              </div>
              <ul class="drawer-body follow-ups-list">
                ${q.followUpQuestions.map(fu => `<li>${escapeHtml(fu)}</li>`).join('')}
              </ul>
            </div>
          ` : ''}
        </div>

        <!-- Action Toolbar -->
        <div class="q-actions-bar">
          <div class="action-btn-group">
            <button class="btn-card-action btn-copy-answer" data-qid="${q.id}">
              📋 Copy Answer
            </button>
            <button class="btn-card-action btn-practice" data-qid="${q.id}">
              ✍️ Test My Answer
            </button>
            <button class="btn-card-action btn-listen" data-qid="${q.id}">
              🔊 Read Aloud
            </button>
          </div>
          <span class="q-id-tag">ID: ${q.id}</span>
        </div>

        <!-- Interactive Practice Drawer (Collapsible) -->
        <div class="practice-drawer hidden" id="practice-${q.id || idx}">
          <textarea class="practice-textarea" rows="3" placeholder="Type your answer here to get an instant AI evaluation score and constructive feedback..."></textarea>
          <div class="practice-footer">
            <button class="btn-primary btn-submit-eval" data-qid="${q.id}" style="width: auto; padding: 0.45rem 1rem;">
              Submit for AI Grading
            </button>
          </div>
          <div class="eval-result-card hidden" id="eval-result-${q.id || idx}"></div>
        </div>
      `;

      container.appendChild(card);
    });

    attachQuestionEventListeners(container);
  }

  // ==========================================================================
  // 6. QUESTION CARD EVENT LISTENERS
  // ==========================================================================
  function attachQuestionEventListeners(container) {
    // Show More Options Toggle
    container.querySelectorAll('.btn-toggle-options').forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.target;
        const drawer = document.getElementById(targetId);
        if (drawer) {
          const isOpen = !drawer.classList.contains('hidden');
          if (isOpen) {
            drawer.classList.add('hidden');
            btn.classList.remove('open');
            btn.querySelector('span:first-child').textContent = '🔍 Show More Details (Blueprint, Code, Complexity & Probes)';
          } else {
            drawer.classList.remove('hidden');
            btn.classList.add('open');
            btn.querySelector('span:first-child').textContent = '🔼 Hide Details';
          }
        }
      });
    });

    // Copy Code Buttons
    container.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const rawCode = decodeURIComponent(btn.dataset.code);
        navigator.clipboard.writeText(rawCode).then(() => {
          btn.textContent = '✅ Copied!';
          setTimeout(() => { btn.textContent = '📋 Copy Code'; }, 2000);
        });
      });
    });

    // Copy Answer Buttons
    container.querySelectorAll('.btn-copy-answer').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const qObj = findQuestionById(qid);
        if (qObj) {
          const fullText = `Q: ${qObj.question}\n\nModel Answer:\n${qObj.modelAnswer}\n\nBlueprint:\n${qObj.answerBlueprint}`;
          navigator.clipboard.writeText(fullText).then(() => {
            btn.textContent = '✅ Copied!';
            setTimeout(() => { btn.textContent = '📋 Copy Answer'; }, 2000);
          });
        }
      });
    });

    // Bookmark Toggle Buttons
    container.querySelectorAll('.btn-bookmark').forEach(btn => {
      btn.addEventListener('click', async () => {
        const qid = btn.dataset.qid;
        toggleBookmark(qid, btn);
      });
    });

    // Practice My Answer Toggle
    container.querySelectorAll('.btn-practice').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const practiceDrawer = document.getElementById(`practice-${qid}`);
        if (practiceDrawer) {
          practiceDrawer.classList.toggle('hidden');
        }
      });
    });

    // Submit Answer for AI Evaluation
    container.querySelectorAll('.btn-submit-eval').forEach(btn => {
      btn.addEventListener('click', async () => {
        const qid = btn.dataset.qid;
        const practiceDrawer = document.getElementById(`practice-${qid}`);
        const textarea = practiceDrawer.querySelector('.practice-textarea');
        const evalBox = document.getElementById(`eval-result-${qid}`);
        const userAns = textarea.value.trim();

        if (!userAns) {
          alert('Please type an answer first to evaluate.');
          return;
        }

        const qObj = findQuestionById(qid);
        btn.textContent = 'Evaluating...';
        btn.disabled = true;

        try {
          const res = await fetch('/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              question: qObj.question,
              answer: userAns,
              category: qObj.category,
              email: currentUser ? currentUser.email : null
            })
          });

          const data = await res.json();
          if (!data.success) throw new Error(data.error);

          const ev = data.evaluation;
          evalBox.classList.remove('hidden');
          evalBox.innerHTML = `
            <div class="eval-score-badge">Score: ${ev.score}/10 — ${ev.verdict}</div>
            <p style="font-size: 0.85rem; margin-bottom: 0.35rem;"><strong>Strengths:</strong> ${ev.strengths.join(' ')}</p>
            <p style="font-size: 0.85rem; margin-bottom: 0.35rem; color: #f59e0b;"><strong>Improvements:</strong> ${ev.improvements.join(' ')}</p>
            <p style="font-size: 0.82rem; color: var(--text-muted);"><strong>Next Step:</strong> ${ev.nextStepSuggestion}</p>
          `;

          // Track practice session
          practiceCount++;
          localStorage.setItem('study_practice_count', practiceCount);

        } catch (err) {
          alert('Evaluation error: ' + err.message);
        } finally {
          btn.textContent = 'Submit for AI Grading';
          btn.disabled = false;
        }
      });
    });

    // Text-to-Speech Read Aloud
    container.querySelectorAll('.btn-listen').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const qObj = findQuestionById(qid);
        if (!qObj) return;

        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Stop any ongoing speech
          if (btn.classList.contains('speaking')) {
            btn.classList.remove('speaking');
            btn.textContent = '🔊 Read Aloud';
            return;
          }

          const textToRead = `${qObj.question}. Model Answer: ${qObj.modelAnswer.replace(/[*#`_]/g, '')}`;
          const utterance = new SpeechSynthesisUtterance(textToRead);
          utterance.rate = 0.95;
          utterance.onend = () => {
            btn.classList.remove('speaking');
            btn.textContent = '🔊 Read Aloud';
          };

          btn.classList.add('speaking');
          btn.textContent = '⏹️ Stop';
          window.speechSynthesis.speak(utterance);
        } else {
          alert('Text-to-speech is not supported in this browser.');
        }
      });
    });
  }

  function findQuestionById(qid) {
    return currentQuestions.find(q => q.id === qid) || null;
  }

  // ==========================================================================
  // 7. BOOKMARKS MANAGEMENT
  // ==========================================================================
  async function toggleBookmark(qid, btnElement) {
    let isBookmarked = false;
    if (bookmarkedIds.has(qid)) {
      bookmarkedIds.delete(qid);
      isBookmarked = false;
    } else {
      bookmarkedIds.add(qid);
      isBookmarked = true;
    }

    localStorage.setItem('study_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));

    if (btnElement) {
      btnElement.textContent = isBookmarked ? '★' : '☆';
      btnElement.classList.toggle('bookmarked', isBookmarked);
      btnElement.title = isBookmarked ? 'Remove from Saved' : 'Save to Dashboard';
    }

    // Sync with backend if user logged in
    if (currentUser) {
      try {
        await fetch('/api/bookmarks/toggle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: currentUser.email, questionId: qid })
        });
      } catch (err) {
        console.error('Bookmark sync failed:', err);
      }
    }
  }

  // ==========================================================================
  // 8. EXPLORE ALL VIEW
  // ==========================================================================
  async function loadExploreView(topicId) {
    activeTopic = topicId || 'all';

    // Populate topic tabs
    try {
      const res = await fetch('/api/topics');
      const data = await res.json();
      if (data.success) {
        renderExploreTabs(data.topics);
      }
    } catch (err) {
      console.error(err);
    }

    // Load questions for topic
    try {
      const qRes = await fetch(`/api/topics/${activeTopic}`);
      const qData = await qRes.json();
      if (qData.success) {
        currentQuestions = qData.questions;
        bannerTopicIcon.textContent = qData.topic.icon || '🌐';
        bannerTopicName.textContent = qData.topic.name || 'All Topics';
        bannerTopicDesc.textContent = qData.topic.description || 'Verified questions and comprehensive answers across all subjects.';
        bannerTopicCount.textContent = `${qData.count} Questions`;

        renderQuestionsList(qData.questions, exploreQuestionsContainer);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function renderExploreTabs(topics) {
    exploreTopicTabs.innerHTML = '';
    topics.forEach(t => {
      const btn = document.createElement('button');
      btn.className = `tab-btn ${t.id === activeTopic ? 'active' : ''}`;
      btn.textContent = `${t.icon} ${t.name} (${t.questionCount})`;
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        loadExploreView(t.id);
      });
      exploreTopicTabs.appendChild(btn);
    });
  }

  // ==========================================================================
  // 9. USER DASHBOARD
  // ==========================================================================
  async function loadDashboard() {
    if (!currentUser) {
      dashUserEmail.textContent = 'Guest Mode (Sign in with Gmail or Google to save progress)';
      dashReadinessScore.textContent = '70%';
    } else {
      dashUserEmail.textContent = `Registered Candidate: ${currentUser.email} (${currentUser.name})`;
    }

    metricPracticeSessions.textContent = practiceCount.toString();
    metricSavedQuestions.textContent = bookmarkedIds.size.toString();

    // Fetch dashboard stats from backend
    try {
      const userEmail = currentUser ? currentUser.email : 'candidate@gmail.com';
      const res = await fetch(`/api/dashboard/stats?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();

      if (data.success) {
        const stats = data.stats;
        metricTotalQuestions.textContent = `${stats.totalQuestionsInBank}+`;
        dashReadinessScore.textContent = `${stats.readinessScore}%`;

        // Render topic mastery bars
        renderTopicMastery(stats.topicStats);

        // Render saved questions
        savedCountBadge.textContent = `${bookmarkedIds.size} Saved`;
        if (bookmarkedIds.size === 0) {
          dashSavedQuestionsContainer.innerHTML = `
            <div class="empty-state">
              <p>No questions saved yet. Click the 🔖 bookmark icon on any question to review it here anytime!</p>
            </div>
          `;
        } else {
          // Fetch questions corresponding to bookmarks
          const allRes = await fetch('/api/topics/all');
          const allData = await allRes.json();
          if (allData.success) {
            const savedItems = allData.questions.filter(q => bookmarkedIds.has(q.id));
            currentQuestions = savedItems;
            renderQuestionsList(savedItems, dashSavedQuestionsContainer);
          }
        }
      }
    } catch (err) {
      console.error('Dashboard load failed:', err);
    }
  }

  function renderTopicMastery(topicStats) {
    if (!dashTopicMasteryGrid || !topicStats) return;
    dashTopicMasteryGrid.innerHTML = '';

    topicStats.forEach(ts => {
      const item = document.createElement('div');
      item.className = 'topic-mastery-item';
      item.innerHTML = `
        <div class="mastery-header">
          <span>${ts.icon} ${ts.topicName}</span>
          <span style="color: ${ts.color || 'var(--accent-primary)'};">${ts.masteryPercentage}%</span>
        </div>
        <div class="mastery-progress-bg">
          <div class="mastery-progress-fill" style="width: ${ts.masteryPercentage}%; background: ${ts.color || 'var(--accent-primary)'};"></div>
        </div>
      `;
      dashTopicMasteryGrid.appendChild(item);
    });
  }

  // ==========================================================================
  // 10. SEARCH BAR & LIVE FILTERING
  // ==========================================================================
  globalSearchInput.addEventListener('input', () => {
    const q = globalSearchInput.value.trim();
    if (q.length > 0) {
      searchClearBtn.classList.remove('hidden');
    } else {
      searchClearBtn.classList.add('hidden');
    }

    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
      executeSearch(q);
    }, 280);
  });

  headerSearchTopic.addEventListener('change', () => {
    executeSearch(globalSearchInput.value.trim());
  });

  searchClearBtn.addEventListener('click', () => {
    globalSearchInput.value = '';
    searchClearBtn.classList.add('hidden');
    switchView('home');
  });

  async function executeSearch(query) {
    const topic = headerSearchTopic.value;

    if (!query && topic === 'all') {
      if (activeView === 'search') switchView('home');
      return;
    }

    switchView('search', 'Search');
    searchResultsHeading.textContent = `🔍 Search: "${query || topic}"`;
    searchResultsSubheading.textContent = `Searching across questions, answers, and blueprints...`;

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&topic=${encodeURIComponent(topic)}`);
      const data = await res.json();

      if (data.success) {
        currentQuestions = data.results;
        searchResultsHeading.textContent = `🔍 Results for: "${query || topic}" (${data.count} found)`;
        searchResultsSubheading.textContent = `Found ${data.count} matching interview questions and model answers.`;
        renderQuestionsList(data.results, searchResultsContainer);
      }
    } catch (err) {
      console.error('Search error:', err);
    }
  }

  // ==========================================================================
  // 11. AUTHENTICATION (REGISTER GMAIL / SIGN IN / DIRECT GOOGLE)
  // ==========================================================================
  function updateAuthUI() {
    if (currentUser) {
      btnOpenLogin.classList.add('hidden');
      userProfileMenu.classList.remove('hidden');
      userDisplayName.textContent = currentUser.name || 'Candidate';
      userRoleBadge.textContent = currentUser.provider === 'google' ? 'Google Account' : (currentUser.email.endsWith('@gmail.com') ? 'Gmail Account' : 'Verified User');
      dashUserAvatar.textContent = currentUser.avatar || '👨‍💻';
    } else {
      btnOpenLogin.classList.remove('hidden');
      userProfileMenu.classList.add('hidden');
    }
  }

  // Open / Close Auth Modal
  btnOpenLogin.addEventListener('click', () => {
    authAlert.classList.add('hidden');
    loginModal.classList.remove('hidden');
  });

  modalCloseBtn.addEventListener('click', () => {
    loginModal.classList.add('hidden');
  });

  // Tab switching: Register vs Log In
  tabSignup.addEventListener('click', () => {
    tabSignup.classList.add('active');
    tabSignin.classList.remove('active');
    groupName.classList.remove('hidden');
    groupRole.classList.remove('hidden');
    btnAuthSubmit.textContent = 'Create Account with Gmail';
    authAlert.classList.add('hidden');
  });

  tabSignin.addEventListener('click', () => {
    tabSignin.classList.add('active');
    tabSignup.classList.remove('active');
    groupName.classList.add('hidden');
    groupRole.classList.add('hidden');
    btnAuthSubmit.textContent = 'Log In';
    authAlert.classList.add('hidden');
  });

  // Direct 1-Click Sign-in with Google
  btnGoogleAuth.addEventListener('click', async () => {
    try {
      const res = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'candidate.google@gmail.com',
          name: 'Google Candidate',
          avatar: '🌐'
        })
      });

      const data = await res.json();
      if (data.success) {
        currentUser = data.user;
        localStorage.setItem('study_user', JSON.stringify(currentUser));
        updateAuthUI();
        loginModal.classList.add('hidden');
        showToast('Signed in with Google successfully!');
      }
    } catch (err) {
      alert('Google authentication error: ' + err.message);
    }
  });

  // Quick Demo Account Login
  btnDemoLogin.addEventListener('click', async () => {
    authEmail.value = 'candidate@gmail.com';
    authPassword.value = 'password123';
    btnAuthSubmit.click();
  });

  // Form Submit: Register or Log in
  authForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const isRegister = tabSignup.classList.contains('active');
    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    const payload = {
      email: authEmail.value.trim(),
      password: authPassword.value,
      name: authName.value.trim(),
      targetRole: authTargetRole.value
    };

    authAlert.classList.add('hidden');

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Authentication failed');

      currentUser = data.user;
      localStorage.setItem('study_user', JSON.stringify(currentUser));
      updateAuthUI();
      loginModal.classList.add('hidden');
      showToast(isRegister ? 'Account created! Welcome to Get Ready for Study.' : 'Signed in successfully!');

    } catch (err) {
      authAlert.className = 'auth-alert error';
      authAlert.textContent = err.message;
      authAlert.classList.remove('hidden');
    }
  });

  // Profile Modal
  btnOpenProfile.addEventListener('click', () => {
    if (!currentUser) return;
    modalProfileName.textContent = currentUser.name || 'Candidate';
    modalProfileEmail.textContent = currentUser.email;
    profileProviderBadge.textContent = currentUser.provider ? currentUser.provider.toUpperCase() : 'EMAIL';
    profileRoleVal.textContent = currentUser.role || 'Full Stack Engineer';
    profileSavedVal.textContent = bookmarkedIds.size.toString();
    profileJoinedVal.textContent = currentUser.joinedDate || 'Sept 2026';
    profileModal.classList.remove('hidden');
  });

  profileCloseBtn.addEventListener('click', () => {
    profileModal.classList.add('hidden');
  });

  btnProfileToDashboard.addEventListener('click', () => {
    profileModal.classList.add('hidden');
    switchView('dashboard');
  });

  function performLogout() {
    currentUser = null;
    localStorage.removeItem('study_user');
    updateAuthUI();
    if (profileModal) profileModal.classList.add('hidden');
    showToast('Signed out successfully.');
    if (activeView === 'dashboard') switchView('home');
  }

  btnLogout.addEventListener('click', performLogout);
  btnProfileLogout.addEventListener('click', performLogout);

  // ==========================================================================
  // 12. CAREER HUB ROADMAPS LOADER
  // ==========================================================================
  async function loadCareerRoadmaps() {
    try {
      const res = await fetch('/api/career/roadmaps');
      const data = await res.json();
      if (data.success) {
        careerCardsContainer.innerHTML = '';
        data.roadmaps.forEach(rm => {
          const card = document.createElement('div');
          card.className = 'career-card';
          card.innerHTML = `
            <div style="font-size: 2rem; margin-bottom: 0.5rem;">${rm.icon}</div>
            <h3 style="font-size: 1.25rem; font-weight: 800; margin-bottom: 0.25rem;">${escapeHtml(rm.title)}</h3>
            <p style="color: var(--accent-primary); font-size: 0.85rem; font-weight: 700; margin-bottom: 0.75rem;">${escapeHtml(rm.salaryRange)}</p>
            <div style="margin-bottom: 0.85rem;">
              <strong style="font-size: 0.82rem; text-transform: uppercase; color: var(--text-muted);">Core Stack:</strong>
              <div style="display: flex; flex-wrap: wrap; gap: 0.35rem; margin-top: 0.35rem;">
                ${rm.coreSkills.map(s => `<span class="w-tag">${escapeHtml(s)}</span>`).join('')}
              </div>
            </div>
            <div style="margin-bottom: 0.85rem;">
              <strong style="font-size: 0.82rem; text-transform: uppercase; color: var(--text-muted);">Key Milestones:</strong>
              <ul style="padding-left: 1.25rem; font-size: 0.85rem; color: var(--text-secondary); margin-top: 0.35rem;">
                ${rm.careerMilestones.map(m => `<li>${escapeHtml(m)}</li>`).join('')}
              </ul>
            </div>
            <p style="font-size: 0.85rem; background: var(--bg-surface-elevated); padding: 0.65rem; border-radius: 8px;">
              <strong>🎯 Interview Focus:</strong> ${escapeHtml(rm.interviewPrepFocus)}
            </p>
          `;
          careerCardsContainer.appendChild(card);
        });
      }
    } catch (err) {
      console.error(err);
    }
  }

  // ==========================================================================
  // 13. EXPORT, PRINT, AND COPY ALL
  // ==========================================================================
  btnExportMd.addEventListener('click', async () => {
    if (currentQuestions.length === 0) return;
    try {
      const res = await fetch('/api/export/markdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questions: currentQuestions, meta: currentMeta })
      });
      const data = await res.json();
      if (data.success) {
        const blob = new Blob([data.markdown], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `interview-prep-${Date.now()}.md`;
        a.click();
      }
    } catch (err) {
      alert('Markdown export failed');
    }
  });

  btnCopyAll.addEventListener('click', () => {
    if (currentQuestions.length === 0) return;
    const allText = currentQuestions.map((q, i) =>
      `Question ${i + 1}: ${q.question}\nTopic: ${q.topicName || q.topic}\n\nModel Answer:\n${q.modelAnswer}\n\nBlueprint:\n${q.answerBlueprint}\n-----------------------------------\n`
    ).join('\n');

    navigator.clipboard.writeText(allText).then(() => {
      btnCopyAll.textContent = '✅ Copied!';
      setTimeout(() => { btnCopyAll.textContent = '📋 Copy All'; }, 2000);
    });
  });

  btnPrint.addEventListener('click', () => {
    window.print();
  });

  // ==========================================================================
  // 14. HELPER UTILITIES
  // ==========================================================================
  function getTopicColor(topicId) {
    const map = {
      c: '#3b82f6',
      cpp: '#6366f1',
      python: '#f59e0b',
      java: '#ef4444',
      sql: '#06b6d4',
      mysql: '#f97316',
      html: '#ea580c',
      css: '#0284c7',
      javascript: '#eab308',
      nodejs: '#10b981',
      react: '#06b6d4',
      ds: '#8b5cf6'
    };
    return map[topicId] || '#6366f1';
  }

  function formatMarkdownAnswer(text) {
    if (!text) return '';
    return escapeHtml(text)
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.1); padding: 0.15rem 0.35rem; border-radius: 4px; font-family: monospace;">$1</code>')
      .replace(/\n\n/g, '<br><br>')
      .replace(/\n/g, '<br>');
  }

  function escapeHtml(str) {
    if (!str) return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function showToast(msg) {
    const toast = document.createElement('div');
    toast.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--accent-gradient);
      color: white;
      padding: 0.75rem 1.25rem;
      border-radius: 10px;
      font-weight: 700;
      font-size: 0.88rem;
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      z-index: 9999;
      animation: fadeIn 0.3s ease;
    `;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // Initial Auth Check
  updateAuthUI();
});
