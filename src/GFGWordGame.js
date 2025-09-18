import React, { useState, useEffect, useCallback, useMemo, memo } from 'react';

// Simple translations
const translations = {
  en: {
    title: "Word Guessing Game",
    languageButton: "Switch to தமிழ்",
    selectLevel: "Choose Difficulty Level",
    beginner: "Beginner Level",
    medium: "Medium Level",
    advanced: "Advanced Level",
    seconds: "s",
    question: "Question",
    of: "of",
    timeLeft: "Time:",
    hint: "Hint:",
    yourScore: "Score:",
    hintsRemaining: "Hints:",
    getHint: "Get Hint",
    removeLetter: "Remove Letter",
    guess: "Check Word",
    restart: "Restart",
    backToMenu: "Back to Level",
    correctGuess: "Correct! Well done!",
    wrongGuess: "Wrong guess. Try again!",
    timeUp: "Time's up!",
    gameOver: "Game Over!",
    levelComplete: "Level Complete!",
    congratulations: "Congratulations!",
    correctWordWas: "The word was:",
    questionsCorrect: "questions correct out of",
    nextLevel: "Next Level",
     tooManyWrongGuesses: "Too many wrong guesses! Game over!"
  },
  ta: {
    title: "சொல் அறிதல் விளையாட்டு",
    languageButton: "Switch to English",
    selectLevel: "சிரமத்தை தேர்ந்தெடுக்கவும்",
    beginner: "ஆரம்ப நிலை",
    medium: "இடைநிலை",
    advanced: "உயர் நிலை",
    seconds: "வி",
    question: "கேள்வி",
    of: "இல்",
    timeLeft: "நேரம்:",
    hint: "குறிப்பு:",
    yourScore: "மதிப்பெண்:",
    hintsRemaining: "குறிப்புகள்:",
    getHint: "குறிப்பு பெறுக",
    removeLetter: "எழுத்தை அகற்று",
    guess: "சொல்லை சரிபார்க்கவும்",
    restart: "மீண்டும் தொடங்கு",
    backToMenu: "முகப்புக்கு திரும்பு",
    correctGuess: "சரி! நல்லது!",
    wrongGuess: "தவறான ஊகம். மீண்டும் முயற்சிக்கவும்!",
    timeUp: "நேரம் முடிந்துவிட்டது!",
    gameOver: "விளையாட்டு முடிந்தது!",
    levelComplete: "நிலை முடிந்தது!",
    congratulations: "வாழ்த்துக்கள்!",
    correctWordWas: "சொல்:",
    questionsCorrect: "கேள்விகள் சரியாக",
    nextLevel: "அடுத்த நிலை",tooManyWrongGuesses: "அதிக தவறான ஊகங்கள்! விளையாட்டு முடிந்தது!"
  }
};

