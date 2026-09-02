const API_URL = 'http://localhost:5000';

// Chat History
let chatHistory = JSON.parse(localStorage.getItem('adibotHistory') || '[]');
let currentUser = null;

// Elements
const fileInput = document.getElementById('fileInput');
const browseBtn = document.getElementById('browseBtn');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const fileInfo = document.getElementById('fileInfo');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const uploadArea = document.getElementById('uploadArea');
const guestActions = document.getElementById('guestActions');
const userBadge = document.getElementById('userBadge');
const userNameText = document.getElementById('userNameText');
const logoutBtn = document.getElementById('logoutBtn');
const authModal = document.getElementById('authModal');
const authForm = document.getElementById('authForm');
const authName = document.getElementById('authName');
const authEmail = document.getElementById('authEmail');
const authPassword = document.getElementById('authPassword');
const authSubmitBtn = document.getElementById('authSubmitBtn');
const authMessage = document.getElementById('authMessage');
const nameField = document.getElementById('nameField');
const closeAuthModal = document.getElementById('closeAuthModal');

let authMode = 'login';

function getAuthHeaders() {
  const token = localStorage.getItem('adibotAuthToken');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function updateAuthUI() {
  const hasUser = !!currentUser;
  guestActions.classList.toggle('hidden', hasUser);
  userBadge.classList.toggle('hidden', !hasUser);

  if (hasUser) {
    userNameText.textContent = currentUser.name || 'User';
    uploadBtn.disabled = !fileInput.files[0];
    sendBtn.disabled = false;
  } else {
    uploadBtn.disabled = true;
    sendBtn.disabled = true;
  }
}

async function restoreSession() {
  const token = localStorage.getItem('adibotAuthToken');
  if (!token) {
    currentUser = null;
    updateAuthUI();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/me`, {
      headers: getAuthHeaders()
    });

    if (!response.ok) {
      throw new Error('session invalid');
    }

    const data = await response.json();
    currentUser = data.user;
    updateAuthUI();
  } catch (error) {
    localStorage.removeItem('adibotAuthToken');
    localStorage.removeItem('adibotUser');
    currentUser = null;
    updateAuthUI();
  }
}

function openAuthModal(mode) {
  authMode = mode;
  const isSignup = mode === 'signup';
  nameField.classList.toggle('hidden', !isSignup);
  authSubmitBtn.textContent = isSignup ? 'Create account' : 'Login';
  authMessage.textContent = '';
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.mode === mode);
  });
  authModal.classList.remove('hidden');
  authModal.setAttribute('aria-hidden', 'false');
  if (isSignup) {
    authName.focus();
  } else {
    authEmail.focus();
  }
}

function closeAuthModalUI() {
  authModal.classList.add('hidden');
  authModal.setAttribute('aria-hidden', 'true');
  authForm.reset();
  authMessage.textContent = '';
}

async function submitAuthForm(event) {
  event.preventDefault();
  const payload = {
    email: authEmail.value.trim(),
    password: authPassword.value.trim()
  };

  if (authMode === 'signup') {
    payload.name = authName.value.trim();
  }

  if (!payload.email || !payload.password || (authMode === 'signup' && !payload.name)) {
    authMessage.textContent = 'Please fill in all required fields.';
    authMessage.className = 'auth-message error';
    return;
  }

  authSubmitBtn.disabled = true;
  authMessage.textContent = authMode === 'signup' ? 'Creating account...' : 'Signing in...';
  authMessage.className = 'auth-message';

  try {
    const response = await fetch(`${API_URL}/${authMode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    currentUser = data.user;
    localStorage.setItem('adibotAuthToken', data.token);
    localStorage.setItem('adibotUser', JSON.stringify(data.user));
    updateAuthUI();
    closeAuthModalUI();
    addSuccessMessage(`✅ Welcome, ${currentUser.name}!`);
  } catch (error) {
    authMessage.textContent = error.message;
    authMessage.className = 'auth-message error';
  } finally {
    authSubmitBtn.disabled = false;
  }
}

function logoutUser() {
  currentUser = null;
  localStorage.removeItem('adibotAuthToken');
  localStorage.removeItem('adibotUser');
  updateAuthUI();
  addSuccessMessage('✅ Logged out successfully.');
}

const authButtons = document.querySelectorAll('.auth-btn');
authButtons.forEach(button => {
  button.addEventListener('click', () => openAuthModal(button.dataset.mode));
});

document.querySelectorAll('.auth-tab').forEach(tab => {
  tab.addEventListener('click', () => openAuthModal(tab.dataset.mode));
});

closeAuthModal.addEventListener('click', closeAuthModalUI);
authModal.addEventListener('click', (event) => {
  if (event.target === authModal) closeAuthModalUI();
});
authForm.addEventListener('submit', submitAuthForm);
logoutBtn.addEventListener('click', logoutUser);

// Browse Button Click
browseBtn.addEventListener('click', (e) => {
  e.preventDefault();
  e.stopPropagation();
  if (!currentUser) {
    addBotMessage('Please log in to upload a PDF and use AdiBot.');
    openAuthModal('login');
    return;
  }
  fileInput.click();
});

// File Selected
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    fileInfo.textContent = '📄 ' + file.name;
    fileInfo.style.display = 'block';
    uploadBtn.disabled = false;
  }
});

// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#e94560';
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.borderColor = '#cbd5e0';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#cbd5e0';
  if (!currentUser) {
    addBotMessage('Please log in to upload a PDF and use AdiBot.');
    openAuthModal('login');
    return;
  }
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    fileInput.files = e.dataTransfer.files;
    fileInfo.textContent = '📄 ' + file.name;
    fileInfo.style.display = 'block';
    uploadBtn.disabled = false;
  }
});

// Upload PDF
uploadBtn.addEventListener('click', async () => {
  if (!currentUser) {
    openAuthModal('login');
    showStatus('❌ Please log in first.', 'error');
    return;
  }

  const file = fileInput.files[0];
  if (!file) return;

  uploadBtn.disabled = true;
  showStatus('⏳ Processing PDF...', 'loading');

  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData,
      headers: getAuthHeaders()
    });
    const data = await response.json();

    if (response.ok) {
      addSuccessMessage('✅ Document uploaded successfully! Generating summary... ⏳');
      showStatus('✅ PDF processed successfully!', 'success');
      try {
        const summaryRes = await fetch(`${API_URL}/summarize`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...getAuthHeaders() }
        });
        const summaryData = await summaryRes.json();

        if (summaryData && summaryData.summary) {
          addBotMessage(`📋 Document Summary:\n\n${summaryData.summary}\n\nYou can now ask me anything! 🎓`, [], 0);
        } else {
          addBotMessage('Document ready! Ask me anything about Aditya College! 🎓', [], 0);
        }
      } catch (err) {
        addBotMessage('Document ready! Ask me anything about Aditya College! 🎓', [], 0);
      }
      uploadBtn.disabled = false;
    } else {
      showStatus('❌ ' + (data.error || 'Upload failed'), 'error');
      uploadBtn.disabled = false;
    }
  } catch (error) {
    showStatus('❌ Server not running!', 'error');
    uploadBtn.disabled = false;
  }
});

// Show Status
function showStatus(msg, type) {
  uploadStatus.textContent = msg;
  uploadStatus.className = 'upload-status ' + type;
}

// Add Success Message (Green)
function addSuccessMessage(text) {
  const div = document.createElement('div');
  div.className = 'message bot';
  div.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble success-bubble">
      <p>${text}</p>
    </div>`;
  chatMessages.appendChild(div);
  scrollBottom();
}

// Add Bot Message
function addBotMessage(text, sources = [], confidence = 0) {
  const div = document.createElement('div');
  div.className = 'message bot';

  const confColor = confidence > 70 ? '#48bb78' :
    confidence > 40 ? '#ed8936' : '#e94560';

  const confidenceHTML = confidence > 0 ? `
    <div class="confidence-bar">
      <span class="confidence-label">Confidence:</span>
      <div class="confidence-track">
        <div class="confidence-fill" style="width:${confidence}%;background:${confColor}"></div>
      </div>
      <span class="confidence-value" style="color:${confColor}">${confidence}%</span>
    </div>` : '';

  const sourcesHTML = sources && sources.length > 0 ? `
    <div class="sources-section">
      <p class="sources-title">📚 Sources Used:</p>
      ${sources.map(s => `
        <div class="source-item">
          <span class="source-id">Source ${s.id}</span>
          <span class="source-text">${s.text}</span>
          <span class="source-score" style="color:${confColor}">${s.score}% match</span>
        </div>`).join('')}
    </div>` : '';

  const feedbackHTML = `
    <div class="feedback-section">
      <span class="feedback-label">Was this helpful?</span>
      <button class="feedback-btn" onclick="handleFeedback(this,'up')">👍</button>
      <button class="feedback-btn" onclick="handleFeedback(this,'down')">👎</button>
    </div>`;

  div.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble">
      <p>${text}</p>
      ${confidenceHTML}
      ${sourcesHTML}
      ${feedbackHTML}
    </div>`;

  chatMessages.appendChild(div);
  scrollBottom();
}

