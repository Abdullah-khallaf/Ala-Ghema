/**
 * Board Layout Configuration
 * Game board: 4x5 grid (20 squares total)
 * Numbering: zigzag pattern (bottom-to-top, alternating left-to-right and right-to-left)
 */

// Board grid layout with numbering pattern
export const BOARD_LAYOUT = [
  [1, 2, 3, 4, 5],        // row 0 (bottom) - left to right
  [10, 9, 8, 7, 6],       // row 1 - right to left
  [11, 12, 13, 14, 15],   // row 2 - left to right
  [20, 19, 18, 17, 16],   // row 3 (top) - right to left
];

// Snake/Ladder pairs: { from: squareNumber, to: squareNumber }
// Admin can customize these in a future version. Hardcoded 4-6 pairs for now.
export const JUMP_PAIRS = [
  { from: 3, to: 16 },    // ladder up
  { from: 18, to: 5 },    // snake down
  { from: 10, to: 20 },   // ladder up
  { from: 14, to: 7 },    // snake down
  { from: 2, to: 12 },    // ladder up
  { from: 17, to: 6 },    // snake down
];

// Extract all yellow squares (jump squares)
export const JUMP_SQUARES = JUMP_PAIRS.map((pair) => pair.from);

/**
 * Helper: Get the target square for a jump (snake or ladder)
 * @param {number} squareNumber - Current square position
 * @returns {number|null} - Target square if it's a jump square, otherwise null
 */
export function getJumpTarget(squareNumber) {
  const pair = JUMP_PAIRS.find((p) => p.from === squareNumber);
  return pair ? pair.to : null;
}

/**
 * Helper: Check if a square is a jump square
 * @param {number} squareNumber - Square to check
 * @returns {boolean}
 */
export function isJumpSquare(squareNumber) {
  return JUMP_SQUARES.includes(squareNumber);
}

/**
 * Helper: Get all available squares (excluding jump squares for question assignment)
 * @returns {number[]} - Array of non-jump square numbers
 */
export function getAvailableQuestionSquares() {
  const allSquares = Array.from({ length: 20 }, (_, i) => i + 1);
  return allSquares.filter((sq) => !JUMP_SQUARES.includes(sq));
}

/**
 * Helper: Determine if landing causes a jump and direction
 * @param {number} squareNumber - Square being landed on
 * @returns {string|null} - "up" for ladder, "down" for snake, null if not a jump
 */
export function getJumpType(squareNumber) {
  const pair = JUMP_PAIRS.find((p) => p.from === squareNumber);
  if (!pair) return null;
  return pair.to > pair.from ? "up" : "down";
}
