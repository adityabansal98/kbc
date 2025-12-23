import { GoogleGenerativeAI } from '@google/generative-ai';

// Get API key from environment variables
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Debug: Log environment variable status
console.log('🔍 Environment check:');
console.log('  - import.meta.env keys:', Object.keys(import.meta.env));
console.log('  - VITE_GEMINI_API_KEY exists:', 'VITE_GEMINI_API_KEY' in import.meta.env);
console.log('  - VITE_GEMINI_API_KEY value:', API_KEY ? `${API_KEY.substring(0, 15)}...` : 'undefined/null');

// Initialize the Gemini client
if (!API_KEY) {
    console.error('❌ VITE_GEMINI_API_KEY is not set. Please add it to your .env file.');
    console.error('   Make sure the .env file is in the project root and contains:');
    console.error('   VITE_GEMINI_API_KEY=your_api_key_here');
    console.error('   Then restart the dev server with: npm run dev');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

/**
 * Fetches a dynamically generated KBC-style question from Gemini API
 * @param {number} level - The current question level (1-15)
 * @returns {Promise<Object>} Question object with question, options, answer, and correctAnswer index
 */
export async function fetchQuestion(level) {
    console.log('🔍 fetchQuestion called for level:', level);
    console.log('🔑 API_KEY exists:', !!API_KEY);
    console.log('🔑 API_KEY value:', API_KEY ? `${API_KEY.substring(0, 10)}...` : 'NOT SET');

    if (!genAI || !API_KEY) {
        console.error('❌ API key not configured');
        throw new Error('Gemini API key is not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }

    try {
        console.log('📡 Calling Gemini API...');
        // Determine difficulty based on level
        let difficulty;
        if (level <= 3) {
            difficulty = 'बहुत आसान (very easy/childish)';
        } else if (level <= 6) {
            difficulty = 'आसान (easy)';
        } else if (level <= 9) {
            difficulty = 'मध्यम (medium)';
        } else if (level <= 12) {
            difficulty = 'कठिन (hard)';
        } else {
            difficulty = 'बहुत कठिन (extremely obscure/hard)';
        }

        // Use gemini-1.5-flash (faster, more available) or gemini-1.5-pro
        // Note: gemini-pro is deprecated and not available in v1beta API
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        console.log('✅ Using model: gemini-2.5-flash');

        const prompt = `You are generating a question for "Kaun Banega Crorepati" (KBC) style quiz game.

Level: ${level} (${difficulty})

Generate a multiple-choice question with the following requirements:
1. The question text MUST be in Hindi (Devanagari script). You can mix English terms if necessary for clarity (e.g., technical terms, proper nouns).
2. Difficulty level: ${difficulty} - Level ${level} should be ${difficulty === 'बहुत आसान (very easy/childish)' ? 'very easy, suitable for children' : difficulty === 'बहुत कठिन (extremely obscure/hard)' ? 'extremely obscure and difficult, requiring deep knowledge' : difficulty}.
3. The question should be engaging and in the style of KBC quiz show.
4. Provide exactly 4 options (A, B, C, D).
5. Make sure the correct answer is not obvious for higher levels.

You MUST return ONLY valid JSON in this exact format (no markdown, no code blocks, no explanations):
{
  "question": "Your question text in Hindi here",
  "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
  "answer": "The exact text of the correct option (must match one of the options exactly)",
  "translation": "English translation of the question (optional)"
}

Important: Return ONLY the JSON object, nothing else.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        console.log('✅ Received response from Gemini:', text.substring(0, 200) + '...');

        // Parse the JSON response
        // Remove markdown code blocks if present
        let jsonText = text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.replace(/```\n?/g, '');
        }

        const questionData = JSON.parse(jsonText);

        // Validate the response
        if (!questionData.question || !questionData.options || !questionData.answer) {
            throw new Error('Invalid question format from API');
        }

        if (questionData.options.length !== 4) {
            throw new Error('Question must have exactly 4 options');
        }

        // Find the index of the correct answer
        const correctAnswerIndex = questionData.options.findIndex(
            (opt) => opt.trim() === questionData.answer.trim()
        );

        if (correctAnswerIndex === -1) {
            throw new Error('Correct answer does not match any option');
        }

        // Return in the format expected by the app
        const questionResult = {
            id: level,
            question: questionData.question,
            options: questionData.options,
            correctAnswer: correctAnswerIndex,
            translation: questionData.translation || '',
        };
        console.log('✅ Successfully parsed question:', questionResult.question.substring(0, 50) + '...');
        return questionResult;
    } catch (error) {
        console.error('❌ Error fetching question from Gemini:', error);
        console.error('❌ Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
        throw error;
    }
}

