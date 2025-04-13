import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';
import { useGesture } from '@use-gesture/react';

const Controls = ({ isRunning, onStart, onStop, onLap, onReset }) => {
  const buttonContainerRef = useRef(null);
  const startStopRef = useRef(null);
  const lapResetRef = useRef(null);
  
  // Set up gesture handlers for mobile swipes
  useGesture(
    {
      onSwipe: ({ direction: [dx] }) => {
        if (dx > 0) {
          // Swipe right - Reset
          onReset();
          animateButton(lapResetRef.current, 'right');
        } else if (dx < 0) {
          // Swipe left - Lap
          if (isRunning) {
            onLap();
            animateButton(lapResetRef.current, 'left');
          }
        }
      }
    },
    { target: buttonContainerRef, enabled: true }
  );
  
  // Function to animate button press
  const animateButton = (button, direction = null) => {
    // Basic press animation
    anime({
      targets: button,
      scale: [1, 0.95, 1],
      duration: 300,
      easing: 'easeInOutQuad'
    });
    
    // Direction-based animation for swipe gestures
    if (direction) {
      const translateX = direction === 'left' ? -10 : 10;
      anime({
        targets: button,
        translateX: [0, translateX, 0],
        duration: 300,
        easing: 'easeInOutQuad'
      });
    }
    
    // Glow effect animation
    anime({
      targets: button,
      boxShadow: [
        '0 0 5px var(--neon-color)',
        '0 0 20px var(--neon-color)',
        '0 0 5px var(--neon-color)'
      ],
      duration: 300,
      easing: 'easeInOutQuad'
    });
  };
  
  // Handle Start/Stop button click
  const handleStartStop = () => {
    if (isRunning) {
      onStop();
    } else {
      onStart();
    }
    animateButton(startStopRef.current);
  };
  
  // Handle Lap/Reset button click
  const handleLapReset = () => {
    if (isRunning) {
      onLap();
    } else {
      onReset();
    }
    animateButton(lapResetRef.current);
  };
  
  return (
    <div className="controls-container" ref={buttonContainerRef}>
      <div className="buttons-container">
        <button
          ref={startStopRef}
          className={`control-button start-stop-button ${isRunning ? 'stop' : 'start'}`}
          onClick={handleStartStop}
        >
          {isRunning ? 'STOP' : 'START'}
        </button>
        
        <button
          ref={lapResetRef}
          className="control-button lap-reset-button"
          onClick={handleLapReset}
        >
          {isRunning ? 'LAP' : 'RESET'}
        </button>
      </div>
    </div>
  );
};

export default Controls;