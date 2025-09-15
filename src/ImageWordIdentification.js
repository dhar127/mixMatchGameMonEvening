import React, { useState, useEffect } from 'react';
import './ImageWordIdentification.css';

const Notification = ({ message, isVisible, type }) => {
  if (!isVisible) return null;

  return (
    <div className={`notification ${type === 'correct' ? 'notification-correct' : 'notification-incorrect'} ${isVisible ? 'notification-visible' : ''}`}>
      {message}
    </div>
  );
};

const ConfettiAnimation = ({ isVisible, onComplete }) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (isVisible) {
      const newParticles = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -10,
        vx: (Math.random() - 0.5) * 4,
        vy: Math.random() * 3 + 2,
        color: ['#ffff00', '#00ff00', '#0000ff', '#ff0000', '#ffff00', '#00ffff', '#ff00ff'][Math.floor(Math.random() * 7)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      }));
      
      setParticles(newParticles);

      const timer = setTimeout(() => {
        setParticles([]);
        if (onComplete) onComplete();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);

  useEffect(() => {
    if (particles.length > 0) {
      const interval = setInterval(() => {
        setParticles(prevParticles => 
          prevParticles.map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            vy: particle.vy + 0.1,
            rotation: particle.rotation + particle.rotationSpeed,
          })).filter(particle => particle.y < window.innerHeight + 20)
        );
      }, 16);

      return () => clearInterval(interval);
    }
  }, [particles]);

  if (!isVisible) return null;

  return (
    <div className="confetti-container">
      {particles.map(particle => (
        <div
          key={particle.id}
          className="confetti-particle"
          style={{
            left: particle.x,
            top: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
};

export default function ImageWordIdentification() {
  const [language, setLanguage] = useState('en');
  const [currentLevel, setCurrentLevel] = useState('beginner');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [streak, setStreak] = useState(0);
  const [highScores, setHighScores] = useState({
    beginner: 0,
    medium: 0,
    hard: 0
  });
  const [notification, setNotification] = useState({ message: '', isVisible: false, type: '' });
  const [showConfetti, setShowConfetti] = useState(false);

  const gameData = {
    beginner: [
      {
        question: {
          en: "What process happens when plants use sunlight?",
          ta: "தாவரங்கள் சூரிய ஒளியைப் பயன்படுத்தும்போது என்ன செயல்முறை நடைபெறுகிறது?"
        },
        options: {
          en: ["Photosynthesis", "Breathing", "Growing", "Sleeping"],
          ta: ["ஒளிச்சேர்க்கை", "சுவாசித்தல்", "வளர்தல்", "தூங்குதல்"]
        },
        correct: 0,
        explanation: {
          en: "Photosynthesis is how plants make food using sunlight!",
          ta: "ஒளிச்சேர்க்கை என்பது தாவரங்கள் சூரிய ஒளியைப் பயன்படுத்தி உணவு தயாரிக்கும் முறையாகும்!"
        }
      },
      {
        question: {
          en: "What happens to water when it gets hot?",
          ta: "நீர் சூடாகும்போது என்ன நடக்கும்?"
        },
        options: {
          en: ["It freezes", "It evaporates", "It disappears", "It turns green"],
          ta: ["அது உறைகிறது", "அது ஆவியாகிறது", "அது மறைந்துவிடும்", "அது பச்சையாக மாறும்"]
        },
        correct: 1,
        explanation: {
          en: "When water gets hot, it evaporates and becomes water vapor!",
          ta: "நீர் சூடாகும்போது, அது ஆவியாகி நீராவியாக மாறுகிறது!"
        }
      },
      {
        question: {
          en: "What do we call breathing in animals?",
          ta: "விலங்குகளின் சுவாசத்தை நாம் என்ன என்று அழைக்கிறோம்?"
        },
        options: {
          en: ["Playing", "Respiration", "Sleeping", "Eating"],
          ta: ["விளையாடுதல்", "சுவாசம்", "தூங்குதல்", "உண்ணுதல்"]
        },
        correct: 1,
        explanation: {
          en: "Respiration is the process of breathing and getting oxygen!",
          ta: "சுவாசம் என்பது மூச்சுவிடுதல் மற்றும் ஆக்ஸிஜனைப் பெறுதல்!"
        }
      },
      {
        question: {
          en: "What do we call it when a seed starts to grow?",
          ta: "விதை வளரத் தொடங்கும்போது அதை என்ன என்று அழைக்கிறோம்?"
        },
        options: {
          en: ["Germination", "Hibernation", "Migration", "Digestion"],
          ta: ["முளைப்பு", "உறக்கநிலை", "இடம்பெயர்வு", "செரிமானம்"]
        },
        correct: 0,
        explanation: {
          en: "Germination is when a seed begins to sprout and grow!",
          ta: "முளைப்பு என்பது விதை முளைக்கத் தொடங்கி வளரும் நிலையாகும்!"
        }
      }
    ],
    medium: [
      {
        question: {
          en: "What is the complete water cycle process?",
          ta: "முழுமையான நீர் சுழற்சி செயல்முறை என்ன?"
        },
        options: {
          en: ["Evaporation → Condensation → Precipitation", "Melting → Freezing → Boiling", "Heating → Cooling → Warming", "Rising → Falling → Floating"],
          ta: ["ஆவியாதல் → குளிர்தல் → மழைப்பொழிவு", "உருகுதல் → உறைதல் → கொதித்தல்", "சூடாதல் → குளிர்தல் → வெப்பமாதல்", "உயர்தல் → விழுதல் → மிதத்தல்"]
        },
        correct: 0,
        explanation: {
          en: "The water cycle involves evaporation, condensation, and precipitation!",
          ta: "நீர் சுழற்சியில் ஆவியாதல், குளிர்தல் மற்றும் மழைப்பொழிவு அடங்கும்!"
        }
      },
      {
        question: {
          en: "What happens during digestion?",
          ta: "செரிமானத்தின் போது என்ன நடக்கிறது?"
        },
        options: {
          en: ["Food becomes waste", "Food breaks down into nutrients", "Food gets bigger", "Food changes color"],
          ta: ["உணவு கழிவாகிறது", "உணவு ஊட்டச்சத்துகளாக உடைகிறது", "உணவு பெரியதாகிறது", "உணவு நிறம் மாறுகிறது"]
        },
        correct: 1,
        explanation: {
          en: "Digestion breaks down food into nutrients our body can use!",
          ta: "செரிமானம் உணவை நம் உடல் பயன்படுத்தக்கூடிய ஊட்டச்சத்துகளாக உடைக்கிறது!"
        }
      },
      {
        question: {
          en: "What is the process of cellular respiration?",
          ta: "செல்லுலார் சுவாசத்தின் செயல்முறை என்ன?"
        },
        options: {
          en: ["Making food from sunlight", "Breaking down glucose for energy", "Growing bigger cells", "Removing waste products"],
          ta: ["சூரிய ஒளியிலிருந்து உணவு தயாரித்தல்", "ஆற்றலுக்காக குளுக்கோஸை உடைத்தல்", "பெரிய செல்களை வளர்த்தல்", "கழிவுப் பொருட்களை அகற்றுதல்"]
        },
        correct: 1,
        explanation: {
          en: "Cellular respiration breaks down glucose to release energy for the cell!",
          ta: "செல்லுலார் சுவாசம் செல்லுக்கு ஆற்றலை வெளியிட குளுக்கோஸை உடைக்கிறது!"
        }
      },
      {
        question: {
          en: "What causes rust formation?",
          ta: "துரு உருவாவதற்கு என்ன காரணம்?"
        },
        options: {
          en: ["Heat and light", "Oxygen and water", "Pressure and time", "Sound and vibration"],
          ta: ["வெப்பம் மற்றும் ஒளி", "ஆக்ஸிஜன் மற்றும் நீர்", "அழுத்தம் மற்றும் நேரம்", "ஒலி மற்றும் அதிர்வு"]
        },
        correct: 1,
        explanation: {
          en: "Rust forms when iron reacts with oxygen and water!",
          ta: "இரும்பு ஆக்ஸிஜன் மற்றும் நீருடன் வினைபுரியும்போது துரு உருவாகிறது!"
        }
      }
    ],
    hard: [
      {
        question: {
          en: "What is the role of mitochondria in cellular respiration?",
          ta: "செல்லுலார் சுவாசத்தில் மைட்டோகாண்ட்ரியாவின் பங்கு என்ன?"
        },
        options: {
          en: ["Protein synthesis", "ATP production", "DNA replication", "Waste removal"],
          ta: ["புரத தொகுப்பு", "ATP உற்பத்தி", "DNA நகலெடுத்தல்", "கழிவு அகற்றல்"]
        },
        correct: 1,
        explanation: {
          en: "Mitochondria are the powerhouses of the cell, producing ATP through cellular respiration!",
          ta: "மைட்டோகாண்ட்ரியா செல்லின் சக்தி மையங்கள், செல்லுலார் சுவாசத்தின் மூலம் ATP ஐ உற்பத்தி செய்கின்றன!"
        }
      },
      {
        question: {
          en: "What is the chemical equation for photosynthesis?",
          ta: "ஒளிச்சேர்க்கைக்கான வேதியியல் சமன்பாடு என்ன?"
        },
        options: {
          en: ["6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O", "2H₂ + O₂ → 2H₂O", "N₂ + 3H₂ → 2NH₃"],
          ta: ["6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂", "C₆H₁₂O₆ + 6O₂ → 6CO₂ + 6H₂O", "2H₂ + O₂ → 2H₂O", "N₂ + 3H₂ → 2NH₃"]
        },
        correct: 0,
        explanation: {
          en: "Photosynthesis converts carbon dioxide and water into glucose and oxygen using sunlight!",
          ta: "ஒளிச்சேர்க்கை சூரிய ஒளியைப் பயன்படுத்தி கார்பன் டை ஆக்சைடு மற்றும் நீரை குளுக்கோஸ் மற்றும் ஆக்ஸிஜனாக மாற்றுகிறது!"
        }
      },
      {
        question: {
          en: "What is enzyme denaturation?",
          ta: "என்சைம் டினேச்சரேஷன் என்றால் என்ன?"
        },
        options: {
          en: ["Enzyme activation", "Loss of enzyme structure and function", "Enzyme reproduction", "Enzyme storage"],
          ta: ["என்சைம் செயல்படுத்துதல்", "என்சைம் அமைப்பு மற்றும் செயல்பாட்டை இழத்தல்", "என்சைம் இனப்பெருக்கம்", "என்சைம் சேமிப்பு"]
        },
        correct: 1,
        explanation: {
          en: "Enzyme denaturation occurs when enzymes lose their shape and can no longer function properly!",
          ta: "என்சைம்கள் தங்கள் வடிவத்தை இழந்து சரியாக செயல்பட முடியாதபோது என்சைம் டினேச்சரேஷன் நிகழ்கிறது!"
        }
      },
      {
        question: {
          en: "What is the difference between aerobic and anaerobic respiration?",
          ta: "ஏரோபிக் மற்றும் அனேரோபிக் சுவாசத்திற்கு இடையே உள்ள வேறுபாடு என்ன?"
        },
        options: {
          en: ["Oxygen requirement", "Temperature difference", "Location in cell", "Time duration"],
          ta: ["ஆக்ஸிஜன் தேவை", "வெப்பநிலை வேறுபாடு", "செல்லில் இடம்", "நேர கால அளவு"]
        },
        correct: 0,
        explanation: {
          en: "Aerobic respiration requires oxygen, while anaerobic respiration occurs without oxygen!",
          ta: "ஏரோபிக் சுவாசத்திற்கு ஆக்ஸிஜன் தேவை, அனேரோபிக் சுவாசம் ஆக்ஸிஜன் இல்லாமல் நிகழ்கிறது!"
        }
      }
    ]
  };

  useEffect(() => {
    try {
      const savedHighScores = localStorage.getItem('quizHighScores');
      if (savedHighScores) {
        setHighScores(JSON.parse(savedHighScores));
      }
    } catch (error) {
      console.log('Error loading high scores:', error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('quizHighScores', JSON.stringify(highScores));
    } catch (error) {
      console.log('Error saving high scores:', error);
    }
  }, [highScores]);

  const showNotification = (message, type) => {
    setNotification({ message, isVisible: true, type });
    setTimeout(() => {
      setNotification({ message: '', isVisible: false, type: '' });
    }, 3000);
  };

  const handleLevelChange = (level) => {
    setCurrentLevel(level);
    setCurrentQuestion(0);
    setScore(0);
    setStreak(0);
    setSelectedOption(null);
    setShowExplanation(false);
  };

  const handleOptionClick = (optionIndex) => {
    if (selectedOption !== null) return;

    setSelectedOption(optionIndex);
    const currentQuestionData = gameData[currentLevel][currentQuestion];
    const isCorrect = optionIndex === currentQuestionData.correct;

    if (isCorrect) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      showNotification(language === 'en' ? 'Correct! 🎉' : 'சரி! 🎉', 'correct');
      
      if ((streak + 1) % 3 === 0) {
        setShowConfetti(true);
      }
    } else {
      setStreak(0);
      showNotification(language === 'en' ? 'Try again! 💪' : 'மீண்டும் முயற்சிக்கவும்! 💪', 'incorrect');
    }

    setTimeout(() => {
      setShowExplanation(true);
    }, 1000);
  };

  const nextQuestion = () => {
    if (currentQuestion < gameData[currentLevel].length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      if (score > highScores[currentLevel]) {
        setHighScores(prev => ({
          ...prev,
          [currentLevel]: score
        }));
        setShowConfetti(true);
      }
      // Reset to first question instead of showing results
      setCurrentQuestion(0);
      setSelectedOption(null);
      setShowExplanation(false);
      showNotification(
        language === 'en' 
          ? `Quiz Complete! Final Score: ${score}/${gameData[currentLevel].length}` 
          : `வினாடி வினா முடிந்தது! இறுதி மதிப்பெண்: ${score}/${gameData[currentLevel].length}`, 
        'correct'
      );
    }
  };

  const currentQuestionData = gameData[currentLevel][currentQuestion];

  return (
    <div className="game-container">
      {/* Language Toggle */}
      <div className="language-toggle">
        <button 
          className={`lang-btn ${language === 'en' ? 'active' : ''}`}
          onClick={() => setLanguage('en')}
        >
          English
        </button>
        <button 
          className={`lang-btn ${language === 'ta' ? 'active' : ''}`}
          onClick={() => setLanguage('ta')}
        >
          தமிழ்
        </button>
      </div>

      {/* Header */}
      <div className="menu-header">
        <h1 className="game-title">
          {language === 'en' ? 'Science Quiz Challenge' : 'அறிவியல் வினாடி வினா சவால்'}
        </h1>
        <p className="game-subtitle">
          {language === 'en' 
            ? 'Test your knowledge of biological and chemical processes!' 
            : 'உயிரியல் மற்றும் வேதியியல் செயல்முறைகள் பற்றிய உங்கள் அறிவை சோதிக்கவும்!'
          }
        </p>
      </div>

      {/* Level Selection */}
      <div className="level-selection">
        <h3 style={{ textAlign: 'center', marginBottom: '20px', color: '#6b46c1' }}>
          {language === 'en' ? 'Select Level:' : 'நிலையைத் தேர்ந்தெடுக்கவும்:'}
        </h3>
        <div className="level-buttons">
          {['beginner', 'medium', 'hard'].map((level) => (
            <button
              key={level}
              className={`level-button ${currentLevel === level ? 'active' : ''}`}
              onClick={() => handleLevelChange(level)}
            >
              {level === 'beginner' && (language === 'en' ? '🌱 Beginner' : '🌱 ஆரம்ப நிலை')}
              {level === 'medium' && (language === 'en' ? '🔬 Medium' : '🔬 நடுத்தர நிலை')}
              {level === 'hard' && (language === 'en' ? '⚗️ Hard' : '⚗️ கடின நிலை')}
            </button>
          ))}
        </div>
      </div>

      {/* Game Stats */}
      <div className="game-stats-bar">
        <div className="stat-item">
          {language === 'en' ? 'Question:' : 'கேள்வி:'} {currentQuestion + 1}/{gameData[currentLevel].length}
        </div>
        <div className="stat-item">
          {language === 'en' ? 'Score:' : 'மதிப்பெண்:'} {score}
        </div>
        <div className="stat-item streak">
          {language === 'en' ? 'Streak:' : 'தொடர்ச்சி:'} {streak}
        </div>
        <div className="stat-item">
          {language === 'en' ? 'High Score:' : 'உயர் மதிப்பெண்:'} {highScores[currentLevel]}
        </div>
      </div>

      {/* Question Section */}
      <div className="game-card">
        <div className="question-section">
          <h2 className="question-text">
            {currentQuestionData.question[language]}
          </h2>

          <div className="options-grid">
            {currentQuestionData.options[language].map((option, index) => (
              <button
                key={index}
                className={`option-button ${
                  selectedOption === index
                    ? index === currentQuestionData.correct
                      ? 'option-correct'
                      : 'option-incorrect'
                    : selectedOption !== null && index === currentQuestionData.correct
                    ? 'option-correct'
                    : selectedOption !== null
                    ? 'option-disabled'
                    : ''
                }`}
                onClick={() => handleOptionClick(index)}
                disabled={selectedOption !== null}
              >
                <span className="option-text">{option}</span>
              </button>
            ))}
          </div>

          {showExplanation && (
            <div className="explanation-box">
              <p className="explanation-text">
                {currentQuestionData.explanation[language]}
              </p>
            </div>
          )}

          {showExplanation && (
            <div className="next-button-container">
              <button className="button button-primary" onClick={nextQuestion}>
                {currentQuestion < gameData[currentLevel].length - 1
                  ? (language === 'en' ? 'Next Question →' : 'அடுத்த கேள்வி →')
                  : (language === 'en' ? 'Complete Quiz →' : 'வினாடி வினாவை முடிக்கவும் →')
                }
              </button>
            </div>
          )}
        </div>
      </div>

      <Notification {...notification} />
      <ConfettiAnimation 
        isVisible={showConfetti} 
        onComplete={() => setShowConfetti(false)} 
      />
    </div>
  );
}