import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GameProvider, useGame } from './context/GameContext';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import PracticeMode from './pages/PracticeMode';
import TestMode from './pages/TestMode';
import MistakesBook from './pages/MistakesBook';
import StoryAdventure from './pages/StoryAdventure'; // Keeping this as legacy or extra feature? User didn't explicitly ask to remove, but didn't mention it in new flow. Let's keep it accessible if needed, or maybe just focus on new flow.
// Actually, user said "Login -> Dashboard -> Practice/Test/Mistakes". Story mode is not in the new requirement list. I will leave it out of the main flow for now to strictly follow the new "3 nav bars" requirement.

const ProtectedRoute = ({ children }) => {
  const { user } = useGame();
  if (!user) {
    return <Navigate to="/" replace />;
  }
  return children;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/practice"
        element={
          <ProtectedRoute>
            <PracticeMode />
          </ProtectedRoute>
        }
      />
      <Route
        path="/test"
        element={
          <ProtectedRoute>
            <TestMode />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mistakes"
        element={
          <ProtectedRoute>
            <MistakesBook />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <GameProvider>
      <Router>
        <AppRoutes />
      </Router>
    </GameProvider>
  );
}

export default App;
