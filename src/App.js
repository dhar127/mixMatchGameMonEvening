import React, { useState, createContext, useContext, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import "./App.css";
import { UserProvider, useUser } from "./UserContext";
import UserEntry from "./UserEntry";
import ScrollableContainer from './Scroll';

// Import all game components
import MathQuiz from './MathQuiz';
import GFGWordGame from './GFGWordGame';
import ScienceQuiz from './ScienceQuiz';
import LabExperiment from './LabExperiment';
import GeographyMappping from './GeographyMapping';

// Import new components
import UserScores from './UserScores';
import Leaderboard from './Leaderboard';

// Import logo images
import Logo1 from './assets/Logo1.png';
import Logo2 from './assets/Logo2.png';

const useTouchScroll = (containerRef, options = {}) => {
  const {
    scrollSpeed = 1,
    momentum = 0.95,
    minMomentum = 0.1,
    bounceBack = true,
    horizontal = false,
    vertical = true
  } = options;

  const touchStartRef = useRef({ x: 0, y: 0 });
  const touchEndRef = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const momentumRef = useRef(null);
  const isDraggingRef = useRef(false);
  const lastTouchTimeRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleTouchStart = (e) => {
      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current);
        momentumRef.current = null;
      }

      isDraggingRef.current = true;
      const touch = e.touches[0];
      touchStartRef.current = { x: touch.clientX, y: touch.clientY };
      touchEndRef.current = { x: touch.clientX, y: touch.clientY };
      lastTouchTimeRef.current = Date.now();
      velocityRef.current = { x: 0, y: 0 };

      // Prevent default to avoid conflicts with browser scrolling
      e.preventDefault();
    };

    const handleTouchMove = (e) => {
      if (!isDraggingRef.current) return;

      const touch = e.touches[0];
      const currentTime = Date.now();
      const timeDelta = currentTime - lastTouchTimeRef.current;
      
      if (timeDelta > 0) {
        const deltaX = touch.clientX - touchEndRef.current.x;
        const deltaY = touch.clientY - touchEndRef.current.y;
        
        velocityRef.current = {
          x: deltaX / timeDelta,
          y: deltaY / timeDelta
        };

        // Apply scrolling
        if (horizontal && Math.abs(deltaX) > 1) {
          container.scrollLeft -= deltaX * scrollSpeed;
        }
        
        if (vertical && Math.abs(deltaY) > 1) {
          container.scrollTop -= deltaY * scrollSpeed;
        }

        touchEndRef.current = { x: touch.clientX, y: touch.clientY };
        lastTouchTimeRef.current = currentTime;
      }

      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      isDraggingRef.current = false;
      
      // Apply momentum scrolling
      const applyMomentum = () => {
        let { x: vx, y: vy } = velocityRef.current;
        
        if (Math.abs(vx) < minMomentum && Math.abs(vy) < minMomentum) {
          momentumRef.current = null;
          return;
        }

        if (horizontal && Math.abs(vx) > minMomentum) {
          const newScrollLeft = container.scrollLeft - vx * 50;
          const maxScrollLeft = container.scrollWidth - container.clientWidth;
          
          if (bounceBack) {
            if (newScrollLeft < 0) {
              container.scrollLeft = Math.max(0, container.scrollLeft - vx * 25);
              vx *= -0.5; // Bounce back
            } else if (newScrollLeft > maxScrollLeft) {
              container.scrollLeft = Math.min(maxScrollLeft, container.scrollLeft - vx * 25);
              vx *= -0.5; // Bounce back
            } else {
              container.scrollLeft = newScrollLeft;
            }
          } else {
            container.scrollLeft = Math.max(0, Math.min(maxScrollLeft, newScrollLeft));
          }
        }

        if (vertical && Math.abs(vy) > minMomentum) {
          const newScrollTop = container.scrollTop - vy * 50;
          const maxScrollTop = container.scrollHeight - container.clientHeight;
          
          if (bounceBack) {
            if (newScrollTop < 0) {
              container.scrollTop = Math.max(0, container.scrollTop - vy * 25);
              vy *= -0.5; // Bounce back
            } else if (newScrollTop > maxScrollTop) {
              container.scrollTop = Math.min(maxScrollTop, container.scrollTop - vy * 25);
              vy *= -0.5; // Bounce back
            } else {
              container.scrollTop = newScrollTop;
            }
          } else {
            container.scrollTop = Math.max(0, Math.min(maxScrollTop, newScrollTop));
          }
        }

        // Apply momentum decay
        velocityRef.current = {
          x: vx * momentum,
          y: vy * momentum
        };

        momentumRef.current = requestAnimationFrame(applyMomentum);
      };

      // Start momentum if there's sufficient velocity
      if (Math.abs(velocityRef.current.x) > minMomentum || Math.abs(velocityRef.current.y) > minMomentum) {
        momentumRef.current = requestAnimationFrame(applyMomentum);
      }

      e.preventDefault();
    };

    // Add touch event listeners
    container.addEventListener('touchstart', handleTouchStart, { passive: false });
    container.addEventListener('touchmove', handleTouchMove, { passive: false });
    container.addEventListener('touchend', handleTouchEnd, { passive: false });

    // Cleanup
    return () => {
      if (momentumRef.current) {
        cancelAnimationFrame(momentumRef.current);
      }
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scrollSpeed, momentum, minMomentum, bounceBack, horizontal, vertical]);
};

