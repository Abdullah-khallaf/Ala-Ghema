import { useState, useCallback } from 'react';

/**
 * useDice Hook
 * Handles dice rolling logic and animation
 * Returns: { roll, value, isRolling }
 */

export function useDice() {
  const [value, setValue] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  const roll = useCallback(async () => {
    if (isRolling) return;

    setIsRolling(true);
    setValue(null);

    // Simulate dice rolling animation (0.5s)
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Generate random 1-6
    const randomValue = Math.floor(Math.random() * 6) + 1;
    setValue(randomValue);
    setIsRolling(false);

    return randomValue;
  }, [isRolling]);

  return { roll, value, isRolling };
}
