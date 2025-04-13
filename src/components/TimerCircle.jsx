import { useState, useEffect, useRef } from 'react';
import anime from 'animejs';

const TimerCircle = ({ time, isRunning, totalTime = 60 * 1000 }) => {
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const circleProgressRef = useRef(null);
  const tickMarksRef = useRef(null);
  
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  
  // Format time for display (mm:ss.SS)
  const formatTime = (timeInMs) => {
    const minutes = Math.floor(timeInMs / 60000);
    const seconds = Math.floor((timeInMs % 60000) / 1000);
    const centiseconds = Math.floor((timeInMs % 1000) / 10);
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Handle circle pulse animation when running
  useEffect(() => {
    if (isRunning) {
      const pulseAnimation = anime({
        targets: circleRef.current,
        scale: [1, 1.03],
        opacity: [0.8, 1],
        duration: 1000,
        direction: 'alternate',
        easing: 'easeInOutQuad',
        loop: true
      });
      
      return () => pulseAnimation.pause();
    }
  }, [isRunning]);
  
  // Handle time text animation
  useEffect(() => {
    anime({
      targets: textRef.current,
      opacity: [0.7, 1],
      scale: [0.98, 1],
      duration: 100,
      easing: 'easeOutQuad'
    });
  }, [time]);
  
  // Update circle progress
  useEffect(() => {
    // Calculate progress percentage based on time (for a circular progress)
    const progress = (time % totalTime) / totalTime;
    const offset = circumference - (progress * circumference);
    
    // Get gradient rotation based on progress
    const gradientRotation = `rotate(${progress * 360})`;
    
    anime({
      targets: circleProgressRef.current,
      strokeDashoffset: offset,
      duration: 100,
      easing: 'linear'
    });
    
    // Update gradient rotation
    if (circleProgressRef.current) {
      const gradient = document.getElementById('progressGradient');
      if (gradient) {
        gradient.setAttribute('gradientTransform', gradientRotation);
      }
    }
  }, [time, isRunning, circumference, totalTime]);
  
  return (
    <div className="timer-circle-container">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Filter for glow effect */}
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Gradient for progress arc */}
        <defs>
          <linearGradient id="progressGradient">
            <stop offset="0%" stopColor="#00ccff" />
            <stop offset="100%" stopColor="#0066ff" />
          </linearGradient>
        </defs>
        
        {/* Background circle */}
        <circle
          ref={circleRef}
          cx="150"
          cy="150"
          r={radius}
          className="timer-bg-circle"
        />
        
        {/* Tick marks */}
        <g ref={tickMarksRef} className="tick-marks">
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6) * (Math.PI / 180); // 6 degrees per tick
            const x1 = 150 + (radius - 5) * Math.cos(angle);
            const y1 = 150 + (radius - 5) * Math.sin(angle);
            const x2 = 150 + (radius - (i % 5 === 0 ? 12 : 8)) * Math.cos(angle);
            const y2 = 150 + (radius - (i % 5 === 0 ? 12 : 8)) * Math.sin(angle);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={i % 5 === 0 ? 'tick-major' : 'tick-minor'}
              />
            );
          })}
        </g>
        
        {/* Progress circle */}
        <circle
          ref={circleProgressRef}
          cx="150"
          cy="150"
          r={radius}
          stroke="url(#progressGradient)"
          className="timer-progress-circle"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90 150 150)"
          filter="url(#glow)"
        />
        
        {/* Timer Text */}
        <text
          ref={textRef}
          x="150"
          y="170"
          className="timer-text"
          filter="url(#glow)"
        >
          {formatTime(time)}
        </text>
      </svg>
    </div>
  );
};

export default TimerCircle;