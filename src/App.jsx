import { useState, useEffect } from 'react';
import Question from './components/Question';
import Option from './components/Option';
import MoneyLadder from './components/MoneyLadder';
import GameOver from './components/GameOver';
import { PRIZE_LADDER, FALLBACK_QUESTIONS } from './data/gameData';
import { fetchQuestion } from './services/gemini';
import { playAudio, speakQuestionAndOptions, speakQuestionAndOptionsElevenLabs } from './utils/audio';
import {
  getCachedQuestion,
  saveQuestionToCache,
  isQuotaExhausted,
  clearQuestionCache
} from './utils/questionCache';

// Track which levels are currently being fetched (prevents duplicate calls)
const FETCH_LOCKS = {};

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [totalWinnings, setTotalWinnings] = useState('₹0');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingCache, setUsingCache] = useState(false);
  const [quotaExhausted, setQuotaExhausted] = useState(false);
  const [audioReady, setAudioReady] = useState(false);

  const currentPrize = PRIZE_LADDER[currentQuestionIndex]?.amount || '₹0';
  const currentLevel = currentQuestionIndex + 1;

  useEffect(() => {
    const loadQuestion = async () => {
      // 1. GAME OVER CHECK
      if (currentLevel > 15) return;

      // Skip if game is over (will be handled by handleRestart)
      if (gameOver) return;

      // 2. CHECK CACHE FIRST (localStorage with expiration)
      const cachedQuestion = getCachedQuestion(currentLevel);
      if (cachedQuestion) {
        console.log(`💾 Using cached question for level ${currentLevel}`);
        setCurrentQuestion(cachedQuestion);
        setUsingCache(true);
        setQuotaExhausted(isQuotaExhausted());
        setError(null);
        setAudioReady(false);

        // Generate audio in parallel while showing loading screen
        speakQuestionAndOptionsElevenLabs(
          cachedQuestion.question,
          cachedQuestion.options
        )
          .then((audio) => {
            console.log("✅ Audio ready for cached question");
            setAudioReady(true);
            setLoading(false);
            // Start playing audio when question screen appears
            audio.play().catch(err => console.error("Audio play failed:", err));
          })
          .catch((err) => {
            console.error("❌ Audio generation failed:", err);
            // Still show question even if audio fails
            setAudioReady(true);
            setLoading(false);
          });
        return;
      }

      // 3. CHECK IF QUOTA IS EXHAUSTED
      const quotaExhausted = isQuotaExhausted();
      setQuotaExhausted(quotaExhausted);

      if (quotaExhausted) {
        console.log('⚠️ Quota exhausted, using fallback question');
        setError('Daily API limit reached. Using fallback question.');
        const fallbackQuestion = FALLBACK_QUESTIONS[currentQuestionIndex] || FALLBACK_QUESTIONS[0];
        setCurrentQuestion(fallbackQuestion);
        setUsingCache(false);
        setAudioReady(false);

        // Generate audio in parallel while showing loading screen
        speakQuestionAndOptionsElevenLabs(
          fallbackQuestion.question,
          fallbackQuestion.options
        )
          .then((audio) => {
            console.log("✅ Audio ready for fallback question");
            setAudioReady(true);
            setLoading(false);
            // Start playing audio when question screen appears
            audio.play().catch(err => console.error("Audio play failed:", err));
          })
          .catch((err) => {
            console.error("❌ Audio generation failed:", err);
            // Still show question even if audio fails
            setAudioReady(true);
            setLoading(false);
          });
        return;
      }

      // 4. PREVENT DUPLICATE FETCHES
      if (FETCH_LOCKS[currentLevel]) {
        console.log(`🔒 Already fetching level ${currentLevel}`);
        return;
      }

      // Mark as fetching
      FETCH_LOCKS[currentLevel] = true;

      setLoading(true);
      setError(null);
      setUsingCache(false);
      setSelectedOption(null);
      setIsLocked(false);
      setIsRevealed(false);
      setIsCorrect(false);
      setIsWrong(false);
      setShowNextButton(false);
      setAudioReady(false);

      try {
        console.log(`🚀 Fetching question from API for level ${currentLevel}`);

        // Get history of previously asked questions from cache
        const history = [];
        for (let i = 1; i < currentLevel; i++) {
          const cached = getCachedQuestion(i);
          if (cached) {
            history.push(cached.question);
          }
        }

        // Fetch question
        const question = await fetchQuestion(currentLevel, history);

        // Save to cache
        saveQuestionToCache(currentLevel, question);

        setCurrentQuestion(question);
        setError(null);
        setQuotaExhausted(false);

        // Generate audio in parallel while showing loading screen
        speakQuestionAndOptionsElevenLabs(
          question.question,
          question.options
        )
          .then((audio) => {
            console.log("✅ Audio ready - showing question");
            setAudioReady(true);
            setLoading(false);
            // Start playing audio when question screen appears
            audio.play().catch(err => console.error("Audio play failed:", err));
          })
          .catch((err) => {
            console.error("❌ Audio generation failed:", err);
            // Still show question even if audio fails
            setAudioReady(true);
            setLoading(false);
          });
      } catch (err) {
        console.error('❌ API Error:', err);

        const isRateLimit = err.message && err.message.includes('429');
        setQuotaExhausted(isRateLimit);

        if (isRateLimit) {
          setError('Daily API limit reached (20 requests/day). Using fallback question.');
        } else {
          setError('API error. Using fallback question.');
        }

        // Use fallback question
        const fallbackQuestion = FALLBACK_QUESTIONS[currentQuestionIndex] || FALLBACK_QUESTIONS[0];
        setCurrentQuestion(fallbackQuestion);

        // Generate audio in parallel while showing loading screen
        speakQuestionAndOptionsElevenLabs(
          fallbackQuestion.question,
          fallbackQuestion.options
        )
          .then((audio) => {
            console.log("✅ Audio ready for fallback question");
            setAudioReady(true);
            setLoading(false);
            // Start playing audio when question screen appears
            audio.play().catch(err => console.error("Audio play failed:", err));
          })
          .catch((err) => {
            console.error("❌ Audio generation failed:", err);
            // Still show question even if audio fails
            setAudioReady(true);
            setLoading(false);
          });
      } finally {
        // Release lock after delay
        setTimeout(() => {
          delete FETCH_LOCKS[currentLevel];
        }, 2000);
      }
    };

    loadQuestion();
  }, [currentQuestionIndex, currentLevel, gameOver]);

  // Cleanup audio when component unmounts or question changes
  useEffect(() => {
    return () => {
      // Stop speech if component unmounts or question changes
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      // Stop audio if playing
      if (window.currentKbcAudio) {
        window.currentKbcAudio.pause();
        window.currentKbcAudio = null;
      }
    };
  }, [currentQuestion]);

  const handleOptionClick = (optionIndex) => {
    if (isLocked || isRevealed) return;

    // Stop any ongoing speech when user selects an option
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Stop ElevenLabs audio if playing
    if (window.currentKbcAudio) {
      window.currentKbcAudio.pause();
      window.currentKbcAudio.currentTime = 0; // Reset to beginning
      window.currentKbcAudio = null;
    }

    setSelectedOption(optionIndex);
    setIsLocked(true);
    playAudio('lock');

    setTimeout(() => {
      setIsRevealed(true);
      const correct = optionIndex === currentQuestion.correctAnswer;
      setIsCorrect(correct);
      setIsWrong(!correct);

      if (correct) {
        playAudio('correct');
        setShowNextButton(true);
        setTotalWinnings(currentPrize);
      } else {
        playAudio('wrong');
        const safePrize = currentQuestionIndex > 0 ? PRIZE_LADDER[currentQuestionIndex - 1]?.amount : '₹0';
        setTotalWinnings(safePrize);
        setTimeout(() => { setGameOver(true); }, 2000);
      }
    }, 3000);
  };

  const handleNextQuestion = () => {
    // Stop any ongoing speech when moving to next question
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Stop ElevenLabs audio if playing
    if (window.currentKbcAudio) {
      window.currentKbcAudio.pause();
      window.currentKbcAudio.currentTime = 0;
      window.currentKbcAudio = null;
    }

    // Reset audio ready state
    setAudioReady(false);

    if (currentLevel < 15) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setTotalWinnings(PRIZE_LADDER[PRIZE_LADDER.length - 1].amount);
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    // Stop any ongoing speech when restarting
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }

    // Clear cache so new game gets fresh questions
    clearQuestionCache();

    // Clear all fetch locks to allow fresh fetches
    Object.keys(FETCH_LOCKS).forEach(key => delete FETCH_LOCKS[key]);

    console.log('🔄 Starting new game - cache cleared');

    // Reset all state
    setCurrentQuestionIndex(0);
    setCurrentQuestion(null); // Clear current question to trigger fresh load
    setSelectedOption(null);
    setIsLocked(false);
    setIsRevealed(false);
    setIsCorrect(false);
    setIsWrong(false);
    setShowNextButton(false);
    setGameOver(false);
    setTotalWinnings('₹0');
    setLoading(true); // Set loading to true to show loading screen
    setUsingCache(false);
    setError(null);
    setQuotaExhausted(false);
    setAudioReady(false);
  };

  if (gameOver) return <GameOver totalWinnings={totalWinnings} onRestart={handleRestart} />;

  if (loading || !currentQuestion || !audioReady) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-2xl font-bold text-yellow-400">अगला सवाल, आपकी स्क्रीन पर अब आ रहा है...</p>
          {error && <p className="text-red-300 mt-2 text-sm">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Status Banner */}
        {(usingCache || quotaExhausted || error) && (
          <div className={`mb-4 p-3 rounded-lg text-center text-sm ${usingCache ? 'bg-green-900/50 text-green-200' :
            quotaExhausted ? 'bg-orange-900/50 text-orange-200' :
              'bg-blue-900/50 text-blue-200'
            }`}>
            {usingCache && '💾 Using cached question'}
            {quotaExhausted && !usingCache && '⚠️ Daily API limit reached. Using fallback question.'}
            {error && !quotaExhausted && !usingCache && error}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
            <Question questionText={currentQuestion.question} questionNumber={currentLevel} />
            <div className="w-full max-w-3xl space-y-4">
              {currentQuestion.options.map((option, index) => (
                <Option
                  key={index}
                  letter={String.fromCharCode(65 + index)}
                  text={option}
                  onClick={() => handleOptionClick(index)}
                  isLocked={isLocked && selectedOption === index}
                  isCorrect={isRevealed && index === currentQuestion.correctAnswer}
                  isWrong={isWrong && selectedOption === index}
                  isDisabled={isLocked || isRevealed}
                />
              ))}
            </div>
            {showNextButton && (
              <button onClick={handleNextQuestion} className="mt-8 bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-xl font-bold hover:bg-yellow-300">
                Next Question
              </button>
            )}
          </div>
          <div className="lg:w-80 w-full lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
            <div className="bg-blue-900/80 rounded-lg border-2 border-yellow-400/50 p-4 h-full overflow-y-auto">
              <MoneyLadder currentLevel={currentLevel} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;