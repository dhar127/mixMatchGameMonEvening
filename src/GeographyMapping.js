import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './GeographyGame.css';
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

const GeographyGame = () => {
  const { user, saveScore } = useUser(); // Fixed: Get user context and saveScore function
  const [currentMap, setCurrentMap] = useState('india');
  const [language, setLanguage] = useState('english');
  const [gameState, setGameState] = useState('menu'); // menu, playing, completed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [placedMarkers, setPlacedMarkers] = useState([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameResults, setGameResults] = useState([]);
  const [notification, setNotification] = useState(null);
  
  // Fixed: Removed studentName - using user.name from context
  const [showReport, setShowReport] = useState(false);
  const [feedback, setFeedback] = useState({
    difficulty: '',
    enjoyment: '',
    comments: '',
    rating: 0
  });
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [dragVisual, setDragVisual] = useState(null); // NEW: State for drag visual

  // Fixed: Use refs for performance and drag handling
  const canvasRef = useRef(null);
  const timerRef = useRef(null);
  const animationRef = useRef(null);
  const notificationRef = useRef(null);
  const draggedItemRef = useRef(null); // Fixed: Use ref instead of state for drag

  // Fixed: Memoize heavy objects to prevent recreation on each render
  const mapConfigs = useMemo(() => ({
    tamilnadu: {
      name: { english: "Tamil Nadu Map", tamil: "தமிழ்நாடு வரைபடம்" },
      points: tamilNaduPoints,
      bgImage: `url(${TamilNaduMap})`,
      bgColor: "linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)"
    },
    india: {
      name: { english: "India Map", tamil: "இந்தியா வரைபடம்" },
      points: indiaPoints,
      bgImage: `url(${IndiaMap})`,
      bgColor: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)"
    },
    rivers: {
      name: { english: "Indian Rivers Map", tamil: "இந்திய நதிகள் வரைபடம்" },
      points: riverPoints,
      bgImage: `url(${IndianRiverMap})`,
      bgColor: "linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)"
    },
    world: {
      name: { english: "World Map", tamil: "உலக வரைபடம்" },
      points: worldPoints,
      bgImage:` url(${WorldMap})`,
      bgColor: "linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)"
    }
  }), []);

  const texts = useMemo(() => ({
    english: {
      title: "Geography Explorer",
      subtitle: "Drag and Learn!",
      selectMap: "Choose a Map",
      startGame: "Start Game",
      score: "Score",
      timeLeft: "Time Left",
      dragToMap: "Drag to the correct location on the map",
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
      subtitle: "இழுத்து விட்டு கற்றுக்கொள்ளுங்கள்!",
      selectMap: "வரைபடம் தேர்ந்தெடுக்கவும்",
      startGame: "விளையாட்டைத் தொடங்கு",
      score: "மதிப்பெண்",
      timeLeft: "மீதமுள்ள நேரம்",
      dragToMap: "வரைபடத்தில் சரியான இடத்தில் இழுக்கவும்",
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

  // Fixed: Use useCallback for event handlers to prevent recreation
  const showNotification = useCallback((message, type = 'info') => {
    setNotification({ message, type });
    
    if (notificationRef.current) {
      clearTimeout(notificationRef.current);
    }
    
    notificationRef.current = setTimeout(() => {
      setNotification(null);
    }, 3000);
  }, []);

  // Fixed: Reduced confetti particles from 150 to 60 for better performance
  const createConfetti = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#f0932b', '#eb4d4b', '#6c5ce7', '#fd79a8'];

    // Fixed: Reduced from 150 to 60 particles for better performance
    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.1,
        life: 1,
        decay: Math.random() * 0.02 + 0.01
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle, index) => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.rotation += particle.rotationSpeed;
        particle.life -= particle.decay;

        if (particle.life <= 0 || particle.y > canvas.height + 50) {
          particles.splice(index, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = particle.life;
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size);
        ctx.restore();
      });

      if (particles.length > 0) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        setShowConfetti(false);
      }
    };

    animate();
  }, []);

  // Start game function
  const startGame = useCallback((mapKey) => {
    setCurrentMap(mapKey);
    setGameState('playing');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setPlacedMarkers([]);
    setGameResults([]);
    startTimer();
  }, []);

  // Timer functions
  const startTimer = useCallback(() => {
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
    }
  }, []);

  const timeUp = useCallback(() => {
    stopTimer();
    const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];
    
    // Record the result as incorrect
    setGameResults(prev => [...prev, {
      question: currentPoint[language] || currentPoint.name,
      correct: false,
      timeTaken: 30
    }]);

    showNotification(texts[language].incorrect, 'error');
    
    setTimeout(() => {
      nextQuestion();
    }, 1500);
  }, [currentMap, currentQuestionIndex, language, mapConfigs, texts, stopTimer, showNotification]);

  // Fixed: Simplified scoring - exactly 10 points per correct answer
  const checkAnswer = useCallback((clickX, clickY) => {
    const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];
    
    // Convert percentage positions to pixel coordinates
    const mapElement = document.querySelector('.map-display');
    if (!mapElement) return;
    
    const rect = mapElement.getBoundingClientRect();
    const targetX = (parseFloat(currentPoint.left) / 100) * rect.width;
    const targetY = (parseFloat(currentPoint.top) / 100) * rect.height;
    
    // Calculate distance with tolerance
    const distance = Math.sqrt(
      Math.pow(clickX - targetX, 2) + Math.pow(clickY - targetY, 2)
    );
    
    const tolerance = Math.min(rect.width, rect.height) * 0.08;
    const isCorrect = distance <= tolerance;
    const timeTaken = 30 - timeLeft;
    
    if (isCorrect) {
      // Fixed: Simple +10 points per correct answer
      setScore(s => s + 10);
      showNotification(texts[language].correct, 'success');
      
      // Add marker at clicked position
      setPlacedMarkers(prev => [...prev, {
        name: currentPoint.name,
        x: (clickX / rect.width) * 100,
        y: (clickY / rect.height) * 100,
        correct: true
      }]);
      
      // Show confetti (now optimized)
      setShowConfetti(true);
      createConfetti();
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
    }, 1500);
  }, [currentMap, currentQuestionIndex, timeLeft, mapConfigs, language, texts, showNotification, createConfetti, stopTimer]);

  // Next question function
  const nextQuestion = useCallback(() => {
    const totalQuestions = mapConfigs[currentMap].points.length;
    
    if (currentQuestionIndex + 1 >= totalQuestions) {
      endGame();
    } else {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(30);
      startTimer();
    }
  }, [currentMap, currentQuestionIndex, mapConfigs, startTimer]);

  // Fixed: Properly save score on game completion
  const endGame = useCallback(() => {
    stopTimer();
    setGameState('completed');
    
    // Fixed: Save score with consistent gameId and user.name
    if (user && saveScore && score > 0) {
      console.log('Saving score:', { gameId: 'geographyMapping', score, userName: user.name }); // Debug log
      saveScore('geographyMapping', score, user.name); // Fixed: Use consistent 'geographyMapping' key
    }
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [user, saveScore, score, stopTimer]);

  // Reset game function
  const resetGame = useCallback(() => {
    stopTimer();
    setGameState('menu');
    setCurrentMap('india');
    setCurrentQuestionIndex(0);
    setScore(0);
    setTimeLeft(30);
    setPlacedMarkers([]);
    setGameResults([]);
    setShowReport(false);
    setShowFeedbackForm(false);
    setNotification(null);
    setShowConfetti(false);
    draggedItemRef.current = null; // Fixed: Reset drag ref
    
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
  }, [stopTimer]);

  // Back to levels function
  const backToLevels = useCallback(() => {
    resetGame();
  }, [resetGame]);

  // Fixed: Improved map click handling with proper event handling
  const handleMapClick = useCallback((e) => {
    if (gameState !== 'playing') return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    checkAnswer(clickX, clickY);
  }, [gameState, checkAnswer]);
  const [isDragging, setIsDragging] = useState(false);
  const [touchStarted, setTouchStarted] = useState(false);
  const touchStartPos = useRef({ x: 0, y: 0 });
  const dragElement = useRef(null);
  const dragPreview = useRef(null);

  // NEW: Handle touch start for dragging
 const handleTouchStart = useCallback((e, point) => {
  if (gameState !== 'playing') return;
  
  e.preventDefault(); // Prevent scrolling
  const touch = e.touches[0];
  
  setTouchStarted(true);
  setIsDragging(false);
  draggedItemRef.current = point;
  touchStartPos.current = { x: touch.clientX, y: touch.clientY };
  
  // Create drag visual element showing the text being dragged
  const dragText = point[language] || point.name;
  setDragVisual({
    text: dragText,
    x: touch.clientX,
    y: touch.clientY - 30
  });

  // Add haptic feedback if available
  if ('vibrate' in navigator) {
    navigator.vibrate(50);
  }
}, [gameState, language]);

  // NEW: Handle touch move for dragging
  const handleTouchMove = useCallback((e) => {
  if (!touchStarted || gameState !== 'playing') return;
  
  e.preventDefault(); // Prevent scrolling
  const touch = e.touches[0];
  
  const deltaX = Math.abs(touch.clientX - touchStartPos.current.x);
  const deltaY = Math.abs(touch.clientY - touchStartPos.current.y);
  
  // Start dragging if moved more than 10px
  if (!isDragging && (deltaX > 10 || deltaY > 10)) {
    setIsDragging(true);
  }
  
  // Update drag visual position
  if (dragVisual) {
    setDragVisual(prev => ({
      ...prev,
      x: touch.clientX,
      y: touch.clientY - 30
    }));
  }
}, [touchStarted, isDragging, gameState, dragVisual]);

 const handleTouchEnd = useCallback((e) => {
  if (!touchStarted || gameState !== 'playing') return;
  
  e.preventDefault();
  const touch = e.changedTouches[0];
  
  // Clear drag visual
  setDragVisual(null);
  
  if (isDragging && draggedItemRef.current) {
    // Find the element under the touch point
    const elementBelow = document.elementFromPoint(touch.clientX, touch.clientY);
    const mapElement = elementBelow?.closest('.map-display');
    
    if (mapElement) {
      const rect = mapElement.getBoundingClientRect();
      const dropX = touch.clientX - rect.left;
      const dropY = touch.clientY - rect.top;
      
      // Check if drop is within map bounds
      if (dropX >= 0 && dropX <= rect.width && dropY >= 0 && dropY <= rect.height) {
        checkAnswer(dropX, dropY);
        
        // Add haptic feedback for drop
        if ('vibrate' in navigator) {
          navigator.vibrate(100);
        }
      }
    }
  }
  
  // Reset states
  setTouchStarted(false);
  setIsDragging(false);
  draggedItemRef.current = null;
}, [touchStarted, isDragging, gameState, checkAnswer]);

  // Fixed: Enhanced drag and drop handlers with touch support
  const handleDragStart = useCallback((e, point) => {
    draggedItemRef.current = point;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', point.name);
    
    // Create custom drag image for better visual feedback
    const dragImage = document.createElement('div');
    dragImage.textContent = point[language] || point.name;
    dragImage.style.cssText = `
      background: rgba(139, 116, 237, 0.9);
      color: white;
      padding: 10px 15px;
      border-radius: 10px;
      font-weight: bold;
      position: absolute;
      top: -1000px;
      left: -1000px;
    `;
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 50, 25);
    
    setTimeout(() => document.body.removeChild(dragImage), 0);
  }, [language]);

  // Fixed: Drag and drop handlers for better interaction
 

  const handleDragOver = useCallback((e) => {
    e.preventDefault(); // Fixed: Essential for allowing drops
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    if (gameState !== 'playing' || !draggedItemRef.current) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const dropX = e.clientX - rect.left;
    const dropY = e.clientY - rect.top;
    
    checkAnswer(dropX, dropY);
    draggedItemRef.current = null;
  }, [gameState, checkAnswer]);
  const handleMapTouch = useCallback((e) => {
    if (gameState !== 'playing' || isDragging) return;
    
    // Only handle single tap, not during drag
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const rect = e.currentTarget.getBoundingClientRect();
      const touchX = touch.clientX - rect.left;
      const touchY = touch.clientY - rect.top;
      
      // Add a small delay to differentiate from drag start
      setTimeout(() => {
        if (!isDragging) {
          checkAnswer(touchX, touchY);
        }
      }, 100);
    }
  }, [gameState, isDragging, checkAnswer]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (notificationRef.current) {
        clearTimeout(notificationRef.current);
      }
    };
  }, [stopTimer]);

  // Menu Screen - Fixed: Removed student name input, show user from context
  if (gameState === 'menu') {
    return (
      <ScrollableContainer>
      <div className="game-container menu-screen">
        <div className="menu-content">
          <div className="menu-header">
            <button
              onClick={() => setLanguage(language === 'english' ? 'tamil' : 'english')}
              className="language-toggle"
              style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                background: 'rgba(255,255,255,0.9)',
                color: '#2d3748',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '10px 20px',
                borderRadius: '25px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                backdropFilter: 'blur(10px)',
                boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,1)';
                e.target.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              {texts[language].language}
            </button>
          </div>
          
          <h1 className="main-title">{texts[language].title}</h1>
          <p className="main-subtitle">{texts[language].subtitle}</p>
          
          {/* Fixed: Welcome message showing user name from context */}
          {user && (
            <div style={{
              marginBottom: '30px',
              textAlign: 'center'
            }}>
              <p style={{
                fontSize: '18px',
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
          
          <div className="map-grid">
            {Object.entries(mapConfigs).map(([key, config]) => (
              <div
                key={key}
                onClick={() => startGame(key)}
                className="map-card"
              >
                <h3 className="map-title">
                  {config.name[language]}
                </h3>
                <div className="map-preview">
                  <span className="map-icon">🗺</span>
                </div>
                <button className="start-button">
                  {texts[language].startGame}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      </ScrollableContainer>
    );
  }

  // Game Complete Screen - Fixed: Updated with user name from context
  if (gameState === 'completed') {
    const correctAnswers = gameResults.filter(r => r.correct).length;
    const totalQuestions = gameResults.length;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);
    const totalTime = gameResults.reduce((sum, result) => sum + result.timeTaken, 0);
    const avgTime = Math.round(totalTime / totalQuestions);

    let performanceLevel = '';
    let performanceEmoji = '';
    if (percentage >= 80) {
      performanceLevel = texts[language].excellent;
      performanceEmoji = '🌟';
    } else if (percentage >= 60) {
      performanceLevel = texts[language].good;
      performanceEmoji = '👍';
    } else {
      performanceLevel = texts[language].needsImprovement;
      performanceEmoji = '📚';
    }

    // Student Report Component - Fixed: Use user.name
    const StudentReport = () => (
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        borderRadius: '20px',
        padding: '30px',
        margin: '20px 0',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
        maxHeight: '70vh',
        overflowY: 'auto'
      }}>
        <h2 style={{
          fontSize: '1.8rem',
          color: '#2d3748',
          marginBottom: '20px',
          textAlign: 'center',
          borderBottom: '2px solid #4facfe',
          paddingBottom: '10px'
        }}>
          📊 {texts[language].participationReport}
        </h2>
        
        <div style={{ marginBottom: '20px', textAlign: 'center' }}>
          <strong style={{ fontSize: '1.2rem', color: '#4facfe' }}>
            Student: {user?.name || 'Unknown'}
          </strong>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '25px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>{texts[language].correctAnswers}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{correctAnswers}/{totalQuestions}</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>{texts[language].accuracy}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{percentage}%</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>{texts[language].totalTime}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalTime}s</div>
          </div>
          
          <div style={{
            background: 'linear-gradient(135deg, #9C27B0 0%, #BA68C8 100%)',
            color: 'white',
            padding: '15px',
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: '0.9' }}>{texts[language].avgTimePerQuestion}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{avgTime}s</div>
          </div>
        </div>

        <div style={{
          background: percentage >= 80 ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' :
                     percentage >= 60 ? 'linear-gradient(135deg, #FF9800 0%, #FFB74D 100%)' :
                     'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
          color: 'white',
          padding: '20px',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '2rem', marginBottom: '10px' }}>{performanceEmoji}</div>
          <div style={{ fontSize: '1.3rem', fontWeight: 'bold' }}>
            {texts[language].performance}: {performanceLevel}
          </div>
        </div>

        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ color: '#2d3748', marginBottom: '15px' }}>Question Details:</h3>
          <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {gameResults.map((result, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '8px 12px',
                margin: '5px 0',
                borderRadius: '8px',
                background: result.correct ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                border: result.correct ? '1px solid rgba(76, 175, 80, 0.3)' : '1px solid rgba(244, 67, 54, 0.3)'
              }}>
                <span style={{ fontWeight: 'bold' }}>
                  {result.correct ? '✅' : '❌'} {result.question}
                </span>
                <span style={{ fontSize: '0.9rem', opacity: '0.8' }}>
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
            fontSize: '14px',
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
      <div className="game-container completed-screen">
        <div className="completion-wrapper">
          {!showReport && !showFeedbackForm && (
            <>
              <div className="completion-icon">🎉</div>
              <h1 className="completion-title">{texts[language].gameOver}</h1>
              <div className="completion-score">{texts[language].finalScore}: {score}</div>
              <div className="score-details" style={{
                fontSize: '1.2rem',
                color: '#666',
                marginBottom: '40px'
              }}>
                {correctAnswers}/{totalQuestions} ({percentage}%)
              </div>
              
              <div className="complete-buttons" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '15px',
                alignItems: 'center',
                marginBottom: '20px'
              }}>
                <button
                  onClick={() => setShowReport(true)}
                  style={{
                    background: 'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 20px',
                    borderRadius: '25px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                >
                  📊 {texts[language].viewReport}
                </button>
              </div>

              <div className="game-action-buttons" style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '15px',
                alignItems: 'center'
              }}>
                <button
                  onClick={() => startGame(currentMap)}
                  className="play-again-button"
                  style={{
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '15px 30px',
                    borderRadius: '25px',
                    fontSize: '16px',
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
                  className="back-levels-button"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '12px 25px',
                    borderRadius: '20px',
                    fontSize: '14px',
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
                  className="menu-button"
                  style={{
                    background: 'linear-gradient(135deg, #fd79a8 0%, #fdcbf1 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '15px',
                    fontSize: '14px',
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

  // Playing Screen - Fixed: Improved drag and drop functionality
  const currentPoint = mapConfigs[currentMap].points[currentQuestionIndex];

  return (
    <ScrollableContainer>
    <div className="game-container playing-screen">
      {/* Notification Popup */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
          background: notification.type === 'success' ? 'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' :
                     notification.type === 'error' ? 'linear-gradient(135deg, #f44336 0%, #ef5350 100%)' :
                     'linear-gradient(135deg, #2196F3 0%, #42A5F5 100%)',
          color: 'white',
          padding: '15px 25px',
          borderRadius: '25px',
          boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
          fontSize: '16px',
          fontWeight: 'bold',
          animation: 'slideInDown 0.5s ease-out',
          maxWidth: '90%',
          textAlign: 'center',
          pointerEvents: 'none' // Fixed: Prevent interference with map clicks
        }}>
          {notification.message}
        </div>
      )}

      {/* Fixed: Confetti Canvas with proper pointer events */}
      {showConfetti && (
        <canvas
          ref={canvasRef}
          className="confetti-canvas"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none', // Fixed: Prevent interference with map clicks
            zIndex: 999
          }}
        />
      )}

      <div className="game-wrapper">
        {/* Header */}
        <div className="game-header" style={{
          position: 'relative',
          zIndex: 100,
          background: 'rgba(255,255,255,0.98)',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          boxShadow: '0 2px 15px rgba(0,0,0,0.15)',
          backdropFilter: 'blur(15px)'
        }}>
          <div className="header-info" style={{
            textAlign: 'center',
            flexGrow: 1
          }}>
            <h2 className="map-name" style={{
              fontSize: '1.8rem',
              color: '#2d3748',
              margin: 0,
              fontWeight: 'bold'
            }}>
              {mapConfigs[currentMap].name[language]}
            </h2>
            <div className="question-info" style={{
              fontSize: '1rem',
              color: '#666',
              marginTop: '5px'
            }}>
              {texts[language].question} {currentQuestionIndex + 1}/{mapConfigs[currentMap].points.length}
            </div>
          </div>

          <button
            onClick={() => setLanguage(language === 'english' ? 'tamil' : 'english')}
            className="language-toggle"
            style={{
              position: 'absolute',
              top: '50%',
              right: '20px',
              transform: 'translateY(-50%)',
              background: 'rgba(255,255,255,0.9)',
              color: '#2d3748',
              border: '2px solid rgba(255,255,255,0.3)',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: 'bold',
              cursor: 'pointer',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'all 0.3s ease'
            }}
          >
            {texts[language].language}
          </button>
        </div>

        {/* Game Content */}
        <div className="game-content" style={{
          flex: 1,
          display: 'flex',
          gap: '0',
          padding: '0',
          minHeight: 0
        }}>
          {/* Sidebar */}
          <div className="sidebar" style={{
            width: '320px',
            background: 'rgba(139, 116, 237, 0.9)',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '20px',
            minHeight: '100%'
          }}>
            {/* Back Button */}
            <button
              onClick={backToLevels}
              className="back-button-sidebar"
              style={{
                background: 'rgba(255,255,255,0.3)',
                color: 'white',
                border: '2px solid rgba(255,255,255,0.3)',
                padding: '8px 16px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                marginBottom: '10px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.3)';
              }}
            >
              ← {texts[language].backToLevels}
            </button>

            {/* Score */}
            <div className="stat-card score-card" style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <h3 className="stat-title" style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>{texts[language].score}</h3>
              <div className="stat-value score-value" style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                color: '#FFD700'
              }}>{score}</div>
            </div>

            {/* Timer */}
            <div className="stat-card timer-card" style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <h3 className="stat-title" style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 10px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>{texts[language].timeLeft}</h3>
              <div className="stat-value timer-value" style={{
                fontSize: '2.5rem',
                fontWeight: 'bold',
                margin: 0,
                color: timeLeft <= 10 ? '#FF6B6B' : '#FF9800'
              }}>{timeLeft}s</div>
              <div className="timer-bar" style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '4px',
                marginTop: '15px',
                overflow: 'hidden'
              }}>
                <div 
                  className="timer-progress"
                  style={{
                    width:` ${(timeLeft / 30) * 100}%`,
                    height: '100%',
                    background: timeLeft <= 10 ? 
                      'linear-gradient(90deg, #FF6B6B 0%, #FF8E8E 100%)' : 
                      'linear-gradient(90deg, #FF9800 0%, #FFB74D 100%)',
                    transition: 'width 1s linear'
                  }}
                />
              </div>
            </div>

            {/* Current Question - Fixed: Add draggable element */}
           {/* Current Question - Enhanced with touch support */}
