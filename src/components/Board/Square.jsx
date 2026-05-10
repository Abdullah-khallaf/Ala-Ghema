import React from 'react';
import './Board.css';

/**
 * Square Component
 * Props:
 * - number: square number (1-20)
 * - isJump: true if yellow (jump/snake-ladder square)
 * - hasQuestion: true if question assigned to this square
 * - isImportant: true if the question is marked important (shown as danger square)
 * - isAnsweredByBoth: true if both players have answered
 * - players: array of player IDs currently on this square ['P1', 'P2']
 */
export function Square({
  number,
  isJump,
  hasQuestion,
  isImportant,
  isAnsweredByBoth,
  players,
}) {
  // Build class list
  const classes = ['square'];

  if (isJump) {
    classes.push('square-jump');
  } else if (isImportant) {
    // Important question squares look "dangerous" — visible before landing
    classes.push('square-important');
  } else if (hasQuestion && !isAnsweredByBoth) {
    classes.push('square-unanswered-question');
  }

  if (players.length > 0) {
    classes.push('square-occupied');
  }

  return (
    <div className={classes.join(' ')}>
      <div className="square-number">{number}</div>

      {/* Icon row */}
      {isJump && (
        <div className="square-question-icon">🔀</div>
      )}
      {!isJump && isImportant && !isAnsweredByBoth && (
        <div className="square-important-icon">⚠️</div>
      )}
      {!isJump && !isImportant && hasQuestion && !isAnsweredByBoth && (
        <div className="square-question-icon">❓</div>
      )}
      {!isJump && hasQuestion && isAnsweredByBoth && (
        <div className="square-answered-icon">✓</div>
      )}

      {/* Player tokens */}
      {players.length > 0 && (
        <div className="square-players">
          {players.includes('P1') && (
            <span className="square-player-token">☁️</span>
          )}
          {players.includes('P2') && (
            <span className="square-player-token">⭐</span>
          )}
        </div>
      )}
    </div>
  );
}