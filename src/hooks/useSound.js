/**
 * useSound Hook (Stub)
 * For future audio implementation
 * Currently returns no-op functions
 */

export function useSound() {
  const playSound = (soundName) => {
    // FUTURE: Implement Web Audio API or load from CDN
    console.log(`Playing sound: ${soundName}`);
  };

  return { playSound };
}
