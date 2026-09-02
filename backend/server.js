const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const { processDocument, askQuestion, summarizeDocument } = require('./ragEngine');
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const USERS_FILE = path.join(__dirname, 'users.json');
const activeSessions = new Map();

function ensureUsersFile() {
  if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify({}, null, 2));
  }
}

function loadUsers() {
  ensureUsersFile();
  try {
    return JSON.parse(fs.readFileSync(USERS_FILE, 'utf8')) || {};
  } catch (error) {
    console.error('Failed to read users file:', error);
    return {};
  }
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

function createToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getUserFromToken(token) {
  return token ? activeSessions.get(token) || null : null;
}

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const user = getUserFromToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Authentication required. Please log in first.' });
  }

  req.user = user;
  next();
}

// Middleware
app.use(cors());
app.use(express.json());

// File upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// Create uploads folder
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AdiBot Backend Running!' });
});

app.get('/me', (req, res) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
  const user = getUserFromToken(token);

  if (!user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  return res.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

app.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required.' });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const users = loadUsers();

    if (users[trimmedEmail]) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    if (String(password).length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const passwordHash = await bcrypt.hash(String(password), 10);
    const newUser = {
      id: crypto.randomUUID(),
      name: String(name).trim(),
      email: trimmedEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    users[trimmedEmail] = newUser;
    saveUsers(users);

    const token = createToken();
    activeSessions.set(token, newUser);

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'Failed to create account.' });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const trimmedEmail = String(email).trim().toLowerCase();
    const users = loadUsers();
    const user = users[trimmedEmail];

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(String(password), user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = createToken();
    activeSessions.set(token, user);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'Failed to log in.' });
  }
});

// Upload PDF route
app.post('/upload', requireAuth, upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    await processDocument(req.file.path);
    res.json({ message: 'PDF uploaded and processed successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to process PDF' });
  }
});

// Summarize route
app.post('/summarize', requireAuth, async (req, res) => {
  try {
    const summary = await summarizeDocument();
    console.log('Summary generated:', summary);
    return res.json({ summary: summary || 'Document processed successfully!' });
  } catch (error) {
    console.error('Summary route error:', error);
    return res.status(500).json({ error: 'Failed to summarize document' });
  }
});

// Chat route
app.post('/chat', requireAuth, async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    const result = await askQuestion(question);
    console.log('Result:', JSON.stringify(result).substring(0, 100));
    res.json({
      answer: result.answer || 'No answer found',
      sources: result.sources || [],
      confidence: result.confidence || 0
    });
  } catch (error) {
    console.error(error);
    if (
      (error?.status === 400 && error?.message?.includes('API_KEY_INVALID')) ||
      (error?.status === 401 && error?.message?.includes('ACCESS_TOKEN_TYPE_UNSUPPORTED'))
    ) {
      return res.status(503).json({
        error: 'Gemini authentication failed. Use a Gemini API key from Google AI Studio in backend/.env, then restart the backend.'
      });
    }
    if (error?.code === 'GEMINI_TIMEOUT') {
      return res.status(504).json({
        error: 'The AI service took too long to respond. Please try again.'
      });
    }
    if (error?.status >= 500 || error?.status === 429) {
      return res.status(503).json({
        error: 'The AI service is temporarily busy. Please try again in a moment.'
      });
    }
    res.status(500).json({ error: 'Failed to get answer' });
  }
});

app.listen(PORT, () => {
  console.log(`AdiBot server running on port ${PORT}`);
});