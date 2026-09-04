const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

// Simple admin password
const ADMIN_PASSWORD = 'adibot@admin123';

// Store stats in memory
let stats = {
  totalQuestions: 0,
  totalUploads: 0,
  recentQuestions: [],
  uploadedDocs: []
};

function requireAdmin(req, res, next) {
  if (req.headers.authorization !== 'Bearer admin-token-adibot') {
    return res.status(401).json({ success: false, message: 'Unauthorized admin request.' });
  }
  next();
}

// Admin Login
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    res.json({ 
      success: true, 
      token: 'admin-token-adibot',
      message: 'Admin logged in successfully!'
    });
  } else {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid password!' 
    });
  }
});

// Get Stats
router.get('/stats', requireAdmin, (req, res) => {
  let totalUsers = 0;
  try {
    const users = JSON.parse(fs.readFileSync(path.join(__dirname, 'users.json'), 'utf8'));
    totalUsers = Object.keys(users).length;
  } catch (error) {
    totalUsers = 0;
  }
  res.json({ ...stats, totalUsers });
});

// Update question stats
router.post('/track-question', (req, res) => {
  const { question } = req.body;
  stats.totalQuestions++;
  stats.recentQuestions.unshift({
    question,
    time: new Date().toLocaleTimeString(),
    date: new Date().toLocaleDateString()
  });
  if (stats.recentQuestions.length > 20) {
    stats.recentQuestions.pop();
  }
  res.json({ success: true });
});

// Track uploads
router.post('/track-upload', (req, res) => {
  const { filename } = req.body;
  stats.totalUploads++;
  stats.uploadedDocs.unshift({
    filename,
    uploadTime: new Date().toLocaleTimeString(),
    uploadDate: new Date().toLocaleDateString(),
    id: Date.now()
  });
  res.json({ success: true });
});

// Delete document
router.delete('/doc/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  stats.uploadedDocs = stats.uploadedDocs.filter(
    doc => doc.id !== parseInt(id)
  );
  res.json({ success: true, message: 'Document deleted!' });
});

// Get documents
router.get('/docs', requireAdmin, (req, res) => {
  res.json({ docs: stats.uploadedDocs });
});

module.exports = { router, stats };