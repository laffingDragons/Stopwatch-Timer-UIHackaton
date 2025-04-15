import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import { useGesture } from '@use-gesture/react';

const Controls = ({ isRunning, mode, onStart, onStop, onLap, onReset }) => {
  const buttonContainerRef = useRef(null);
  const startStopRef = useRef(null);
  const lapResetRef = useRef(null);

  useGesture(
    {
      onSwipe: ({ direction: [dx] }) => {
        if (dx > 0) {
          onReset();
          animateButton(lapResetRef.current, 'right');
        } else if (dx < 0 && isRunning && mode === 'stopwatch') {
          onLap();
          animateButton(lapResetRef.current, 'left');
        }
      },
    },
    { target: buttonContainerRef }
  );

  const animateButton = (button, direction = null) => {
    anime({
      targets: button,
      scale: [1, 0.95, 1],
      duration: 200,
      easing: 'easeInOutQuad',
    });
    if (direction) {
      anime({
        targets: button,
        translateX: [0, direction === 'left' ? -10 : 10, 0],
        duration: 200,
        easing: 'easeInOutQuad',
      });
    }
  };

  const handleStartStop = () => {
    if (isRunning) {
      onStop();
    } else {
      onStart();
    }
    animateButton(startStopRef.current);
  };

  const handleLapReset = () => {
    if (isRunning && mode === 'stopwatch') {
      onLap();
    } else {
      onReset();
    }
    animateButton(lapResetRef.current);
  };

  useEffect(() => {
    const buttons = [startStopRef.current, lapResetRef.current];
    const pulseAnimation = anime({
      targets: buttons,
      boxShadow: [
        '0 0 5px var(--neon-color)',
        '0 0 10px var(--neon-color)',
        '0 0 5px var(--neon-color)',
      ],
      duration: 1500,
      direction: 'alternate',
      loop: true,
      easing: 'easeInOutSine',
    });

    return () => pulseAnimation.pause();
  }, []);

  return (
    <div className="controls-container" ref={buttonContainerRef}>
      <div className="buttons-container">
        <button
          ref={startStopRef}
          className={`control-button start-stop-button ${isRunning ? 'stop' : 'start'}`}
          onClick={handleStartStop}
          aria-label={isRunning ? 'Stop' : 'Start'} // FIX: Accessibility
        >
          {isRunning ? 'STOP' : 'START'}
        </button>
        <button
          ref={lapResetRef}
          className="control-button lap-reset-button"
          onClick={handleLapReset}
          disabled={mode !== 'stopwatch' && isRunning} // FIX: Disable lap in timer mode
          aria-label={isRunning && mode === 'stopwatch' ? 'Lap' : 'Reset'} // FIX: Accessibility
        >
          {isRunning && mode === 'stopwatch' ? 'LAP' : 'RESET'}
        </button>
      </div>
    </div>
  );
};

export default Controls;