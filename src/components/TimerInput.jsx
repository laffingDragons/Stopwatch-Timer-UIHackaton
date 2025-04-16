import { useState, useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

const TimerInput = ({ totalTime, onTimeInput }) => {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const hourWaveRef = useRef(null);
  const minuteWaveRef = useRef(null);
  const secondWaveRef = useRef(null);

  // Initialize state based on totalTime (update inputs when totalTime changes)
  useEffect(() => {
    const newHours = Math.floor(totalTime / 3600000);
    const newMinutes = Math.floor((totalTime % 3600000) / 60000);
    const newSeconds = Math.floor((totalTime % 60000) / 1000);

    // Prevent unnecessary state updates if values haven't changed
    if (newHours !== hours) setHours(newHours);
    if (newMinutes !== minutes) setMinutes(newMinutes);
    if (newSeconds !== seconds) setSeconds(newSeconds);
  }, [totalTime]);

  // Handle wave adjustment for each time unit
  const handleWaveAdjust = (setter, value, max, ref, delta) => {
    const newValue = value + (delta > 0 ? 1 : -1);
    const adjustedValue = Math.max(0, Math.min(max, newValue)); // Clamp value

    // Only update if the value has changed
    if (adjustedValue !== value) {
      setter(adjustedValue);

      // Calculate new total time after the state update
      const newHours = setter === setHours ? adjustedValue : hours;
      const newMinutes = setter === setMinutes ? adjustedValue : minutes;
      const newSeconds = setter === setSeconds ? adjustedValue : seconds;
      const newTime = newHours * 3600000 + newMinutes * 60000 + newSeconds * 1000;

      // Call onTimeInput to update parent
      if (newTime >= 0 && newTime <= 23 * 3600000 + 59 * 60000 + 59 * 1000) {
        onTimeInput(newTime);
      }

      // Animate wave glow and ripple
      anime({
        targets: ref.current.querySelector('.wave-bar'),
        background: [
          `linear-gradient(90deg, transparent, ${adjustedValue % 2 === 0 ? 'var(--neon-color)' : 'var(--neon-secondary)'}, transparent)`,
          'linear-gradient(90deg, transparent, var(--neon-color), transparent)',
        ],
        duration: 400,
        easing: 'easeInOutQuad',
      });
      anime({
        targets: ref.current.querySelector('.wave-ripple'),
        scaleX: [0, 1.5],
        opacity: [1, 0],
        duration: 500,
        easing: 'easeOutQuad',
      });
    }
  };

  // Mouse/touch scroll handling for waves
  const handleScroll = (setter, value, max, ref) => {
    let startX = 0;
    let isDragging = false;

    const onMouseDown = (e) => {
      startX = e.clientX;
      isDragging = true;
      e.preventDefault();
    };

    const onMouseMove = (e) => {
      if (!isDragging) return;
      const deltaX = startX - e.clientX;
      if (Math.abs(deltaX) > 10) {
        handleWaveAdjust(setter, value, max, ref, -deltaX);
        startX = e.clientX;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onWheel = (e) => {
      e.preventDefault();
      handleWaveAdjust(setter, value, max, ref, -e.deltaY);
    };

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    };

    const onTouchMove = (e) => {
      if (!isDragging) return;
      const deltaX = startX - e.touches[0].clientX;
      if (Math.abs(deltaX) > 10) {
        handleWaveAdjust(setter, value, max, ref, -deltaX);
        startX = e.touches[0].clientX;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    return {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onWheel,
      onTouchStart,
      onTouchMove,
      onTouchEnd,
    };
  };

  const presets = [
    { label: '1m', time: 60000 },
    { label: '3m', time: 180000 },
    { label: '5m', time: 300000 },
    { label: '10m', time: 600000 },
  ];

  const applyPreset = (time) => {
    onTimeInput(time);
    anime({
      targets: '.preset-dot',
      scale: [1, 1.3, 1],
      opacity: [1, 0.5, 1],
      duration: 300,
      easing: 'easeInOutQuad',
    });
  };

  return (
    <div className="timer-input-container">
      <h3 className="input-title">Set Timer</h3>
      <div className="time-waves">
        <div className="wave-group">
          <div
            className="time-wave wave-hours"
            ref={hourWaveRef}
            {...handleScroll(setHours, hours, 23, hourWaveRef)}
          >
            <div className="wave-bar">
              <div className="wave-ripple" />
            </div>
            <div className="wave-value">{hours.toString().padStart(2, '0')}</div>
          </div>
          <span className="time-label">h</span>
        </div>
        <div className="time-separator">:</div>
        <div className="wave-group">
          <div
            className="time-wave wave-minutes"
            ref={minuteWaveRef}
            {...handleScroll(setMinutes, minutes, 59, minuteWaveRef)}
          >
            <div className="wave-bar">
              <div className="wave-ripple" />
            </div>
            <div className="wave-value">{minutes.toString().padStart(2, '0')}</div>
          </div>
          <span className="time-label">m</span>
        </div>
        <div className="time-separator">:</div>
        <div className="wave-group">
          <div
            className="time-wave wave-seconds"
            ref={secondWaveRef}
            {...handleScroll(setSeconds, seconds, 59, secondWaveRef)}
          >
            <div className="wave-bar">
              <div className="wave-ripple" />
            </div>
            <div className="wave-value">{seconds.toString().padStart(2, '0')}</div>
          </div>
          <span className="time-label">s</span>
        </div>
      </div>
      <div className="preset-dots">
        {presets.map((preset) => (
          <div
            key={preset.label}
            className="preset-dot"
            onClick={() => applyPreset(preset.time)}
            aria-label={`Set ${preset.label} timer`}
          >
            <span>{preset.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimerInput;