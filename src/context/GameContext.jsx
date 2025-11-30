import React, { createContext, useContext, useState, useEffect } from 'react';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

export const GameProvider = ({ children }) => {
  // User State
  const [user, setUser] = useState(null); // { username: string }

  // Game Progress
  const [userProgress, setUserProgress] = useState({
    xp: 0,
    level: 1,
    coins: 0,
  });

  // Current Selection (Refactored: Unit -> Lesson)
  const [currentSelection, setCurrentSelection] = useState({
    unitId: null,
    lessonId: null,
  });

  // Mistakes / Error Book
  const [mistakes, setMistakes] = useState(() => {
    const saved = localStorage.getItem('panda_mistakes');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('panda_mistakes', JSON.stringify(mistakes));
  }, [mistakes]);

  const login = (username) => {
    setUser({ username });
  };

  const logout = () => {
    setUser(null);
    setCurrentSelection({ unitId: null, lessonId: null });
  };

  const selectCurriculum = (unitId, lessonId) => {
    setCurrentSelection({ unitId, lessonId });
  };

  const addMistake = (word, unitId, lessonId) => {
    setMistakes(prev => {
      // Avoid duplicates
      if (prev.find(m => m.id === word.id)) return prev;
      return [...prev, { ...word, unitId, lessonId, timestamp: Date.now() }];
    });
  };

  const removeMistake = (wordId) => {
    setMistakes(prev => prev.filter(m => m.id !== wordId));
  };

  const addXP = (amount) => {
    setUserProgress((prev) => {
      const newXP = prev.xp + amount;
      const nextLevelXP = prev.level * 100;
      if (newXP >= nextLevelXP) {
        return { ...prev, xp: newXP - nextLevelXP, level: prev.level + 1 };
      }
      return { ...prev, xp: newXP };
    });
  };

  // Unlock card logic (simplified for now, just tracking unlocked IDs if needed)
  const unlockCard = (cardId) => {
    // Logic to track unlocked cards can go here
  };

  return (
    <GameContext.Provider value={{
      user,
      login,
      logout,
      userProgress,
      addXP,
      currentSelection,
      selectCurriculum,
      mistakes,
      addMistake,
      removeMistake,
      unlockCard
    }}>
      {children}
    </GameContext.Provider>
  );
};
