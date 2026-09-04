const fs = require('fs');
const path = require('path');
const { PDFParse } = require('pdf-parse');
const pdfPoppler = require('pdf-poppler');
const sharp = require('sharp');
const { createWorker } = require('tesseract.js');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const GEMINI_TIMEOUT_MS = 20000;
const GEMINI_RETRY_DELAYS_MS = [1000, 2000];
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-3.6-flash';

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Simple in-memory vector store
let documentChunks = [];

// Split text into chunks
function splitIntoChunks(text, chunkSize = 500) {
  const words = text.split(' ');
  const chunks = [];
  let currentChunk = [];

  for (const word of words) {
    currentChunk.push(word);
    if (currentChunk.length >= chunkSize) {
      chunks.push(currentChunk.join(' '));
      currentChunk = [];
    }
  }

  if (currentChunk.length > 0) {
    chunks.push(currentChunk.join(' '));
  }

  return chunks;
}

// Find most relevant chunks for a question
function findRelevantChunks(question, chunks, topK = 3) {
  const questionWords = question.toLowerCase().split(' ');

  const scored = chunks.map(chunk => {
    const chunkWords = chunk.text.toLowerCase().split(' ');
    let score = 0;
    for (const word of questionWords) {
      if (word.length > 3 && chunkWords.includes(word)) {
        score++;
      }
    }
    return { ...chunk, score };
  });

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(c => c.text);
}

function getFallbackAnswer(question, context) {
  const normalizedQuestion = question.toLowerCase();
  const sectionKeywords = [
    { label: 'fee structure', keywords: ['fee', 'fees', 'tuition', 'cost', 'price'] },
    { label: 'courses offered', keywords: ['course', 'courses', 'branch', 'branches', 'program'] },
    { label: 'facilities', keywords: ['facility', 'facilities', 'hostel', 'library', 'sports', 'wifi'] },
    { label: 'admission', keywords: ['admission', 'admissions', 'eligibility', 'cet', 'comedk'] },
    { label: 'placements', keywords: ['placement', 'placements', 'package', 'recruiter', 'job'] },
  ];
  const requestedSection = sectionKeywords.find(section =>
    section.keywords.some(keyword => normalizedQuestion.includes(keyword))
  );

  if (requestedSection) {
    const sectionLabels = sectionKeywords.map(section => section.label).join('|');
    const sectionPattern = new RegExp(
      `\\b${requestedSection.label.replace(' ', '\\s+')}\\s*:\\s*([\\s\\S]*?)(?=\\s+(?:${sectionLabels})\\s*:|$)`,
      'i'
    );
    const section = context.match(sectionPattern)?.[1]?.trim();
    if (section) {
      return `According to your college document, the ${requestedSection.label} information is: ${section}`;
    }
  }

  return `According to your college document: ${context}`;
}

function isScannedPDF(text) {
  return String(text || '').trim().length < 100;
}

async function extractTextWithOCR(filePath) {
  const outputDirectory = path.join(path.dirname(filePath), `ocr-${Date.now()}`);
  fs.mkdirSync(outputDirectory, { recursive: true });
  const options = { format: 'png', out_dir: outputDirectory, out_prefix: 'page', page: null, scale: 1500 };
  let worker;

  try {
    await pdfPoppler.convert(filePath, options);
    const imageFiles = fs.readdirSync(outputDirectory)
      .filter(file => file.toLowerCase().endsWith('.png'))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
    if (imageFiles.length === 0) throw new Error('No page images were generated.');

    worker = await createWorker('eng+kan');
    const pages = [];
    for (const imageFile of imageFiles) {
      const imagePath = path.join(outputDirectory, imageFile);
      const preparedImagePath = path.join(outputDirectory, `prepared-${imageFile}`);
      await sharp(imagePath).grayscale().png().toFile(preparedImagePath);
      const result = await worker.recognize(preparedImagePath);
      pages.push(result.data.text || '');
      console.log(`OCR processed page ${pages.length} of ${imageFiles.length}`);
    }
    return { text: pages.join('\n\n'), pages: imageFiles.length };
  } catch (error) {
    if (error.code === 'ENOENT' || /poppler|pdftoppm|not found/i.test(error.message)) {
      const popplerError = new Error('OCR requires Poppler on Windows. Install Poppler and add its bin folder to PATH, then restart the backend.');
      popplerError.code = 'POPPLER_UNAVAILABLE';
      throw popplerError;
    }
    throw error;
  } finally {
    if (worker) await worker.terminate();
    fs.rmSync(outputDirectory, { recursive: true, force: true });
  }
}

