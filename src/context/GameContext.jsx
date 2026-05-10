import React, { createContext, useReducer, useCallback, useEffect } from 'react';

/**
 * Game State Context
 * FUTURE: Replace localStorage with API calls to /api/gameState
 * FUTURE: Replace currentTurn logic with WebSocket events
 */

export const GameContext = createContext();

const STORAGE_KEY_STATE = 'ala_ghema_gameState';
const STORAGE_KEY_QUESTIONS = 'ala_ghema_questions';

const initialState = {
  currentTurn: 'P1',
  positions: { P1: 0, P2: 0 },
  diceValue: null,
  phase: 'setup',         // 'setup' | 'playing' | 'question' | 'ended'
  activeQuestion: null,
  questions: [],
  winner: null,
  playerNames: {
    P1: 'اللاعب الأول',
    P2: 'اللاعب الثاني',
  },
};

function gameReducer(state, action) {
  switch (action.type) {

    case 'RESTORE_STATE':
      return { ...action.payload };

    case 'SET_PLAYER_NAMES':
      return { ...state, playerNames: action.payload };

    case 'SET_QUESTIONS':
      return { ...state, questions: action.payload };

    case 'START_GAME':
      return {
        ...state,
        questions: action.payload.questions,
        phase: 'playing',
        currentTurn: 'P1',
        positions: { P1: 0, P2: 0 },
        diceValue: null,
        activeQuestion: null,
        winner: null,
      };

    case 'ROLL_DICE':
      return { ...state, diceValue: action.payload };

    case 'MOVE_TOKEN': {
      // Movement: player moves to the dice number DIRECTLY from position 0
      // (i.e. first roll of 4 = square 4, not cumulative)
      // FUTURE: switch to cumulative if game rules change
      const newPositions = { ...state.positions };
      newPositions[state.currentTurn] = action.payload.newSquare;

      // Check for win
      if (action.payload.newSquare === 20) {
        return {
          ...state,
          positions: newPositions,
          phase: 'ended',
          winner: state.currentTurn,
          diceValue: null,
          activeQuestion: null,
        };
      }

      // Check if landed on a question square
      const landedQuestion = state.questions.find(
        (q) => q.squareIndex === action.payload.newSquare
      );

      if (landedQuestion) {
        const alreadyAnsweredByThisPlayer = landedQuestion.answeredBy.includes(state.currentTurn);
        const bothAnswered = landedQuestion.answeredBy.length >= 2;

        if (!alreadyAnsweredByThisPlayer && !bothAnswered) {
          // Show question modal
          return {
            ...state,
            positions: newPositions,
            phase: 'question',
            activeQuestion: landedQuestion,
            diceValue: null,
          };
        }
      }

      // No question, or already answered — pass turn immediately
      return {
        ...state,
        positions: newPositions,
        phase: 'playing',
        activeQuestion: null,
        diceValue: null,
        currentTurn: state.currentTurn === 'P1' ? 'P2' : 'P1',
      };
    }

    case 'APPLY_JUMP': {
      const jumpPositions = { ...state.positions };
      jumpPositions[state.currentTurn] = action.payload.targetSquare;

      // After jump, check if the new square also has a question
      const jumpLandedQuestion = state.questions.find(
        (q) => q.squareIndex === action.payload.targetSquare
      );

      if (jumpLandedQuestion) {
        const alreadyAnswered = jumpLandedQuestion.answeredBy.includes(state.currentTurn);
        const bothAnswered = jumpLandedQuestion.answeredBy.length >= 2;

        if (!alreadyAnswered && !bothAnswered) {
          return {
            ...state,
            positions: jumpPositions,
            phase: 'question',
            activeQuestion: jumpLandedQuestion,
            diceValue: null,
          };
        }
      }

      return {
        ...state,
        positions: jumpPositions,
        phase: 'playing',
        diceValue: null,
      };
    }

    case 'ANSWER_QUESTION': {
      const updatedQuestions = state.questions.map((q) => {
        if (q.id === state.activeQuestion.id) {
          return {
            ...q,
            answeredBy: [...q.answeredBy, state.currentTurn],
            playerActions: [
              ...(q.playerActions || []),
              { player: state.currentTurn, action: 'answered', timestamp: Date.now() },
            ],
          };
        }
        return q;
      });

      return {
        ...state,
        questions: updatedQuestions,
        activeQuestion: null,
        phase: 'playing',
        currentTurn: state.currentTurn === 'P1' ? 'P2' : 'P1',
        diceValue: null,
      };
    }

    case 'SKIP_QUESTION': {
      // Skip does NOT add to answeredBy — question stays available
      const updatedQuestions = state.questions.map((q) => {
        if (q.id === state.activeQuestion.id) {
          return {
            ...q,
            playerActions: [
              ...(q.playerActions || []),
              { player: state.currentTurn, action: 'skipped', timestamp: Date.now() },
            ],
          };
        }
        return q;
      });

      return {
        ...state,
        questions: updatedQuestions,
        activeQuestion: null,
        phase: 'playing',
        currentTurn: state.currentTurn === 'P1' ? 'P2' : 'P1',
        diceValue: null,
      };
    }

    case 'PASS_TURN':
      return {
        ...state,
        activeQuestion: null,
        phase: 'playing',
        currentTurn: state.currentTurn === 'P1' ? 'P2' : 'P1',
        diceValue: null,
      };

    case 'RESET_GAME':
      localStorage.removeItem(STORAGE_KEY_STATE);
      localStorage.removeItem(STORAGE_KEY_QUESTIONS);
      return initialState;

    default:
      return state;
  }
}

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Restore state from localStorage on first load
  useEffect(() => {
    try {
      const savedState = localStorage.getItem(STORAGE_KEY_STATE);
      const savedQuestions = localStorage.getItem(STORAGE_KEY_QUESTIONS);
      if (savedState) {
        const parsed = JSON.parse(savedState);
        if (savedQuestions) {
          parsed.questions = JSON.parse(savedQuestions);
        }
        // Only restore if mid-game (not setup or ended)
        if (parsed.phase === 'playing' || parsed.phase === 'question') {
          dispatch({ type: 'RESTORE_STATE', payload: parsed });
        }
      }
    } catch (e) {
      console.error('Failed to restore game state:', e);
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    if (state.phase !== 'setup') {
      try {
        const { questions, ...stateWithoutQuestions } = state;
        localStorage.setItem(STORAGE_KEY_STATE, JSON.stringify(stateWithoutQuestions));
        localStorage.setItem(STORAGE_KEY_QUESTIONS, JSON.stringify(questions));
      } catch (e) {
        console.error('Failed to save game state:', e);
      }
    }
  }, [state]);

  // Action creators
  const setPlayerNames = useCallback((names) => {
    dispatch({ type: 'SET_PLAYER_NAMES', payload: names });
  }, []);

  const setQuestions = useCallback((questions) => {
    dispatch({ type: 'SET_QUESTIONS', payload: questions });
  }, []);

  const startGame = useCallback((questions) => {
    dispatch({ type: 'START_GAME', payload: { questions } });
  }, []);

  const rollDice = useCallback((value) => {
    dispatch({ type: 'ROLL_DICE', payload: value });
  }, []);

  const moveToken = useCallback((newSquare) => {
    dispatch({ type: 'MOVE_TOKEN', payload: { newSquare } });
  }, []);

  const applyJump = useCallback((targetSquare) => {
    dispatch({ type: 'APPLY_JUMP', payload: { targetSquare } });
  }, []);

  const answerQuestion = useCallback(() => {
    dispatch({ type: 'ANSWER_QUESTION' });
  }, []);

  const skipQuestion = useCallback(() => {
    dispatch({ type: 'SKIP_QUESTION' });
  }, []);

  const passTurn = useCallback(() => {
    dispatch({ type: 'PASS_TURN' });
  }, []);

  const resetGame = useCallback(() => {
    dispatch({ type: 'RESET_GAME' });
  }, []);

  const value = {
    state,
    setPlayerNames,
    setQuestions,
    startGame,
    rollDice,
    moveToken,
    applyJump,
    answerQuestion,
    skipQuestion,
    passTurn,
    resetGame,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = React.useContext(GameContext);
  if (!context) {
    throw new Error('useGameContext must be used within GameProvider');
  }
  return context;
}