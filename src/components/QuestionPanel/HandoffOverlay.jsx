import React from 'react';
import './HandoffOverlay.css';

/**
 * HandoffOverlay Component
 * Full-screen overlay shown between turns (phase === 'handoff')
 * Prevents players from seeing board during opponent's turn
 */

export function HandoffOverlay({ currentPlayer, onConfirm }) {
  const playerEmoji = currentPlayer === 'P1' ? '☁️' : '⭐';
  const playerLabel = currentPlayer === 'P1' ? 'اللاعب الأول' : 'اللاعب الثاني';

  return (
    <div className="handoff-overlay">
      <div className="handoff-card">
        <div className="handoff-emoji">{playerEmoji}</div>
        <h2 className="handoff-title">دور {playerLabel}</h2>
        <p className="handoff-subtitle">🎲 اضغط للبدء</p>
        <button
          onClick={onConfirm}
          className="handoff-button"
        >
          جاهز؟ اضغط للبدء
        </button>
      </div>
    </div>
  );
}