// Add User Message
function addUserMessage(text) {
  const div = document.createElement('div');
  div.className = 'message user';
  div.innerHTML = `
    <div class="avatar">👤</div>
    <div class="bubble"><p>${text}</p></div>`;
  chatMessages.appendChild(div);
  scrollBottom();
}

// Typing Indicator
function addTyping() {
  const div = document.createElement('div');
  div.className = 'message bot';
  div.id = 'typing';
  div.innerHTML = `
    <div class="avatar">🤖</div>
    <div class="bubble">
      <p style="font-size:12px;color:#718096">
        ⏳ Thinking... (may take 30s first time)
      </p>
      <div class="typing">
        <span></span><span></span><span></span>
      </div>
    </div>`;
  chatMessages.appendChild(div);
  scrollBottom();
}

function removeTyping() {
  const t = document.getElementById('typing');
  if (t) t.remove();
}

function scrollBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send Message
async function sendMessage() {
  if (!currentUser) {
    addBotMessage('Please log in before sending messages.');
    openAuthModal('login');
    return;
  }

  const question = chatInput.value.trim();
  if (!question) return;

  addUserMessage(question);
  chatInput.value = '';
  sendBtn.disabled = true;
  addTyping();

  chatHistory.unshift({
    question,
    time: new Date().toLocaleTimeString()
  });
  if (chatHistory.length > 10) chatHistory.pop();
  localStorage.setItem('adibotHistory', JSON.stringify(chatHistory));
  updateHistory();

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
      body: JSON.stringify({ question }),
      signal: AbortSignal.timeout(60000)
    });
    const data = await response.json();
    removeTyping();

    if (response.ok) {
      const answer = data.answer || 'Sorry I could not find an answer!';
      const sources = data.sources || [];
      const confidence = data.confidence || 0;
      addBotMessage(answer, sources, confidence);
    } else {
      const errorText = data?.error || 'Unable to get response from the server.';
      addBotMessage(`❌ ${errorText}`);
    }
  } catch (error) {
    removeTyping();
    addBotMessage('❌ Cannot connect to server!');
  }

  sendBtn.disabled = false;
  chatInput.focus();
}

// Feedback
function handleFeedback(btn, type) {
  btn.parentElement.innerHTML = type === 'up' ?
    '<span style="color:#48bb78">✅ Thanks for feedback!</span>' :
    '<span style="color:#e94560">Sorry! We will improve!</span>';
}

// Update History
function updateHistory() {
  const container = document.getElementById('historyContainer');
  if (!container) return;
  if (chatHistory.length === 0) {
    container.innerHTML = '<p class="no-history">No history yet</p>';
    return;
  }
  container.innerHTML = chatHistory.map(item => `
    <div class="history-item" onclick="loadHistory('${item.question.replace(/'/g, "\\'")}')">
      <div class="history-time">${item.time}</div>
      <div class="history-question">❓ ${item.question}</div>
    </div>`).join('');
}

function loadHistory(question) {
  chatInput.value = question;
  chatInput.focus();
}

// Export Chat
function exportChat() {
  const messages = document.querySelectorAll('.message');
  let exportText = 'AdiBot Chat Export\n';
  exportText += 'Aditya College of Engineering & Technology\n';
  exportText += '==========================================\n';
  exportText += `Date: ${new Date().toLocaleDateString()}\n`;
  exportText += `Time: ${new Date().toLocaleTimeString()}\n`;
  exportText += '==========================================\n\n';

  messages.forEach(msg => {
    const isBot = msg.classList.contains('bot');
    const bubble = msg.querySelector('.bubble p');
    if (bubble) {
      const role = isBot ? '🤖 AdiBot' : '👤 You';
      exportText += `${role}:\n${bubble.textContent}\n\n`;
    }
  });

  exportText += '==========================================\n';
  exportText += 'Exported from AdiBot — Aditya College AI Assistant\n';

  const blob = new Blob([exportText], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `AdiBot-Chat-${new Date().toLocaleDateString()}.txt`;
  a.click();
  URL.revokeObjectURL(url);
}

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

clearBtn.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  addSuccessMessage('Chat cleared! Ask me anything about Aditya College 🎓');
});

document.querySelectorAll('.suggestion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!currentUser) {
      openAuthModal('login');
      addBotMessage('Please log in to use the chatbot.');
      return;
    }
    chatInput.value = btn.textContent;
    sendMessage();
  });
});

// Initialize
try {
  const savedUser = JSON.parse(localStorage.getItem('adibotUser') || 'null');
  if (savedUser) {
    currentUser = savedUser;
  }
  updateAuthUI();
  restoreSession();
} catch (error) {
  currentUser = null;
  updateAuthUI();
}
updateHistory();
