import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import './Leaderboard.css';

// Enhanced Mouse and Touch Scrolling Hooks - Inline Implementation
const useMouseDragScroll = (elementRef, options = {}) => {
  const isDragging = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const scrollStart = useRef({ left: 0, top: 0 });
  const dragThreshold = options.threshold || 5;
  const enableHorizontal = options.horizontal !== false;
  const enableVertical = options.vertical !== false;

  const handleMouseDown = useCallback((e) => {
    if (e.button !== 0 || e.target.draggable) return;
    
    const element = elementRef.current;
    if (!element) return;

    const hasScrollableContent = 
      element.scrollHeight > element.clientHeight || 
      element.scrollWidth > element.clientWidth;
    
    if (!hasScrollableContent) return;

    e.preventDefault();
    isDragging.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    scrollStart.current = { 
      left: element.scrollLeft, 
      top: element.scrollTop 
    };

    element.style.cursor = 'grabbing';
    element.style.userSelect = 'none';
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  const handleMouseMove = useCallback((e) => {
    if (!isDragging.current) return;
    
    const element = elementRef.current;
    if (!element) return;

    e.preventDefault();
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    if (Math.abs(deltaX) > dragThreshold || Math.abs(deltaY) > dragThreshold) {
      if (enableHorizontal) {
        element.scrollLeft = scrollStart.current.left - deltaX;
      }
      if (enableVertical) {
        element.scrollTop = scrollStart.current.top - deltaY;
      }
    }
  }, [dragThreshold, enableHorizontal, enableVertical]);

  const handleMouseUp = useCallback(() => {
    if (!isDragging.current) return;
    
    isDragging.current = false;
    const element = elementRef.current;
    
    if (element) {
      element.style.cursor = '';
      element.style.userSelect = '';
    }
    
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.style.cursor = 'grab';
    element.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      element.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUp]);

  return isDragging.current;
};

const useEnhancedMouseWheel = (elementRef, options = {}) => {
  const enableHorizontalShift = options.horizontalShift !== false;
  const scrollSpeed = options.speed || 1;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleWheel = (e) => {
      if (enableHorizontalShift && e.shiftKey) {
        e.preventDefault();
        element.scrollLeft += e.deltaY * scrollSpeed;
        return;
      }

      if (scrollSpeed !== 1 && !e.shiftKey) {
        e.preventDefault();
        element.scrollTop += e.deltaY * scrollSpeed;
      }
    };

    element.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      element.removeEventListener('wheel', handleWheel);
    };
  }, [enableHorizontalShift, scrollSpeed]);
};

