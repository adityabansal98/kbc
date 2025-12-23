const Option = ({
    letter,
    text,
    onClick,
    isLocked,
    isCorrect,
    isWrong,
    isDisabled
}) => {
    const getOptionStyles = () => {
        if (isWrong) {
            return 'bg-red-600 text-white border-red-500';
        }
        if (isCorrect) {
            return 'bg-green-600 text-white border-green-500';
        }
        if (isLocked) {
            return 'bg-orange-500 text-white border-orange-400';
        }
        return 'bg-blue-800/80 text-white border-blue-600 hover:bg-blue-700/90';
    };

    return (
        <button
            onClick={onClick}
            disabled={isDisabled || isLocked}
            className={`
        w-full py-5 px-8 mb-4
        border-2 transition-all duration-300
        ${getOptionStyles()}
        ${!isDisabled && !isLocked ? 'cursor-pointer transform hover:scale-105 hover:shadow-lg' : 'cursor-not-allowed'}
        font-semibold text-left
        shadow-md
      `}
            style={{
                clipPath: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)',
                borderRadius: '8px',
            }}
        >
            <div className="flex items-center space-x-4">
                <span className="text-2xl font-bold min-w-[40px]">{letter}:</span>
                <span className="text-lg flex-1">{text}</span>
            </div>
        </button>
    );
};

export default Option;

