import { PRIZE_LADDER } from '../data/gameData';

const MoneyLadder = ({ currentLevel }) => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-4 space-y-2">
            <h2 className="text-yellow-400 text-xl font-bold mb-4">Prize Money</h2>
            <div className="w-full space-y-1">
                {PRIZE_LADDER.slice().reverse().map((prize) => {
                    const isActive = prize.level === currentLevel;
                    const isPassed = prize.level < currentLevel;

                    return (
                        <div
                            key={prize.level}
                            className={`
                w-full py-2 px-4 rounded-lg transition-all duration-300
                ${isActive
                                    ? 'bg-yellow-400 text-blue-900 font-bold scale-105 shadow-lg shadow-yellow-400/50 animate-pulse'
                                    : isPassed
                                        ? 'bg-green-600/30 text-green-300'
                                        : 'bg-blue-800/50 text-white'
                                }
                ${prize.isMilestone ? 'border-2 border-yellow-400' : 'border border-blue-700'}
              `}
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-semibold">Q{prize.level}</span>
                                <span className="text-sm font-bold">{prize.amount}</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MoneyLadder;

