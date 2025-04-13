import { useState, useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { useGesture } from '@use-gesture/react';

const Controls = ({ isRunning, mode, onStart, onStop, onLap, onReset }) => {
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
          // Swipe left - Lap (only in stopwatch mode)
          if (isRunning && mode === 'stopwatch') {
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
    const color = button.classList.contains('stop') ? '#ff4477' : 'var(--neon-color)';
    anime({
      targets: button,
      boxShadow: [
        `0 0 5px ${color}, inset 0 0 5px ${color}`,
        `0 0 15px ${color}, inset 0 0 15px ${color}`,
        `0 0 5px ${color}, inset 0 0 5px ${color}`
      ],
      textShadow: [
        `0 0 2px ${color}`,
        `0 0 8px ${color}`,
        `0 0 2px ${color}`
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
    if (isRunning && mode === 'stopwatch') {
      onLap();
    } else {
      onReset();
    }
    animateButton(lapResetRef.current);
  };
  
  // Add continuous subtle glow animation to buttons
  useEffect(() => {
    const startStopButton = startStopRef.current;
    const lapResetButton = lapResetRef.current;
    
    if (startStopButton && lapResetButton) {
      // Continuous subtle pulsing glow for buttons
      const pulseAnimation = anime({
        targets: [startStopButton, lapResetButton],
        boxShadow: [
          '0 0 5px var(--neon-color), inset 0 0 5px var(--neon-color)',
          '0 0 8px var(--neon-color), inset 0 0 8px var(--neon-color)',
          '0 0 5px var(--neon-color), inset 0 0 5px var(--neon-color)'
        ],
        duration: 2000,
        direction: 'alternate',
        loop: true,
        easing: 'easeInOutSine',
        autoplay: true
      });
      
      // If running, make pulsing more intense for start/stop button
      if (isRunning && startStopButton) {
        const color = '#ff4477'; // Stop button color
        anime({
          targets: startStopButton,
          boxShadow: [
            `0 0 5px ${color}, inset 0 0 5px ${color}`,
            `0 0 10px ${color}, inset 0 0 10px ${color}`,
            `0 0 5px ${color}, inset 0 0 5px ${color}`
          ],
          duration: 1000,
          direction: 'alternate',
          loop: true,
          easing: 'easeInOutSine',
          autoplay: true
        });
      }
      
      return () => {
        pulseAnimation.pause();
      };
    }
  }, [isRunning]);
  
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
          {isRunning && mode === 'stopwatch' ? 'LAP' : 'RESET'}
        </button>
      </div>
    </div>
  );
};

export default Controls;