/* ---------------- TOUCH SCROLL WRAPPER COMPONENT ---------------- */
const TouchScrollWrapper = ({ 
  children, 
  className = '', 
  scrollOptions = {},
  style = {},
  ...props 
}) => {
  const containerRef = useRef(null);
  useTouchScroll(containerRef, {
    horizontal: false,
    vertical: true,
    scrollSpeed: 1.2,
    momentum: 0.92,
    bounceBack: true,
    ...scrollOptions
  });

  return (
    <div 
      ref={containerRef}
      className={`touch-scroll-container ${className}`}
      style={{
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        touchAction: scrollOptions.horizontal && scrollOptions.vertical ? 'none' 
                   : scrollOptions.horizontal ? 'pan-y' 
                   : 'pan-x',
        ...style
      }}
      {...props}
    >
      {children}
    </div>
  );
};

/* ---------------- LANGUAGE CONTEXT ---------------- */
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('english');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'english' ? 'tamil' : 'english'));
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

/* ---------------- TRANSLATIONS ---------------- */
const translations = {
  english: {
    sciencePark: "SCIENCE PARK - Thiruvallur District",
    designedBy: "Designed and developed by R.M.K Engineering College",
    appTitle: "Mix and Match Contest for Budding Innovators ",
    selectGame: "இளைய கண்டுபிடிப்பாளர்களுக்கான கலப்புபொருத்துப்போட்டி",
   

    scienceQuiz: "Science Quiz",
    geographyMapping: "Geography Mapping",
    labExperiments: "Lab Experiments",
    wordGuessGame: "Word Guess Game",
    mathQuiz: "Math Quiz",

    teamMembers: "Team Members: 2023-2027 ",
    mentor: "Mentor:",
    nikhita: "Tharigopula Nikhita - III/CSE",
    sheeba: "Sheeba Sherlin S - III/CSE",
    mentorName: "M P Karthikeyan - Associative Professor/CSE",

    

    backToMenu: "← Back to Menu",
    languageToggle: "தமிழ்",

    // New translations
    myScores: "My Scores",
    leaderboard: "Leaderboard",
    welcome: "Welcome",
    logout: "Logout"
  },

  tamil: {
    sciencePark: "அறிவியல் பூங்கா - திருவள்ளூர் மாவட்டம்",
    designedBy: "ஆர்.எம்.கே பொறியியல் கல்லூரியால் வடிவமைக்கப்பட்டு உருவாக்கப்பட்டது",
    appTitle: "இளைய கண்டுபிடிப்பாளர்களுக்கான கலப்புபொருத்துப்போட்டி",
    

    scienceQuiz: "அறிவியல் வினாடி வினா",
    geographyMapping: "புவியியல் வரைபடம்",
    labExperiments: "ஆய்வக சோதனைகள்",
    wordGuessGame: "சொல் அறிதல் விளையாட்டு",
    mathQuiz: "கணித வினாடி வினா",

    teamMembers: "குழு உறுப்பினர்கள்: 2023-2027 ",
    mentor: "வழிகாட்டி:",
    nikhita: "தாரிகோபுல நிகிதா - III/CSE",
    sheeba: "ஷீபா ஷெர்லின் எஸ் - III/CSE",
    mentorName: "எம் பி கார்த்திகேயன் - இணை பேராசிரியர்/CSE",


    backToMenu: "← மெனுவுக்குத் திரும்பு",
    languageToggle: "English",

    // New translations
    myScores: "எனது மதிப்பெண்கள்",
    leaderboard: "தரவரிசை பலகை",
    welcome: "வரவேற்கிறோம்",
    logout: "வெளியேறு"
  }
};

/* ---------------- COMPONENTS ---------------- */
const LanguageToggle = () => {
  const { language, toggleLanguage } = useLanguage();
  return (
    <button onClick={toggleLanguage} className="language-toggle-btn">
      <span className="language-text">{translations[language].languageToggle}</span>
      <span className="language-icon">🌐</span>
    </button>
  );
};

const UserInfo = () => {
  const { user, logout } = useUser();
  const { language } = useLanguage();
  
  if (!user) return null;

  return (
    <div className="user-info">
      <span className="welcome-text">
        {translations[language].welcome}, {user.name}!
      </span>
      <button onClick={logout} className="logout-btn">
        {translations[language].logout}
      </button>
    </div>
  );
};