const useMiddleMouseScroll = (elementRef) => {
  const isMiddleScrolling = useRef(false);
  const middleScrollInterval = useRef(null);
  const startPos = useRef({ x: 0, y: 0 });
  const scrollIndicator = useRef(null);

  const createScrollIndicator = useCallback((x, y) => {
    const indicator = document.createElement('div');
    indicator.style.cssText = `
      position: fixed;
      left: ${x - 15}px;
      top: ${y - 15}px;
      width: 30px;
      height: 30px;
      background: rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      z-index: 10000;
      pointer-events: none;
      user-select: none;
    `;
    indicator.textContent = '↕';
    document.body.appendChild(indicator);
    return indicator;
  }, []);

  const handleMiddleMouseDown = useCallback((e) => {
    if (e.button !== 1) return;
    
    const element = elementRef.current;
    if (!element) return;

    e.preventDefault();
    isMiddleScrolling.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    
    scrollIndicator.current = createScrollIndicator(e.clientX, e.clientY);
    
    document.addEventListener('mousemove', handleMiddleMouseMove);
    document.addEventListener('mouseup', handleMiddleMouseUp);
  }, [createScrollIndicator]);

  const handleMiddleMouseMove = useCallback((e) => {
    if (!isMiddleScrolling.current) return;
    
    const element = elementRef.current;
    if (!element) return;

    const deltaY = e.clientY - startPos.current.y;
    const deltaX = e.clientX - startPos.current.x;
    
    const scrollSpeedY = deltaY * 0.1;
    const scrollSpeedX = deltaX * 0.1;
    
    if (middleScrollInterval.current) {
      clearInterval(middleScrollInterval.current);
    }
    
    middleScrollInterval.current = setInterval(() => {
      element.scrollTop += scrollSpeedY;
      element.scrollLeft += scrollSpeedX;
    }, 16);
  }, []);

  const handleMiddleMouseUp = useCallback((e) => {
    if (e.button !== 1) return;
    
    isMiddleScrolling.current = false;
    
    if (middleScrollInterval.current) {
      clearInterval(middleScrollInterval.current);
      middleScrollInterval.current = null;
    }
    
    if (scrollIndicator.current) {
      document.body.removeChild(scrollIndicator.current);
      scrollIndicator.current = null;
    }
    
    document.removeEventListener('mousemove', handleMiddleMouseMove);
    document.removeEventListener('mouseup', handleMiddleMouseUp);
  }, [handleMiddleMouseMove]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('mousedown', handleMiddleMouseDown);
    element.addEventListener('auxclick', (e) => {
      if (e.button === 1) e.preventDefault();
    });
    
    return () => {
      element.removeEventListener('mousedown', handleMiddleMouseDown);
      document.removeEventListener('mousemove', handleMiddleMouseMove);
      document.removeEventListener('mouseup', handleMiddleMouseUp);
      
      if (middleScrollInterval.current) {
        clearInterval(middleScrollInterval.current);
      }
      if (scrollIndicator.current) {
        document.body.removeChild(scrollIndicator.current);
      }
    };
  }, [handleMiddleMouseDown, handleMiddleMouseMove, handleMiddleMouseUp]);
};

const useKeyboardScroll = (elementRef, options = {}) => {
  const scrollAmount = options.scrollAmount || 50;
  const enableArrows = options.arrows !== false;
  const enablePageKeys = options.pageKeys !== false;
  const enableHomeEnd = options.homeEnd !== false;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleKeyDown = (e) => {
      if (!element.contains(document.activeElement)) return;

      let handled = false;

      if (enableArrows) {
        switch (e.key) {
          case 'ArrowUp':
            element.scrollTop -= scrollAmount;
            handled = true;
            break;
          case 'ArrowDown':
            element.scrollTop += scrollAmount;
            handled = true;
            break;
          case 'ArrowLeft':
            element.scrollLeft -= scrollAmount;
            handled = true;
            break;
          case 'ArrowRight':
            element.scrollLeft += scrollAmount;
            handled = true;
            break;
        }
      }

      if (enablePageKeys) {
        switch (e.key) {
          case 'PageUp':
            element.scrollTop -= element.clientHeight * 0.9;
            handled = true;
            break;
          case 'PageDown':
            element.scrollTop += element.clientHeight * 0.9;
            handled = true;
            break;
        }
      }

      if (enableHomeEnd) {
        switch (e.key) {
          case 'Home':
            if (e.ctrlKey) {
              element.scrollTop = 0;
              handled = true;
            }
            break;
          case 'End':
            if (e.ctrlKey) {
              element.scrollTop = element.scrollHeight;
              handled = true;
            }
            break;
        }
      }

      if (handled) {
        e.preventDefault();
      }
    };

    if (!element.hasAttribute('tabindex')) {
      element.setAttribute('tabindex', '0');
    }

    element.addEventListener('keydown', handleKeyDown);
    
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [scrollAmount, enableArrows, enablePageKeys, enableHomeEnd]);
};

