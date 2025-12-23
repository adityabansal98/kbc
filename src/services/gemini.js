import { GoogleGenerativeAI } from '@google/generative-ai';
import { markQuotaExhausted } from '../utils/questionCache.js';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Initialize the Gemini client
if (!API_KEY) {
    console.error('❌ VITE_GEMINI_API_KEY is not set.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Fetches a dynamically generated KBC-style question from Gemini API
 */
export async function fetchQuestion(level, history = []) {
    if (!genAI) throw new Error('Gemini API key is not configured.');

    try {
        let difficulty;
        if (level <= 3) difficulty = 'बहुत आसान (very easy)';
        else if (level <= 6) difficulty = 'आसान (easy)';
        else if (level <= 9) difficulty = 'मध्यम (medium)';
        else if (level <= 12) difficulty = 'कठिन (hard)';
        else difficulty = 'बहुत कठिन (extremely obscure/hard)';

        // IMPORTANT: gemini-2.5-flash is the correct model for late 2025
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const forbiddenTopics = Array.isArray(history) ? history.slice(-15).join("; ") : "";

        const prompt = `You are a strict API backend for a KBC game.

Current Level: ${level} (${difficulty})

CRITICAL INSTRUCTION: 
- Do NOT act like a host. 
- Do NOT use phrases like "Computer Ji", "Doston", "Deviyon aur Sajjanon".
- Return ONLY the raw question text.

PREVIOUSLY ASKED QUESTIONS (DO NOT REPEAT THESE):
[${forbiddenTopics}]

Generate a NEW, UNIQUE multiple-choice question in Hindi (Devanagari) following these rules:
1. Question must be strictly factual and direct.
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

        // --- 🛡️ ROBUST JSON PARSING ---
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            console.error("Raw Response:", text);
            throw new Error("No JSON found in response");
        }

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

        // Check if it's a 429 (quota exceeded) error
        if (error.message && error.message.includes('429')) {
            // Extract retry delay if available
            let retryAfter = 86400; // Default: 24 hours
            const retryMatch = error.message.match(/retry in ([\d.]+)s/i);
            if (retryMatch) {
                retryAfter = Math.ceil(parseFloat(retryMatch[1]));
            }

            // Mark quota as exhausted
            markQuotaExhausted(retryAfter);
        }

        throw error;
    }
}