const Navigation = () => {
  const { language } = useLanguage();
  const location = useLocation();

  if (location.pathname !== '/') return null;

  return (
    <div className="navigation-menu">
      <Link to="/my-scores" className="nav-btn">
        📊 {translations[language].myScores}
      </Link>
      <Link to="/leaderboard" className="nav-btn">
        🏆 {translations[language].leaderboard}
      </Link>
    </div>
  );
};

const BackButton = () => {
  const location = useLocation();
  const { language } = useLanguage();
  if (location.pathname === '/') return null;
  return (
    <Link to="/" className="back-btn">
      {translations[language].backToMenu}
    </Link>
  );
};

const GameIcon = ({ emoji, titleKey, to }) => {
  const { language } = useLanguage();
  return (
    <Link to={to} className="game-icon-container">
      <div className="game-icon">
        <span role="img" aria-label={translations[language][titleKey]}>
          {emoji}
        </span>
        <h3>{translations[language][titleKey]}</h3>
      </div>
    </Link>
  );
};

const GameSelection = () => (
  <div className="games-grid">
    <GameIcon emoji="🔬" titleKey="scienceQuiz" to="/scienceQuiz" />
    <GameIcon emoji="🗺" titleKey="geographyMapping" to="/GeographyMapping" />
    <GameIcon emoji="🧪" titleKey="labExperiments" to="/labExperiments" />
    <GameIcon emoji="🔤" titleKey="wordGuessGame" to="/wordGame" />
    <GameIcon emoji="➕" titleKey="mathQuiz" to="/mathQuiz" />
  </div>
);

const EnhancedHeader = () => {
  const { language } = useLanguage();
  return (
    <div className="enhanced-header">
      <div className="header-top">
        <UserInfo />
        <LanguageToggle />
      </div>
      <div className="extra-header">
        <div className="logo-placeholder left-logo">
          <img src={Logo1} alt="Left Logo" className="logo-image-direct" />
        </div>
        <div className="extra-header-content">
          <h1 className="extra-title">{translations[language].sciencePark}</h1>
          <p className="extra-subtitle">{translations[language].designedBy}</p>
        </div>
        <div className="logo-placeholder right-logo">
          <img src={Logo2} alt="Right Logo" className="logo-image-direct" />
        </div>
      </div>
      <div className="header-section">
        <h2 className="main-title">{translations[language].appTitle}</h2>
        <p className="game-selection-prompt">{translations[language].selectGame}</p>
      </div>
      <Navigation />
    </div>
  );
};

const TeamMembersSection = () => {
  const { language } = useLanguage();
  return (
    <div className="team-members-section">
      <div className="team-container">
        <div className="team-content">
          <div className="team-members">
            <span className="member-name">{translations[language].teamMembers}</span>
            <span className="member-name">{translations[language].nikhita}</span>
            <span className="member-name">{translations[language].sheeba}</span>
          </div>
          <div className="team-mentor">
            <span className="mentor-name">{translations[language].mentor}</span>
            <span className="mentor-name">{translations[language].mentorName}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const Home = () => (
  <div className="main-container">
    <EnhancedHeader />
    <div className="games-section">
      <GameSelection />
    </div>
    <TeamMembersSection />
    <ScrollableContainer/>
  </div>
);

const GameWrapper = ({ children }) => (
  <div className="modal-overlay">
    <div className="modal-content">
      <div className="game-fullscreen-wrapper">
        <ScrollableContainer>
          {children}
        </ScrollableContainer>
      </div>
    </div>
  </div>
);

/* ---------------- ROUTES ---------------- */
const AppRoutes = () => {
  const { user } = useUser();

  // Body overflow control for modal
  useEffect(() => {
    const isGameRoute = ['/mathQuiz', '/wordGame', '/scienceQuiz', '/labExperiments', '/GeographyMapping'].includes(window.location.pathname);
    
    if (isGameRoute) {
      document.body.style.overflow = 'auto';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    // Cleanup
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!user) {
    return <UserEntry />;
  }
  return (
    <>
      <BackButton />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/mathQuiz" element={<GameWrapper><MathQuiz /></GameWrapper>} />
        <Route path="/wordGame" element={<GameWrapper><GFGWordGame /></GameWrapper>} />
        <Route path="/scienceQuiz" element={<GameWrapper><ScienceQuiz /></GameWrapper>} />
        <Route path="/labExperiments" element={<GameWrapper><LabExperiment /></GameWrapper>} />
        <Route path="/GeographyMapping" element={<GameWrapper><GeographyMappping /></GameWrapper>} />
        <Route path="/my-scores" element={<UserScores />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </>
  );
};

/* ---------------- MAIN APP ---------------- */
function App() {
  return (
    <UserProvider>
      <LanguageProvider>
        <Router>
          <div className="min-h-screen app-bg">
            <AppRoutes />
          </div>
        </Router>
      </LanguageProvider>
    </UserProvider>
  );
}

export { TouchScrollWrapper, useTouchScroll };
export default App;