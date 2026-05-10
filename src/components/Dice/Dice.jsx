import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { useDice } from '../../hooks/useDice';
import './Dice.css';

/**
 * Dice Component
 * Allows current player to roll the dice
 * Shows last rolled value
 * Disabled during: another turn, question phase, rolling
 */

export function Dice() {
  const { state, rollDice, moveToken } = useGameContext();
  const { roll, value, isRolling } = useDice();

  const isCurrentPlayerTurn =
    state.phase === 'playing' &&
    !isRolling &&
    state.diceValue === null;

  const handleRoll = async () => {
    if (!isCurrentPlayerTurn || isRolling) return;

    const rolledValue = await roll();
    if (rolledValue) {
      rollDice(rolledValue);

      // Calculate new position
      const currentPosition = state.positions[state.currentTurn];
      const newPosition = Math.min(
        currentPosition + rolledValue,
        20
      );

      // Move token
      setTimeout(() => {
        moveToken(newPosition);
      }, 500);
    }
  };

  return (
    <div className="dice-container">
      <button
        onClick={handleRoll}
        disabled={!isCurrentPlayerTurn}
        className={`dice-button ${isRolling ? 'rolling' : ''}`}
      >
        <span className="dice-emoji">🎲</span>
      </button>

      {value && (
        <div className="dice-result">
          <p>آخر نتيجة: <strong>{value}</strong></p>
        </div>
      )}

      {isRolling && (
        <div className="dice-rolling">جاري الرمي...</div>
      )}
    </div>
  );
}