// Process uploaded PDF
async function processDocument(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();
    await parser.destroy();
    let text = pdfData.text || '';
    let method = 'pdf-parse';
    let pages = pdfData.numpages || 0;

    if (isScannedPDF(text)) {
      console.log('Scanned PDF detected. OCR Processing...');
      try {
        const ocrResult = await extractTextWithOCR(filePath);
        text = ocrResult.text;
        pages = ocrResult.pages;
        method = 'ocr';
        console.log(`OCR complete: ${pages} pages processed`);
      } catch (ocrError) {
        console.error('OCR failed:', ocrError.message);
        if (text.trim().length === 0) throw ocrError;
        console.warn('OCR failed; falling back to pdf-parse text.');
      }
    } else {
      console.log('PDF text extracted with pdf-parse');
    }

    const chunks = splitIntoChunks(text);

    const newChunks = chunks.map(chunk => ({
      id: uuidv4(),
      text: chunk,
    }));

    documentChunks = [...documentChunks, ...newChunks];

    console.log(`Processed ${newChunks.length} chunks from PDF`);
    return { method, pages };
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}

// Answer question using RAG
async function askQuestion(question, language = 'English') {
  try {
    console.log('Question received:', question);
    console.log('Total chunks:', documentChunks.length);

    if (documentChunks.length === 0) {
      return 'Please upload a college document first so I can answer your questions!';
    }

    const relevantChunks = findRelevantChunks(question, documentChunks);
    const context = relevantChunks.join('\n\n');
    console.log('Context found:', context.substring(0, 100));

    const responseLanguage = language || 'English';
    const prompt = `You are AdiBot, a helpful assistant for Aditya College of Engineering and Technology in Bengaluru.

Use the following information from college documents to answer the student's question.
If the answer is not in the provided information, say "I don't have that information in my knowledge base. Please contact the college administration."
  Answer in ${responseLanguage} language.
Answer only what the student asked for. Keep the answer concise and do not list unrelated information.

College Document Information:
${context}

Student Question: ${question}

Answer:`;

    console.log('Calling Gemini API...');
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    let result;
    for (let attempt = 0; attempt <= GEMINI_RETRY_DELAYS_MS.length; attempt++) {
      let timeoutId;
      try {
        const timeout = new Promise((_, reject) => {
          timeoutId = setTimeout(() => {
            const error = new Error('Gemini request timed out');
            error.code = 'GEMINI_TIMEOUT';
            reject(error);
          }, GEMINI_TIMEOUT_MS);
        });
        result = await Promise.race([
          model.generateContent(prompt),
          timeout,
        ]);
        clearTimeout(timeoutId);
        break;
      } catch (error) {
        clearTimeout(timeoutId);
        if (error?.code === 'GEMINI_TIMEOUT') {
          console.warn('Gemini timed out. Returning document context instead.');
          return getFallbackAnswer(question, context);
        }
        const isTransient = error?.status === 429 || error?.status >= 500;
        const retryDelay = GEMINI_RETRY_DELAYS_MS[attempt];
        if (!isTransient || retryDelay === undefined) {
          if (isTransient) {
            console.warn('Gemini remained unavailable. Returning document context instead.');
            return getFallbackAnswer(question, context);
          }
          throw error;
        }
        console.warn(`Gemini temporarily unavailable. Retrying in ${retryDelay}ms...`);
        await new Promise(resolve => setTimeout(resolve, retryDelay));
      }
    }

    const response = await result.response;
    const answer = response.text();
    console.log('Answer received:', answer.substring(0, 100));

    return {
      answer,
      sources: relevantChunks.map((chunk, index) => ({
        id: index + 1,
        text: chunk.substring(0, 100) + '...',
        score: Math.round((relevantChunks.length - index) / relevantChunks.length * 100)
      })),
      confidence: relevantChunks.length > 0 ? 
        Math.round((relevantChunks.length / 3) * 100) : 0
    };
  } catch (error) {
    console.error('Full error:', error);
    throw error;
  }
}

