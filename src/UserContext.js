import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage on component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // Save user to localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = (name, school) => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      id: userId,
      name: name.trim(),
      school: school.trim(),
      createdAt: new Date().toISOString(),
      totalScore: 0,
      gamesPlayed: 0
    };
    
    setUser(newUser);
    
    // Add user to all users list
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    allUsers.push(newUser);
    localStorage.setItem('allUsers', JSON.stringify(allUsers));
    
    return newUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const addScore = (gameType, score, maxScore = 100, timeTaken = null, difficulty = 'normal') => {
    if (!user) return;

    const scoreEntry = {
      id: `score_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      userName: user.name,
      userSchool: user.school,
      gameType,
      score,
      maxScore,
      percentage: Math.round((score / maxScore) * 100),
      timeTaken,
      difficulty,
      playedAt: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    };

    // Save individual score
    const allScores = JSON.parse(localStorage.getItem('allScores') || '[]');
    allScores.push(scoreEntry);
    localStorage.setItem('allScores', JSON.stringify(allScores));

    // Update user's total score and games played
    const updatedUser = {
      ...user,
      totalScore: user.totalScore + score,
      gamesPlayed: user.gamesPlayed + 1,
      lastPlayed: new Date().toISOString()
    };
    
    setUser(updatedUser);

    // Update user in all users list
    const allUsers = JSON.parse(localStorage.getItem('allUsers') || '[]');
    const userIndex = allUsers.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      allUsers[userIndex] = updatedUser;
      localStorage.setItem('allUsers', JSON.stringify(allUsers));
    }

    return scoreEntry;
  };

  // FIXED: Add the saveScore function that Geography game is calling
  const saveScore = (gameId, score, userName, timeTaken = null, maxScore = null) => {
    if (!user) return;
    
    // Map gameId to consistent game type names
    const gameTypeMap = {
      'geographyMapping': 'geographyMapping',
      'geography': 'geographyMapping',
      'mathQuiz': 'mathQuiz',
      'scienceQuiz': 'scienceQuiz',
      'wordGuessGame': 'wordGuessGame',
      'labExperiments': 'labExperiments'
    };
    
    const gameType = gameTypeMap[gameId] || gameId;
    
    // Calculate maxScore based on game type if not provided
    let calculatedMaxScore = maxScore;
    if (!calculatedMaxScore) {
      // For geography game, assume each correct answer is worth 10 points
      // and estimate total questions based on score
      if (gameType === 'geographyMapping') {
        calculatedMaxScore = Math.max(score, 80); // Assume 8 questions max, 10 points each
      } else {
        calculatedMaxScore = 100; // Default
      }
    }

    console.log('Saving score:', { gameType, score, calculatedMaxScore, userName });
    
    return addScore(gameType, score, calculatedMaxScore, timeTaken, 'normal');
  };

  const getUserScores = (userId = null) => {
    const targetUserId = userId || user?.id;
    if (!targetUserId) return [];

    const allScores = JSON.parse(localStorage.getItem('allScores') || '[]');
    return allScores
      .filter(score => score.userId === targetUserId)
      .sort((a, b) => new Date(b.playedAt) - new Date(a.playedAt));
  };

  const getLeaderboard = (gameType = null, limit = 50) => {
    const allScores = JSON.parse(localStorage.getItem('allScores') || '[]');
    
    let filteredScores = allScores;
    if (gameType) {
      filteredScores = allScores.filter(score => score.gameType === gameType);
    }

    // Group by user and get their best scores
    const userBestScores = {};
    filteredScores.forEach(score => {
      const key = gameType ? score.userId : `${score.userId}_${score.gameType}`;
      if (!userBestScores[key] || score.score > userBestScores[key].score) {
        userBestScores[key] = score;
      }
    });

    return Object.values(userBestScores)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        if (a.timeTaken && b.timeTaken) return a.timeTaken - b.timeTaken;
        return new Date(b.playedAt) - new Date(a.playedAt);
      })
      .slice(0, limit);
  };

  const getAllUsers = () => {
    return JSON.parse(localStorage.getItem('allUsers') || '[]')
      .sort((a, b) => b.totalScore - a.totalScore);
  };

  const getGameStats = (gameType = null) => {
    const allScores = JSON.parse(localStorage.getItem('allScores') || '[]');
    let relevantScores = gameType ? 
      allScores.filter(score => score.gameType === gameType) : 
      allScores;

    if (relevantScores.length === 0) {
      return {
        totalGames: 0,
        averageScore: 0,
        highestScore: 0,
        totalPlayers: 0
      };
    }

    const totalGames = relevantScores.length;
    const totalScore = relevantScores.reduce((sum, score) => sum + score.score, 0);
    const averageScore = Math.round(totalScore / totalGames);
    const highestScore = Math.max(...relevantScores.map(score => score.score));
    const uniqueUsers = new Set(relevantScores.map(score => score.userId));

    return {
      totalGames,
      averageScore,
      highestScore,
      totalPlayers: uniqueUsers.size
    };
  };

  const clearAllData = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('allUsers');
    localStorage.removeItem('allScores');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    addScore,
    saveScore, // FIXED: Add saveScore to the context value
    getUserScores,
    getLeaderboard,
    getAllUsers,
    getGameStats,
    clearAllData
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};