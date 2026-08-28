const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const multer = require('multer');
const path = require('path');
const { processDocument, askQuestion } = require('./ragEngine');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

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
const fs = require('fs');
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'AdiBot Backend Running!' });
});

// Upload PDF route
app.post('/upload', upload.single('pdf'), async (req, res) => {
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

// Chat route
app.post('/chat', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) {
      return res.status(400).json({ error: 'Question is required' });
    }
    const answer = await askQuestion(question);
    res.json({ answer });
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