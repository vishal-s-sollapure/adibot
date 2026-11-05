const DEFAULT_REMOTE_API = 'https://adibot-3w4u.onrender.com';
const LOCAL_API = 'http://localhost:5000';
const ADMIN_TOKEN_KEY = 'adibotAdminToken';

function getInitialApiBase() {
  const hostname = window.location.hostname;
  const isLocal = hostname === 'localhost' || hostname === '127.0.0.1' || window.location.protocol === 'file:';
  if (isLocal) {
    if (window.location.port === '5000') {
      return '';
    }
    return LOCAL_API;
  }
  return DEFAULT_REMOTE_API;
}

let activeApiBase = getInitialApiBase();
let localFailed = (activeApiBase === DEFAULT_REMOTE_API);

function isNetworkError(error) {
  if (!error) return false;
  if (error.name === 'TypeError' || error.name === 'AbortError') return true;
  const msg = String(error.message || '').toLowerCase();
  return (
    msg.includes('fetch') ||
    msg.includes('network') ||
    msg.includes('load failed') ||
    msg.includes('connection refused') ||
    msg.includes('aborted')
  );
}

async function adminFetch(endpoint, options = {}) {
  const shouldTryLocal = !localFailed && (activeApiBase === LOCAL_API || activeApiBase === '');
  const candidateBase = shouldTryLocal ? activeApiBase : DEFAULT_REMOTE_API;
  const initialUrl = `${candidateBase}/admin${endpoint}`;

  if (shouldTryLocal) {
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;
    const fetchOptions = controller ? { ...options, signal: controller.signal } : { ...options };

    try {
      const response = await fetch(initialUrl, fetchOptions);
      if (timeoutId) clearTimeout(timeoutId);
      if (response.status === 404) {
        throw new Error('Local server returned 404 on admin route');
      }
      return response;
    } catch (localError) {
      if (timeoutId) clearTimeout(timeoutId);
      console.warn(`Local admin API (${candidateBase}) unreachable. Retrying with remote API (${DEFAULT_REMOTE_API}).`, localError.message);
      localFailed = true;
      activeApiBase = DEFAULT_REMOTE_API;
    }
  }

  const remoteUrl = `${DEFAULT_REMOTE_API}/admin${endpoint}`;
  return await fetch(remoteUrl, options);
}

const elements = {
  loginScreen: document.getElementById('loginScreen'),
  dashboard: document.getElementById('dashboard'),
  loginForm: document.getElementById('loginForm'),
  password: document.getElementById('adminPassword'),
  togglePassword: document.getElementById('togglePassword'),
  loginMessage: document.getElementById('loginMessage'),
  totalQuestions: document.getElementById('totalQuestions'),
  totalUploads: document.getElementById('totalUploads'),
  totalUsers: document.getElementById('totalUsers'),
  documentsBody: document.getElementById('documentsBody'),
  questionsBody: document.getElementById('questionsBody'),
  documentsEmpty: document.getElementById('documentsEmpty'),
  questionsEmpty: document.getElementById('questionsEmpty'),
  documentCount: document.getElementById('documentCount'),
  questionCount: document.getElementById('questionCount'),
  lastUpdated: document.getElementById('lastUpdated'),
  toast: document.getElementById('toast')
};

let refreshTimer;

function token() {
  return localStorage.getItem(ADMIN_TOKEN_KEY);
}

function setLoading(loading) {
  const button = elements.loginForm.querySelector('.primary-button');
  button.classList.toggle('loading', loading);
  button.disabled = loading;
}

function showToast(message, isError = false) {
  elements.toast.textContent = message;
  elements.toast.className = `toast show${isError ? ' error' : ''}`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => elements.toast.classList.remove('show'), 3200);
}

