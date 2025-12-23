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

