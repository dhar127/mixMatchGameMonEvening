import React, { useState, useEffect, useCallback, useMemo, memo } from "react";

// Tamil Translations
const translations = {
  english: {
    title: "Math Quiz Challenge",
    languageButton: "தமிழ்",
    beginner: "Beginner",
    intermediate: "Intermediate", 
    advanced: "Advanced",
    question: "Question",
    retry: "Retry",
    home: "Home",
    results: "Results",
    score: (score, total) => `You scored ${score}/${total}`,
    selectAnswerPrompt: "Select the correct answer:",
    sequencePrompt: "Order the steps by clicking them:",
    checkAnswer: "Check Answer",
    clearSequence: "Clear",
    answerPrompt: "Type your answer here...",
    correctAnswer: (answer) => `Correct Answer: ${answer}`,
    starPerformerTitle: "⭐ Star Performer!",
    achieverTitle: "🎯 Great Job!",
    needsPracticeTitle: "📚 Keep Practicing!",
    timeUp: "⏰ Time's up!",
    correct: "🎉 Correct! Well done!",
    nextQuestion: "Next Question"
  },
  tamil: {
    title: "கணித வினாடி வினா சவால்",
    languageButton: "English", 
    beginner: "ஆரம்பநிலை",
    intermediate: "இடைநிலை",
    advanced: "மேம்பட்ட நிலை",
    question: "கேள்வி",
    retry: "மீண்டும் முயற்சி செய்",
    home: "முகப்பு",
    results: "முடிவுகள்",
    score: (score, total) => `நீங்கள் ${score}/${total} மதிப்பெண் பெற்றீர்கள்`,
    selectAnswerPrompt: "சரியான விடையைத் தேர்ந்தெடுக்கவும்:",
    sequencePrompt: "படிநிலைகளை வரிசையாக கிளிக் செய்யவும்:",
    checkAnswer: "விடையைச் சரிபார்க்கவும்",
    clearSequence: "அழி",
    answerPrompt: "உங்கள் பதிலை இங்கே தட்டச்சு செய்யவும்...",
    correctAnswer: (answer) => `சரியான விடை: ${answer}`,
    starPerformerTitle: "⭐ சிறந்த சாதனையாளர்!",
    achieverTitle: "🎯 நல்லது!",
    needsPracticeTitle: "📚 தொடர்ந்து பயிற்சி செய்யுங்கள்!",
    timeUp: "⏰ நேரம் முடிந்துவிட்டது!",
    correct: "🎉 சரி! நல்லது!",
    nextQuestion: "அடுத்த கேள்வி"
  },
};

