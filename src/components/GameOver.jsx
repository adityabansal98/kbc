const GameOver = ({ totalWinnings, onRestart }) => {
    return (
        <div className="fixed inset-0 bg-gradient-to-b from-blue-900 to-purple-900 flex items-center justify-center z-50">
            <div className="bg-blue-900/95 border-4 border-yellow-400 rounded-2xl p-8 md:p-12 max-w-2xl w-full mx-4 text-center shadow-2xl">
                <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-6">
                    Game Over!
                </h1>
                <div className="mb-8">
                    <p className="text-white text-xl mb-4">You won:</p>
                    <p className="text-yellow-400 text-5xl md:text-6xl font-bold">
                        {totalWinnings}
                    </p>
                </div>
                <button
                    onClick={onRestart}
                    className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg text-xl font-bold hover:bg-yellow-300 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                    Play Again
                </button>
            </div>
        </div>
    );
};

export default GameOver;

