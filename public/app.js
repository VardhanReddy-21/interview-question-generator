/**
 * Get Ready for Study - Client Application Controller
 * Handles Navigation, 12-Topic Exploration, AI Generator, Dark/Light Mode,
 * Authentication (Gmail & Direct Google), Bookmarks, Dashboard, and Detailed Q&A Options.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // STATE MANAGEMENT
  // ==========================================================================
  let currentUser = null;
  try {
    currentUser = JSON.parse(localStorage.getItem('study_user') || 'null');
  } catch (e) {
    currentUser = null;
  }

  let currentTheme = 'dark';
  try {
    currentTheme = localStorage.getItem('study_theme') || 'dark';
  } catch (e) {
    currentTheme = 'dark';
  }

  let currentQuestions = [];
  let currentMeta = {};
  let activeView = 'home';
  let activeTopic = 'all';
  let searchTimeout = null;

  let bookmarkedIds = new Set();
  try {
    const savedBookmarks = JSON.parse(localStorage.getItem('study_bookmarks') || '[]');
    bookmarkedIds = new Set(savedBookmarks);
  } catch (e) {
    bookmarkedIds = new Set();
  }

  let practiceCount = 0;
  try {
    practiceCount = parseInt(localStorage.getItem('study_practice_count') || '0', 10);
  } catch (e) {
    practiceCount = 0;
  }

  // ==========================================================================
  // DOM ELEMENT REFERENCES
  // ==========================================================================
  // Navigation
  const brandHome = document.getElementById('brand-home');
  const navHome = document.getElementById('nav-home');
  const navExplore = document.getElementById('nav-explore');
  const navResume = document.getElementById('nav-resume');
  const navDashboard = document.getElementById('nav-dashboard');
  const navStudy = document.getElementById('nav-study');
  const navCareer = document.getElementById('nav-career');
  const btnBackHome = document.getElementById('btn-back-home');
  const breadcrumbBar = document.getElementById('breadcrumb-bar');
  const breadcrumbCurrentView = document.getElementById('breadcrumb-current-view');

  // Views
  const viewHome = document.getElementById('view-home');
  const viewExplore = document.getElementById('view-explore');
  const viewResume = document.getElementById('view-resume');
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
  const btnText = generateBtn ? generateBtn.querySelector('.btn-text') : null;
  const btnSpinner = generateBtn ? generateBtn.querySelector('.btn-spinner') : null;

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

  // Resume Review Elements
  const resumeTargetRole = document.getElementById('resume-target-role');
  const resumeJdInput = document.getElementById('resume-jd-input');
  const resumeTextInput = document.getElementById('resume-text-input');
  const resumeWordCount = document.getElementById('resume-word-count');
  const btnSampleResume = document.getElementById('btn-sample-resume');
  const btnClearResume = document.getElementById('btn-clear-resume');
  const btnScoreResume = document.getElementById('btn-score-resume');
  const spinnerResume = document.getElementById('spinner-resume');
  const resumeEmptyPrompt = document.getElementById('resume-empty-prompt');
  const resumeResultsContent = document.getElementById('resume-results-content');
  const resumeScoreGauge = document.getElementById('resume-score-gauge');
  const resumeScoreVal = document.getElementById('resume-score-val');
  const resumeTierBadge = document.getElementById('resume-tier-badge');
  const resumeTierTitle = document.getElementById('resume-tier-title');
  const resumeScoreDesc = document.getElementById('resume-score-desc');
  const scoreValVerbs = document.getElementById('score-val-verbs');
  const barVerbs = document.getElementById('bar-verbs');
  const scoreValTech = document.getElementById('score-val-tech');
  const barTech = document.getElementById('bar-tech');
  const scoreValMetrics = document.getElementById('score-val-metrics');
  const barMetrics = document.getElementById('bar-metrics');
  const scoreValSections = document.getElementById('score-val-sections');
  const barSections = document.getElementById('bar-sections');
  const resumeSectionsGroup = document.getElementById('resume-sections-group');
  const matchedCount = document.getElementById('matched-count');
  const resumeMatchedSkills = document.getElementById('resume-matched-skills');
  const resumeMissingSkills = document.getElementById('resume-missing-skills');
  const resumeFluffWrap = document.getElementById('resume-fluff-wrap');
  const resumeAdviceList = document.getElementById('resume-advice-list');

  // Resume File Upload Dropzone Elements
  const resumeDropzone = document.getElementById('resume-dropzone');
  const resumeFileInput = document.getElementById('resume-file-input');
  const dropzoneContent = document.getElementById('dropzone-content');
  const uploadedFileBanner = document.getElementById('uploaded-file-banner');
  const uploadedFileName = document.getElementById('uploaded-file-name');
  const uploadedFileSize = document.getElementById('uploaded-file-size');
  const fileIconBadge = document.getElementById('file-icon-badge');
  const btnRemoveFile = document.getElementById('btn-remove-file');
  const btnDownloadSample = document.getElementById('btn-download-sample');

  // ==========================================================================
  // 1. THEME SWITCHING (DARK / LIGHT MODE)
  // ==========================================================================
  function applyTheme(theme) {
    currentTheme = theme;
    try {
      localStorage.setItem('study_theme', theme);
    } catch (e) {}

    document.body.className = theme === 'dark' ? 'theme-dark' : 'theme-light';
    document.documentElement.setAttribute('data-theme', theme);

    const icon = document.getElementById('theme-icon');
    const label = document.getElementById('theme-label');
    if (icon && label) {
      if (theme === 'dark') {
        icon.textContent = '☀️';
        label.textContent = 'Light';
      } else {
        icon.textContent = '🌙';
        label.textContent = 'Dark';
      }
    }
  }

  // Apply theme safely now that DOM elements exist
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(nextTheme);
    });
  }

  // ==========================================================================
  // 2. VIEW NAVIGATION
  // ==========================================================================
  function switchView(viewName, label) {
    activeView = viewName;

    // Reset nav active states
    const navButtons = [navHome, navExplore, navResume, navDashboard, navStudy, navCareer];
    navButtons.forEach(b => { if (b) b.classList.remove('active'); });

    const viewSections = [viewHome, viewExplore, viewResume, viewDashboard, viewStudy, viewCareer, viewSearch];
    viewSections.forEach(v => { if (v) v.classList.add('hidden'); });

    if (viewName === 'home') {
      if (navHome) navHome.classList.add('active');
      if (viewHome) viewHome.classList.remove('hidden');
      if (breadcrumbBar) breadcrumbBar.classList.add('hidden');
    } else if (viewName === 'explore') {
      if (navExplore) navExplore.classList.add('active');
      if (viewExplore) viewExplore.classList.remove('hidden');
      if (breadcrumbBar) breadcrumbBar.classList.remove('hidden');
      if (breadcrumbCurrentView) breadcrumbCurrentView.textContent = label || 'Explore All Topics';
      loadExploreView(activeTopic);
    } else if (viewName === 'resume') {
      if (navResume) navResume.classList.add('active');
      if (viewResume) viewResume.classList.remove('hidden');
      if (breadcrumbBar) breadcrumbBar.classList.remove('hidden');
      if (breadcrumbCurrentView) breadcrumbCurrentView.textContent = label || 'Resume Review & ATS Rating';
    } else if (viewName === 'dashboard') {
      if (navDashboard) navDashboard.classList.add('active');
      if (viewDashboard) viewDashboard.classList.remove('hidden');
      if (breadcrumbBar) breadcrumbBar.classList.remove('hidden');
      if (breadcrumbCurrentView) breadcrumbCurrentView.textContent = 'Candidate Dashboard';
      loadDashboard();
    } else if (viewName === 'study') {
      if (navStudy) navStudy.classList.add('active');
      if (viewStudy) viewStudy.classList.remove('hidden');
      if (breadcrumbBar) breadcrumbBar.classList.remove('hidden');
      if (breadcrumbCurrentView) breadcrumbCurrentView.textContent = '7-Day Study Sprint';
    } else if (viewName === 'career') {
      if (navCareer) navCareer.classList.add('active');
      if (viewCareer) viewCareer.classList.remove('hidden');
      if (breadcrumbBar) breadcrumbBar.classList.remove('hidden');
      if (breadcrumbCurrentView) breadcrumbCurrentView.textContent = 'Career Hub & Roadmaps';
      loadCareerRoadmaps();
    } else if (viewName === 'search') {
      if (viewSearch) viewSearch.classList.remove('hidden');
      if (breadcrumbBar) breadcrumbBar.classList.remove('hidden');
      if (breadcrumbCurrentView) breadcrumbCurrentView.textContent = 'Search Results';
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  if (brandHome) brandHome.addEventListener('click', () => switchView('home'));
  if (navHome) navHome.addEventListener('click', () => switchView('home'));
  if (navExplore) navExplore.addEventListener('click', () => switchView('explore'));
  if (navResume) navResume.addEventListener('click', () => switchView('resume'));
  if (navDashboard) navDashboard.addEventListener('click', () => switchView('dashboard'));
  if (navStudy) navStudy.addEventListener('click', () => switchView('study'));
  if (navCareer) navCareer.addEventListener('click', () => switchView('career'));
  if (btnBackHome) btnBackHome.addEventListener('click', () => switchView('home'));

  if (btnWelcomeExplore) btnWelcomeExplore.addEventListener('click', () => switchView('explore'));
  if (btnWelcomeDemo) {
    btnWelcomeDemo.addEventListener('click', () => {
      if (topicSelect) topicSelect.value = 'all';
      if (countSelect) countSelect.value = '5';
      if (generateBtn) generateBtn.click();
    });
  }

  // ==========================================================================
  // 3. TOPIC SHORTCUT PILLS & SELECTION
  // ==========================================================================
  if (shortcutPillsList) {
    shortcutPillsList.addEventListener('click', (e) => {
      const pill = e.target.closest('.s-pill');
      if (!pill) return;

      document.querySelectorAll('.s-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');

      const topicId = pill.dataset.topic;
      activeTopic = topicId;

      if (headerSearchTopic) headerSearchTopic.value = topicId;
      if (topicSelect) topicSelect.value = topicId;

      if (activeView === 'explore') {
        loadExploreView(topicId);
      } else {
        switchView('explore', `Topic: ${pill.textContent}`);
      }
    });
  }

  // Custom role input toggle
  if (roleSelect) {
    roleSelect.addEventListener('change', () => {
      if (roleSelect.value === 'custom') {
        if (customRoleInput) {
          customRoleInput.classList.remove('hidden');
          customRoleInput.focus();
        }
      } else {
        if (customRoleInput) customRoleInput.classList.add('hidden');
      }
    });
  }

  // ==========================================================================
  // 4. QUESTION GENERATOR FORM SUBMISSION
  // ==========================================================================
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const selectedRole = roleSelect && roleSelect.value === 'custom'
        ? (customRoleInput ? customRoleInput.value.trim() : '') || 'Software Engineer'
        : (roleSelect ? roleSelect.value : 'Full Stack / Web Developer');

      const payload = {
        role: selectedRole,
        topic: topicSelect ? topicSelect.value : 'all',
        experienceLevel: experienceSelect ? experienceSelect.value : 'entry',
        category: categorySelect ? categorySelect.value : 'all',
        difficulty: difficultySelect ? difficultySelect.value : 'all',
        count: countSelect ? parseInt(countSelect.value, 10) : 5,
        jdText: jdInput ? jdInput.value.trim() : ''
      };

      // UI Loading state
      if (btnText) btnText.textContent = 'Generating verified Q&As...';
      if (btnSpinner) btnSpinner.classList.remove('hidden');
      if (generateBtn) generateBtn.disabled = true;

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
        if (questionsContainer) renderQuestionsList(currentQuestions, questionsContainer);

        // Show header & hide welcome
        if (welcomeCard) welcomeCard.classList.add('hidden');
        if (resultsHeader) resultsHeader.classList.remove('hidden');
        if (resultsTitle) {
          resultsTitle.textContent = `${payload.topic !== 'all' ? payload.topic.toUpperCase() + ' - ' : ''}${payload.role} (${currentQuestions.length} Questions)`;
        }
        if (resultsMeta) {
          resultsMeta.textContent = `Target Level: ${payload.experienceLevel.toUpperCase()} | Track: ${payload.category} | Verified Detailed Answers Ready`;
        }

        // Track practice activity
        practiceCount += currentQuestions.length;
        try {
          localStorage.setItem('study_practice_count', practiceCount);
        } catch (e) {}

      } catch (err) {
        console.error(err);
        alert('Error generating questions: ' + err.message);
      } finally {
        if (btnText) btnText.textContent = '✨ Generate Questions & Detailed Answers';
        if (btnSpinner) btnSpinner.classList.add('hidden');
        if (generateBtn) generateBtn.disabled = false;
      }
    });
  }

  // ==========================================================================
  // 5. RENDER QUESTION CARDS WITH DETAILED "SHOW MORE OPTIONS"
  // ==========================================================================
  function renderQuestionsList(questions, container) {
    if (!container) return;
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
              ${escapeHtml(q.topicName || q.topic || 'General')}
            </span>
            <span class="badge-diff ${q.difficulty || 'medium'}">${escapeHtml(q.difficulty || 'medium')}</span>
            <span class="badge-cat">${escapeHtml(q.category || 'technical')}</span>
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
                  <span class="code-lang">${escapeHtml(q.topicName || 'Code')}</span>
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
          <span class="q-id-tag">ID: ${escapeHtml(q.id)}</span>
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
    if (!container) return;

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
            const spanText = btn.querySelector('span:first-child');
            if (spanText) spanText.textContent = '🔍 Show More Details (Blueprint, Code, Complexity & Probes)';
          } else {
            drawer.classList.remove('hidden');
            btn.classList.add('open');
            const spanText = btn.querySelector('span:first-child');
            if (spanText) spanText.textContent = '🔼 Hide Details';
          }
        }
      });
    });

    // Copy Code Buttons
    container.querySelectorAll('.btn-copy-code').forEach(btn => {
      btn.addEventListener('click', () => {
        const rawCode = decodeURIComponent(btn.dataset.code || '');
        if (navigator.clipboard) {
          navigator.clipboard.writeText(rawCode).then(() => {
            btn.textContent = '✅ Copied!';
            setTimeout(() => { btn.textContent = '📋 Copy Code'; }, 2000);
          });
        }
      });
    });

    // Copy Answer Buttons
    container.querySelectorAll('.btn-copy-answer').forEach(btn => {
      btn.addEventListener('click', () => {
        const qid = btn.dataset.qid;
        const qObj = findQuestionById(qid);
        if (qObj && navigator.clipboard) {
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
        if (!practiceDrawer) return;

        const textarea = practiceDrawer.querySelector('.practice-textarea');
        const evalBox = document.getElementById(`eval-result-${qid}`);
        const userAns = textarea ? textarea.value.trim() : '';

        if (!userAns) {
          alert('Please type an answer first to evaluate.');
          return;
        }

        const qObj = findQuestionById(qid);
        if (!qObj) return;

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
          if (evalBox) {
            evalBox.classList.remove('hidden');
            evalBox.innerHTML = `
              <div class="eval-score-badge">Score: ${ev.score}/10 — ${escapeHtml(ev.verdict)}</div>
              <p style="font-size: 0.85rem; margin-bottom: 0.35rem;"><strong>Strengths:</strong> ${escapeHtml(ev.strengths.join(' '))}</p>
              <p style="font-size: 0.85rem; margin-bottom: 0.35rem; color: #f59e0b;"><strong>Improvements:</strong> ${escapeHtml(ev.improvements.join(' '))}</p>
              <p style="font-size: 0.82rem; color: var(--text-muted);"><strong>Next Step:</strong> ${escapeHtml(ev.nextStepSuggestion)}</p>
            `;
          }

          // Track practice session
          practiceCount++;
          try {
            localStorage.setItem('study_practice_count', practiceCount);
          } catch (e) {}

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
          window.speechSynthesis.cancel();
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

    try {
      localStorage.setItem('study_bookmarks', JSON.stringify(Array.from(bookmarkedIds)));
    } catch (e) {}

    if (btnElement) {
      btnElement.textContent = isBookmarked ? '★' : '☆';
      btnElement.classList.toggle('bookmarked', isBookmarked);
      btnElement.title = isBookmarked ? 'Remove from Saved' : 'Save to Dashboard';
    }

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

    try {
      const res = await fetch('/api/topics');
      const data = await res.json();
      if (data.success) {
        renderExploreTabs(data.topics);
      }
    } catch (err) {
      console.error(err);
    }

    try {
      const qRes = await fetch(`/api/topics/${activeTopic}`);
      const qData = await qRes.json();
      if (qData.success) {
        currentQuestions = qData.questions;
        if (bannerTopicIcon) bannerTopicIcon.textContent = qData.topic.icon || '🌐';
        if (bannerTopicName) bannerTopicName.textContent = qData.topic.name || 'All Topics';
        if (bannerTopicDesc) bannerTopicDesc.textContent = qData.topic.description || 'Verified questions and comprehensive answers across all subjects.';
        if (bannerTopicCount) bannerTopicCount.textContent = `${qData.count} Questions`;

        if (exploreQuestionsContainer) renderQuestionsList(qData.questions, exploreQuestionsContainer);
      }
    } catch (err) {
      console.error(err);
    }
  }

  function renderExploreTabs(topics) {
    if (!exploreTopicTabs || !topics) return;
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
      if (dashUserEmail) dashUserEmail.textContent = 'Guest Mode (Sign in with Gmail or Google to save progress)';
      if (dashReadinessScore) dashReadinessScore.textContent = '70%';
    } else {
      if (dashUserEmail) dashUserEmail.textContent = `Registered Candidate: ${currentUser.email} (${currentUser.name || 'Candidate'})`;
    }

    if (metricPracticeSessions) metricPracticeSessions.textContent = practiceCount.toString();
    if (metricSavedQuestions) metricSavedQuestions.textContent = bookmarkedIds.size.toString();

    try {
      const userEmail = currentUser ? currentUser.email : 'candidate@gmail.com';
      const res = await fetch(`/api/dashboard/stats?email=${encodeURIComponent(userEmail)}`);
      const data = await res.json();

      if (data.success) {
        const stats = data.stats;
        if (metricTotalQuestions) metricTotalQuestions.textContent = `${stats.totalQuestionsInBank}+`;
        if (dashReadinessScore) dashReadinessScore.textContent = `${stats.readinessScore}%`;

        renderTopicMastery(stats.topicStats);

        if (savedCountBadge) savedCountBadge.textContent = `${bookmarkedIds.size} Saved`;
        if (dashSavedQuestionsContainer) {
          if (bookmarkedIds.size === 0) {
            dashSavedQuestionsContainer.innerHTML = `
              <div class="empty-state">
                <p>No questions saved yet. Click the 🔖 bookmark icon on any question to review it here anytime!</p>
              </div>
            `;
          } else {
            const allRes = await fetch('/api/topics/all');
            const allData = await allRes.json();
            if (allData.success) {
              const savedItems = allData.questions.filter(q => bookmarkedIds.has(q.id));
              currentQuestions = savedItems;
              renderQuestionsList(savedItems, dashSavedQuestionsContainer);
            }
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
          <span>${ts.icon} ${escapeHtml(ts.topicName)}</span>
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
  if (globalSearchInput) {
    globalSearchInput.addEventListener('input', () => {
      const q = globalSearchInput.value.trim();
      if (searchClearBtn) {
        if (q.length > 0) searchClearBtn.classList.remove('hidden');
        else searchClearBtn.classList.add('hidden');
      }

      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        executeSearch(q);
      }, 280);
    });
  }

  if (headerSearchTopic) {
    headerSearchTopic.addEventListener('change', () => {
      executeSearch(globalSearchInput ? globalSearchInput.value.trim() : '');
    });
  }

  if (searchClearBtn) {
    searchClearBtn.addEventListener('click', () => {
      if (globalSearchInput) globalSearchInput.value = '';
      searchClearBtn.classList.add('hidden');
      switchView('home');
    });
  }

  async function executeSearch(query) {
    const topic = headerSearchTopic ? headerSearchTopic.value : 'all';

    if (!query && topic === 'all') {
      if (activeView === 'search') switchView('home');
      return;
    }

    switchView('search', 'Search');
    if (searchResultsHeading) searchResultsHeading.textContent = `🔍 Search: "${query || topic}"`;
    if (searchResultsSubheading) searchResultsSubheading.textContent = `Searching across questions, answers, and blueprints...`;

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&topic=${encodeURIComponent(topic)}`);
      const data = await res.json();

      if (data.success) {
        currentQuestions = data.results;
        if (searchResultsHeading) searchResultsHeading.textContent = `🔍 Results for: "${query || topic}" (${data.count} found)`;
        if (searchResultsSubheading) searchResultsSubheading.textContent = `Found ${data.count} matching interview questions and model answers.`;
        if (searchResultsContainer) renderQuestionsList(data.results, searchResultsContainer);
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
      if (btnOpenLogin) btnOpenLogin.classList.add('hidden');
      if (userProfileMenu) userProfileMenu.classList.remove('hidden');
      if (userDisplayName) userDisplayName.textContent = currentUser.name || 'Candidate';
      if (userRoleBadge) {
        const isGmail = currentUser.email && currentUser.email.toLowerCase().endsWith('@gmail.com');
        userRoleBadge.textContent = currentUser.provider === 'google' ? 'Google Account' : (isGmail ? 'Gmail Account' : 'Verified User');
      }
      if (dashUserAvatar) dashUserAvatar.textContent = currentUser.avatar || '👨‍💻';
    } else {
      if (btnOpenLogin) btnOpenLogin.classList.remove('hidden');
      if (userProfileMenu) userProfileMenu.classList.add('hidden');
    }
  }

  if (btnOpenLogin) {
    btnOpenLogin.addEventListener('click', () => {
      if (authAlert) authAlert.classList.add('hidden');
      if (loginModal) loginModal.classList.remove('hidden');
    });
  }

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', () => {
      if (loginModal) loginModal.classList.add('hidden');
    });
  }

  if (tabSignup) {
    tabSignup.addEventListener('click', () => {
      tabSignup.classList.add('active');
      if (tabSignin) tabSignin.classList.remove('active');
      if (groupName) groupName.classList.remove('hidden');
      if (groupRole) groupRole.classList.remove('hidden');
      if (btnAuthSubmit) btnAuthSubmit.textContent = 'Create Account with Gmail';
      if (authAlert) authAlert.classList.add('hidden');
    });
  }

  if (tabSignin) {
    tabSignin.addEventListener('click', () => {
      tabSignin.classList.add('active');
      if (tabSignup) tabSignup.classList.remove('active');
      if (groupName) groupName.classList.add('hidden');
      if (groupRole) groupRole.classList.add('hidden');
      if (btnAuthSubmit) btnAuthSubmit.textContent = 'Log In';
      if (authAlert) authAlert.classList.add('hidden');
    });
  }

  if (btnGoogleAuth) {
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
          try {
            localStorage.setItem('study_user', JSON.stringify(currentUser));
          } catch (e) {}
          updateAuthUI();
          if (loginModal) loginModal.classList.add('hidden');
          showToast('Signed in with Google successfully!');
        }
      } catch (err) {
        alert('Google authentication error: ' + err.message);
      }
    });
  }

  if (btnDemoLogin) {
    btnDemoLogin.addEventListener('click', async () => {
      if (authEmail) authEmail.value = 'candidate@gmail.com';
      if (authPassword) authPassword.value = 'password123';
      if (btnAuthSubmit) btnAuthSubmit.click();
    });
  }

  if (authForm) {
    authForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const isRegister = tabSignup ? tabSignup.classList.contains('active') : true;
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

      const payload = {
        email: authEmail ? authEmail.value.trim() : '',
        password: authPassword ? authPassword.value : '',
        name: authName ? authName.value.trim() : '',
        targetRole: authTargetRole ? authTargetRole.value : 'Full Stack Developer'
      };

      if (authAlert) authAlert.classList.add('hidden');

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!data.success) throw new Error(data.error || 'Authentication failed');

        currentUser = data.user;
        try {
          localStorage.setItem('study_user', JSON.stringify(currentUser));
        } catch (e) {}

        updateAuthUI();
        if (loginModal) loginModal.classList.add('hidden');
        showToast(isRegister ? 'Account created! Welcome to Get Ready for Study.' : 'Signed in successfully!');

      } catch (err) {
        if (authAlert) {
          authAlert.className = 'auth-alert error';
          authAlert.textContent = err.message;
          authAlert.classList.remove('hidden');
        }
      }
    });
  }

  if (btnOpenProfile) {
    btnOpenProfile.addEventListener('click', () => {
      if (!currentUser) return;
      if (modalProfileName) modalProfileName.textContent = currentUser.name || 'Candidate';
      if (modalProfileEmail) modalProfileEmail.textContent = currentUser.email || '';
      if (profileProviderBadge) profileProviderBadge.textContent = currentUser.provider ? currentUser.provider.toUpperCase() : 'EMAIL';
      if (profileRoleVal) profileRoleVal.textContent = currentUser.role || 'Full Stack Engineer';
      if (profileSavedVal) profileSavedVal.textContent = bookmarkedIds.size.toString();
      if (profileJoinedVal) profileJoinedVal.textContent = currentUser.joinedDate || 'Sept 2026';
      if (profileModal) profileModal.classList.remove('hidden');
    });
  }

  if (profileCloseBtn) {
    profileCloseBtn.addEventListener('click', () => {
      if (profileModal) profileModal.classList.add('hidden');
    });
  }

  if (btnProfileToDashboard) {
    btnProfileToDashboard.addEventListener('click', () => {
      if (profileModal) profileModal.classList.add('hidden');
      switchView('dashboard');
    });
  }

  function performLogout() {
    currentUser = null;
    try {
      localStorage.removeItem('study_user');
    } catch (e) {}
    updateAuthUI();
    if (profileModal) profileModal.classList.add('hidden');
    showToast('Signed out successfully.');
    if (activeView === 'dashboard') switchView('home');
  }

  if (btnLogout) btnLogout.addEventListener('click', performLogout);
  if (btnProfileLogout) btnProfileLogout.addEventListener('click', performLogout);

  // ==========================================================================
  // 12. CAREER HUB ROADMAPS LOADER
  // ==========================================================================
  async function loadCareerRoadmaps() {
    if (!careerCardsContainer) return;
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
  if (btnExportMd) {
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
  }

  if (btnCopyAll) {
    btnCopyAll.addEventListener('click', () => {
      if (currentQuestions.length === 0) return;
      const allText = currentQuestions.map((q, i) =>
        `Question ${i + 1}: ${q.question}\nTopic: ${q.topicName || q.topic}\n\nModel Answer:\n${q.modelAnswer}\n\nBlueprint:\n${q.answerBlueprint}\n-----------------------------------\n`
      ).join('\n');

      if (navigator.clipboard) {
        navigator.clipboard.writeText(allText).then(() => {
          btnCopyAll.textContent = '✅ Copied!';
          setTimeout(() => { btnCopyAll.textContent = '📋 Copy All'; }, 2000);
        });
      }
    });
  }

  if (btnPrint) {
    btnPrint.addEventListener('click', () => {
      window.print();
    });
  }

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
    return String(str)
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

  // ==========================================================================
  // 15. RESUME CHECKER & ATS RATING MODULE
  // ==========================================================================
  const SAMPLE_RESUME = `# Senior Full Stack & Distributed Systems Engineer
Email: candidate@gmail.com | Phone: +91-9876543210 | Bengaluru, India
GitHub: github.com/candidate-dev | Portfolio: candidate.dev

## Professional Summary
Results-driven Senior Software Engineer with 5+ years of experience architecting high-concurrency distributed web applications, optimizing databases, and deploying scalable microservices in Java, Python, and Node.js. Passionate about algorithms, low-latency performance, and clean code principles.

## Core Technical Skills
- Programming Languages: JavaScript (ES6+), TypeScript, Python, Java 17, C, C++, SQL
- Frontend: React.js, Next.js, Redux Toolkit, HTML5, CSS3, Tailwind CSS
- Backend & Frameworks: Node.js, Express, FastAPI, Spring Boot, Microservices
- Databases & Systems: MySQL (InnoDB), PostgreSQL, Redis caching, Apache Kafka
- DevOps & Cloud: Docker, Kubernetes, AWS (S3, EC2), CI/CD GitHub Actions

## Professional Experience
### Lead Software Engineer — TechSphere Solutions (2023 – Present)
- Architected and deployed event-driven payment processing microservices using Node.js, Express, and Redis, handling 4.5M daily transactions.
- Optimized slow MySQL queries and composite B-Tree indexes, reducing P99 latency by 42% and eliminating query timeouts.
- Designed responsive React frontends with custom hooks and debouncing, improving Largest Contentful Paint (LCP) by 35% for 180k active users.
- Spearheaded migration from monolithic architecture to containerized Docker services, accelerating deployment velocity by 65%.

### Software Engineer — CloudScale Systems (2021 – 2023)
- Engineered scalable RESTful APIs with Python FastAPI and PostgreSQL, serving 600k monthly API requests with 99.98% uptime.
- Developed real-time telemetry processing pipelines using Java Spring Boot and Apache Kafka, processing 15k messages per second.
- Implemented robust authentication with OAuth2 and JWT, securing sensitive customer transaction data.
- Mentored 4 junior engineers on data structures, algorithmic complexity, and unit testing practices.

## Key Projects
### HyperQueue — Distributed In-Memory Message Broker (C++ & Python)
- Built a high-performance multithreaded message queue in C++ utilizing ring buffers, lock-free concurrency, and socket programming.
- Achieved sub-50 microsecond delivery latency with zero packet drops under benchmark stress tests.

### CodeSprint — Real-Time Collaborative Coding Studio (React & Node.js)
- Implemented real-time code editor with WebSockets, syntax highlighting, and Docker-sandboxed remote code execution for 12 programming languages.

## Education
- B.Tech in Computer Science & Engineering, Top 5% Rank, 2021`;

  // Live word counter
  if (resumeTextInput) {
    resumeTextInput.addEventListener('input', () => {
      const text = resumeTextInput.value.trim();
      const words = text ? text.split(/\s+/).filter(w => w.length > 0).length : 0;
      if (resumeWordCount) {
        resumeWordCount.textContent = `${words} word${words === 1 ? '' : 's'}`;
      }
    });
  }

  // File Upload & Drag-and-Drop Handlers
  if (resumeDropzone && resumeFileInput) {
    ['dragenter', 'dragover'].forEach(eventName => {
      resumeDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        resumeDropzone.classList.add('dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      resumeDropzone.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        resumeDropzone.classList.remove('dragover');
      });
    });

    resumeDropzone.addEventListener('drop', (e) => {
      const dt = e.dataTransfer;
      const files = dt ? dt.files : null;
      if (files && files.length > 0) {
        handleResumeFile(files[0]);
      }
    });

    resumeFileInput.addEventListener('change', (e) => {
      if (e.target.files && e.target.files.length > 0) {
        handleResumeFile(e.target.files[0]);
      }
    });
  }

  if (btnRemoveFile) {
    btnRemoveFile.addEventListener('click', (e) => {
      e.stopPropagation();
      if (resumeFileInput) resumeFileInput.value = '';
      if (uploadedFileBanner) uploadedFileBanner.classList.add('hidden');
      if (dropzoneContent) dropzoneContent.classList.remove('hidden');
      if (resumeTextInput) {
        resumeTextInput.value = '';
        if (resumeWordCount) resumeWordCount.textContent = '0 words';
      }
      if (resumeResultsContent) resumeResultsContent.classList.add('hidden');
      if (resumeEmptyPrompt) resumeEmptyPrompt.classList.remove('hidden');
      showToast("Uploaded resume removed.");
    });
  }

  async function handleResumeFile(file) {
    if (!file) return;

    const fileName = file.name;
    const fileSizeKb = Math.round(file.size / 1024);
    const extension = fileName.split('.').pop().toLowerCase();

    // Show active uploaded file banner
    if (dropzoneContent) dropzoneContent.classList.add('hidden');
    if (uploadedFileBanner) uploadedFileBanner.classList.remove('hidden');
    if (uploadedFileName) uploadedFileName.textContent = fileName;
    if (uploadedFileSize) uploadedFileSize.textContent = `${fileSizeKb} KB • Extracting text...`;
    if (fileIconBadge) {
      fileIconBadge.textContent = extension === 'pdf' ? '📕' : (extension.includes('doc') ? '📘' : '📄');
    }

    try {
      let extractedText = '';

      if (extension === 'pdf') {
        if (window['pdfjs-dist/build/pdf']) {
          const pdfjsLib = window['pdfjs-dist/build/pdf'];
          pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
          const arrayBuffer = await file.arrayBuffer();
          const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          let fullText = '';
          for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map(item => item.str).join(' ');
            fullText += pageText + '\n';
          }
          extractedText = fullText.trim();
        } else {
          extractedText = await file.text();
        }
      } else if (extension === 'docx') {
        if (window.mammoth) {
          const arrayBuffer = await file.arrayBuffer();
          const result = await window.mammoth.extractRawText({ arrayBuffer });
          extractedText = result.value.trim();
        } else {
          extractedText = await file.text();
        }
      } else {
        extractedText = await file.text();
      }

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error("Could not extract readable text from this file. Please paste your resume text directly.");
      }

      if (resumeTextInput) {
        resumeTextInput.value = extractedText;
        const words = extractedText.split(/\s+/).filter(w => w.length > 0).length;
        if (resumeWordCount) {
          resumeWordCount.textContent = `${words} words`;
        }
      }

      if (uploadedFileSize) {
        uploadedFileSize.textContent = `${fileSizeKb} KB • Extracted`;
      }

      showToast(`📄 Uploaded: ${fileName} (${fileSizeKb} KB)`);

      // Auto-trigger score if sufficient words
      if (btnScoreResume) {
        setTimeout(() => {
          btnScoreResume.click();
        }, 300);
      }
    } catch (err) {
      console.error("Resume file extraction error:", err);
      alert(`Could not extract text from "${fileName}": ${err.message || 'Unknown error'}. Please paste your resume directly in the text area below.`);
      if (uploadedFileSize) {
        uploadedFileSize.textContent = `${fileSizeKb} KB • Extraction Failed`;
      }
    }
  }

  // Load sample resume button
  if (btnSampleResume) {
    btnSampleResume.addEventListener('click', () => {
      if (resumeTextInput) {
        resumeTextInput.value = SAMPLE_RESUME;
        const words = SAMPLE_RESUME.split(/\s+/).filter(w => w.length > 0).length;
        if (resumeWordCount) {
          resumeWordCount.textContent = `${words} words`;
        }
        showToast("⚡ Sample Senior Engineer Resume Loaded!");
      }
    });
  }

  // Download sample resume button (.txt file)
  if (btnDownloadSample) {
    btnDownloadSample.addEventListener('click', () => {
      const blob = new Blob([SAMPLE_RESUME], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Senior_Software_Engineer_Sample_Resume.txt';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast("📥 Sample Resume Downloaded! Try uploading it now.");
    });
  }

  // Clear resume button
  if (btnClearResume) {
    btnClearResume.addEventListener('click', () => {
      if (resumeTextInput) {
        resumeTextInput.value = '';
        if (resumeWordCount) resumeWordCount.textContent = '0 words';
      }
      if (resumeFileInput) resumeFileInput.value = '';
      if (uploadedFileBanner) uploadedFileBanner.classList.add('hidden');
      if (dropzoneContent) dropzoneContent.classList.remove('hidden');
      if (resumeResultsContent) resumeResultsContent.classList.add('hidden');
      if (resumeEmptyPrompt) resumeEmptyPrompt.classList.remove('hidden');
    });
  }

  // Rate My Resume button
  if (btnScoreResume) {
    btnScoreResume.addEventListener('click', async () => {
      const resumeText = resumeTextInput ? resumeTextInput.value.trim() : '';
      const targetRole = resumeTargetRole ? resumeTargetRole.value : 'Full Stack / Web Developer';
      const jdText = resumeJdInput ? resumeJdInput.value.trim() : '';

      if (!resumeText || resumeText.split(/\s+/).filter(w => w.length > 0).length < 20) {
        alert("Please paste at least 20 words of your resume (or click '⚡ Load Sample Resume') to analyze!");
        return;
      }

      // UI Loading state
      btnScoreResume.disabled = true;
      if (spinnerResume) spinnerResume.classList.remove('hidden');
      const originalText = btnScoreResume.querySelector('.btn-text');
      if (originalText) originalText.textContent = 'Analyzing ATS Metrics...';

      try {
        const response = await fetch('/api/resume/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ resumeText, targetRole, jdText })
        });

        const data = await response.json();
        if (!data.success) {
          alert(data.error || "Failed to analyze resume.");
          return;
        }

        renderResumeEvaluation(data);
        showToast(`✅ Resume Scored: ${data.score}/100!`);
      } catch (err) {
        console.error("Resume scoring error:", err);
        alert("An error occurred while evaluating the resume. Please check server logs.");
      } finally {
        btnScoreResume.disabled = false;
        if (spinnerResume) spinnerResume.classList.add('hidden');
        if (originalText) originalText.textContent = '✨ Rate My Resume';
      }
    });
  }

  function renderResumeEvaluation(data) {
    if (!resumeEmptyPrompt || !resumeResultsContent) return;

    resumeEmptyPrompt.classList.add('hidden');
    resumeResultsContent.classList.remove('hidden');

    // 1. Score gauge & badge
    if (resumeScoreVal) {
      animateNumber(resumeScoreVal, 0, data.score, 800);
    }

    if (resumeScoreGauge) {
      resumeScoreGauge.style.borderColor = data.tierColor || '#6366f1';
      resumeScoreGauge.style.boxShadow = `0 0 20px ${data.tierColor}40`;
    }

    if (resumeTierBadge) {
      resumeTierBadge.textContent = data.tierBadge || '⭐ Solid Foundation';
      resumeTierBadge.style.backgroundColor = `${data.tierColor}20`;
      resumeTierBadge.style.color = data.tierColor || '#10b981';
      resumeTierBadge.style.border = `1px solid ${data.tierColor}50`;
    }

    if (resumeTierTitle) {
      resumeTierTitle.textContent = data.tier || 'Candidate Profile';
    }

    if (resumeScoreDesc) {
      resumeScoreDesc.textContent = `Analyzed ${data.wordCount} words against ${data.matchedKeywordsCount} matched technical competencies.`;
    }

    // 2. Rubric Progress Bars
    const rubric = data.rubric || {};
    updateProgressBar(barVerbs, scoreValVerbs, rubric.impactAndVerbs || 0);
    updateProgressBar(barTech, scoreValTech, rubric.techKeywordAlignment || 0);
    updateProgressBar(barMetrics, scoreValMetrics, rubric.quantifiedOutcomes || 0);
    updateProgressBar(barSections, scoreValSections, rubric.atsStructure || 0);

    // 3. Core Sections Checklist
    if (resumeSectionsGroup) {
      resumeSectionsGroup.innerHTML = '';
      const secMap = [
        { key: 'summary', label: 'Summary / Profile' },
        { key: 'experience', label: 'Work Experience' },
        { key: 'projects', label: 'Technical Projects' },
        { key: 'skills', label: 'Technical Skills' },
        { key: 'education', label: 'Education & Degree' }
      ];

      secMap.forEach(sec => {
        const found = data.sectionsFound && data.sectionsFound[sec.key];
        const badge = document.createElement('span');
        badge.className = `sec-badge ${found ? 'found' : 'missing'}`;
        badge.innerHTML = `${found ? '✓' : '✗'} ${sec.label}`;
        resumeSectionsGroup.appendChild(badge);
      });
    }

    // 4. Matched Skills Pills
    if (matchedCount) matchedCount.textContent = data.matchedTechs ? data.matchedTechs.length : 0;
    if (resumeMatchedSkills) {
      resumeMatchedSkills.innerHTML = '';
      if (data.matchedTechs && data.matchedTechs.length > 0) {
        data.matchedTechs.forEach(tech => {
          const pill = document.createElement('span');
          pill.className = 'skill-pill match';
          pill.textContent = `✓ ${tech}`;
          resumeMatchedSkills.appendChild(pill);
        });
      } else {
        resumeMatchedSkills.innerHTML = '<span style="font-size:0.8rem; color:var(--text-muted);">No core stack keywords detected yet.</span>';
      }
    }

    // 5. Missing / Recommended Skills Pills
    if (resumeMissingSkills) {
      resumeMissingSkills.innerHTML = '';
      if (data.missingSkills && data.missingSkills.length > 0) {
        data.missingSkills.forEach(skill => {
          const pill = document.createElement('span');
          pill.className = 'skill-pill missing';
          pill.textContent = `+ ${skill}`;
          resumeMissingSkills.appendChild(pill);
        });
      } else {
        resumeMissingSkills.innerHTML = '<span style="font-size:0.8rem; color:#10b981;">Awesome! All target role competencies are represented.</span>';
      }
    }

    // 6. Detected Clichés / Fluff
    if (resumeFluffWrap && resumeFluffSkills) {
      if (data.detectedFluff && data.detectedFluff.length > 0) {
        resumeFluffWrap.classList.remove('hidden');
        resumeFluffSkills.innerHTML = '';
        data.detectedFluff.forEach(fluff => {
          const pill = document.createElement('span');
          pill.className = 'skill-pill fluff';
          pill.textContent = `"${fluff}"`;
          resumeFluffSkills.appendChild(pill);
        });
      } else {
        resumeFluffWrap.classList.add('hidden');
      }
    }

    // 7. Actionable Recommendations List
    if (resumeAdviceList) {
      resumeAdviceList.innerHTML = '';
      if (data.recommendations && data.recommendations.length > 0) {
        data.recommendations.forEach(rec => {
          const li = document.createElement('li');
          li.className = 'rec-item';
          li.innerHTML = `<span class="rec-icon">⚡</span><span>${escapeHtml(rec)}</span>`;
          resumeAdviceList.appendChild(li);
        });
      }
    }
  }

  function updateProgressBar(barEl, textEl, percentage) {
    const val = Math.max(0, Math.min(100, percentage));
    if (barEl) barEl.style.width = `${val}%`;
    if (textEl) textEl.textContent = `${val}%`;
  }

  function animateNumber(element, start, end, duration) {
    if (!element) return;
    const startTime = performance.now();
    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentVal = Math.round(start + (end - start) * progress);
      element.textContent = currentVal;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }
    requestAnimationFrame(update);
  }

  // Initial Auth Check
  updateAuthUI();
});
