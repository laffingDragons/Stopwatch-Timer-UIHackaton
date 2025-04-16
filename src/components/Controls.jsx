import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

const Controls = ({
  isRunning,
  onStartStop,
  onLapReset,
  mode,
  time,
  totalTime,
  shakeEnabled,
  onShake
}) => {
  const startStopButtonRef = useRef(null);
  const lapResetButtonRef = useRef(null);

  const lapResetLabel = mode === 'stopwatch' ? (isRunning ? 'LAP' : 'RESET') : 'RESET';

  useEffect(() => {
    let lastShake = 0;

    const handleShakeEvent = (event) => {
      const acceleration = event.accelerationIncludingGravity;
      const currentTime = new Date().getTime();
      const timeDiff = currentTime - lastShake;

      if (timeDiff > 1000) {
        const shakeStrength =
          Math.abs(acceleration.x) +
          Math.abs(acceleration.y) +
          Math.abs(acceleration.z);

        if (shakeStrength > 30) {
          lastShake = currentTime;
          onShake();
        }
      }
    };

    if (shakeEnabled && window.DeviceMotionEvent) {
      window.addEventListener('devicemotion', handleShakeEvent);
    }

    return () => {
      window.removeEventListener('devicemotion', handleShakeEvent);
    };
  }, [shakeEnabled, onShake]);

  const handleButtonClick = (ref, callback) => {
    callback();
    anime({
      targets: ref.current,
      scale: [1, 0.95, 1], // Press-in effect
      duration: 200,
      easing: 'easeInOutQuad',
    });
  };

  return (
    <div className="controls-container">
      <div className="neomorphic-buttons">
        <button
          ref={startStopButtonRef}
          className={`neomorphic-button start-stop-button ${isRunning ? 'stop-button' : 'start-button'}`}
          onClick={() => handleButtonClick(startStopButtonRef, onStartStop)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleButtonClick(startStopButtonRef, onStartStop); }}
          tabIndex={0}
          aria-label={isRunning ? 'Stop Timer' : 'Start Timer'}
        >
          <span>{isRunning ? 'STOP' : 'START'}</span>
        </button>
        <button
          ref={lapResetButtonRef}
          className={`neomorphic-button lap-reset-button ${lapResetLabel.toLowerCase()}-button`}
          onClick={() => handleButtonClick(lapResetButtonRef, onLapReset)}
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleButtonClick(lapResetButtonRef, onLapReset); }}
          tabIndex={0}
          aria-label={lapResetLabel}
        >
          <span>{lapResetLabel}</span>
        </button>
      </div>
    </div>
  );
};

export default Controls;