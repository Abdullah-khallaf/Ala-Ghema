import React from 'react';
import { useGameContext } from '../../context/GameContext';
import { BOARD_LAYOUT, JUMP_SQUARES } from '../../constants/board';
import { Square } from './Square';
import { PlayerToken } from '../Players/PlayerToken';
import './Board.css';

/**
 * Board Component
 * Renders a 4x5 grid (20 squares) with zigzag numbering
 * Overlays player tokens on their current positions
 */

export function Board() {
  const { state } = useGameContext();

  return (
    <div className="board-container">
      <div className="board">
        {BOARD_LAYOUT.map((row, rowIndex) =>
          row.map((squareNumber, colIndex) => {
            const isJump = JUMP_SQUARES.includes(squareNumber);
            const question = state.questions.find(
              (q) => q.squareIndex === squareNumber
            );
            const hasQuestion = !!question;
            const isAnsweredByBoth = question?.answeredBy.length >= 2;
            const playersOnSquare = [];

            if (state.positions.P1 === squareNumber) {
              playersOnSquare.push('P1');
            }
            if (state.positions.P2 === squareNumber) {
              playersOnSquare.push('P2');
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="square-wrapper"
                style={{
                  gridRow: rowIndex + 1,
                  gridColumn: colIndex + 1,
                }}
              >
                <Square
                  number={squareNumber}
                  isJump={isJump}
                  hasQuestion={hasQuestion}
                  isAnsweredByBoth={isAnsweredByBoth}
                  players={playersOnSquare}
                />
                {playersOnSquare.map((playerId) => (
                  <PlayerToken key={playerId} playerId={playerId} />
                ))}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
