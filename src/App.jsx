import { useState, useEffect } from 'react';
import Question from './components/Question';
import Option from './components/Option';
import MoneyLadder from './components/MoneyLadder';
import GameOver from './components/GameOver';
import { QUESTIONS, PRIZE_LADDER } from './data/gameData';
import { playAudio } from './utils/audio';

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isLocked, setIsLocked] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isWrong, setIsWrong] = useState(false);
  const [showNextButton, setShowNextButton] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [totalWinnings, setTotalWinnings] = useState('₹0');

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const currentPrize = PRIZE_LADDER[currentQuestionIndex]?.amount || '₹0';

  useEffect(() => {
    // Reset states when moving to next question
    if (currentQuestionIndex < QUESTIONS.length) {
      setSelectedOption(null);
      setIsLocked(false);
      setIsRevealed(false);
      setIsCorrect(false);
      setIsWrong(false);
      setShowNextButton(false);
    }
  }, [currentQuestionIndex]);

  const handleOptionClick = (optionIndex) => {
    if (isLocked || isRevealed) return;

    setSelectedOption(optionIndex);
    setIsLocked(true);
    playAudio('lock');

    // Wait 3 seconds before revealing answer
    setTimeout(() => {
      setIsRevealed(true);
      const correct = optionIndex === currentQuestion.correctAnswer;
      setIsCorrect(correct);
      setIsWrong(!correct);

      if (correct) {
        playAudio('correct');
        setShowNextButton(true);
        // Update total winnings
        setTotalWinnings(currentPrize);
      } else {
        playAudio('wrong');
        // Calculate safe winnings (last correctly answered question's prize)
        // If on question 1 (index 0) and wrong, get ₹0
        // Otherwise, get the prize from the previous question (last correct answer)
        const safePrize = currentQuestionIndex > 0
          ? PRIZE_LADDER[currentQuestionIndex - 1]?.amount
          : '₹0';
        setTotalWinnings(safePrize);
        setTimeout(() => {
          setGameOver(true);
        }, 2000);
      }
    }, 3000);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All questions answered correctly
      setTotalWinnings(PRIZE_LADDER[PRIZE_LADDER.length - 1].amount);
      setGameOver(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsLocked(false);
    setIsRevealed(false);
    setIsCorrect(false);
    setIsWrong(false);
    setShowNextButton(false);
    setGameOver(false);
    setTotalWinnings('₹0');
  };

  if (gameOver) {
    return <GameOver totalWinnings={totalWinnings} onRestart={handleRestart} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 to-purple-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Game Area */}
          <div className="flex-1 flex flex-col items-center justify-center min-h-[80vh]">
            <Question
              questionText={currentQuestion.question}
              questionNumber={currentQuestionIndex + 1}
            />

            <div className="w-full max-w-3xl space-y-4">
              {currentQuestion.options.map((option, index) => (
                <Option
                  key={index}
                  letter={String.fromCharCode(65 + index)} // A, B, C, D
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
              <button
                onClick={handleNextQuestion}
                className="mt-8 bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-xl font-bold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                Next Question
              </button>
            )}
          </div>

          {/* Money Ladder Sidebar */}
          <div className="lg:w-80 w-full lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
            <div className="bg-blue-900/80 rounded-lg border-2 border-yellow-400/50 p-4 h-full overflow-y-auto">
              <MoneyLadder currentLevel={currentQuestionIndex + 1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
