import React from 'react';
import './App.css';
import { useGameContext } from './context/GameContext';
import { AdminPanel } from './components/AdminPanel/AdminPanel';
import { Board } from './components/Board/Board';
import { Dice } from './components/Dice/Dice';
import { QuestionModal } from './components/QuestionPanel/QuestionModal';
import { QuestionLog } from './components/QuestionLog/QuestionLog';

function App() {
  const {
    state,
    answerQuestion,
    skipQuestion,
    resetGame,
  } = useGameContext();

  // Setup screen
  if (state.phase === 'setup') {
    return <AdminPanel />;
  }

  // Win screen
  if (state.phase === 'ended') {
    return (
      <div className="winner-screen" dir="rtl">
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
          <p className="winner-message">🏆 وصل إلى النهاية!</p>
          <button onClick={resetGame} className="btn-restart">
            لعبة جديدة
          </button>
        </div>
      </div>
    );
  }

  // Main game screen
  return (
    <div className="app" dir="rtl">

      {/* Header */}
      <header className="game-header">
        <h1 className="game-title">على غيمة ☁️</h1>
        <div className="player-indicator">
          <span className="indicator-emoji">
            {state.currentTurn === 'P1' ? '☁️' : '⭐'}
          </span>
          <span className="indicator-name">
            {state.currentTurn === 'P1'
              ? state.playerNames.P1
              : state.playerNames.P2}
          </span>
        </div>
      </header>

      {/* Board */}
      <div className="game-board-section">
        <Board />
      </div>

      {/* Dice */}
      <div className="game-controls">
        <Dice />
      </div>

      {/* Question Logs — both players, always visible */}
      <div className="game-log-section">
        <QuestionLog
          questions={state.questions}
          playerNames={state.playerNames}
        />
      </div>

      {/* Question Modal — appears immediately after landing */}
      {state.phase === 'question' && state.activeQuestion && (
        <QuestionModal
          question={state.activeQuestion}
          currentPlayer={state.currentTurn}
          playerNames={state.playerNames}
          onAnswer={answerQuestion}
          onSkip={skipQuestion}
        />
      )}

    </div>
  );
}

export default App;