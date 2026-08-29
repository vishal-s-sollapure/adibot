# AdiBot 🤖 — AI Chatbot for Aditya College

An AI-powered RAG-based chatbot for Aditya College of Engineering 
and Technology, Bengaluru. Students can upload college documents 
and ask questions — AdiBot answers using Google Gemini AI.

## Problem Statement
Students struggle to find quick answers about college admissions, 
fees, courses, placements, and facilities. AdiBot solves this by 
letting students ask questions in plain English and get instant 
AI-powered answers from official college documents.

## Features
### Core Features
- 🤖 AI-powered chat interface
- 📄 PDF document upload and processing
- 🔍 RAG pipeline with text extraction and chunking
- 🧠 Google Gemini AI for answer generation
- 📚 Context-aware answers from college documents
- ❓ Unknown question handling
- 💡 Suggested questions
- 🎨 Clean responsive UI with drag and drop

### Bonus Features
- ⚡ Typing indicator animation
- 📱 Mobile responsive design
- 🔄 Clear chat functionality
- 💬 Real-time answer generation

## Technology Stack
### Frontend
- HTML5, CSS3, JavaScript
- Deployed on Vercel

### Backend
- Node.js, Express.js
- pdf-parse (PDF processing)
- Google Gemini AI API
- Deployed on Render

### AI & RAG Pipeline
- Google Generative AI (gemini-1.5-flash)
- Text chunking and keyword similarity search
- Context retrieval and prompt engineering

## Screenshots
<img width="1913" height="1017" alt="image" src="https://github.com/user-attachments/assets/7937cebd-3b7f-4ff4-8586-e343903df185" />


## Live Demo
🌐 Frontend: https://adibot-three.vercel.app

## Backend
🔧 API: https://adibot-3w4u.onrender.com

Frontend is configured to use the Render backend in production, while keeping localhost for local development.

## Setup Instructions
### Prerequisites
- Node.js installed
- Google Gemini API key

### Backend Setup
```bash
cd backend
npm install
```