// Question Bank
const questionBank = {
  beginner: [
    { q: "What is 45 ÷ 9?", correct: "5", options: ["3", "4", "5", "6"], language: { tamil: "45 ÷ 9 என்றால் என்ன?" }, type: "multipleChoice" },
    { q: "LCM of 12 and 18", correct: "36", options: ["24", "36", "48", "12"], language: { tamil: "12 மற்றும் 18-இன் மீ.சி.ம" }, type: "multipleChoice" },
    { q: "HCF of 36 and 54", correct: "18", options: ["6", "9", "18", "27"], language: { tamil: "36 மற்றும் 54-இன் மீ.பொ.வ" }, type: "multipleChoice" },
    { q: "Solve: 15 + (8 × 2)", correct: "31", options: ["31", "23", "39", "20"], language: { tamil: "தீர்க்கவும்: 15 + (8 × 2)" }, type: "multipleChoice" },
    { q: "What is the value of 3²?", correct: "9", language: { tamil: "3²-இன் மதிப்பு என்ன?" }, type: "fillInTheBlank" },
    { q: "What is 7 × 8?", correct: "56", options: ["48", "56", "54", "64"], language: { tamil: "7 × 8 என்றால் என்ன?" }, type: "multipleChoice" }
  ],
 
  intermediate: [
    { q: "Find median of 5, 7, 9, 11, 13", correct: "9", options: ["7", "9", "11", "8"], language: { tamil: "5, 7, 9, 11, 13-இன் இடைநிலை என்ன?" }, type: "multipleChoice" },
    { q: "Solve: 2x + 3 = 11", correct: "4", options: ["2", "3", "4", "5"], language: { tamil: "தீர்க்கவும்: 2x + 3 = 11" }, type: "multipleChoice" },
    { q: "What is 20% of 150?", correct: "30", options: ["15", "30", "50", "100"], language: { tamil: "150-இன் 20% என்றால் என்ன?" }, type: "multipleChoice" },
    { q: "What is the next prime number after 13?", correct: "17", language: { tamil: "13-க்குப் பிறகு வரும் அடுத்த பகா எண் என்ன?" }, type: "fillInTheBlank" },
    { q: "What is the slope of the line y = 3x + 2?", correct: "3", options: ["2", "3", "5", "1"], language: { tamil: "y = 3x + 2 கோட்டின் சாய்வு என்ன?" }, type: "multipleChoice" },
    { q: "Solve: x² – 9 = 0", correct: "±3", language: { tamil: "தீர்க்கவும்: x² – 9 = 0" }, type: "fillInTheBlank" }
  ],
  
  advanced: [
    { q: "Derivative of x²", correct: "2x", options: ["2x", "x²", "2", "x"], language: { tamil: "x²-இன் வகைக்கெழு" }, type: "multipleChoice" },
    { q: "∫ x dx (definite integral from 0 to 1)", correct: "0.5", options: ["0.25", "0.5", "1", "2"], language: { tamil: "∫ x dx (0 முதல் 1 வரை வரையறுக்கப்பட்ட தொகையீடு)" }, type: "multipleChoice" },
    { q: "sin²θ + cos²θ = ?", correct: "1", options: ["0", "1", "2", "θ"], language: { tamil: "sin²θ + cos²θ = ?" }, type: "multipleChoice" },
    { q: "What is the derivative of sin(x)?", correct: "cos(x)", options: ["cos(x)", "-cos(x)", "sin(x)", "-sin(x)"], language: { tamil: "sin(x)-இன் வகைக்கெழு என்ன?" }, type: "multipleChoice" },
    { q: "Solve: log₂(8)", correct: "3", language: { tamil: "தீர்க்கவும்: log₂(8)" }, type: "fillInTheBlank" },
    { q: "Differentiate: d/dx (ln x)", correct: "1/x", options: ["ln x", "1/x", "x", "e^x"], language: { tamil: "d/dx (ln x)" }, type: "multipleChoice" }
  ]
};

// Optimized shuffle function - memoized to prevent repeated array creation
const shuffleArray = (array) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Memoized lightweight feedback component to prevent unnecessary re-renders
const QuizFeedback = memo(({ message, type, correctAnswer, language, onNext }) => {
  const isCorrect = type === 'correct';
  
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '1rem',
    zIndex: 50
  };

  const modalStyle = {
    padding: '1.5rem',
    borderRadius: '0.5rem',
    maxWidth: '24rem',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    backgroundColor: isCorrect ? '#10b981' : '#ef4444'
  };

  const buttonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: '0.5rem 1rem',
    borderRadius: '0.25rem',
    fontWeight: '600',
    border: 'none',
    color: 'white',
    cursor: 'pointer',
    transition: 'background-color 0.3s'
  };

  return (
    <div style={overlayStyle}>
      <div style={modalStyle}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>
          {isCorrect ? '✅' : '❌'}
        </div>
        <p style={{ fontWeight: 'bold', fontSize: '1.125rem', marginBottom: '1rem' }}>{message}</p>
        {correctAnswer && (
          <p style={{ 
            fontSize: '0.875rem', 
            marginBottom: '1rem', 
            backgroundColor: 'rgba(255, 255, 255, 0.2)', 
            padding: '0.5rem', 
            borderRadius: '0.25rem' 
          }}>
            {language === 'english' ? `Correct Answer: ${correctAnswer}` : `சரியான விடை: ${correctAnswer}`}
          </p>
        )}
        <button 
          onClick={onNext}
          style={buttonStyle}
          onMouseOver={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)'}
          onMouseOut={(e) => e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)'}
        >
          {language === 'english' ? 'Next Question' : 'அடுத்த கேள்வி'}
        </button>
      </div>
    </div>
  );
});

