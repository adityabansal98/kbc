const Question = ({ questionText, questionNumber }) => {
    return (
        <div className="w-full mb-8">
            <div
                className="bg-blue-900/90 text-yellow-400 py-6 px-8 rounded-lg border-2 border-yellow-400/50 shadow-lg"
                style={{
                    clipPath: 'polygon(3% 0%, 97% 0%, 100% 50%, 97% 100%, 3% 100%, 0% 50%)',
                }}
            >
                <div className="text-sm text-yellow-300 mb-2 font-semibold">
                    Question {questionNumber}
                </div>
                <h2 className="text-2xl md:text-3xl font-bold leading-relaxed">
                    {questionText}
                </h2>
            </div>
        </div>
    );
};

export default Question;

