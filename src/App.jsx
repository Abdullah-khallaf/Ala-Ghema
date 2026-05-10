import React from 'react';
import './App.css';
import { useGameContext } from './context/GameContext';
import { useLocalStorage } from './hooks/useLocalStorage';
import { AdminPanel } from './components/AdminPanel/AdminPanel';
import { Board } from './components/Board/Board';
import { Dice } from './components/Dice/Dice';
import { QuestionModal } from './components/QuestionPanel/QuestionModal';
import { HandoffOverlay } from './components/QuestionPanel/HandoffOverlay';
import { QuestionLog } from './components/QuestionLog/QuestionLog';

/**
 * Main App Component
 * Orchestrates game flow and renders appropriate UI based on game phase
 */

function App() {
  const {
    state,
    answerQuestion,
    skipQuestion,
    confirmHandoff,
  } = useGameContext();

  // Sync to localStorage
  useLocalStorage(state, null);

  // Determine what to render based on game phase
  const renderContent = () => {
    if (state.phase === 'setup') {
      return <AdminPanel />;
    }

    if (state.phase === 'ended') {
      return (
        <div className="winner-screen">
          <div className="winner-card">
            <div className="winner-emoji">
              {state.winner === 'P1' ? '☁️' : '⭐'}
            </div>
            <h1>مبروك! 🎉</h1>
            <p className="winner-label">
              {state.winner === 'P1'
                ? state.playerNames.P1
                : state.playerNames.P2}
            </p>
            <p className="winner-message">
              🏆 وصل إلى النهاية!
            </p>
            <button
              onClick={() => window.location.reload()}
              className="btn-restart"
            >
              لعبة جديدة
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="game-container" dir="rtl">
        <header className="game-header">
          <h1 className="game-title">على غيمة ☁️</h1>
          <div className="player-indicator">
            <span className="indicator-emoji">
              {state.currentTurn === 'P1' ? '☁️' : '⭐'}
            </span>
            <span>
              {state.currentTurn === 'P1'
                ? state.playerNames.P1
                : state.playerNames.P2}
            </span>
          </div>
        </header>

        <div className="game-board-section">
          <Board />
        </div>

        <div className="game-controls">
          <Dice />
        </div>

        <div className="game-log-section">
          <QuestionLog
            questions={state.questions}
            adminAuthenticated={state.adminAuthenticated}
            playerNames={state.playerNames}
          />
        </div>

        {state.phase === 'question' && state.activeQuestion && (
          <QuestionModal
            question={state.activeQuestion}
            currentPlayer={state.currentTurn}
            onAnswer={answerQuestion}
            onSkip={skipQuestion}
          />
        )}

        {state.phase === 'handoff' && (
          <HandoffOverlay
            currentPlayer={state.currentTurn}
            onConfirm={confirmHandoff}
          />
        )}
      </div>
    );
  };

  return <div className="app">{renderContent()}</div>;
}

export default App;
