/**
 * Audio helper function for KBC game
 * This function will be used to play different audio types
 * 
 * To use: Place your MP3 files in the /public/audio/ directory:
 * - lock.mp3 (plays when option is clicked/locked)
 * - correct.mp3 (plays when answer is correct)
 * - wrong.mp3 (plays when answer is wrong)
 * 
 * @param {string} type - Type of audio to play ('lock', 'correct', 'wrong')
 */
export const playAudio = (type) => {
    // Uncomment the following lines when MP3 files are placed in /public/audio/
    const audio = new Audio(`/audio/${type}.mp3`);
    audio.volume = 0.7; // Adjust volume as needed
    audio.play().catch(err => console.error('Audio playback failed:', err));

    console.log(`Playing audio: ${type}`);
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