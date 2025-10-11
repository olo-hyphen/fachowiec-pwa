/**
 * Vibration utility for haptic feedback
 * Provides consistent haptic feedback across the application
 */
export const Vibration = {
  /**
   * Light vibration for subtle feedback (10ms)
   * Use for: button taps, navigation clicks
   */
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium vibration for moderate feedback (20ms)
   * Use for: toggling switches, expanding menus
   */
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  /**
   * Heavy vibration for strong feedback (50ms)
   * Use for: important actions, warnings
   */
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  },

  /**
   * Custom vibration pattern
   * @param pattern - Array of vibration and pause durations in ms
   * Example: [50, 100, 50] = vibrate 50ms, pause 100ms, vibrate 50ms
   */
  pattern: (pattern: number[]) => {
    if ('vibrate' in navigator) {
      navigator.vibrate(pattern);
    }
  },

  /**
   * Success pattern - double light tap
   * Use for: successful operations, confirmations
   */
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  /**
   * Error pattern - long heavy vibration
   * Use for: errors, failed operations
   */
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([50, 100, 50]);
    }
  },

  /**
   * Stop all ongoing vibrations
   */
  stop: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(0);
    }
  },
};
