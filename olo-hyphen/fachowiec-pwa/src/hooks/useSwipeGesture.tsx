import { useRef, useState, TouchEvent } from 'react';

interface SwipeConfig {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number; // minimum distance for swipe (default 50px)
  velocityThreshold?: number; // minimum velocity for swipe (default 0.3)
}

interface SwipeState {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  startTime: number;
}

/**
 * Hook for handling swipe gestures on touch devices
 * Supports all four directions: left, right, up, down
 * 
 * @example
 * const { handlers, isSwiping } = useSwipeGesture({
 *   onSwipeLeft: () => console.log('Swiped left'),
 *   onSwipeRight: () => console.log('Swiped right'),
 *   threshold: 50,
 * });
 * 
 * <div {...handlers}>Swipe me!</div>
 */
export function useSwipeGesture(config: SwipeConfig) {
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);
  const touchEndX = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const touchStartTime = useRef<number>(0);
  const [isSwiping, setIsSwiping] = useState(false);

  const threshold = config.threshold || 50;
  const velocityThreshold = config.velocityThreshold || 0.3;

  const handleTouchStart = (e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    touchStartTime.current = Date.now();
    setIsSwiping(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    
    const deltaX = touchEndX.current - touchStartX.current;
    const deltaY = touchEndY.current - touchStartY.current;
    const deltaTime = Date.now() - touchStartTime.current;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Calculate velocity (pixels per ms)
    const velocityX = absX / deltaTime;
    const velocityY = absY / deltaTime;

    // Horizontal swipe (more X movement than Y)
    if (absX > absY && absX > threshold && velocityX > velocityThreshold) {
      if (deltaX > 0 && config.onSwipeRight) {
        config.onSwipeRight();
      } else if (deltaX < 0 && config.onSwipeLeft) {
        config.onSwipeLeft();
      }
    }

    // Vertical swipe (more Y movement than X)
    if (absY > absX && absY > threshold && velocityY > velocityThreshold) {
      if (deltaY > 0 && config.onSwipeDown) {
        config.onSwipeDown();
      } else if (deltaY < 0 && config.onSwipeUp) {
        config.onSwipeUp();
      }
    }
  };

  return {
    handlers: {
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
    isSwiping,
  };
}