async function streamAnswer(question, language = 'English', onChunk) {
  if (documentChunks.length === 0) {
    const answer = 'Please upload a college document first so I can answer your questions!';
    onChunk(answer);
    return { answer, sources: [], confidence: 0 };
  }

  const relevantChunks = findRelevantChunks(question, documentChunks);
  const context = relevantChunks.join('\n\n');
  const responseLanguage = language || 'English';
  const prompt = `You are AdiBot, a helpful assistant for Aditya College of Engineering and Technology in Bengaluru.

Use the following information from college documents to answer the student's question.
If the answer is not in the provided information, say "I don't have that information in my knowledge base. Please contact the college administration."
Answer in ${responseLanguage} language.
Answer only what the student asked for. Keep the answer concise and do not list unrelated information.

College Document Information:
${context}

Student Question: ${question}

Answer:`;

  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContentStream(prompt);
  let answer = '';
  for await (const item of result.stream) {
    const text = item.text();
    if (text) {
      answer += text;
      onChunk(text);
    }
  }

  return {
    answer,
    sources: relevantChunks.map((chunk, index) => ({
      id: index + 1,
      text: chunk.substring(0, 100) + '...',
      score: Math.round((relevantChunks.length - index) / relevantChunks.length * 100)
    })),
    confidence: relevantChunks.length > 0 ? Math.round((relevantChunks.length / 3) * 100) : 0
  };
}

async function generateFAQs(language = 'English') {
  if (documentChunks.length === 0) {
    return [];
  }

  const context = documentChunks.map(chunk => chunk.text).join('\n\n');
  const responseLanguage = language || 'English';
  const prompt = `Based on this college document, generate exactly 8 frequently asked questions students would ask. Return only numbered questions. Write the questions in ${responseLanguage} language.

College document:
${context}`;
  const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  const result = await model.generateContent(prompt);
  const text = (await result.response).text();

  const questions = [];
  const numberedQuestions = text.match(/(?:^|\s)\d+[.)]\s+.*?(?=\s+\d+[.)]\s+|$)/g) || [];

  numberedQuestions.forEach(item => {
    const question = item.replace(/^\s*\d+[.)]\s*/, '').trim();
    if (question && !questions.includes(question)) questions.push(question);
  });

  const fallbackQuestions = [
    'What facilities are available for students on campus?',
    'How can students contact the college administration?',
    'What are the important dates for admissions?'
  ];
  fallbackQuestions.forEach(question => {
    if (questions.length < 8 && !questions.includes(question)) questions.push(question);
  });

  return questions.slice(0, 8);
}

module.exports = {
  processDocument,
  isScannedPDF,
  extractTextWithOCR,
  askQuestion,
  streamAnswer,
  summarizeDocument,
  generateFAQs
};
// Summarize Document
async function summarizeDocument(language = 'English') {
  try {
    if (documentChunks.length === 0) {
      return 'No document uploaded yet!';
    }

    // Get first 5 chunks for summary
    const sampleText = documentChunks
      .slice(0, 5)
      .map(c => c.text)
      .join('\n\n');

    const responseLanguage = language || 'English';
    const prompt = `You are AdiBot, an AI assistant for Aditya College of Engineering and Technology.

Analyze this college document and provide a clear, structured summary including:
1. Main topics covered
2. Key information found
3. What students can ask about

Document Content:
${sampleText}

Provide a helpful summary in 150 words or less. Answer in ${responseLanguage} language:`;

    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Summary error:', error);
    throw error;
  }
}