// Sample word data
const gameWords = {
  beginner: [
    { word: "CAT", description: { en: "A small furry pet that meows", ta: "மியாவ் என்று சத்தம் போடும் சிறிய செல்லப்பிராணி" }},
    { word: "DOG", description: { en: "A loyal pet that barks", ta: "குரைக்கும் வீரியமுள்ள செல்லப்பிராணி" }},
    { word: "SUN", description: { en: "The bright star that gives us light", ta: "ஒளி தரும் பிரகாசமான நட்சத்திரம்" }},
    { word: "TREE", description: { en: "A tall plant with branches and leaves", ta: "கிளைகள் மற்றும் இலைகளுடன் உயரமான தாவரம்" }},
    { word: "BOOK", description: { en: "Something you read with pages", ta: "படிக்க பயன்படும் பக்கங்களுடன் கூடியது" }},
    { word: "BIRD", description: { en: "An animal that can fly", ta: "பறக்க கூடிய விலங்கு" }},
    { word: "FISH", description: { en: "An animal that lives in water", ta: "தண்ணீரில் வாழும் விலங்கு" }},
    { word: "APPLE", description: { en: "A red or green fruit", ta: "சிவப்பு அல்லது பச்சை நிற பழம்" }},
    { word: "HOUSE", description: { en: "A place where people live", ta: "மனிதர்கள் வாழும் இடம்" }},
    { word: "WATER", description: { en: "Clear liquid we drink", ta: "நாம் குடிக்கும் தெளிவான திரவம்" }}
  ],
  medium: [
    { word: "COMPUTER", description: { en: "Electronic device for processing data", ta: "தகவல்களை செயல்படுத்தும் மின்னணு சாதனம்" }},
    { word: "ELEPHANT", description: { en: "Large grey animal with a trunk", ta: "துதிக்கையுடன் கூடிய பெரிய சாம்பல் நிற விலங்கு" }},
    { word: "RAINBOW", description: { en: "Colorful arc in the sky after rain", ta: "மழைக்கு பின் வானில் தோன்றும் வண்ண வளையம்" }},
    { word: "MOUNTAIN", description: { en: "Very tall natural elevation", ta: "மிக உயரமான இயற்கை உயர்வு" }},
    { word: "BUTTERFLY", description: { en: "Colorful insect with wings", ta: "இறக்கைகளுடன் கூடிய வண்ணமயமான பூச்சி" }},
    { word: "TELEPHONE", description: { en: "Device used for making calls", ta: "அழைப்புகள் செய்ய பயன்படும் சாதனம்" }},
    { word: "BICYCLE", description: { en: "Two-wheeled vehicle you pedal", ta: "மிதியடிக்கும் இரு சக்கர வாகனம்" }},
    { word: "SANDWICH", description: { en: "Food made with bread and filling", ta: "ரொட்டி மற்றும் நிரப்பலுடன் செய்யப்படும் உணவு" }},
    { word: "HOSPITAL", description: { en: "Place where sick people get treatment", ta: "நோயாளிகள் சிகிச்சை பெறும் இடம்" }},
    { word: "LIBRARY", description: { en: "Place with many books", ta: "பல புத்தகங்கள் உள்ள இடம்" }}
  ],
  advanced: [
    { word: "ENCYCLOPEDIA", description: { en: "Comprehensive reference work", ta: "விரிவான குறிப்பு நூல்" }},
    { word: "PHILOSOPHY", description: { en: "Study of fundamental questions", ta: "அடிப்படை கேள்விகளின் ஆய்வு" }},
    { word: "CONSTELLATION", description: { en: "Group of stars forming a pattern", ta: "ஒரு வடிவத்தை உருவாக்கும் நட்சத்திரக் கூட்டம்" }},
    { word: "ARCHITECTURE", description: { en: "Art and science of building design", ta: "கட்டிடம் வடிவமைப்பின் கலை மற்றும் அறிவியல்" }},
    { word: "PHOTOGRAPHY", description: { en: "Art of creating images with cameras", ta: "கேமராக்களால் படங்கள் உருவாக்கும் கலை" }},
    { word: "MATHEMATICS", description: { en: "Study of numbers and calculations", ta: "எண்கள் மற்றும் கணக்குகளின் ஆய்வு" }},
    { word: "TEMPERATURE", description: { en: "Measure of how hot or cold", ta: "எவ்வளவு வெப்பம் அல்லது குளிர் என்பதன் அளவு" }},
    { word: "VOCABULARY", description: { en: "Collection of words in a language", ta: "ஒரு மொழியில் உள்ள சொற்களின் தொகுப்பு" }},
    { word: "UNIVERSITY", description: { en: "Institution of higher learning", ta: "உயர் கல்வி நிறுவனம்" }},
    { word: "DICTIONARY", description: { en: "Book of word definitions", ta: "சொற்களின் பொருள் விளக்கங்கள் உள்ள புத்தகம்" }}
  ]
};