<div className="question-card" style={{
  background: 'rgba(255,255,255,0.2)',
  borderRadius: '15px',
  padding: '20px',
  textAlign: 'center',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.3)'
}}>
  <h3 style={{
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.8)',
    margin: '0 0 15px 0',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }}>Find This Location</h3>
  
  <div 
    draggable="true"
    onDragStart={(e) => handleDragStart(e, currentPoint)}
    onTouchStart={(e) => handleTouchStart(e, currentPoint)}
    onTouchMove={handleTouchMove}
    onTouchEnd={handleTouchEnd}
    style={{
      fontSize: '1.8rem',
      fontWeight: 'bold',
      color: 'white',
      marginBottom: '10px',
      cursor: 'grab',
      padding: '15px',
      borderRadius: '10px',
      background: isDragging ? 
        'rgba(255,255,255,0.3)' : 
        'rgba(255,255,255,0.1)',
      transition: 'all 0.2s ease',
      border: '2px dashed rgba(255,255,255,0.4)',
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      touchAction: 'none'
    }}
    onMouseDown={(e) => e.target.style.cursor = 'grabbing'}
    onMouseUp={(e) => e.target.style.cursor = 'grab'}
  >
    {isDragging ? '📍' : '🎯'} {currentPoint[language] || currentPoint.name}
  </div>
  
  <div style={{
    fontSize: '0.9rem',
    color: 'rgba(255,255,255,0.7)',
    fontStyle: 'italic',
    marginTop: '10px'
  }}>
    {isDragging ? 
      '🔥 Drop on the map!' : 
      `📱 ${texts[language].dragToMap || 'Drag to map or tap location'}`}
  </div>
