import { GoogleGenerativeAI } from '@google/generative-ai';
import { markQuotaExhausted } from '../utils/questionCache.js';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY) {
    console.error('❌ VITE_GEMINI_API_KEY is not set.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

// 🎲 NEW: Topic Lists to force variety
const EASY_TOPICS = [
    'Bollywood Movies (90s or 2000s)',
    'Indian Cricket Team',
    'Popular Indian Street Food',
    'Hindu Festivals',
    'Indian Mythology (Ramayana/Mahabharata)',
    'Basic Indian Geography',
    'Famous Indian Songs',
    'Common Hindi Proverbs'
];

const MEDIUM_TOPICS = [
    'Indian History (Freedom Struggle)',
    'Indian Politics',
    'Space & Science (ISRO)',
    'Indian Literature',
    'Famous Indian Businessmen',
    'Awards (Padma Bhushan/Bharat Ratna)',
    'Indian Railways'
];

const HARD_TOPICS = [
    'Ancient Indian History',
    'Indian Constitution',
    'World Geography',
    'Obscure Art & Culture',
    'Scientific Discoveries',
    'Economics & Finance'
];

function getRandomTopic(level) {
    let list = EASY_TOPICS;
    if (level > 5) list = MEDIUM_TOPICS;
    if (level > 10) list = HARD_TOPICS;
    const randomIndex = Math.floor(Math.random() * list.length);
    return list[randomIndex];
}

export async function fetchQuestion(level, history = []) {
    if (!genAI) throw new Error('Gemini API key is not configured.');

    try {
        let difficulty;
        if (level <= 3) difficulty = 'बहुत आसान (very easy)';
        else if (level <= 6) difficulty = 'आसान (easy)';
        else if (level <= 9) difficulty = 'मध्यम (medium)';
        else if (level <= 12) difficulty = 'कठिन (hard)';
        else difficulty = 'बहुत कठिन (extremely obscure/hard)';

        // 1. Get Random Topic & Seed
        const topic = getRandomTopic(level);
        const randomSeed = Math.floor(Math.random() * 10000);

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const forbiddenTopics = Array.isArray(history) ? history.slice(-15).join("; ") : "";

        const prompt = `You are a strict API backend for a KBC game.

Current Level: ${level} (${difficulty})
Target Topic: ${topic}
Random Seed: ${randomSeed}

CRITICAL INSTRUCTION: 
- Do NOT act like a host. 
- Do NOT use phrases like "Computer Ji".
- Return ONLY the raw question text.
- DO NOT ask about "National Bird", "National Animal", or "National Fruit".

PREVIOUSLY ASKED QUESTIONS (DO NOT REPEAT):
[${forbiddenTopics}]

Generate a NEW, UNIQUE multiple-choice question in Hindi (Devanagari) following these rules:
1. Focus strictly on the category: "${topic}".
2. Difficulty must match Level ${level}.
3. Options must be distinct.

Return strictly valid JSON:
{
  "question": "Direct question text only",
  "options": ["A", "B", "C", "D"],
  "answer": "Correct Option Text",
  "translation": "English translation"
}`;

        const result = await model.generateContent(prompt);
        const text = result.response.text();

        // Robust JSON Parsing
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("No JSON found in response");
        const questionData = JSON.parse(jsonMatch[0]);

        if (!questionData.question || !questionData.options || !questionData.answer) {
            throw new Error('Invalid JSON structure');
        }

        const correctAnswerIndex = questionData.options.findIndex(
            (opt) => opt.trim() === questionData.answer.trim()
        );

        return {
            id: level,
            question: questionData.question,
            options: questionData.options,
            correctAnswer: correctAnswerIndex === -1 ? 0 : correctAnswerIndex,
            translation: questionData.translation || '',
        };

    } catch (error) {
        console.error('Gemini API Error:', error);
        if (error.message && error.message.includes('429')) {
            let retryAfter = 86400;
            const retryMatch = error.message.match(/retry in ([\d.]+)s/i);
            if (retryMatch) retryAfter = Math.ceil(parseFloat(retryMatch[1]));
            markQuotaExhausted(retryAfter);
        }
        throw error;
    }
}