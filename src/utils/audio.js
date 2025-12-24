const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;
const VOICE_ID = 'MkREn5Yzha4EnP3Dx0Sk'; // The voice ID you shared

// Play ElevenLabs Voice
/**
 * Generates audio for a question and its options using ElevenLabs
 * Returns a Promise that resolves with the audio element when ready to play
 * @param {string} question - The question text
 * @param {Array<string>} options - Array of option texts
 * @returns {Promise<HTMLAudioElement>} Resolves with audio element when ready
 */
export const speakQuestionAndOptionsElevenLabs = async (question, options) => {
    if (!ELEVEN_LABS_API_KEY) {
        console.error("Missing VITE_ELEVENLABS_API_KEY in .env");
        return Promise.reject(new Error("Missing API key"));
    }

    // 1. Stop any currently playing audio (essential for game restarts/next question)
    if (window.currentKbcAudio) {
        window.currentKbcAudio.pause();
        window.currentKbcAudio = null;
    }

    try {
        console.log("🎙️ Generating ElevenLabs Audio...");

        // 2. Construct a single script with natural pauses
        // We use "..." and line breaks to force the AI to pause between options
        const fullScript = `
            ${question}
            ...
            Option A. ${options[0]}
            ...
            Option B. ${options[1]}
            ...
            Option C. ${options[2]}
            ...
            Option D. ${options[3]}
        `;

        // 3. Call ElevenLabs API
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
            method: 'POST',
            headers: {
                'Accept': 'audio/mpeg',
                'Content-Type': 'application/json',
                'xi-api-key': ELEVEN_LABS_API_KEY
            },
            body: JSON.stringify({
                text: fullScript,
                model_id: "eleven_multilingual_v2", // Best for Hindi accent/pronunciation
                voice_settings: {
                    stability: 0.5,        // Lower = more expressive
                    similarity_boost: 0.75 // Higher = closer to original voice
                }
            })
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail?.message || "ElevenLabs API Error");
        }

        // 4. Load the audio and wait for it to be ready
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        // Save reference globally so we can stop it if the user clicks "Next" quickly
        window.currentKbcAudio = audio;

        // Return a promise that resolves when audio is loaded and ready to play
        return new Promise((resolve, reject) => {
            audio.addEventListener('canplaythrough', () => {
                console.log("✅ Audio ready to play");
                resolve(audio);
            }, { once: true });

            audio.addEventListener('error', (err) => {
                console.error("Audio load error:", err);
                reject(err);
            }, { once: true });

            // Load the audio
            audio.load();
        });

    } catch (error) {
        console.error("TTS Error:", error);
        return Promise.reject(error);
    }
};

/**
 * Audio helper function for KBC game
 * This function will be used to play different audio types
 * 
 * To use: Place your MP3 files in the /public/audio/ directory:
 * - lock_amit.mp3 (plays when option is clicked/locked)
 * - correct_amit.mp3 (plays when answer is correct)
 * - wrong_amit.mp3 (plays when answer is wrong)
 * - question.mp3 (plays before question appears)
 * 
 * @param {string} type - Type of audio to play ('lock', 'correct', 'wrong', 'question')
 */
export const playAudio = (type) => {
    // question.mp3 doesn't have _amit suffix, others do
    const filename = type === 'question' ? `${type}.mp3` : `${type}_amit.mp3`;
    const audio = new Audio(`/audio/${filename}`);
    audio.volume = 0.7; // Adjust volume as needed
    audio.play().catch(err => console.error('Audio playback failed:', err));

    console.log(`Playing audio: ${type}`);
};

/**
 * Plays the intro sound effect and returns a promise that resolves when it finishes
 * @returns {Promise<void>} Resolves when intro sound effect finishes playing
 */
export const playIntroSound = () => {
    return new Promise((resolve) => {
        const audio = new Audio('/audio/intro.mp3');
        audio.volume = 0.7;

        audio.addEventListener('ended', () => {
            console.log("✅ Intro sound effect finished");
            resolve();
        }, { once: true });

        audio.addEventListener('error', (err) => {
            console.error("Intro sound effect error:", err);
            // Resolve anyway so we don't block the game
            resolve();
        }, { once: true });

        audio.play().catch(err => {
            console.error('Intro sound playback failed:', err);
            // Resolve anyway so we don't block the game
            resolve();
        });
    });
};

/**
 * Plays the question sound effect and returns a promise that resolves when it finishes
 * @returns {Promise<void>} Resolves when question sound effect finishes playing
 */
export const playQuestionSound = () => {
    return new Promise((resolve, reject) => {
        const audio = new Audio('/audio/question.mp3');
        audio.volume = 0.7;

        audio.addEventListener('ended', () => {
            console.log("✅ Question sound effect finished");
            resolve();
        }, { once: true });

        audio.addEventListener('error', (err) => {
            console.error("Question sound effect error:", err);
            // Resolve anyway so we don't block the game
            resolve();
        }, { once: true });

        audio.play().catch(err => {
            console.error('Question sound playback failed:', err);
            // Resolve anyway so we don't block the game
            resolve();
        });
    });
};

/**
 * Speaks a question and its options sequentially
 * @param {string} question - The question text
 * @param {Array<string>} options - Array of option texts
 */
export const speakQuestionAndOptions = (question, options) => {
    if (!window.speechSynthesis) {
        console.warn('Speech synthesis not supported');
        return;
    }

    // Stop any previous speech
    window.speechSynthesis.cancel();

    // Helper to get voices (handles async loading)
    const getVoices = () => {
        let voices = window.speechSynthesis.getVoices();
        // If voices not loaded yet, wait for voiceschanged event
        if (voices.length === 0) {
            return new Promise((resolve) => {
                const handler = () => {
                    voices = window.speechSynthesis.getVoices();
                    window.speechSynthesis.removeEventListener('voiceschanged', handler);
                    resolve(voices);
                };
                window.speechSynthesis.addEventListener('voiceschanged', handler);
                // Fallback timeout
                setTimeout(() => resolve(window.speechSynthesis.getVoices()), 1000);
            });
        }
        return Promise.resolve(voices);
    };

    // Start speaking after voices are loaded
    getVoices().then((voices) => {
        const hindiVoice = voices.find(v => v.lang === 'hi-IN' && v.name.includes('Google'))
            || voices.find(v => v.lang === 'hi-IN');

        const createUtterance = (text) => {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'hi-IN';
            utterance.pitch = 0.7;
            utterance.rate = 0.85;
            utterance.volume = 1.0;
            if (hindiVoice) {
                utterance.voice = hindiVoice;
            }
            return utterance;
        };

        // First, speak the question
        const questionUtterance = createUtterance(question);

        // After question finishes, speak options sequentially
        questionUtterance.onend = () => {
            let currentIndex = 0;

            const speakNextOption = () => {
                if (currentIndex >= options.length) return;

                const optionLetter = String.fromCharCode(65 + currentIndex); // A, B, C, D
                const optionText = `Option ${optionLetter}, ${options[currentIndex]}`;
                const optionUtterance = createUtterance(optionText);

                optionUtterance.onend = () => {
                    currentIndex++;
                    speakNextOption();
                };

                window.speechSynthesis.speak(optionUtterance);
            };

            // Small delay before starting options
            setTimeout(() => {
                speakNextOption();
            }, 300);
        };

        window.speechSynthesis.speak(questionUtterance);
    });
};