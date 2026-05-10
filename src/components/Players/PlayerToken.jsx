import React from 'react';
import './PlayerToken.css';

/**
 * PlayerToken Component
 * Displays a player token (emoji) at their current board position
 * P1 = ☁️ (Cloud), P2 = ⭐ (Star)
 */

export function PlayerToken({ playerId }) {
  const token = playerId === 'P1' ? '☁️' : '⭐';
  const playerClass = playerId === 'P1' ? 'player-1' : 'player-2';

  return (
    <div className={`player-token ${playerClass}`}>
      {token}
    </div>
  );
}
