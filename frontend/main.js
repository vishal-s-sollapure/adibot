const API_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://adibot-3w4u.onrender.com';

// Chat History
let chatHistory = JSON.parse(localStorage.getItem('adibotHistory') || '[]');

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

// Browse Button Click
browseBtn.addEventListener('click', () => fileInput.click());

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
  const file = fileInput.files[0];
  if (!file) return;

  uploadBtn.disabled = true;
  showStatus('⏳ Processing PDF...', 'loading');

  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    const data = await response.json();
    if (response.ok) {
      showStatus('✅ Uploaded successfully!', 'success');
      fileInfo.textContent = '📄 ' + file.name + ' • uploaded successfully';
      showToast('✅ PDF uploaded successfully!');
      addBotMessage('File uploaded successfully! You can now ask anything about Aditya College... 🎓', [], 0);
      uploadBtn.disabled = false;
    } else {
      showStatus('❌ ' + data.error, 'error');
      showToast('❌ Upload failed: ' + data.error, true);
      uploadBtn.disabled = false;
    }
  } catch (error) {
    showStatus('❌ Server not running!', 'error');
    showToast('❌ Server not running!', true);
    uploadBtn.disabled = false;
  }
});

function showStatus(msg, type) {
  uploadStatus.textContent = msg;
  uploadStatus.className = 'upload-status ' + type;
}

function showToast(message, isError = false) {
  const toast = document.getElementById('uploadToast');
  if (!toast) return;

  toast.textContent = message;
  toast.classList.remove('show', 'error');
  if (isError) {
    toast.classList.add('error');
  }
  toast.classList.add('show');

  clearTimeout(toast.hideTimer);
  toast.hideTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2500);
}

// Add Bot Message
function addBotMessage(text, sources = [], confidence = 0) {
  const div = document.createElement('div');
  div.className = 'message bot';

  const confColor = confidence > 70 ? '#48bb78' : confidence > 40 ? '#ed8936' : '#e94560';

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
      <p style="font-size:12px;color:#718096">⏳ Thinking... (may take 30s first time)</p>
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
  const question = chatInput.value.trim();
  if (!question) return;

  addUserMessage(question);
  chatInput.value = '';
  sendBtn.disabled = true;
  addTyping();

  // Save to history
  chatHistory.unshift({ question, time: new Date().toLocaleTimeString() });
  if (chatHistory.length > 10) chatHistory.pop();
  localStorage.setItem('adibotHistory', JSON.stringify(chatHistory));
  updateHistory();

  try {
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal: AbortSignal.timeout(60000)
    });
    const data = await response.json();
    removeTyping();
    if (response.ok) {
      addBotMessage(data.answer, data.sources, data.confidence);
    } else {
      addBotMessage('Sorry, could not get answer. Please try again!');
    }
  } catch (error) {
    removeTyping();
    addBotMessage('❌ Cannot connect to server. Make sure backend is running!');
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

// Event Listeners
sendBtn.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

clearBtn.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  addBotMessage('Chat cleared! Ask me anything about Aditya College 🎓', [], 0);
});

document.querySelectorAll('.suggestion-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    chatInput.value = btn.textContent;
    sendMessage();
  });
});

// Initialize
updateHistory();