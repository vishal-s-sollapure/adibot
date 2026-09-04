# 🤖 AdiBot — AI Assistant for Aditya College

> An AI-powered RAG-based chatbot for Aditya College of 
> Engineering and Technology, Bengaluru. Students can upload 
> college documents and ask questions in multiple languages — 
> AdiBot answers instantly using Google Gemini AI.

![AdiBot Banner](screenshots/banner.png)

## 🌐 Live Demo
- **Frontend:** https://adibot-three.vercel.app
- **Backend API:** https://adibot-3w4u.onrender.com
- **Admin Dashboard:** https://adibot-three.vercel.app/admin.html
- **GitHub:** https://github.com/vishal-s-sollapure/adibot

---

## 🎯 Problem Statement
Students at Aditya College struggle to find quick answers 
about admissions, fees, courses, placements, and facilities. 
AdiBot solves this by letting students ask questions in plain 
English (or their native language) and get instant AI-powered 
answers from official college documents.

---

## ✨ Features

### ⭐ Core Features
- 🤖 **AI Chat Interface** — Ask anything about college
- 📄 **PDF Upload & Processing** — Upload college documents
- 🔍 **RAG Pipeline** — Retrieval Augmented Generation
- 🧠 **Google Gemini AI** — Smart answer generation
- 📋 **Document Summary** — Auto-summary after upload
- 📚 **Sources Display** — Shows which document answered
- 📊 **Confidence Score** — Answer reliability indicator
- 💡 **Suggested Questions** — Quick question buttons
- 🕐 **Chat History** — Recent questions saved locally
- 📥 **Export Chat** — Download chat as TXT file
- 👍👎 **Answer Feedback** — Rate each answer

### 🔐 Authentication
- ✅ User Registration & Login
- ✅ Secure password authentication
- ✅ Session management
- ✅ User name displayed in header
- ✅ Logout functionality

### 👨‍💼 Admin Dashboard
- ✅ Secure admin login
- ✅ Dashboard overview with statistics
- ✅ Total questions & uploads tracking
- ✅ Document library management
- ✅ Delete uploaded documents
- ✅ Recent questions monitoring
- ✅ System status display

### 🚀 Bonus Features
- ✅ **AI Generated FAQs** — Auto-generate 8 FAQs from document
- ✅ **Multilingual Support** — 8 languages supported
- ✅ **Voice Input** 🎤 — Speak your question
- ✅ **Voice Output** 🔊 — AdiBot reads answer aloud
- ✅ **Streaming AI Responses** ⚡ — Real-time word-by-word answers
- ✅ **OCR for Scanned PDFs** 🔍 — Read image-based PDFs

---

## 🌍 Supported Languages
| Language | Script |
|---|---|
| English | English |
| Hindi | हिंदी |
| Kannada | ಕನ್ನಡ |
| Tamil | தமிழ் |
| Telugu | తెలుగు |
| Malayalam | മലയാളം |
| Marathi | मराठी |
| Bengali | বাংলা |

---

## 🛠️ Technology Stack

### Frontend
- HTML5, CSS3, JavaScript (Vanilla)
- Web Speech API (Voice Input/Output)
- LocalStorage (Chat History)
- Deployed on **Vercel**

### Backend
- Node.js + Express.js
- pdf-parse (PDF text extraction)
- Tesseract.js (OCR for scanned PDFs)
- Multer (File uploads)
- Deployed on **Render**

### AI & RAG Pipeline
