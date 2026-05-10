import { useEffect, useCallback } from 'react';

/**
 * useLocalStorage Hook
 * Syncs React Context state to localStorage
 * Loads initial state from localStorage on mount
 */

export function useLocalStorage(state, dispatch) {
  const STORAGE_KEYS = {
    QUESTIONS: 'ala_ghema_questions',
    GAME_STATE: 'ala_ghema_gameState',
    ADMIN_PIN: 'ala_ghema_adminPin',
  };

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const savedQuestions = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
      const savedGameState = localStorage.getItem(STORAGE_KEYS.GAME_STATE);
      const savedAdminPin = localStorage.getItem(STORAGE_KEYS.ADMIN_PIN);

      if (savedQuestions) {
        dispatch({
          type: 'SET_QUESTIONS',
          payload: JSON.parse(savedQuestions),
        });
      }

      if (savedAdminPin) {
        dispatch({
          type: 'SET_ADMIN_PIN',
          payload: savedAdminPin,
        });
      }

      if (savedGameState) {
        const parsed = JSON.parse(savedGameState);
        // Restore game state (positions, currentTurn, etc.)
        // This is a simplified restore - full implementation would merge state carefully
        if (parsed.phase !== 'setup') {
          dispatch({
            type: 'START_GAME',
            payload: { questions: JSON.parse(savedQuestions) || [] },
          });
        }
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  }, []);

  // Save questions to localStorage whenever they change
  useEffect(() => {
    try {
      if (state.questions.length > 0) {
        localStorage.setItem(
          STORAGE_KEYS.QUESTIONS,
          JSON.stringify(state.questions)
        );
      }
    } catch (error) {
      console.error('Error saving questions to localStorage:', error);
    }
  }, [state.questions]);

  // Save game state to localStorage whenever it changes
  useEffect(() => {
    try {
      const gameStateToSave = {
        currentTurn: state.currentTurn,
        positions: state.positions,
        diceValue: state.diceValue,
        phase: state.phase,
        winner: state.winner,
      };
      localStorage.setItem(
        STORAGE_KEYS.GAME_STATE,
        JSON.stringify(gameStateToSave)
      );
    } catch (error) {
      console.error('Error saving game state to localStorage:', error);
    }
  }, [
    state.currentTurn,
    state.positions,
    state.diceValue,
    state.phase,
    state.winner,
  ]);

  // Save admin PIN to localStorage
  useEffect(() => {
    try {
      if (state.adminPin) {
        localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, state.adminPin);
      }
    } catch (error) {
      console.error('Error saving admin PIN to localStorage:', error);
    }
  }, [state.adminPin]);

  // Helper functions
  const clearStorage = useCallback(() => {
    try {
      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, []);

  const getSavedState = useCallback(() => {
    try {
      return {
        questions: JSON.parse(localStorage.getItem(STORAGE_KEYS.QUESTIONS)) || [],
        gameState: JSON.parse(localStorage.getItem(STORAGE_KEYS.GAME_STATE)) || null,
        adminPin: localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || null,
      };
    } catch (error) {
      console.error('Error getting saved state from localStorage:', error);
      return { questions: [], gameState: null, adminPin: null };
    }
  }, []);

  return { clearStorage, getSavedState };
}
