import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from './UserContext';
import './UserScores.css';

const UserScores = () => {
  const { user, getUserScores, getGameStats } = useUser();
  const [scores, setScores] = useState([]);
  const [stats, setStats] = useState(null);
  const [selectedGame, setSelectedGame] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const gameTypes = {
    all: { name: 'All Games', icon: '🎯' },
    mathQuiz: { name: 'Math Quiz', icon: '➕' },
    scienceQuiz: { name: 'Science Quiz', icon: '🔬' },
    wordGuessGame: { name: 'Word Game', icon: '🔤' },
    geographyMapping: { name: 'Geography', icon: '🗺' },
    labExperiments: { name: 'Lab Experiments', icon: '🧪' }
  };

  useEffect(() => {
    if (user) {
      loadScores();
      loadStats();
    }
  }, [user, selectedGame, sortBy]);

  const loadScores = () => {
    let userScores = getUserScores();
    
    // Filter by game type
    if (selectedGame !== 'all') {
      userScores = userScores.filter(score => score.gameType === selectedGame);
    }

    // Sort scores
    switch (sortBy) {
      case 'recent':
        userScores.sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
        break;
      case 'highest':
        userScores.sort((a, b) => b.score - a.score);
        break;
      case 'percentage':
        userScores.sort((a, b) => b.percentage - a.percentage);
        break;
      case 'fastest':
        userScores.sort((a, b) => {
          if (!a.timeTaken) return 1;
          if (!b.timeTaken) return -1;
          return a.timeTaken - b.timeTaken;
        });
        break;
      default:
        break;
    }

    setScores(userScores);
  };

  const loadStats = () => {
    const gameStats = getGameStats(selectedGame === 'all' ? null : selectedGame);
    setStats(gameStats);
  };

  const formatTime = (seconds) => {
    if (!seconds) return 'N/A';
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return mins > 0 ? `${mins}m ${secs}s` : `${secs}s`;
  };

  const getScoreColor = (percentage) => {
    if (percentage >= 90) return 'excellent';
    if (percentage >= 75) return 'good';
    if (percentage >= 60) return 'average';
    return 'needs-improvement';
  };

  const getBestScore = () => {
    if (scores.length === 0) return null;
    return scores.reduce((best, current) => 
      current.score > best.score ? current : best
    );
  };

  const getAverageScore = () => {
    if (scores.length === 0) return 0;
    return Math.round(scores.reduce((sum, score) => sum + score.score, 0) / scores.length);
  };

  if (!user) {
    return <div className="loading">Loading...</div>;
  }

  const bestScore = getBestScore();
  const averageScore = getAverageScore();

  return (
    <div className="user-scores-container">
      <div className="scores-header">
        <h1 className="scores-title">📊 My Game Scores</h1>
        <div className="user-info-card">
          <h2>👤 {user.name}</h2>
          <p>🏫 {user.school}</p>
          <div className="quick-stats">
            <span>🎮 {user.gamesPlayed} games played</span>
            <span>⭐ {user.totalScore} total points</span>
          </div>
        </div>
      </div>

      <div className="controls-section">
        <div className="filter-controls">
          <div className="control-group">
            <label htmlFor="gameFilter">🎯 Filter by Game:</label>
            <select 
              id="gameFilter"
              value={selectedGame} 
              onChange={(e) => setSelectedGame(e.target.value)}
              className="control-select"
            >
              {Object.entries(gameTypes).map(([key, game]) => (
                <option key={key} value={key}>
                  {game.icon} {game.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="sortBy">🔄 Sort by:</label>
            <select 
              id="sortBy"
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="control-select"
            >
              <option value="recent">📅 Most Recent</option>
              <option value="highest">🏆 Highest Score</option>
              <option value="percentage">📈 Best Percentage</option>
              <option value="fastest">⚡ Fastest Time</option>
            </select>
          </div>
        </div>
      </div>

      {scores.length > 0 && (
        <div className="summary-stats">
          <div className="stat-card">
            <h3>🏆 Best Score</h3>
            <div className="stat-value">{bestScore?.score || 0}</div>
            <div className="stat-detail">{bestScore?.percentage || 0}%</div>
          </div>
          <div className="stat-card">
            <h3>📊 Average Score</h3>
            <div className="stat-value">{averageScore}</div>
            <div className="stat-detail">Across {scores.length} games</div>
          </div>
          <div className="stat-card">
            <h3>⚡ Total Games</h3>
            <div className="stat-value">{scores.length}</div>
            <div className="stat-detail">
              {selectedGame === 'all' ? 'All games' : gameTypes[selectedGame]?.name}
            </div>
          </div>
        </div>
      )}

      <div className="scores-content">
        {scores.length === 0 ? (
          <div className="no-scores">
            <div className="no-scores-icon">🎮</div>
            <h3>No scores yet!</h3>
            <p>
              {selectedGame === 'all' 
                ? "Start playing some games to see your scores here."
                : `You haven't played ${gameTypes[selectedGame]?.name} yet.`
              }
            </p>
            <Link to="/" className="play-now-btn">
              🚀 Play Now
            </Link>
          </div>
        ) : (
          <div className="scores-grid">
            {scores.map((score, index) => (
              <div key={score.id} className={`score-card ${getScoreColor(score.percentage)}`}>
                <div className="score-header">
                  <div className="game-info">
                    <span className="game-icon">
                      {gameTypes[score.gameType]?.icon || '🎯'}
                    </span>
                    <div>
                      <h4 className="game-name">
                        {gameTypes[score.gameType]?.name || score.gameType}
                      </h4>
                      <p className="play-date">{score.date}</p>
                    </div>
                  </div>
                  {index === 0 && sortBy === 'highest' && (
                    <div className="best-badge">🏆 Best</div>
                  )}
                </div>

                <div className="score-details">
                  <div className="main-score">
                    <span className="score-number">{score.score}</span>
                    <span className="score-max">/{score.maxScore}</span>
                  </div>
                  <div className="percentage-badge">
                    {score.percentage}%
                  </div>
                </div>

                <div className="score-metadata">
                  {score.timeTaken && (
                    <div className="meta-item">
                      <span className="meta-icon">⏱</span>
                      <span>{formatTime(score.timeTaken)}</span>
                    </div>
                  )}
                  {score.difficulty && (
                    <div className="meta-item">
                      <span className="meta-icon">📊</span>
                      <span className="difficulty">{score.difficulty}</span>
                    </div>
                  )}
                  <div className="meta-item">
                    <span className="meta-icon">📅</span>
                    <span>{new Date(score.playedAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                <div className="score-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${score.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="actions-section">
        <Link to="/" className="action-btn primary">
          🎮 Play More Games
        </Link>
        <Link to="/leaderboard" className="action-btn secondary">
          🏆 View Leaderboard
        </Link>
      </div>
    </div>
  );
};

export default UserScores;