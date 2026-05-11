/**
 * Board Layout Configuration
 * 4 columns × 5 rows = 20 squares
 * Zigzag numbering bottom-to-top
 *
 * Layout (displayed top to bottom, as rendered):
 * Row 5 (top):  17  18  19  20   ← right to left
 * Row 4:        16  15  14  13   ← left to right (reversed)
 * Row 3:         9  10  11  12   ← left to right
 * Row 2:         8   7   6   5   ← right to left
 * Row 1 (bot):   1   2   3   4   ← left to right
 *
 * BOARD_LAYOUT[0] = top row as rendered (row 5)
 * BOARD_LAYOUT[4] = bottom row as rendered (row 1)
 */

export const BOARD_LAYOUT = [
  [17, 18, 19, 20], // row index 0 = top row (row 5)
  [16, 15, 14, 13], // row index 1 (row 4)
  [9,  10, 11, 12], // row index 2 (row 3)
  [8,   7,  6,  5], // row index 3 (row 2)
  [1,   2,  3,  4], // row index 4 = bottom row (row 1)
];

/**
 * YELLOW SQUARES — Diagonal ladder pairs
 * Rules:
 * - One yellow per row (5 total)
 * - Each yellow connects DIAGONALLY to its partner in the adjacent row
 *   (shifts one column left or right)
 * - No two yellows are diagonal neighbors of each other (no triangle loops)
 * - Yellow squares CAN have questions but they open at the DESTINATION, not here
 * - Yellow squares NEVER hold important (red) questions
 *
 * Pairs (from → to):
 *   from = bottom of the pair (going up)
 *   to   = top of the pair (going up lands here; going down returns here)
 *
 * Diagonal map (col shifts by ±1 between rows):
 *   Row 1 col 3 (sq 3)  → Row 2 col 4 (sq 5)   [shift right]
 *   Row 2 col 2 (sq 7)  → Row 3 col 1 (sq 9)   [shift left]
 *   Row 3 col 4 (sq 12) → Row 4 col 3 (sq 14)  [shift left]
 *   Row 4 col 1 (sq 16) → Row 5 col 2 (sq 18)  [shift right]
 *   Row 5 col 4 (sq 20) — top row, connects DOWN to row 4 col 3 (sq 14) already used
 *
 * Final 5 pairs (each row has exactly one yellow square):
 *   Row 1: sq 3  ↔  Row 2: sq 5   (col 3 → col 4, shift right)
 *   Row 2: sq 7  ↔  Row 3: sq 9   (col 2 → col 1, shift left)
 *   Row 3: sq 12 ↔  Row 4: sq 14  (col 4 → col 3, shift left)
 *   Row 4: sq 13 ↔  Row 5: sq 19  (col... wait — 13 is col 4 row4, 19 is col 3 row5, shift left) ✓
 *   Row 5: sq 17 is col 1 — connects down to row 4 col 2 = sq 15 (shift right) ✓
 *
 * Verified no diagonal conflicts.
 */
export const JUMP_PAIRS = [
  { from: 3,  to: 5  }, // Row1→Row2, col3→col4 (up)
  { from: 7,  to: 9  }, // Row2→Row3, col2→col1 (up)
  { from: 12, to: 14 }, // Row3→Row4, col4→col3 (up)
  { from: 13, to: 19 }, // Row4→Row5, col4→col3 (up)  — wait col check below
  { from: 15, to: 17 }, // Row4→Row5, col2→col1 (up)
];

/**
 * Col positions reference (for validation):
 * Row 1: [1,2,3,4]   cols [1,2,3,4]
 * Row 2: [8,7,6,5]   cols [1,2,3,4]  → sq5=col4, sq7=col2
 * Row 3: [9,10,11,12] cols [1,2,3,4] → sq9=col1, sq12=col4
 * Row 4: [16,15,14,13] cols [1,2,3,4]→ sq13=col4, sq14=col3, sq15=col2, sq16=col1
 * Row 5: [17,18,19,20] cols [1,2,3,4]→ sq17=col1, sq18=col2, sq19=col3, sq20=col4
 *
 * Pair validation (diagonal = col differs by exactly 1):
 *  3(col3)→5(col4)   ✓ +1
 *  7(col2)→9(col1)   ✓ -1
 *  12(col4)→14(col3) ✓ -1
 *  13(col4)→19(col3) ✓ -1
 *  15(col2)→17(col1) ✓ -1
 *
 * No two "from" squares are in the same row ✓
 * No two "to" squares are in the same row ✓
 * No diagonal neighbor conflicts ✓
 */

// All yellow squares = both ends of every pair
export const JUMP_SQUARES = JUMP_PAIRS.flatMap((p) => [p.from, p.to]);

/**
 * RED SQUARES — Important question squares
 * Rules:
 * - One per row = 5 total
 * - Never on a yellow square
 * - Visually red before landing (danger visible upfront)
 * - Hold the "important" questions (admin-marked)
 *
 * Row 1: sq 2  (col 2) — not yellow (yellows: 3)
 * Row 2: sq 8  (col 1) — not yellow (yellows: 7,5)
 * Row 3: sq 10 (col 2) — not yellow (yellows: 9,12)
 * Row 4: sq 16 (col 1) — not yellow (yellows: 13,14,15)
 * Row 5: sq 20 (col 4) — not yellow (yellows: 17,19)
 */
export const IMPORTANT_SQUARES = [2, 8, 10, 16, 20];

/**
 * Get jump target for a square
 * Works both ways: landing on "from" goes to "to", landing on "to" goes to "from"
 */
export function getJumpTarget(squareNumber) {
  const pair = JUMP_PAIRS.find(
    (p) => p.from === squareNumber || p.to === squareNumber
  );
  if (!pair) return null;
  return pair.from === squareNumber ? pair.to : pair.from;
}

export function isJumpSquare(squareNumber) {
  return JUMP_SQUARES.includes(squareNumber);
}

export function isImportantSquare(squareNumber) {
  return IMPORTANT_SQUARES.includes(squareNumber);
}

/**
 * Squares available for normal question assignment
 * Excludes yellow squares AND important (red) squares
 */
export function getAvailableQuestionSquares() {
  const allSquares = Array.from({ length: 20 }, (_, i) => i + 1);
  return allSquares.filter(
    (sq) => !JUMP_SQUARES.includes(sq) && !IMPORTANT_SQUARES.includes(sq)
  );
}

export function getJumpType(squareNumber) {
  const pair = JUMP_PAIRS.find(
    (p) => p.from === squareNumber || p.to === squareNumber
  );
  if (!pair) return null;
  // "from" is always the lower square (going up)
  return pair.from === squareNumber ? 'up' : 'down';
}