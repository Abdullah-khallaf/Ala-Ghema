import React from 'react';
import { useGameContext } from '../../context/GameContext';
import {
  BOARD_LAYOUT,
  JUMP_SQUARES,
  IMPORTANT_SQUARES,
  JUMP_PAIRS,
  getJumpType,
} from '../../constants/board';
import { Square } from './Square';
import './Board.css';

/**
 * Board Component
 * 4 columns × 5 rows = 20 squares
 * Zigzag numbering, bottom-to-top
 */
export function Board() {
  const { state } = useGameContext();

  return (
    <div className="board-container">
      <div className="board">
        {BOARD_LAYOUT.map((row, rowIndex) =>
          row.map((squareNumber, colIndex) => {
            const isJump = JUMP_SQUARES.includes(squareNumber);
            const isImportant = IMPORTANT_SQUARES.includes(squareNumber);

            // Find question on this square
            const question = state.questions.find(
              (q) => q.squareIndex === squareNumber
            );
            const hasQuestion = !!question;
            const isAnsweredByBoth =
              question?.answeredBy.length >= 2;

            // Players on this square
            const playersOnSquare = [];
            if (state.positions.P1 === squareNumber) playersOnSquare.push('P1');
            if (state.positions.P2 === squareNumber) playersOnSquare.push('P2');

            // Jump direction label for yellow squares
            const jumpType = isJump ? getJumpType(squareNumber) : null;

            // Find partner square for yellow
            const jumpPair = JUMP_PAIRS.find(
              (p) => p.from === squareNumber || p.to === squareNumber
            );
            const partnerSquare = jumpPair
              ? jumpPair.from === squareNumber
                ? jumpPair.to
                : jumpPair.from
              : null;

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
                  jumpType={jumpType}
                  partnerSquare={partnerSquare}
                  isImportant={isImportant}
                  hasQuestion={hasQuestion}
                  isAnsweredByBoth={isAnsweredByBoth}
                  players={playersOnSquare}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}