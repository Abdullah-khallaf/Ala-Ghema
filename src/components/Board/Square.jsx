import React from 'react';
import './Board.css';

export function Square({
  number,
  isJump,
  jumpType,
  partnerSquare,
  isImportant,
  hasQuestion,
  isAnsweredByBoth,
  players,
}) {
  const classes = ['square'];

  if (isJump) {
    classes.push('square-jump');
  } else if (isImportant) {
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

      {isJump && (
        <div className="square-jump-info">
          <span className="square-jump-arrow">
            {jumpType === 'up' ? '⬆️' : '⬇️'}
          </span>
          <span className="square-jump-partner">{partnerSquare}</span>
        </div>
      )}

      {isImportant && !isJump && (
        <div className="square-important-icon">⚠️</div>
      )}

      {!isJump && !isImportant && hasQuestion && !isAnsweredByBoth && (
        <div className="square-question-icon">❓</div>
      )}

      {hasQuestion && isAnsweredByBoth && (
        <div className="square-answered-icon">✓</div>
      )}

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