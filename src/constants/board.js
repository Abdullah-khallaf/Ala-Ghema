/**
 * Board Layout — 4 columns × 5 rows = 20 squares
 * Zigzag numbering bottom-to-top
 *
 * Column positions:
 * Row 1 (bottom): sq1=c1  sq2=c2  sq3=c3  sq4=c4
 * Row 2:          sq8=c1  sq7=c2  sq6=c3  sq5=c4
 * Row 3:          sq9=c1  sq10=c2 sq11=c3 sq12=c4
 * Row 4:          sq16=c1 sq15=c2 sq14=c3 sq13=c4
 * Row 5 (top):    sq17=c1 sq18=c2 sq19=c3 sq20=c4
 */
export const BOARD_LAYOUT = [
  [17, 18, 19, 20], // row 5 (top)
  [16, 15, 14, 13], // row 4
  [9,  10, 11, 12], // row 3
  [8,   7,  6,  5], // row 2
  [1,   2,  3,  4], // row 1 (bottom)
];

/**
 * YELLOW SQUARES — 2 ladder pairs = 4 yellow squares total
 *
 * Why only 2 pairs? 5 rows is an odd number — you cannot have
 * one yellow per row AND have every yellow paired, since pairs
 * need 2 squares. So: 2 pairs cover rows 1,2,3,4. Row 5 has no yellow.
 *
 * Pair 1: sq3(row1,c3) ↔ sq5(row2,c4)   col diff=1 ✓ diagonal ✓
 * Pair 2: sq11(row3,c3) ↔ sq15(row4,c2)  col diff=1 ✓ diagonal ✓
 *
 * No row has two yellows ✓  No overlap with red squares ✓
 */
export const JUMP_PAIRS = [
  { from: 3,  to: 5  }, // row1(c3) ↔ row2(c4): land on sq3 → go up to sq5, land on sq5 → go down to sq3
  { from: 11, to: 15 }, // row3(c3) ↔ row4(c2): land on sq11 → go up to sq15, land on sq15 → go down to sq11
];

// Exactly 4 yellow squares: [3, 5, 11, 15]
export const JUMP_SQUARES = JUMP_PAIRS.flatMap((p) => [p.from, p.to]);

/**
 * RED SQUARES — 5 important question squares, one per row
 *
 * Row 1: sq2  (c2) — yellow in row1 is sq3  ✓
 * Row 2: sq8  (c1) — yellow in row2 is sq5  ✓
 * Row 3: sq10 (c2) — yellow in row3 is sq11 ✓
 * Row 4: sq13 (c4) — yellow in row4 is sq15 ✓
 * Row 5: sq18 (c2) — no yellow in row5      ✓
 */
export const IMPORTANT_SQUARES = [2, 8, 10, 13, 18];

// Bidirectional jump target
export function getJumpTarget(squareNumber) {
  const pair = JUMP_PAIRS.find(
    (p) => p.from === squareNumber || p.to === squareNumber
  );
  if (!pair) return null;
  return pair.from === squareNumber ? pair.to : pair.from;
}

// 'up' if landing on bottom of ladder, 'down' if landing on top
export function getJumpType(squareNumber) {
  const pair = JUMP_PAIRS.find(
    (p) => p.from === squareNumber || p.to === squareNumber
  );
  if (!pair) return null;
  return pair.from === squareNumber ? 'up' : 'down';
}

export function isJumpSquare(squareNumber) {
  return JUMP_SQUARES.includes(squareNumber);
}

export function isImportantSquare(squareNumber) {
  return IMPORTANT_SQUARES.includes(squareNumber);
}

// Normal squares only (no yellow, no red) — for regular question assignment
export function getAvailableQuestionSquares() {
  const allSquares = Array.from({ length: 20 }, (_, i) => i + 1);
  return allSquares.filter(
    (sq) => !JUMP_SQUARES.includes(sq) && !IMPORTANT_SQUARES.includes(sq)
  );
}