# 🤖 AdiBot — AI Assistant for Aditya College

> An AI-powered RAG-based chatbot for Aditya College of 
> Engineering and Technology, Bengaluru. Students can upload 
> college documents and ask questions in multiple languages — 
> AdiBot answers instantly using Google Gemini AI.

---

## 🌐 Live Demo
- **Frontend:** [https://adibot-three.vercel.app](https://adibot-three.vercel.app)
- **Backend API:** [https://adibot-3w4u.onrender.com](https://adibot-3w4u.onrender.com)
- **Admin Dashboard:** [https://adibot-three.vercel.app/admin.html](https://adibot-three.vercel.app/admin.html)
- **GitHub:** [https://github.com/vishal-s-sollapure/adibot](https://github.com/vishal-s-sollapure/adibot)

---

## 🎯 Problem Statement
Students at Aditya College struggle to find quick answers about admissions, fees, courses, placements, and facilities across multiple brochures, circulars, and notices. 
AdiBot solves this by letting students ask questions in plain English (or their native language) and get instant, accurate AI-powered answers grounded directly in official college documents.

---

## ✨ Features

### ⭐ Core Features
- 🤖 **AI Chat Interface** — Ask questions and get conversational, grounded answers
- 📄 **PDF Upload & Processing** — Upload college documents, notices, and brochures
- 🔍 **RAG Pipeline** — Retrieval-Augmented Generation with document chunking & keyword relevance ranking
- 🧠 **Google Gemini AI** — Powered by Gemini models for accurate and context-aware responses
- 📋 **Document Summary** — Auto-generated summary immediately after document processing
- 📚 **Sources Display** — Pinpoints which sections/excerpts answered the query
- 📊 **Confidence Score** — Reliability indicator based on document chunk match strength
- 💡 **Suggested Questions** — Quick buttons for common inquiries (courses, fees, admissions, placements)
- 🕐 **Chat History** — Recent questions saved locally for fast reference
- 📥 **Export Chat** — Download chat conversation as a clean text file
- 👍👎 **Answer Feedback** — Rate answer quality directly in the chat

### 🔐 Authentication & Session
- ✅ User Registration & Login with hashed passwords (`bcryptjs`)
- ✅ Bearer Token Session Management
- ✅ User profile state displayed in navigation header
- ✅ Secure logout functionality

### 👨‍💼 Admin Dashboard (`/admin.html`)
- ✅ Secure admin portal (`adibot@admin123`)
- ✅ Operations overview with real-time counters:
  - Total questions answered
  - Total documents uploaded
  - Registered user accounts
  - System status indicator
- ✅ Document library management with document deletion
- ✅ Recent 20 questions live feed
- ✅ **Dynamic API Base & Auto-Fallback** — Automatically communicates with local backend (`http://localhost:5000`) or production API (`https://adibot-3w4u.onrender.com`), with resilient error handling and Render cold-start detection

### 🚀 Advanced Features
- ✅ **AI Generated FAQs** — One-click generation of 8 tailored FAQs from uploaded documents
- ✅ **Multilingual Support** — Understands and answers in 8 Indian and global languages
- ✅ **Voice Input** 🎤 — Speech-to-text input using the Web Speech API
- ✅ **Voice Output** 🔊 — Text-to-speech reading answers aloud in natural tone
- ✅ **Streaming AI Responses** ⚡ — Real-time word-by-word streaming using Server-Sent Events (SSE)
- ✅ **OCR for Scanned PDFs** 🔍 — Image-based and scanned PDF parsing with `pdf-poppler`, `sharp`, and `tesseract.js` (English & Kannada support)

---

## 🌍 Supported Languages

| Language | Script | Native Greeting |
|---|---|---|
| **English** | English | Hello! |
| **Hindi** | हिंदी | नमस्ते! |
| **Kannada** | ಕನ್ನಡ | ನಮಸ್ಕಾರ! |
| **Tamil** | தமிழ் | வணக்கம்! |
| **Telugu** | తెలుగు | హలో! |
| **Malayalam** | മലയാളം | ഹലോ! |
| **Marathi** | मराठी | नमस्कार! |
| **Bengali** | বাংলা | হ্যালো! |

---

## 🛠️ Technology Stack

### Frontend
- **HTML5, CSS3, Vanilla JavaScript** (Zero heavy framework overhead, blazing fast)
- **Web Speech API** (`SpeechRecognition` for voice input, `SpeechSynthesis` for audio playback)
- **Server-Sent Events (SSE)** for real-time word-by-word response streaming
- **LocalStorage** for persistent user sessions and chat history
- **Hosted on:** [Vercel](https://vercel.com)

### Backend
- **Node.js** & **Express.js** (REST API & SSE streaming)
- **Multer** for multipart file uploads
- **bcryptjs** & **crypto** for password hashing and token generation
- **pdf-parse** for direct text extraction from digital PDFs
- **pdf-poppler** + **sharp** + **tesseract.js** for optical character recognition (OCR) of scanned documents
- **Hosted on:** [Render](https://render.com)

### AI & RAG Pipeline
- **Google Gemini API** (`@google/generative-ai` SDK)
- **Chunking Engine:** Splits documents into 500-word contextual segments
- **Relevance Scorer:** Keyword-based relevance retrieval across chunks with confidence scoring
- **Fallback Engine:** Extractive heuristic backup that delivers document sections if the AI service is busy or offline

---

## 📂 Project Structure

```
adibot/
├── backend/
│   ├── .env                  # Environment configuration (API keys, ports)
│   ├── adminRoutes.js        # Admin routes (/admin/login, /admin/stats, /admin/docs)
│   ├── package.json          # Backend dependencies and start scripts
│   ├── ragEngine.js          # RAG pipeline, chunking, OCR, and Gemini integration
│   ├── server.js             # Express application entry point & static file serving
│   ├── users.json            # User store (hashed passwords, accounts)
│   └── uploads/              # Storage directory for uploaded PDF documents
├── frontend/
│   ├── admin.css             # Admin dashboard styling
│   ├── admin.html            # Admin dashboard interface
│   ├── admin.js              # Admin portal logic with dynamic API fallback
│   ├── index.html            # Main student chatbot interface
│   ├── main.js               # Chat client, voice I/O, streaming, and multilingual logic
│   └── style.css             # Chatbot UI styling
├── components/
│   └── AuthHeader.tsx        # React/TS component reference for header auth
├── sample.pdf                # College sample document for testing
└── README.md                 # Project documentation
```

---

## 🚀 Getting Started & Local Setup

### 1. Prerequisites
- **Node.js** v18+ or v20+ installed ([Download Node.js](https://nodejs.org/))
- **npm** (bundled with Node)
- *(Optional for OCR)*: [Poppler](https://poppler.freedesktop.org/) installed and added to your system `PATH` (only required if scanning image-based PDFs locally)

### 2. Clone the Repository
```bash
git clone https://github.com/vishal-s-sollapure/adibot.git
cd adibot
```

### 3. Backend Setup
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables in `backend/.env`:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_google_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   ```
   > 💡 Get a free Gemini API key from [Google AI Studio](https://aistudio.google.com/).

4. Start the backend server:
   ```bash
   npm start
   ```
   The backend will start on: `http://localhost:5000`

### 4. Running the Frontend
You have multiple easy options to run the frontend:

- **Option A (Direct via Backend):**  
  With the backend running, open:
  - Main Chatbot: `http://localhost:5000/index.html`
  - Admin Dashboard: `http://localhost:5000/admin.html`

- **Option B (VS Code Live Server / Local Static Server):**  
  Open `frontend/index.html` with Live Server or run:
  ```bash
  npx serve frontend
  ```
  The frontend automatically detects `localhost` and routes API requests to `http://localhost:5000`. If the local backend is not running, it automatically falls back to the live cloud backend!

- **Option C (Direct File Open):**  
  Double click `frontend/index.html` or `frontend/admin.html` in your file explorer to open directly in any browser.

---

## 🔑 Admin Dashboard Access

- **URL:** [https://adibot-three.vercel.app/admin.html](https://adibot-three.vercel.app/admin.html) (or `http://localhost:5000/admin.html` locally)
- **Admin Password:** `adibot@admin123`

**Admin Capabilities:**
- View real-time system metrics (total queries, document uploads, registered students).
- Browse uploaded document library and delete outdated files.
- Inspect the 20 most recent student questions to identify common queries.
- Verify backend health status.

---

## 📡 API Reference

### Public & Authentication Endpoints
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Backend health check (`{"message":"AdiBot Backend Running!"}`) |
| `POST` | `/signup` | Create student account (`{ name, email, password }`) |
| `POST` | `/login` | Authenticate student (`{ email, password }`) |
| `GET` | `/me` | Get current logged-in user profile (`Bearer <token>`) |

### Document & AI Endpoints
| Method | Route | Description |
|---|---|---|
| `POST` | `/upload` | Upload and process PDF document (`multipart/form-data`) |
| `POST` | `/summarize` | Generate structured 150-word document summary |
| `POST` | `/chat` | Standard RAG question answering with confidence score |
| `POST` | `/chat-stream` | Real-time Server-Sent Events (SSE) streaming answers |
| `POST` | `/generate-faqs` | Generates 8 suggested FAQs tailored to uploaded document |

### Admin Endpoints (`Bearer admin-token-adibot`)
| Method | Route | Description |
|---|---|---|
| `POST` | `/admin/login` | Authenticate admin with password |
| `GET` | `/admin/stats` | Retrieve question count, upload count, users & documents |
| `GET` | `/admin/docs` | List all processed documents in knowledge base |
| `DELETE` | `/admin/doc/:id` | Delete a document from active knowledge base |

---

## 🛡️ Dynamic API Base & Auto-Fallback Architecture

Both `admin.js` and `main.js` feature automatic environment detection and resilient network fallbacks:

```
                  ┌───────────────────────────────┐
                  │    User Opens Admin/Chat      │
                  └──────────────┬────────────────┘
                                 │
                   Is localhost/127.0.0.1/file: ?
                                ╱ ╲
                             Yes   No ──────────┐
                              │                 │
                  Target: http://localhost:5000 │
                              │                 │
                      Local Server Up?          │
                            ╱   ╲               │
                         Yes     No (or timeout)│
                          │       │             │
                          ▼       ▼             ▼
                     Local API  Fallback to Remote API
                                (https://adibot-3w4u.onrender.com)
```

1. **Local Development First:** Automatically targets `http://localhost:5000` when opened on localhost or via `file://`.
2. **Instant Fallback to Cloud:** If the local backend isn't running, it seamlessly switches to the production Render backend without throwing errors or breaking parallel requests (`Promise.all`).
3. **Render Cold-Start Protection:** Detects 502/503/504 status codes typical of Render free-tier wakeups and provides informative user guidance instead of generic failures.
4. **Session Preservation:** Network blips do not prematurely log out students or admins.

---

## 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).

---

<p align="center">Made with ❤️ for <strong>Aditya College of Engineering and Technology, Bengaluru</strong></p>