// Main App Component - Memoized for performance
const MathQuiz = memo(() => {
  const [currentScreen, setCurrentScreen] = useState("home");
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [language, setLanguage] = useState("english");
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [isTestActive, setIsTestActive] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const [selectedSequence, setSelectedSequence] = useState([]);
  const [inputAnswer, setInputAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);

  // Memoized translations to prevent object recreation on every render
  const t = useMemo(() => translations[language], [language]);
  
  // Memoized current question to prevent unnecessary lookups
  const currentQuestion = useMemo(() => 
    shuffledQuestions[currentQuestionIndex] || null, 
    [shuffledQuestions, currentQuestionIndex]
  );

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    width: '100%',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  };

  const cardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    borderRadius: '0.75rem',
    padding: '2rem',
    maxWidth: '28rem',
    width: '100%',
    textAlign: 'center'
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '0.5rem',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white'
  };

  const levelButtonStyle = {
    ...buttonStyle,
    width: '100%',
    padding: '1rem',
    fontSize: '1.125rem',
    marginBottom: '0.75rem'
  };

  // Next question handler
  const handleNextQuestion = useCallback(() => {
    setFeedback(null);
    setAnswerSubmitted(false);
    setSelectedAnswer(null);
    setInputAnswer("");
    setSelectedSequence([]);
    
    if (currentQuestionIndex < shuffledQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30);
    } else {
      setIsTestActive(false);
      setCurrentScreen("results");
    }
  }, [currentQuestionIndex, shuffledQuestions.length]);

  // Timer effect
  useEffect(() => {
    if (!isTestActive || timeLeft <= 0) {
      if (timeLeft <= 0 && isTestActive && !answerSubmitted) {
        setFeedback({ 
          message: t.timeUp, 
          type: 'incorrect',
          correctAnswer: shuffledQuestions[currentQuestionIndex]?.correct
        });
      }
      return;
    }
    const timer = setTimeout(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, isTestActive, answerSubmitted, t.timeUp, shuffledQuestions, currentQuestionIndex]);

  // Start test function
  const startTest = (level) => {
    setSelectedLevel(level);
    setCurrentScreen("test");
    const levelQuestions = questionBank[level];
    const questionsToUse = Math.min(6, levelQuestions.length);
    setShuffledQuestions(shuffleArray(levelQuestions).slice(0, questionsToUse));
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setIsTestActive(true);
    setFeedback(null);
    setAnswerSubmitted(false);
  };

  // Answer checking
  const handleCheckAnswer = () => {
    if (answerSubmitted) return;
    
    const currentQ = shuffledQuestions[currentQuestionIndex];
    let isCorrect = false;
    let userAnswer = "";

    if (currentQ.type === 'multipleChoice') {
      if (!selectedAnswer) return;
      userAnswer = selectedAnswer;
      isCorrect = selectedAnswer.toString().toLowerCase() === currentQ.correct.toString().toLowerCase();
    } else if (currentQ.type === 'fillInTheBlank') {
      if (!inputAnswer.trim()) return;
      userAnswer = inputAnswer.trim();
      isCorrect = inputAnswer.trim().toLowerCase() === currentQ.correct.toString().toLowerCase();
    }

    setAnswerSubmitted(true);

    if (isCorrect) {
      setScore(prev => prev + 1);
      setFeedback({ message: t.correct, type: 'correct' });
    } else {
      setFeedback({ 
        message: language === 'english' ? "Try again! Practice makes perfect!" : "மீண்டும் முயற்சி செய்யுங்கள்! பயிற்சியே வெற்றிக்கு வழி!", 
        type: 'incorrect', 
        correctAnswer: currentQ.correct 
      });
    }
  };

  // Home Screen
  if (currentScreen === "home") {
    return (
      <div style={{
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '1rem'
      }}>
        <div style={cardStyle}>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: 'white', marginBottom: '1rem' }}>
            {t.title}
          </h1>
          
          <p style={{ color: 'white', opacity: 0.9, marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {language === 'english' 
              ? "Challenge yourself with interactive math problems!"
              : "ஊடாடும் கணிதச் சிக்கல்களுடன் உங்களை சவால் செய்யுங்கள்!"
            }
          </p>
          
          <button 
            onClick={() => setLanguage(language === "english" ? "tamil" : "english")}
            style={{
              ...primaryButtonStyle,
              marginBottom: '1.5rem',
              borderRadius: '9999px',
              padding: '0.5rem 1.5rem'
            }}
          >
            🌐 {t.languageButton}
          </button>
          
          <div>
            {[
              { level: "beginner", color: '#10b981', emoji: '🟢' },
              { level: "intermediate", color: '#f59e0b', emoji: '🟡' },
              { level: "advanced", color: '#ef4444', emoji: '🔴' }
            ].map(({ level, color, emoji }) => (
              <button 
                key={level}
                onClick={() => startTest(level)} 
                style={{
                  ...levelButtonStyle,
                  backgroundColor: color,
                  color: 'white'
                }}
                onMouseOver={(e) => e.target.style.opacity = '0.9'}
                onMouseOut={(e) => e.target.style.opacity = '1'}
              >
                {emoji} {t[level]}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Test Screen
  if (currentScreen === "test" && shuffledQuestions.length > 0) {
    const q = shuffledQuestions[currentQuestionIndex];
    const questionText = (language === "tamil" && q.language?.tamil) ? q.language.tamil : q.q;
    const backgrounds = {
      beginner: 'linear-gradient(135deg, #10b981 0%, #3b82f6 100%)',
      intermediate: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
      advanced: 'linear-gradient(135deg, #ef4444 0%, #8b5cf6 100%)'
    };

    const headerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '1rem',
      padding: '0 1rem'
    };

    const timerStyle = {
      padding: '0.5rem 1rem',
      borderRadius: '9999px',
      fontWeight: 'bold',
      color: 'white',
      backgroundColor: timeLeft <= 10 ? '#ef4444' : 'rgba(255, 255, 255, 0.2)',
      animation: timeLeft <= 10 ? 'pulse 1s infinite' : 'none'
    };

    return (
      <div style={{ 
        ...containerStyle, 
        background: backgrounds[selectedLevel], 
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <style>
          {`
            @keyframes pulse {
              0%, 100% { opacity: 1; }
              50% { opacity: 0.5; }
            }
          `}
        </style>
        
        {/* Header */}
        <div style={headerStyle}>
          <div style={{ color: 'white', fontWeight: 'bold' }}>
            {t.question} {currentQuestionIndex + 1}/{shuffledQuestions.length}
          </div>
          
          <div style={timerStyle}>
            ⏰ {timeLeft}s
          </div>
          
          <button 
            onClick={() => setCurrentScreen("home")}
            style={{
              ...primaryButtonStyle,
              borderRadius: '9999px',
              padding: '0.5rem'
            }}
          >
             Back to level
          </button>
        </div>

        {/* Question Card */}
        <div style={{ 
          flex: 1, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}>
          <div style={{
            ...cardStyle,
            maxWidth: '32rem'
          }}>
            <h2 style={{ 
              fontSize: '1.25rem', 
              fontWeight: '600', 
              color: 'white', 
              marginBottom: '1.5rem' 
            }}>
              {questionText}
            </h2>
            
            {q.type === 'multipleChoice' && (
              <div style={{ marginBottom: '1.5rem' }}>
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedAnswer(opt)}
                    disabled={answerSubmitted}
                    style={{
                      width: '100%',
                      padding: '0.75rem',
                      borderRadius: '0.5rem',
                      fontWeight: '600',
                      border: 'none',
                      marginBottom: '0.75rem',
                      cursor: answerSubmitted ? 'not-allowed' : 'pointer',
                      opacity: answerSubmitted ? 0.6 : 1,
                      backgroundColor: selectedAnswer === opt ? 'white' : 'rgba(255, 255, 255, 0.2)',
                      color: selectedAnswer === opt ? '#1f2937' : 'white',
                      transition: 'all 0.3s'
                    }}
                    onMouseOver={(e) => {
                      if (!answerSubmitted && selectedAnswer !== opt) {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                      }
                    }}
                    onMouseOut={(e) => {
                      if (selectedAnswer !== opt) {
                        e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                      }
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}

            {q.type === 'fillInTheBlank' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <input
                  type="text"
                  value={inputAnswer}
                  onChange={(e) => setInputAnswer(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleCheckAnswer()}
                  disabled={answerSubmitted}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    textAlign: 'center',
                    fontWeight: '600',
                    border: '2px solid rgba(255, 255, 255, 0.3)',
                    outline: 'none',
                    fontSize: '1rem'
                  }}
                  placeholder={t.answerPrompt}
                />
              </div>
            )}
            
            <button 
              onClick={handleCheckAnswer}
              disabled={answerSubmitted || (!selectedAnswer && !inputAnswer.trim())}
              style={{
                ...buttonStyle,
                width: '100%',
                backgroundColor: 'rgba(255, 255, 255, 0.3)',
                color: 'white',
                opacity: (answerSubmitted || (!selectedAnswer && !inputAnswer.trim())) ? 0.5 : 1,
                cursor: (answerSubmitted || (!selectedAnswer && !inputAnswer.trim())) ? 'not-allowed' : 'pointer'
              }}
              onMouseOver={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
                }
              }}
            >
              ✓ {t.checkAnswer}
            </button>
          </div>
        </div>
        
        {feedback && (
          <QuizFeedback 
            message={feedback.message} 
            type={feedback.type} 
            correctAnswer={feedback.correctAnswer} 
            language={language}
            onNext={handleNextQuestion}
          />
        )}
      </div>
    );
  }

  // Results Screen
  if (currentScreen === "results") {
    const totalQuestions = shuffledQuestions.length;
    const percentage = Math.round((score / totalQuestions) * 100);
    const isHighScore = score >= totalQuestions * 0.8;
    const isMediumScore = score >= totalQuestions * 0.6;

    return (
      <div style={{
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4c1d95 0%, #7c2d12 50%, #be185d 100%)',
        padding: '1rem'
      }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '3.75rem', marginBottom: '1rem' }}>
            {isHighScore ? '🏆' : isMediumScore ? '🎖' : '📚'}
          </div>
          
          <h1 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            color: 'white', 
            marginBottom: '1rem' 
          }}>
            {isHighScore ? t.starPerformerTitle : isMediumScore ? t.achieverTitle : t.needsPracticeTitle}
          </h1>
          
          <div style={{
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '0.5rem',
            padding: '1.5rem',
            marginBottom: '1.5rem'
          }}>
            <div style={{ 
              fontSize: '2.25rem', 
              fontWeight: 'bold', 
              color: 'white', 
              marginBottom: '0.5rem' 
            }}>
              {score}/{totalQuestions}
            </div>
            <div style={{ 
              fontSize: '1.5rem', 
              color: 'white', 
              marginBottom: '1rem' 
            }}>
              {percentage}%
            </div>
            <div style={{
              width: '100%',
              height: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '9999px',
              overflow: 'hidden'
            }}>
              <div 
                style={{
                  height: '100%',
                  background: 'linear-gradient(to right, #10b981, #3b82f6)',
                  borderRadius: '9999px',
                  transition: 'width 1s ease',
                  width: `${percentage}%`
                }}
              />
            </div>
          </div>
          
          <div>
            <button 
              onClick={() => startTest(selectedLevel)}
              style={{
                ...levelButtonStyle,
                backgroundColor: '#3b82f6',
                color: 'white'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
              🔄 {t.retry}
            </button>
            <button 
              onClick={() => setCurrentScreen("home")}
              style={{
                ...levelButtonStyle,
                backgroundColor: '#10b981',
                color: 'white',
                marginBottom: 0
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
              🏠 {t.home}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <div style={containerStyle} />;
});

export default MathQuiz;