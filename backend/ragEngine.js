const fs = require('fs');
const { PDFParse } = require('pdf-parse');
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

// Process uploaded PDF
async function processDocument(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();
    await parser.destroy();
    const text = pdfData.text;

    const chunks = splitIntoChunks(text);

    const newChunks = chunks.map(chunk => ({
      id: uuidv4(),
      text: chunk,
    }));

    documentChunks = [...documentChunks, ...newChunks];

    console.log(`Processed ${newChunks.length} chunks from PDF`);
    return true;
  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
}

// Answer question using RAG
async function askQuestion(question) {
  try {
    console.log('Question received:', question);
    console.log('Total chunks:', documentChunks.length);

    if (documentChunks.length === 0) {
      return 'Please upload a college document first so I can answer your questions!';
    }

    const relevantChunks = findRelevantChunks(question, documentChunks);
    const context = relevantChunks.join('\n\n');
    console.log('Context found:', context.substring(0, 100));

    const prompt = `You are AdiBot, a helpful assistant for Aditya College of Engineering and Technology in Bengaluru.

Use the following information from college documents to answer the student's question.
If the answer is not in the provided information, say "I don't have that information in my knowledge base. Please contact the college administration."
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

module.exports = { processDocument, askQuestion, summarizeDocument };
// Summarize Document
async function summarizeDocument() {
  try {
    if (documentChunks.length === 0) {
      return 'No document uploaded yet!';
    }

    // Get first 5 chunks for summary
    const sampleText = documentChunks
      .slice(0, 5)
      .map(c => c.text)
      .join('\n\n');

    const prompt = `You are AdiBot, an AI assistant for Aditya College of Engineering and Technology.

Analyze this college document and provide a clear, structured summary including:
1. Main topics covered
2. Key information found
3. What students can ask about

Document Content:
${sampleText}

Provide a helpful summary in 150 words or less:`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Summary error:', error);
    throw error;
  }
}