// Simple feedback component
const GameFeedback = ({ message, type, correctWord, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: type === 'correct' ? '#10b981' : '#ef4444',
      color: 'white',
      padding: '2rem',
      borderRadius: '12px',
      fontSize: '1.2rem',
      fontWeight: '600',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      zIndex: 1000,
      textAlign: 'center',
      maxWidth: '400px',
      animation: 'fadeIn 0.3s ease-out'
    }}>
      <div>{message}</div>
      {correctWord && (
        <div style={{ marginTop: '1rem', fontSize: '1rem' }}>
          The word was: <strong>{correctWord}</strong>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: 'translate(-50%, -50%) scale(0.9)'; }
          to { opacity: 1; transform: 'translate(-50%, -50%) scale(1)'; }
        }
      `}</style>
    </div>
  );
};

// Utility functions
const shuffleArray = (array) => {
  let shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const generateRandomQuestions = (level) => {
  const levelWords = gameWords[level];
  if (!levelWords || levelWords.length === 0) {
    return [];
  }
  const availableWords = [...levelWords];
  const selectedWords = [];
  const questionsCount = Math.min(10, availableWords.length);
  
  for (let i = 0; i < questionsCount; i++) {
    const randomIndex = Math.floor(Math.random() * availableWords.length);
    selectedWords.push(availableWords[randomIndex]);
    availableWords.splice(randomIndex, 1);
  }
  return selectedWords;
};

// Main component
const WordGame = memo(() => {
  const [language, setLanguage] = useState("en");
  const [currentLevel, setCurrentLevel] = useState(null);
  const [currentScreen, setCurrentScreen] = useState("home"); // home, game, results
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [wordData, setWordData] = useState(null);
  const [randomQuestions, setRandomQuestions] = useState([]);
  const [chosenLetters, setChosenLetters] = useState([]);
  const [hints, setHints] = useState(3);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [score, setScore] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [gameStartTime, setGameStartTime] = useState(null);
  const [totalGameTime, setTotalGameTime] = useState(0);
  const [hintsUsedThisQuestion, setHintsUsedThisQuestion] = useState(0);

  const t = translations[language];

  // Timer configuration
  const getTimerDuration = (level) => {
    switch(level) {
      case 'beginner': return 50;
      case 'medium': return 40;
      case 'advanced': return 30;
      default: return 50;
    }
  };

  // Timer effect
  useEffect(() => {
    let interval;
    if (timerActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerActive) {
      handleTimeUp();
    }
    return () => clearInterval(interval);
  }, [timerActive, timeLeft]);

  const handleTimeUp = () => {
    setTimerActive(false);
   setFeedback({ 
  message: t.tooManyWrongGuesses, 
  type: 'incorrect',
  correctWord: wordData.word 
});
  };

  const handleFeedbackClose = useCallback(() => {
    setFeedback(null);
    nextQuestion();
  }, [currentQuestionIndex, randomQuestions]);

  const startGame = (level) => {
    setCurrentLevel(level);
    setCurrentScreen("game");
    setCurrentQuestionIndex(0);
    setScore(0);
    setCorrectAnswers(0);
    setGameStartTime(Date.now());
    
    const randomlySelectedQuestions = generateRandomQuestions(level);
    setRandomQuestions(randomlySelectedQuestions);
    
    if (randomlySelectedQuestions.length > 0) {
      startQuestion(randomlySelectedQuestions, 0);
    }
  };

  const startQuestion = (questionsArray, questionIndex) => {
    console.log(`Starting question ${questionIndex + 1} of ${questionsArray.length}`);
    if (questionIndex >= questionsArray.length) {
      completeLevel();
      return;
    }

    setWordData(questionsArray[questionIndex]);
    setChosenLetters([]);
    //setHints(3);
    setHints(3); // Reset hints for each question
   setHintsUsedThisQuestion(0); // Reset hints counter
    setWrongGuesses(0);
    setTimeLeft(getTimerDuration(currentLevel));
    setTimerActive(true);
  };

const selectLetter = (letter) => {
  if (!chosenLetters.includes(letter) && timerActive) {
    setChosenLetters([...chosenLetters, letter]);
    if (!wordData.word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      
      // Check if maximum wrong guesses reached
      if (newWrongGuesses >= 3) {
        setTimerActive(false);
        setFeedback({ 
          message: "Too many wrong guesses!", 
          type: 'incorrect',
          correctWord: wordData.word 
        });
      }
    }
  }
};

const useHint = () => {
  if (hints > 0 && timerActive) {
    const hiddenLetterIndex = wordData.word
      .split("")
      .findIndex((letter) => !chosenLetters.includes(letter));
    
    if (hiddenLetterIndex !== -1) {
      setChosenLetters([...chosenLetters, wordData.word[hiddenLetterIndex]]);
      setHints(hints - 1);
      setHintsUsedThisQuestion(hintsUsedThisQuestion + 1); // Add this line
    }
  }
};

  const removeLetter = () => {
    if (timerActive && chosenLetters.length > 0) {
      setChosenLetters(chosenLetters.slice(0, -1));
    }
  };

  const checkWordGuessed = () => {
    return wordData.word.split("").every((letter) => chosenLetters.includes(letter));
  };

  const guessWord = () => {
    setTimerActive(false);
    
    if (checkWordGuessed()) {
      const timeBonus = Math.max(0, timeLeft * 2);
      const questionScore = 100 + timeBonus;
      setScore(score + questionScore);
      setCorrectAnswers(correctAnswers + 1);
      setFeedback({ message: t.correctGuess, type: 'correct' });
    } else {
      setFeedback({ 
        message: t.wrongGuess, 
        type: 'incorrect',
        correctWord: wordData.word 
      });
    }
  };

  const nextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex >= randomQuestions.length) {
      completeLevel();
      return;
    }
    setCurrentQuestionIndex(nextIndex);
    startQuestion(randomQuestions, nextIndex);
  }, [currentQuestionIndex, randomQuestions, currentLevel]);

  const completeLevel = useCallback(() => {
    setTimerActive(false);
    setCurrentScreen("results");
    
    if (gameStartTime) {
      const endTime = Date.now();
      const timeTakenInSeconds = Math.round((endTime - gameStartTime) / 1000);
      setTotalGameTime(timeTakenInSeconds);
    }
  }, [gameStartTime]);

const resetGame = () => {
  setCurrentScreen("home");
  setCurrentLevel(null);
  setCurrentQuestionIndex(0);
  setWordData(null);
  setRandomQuestions([]);
  setChosenLetters([]);
  setHints(3);
  setHintsUsedThisQuestion(0); // Add this line
  setWrongGuesses(0);
  setTimeLeft(0);
  setTimerActive(false);
  setScore(0);
  setCorrectAnswers(0);
  setGameStartTime(null);
  setTotalGameTime(0);
};
  // Render alphabet buttons
  const renderLetters = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return Array.from(letters).map((letter, index) => (
      <button
        key={index}
        onClick={() => selectLetter(letter)}
        disabled={chosenLetters.includes(letter) || !timerActive}
        style={{
          padding: '8px',
          margin: '2px',
          background: chosenLetters.includes(letter) ? '#6b7280' : '#3b82f6',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: chosenLetters.includes(letter) || !timerActive ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          fontWeight: 'bold',
          minWidth: '36px',
          opacity: chosenLetters.includes(letter) || !timerActive ? 0.5 : 1
        }}
      >
        {letter}
      </button>
    ));
  };

  // Common styles
  const baseStyle = {
    fontFamily: 'Arial, sans-serif',
    margin: 0,
    padding: 0,
    minHeight: '100vh',
    width: '100%'
  };

  const cardStyle = {
    background: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    padding: '2rem',
    margin: '1rem',
    maxWidth: '800px',
    width: '100%'
  };

  const buttonStyle = {
    padding: '12px 24px',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    width: '100%',
    marginBottom: '12px'
  };

  // Home Screen
  if (currentScreen === "home") {
    return (
      <div style={{
        ...baseStyle,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              color: '#333',
              marginBottom: '1rem'
            }}>
              {t.title}
            </h1>
            
            <button 
              onClick={() => setLanguage(language === "en" ? "ta" : "en")}
              style={{
                ...buttonStyle,
                background: '#6366f1',
                color: 'white',
                maxWidth: '200px',
                margin: '0 auto 2rem'
              }}
            >
              {t.languageButton}
            </button>

            <h2 style={{ color: '#666', marginBottom: '2rem' }}>{t.selectLevel}</h2>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={() => startGame("beginner")} 
              style={{
                ...buttonStyle,
                background: '#10b981',
                color: 'white',
                fontSize: '18px'
              }}
            >
              {t.beginner}
              <div style={{ fontSize: '14px', opacity: '0.9', marginTop: '4px' }}>
                ⏱ 50{t.seconds} • 10 questions
              </div>
            </button>
            
            <button 
              onClick={() => startGame("medium")} 
              style={{
                ...buttonStyle,
                background: '#f59e0b',
                color: 'white',
                fontSize: '18px'
              }}
            >
              {t.medium}
              <div style={{ fontSize: '14px', opacity: '0.9', marginTop: '4px' }}>
                ⏱ 40{t.seconds} • 10 questions
              </div>
            </button>
            
            <button 
              onClick={() => startGame("advanced")} 
              style={{
                ...buttonStyle,
                background: '#ef4444',
                color: 'white',
                fontSize: '18px'
              }}
            >
              {t.advanced}
              <div style={{ fontSize: '14px', opacity: '0.9', marginTop: '4px' }}>
                ⏱ 30{t.seconds} • 10 questions
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  if (currentScreen === "game" && wordData) {
    const progressPercentage = ((currentQuestionIndex + 1) / randomQuestions.length) * 100;

    return (
      <div style={{
        ...baseStyle,
        background: currentLevel === 'beginner' ? 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)' :
                   currentLevel === 'medium' ? 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)' :
                   'linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '1rem 2rem',
          background: 'rgba(255,255,255,0.1)',
          color: 'white',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {t.question} {currentQuestionIndex + 1}/{randomQuestions.length}
          </div>
          
          <div style={{
            fontSize: '18px',
            fontWeight: 'bold',
            background: timeLeft <= 10 ? '#ef4444' : 'rgba(255,255,255,0.2)',
            padding: '8px 16px',
            borderRadius: '20px'
          }}>
            {t.timeLeft} {timeLeft}{t.seconds}
          </div>
          
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>
            {t.yourScore} {score}
          </div>
          
          <button 
            onClick={resetGame}
            style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🏠 {t.backToMenu}
          </button>
        </div>

        {/* Progress Bar */}
        <div style={{
          height: '4px',
          background: 'rgba(255,255,255,0.2)',
          margin: '0 2rem'
        }}>
          <div style={{
            height: '100%',
            width: `${progressPercentage}%`,
            background: '#10b981',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Game Content */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem'
        }}>
          <div style={{
            ...cardStyle,
            maxWidth: '800px'
          }}>
            {/* Word Display */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              flexWrap: 'wrap',
              gap: '8px',
              marginBottom: '2rem'
            }}>
              {Array.from(wordData.word).map((letter, index) => (
                <div 
                  key={index} 
                  style={{
                    width: '40px',
                    height: '40px',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    background: chosenLetters.includes(letter) ? '#e5e7eb' : 'white',
                    color: chosenLetters.includes(letter) ? '#374151' : 'transparent'
                  }}
                >
                  {chosenLetters.includes(letter) ? letter : ''}
                </div>
              ))}
            </div>
            
            {/* Hint */}
            <p style={{
              fontSize: '18px',
              color: '#666',
              textAlign: 'center',
              marginBottom: '2rem',
              lineHeight: '1.5'
            }}>
              <strong>{t.hint}</strong> {wordData.description[language]}
            </p>
            
            {/* Game Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '2rem',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <div style={{ fontSize: '16px', color: '#666' }}>
                ✅ {correctAnswers}/{randomQuestions.length}
              </div>
             <div style={{ fontSize: '16px', color: '#666' }}>
  {t.hintsRemaining} {hints} | Used: {hintsUsedThisQuestion}
</div>
              <div style={{ fontSize: '16px', color: '#ef4444' }}>
                ❌ {wrongGuesses}/3
              </div>
            </div>
            
            {/* Letter Selection */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(36px, 1fr))',
              gap: '4px',
              marginBottom: '2rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              {renderLetters()}
            </div>
            
            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}>
              <div style={{
                display: 'flex',
                gap: '1rem',
                flexWrap: 'wrap'
              }}>
                <button 
                  onClick={useHint}
                  disabled={hints === 0 || !timerActive}
                  style={{
                    ...buttonStyle,
                    background: hints === 0 || !timerActive ? '#9ca3af' : '#6366f1',
                    color: 'white',
                    flex: '1',
                    minWidth: '120px'
                  }}
                >
                  💡 {t.getHint}
                </button>
                
                <button 
                  onClick={removeLetter}
                  disabled={chosenLetters.length === 0 || !timerActive}
                  style={{
                    ...buttonStyle,
                    background: chosenLetters.length === 0 || !timerActive ? '#9ca3af' : '#f59e0b',
                    color: 'white',
                    flex: '1',
                    minWidth: '120px'
                  }}
                >
                  ⬅ {t.removeLetter}
                </button>
              </div>
              
              <button 
                onClick={guessWord}
                disabled={chosenLetters.length === 0 || !timerActive}
                style={{
                  ...buttonStyle,
                  background: chosenLetters.length === 0 || !timerActive ? '#9ca3af' : '#10b981',
                  color: 'white',
                  fontSize: '18px',
                  fontWeight: 'bold'
                }}
              >
                ✓ {t.guess}
              </button>
            </div>
          </div>
        </div>
        
        {feedback && (
          <GameFeedback 
            message={feedback.message} 
            type={feedback.type} 
            correctWord={feedback.correctWord}
            onClose={handleFeedbackClose}
          />
        )}
      </div>
    );
  }

  // Results Screen
  if (currentScreen === "results") {
    const percentage = (correctAnswers / randomQuestions.length) * 100;
    const isHighScore = percentage >= 80;
    const isMediumScore = percentage >= 60;

    return (
      <div style={{
        ...baseStyle,
        background: 'linear-gradient(135deg, #4c1d95 0%, #7c2d12 50%, #be185d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={cardStyle}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>
              {isHighScore ? '🏆' : isMediumScore ? '🎖' : '📚'}
            </div>
            
            <h1 style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              color: '#333',
              marginBottom: '1rem'
            }}>
              {t.levelComplete}
            </h1>
            
            <h2 style={{
              fontSize: 'clamp(1.5rem, 3vw, 2rem)',
              color: '#10b981',
              marginBottom: '2rem'
            }}>
              {t.congratulations}
            </h2>
            
            <div style={{
              background: '#f3f4f6',
              borderRadius: '12px',
              padding: '2rem',
              marginBottom: '2rem'
            }}>
              <div style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '1rem'
              }}>
                🏆 {score} points
              </div>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem',
                fontSize: '16px',
                color: '#666'
              }}>
                <div>
                  <strong>{correctAnswers}</strong> {t.questionsCorrect} <strong>{randomQuestions.length}</strong>
                </div>
                <div>
                  📊 <strong>{percentage.toFixed(1)}%</strong>
                </div>
                <div>
                  ⏱ <strong>{Math.floor(totalGameTime / 60)}m {totalGameTime % 60}s</strong>
                </div>
              </div>
              
              <div style={{
                width: '100%',
                height: '12px',
                background: '#e5e7eb',
                borderRadius: '6px',
                overflow: 'hidden',
                marginTop: '1rem'
              }}>
                <div style={{
                  height: '100%',
                  width: `${percentage}%`,
                  background: isHighScore ? '#10b981' : isMediumScore ? '#f59e0b' : '#6b7280',
                  borderRadius: '6px',
                  transition: 'width 1s ease'
                }} />
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button 
                onClick={() => startGame(currentLevel)}
                style={{
                  ...buttonStyle,
                  background: '#3b82f6',
                  color: 'white',
                  fontSize: '18px'
                }}
              >
                🔄 {t.restart}
              </button>
              
              {currentLevel !== 'advanced' && (
                <button 
                  onClick={() => {
                    const nextLevel = currentLevel === 'beginner' ? 'medium' : 'advanced';
                    startGame(nextLevel);
                  }}
                  style={{
                    ...buttonStyle,
                    background: '#10b981',
                    color: 'white',
                    fontSize: '18px'
                  }}
                >
                  ⬆ {t.nextLevel}
                </button>
              )}
              
              <button 
                onClick={resetGame}
                style={{
                  ...buttonStyle,
                  background: '#6b7280',
                  color: 'white',
                  fontSize: '18px'
                }}
              >
                🏠 {t.backToMenu}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <div style={baseStyle}></div>;
});

export default WordGame;