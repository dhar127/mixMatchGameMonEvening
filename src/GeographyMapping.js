import React, { useState, useRef, useEffect, useMemo, useCallback, memo } from 'react';
import './GeographyGame.css';
import LazyImage from './LazyImage';
import TamilNaduMap from './assets/TamilNaduMap.png';
import IndiaMap from './assets/IndiaMap.png';
import IndianRiverMap from './assets/IndianRiverMap.png';
import WorldMap from './assets/WorldMap.png';
import { useUser } from './UserContext';
import ScrollableContainer from './Scroll';

// Updated coordinates based on the map screenshots
const tamilNaduPoints = [
  { name: "Chennai", tamil: "சென்னை", top: "11%", left: "70%" },
  { name: "Coimbatore", tamil: "கோயம்புத்தூர்", top: "52%", left: "36%" },
  { name: "Madurai", tamil: "மதுரை", top: "64%", left: "47%" },
  { name: "Salem", tamil: "சேலம்", top: "35%", left: "47%" },
  { name: "Trichy", tamil: "திருச்சி", top: "46%", left: "53%" },
  { name: "Vellore", tamil: "வேலூர்", top: "14%", left: "57%" },
  { name: "Tanjore", tamil: "தஞ்சாவூர்", top: "52%", left: "60.5%" },
  { name: "Kanyakumari", tamil: "கன்னியாகுமரி", top: "95%", left: "41%" }
];

const indiaPoints = [
  { name: "New Delhi", tamil: "புது டெல்லி", top: "32%", left: "42.5%" },
  { name: "Maharashtra", tamil: "மஹாராஷ்ட்ரா", top: "61%", left: "36%" },
  { name: "TamilNadu", tamil: "தமிழ்நாடு", top: "83%", left: "44%" },
  { name: "WestBengal", tamil: "மேற்கு வங்காளம்", top: "48%", left: "60%" },
  { name: "Karnataka", tamil: "கர்நாடகா", top: "72%", left: "39%" },
  { name: "Telgana", tamil: "தெலங்கானா", top: "65%", left: "45%" },
  { name: "Rajastan", tamil: "ராஜஸ்தான்", top: "39%", left: "37%" },
  { name: "Goa", tamil: "கோவா", top: "70%", left: "36%" }
];

const riverPoints = [
  { name: "Ganga", tamil: "கங்கை", top: "36%", left: "48.5%" },
  { name: "Yamuna", tamil: "யமுனை", top: "40%", left: "48.5%" },
  { name: "Brahmaputra", tamil: "பிரம்மபுத்திரா", top: "33%", left: "55%" },
  { name: "Narmada", tamil: "நர்மதா", top: "47.5%", left: "45%" },
  { name: "Godavari", tamil: "கோதாவரி", top: "53%", left: "47%" },
  { name: "Krishna", tamil: "கிருஷ்ணா", top: "58%", left: "47%" },
  { name: "Kaveri", tamil: "காவேரி", top: "68%", left: "45%" }
];

const worldPoints = [
  { name: "India", tamil: "இந்தியா", top: "55%", left: "68%" },
  { name: "USA", tamil: "அமெரிக்கா", top: "40%", left: "20%" },
  { name: "Australia", tamil: "ஆஸ்திரேலியா", top: "77%", left: "82%" },
  { name: "China", tamil: "சீனா", top: "44%", left: "73%" },
  { name: "Brazil", tamil: "பிரேசில்", top: "70%", left: "30%" },
  { name: "South Africa", tamil: "தென்னாப்பிரிக்கா", top: "78%", left: "52%" },
  { name: "Egypt", tamil: "எகிப்து", top: "48%", left: "48%" }
];

