import { useCallback, useRef } from 'react';

// Custom hook to handle touch events and prevent double-click issues
export const useTouchHandler = () => {
  const touchHandledRef = useRef(false);
  const lastTouchTime = useRef(0);
  const touchTimeout = useRef(null);

  const handleSingleTouch = useCallback((callback) => {
    return (event) => {
      // Prevent double touches
      const now = Date.now();
      if (now - lastTouchTime.current < 300) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      lastTouchTime.current = now;

      // Clear any existing timeout
      if (touchTimeout.current) {
        clearTimeout(touchTimeout.current);
      }

      // Handle touch/click properly
      if (event.type === 'touchstart') {
        if (touchHandledRef.current) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        touchHandledRef.current = true;
        
        // Clear the flag after a delay
        touchTimeout.current = setTimeout(() => {
          touchHandledRef.current = false;
        }, 300);
        
        event.preventDefault();
        event.stopPropagation();
        
        if (callback) {
          callback(event);
        }
      } else if (event.type === 'click') {
        // Only handle click if it wasn't preceded by a touch
        if (!touchHandledRef.current) {
          if (callback) {
            callback(event);
          }
        }
      }
    };
  }, []);

  return { handleSingleTouch };
};

export default useTouchHandler;