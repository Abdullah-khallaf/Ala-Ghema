import { JUMP_SQUARES } from '../constants/board';
import { shuffleArray } from './shuffle';

/**
 * Board Helper Functions
 */

/**
 * Assign questions to random non-jump squares
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Questions with squareIndex assigned
 */
export function assignQuestionsToSquares(questions) {
  const availableSquares = Array.from({ length: 20 }, (_, i) => i + 1).filter(
    (sq) => !JUMP_SQUARES.includes(sq)
  );

  const shuffledSquares = shuffleArray([...availableSquares]);

  return questions.map((question, index) => ({
    ...question,
    squareIndex: shuffledSquares[index] || null,
  }));
}

/**
 * Get question at a specific square
 * @param {number} squareIndex - Square number (1-20)
 * @param {Array} questions - Array of question objects
 * @returns {Object|null} - Question object or null
 */
export function getQuestionAtSquare(squareIndex, questions) {
  return (
    questions.find((q) => q.squareIndex === squareIndex) || null
  );
}

/**
 * Get all questions answered by a specific player
 * @param {string} playerId - 'P1' or 'P2'
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Array of questions answered by player
 */
export function getQuestionsAnsweredByPlayer(playerId, questions) {
  return questions.filter((q) => q.answeredBy.includes(playerId));
}

/**
 * Get all questions not yet answered
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Array of unanswered questions
 */
export function getUnansweredQuestions(questions) {
  return questions.filter((q) => q.answeredBy.length === 0);
}

/**
 * Get all important questions
 * @param {Array} questions - Array of question objects
 * @returns {Array} - Array of important questions
 */
export function getImportantQuestions(questions) {
  return questions.filter((q) => q.isImportant);
}

/**
 * Check if a question has been fully answered (both players)
 * @param {Object} question - Question object
 * @returns {boolean}
 */
export function isQuestionFullyAnswered(question) {
  return question.answeredBy.length >= 2;
}

/**
 * Get board grid position for a square number
 * @param {number} squareNumber - Square number (1-20)
 * @returns {Object} - { row, col } position
 */
export function getSquarePosition(squareNumber) {
  const BOARD_LAYOUT = [
    [1, 2, 3, 4, 5],
    [10, 9, 8, 7, 6],
    [11, 12, 13, 14, 15],
    [20, 19, 18, 17, 16],
  ];

  for (let row = 0; row < BOARD_LAYOUT.length; row++) {
    for (let col = 0; col < BOARD_LAYOUT[row].length; col++) {
      if (BOARD_LAYOUT[row][col] === squareNumber) {
        return { row, col };
      }
    }
  }
  return null;
}

/**
 * Convert row/col to CSS grid position
 * @param {number} row - Row index (0-3)
 * @param {number} col - Column index (0-4)
 * @returns {Object} - { gridArea } for CSS Grid
 */
export function getGridArea(row, col) {
  // CSS Grid is 1-indexed
  const gridRow = row + 1;
  const gridCol = col + 1;
  return {
    gridArea: `${gridRow} / ${gridCol}`,
  };
}