</div>

            {/* Progress */}
            <div className="progress-card" style={{
              background: 'rgba(255,255,255,0.2)',
              borderRadius: '15px',
              padding: '20px',
              textAlign: 'center',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <h3 style={{
                fontSize: '0.9rem',
                color: 'rgba(255,255,255,0.8)',
                margin: '0 0 15px 0',
                textTransform: 'uppercase',
                letterSpacing: '1px'
              }}>Progress</h3>
              <div style={{
                width: '100%',
                height: '12px',
                background: 'rgba(255,255,255,0.2)',
                borderRadius: '6px',
                overflow: 'hidden',
                marginBottom: '10px'
              }}>
                <div style={{
                  width: `${((currentQuestionIndex) / mapConfigs[currentMap].points.length) * 100}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #4CAF50 0%, #66BB6A 100%)',
                  transition: 'width 0.3s ease'
                }} />
              </div>
              <div style={{
                fontSize: '1rem',
                color: 'white',
                fontWeight: 'bold'
              }}>
                {currentQuestionIndex}/{mapConfigs[currentMap].points.length}
              </div>
            </div>
          </div>

          {/* Fixed: Map Area with proper drag and drop handlers */}
          <div className="map-area" style={{
            flex: 1,
            position: 'relative',
            background: mapConfigs[currentMap].bgColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100%',
            overflow: 'hidden'
          }}>
            <div 
              className="map-display"
              onClick={handleMapClick}
              onDragOver={handleDragOver} // Fixed: Essential for drag and drop
              onTouchStart={handleMapTouch} // For direct taps
    
              onDrop={handleDrop} // Fixed: Handle the drop
              style={{
                width: '90%',
                height: '90%',
                backgroundImage: mapConfigs[currentMap].bgImage,
                backgroundSize: 'contain',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                position: 'relative',
                cursor: 'crosshair',
                borderRadius: '20px',
                border: '3px solid rgba(255,255,255,0.3)',
                boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                pointerEvents: 'auto' ,
                touchAction: 'manipulation' // Allow touch interactions// Fixed: Ensure map can receive events
              }}
            >
              {/* Placed Markers */}
              {placedMarkers.map((marker, index) => (
                <div
                  key={index}
                  className="placed-marker"
                  style={{
                    position: 'absolute',
                    left: `${marker.x}%`,
                    top:` ${marker.y}%`,
                    transform: 'translate(-50%, -50%)',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: marker.correct ? 
                      'linear-gradient(135deg, #4CAF50 0%, #66BB6A 100%)' : 
                      'linear-gradient(135deg, #f44336 0%, #ef5350 100%)',
                    border: '3px solid white',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                    zIndex: 10,
                    animation: 'markerPulse 0.6s ease-out',
                    pointerEvents: 'none' // Fixed: Don't interfere with map clicks
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ScrollableContainer>
  );
};

export default GeographyGame;