const Leaderboard = () => {
  const { user, getLeaderboard, getAllUsers, getGameStats } = useUser();
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [selectedGame, setSelectedGame] = useState('all');
  const [viewMode, setViewMode] = useState('individual'); // 'individual' or 'overall'
  const [stats, setStats] = useState(null);

  // Enhanced Scrolling Refs
  const leaderboardListRef = useRef(null);
  const statsRef = useRef(null);
  const contentRef = useRef(null);
  const containerRef = useRef(null);

  // Enhanced Scrolling Hooks
  const isDraggingList = useMouseDragScroll(leaderboardListRef);
  const isDraggingStats = useMouseDragScroll(statsRef, { 
    vertical: false, 
    horizontal: true 
  });
  
  useEnhancedMouseWheel(leaderboardListRef, { 
    horizontalShift: true, 
    speed: 1.2 
  });
  useEnhancedMouseWheel(statsRef, { 
    horizontalShift: true, 
    speed: 1 
  });
  
  useMiddleMouseScroll(leaderboardListRef);
  useMiddleMouseScroll(containerRef);
  
  useKeyboardScroll(leaderboardListRef, { 
    scrollAmount: 80,
    arrows: true,
    pageKeys: true,
    homeEnd: true
  });

  const gameTypes = {
    all: { name: 'All Games', icon: '🎯' },
    mathQuiz: { name: 'Math Quiz', icon: '➕' },
    scienceQuiz: { name: 'Science Quiz', icon: '🔬' },
    wordGuessGame: { name: 'Word Game', icon: '🔤' },
    geographyMapping: { name: 'Geography', icon: '🗺' },
    labExperiments: { name: 'Lab Experiments', icon: '🧪' }
  };

  useEffect(() => {
    loadLeaderboard();
    loadStats();
  }, [selectedGame, viewMode]);

  const loadLeaderboard = () => {
    if (viewMode === 'overall') {
      // Show overall user rankings based on total scores
      const allUsers = getAllUsers();
      setLeaderboardData(allUsers.map((userData, index) => ({
        rank: index + 1,
        userName: userData.name,
        userSchool: userData.school,
        score: userData.totalScore,
        gamesPlayed: userData.gamesPlayed,
        isOverallRanking: true,
        userId: userData.id
      })));
    } else {
      // Show game-specific leaderboard
      const gameLeaderboard = getLeaderboard(
        selectedGame === 'all' ? null : selectedGame, 
        100
      );
      
      setLeaderboardData(gameLeaderboard.map((score, index) => ({
        ...score,
        rank: index + 1,
        isCurrentUser: score.userId === user?.id
      })));
    }
  };

  const loadStats = () => {
    const gameStats = getGameStats(selectedGame === 'all' ? null : selectedGame);
    setStats(gameStats);
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankClass = (rank) => {
    switch (rank) {
      case 1: return 'gold';
      case 2: return 'silver';
      case 3: return 'bronze';
      default: return '';
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getCurrentUserRank = () => {
    if (!user) return null;
    const userEntry = leaderboardData.find(entry => entry.userId === user.id);
    return userEntry ? userEntry.rank : null;
  };

  return (
    <div 
      ref={containerRef}
      className="leaderboard-container"
      style={{ 
        cursor: isDraggingList || isDraggingStats ? 'grabbing' : '',
        touchAction: 'pan-y pan-x'
      }}
    >
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">🏆 Leaderboard</h1>
        <p className="leaderboard-subtitle">See how you rank against other players!</p>
      </div>

      {stats && (
        <div 
          ref={statsRef}
          className="global-stats"
          style={{ 
            cursor: isDraggingStats ? 'grabbing' : 'grab',
            touchAction: 'pan-x'
          }}
        >
          <div className="stat-item">
            <span className="stat-icon">🎮</span>
            <div>
              <div className="stat-number">{stats.totalGames}</div>
              <div className="stat-label">Total Games</div>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">👥</span>
            <div>
              <div className="stat-number">{stats.totalPlayers}</div>
              <div className="stat-label">Players</div>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">📊</span>
            <div>
              <div className="stat-number">{stats.averageScore}</div>
              <div className="stat-label">Avg Score</div>
            </div>
          </div>
          <div className="stat-item">
            <span className="stat-icon">🏆</span>
            <div>
              <div className="stat-number">{stats.highestScore}</div>
              <div className="stat-label">High Score</div>
            </div>
          </div>
        </div>
      )}

      <div className="controls-section">
        <div className="view-mode-toggle">
          <button 
            className={`toggle-btn ${viewMode === 'individual' ? 'active' : ''}`}
            onClick={() => setViewMode('individual')}
          >
            🎯 Game Scores
          </button>
          <button 
            className={`toggle-btn ${viewMode === 'overall' ? 'active' : ''}`}
            onClick={() => setViewMode('overall')}
          >
            👑 Overall Rankings
          </button>
        </div>

        {viewMode === 'individual' && (
          <div className="game-filter">
            <label htmlFor="gameSelect">Filter by Game:</label>
            <select 
              id="gameSelect"
              value={selectedGame} 
              onChange={(e) => setSelectedGame(e.target.value)}
              className="game-select"
            >
              {Object.entries(gameTypes).map(([key, game]) => (
                <option key={key} value={key}>
                  {game.icon} {game.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {user && getCurrentUserRank() && (
        <div className="user-rank-highlight">
          <div className="rank-card current-user">
            <div className="rank-info">
              <span className="rank-badge">Your Rank: {getRankIcon(getCurrentUserRank())}</span>
              <span className="user-name">{user.name}</span>
            </div>
          </div>
        </div>
      )}

      <div 
        ref={contentRef}
        className="leaderboard-content"
      >
        {leaderboardData.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">🎮</div>
            <h3>No scores yet!</h3>
            <p>Be the first to play and claim the top spot!</p>
            <Link to="/" className="play-first-btn">
              🚀 Start Playing
            </Link>
          </div>
        ) : (
          <div 
            ref={leaderboardListRef}
            className="leaderboard-list"
            style={{ 
              cursor: isDraggingList ? 'grabbing' : 'grab',
              touchAction: 'pan-y pan-x'
            }}
            tabIndex={0}
            data-mode={viewMode}
          >
            <div className="leaderboard-headers" data-mode={viewMode}>
              <div className="header-rank">Rank</div>
              <div className="header-player">Player</div>
              <div className="header-school">School</div>
              {viewMode === 'individual' ? (
                <>
                  <div className="header-score">Score</div>
                  {selectedGame !== 'all' && <div className="header-time">Time</div>}
                  <div className="header-game">
                    {selectedGame === 'all' ? 'Game' : 'Date'}
                  </div>
                </>
              ) : (
                <>
                  <div className="header-score">Total Score</div>
                  <div className="header-games">Games Played</div>
                </>
              )}
            </div>

            {leaderboardData.map((entry, index) => (
              <div 
                key={entry.userId || entry.id} 
                className={`leaderboard-row ${getRankClass(entry.rank)} ${
                  entry.isCurrentUser ? 'current-user' : ''
                }`}
                data-mode={viewMode}
              >
                <div className="row-rank">
                  <span className="rank-display">
                    {getRankIcon(entry.rank)}
                  </span>
                </div>
                
                <div className="row-player">
                  <div className="player-info">
                    <span className="player-name">{entry.userName}</span>
                    {entry.isCurrentUser && (
                      <span className="you-badge">You</span>
                    )}
                  </div>
                </div>
                
                <div className="row-school">
                  <span className="school-name">{entry.userSchool}</span>
                </div>

                {viewMode === 'individual' ? (
                  <>
                    <div className="row-score">
                      <div className="score-info">
                        <span className="score-number">{entry.score}</span>
                        {entry.maxScore && (
                          <span className="score-max">/{entry.maxScore}</span>
                        )}
                        {entry.percentage && (
                          <span className="score-percentage">({entry.percentage}%)</span>
                        )}
                      </div>
                    </div>
                    
                    {selectedGame !== 'all' && (
                      <div className="row-time">
                        {formatTime(entry.timeTaken)}
                      </div>
                    )}
                    
                    <div className="row-game">
                      {selectedGame === 'all' ? (
                        <span className="game-badge">
                          {gameTypes[entry.gameType]?.icon || '🎯'} 
                          {gameTypes[entry.gameType]?.name || entry.gameType}
                        </span>
                      ) : (
                        <span className="play-date">{entry.date}</span>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="row-score">
                      <span className="total-score">{entry.score}</span>
                    </div>
                    <div className="row-games">
                      <span className="games-count">{entry.gamesPlayed}</span>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="leaderboard-actions">
        <Link to="/" className="action-btn primary">
          🎮 Play Games
        </Link>
        <Link to="/my-scores" className="action-btn secondary">
          📊 My Scores
        </Link>
      </div>
    </div>
  );
};

export default Leaderboard;