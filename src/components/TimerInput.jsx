import { useState, useEffect } from 'react';
import anime from 'animejs/lib/anime.es.js';

const TimerInput = ({ presetTime, onTimeChange, soundEnabled }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(Math.floor(presetTime / 60000));
  const [seconds, setSeconds] = useState(Math.floor((presetTime % 60000) / 1000));
  
  // Update component when presetTime changes externally
  useEffect(() => {
    setHours(Math.floor(presetTime / 3600000));
    setMinutes(Math.floor((presetTime % 3600000) / 60000));
    setSeconds(Math.floor((presetTime % 60000) / 1000));
  }, [presetTime]);
  
  // Update the preset time when any input changes
  useEffect(() => {
    const newTime = (hours * 3600000) + (minutes * 60000) + (seconds * 1000);
    onTimeChange(newTime);
  }, [hours, minutes, seconds, onTimeChange]);
  
  // Input handlers with validation
  const handleHoursChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setHours(Math.min(23, Math.max(0, value)));
    playTickSound();
  };
  
  const handleMinutesChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setMinutes(Math.min(59, Math.max(0, value)));
    playTickSound();
  };
  
  const handleSecondsChange = (e) => {
    const value = parseInt(e.target.value, 10) || 0;
    setSeconds(Math.min(59, Math.max(0, value)));
    playTickSound();
  };
  
  // Play tick sound for button presses
  const playTickSound = () => {
    if (soundEnabled) {
      const tickSound = new Audio('/sounds/tick.mp3');
      tickSound.volume = 0.3;
      tickSound.play().catch(e => console.error('Error playing sound:', e));
    }
  };
  
  // Increment/decrement buttons
  const increment = (setter, value, max) => {
    setter(prev => {
      const newValue = (prev + 1) % (max + 1);
      playTickSound();
      anime({
        targets: '.time-input-field',
        scale: [1, 1.05, 1],
        duration: 200,
        easing: 'easeInOutQuad'
      });
      return newValue;
    });
  };
  
  const decrement = (setter, value, max) => {
    setter(prev => {
      const newValue = prev <= 0 ? max : prev - 1;
      playTickSound();
      anime({
        targets: '.time-input-field',
        scale: [1, 0.95, 1],
        duration: 200,
        easing: 'easeInOutQuad'
      });
      return newValue;
    });
  };
  
  // Quick preset buttons
  const presets = [
    { label: '1m', time: 60000 },
    { label: '3m', time: 180000 },
    { label: '5m', time: 300000 },
    { label: '10m', time: 600000 }
  ];
  
  const applyPreset = (time) => {
    onTimeChange(time);
    playTickSound();
    
    // Animate the preset button
    anime({
      targets: '.preset-button',
      scale: [1, 0.95, 1],
      duration: 300,
      easing: 'easeInOutQuad'
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
          >
            ▲
          </button>
          <input
            type="text"
            className="time-input-field hours"
            value={hours.toString().padStart(2, '0')}
            onChange={handleHoursChange}
            readOnly
          />
          <button 
            className="time-input-btn decrement"
            onClick={() => decrement(setHours, hours, 23)}
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
          >
            ▲
          </button>
          <input
            type="text"
            className="time-input-field minutes"
            value={minutes.toString().padStart(2, '0')}
            onChange={handleMinutesChange}
            readOnly
          />
          <button 
            className="time-input-btn decrement"
            onClick={() => decrement(setMinutes, minutes, 59)}
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
          >
            ▲
          </button>
          <input
            type="text"
            className="time-input-field seconds"
            value={seconds.toString().padStart(2, '0')}
            onChange={handleSecondsChange}
            readOnly
          />
          <button 
            className="time-input-btn decrement"
            onClick={() => decrement(setSeconds, seconds, 59)}
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
          >
            {preset.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default TimerInput;