const GeographyGame = memo(() => {
  const { user, saveScore } = useUser();
  const [currentMap, setCurrentMap] = useState('india');
  const [language, setLanguage] = useState('english');
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(40);
  const [placedMarkers, setPlacedMarkers] = useState([]);
  const [gameResults, setGameResults] = useState([]);
  const [notification, setNotification] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [feedback, setFeedback] = useState({
    difficulty: '',
    enjoyment: '',
    comments: '',
    rating: 0
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);

  // Use refs for performance optimization
  const timerRef = useRef(null);
  const notificationRef = useRef(null);
  const mapElementRef = useRef(null);

  // Memoize heavy objects to prevent recreation on each render
  const mapConfigs = useMemo(() => ({
    tamilnadu: {
      name: { english: "Tamil Nadu Map", tamil: "தமிழ்நாடு வரைபடம்" },
      points: tamilNaduPoints,
        bgImage: `url(${TamilNaduMap})`,
      bgColor: "#ff9a9e"
    },
    india: {
      name: { english: "India Map", tamil: "இந்தியா வரைபடம்" },
      points: indiaPoints,
        bgImage: `url(${IndiaMap})`,
      bgColor: "#a8edea"
    },
    rivers: {
      name: { english: "Indian Rivers Map", tamil: "இந்திய நதிகள் வரைபடம்" },
      points: riverPoints,
        bgImage: `url(${IndianRiverMap})`,
      bgColor: "#d299c2"
    },
    world: {
      name: { english: "World Map", tamil: "உலக வரைபடம்" },
      points: worldPoints,
        bgImage: `url(${WorldMap})`,
      bgColor: "#89f7fe"
    }
  }), []);

  const texts = useMemo(() => ({
    english: {
      title: "Geography Explorer",
      subtitle: "Click and Learn!",
      selectMap: "Choose a Map",
      startGame: "Start Game",
      score: "Score",
      timeLeft: "Time Left",
      dragToMap: "Click on the correct location on the map",
      correct: "Correct! Well done!",
      incorrect: "Wrong answer!",
      gameOver: "Game Complete!",
      finalScore: "Final Score",
      playAgain: "Play Again",
      backToMenu: "Back to Menu",
      backToLevels: "Back to Levels",
      language: "தமிழ்",
      seconds: "seconds",
      question: "Question",
      participationReport: "Participation Report",
      viewReport: "View Report",
      feedback: "Feedback",
      giveFeedback: "Give Feedback",
      difficulty: "How difficult was this level?",
      enjoyment: "How much did you enjoy this activity?",
      additionalComments: "Additional Comments",
      rating: "Overall Rating",
      submitFeedback: "Submit Feedback",
      easy: "Easy",
      medium: "Medium",
      hard: "Hard",
      veryEasy: "Very Easy",
      veryHard: "Very Hard",
      loved: "Loved it!",
      liked: "Liked it",
      okay: "It was okay",
      disliked: "Didn't like it",
      hated: "Hated it",
      correctAnswers: "Correct Answers",
      totalTime: "Total Time",
      avgTimePerQuestion: "Avg Time per Question",
      accuracy: "Accuracy",
      performance: "Performance",
      excellent: "Excellent!",
      good: "Good job!",
      needsImprovement: "Needs improvement",
      thankYou: "Thank you for your feedback!"
    },
    tamil: {
      title: "புவியியல் ஆய்வாளர்",
      subtitle: "கிளிக் செய்து கற்றுக்கொள்ளுங்கள்!",
      selectMap: "வரைபடம் தேர்ந்தெடுக்கவும்",
      startGame: "விளையாட்டைத் தொடங்கு",
      score: "மதிப்பெண்",
      timeLeft: "மீதமுள்ள நேரம்",
      dragToMap: "வரைபடத்தில் சரியான இடத்தில் கிளிக் செய்யவும்",
      correct: "சரியானது! நன்று!",
      incorrect: "மீண்டும் முயற்சிக்கவும்! குறிப்பைப் பாருங்கள்.",
      gameOver: "விளையாட்டு முடிந்தது!",
      finalScore: "இறுதி மதிப்பெண்",
      playAgain: "மீண்டும் விளையாடு",
      backToMenu: "பிரதான மெனு",
      backToLevels: "நிலைகளுக்கு திரும்பு",
      language: "English",
      seconds: "விநாடிகள்",
      question: "கேள்வி",
      participationReport: "பங்கேற்பு அறிக்கை",
      viewReport: "அறிக்கையைப் பார்க்கவும்",
      feedback: "கருத்துக்கள்",
      giveFeedback: "கருத்துக்களைத் தரவும்",
      difficulty: "இந்த நிலை எவ்வளவு கடினமாக இருந்தது?",
      enjoyment: "இந்த செயல்பாட்டை நீங்கள் எவ்வளவு ரசித்தீர்கள்?",
      additionalComments: "கூடுதல் கருத்துக்கள்",
      rating: "ஒட்டுமொத்த மதிப்பீடு",
      submitFeedback: "கருத்துக்களைச் சமர்ப்பிக்கவும்",
      easy: "எளிது",
      medium: "நடுத்தரம்",
      hard: "கடினம்",
      veryEasy: "மிக எளிது",
      veryHard: "மிகக் கடினம்",
      loved: "மிகவும் பிடித்தது!",
      liked: "பிடித்தது",
      okay: "சரியானது",
      disliked: "பிடிக்கவில்லை",
      hated: "மிகவும் பிடிக்கவில்லை",
      correctAnswers: "சரியான பதில்கள்",
      totalTime: "மொத்த நேரம்",
      avgTimePerQuestion: "ஒரு கேள்விக்கு சராசரி நேரம்",
      accuracy: "துல்லியம்",
      performance: "செயல்திறன்",
      excellent: "சிறப்பானது!",
      good: "நல்லது!",
      needsImprovement: "முன்னேற்றம் தேவை",
      thankYou: "உங்கள் கருத்துக்களுக்கு நன்றி!"
    }
  }), []);

  // Optimized notification system
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    
    if (notificationRef.current) {
      clearTimeout(notificationRef.current);
    }
    
    notificationRef.current = setTimeout(() => {
      setNotification(null);
    }, 2500); // Reduced timeout for better performance
  }, []);

  // Simplified start game function
  const startGame = useCallback((mapKey) => {
    setCurrentMap(mapKey);
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(40);
    setPlacedMarkers([]);
    setGameResults([]);
    startTimer();
  }, []);

  // Timer functions
  const startTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          timeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const timeUp = useCallback(() => {
    stopTimer();
    const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];
    
    // Record the result as incorrect
    setGameResults(prev => [...prev, {
      question: currentPoint[language] || currentPoint.name,
      correct: false,
      timeTaken: 40
    }]);

    showNotification(texts[language].incorrect, 'error');
    
    setTimeout(() => {
      nextQuestion();
    }, 1000); // Reduced timeout
  }, [currentMap, currentQuestionIndex, language, mapConfigs, texts, stopTimer, showNotification]);

  // Optimized check answer function
  const checkAnswer = useCallback((clickX, clickY) => {
    const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];
    
    // Get map element using ref for better performance
    const mapElement = mapElementRef.current;
    if (!mapElement) return;
    
    const rect = mapElement.getBoundingClientRect();
    const targetX = (parseFloat(currentPoint.left) / 100) * rect.width;
    const targetY = (parseFloat(currentPoint.top) / 100) * rect.height;
    
    // Calculate distance with tolerance
    const distance = Math.sqrt(
      Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2)
    );
    
    // Responsive tolerance based on screen size
    const baseSize = Math.min(rect.width, rect.height);
    const tolerance = Math.max(baseSize * 0.08, 30); // Minimum 30px tolerance for touch devices
    const isCorrect = distance <= tolerance;
    const timeTaken = 40 - timeLeft;
     
    if (isCorrect) {
      setScore(s => s + 10);
      showNotification(texts[language].correct, 'success');
      
      // Add marker at clicked position
      setPlacedMarkers(prev => [...prev, {
        name: currentPoint.name,
        x: (clickX / rect.width) * 100,
        y: (clickY / rect.height) * 100,
        correct: true
      }]);
    } else {
      showNotification(texts[language].incorrect, 'error');
    }
    
    // Record the result
    setGameResults(prev => [...prev, {
      question: currentPoint[language] || currentPoint.name,
      correct: isCorrect,
      timeTaken: timeTaken
    }]);

    stopTimer();
    
    setTimeout(() => {
      nextQuestion();
    }, 1000); // Reduced timeout
  }, [currentMap, currentQuestionIndex, timeLeft, mapConfigs, language, texts, showNotification, stopTimer]);

  // Next question function
  const nextQuestion = useCallback(() => {
    const totalQuestions = mapConfigs[currentMap].points.length;
    
    if (currentQuestionIndex + 1 >= totalQuestions) {
      endGame();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(40);
      startTimer();
    }
  }, [currentMap, currentQuestionIndex, mapConfigs, startTimer]);

  // End game function
  const endGame = useCallback(() => {
    stopTimer();
    setGameState('completed');
    
    // Save score
    if (user && saveScore && score > 0) {
      console.log('Saving score:', { gameId: 'geographyMapping', score, userName: user.name });
      saveScore('geographyMapping', score, user.name);
    }
  }, [user, saveScore, score, stopTimer]);

  // Reset game function
  const resetGame = useCallback(() => {
    stopTimer();
    setGameState('menu');
    setCurrentMap('india');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(40);
    setPlacedMarkers([]);
    setGameResults([]);
    setShowReport(false);
    setShowFeedbackForm(false);
    setNotification(null);
  }, [stopTimer]);

  // Back to levels function
  const backToLevels = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Optimized map click handler with touch support
  const handleMapClick = useCallback((e) => {
    if (gameState !== 'playing') return;
    
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    
    // Handle both mouse and touch events
    const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY || (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    
    checkAnswer(clickX, clickY);
  }, [gameState, checkAnswer]);

  // Handle touch events
  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (gameState === 'playing') {
      handleMapClick(e);
    }
  }, [gameState, handleMapClick]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (notificationRef.current) {
        clearTimeout(notificationRef.current);
      }
    };
  }, [stopTimer]);

  // Responsive styles
  const getResponsiveStyles = () => {
    const isSmallScreen = window.innerWidth < 768;
    const isViewboard = window.innerWidth > 1200;
    
    return {
      container: {
        minHeight: '100vh',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        overflow: 'hidden'
      },
      gameWrapper: {
        display: 'flex',
        flexDirection: isSmallScreen ? 'column' : 'row',
        height: '100vh',
        width: '100vw'
      },
      sidebar: {
        width: isSmallScreen ? '100%' : isViewboard ? '350px' : '300px',
        minWidth: isSmallScreen ? 'auto' : '280px',
        height: isSmallScreen ? 'auto' : '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: isSmallScreen ? '15px' : '20px',
        overflowY: 'auto',
        boxShadow: isSmallScreen ? 'none' : '2px 0 10px rgba(0,0,0,0.1)'
      },
      mapArea: {
        flex: 1,
        height: isSmallScreen ? '70vh' : '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      },
      mapDisplay: {
        width: isSmallScreen ? '95%' : '90%',
        height: isSmallScreen ? '95%' : '85%',
        maxWidth: '1200px',
        maxHeight: '800px',
        borderRadius: isViewboard ? '15px' : '10px',
        border: '2px solid rgba(255,255,255,0.3)',
        boxShadow: '0 5px 20px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        touchAction: 'manipulation'
      }
    };
  };

  const styles = getResponsiveStyles();

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <ScrollableContainer>
        <div style={styles.container}>
          <div style={{
            padding: '20px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h1 style={{
              fontSize: 'clamp(2rem, 5vw, 4rem)',
              color: 'white',
              marginBottom: '1rem',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
            }}>
              {texts[language].title}
            </h1>
            <p style={{
              fontSize: 'clamp(1rem, 3vw, 1.5rem)',
              color: 'rgba(255,255,255,0.9)',
              marginBottom: '2rem'
            }}>
              {texts[language].subtitle}
            </p>
            
            {/* Language toggle */}
            <div style={{ marginBottom: '2rem' }}>
              <button
                onClick={() => setLanguage(language === 'english' ? 'tamil' : 'english')}
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  color: '#2d3748',
                  border: 'none',
                  padding: '12px 24px',
                  borderRadius: '25px',
                  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
              >
                {texts[language].language}
              </button>
            </div>
            
            {/* Welcome message */}
            {user && (
              <div style={{ marginBottom: '2rem' }}>
                <p style={{
                  fontSize: 'clamp(1rem, 3vw, 1.3rem)',
                  fontWeight: 'bold',
                  color: 'white',
                  background: 'rgba(255,255,255,0.2)',
                  padding: '15px 25px',
                  borderRadius: '25px',
                  display: 'inline-block'
                }}>
                  Welcome, {user.name}!
                </p>
              </div>
            )}
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              maxWidth: '1000px',
              margin: '0 auto'
            }}>
              {Object.entries(mapConfigs).map(([key, config]) => (
                <div
                  key={key}
                  onClick={() => startGame(key)}
                  style={{
                    background: 'rgba(255,255,255,0.9)',
                    borderRadius: '15px',
                    padding: '25px',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 5px 15px rgba(0,0,0,0.1)';
                  }}
                >
                  <h3 style={{
                    fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                    color: '#2d3748',
                    marginBottom: '15px'
                  }}>
                    {config.name[language]}
                  </h3>
                  <div style={{
                    fontSize: '3rem',
                    marginBottom: '15px'
                  }}>
                    🗺
                  </div>
                  <div style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 20px',
                    borderRadius: '20px',
                    fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                    fontWeight: 'bold',
                    width: '100%'
                  }}>
                    {texts[language].startGame}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollableContainer>
    );
  }

  // Game Complete Screen
  if (gameState === 'completed') {
    const correctAnswers = gameResults.filter(r => r.correct).length;
    const totalQuestions = gameResults.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const totalTime = gameResults.reduce((sum, result) => sum + result.timeTaken, 0);
    const avgTime = Math.round(totalTime / totalQuestions);

    let performanceLevel = '';
    if (percentage >= 80) {
      performanceLevel = texts[language].excellent;
    } else if (percentage >= 60) {
      performanceLevel = texts[language].good;
    } else {
      performanceLevel = texts[language].needsImprovement;
    }

    // Student Report Component
    const StudentReport = () => (
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '15px',
        padding: '20px',
        margin: '15px 0',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        maxHeight: '70vh',
        overflowY: 'auto'
      }}>
        <h2 style={{
          fontSize: 'clamp(1.3rem, 4vw, 1.8rem)',
          color: '#2d3748',
          marginBottom: '20px',
          textAlign: 'center',
          borderBottom: '2px solid #4facfe',
          paddingBottom: '10px'
        }}>
          📊 {texts[language].participationReport}
        </h2><div style={{ 
          marginBottom: '20px', 
          textAlign: 'center',
          fontSize: 'clamp(1rem, 3vw, 1.2rem)'
        }}>
          <strong style={{ color: '#4facfe' }}>
            Student: {user?.name || 'Unknown'}
          </strong>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: '#4CAF50',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: '0.9' }}>
              {texts[language].correctAnswers}
            </div>
            <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold' }}>
              {correctAnswers}/{totalQuestions}
            </div>
          </div>
          
          <div style={{
            background: '#2196F3',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: '0.9' }}>
              {texts[language].accuracy}
            </div>
            <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold' }}>
              {percentage}%
            </div>
          </div>
          
          <div style={{
            background: '#FF9800',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: '0.9' }}>
              {texts[language].totalTime}
            </div>
            <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold' }}>
              {totalTime}s
            </div>
          </div>
          
          <div style={{
            background: '#9C27B0',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: '0.9' }}>
              {texts[language].avgTimePerQuestion}
            </div>
            <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', fontWeight: 'bold' }}>
              {avgTime}s
            </div>
          </div>
        </div>

        <div style={{
          background: percentage >= 80 ? '#4CAF50' : percentage >= 60 ? '#FF9800' : '#f44336',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: 'clamp(1.2rem, 4vw, 1.3rem)', fontWeight: 'bold' }}>
            {texts[language].performance}: {performanceLevel}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ 
            color: '#2d3748', 
            marginBottom: '15px',
            fontSize: 'clamp(1rem, 3vw, 1.2rem)'
          }}>
            Question Details:
          </h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {gameResults.map((result, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                margin: '5px 0',
                borderRadius: '8px',
                background: result.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                border: result.correct ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(244, 67, 54, 0.3)',
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)'
              }}>
                <span style={{ fontWeight: 'bold' }}>
                  {result.correct ? '✅' : '❌'} {result.question}
                </span>
                <span style={{ fontSize: 'clamp(0.8rem, 2vw, 0.9rem)', opacity: '0.8' }}>
                  {result.timeTaken}s
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setShowReport(false)}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            border: 'none',
            padding: '12px 25px',
            borderRadius: '20px',
            fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
            fontWeight: 'bold',
            cursor: 'pointer',
            width: '100%',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        >
          Close Report
        </button>
      </div>
    );

    return (
      <ScrollableContainer>
        <div style={styles.container}>
          <div style={{
            padding: '20px',
            textAlign: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            {!showReport && !showFeedbackForm && (
              <>
                <div style={{ 
                  fontSize: 'clamp(3rem, 8vw, 5rem)', 
                  marginBottom: '1rem' 
                }}>
                  🎉
                </div>
                <h1 style={{
                  fontSize: 'clamp(2rem, 6vw, 3rem)',
                  color: 'white',
                  marginBottom: '1rem'
                }}>
                  {texts[language].gameOver}
                </h1>
                <div style={{
                  fontSize: 'clamp(1.5rem, 5vw, 2.5rem)',
                  color: '#FFD700',
                  fontWeight: 'bold',
                  marginBottom: '1rem'
                }}>
                  {texts[language].finalScore}: {score}
                </div>
                <div style={{
                  fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                  color: 'rgba(255,255,255,0.9)',
                  marginBottom: '2rem'
                }}>
                  {correctAnswers}/{totalQuestions} ({percentage}%)
                </div>
                
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  alignItems: 'center',
                  marginBottom: '2rem'
                }}>
                  <button
                    onClick={() => setShowReport(true)}
                    style={{
                      background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '15px 30px',
                      borderRadius: '25px',
                      fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      minWidth: '200px'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    📊 {texts[language].viewReport}
                  </button>
                </div>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px',
                  alignItems: 'center'
                }}>
                  <button
                    onClick={() => startGame(currentMap)}
                    style={{
                      background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '15px 30px',
                      borderRadius: '25px',
                      fontSize: 'clamp(1rem, 3vw, 1.2rem)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      minWidth: '200px',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {texts[language].playAgain}
                  </button>
                  <button
                    onClick={backToLevels}
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '12px 25px',
                      borderRadius: '20px',
                      fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      minWidth: '180px',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {texts[language].backToLevels}
                  </button>
                  <button
                    onClick={resetGame}
                    style={{
                      background: 'linear-gradient(135deg, #fd79a8 0%, #fdcbf1 100%)',
                      color: 'white',
                      border: 'none',
                      padding: '10px 20px',
                      borderRadius: '15px',
                      fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      minWidth: '160px',
                      transition: 'transform 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {texts[language].backToMenu}
                  </button>
                </div>
              </>
            )}

            {showReport && <StudentReport />}
          </div>
        </div>
      </ScrollableContainer>
    );
  }

  // Playing Screen
  const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];

  return (
    <ScrollableContainer>
      <div style={styles.container}>
        {/* Notification Popup */}
        {notification && (
          <div style={{
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 1000,
            background: notification.type === 'success' ? '#4CAF50' :
                       notification.type === 'error' ? '#f44336' : '#2196F3',
            color: 'white',
            padding: '15px 25px',
            borderRadius: '25px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
            fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
            fontWeight: 'bold',
            maxWidth: '90%',
            textAlign: 'center',
            pointerEvents: 'none'
          }}>
            {notification.message}
          </div>
        )}

        <div style={styles.gameWrapper}>
          {/* Header for small screens */}
          {window.innerWidth < 768 && (
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              padding: '15px 20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              position: 'sticky',
              top: 0,
              zIndex: 100
            }}>
              <div>
                <h2 style={{
                  fontSize: 'clamp(1.2rem, 4vw, 1.5rem)',
                  color: '#2d3748',
                  margin: 0,
                  fontWeight: 'bold'
                }}>
                  {mapConfigs[currentMap].name[language]}
                </h2>
                <div style={{
                  fontSize: 'clamp(0.8rem, 2.5vw, 0.9rem)',
                  color: '#666',
                  marginTop: '2px'
                }}>
                  {texts[language].question} {currentQuestionIndex + 1}/{mapConfigs[currentMap].points.length}
                </div>
              </div>
              <button
                onClick={() => setLanguage(language === 'english' ? 'tamil' : 'english')}
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  color: '#2d3748',
                  border: '2px solid rgba(255,255,255,0.3)',
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                {texts[language].language}
              </button>
            </div>
          )}

          {/* Sidebar */}
          <div style={styles.sidebar}>
            {/* Header for larger screens */}
            {window.innerWidth >= 768 && (
              <div style={{
                textAlign: 'center',
                marginBottom: '20px',
                paddingBottom: '15px',
                borderBottom: '2px solid rgba(255,255,255,0.3)'
              }}>
                <h2 style={{
                  fontSize: 'clamp(1.2rem, 3vw, 1.5rem)',
                  color: 'white',
                  margin: 0,
                  fontWeight: 'bold',
                  marginBottom: '5px'
                }}>
                  {mapConfigs[currentMap].name[language]}
                </h2>
                <div style={{
                  fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                  color: 'rgba(255,255,255,0.8)'
                }}>
                  {texts[language].question} {currentQuestionIndex + 1}/{mapConfigs[currentMap].points.length}
                </div>
                <button
                  onClick={() => setLanguage(language === 'english' ? 'tamil' : 'english')}
                  style={{
                    background: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    border: '2px solid rgba(255,255,255,0.3)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  {texts[language].language}
                </button>
              </div>
            )}

            {/* Back Button */}
            <button
              onClick={backToLevels}
              style={{
                background: 'rgba(255,255,255,0.3)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 16px',
                borderRadius: '20px',
                fontSize: 'clamp(0.8rem, 2vw, 0.9rem)',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '15px',
                width: '100%'
              }}
            >
              ← {texts[language].backToLevels}
            </button>

            {/* Stats in horizontal layout for small screens */}
            <div style={{
              display: window.innerWidth < 768 ? 'flex' : 'block',
              gap: window.innerWidth < 768 ? '10px' : '15px',
              marginBottom: '15px'
            }}>
              {/* Score */}
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '15px',
                padding: '15px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                flex: window.innerWidth < 768 ? 1 : 'none'
              }}>
                <h3 style={{
                  fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                  color: 'rgba(255,255,255,0.8)',
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {texts[language].score}
                </h3>
                <div style={{
                  fontSize: window.innerWidth < 768 ? 'clamp(1.2rem, 4vw, 1.8rem)' : 'clamp(1.8rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  margin: 0,
                  color: '#FFD700'
                }}>
                  {score}
                </div>
              </div>

              {/* Timer */}
              <div style={{
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '15px',
                padding: '15px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255,255,255,0.3)',
                flex: window.innerWidth < 768 ? 1 : 'none'
              }}>
                <h3 style={{
                  fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                  color: 'rgba(255,255,255,0.8)',
                  margin: '0 0 8px 0',
                  textTransform: 'uppercase',
                  letterSpacing: '1px'
                }}>
                  {texts[language].timeLeft}
                </h3>
                <div style={{
                  fontSize: window.innerWidth < 768 ? 'clamp(1.2rem, 4vw, 1.8rem)' : 'clamp(1.8rem, 4vw, 2.5rem)',
                  fontWeight: 'bold',
                  margin: 0,
                  color: timeLeft <= 10 ? '#FF6B6B' : '#FF9800'
                }}>
                  {timeLeft}s
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '3px',
                  marginTop: '8px',
                  overflow: 'hidden'
                }}>
                  <div 
                    style={{
                      width: `${(timeLeft / 40) * 100}%`,
                      height: '100%',
                      background: timeLeft <= 10 ? '#FF6B6B' : '#FF9800',
                      transition: 'width 1s linear'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Current Question */}
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '15px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)',
              marginBottom: '15px'
            }}>
              <h3 style={{
                fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Find This Location
              </h3>
              
              <div style={{
                fontSize: 'clamp(1.2rem, 4vw, 1.8rem)',
                fontWeight: 'bold',
                color: 'white',
                marginBottom: '8px',
                padding: '12px',
                borderRadius: '10px',
                background: 'rgba(255,255,255,0.1)',
                border: '2px solid rgba(255,255,255,0.4)',
                userSelect: 'none'
              }}>
                🎯 {currentPoint[language] || currentPoint.name}
              </div>
              
              <div style={{
                fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                color: 'rgba(255,255,255,0.7)',
                fontStyle: 'italic',
                marginTop: '8px'
              }}>
                {texts[language].dragToMap}
              </div>
            </div>

            {/* Progress */}
            <div style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '15px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <h3 style={{
                fontSize: 'clamp(0.7rem, 2vw, 0.9rem)',
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>
                Progress
              </h3>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                overflow: 'hidden',
                marginBottom: '8px'
              }}>
                <div style={{
                  width: `${((currentQuestionIndex) / mapConfigs[currentMap].points.length) * 100}%`,
                  height: '100%',
                  background: '#4CAF50',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{
                fontSize: 'clamp(0.9rem, 2.5vw, 1rem)',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {currentQuestionIndex}/{mapConfigs[currentMap].points.length}
              </div>
            </div>
          </div>

          {/* Map Area */}
          <div style={{
            ...styles.mapArea,
            background: `linear-gradient(135deg, ${mapConfigs[currentMap].bgColor} 0%, rgba(255,255,255,0.1) 100%)`
          }}>
            <div 
              ref={mapElementRef}
              onClick={handleMapClick}
              onTouchStart={handleTouchStart}
              style={{
                ...styles.mapDisplay,
                backgroundImage: mapConfigs[currentMap].bgImage,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                position: 'relative'
              }}
            >
              {/* Placed Markers */}
              {placedMarkers.map((marker, index) => (
                <div
                  key={index}
                  style={{
                    position: 'absolute',
                    left: `${marker.x}%`,
                    top: `${marker.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: 'clamp(15px, 3vw, 25px)',
                    height: 'clamp(15px, 3vw, 25px)',
                    borderRadius: '50%',
                    background: marker.correct ? '#4CAF50' : '#f44336',
                    border: '3px solid white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 10,
                    pointerEvents: 'none'
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </ScrollableContainer>
  );
});

export default GeographyGame;