async function api(path, options = {}) {
  try {
    const response = await adminFetch(path, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token()}`,
        ...(options.headers || {})
      }
    });

    if (response.status === 502 || response.status === 503 || response.status === 504) {
      const serverErr = new Error('Backend server is waking up (Render spin-up). Please retry in a few seconds.');
      serverErr.status = response.status;
      throw serverErr;
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const message = data.message || data.error || (
        response.status === 401 ? 'Unauthorized admin request. Please log in again.' :
        response.status === 403 ? 'Forbidden request.' :
        `Request failed with status ${response.status}`
      );
      const err = new Error(message);
      err.status = response.status;
      throw err;
    }
    return data;
  } catch (error) {
    if (isNetworkError(error)) {
      const netErr = new Error('Unable to connect to AdiBot server. Please check your internet connection or backend server status.');
      netErr.isNetwork = true;
      throw netErr;
    }
    throw error;
  }
}

function showDashboard() {
  elements.loginScreen.classList.add('hidden');
  elements.dashboard.classList.remove('hidden');
  loadDashboard();
  refreshTimer = setInterval(loadDashboard, 30000);
}

function showLogin() {
  clearInterval(refreshTimer);
  elements.dashboard.classList.add('hidden');
  elements.loginScreen.classList.remove('hidden');
}

function formatCount(value, noun) {
  return `${value} ${noun}${value === 1 ? '' : 's'}`;
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[character]));
}

function renderRows(data) {
  const docs = data.uploadedDocs || data.docs || [];
  const questions = (data.recentQuestions || []).slice(0, 20);

  elements.totalQuestions.textContent = data.totalQuestions ?? questions.length;
  elements.totalUploads.textContent = data.totalUploads ?? docs.length;
  elements.totalUsers.textContent = data.totalUsers ?? 0;
  elements.documentCount.textContent = formatCount(docs.length, 'file');
  elements.questionCount.textContent = formatCount(questions.length, 'question');

  elements.documentsBody.innerHTML = docs.map(doc => `
    <tr>
      <td title="${escapeHtml(doc.filename || doc.name || 'Unnamed document')}">
        ${escapeHtml(doc.filename || doc.name || 'Unnamed document')}
      </td>
      <td>${escapeHtml(doc.uploadDate || doc.date || '-')}</td>
      <td>${escapeHtml(doc.uploadTime || doc.time || '-')}</td>
      <td class="actions-column">
        <button class="delete-button" data-doc-id="${doc.id}">Delete</button>
      </td>
    </tr>
  `).join('');
  elements.documentsEmpty.classList.toggle('hidden', docs.length > 0);

  elements.questionsBody.innerHTML = questions.map(item => `
    <tr>
      <td>${escapeHtml(item.question || '-')}</td>
      <td>${escapeHtml(item.date || '-')}</td>
      <td>${escapeHtml(item.time || '-')}</td>
    </tr>
  `).join('');
  elements.questionsEmpty.classList.toggle('hidden', questions.length > 0);

  elements.lastUpdated.textContent = `Updated ${new Date().toLocaleTimeString()}`;
}

async function loadDashboard() {
  try {
    const [stats, docs] = await Promise.all([api('/stats'), api('/docs')]);
    renderRows({ ...stats, uploadedDocs: docs.docs || stats.uploadedDocs });
  } catch (error) {
    showToast(error.message, true);
    if (error.status === 401 || (error.message && error.message.toLowerCase().includes('unauthorized'))) {
      localStorage.removeItem(ADMIN_TOKEN_KEY);
      showLogin();
    }
  }
}

elements.loginForm.addEventListener('submit', async event => {
  event.preventDefault();
  elements.loginMessage.textContent = '';
  setLoading(true);

  try {
    const response = await adminFetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: elements.password.value })
    });

    if (response.status === 502 || response.status === 503 || response.status === 504) {
      throw new Error('AdiBot server is waking up (Render spin-up). Please wait a few seconds and try again.');
    }

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(result.message || result.error || 'Invalid password.');
    }
    localStorage.setItem(ADMIN_TOKEN_KEY, result.token);
    elements.password.value = '';
    showDashboard();
  } catch (error) {
    if (isNetworkError(error)) {
      elements.loginMessage.textContent = 'Unable to connect to AdiBot backend server. Please check your internet connection or backend server status.';
    } else {
      elements.loginMessage.textContent = error.message;
    }
  } finally {
    setLoading(false);
  }
});

elements.togglePassword.addEventListener('click', () => {
  const visible = elements.password.type === 'text';
  elements.password.type = visible ? 'password' : 'text';
  elements.togglePassword.textContent = visible ? 'Show' : 'Hide';
});

document.getElementById('refreshButton').addEventListener('click', loadDashboard);

document.getElementById('logoutButton').addEventListener('click', () => {
  localStorage.removeItem(ADMIN_TOKEN_KEY);
  showLogin();
  showToast('Logged out successfully.');
});

elements.documentsBody.addEventListener('click', async event => {
  const button = event.target.closest('[data-doc-id]');
  if (!button || !confirm('Delete this document from the dashboard?')) return;
  button.disabled = true;
  try {
    await api(`/doc/${encodeURIComponent(button.dataset.docId)}`, { method: 'DELETE' });
    showToast('Document deleted.');
    await loadDashboard();
  } catch (error) {
    button.disabled = false;
    showToast(error.message, true);
  }
});

document.querySelectorAll('.nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
    item.classList.add('active');
  });
});

if (token()) {
  showDashboard();
} else {
  showLogin();
}

