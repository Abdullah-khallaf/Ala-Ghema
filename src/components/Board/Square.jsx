import React from 'react';
import './Board.css';

/**
 * Square Component
 * Represents a single board square
 * Props:
 * - number: square number (1-20)
 * - isJump: true if yellow (jump square)
 * - hasQuestion: true if question on this square
 * - isAnsweredByBoth: true if both players answered
 * - players: array of player IDs on this square
 */

export function Square({
  number,
  isJump,
  hasQuestion,
  isAnsweredByBoth,
  players,
}) {
  let squareClass = 'square';

  if (isJump) {
    squareClass += ' square-jump';
  }

  if (hasQuestion && !isAnsweredByBoth) {
    squareClass += ' square-unanswered-question';
  }

  if (players.length > 0) {
    squareClass += ' square-occupied';
  }

  return (
    <div className={squareClass}>
      <div className="square-number">{number}</div>

      {hasQuestion && !isAnsweredByBoth && (
        <div className="square-question-icon">❓</div>
      )}

      {isAnsweredByBoth && (
        <div className="square-answered-icon">✓</div>
      )}
    </div>
  );
}
