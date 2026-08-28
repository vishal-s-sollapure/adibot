// Backend URL
const API_URL = 'https://adibot-3w4u.onrender.com';
// Elements
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const uploadStatus = document.getElementById('uploadStatus');
const fileInfo = document.getElementById('fileInfo');
const fileName = document.getElementById('fileName');
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendBtn = document.getElementById('sendBtn');
const clearBtn = document.getElementById('clearBtn');
const uploadArea = document.getElementById('uploadArea');
const suggestionBtns = document.querySelectorAll('.suggestion-btn');
const CHAT_TIMEOUT_MS = 35000;

// File Selection
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (file) {
    fileName.textContent = '📄 ' + file.name;
    fileInfo.style.display = 'block';
    uploadBtn.disabled = false;
  }
});

// Drag and Drop
uploadArea.addEventListener('dragover', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#e94560';
  uploadArea.style.background = '#fff5f5';
});

uploadArea.addEventListener('dragleave', () => {
  uploadArea.style.borderColor = '#cbd5e0';
  uploadArea.style.background = 'white';
});

uploadArea.addEventListener('drop', (e) => {
  e.preventDefault();
  uploadArea.style.borderColor = '#cbd5e0';
  uploadArea.style.background = 'white';
  const file = e.dataTransfer.files[0];
  if (file && file.type === 'application/pdf') {
    fileInput.files = e.dataTransfer.files;
    fileName.textContent = '📄 ' + file.name;
    fileInfo.style.display = 'block';
    uploadBtn.disabled = false;
  } else {
    showUploadStatus('Please upload a PDF file only!', 'error');
  }
});

// Upload PDF
uploadBtn.addEventListener('click', async () => {
  const file = fileInput.files[0];
  if (!file) return;

  uploadBtn.disabled = true;
  showUploadStatus('⏳ Uploading and processing PDF...', 'loading');

  const formData = new FormData();
  formData.append('pdf', file);

  try {
    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (response.ok) {
      fileName.textContent = '✅ ' + file.name + ' uploaded successfully';
      uploadBtn.textContent = 'Uploaded & Processed';
      showUploadStatus(data.message || 'PDF processed successfully! You can now ask questions.', 'success');
      addBotMessage('Great! I have processed your college document. You can now ask me anything about Aditya College! 🎓');
    } else {
      showUploadStatus('❌ ' + (data.error || 'Failed to process PDF.'), 'error');
      uploadBtn.disabled = false;
    }
  } catch (error) {
    showUploadStatus('❌ Server not running. Start backend first!', 'error');
    uploadBtn.disabled = false;
  }
});

// Show Upload Status
function showUploadStatus(message, type) {
  uploadStatus.textContent = message;
  uploadStatus.className = 'upload-status ' + type;
}

// Add Bot Message
function addBotMessage(text) {
  const message = document.createElement('div');
  message.className = 'message bot-message';
  message.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <p>${text}</p>
    </div>
  `;
  chatMessages.appendChild(message);
  scrollToBottom();
}

// Add User Message
function addUserMessage(text) {
  const message = document.createElement('div');
  message.className = 'message user-message';
  message.innerHTML = `
    <div class="message-avatar">👤</div>
    <div class="message-content">
      <p>${text}</p>
    </div>
  `;
  chatMessages.appendChild(message);
  scrollToBottom();
}

// Add Typing Indicator
function addTypingIndicator() {
  const typing = document.createElement('div');
  typing.className = 'message bot-message';
  typing.id = 'typingIndicator';
  typing.innerHTML = `
    <div class="message-avatar">🤖</div>
    <div class="message-content">
      <div class="typing">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  chatMessages.appendChild(typing);
  scrollToBottom();
}

// Remove Typing Indicator
function removeTypingIndicator() {
  const typing = document.getElementById('typingIndicator');
  if (typing) typing.remove();
}

// Scroll to Bottom
function scrollToBottom() {
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Send Message
async function sendMessage() {
  const question = chatInput.value.trim();
  if (!question) return;

  addUserMessage(question);
  chatInput.value = '';
  sendBtn.disabled = true;
  addTypingIndicator();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), CHAT_TIMEOUT_MS);
    const response = await fetch(`${API_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    const data = await response.json();
    removeTypingIndicator();

    if (response.ok) {
      addBotMessage(data.answer);
    } else {
      addBotMessage(data.error || 'Sorry, I could not get an answer. Please try again!');
    }
  } catch (error) {
    removeTypingIndicator();
    if (error.name === 'AbortError') {
      addBotMessage('The AI service is taking too long to respond. Please try again.');
    } else {
      addBotMessage('Cannot connect to the AI service. Please try again in a moment.');
    }
  }

  sendBtn.disabled = false;
  chatInput.focus();
}

// Send on Button Click
sendBtn.addEventListener('click', sendMessage);

// Send on Enter Key
chatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Suggestion Buttons
suggestionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    chatInput.value = btn.textContent;
    sendMessage();
  });
});

// Clear Chat
clearBtn.addEventListener('click', () => {
  chatMessages.innerHTML = '';
  addBotMessage('Chat cleared! Ask me anything about Aditya College 🎓');
});