import { useState, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';

const TimerInput = ({ presetTime, onTimeChange, soundEnabled }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(Math.floor(presetTime / 60000));
  const [seconds, setSeconds] = useState(Math.floor((presetTime % 60000) / 1000));

  useEffect(() => {
    setHours(Math.floor(presetTime / 3600000));
    setMinutes(Math.floor((presetTime % 3600000) / 60000));
    setSeconds(Math.floor((presetTime % 60000) / 1000));
  }, [presetTime]);

  useEffect(() => {
    const newTime = hours * 3600000 + minutes * 60000 + seconds * 1000;
    if (newTime >= 0 && newTime <= 23 * 3600000 + 59 * 60000 + 59 * 1000) { // FIX: Validate input
      onTimeChange(newTime);
    }
  }, [hours, minutes, seconds, onTimeChange]);

  const playTickSound = () => {
    if (soundEnabled) {
      const tickSound = new Audio('/sounds/tick.mp3');
      tickSound.volume = 0.3;
      tickSound.play().catch((e) => console.error('Error playing sound:', e));
    }
  };

  const increment = (setter, value, max) => {
    setter((prev) => {
      const newValue = Math.min(max, prev + 1);
      playTickSound();
      anime({
        targets: '.time-input-field',
        scale: [1, 1.05, 1],
        duration: 200,
        easing: 'easeInOutQuad',
      });
      return newValue;
    });
  };

  const decrement = (setter, value, max) => {
    setter((prev) => {
      const newValue = Math.max(0, prev - 1);
      playTickSound();
      anime({
        targets: '.time-input-field',
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeInOutQuad',
      });
      return newValue;
    });
  };

  const presets = [
    { label: '1m', time: 60000 },
    { label: '3m', time: 180000 },
    { label: '5m', time: 300000 },
    { label: '10m', time: 600000 },
  ];

  const applyPreset = (time) => {
    onTimeChange(time);
    playTickSound();
    anime({
      targets: '.preset-button',
      scale: [1, 0.95, 1],
      duration: 300,
      easing: 'easeInOutQuad',
    });
  };

  return (
    <div className="timer-input-container">
      <h3 className="input-title">Set Timer</h3>
      <div className="time-inputs">
        <div className="time-input-group">
          <button
            className="time-input-btn increment"
            onClick={() => increment(setHours, hours, 23)}
            aria-label="Increment Hours" // FIX: Accessibility
          >
            ▲
          </button>
          <input
            type="text"
            className="time-input-field hours"
            value={hours.toString().padStart(2, '0')}
            readOnly
            aria-label="Hours" // FIX: Accessibility
          />
          <button
            className="time-input-btn decrement"
            onClick={() => decrement(setHours, hours, 23)}
            aria-label="Decrement Hours" // FIX: Accessibility
          >
            ▼
          </button>
          <span className="time-label">h</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-input-group">
          <button
            className="time-input-btn increment"
            onClick={() => increment(setMinutes, minutes, 59)}
            aria-label="Increment Minutes" // FIX: Accessibility
          >
            ▲
          </button>
          <input
            type="text"
            className="time-input-field minutes"
            value={minutes.toString().padStart(2, '0')}
            readOnly
            aria-label="Minutes" // FIX: Accessibility
          />
          <button
            className="time-input-btn decrement"
            onClick={() => decrement(setMinutes, minutes, 59)}
            aria-label="Decrement Minutes" // FIX: Accessibility
          >
            ▼
          </button>
          <span className="time-label">m</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-input-group">
          <button
            className="time-input-btn increment"
            onClick={() => increment(setSeconds, seconds, 59)}
            aria-label="Increment Seconds" // FIX: Accessibility
          >
            ▲
          </button>
          <input
            type="text"
            className="time-input-field seconds"
            value={seconds.toString().padStart(2, '0')}
            readOnly
            aria-label="Seconds" // FIX: Accessibility
          />
          <button
            className="time-input-btn decrement"
            onClick={() => decrement(setSeconds, seconds, 59)}
            aria-label="Decrement Seconds" // FIX: Accessibility
          >
            ▼
          </button>
          <span className="time-label">s</span>
        </div>
      </div>
      <div className="preset-buttons">
        {presets.map((preset) => (
          <button
            key={preset.label}
            className="preset-button"
            onClick={() => applyPreset(preset.time)}
            aria-label={`Set ${preset.label} timer`} // FIX: Accessibility
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimerInput;