// scoreUtils.js

export const updateHighScore = (game, newScore) => {
    const highScores = JSON.parse(localStorage.getItem('highScores')) || {
      imageWord: 0,
      timedImage: 0,
      objectCounting: 0,
      alphabet: 0,
      '2048': 0,
      mathQuiz: 0
    };
  
    if (newScore > highScores[game]) {
      highScores[game] = newScore;
      localStorage.setItem('highScores', JSON.stringify(highScores));
    }
  };