// Utility functions can be added here
export const calculateScore = (currentScore, isCorrect) => {
    return isCorrect ? currentScore + 10 : currentScore - 10;
};