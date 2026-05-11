import { shuffleArray } from './shuffle';
import { JUMP_SQUARES, IMPORTANT_SQUARES } from '../constants/board';

/**
 * Assigns questions to squares on the board.
 *
 * Rules:
 * - Important questions → assigned only to IMPORTANT_SQUARES (red squares)
 * - Normal questions → assigned to remaining non-jump, non-important squares
 * - Yellow (jump) squares never get questions assigned directly
 *   (they show the destination square's question instead)
 * - Questions are randomly shuffled before assignment
 */
export function assignQuestionsToSquares(questions) {
  const importantQuestions = shuffleArray(
    questions.filter((q) => q.isImportant)
  );
  const normalQuestions = shuffleArray(
    questions.filter((q) => !q.isImportant)
  );

  // Available red squares for important questions
  const availableImportantSquares = shuffleArray([...IMPORTANT_SQUARES]);

  // Available normal squares (exclude yellow and red)
  const allSquares = Array.from({ length: 20 }, (_, i) => i + 1);
  const availableNormalSquares = shuffleArray(
    allSquares.filter(
      (sq) => !JUMP_SQUARES.includes(sq) && !IMPORTANT_SQUARES.includes(sq)
    )
  );

  const assigned = [];

  // Assign important questions to red squares
  importantQuestions.forEach((q, i) => {
    assigned.push({
      ...q,
      squareIndex: availableImportantSquares[i] ?? null,
    });
  });

  // Assign normal questions to normal squares
  normalQuestions.forEach((q, i) => {
    assigned.push({
      ...q,
      squareIndex: availableNormalSquares[i] ?? null,
    });
  });

  return assigned;
}

/**
 * Get question for a specific square
 */
export function getQuestionForSquare(questions, squareNumber) {
  return questions.find((q) => q.squareIndex === squareNumber) || null;
}