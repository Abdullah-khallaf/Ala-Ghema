import React from 'react';
import './QuestionPanel.css';

/**
 * QuestionModal Component
 * Displays when a player lands on a question square
 * Shows question text and Answer/Skip buttons
 */

export function QuestionModal({
  question,
  currentPlayer,
  onAnswer,
  onSkip,
}) {
  const playerEmoji = currentPlayer === 'P1' ? '☁️' : '⭐';
  const playerLabel = currentPlayer === 'P1' ? 'اللاعب الأول' : 'اللاعب الثاني';

  return (
    <div className="question-modal-overlay">
      <div className="question-modal">
        <div className="question-header">
          <h2>سؤال جديد {playerEmoji}</h2>
          <p className="question-player">{playerLabel}</p>
        </div>

        <div className="question-body">
          <p className="question-text">{question.text}</p>
        </div>

        <div className="question-footer">
          <button onClick={onAnswer} className="btn-answer">
            تم الإجابة ✓
          </button>
          <button onClick={onSkip} className="btn-skip">
            تخطى
          </button>
        </div>
      </div>
    </div>
  );
}
