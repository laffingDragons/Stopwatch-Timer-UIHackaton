import { useState, useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

const TimerCircle = ({ time, isRunning, mode = 'stopwatch', totalTime = 60 * 1000 }) => {
  const circleRef = useRef(null);
  const textRef = useRef(null);
  const circleProgressRef = useRef(null);
  const tickMarksRef = useRef(null);
  const glowFilterRef = useRef(null);
  const svgRef = useRef(null);
  const [glowIntensity, setGlowIntensity] = useState(3);
  
  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  
  // Format time for display (mm:ss.SS)
  const formatTime = (timeInMs) => {
    const isNegative = timeInMs < 0;
    const absTime = Math.abs(timeInMs);
    
    const minutes = Math.floor(absTime / 60000);
    const seconds = Math.floor((absTime % 60000) / 1000);
    const centiseconds = Math.floor((absTime % 1000) / 10);
    
    return `${isNegative ? '-' : ''}${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Initialize the 3D parallax effect
  useEffect(() => {
    if (!svgRef.current) return;
    
    const handleMouseMove = (e) => {
      const bounds = svgRef.current.getBoundingClientRect();
      const centerX = bounds.left + bounds.width / 2;
      const centerY = bounds.top + bounds.height / 2;
      
      // Calculate mouse position relative to center (ranges from -1 to 1)
      const relativeX = (e.clientX - centerX) / (bounds.width / 2);
      const relativeY = (e.clientY - centerY) / (bounds.height / 2);
      
      // Apply parallax effect to each layer with different intensities
      const layers = Array.from(svgRef.current.querySelectorAll('[class*="layer-"]'));
      
      layers.forEach(layer => {
        const layerClass = Array.from(layer.classList).find(c => c.startsWith('layer-'));
        if (!layerClass) return;
        
        const layerNum = parseInt(layerClass.split('-')[1]);
        const intensity = (layerNum - 6) * 2; // Layer 6 is neutral, lower layers move opposite
        
        const translateX = relativeX * intensity;
        const translateY = relativeY * intensity;
        const currentTransform = layer.style.transform || '';
        
        // Preserve the original z-translation but apply new x,y translations
        const zMatch = currentTransform.match(/translateZ\(([^)]+)\)/);
        const zTranslation = zMatch ? zMatch[1] : '0px';
        const rotateMatch = currentTransform.match(/rotate\(([^)]+)\)/);
        const rotation = rotateMatch ? ` rotate(${rotateMatch[1]})` : '';
        
        layer.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${zTranslation})${rotation}`;
      });
    };
    
    // Reset transforms when mouse leaves
    const handleMouseLeave = () => {
      const layers = Array.from(svgRef.current.querySelectorAll('[class*="layer-"]'));
      
      layers.forEach(layer => {
        const layerClass = Array.from(layer.classList).find(c => c.startsWith('layer-'));
        if (!layerClass) return;
        
        const layerNum = parseInt(layerClass.split('-')[1]);
        const zTranslationValues = [
          '-30px', '-25px', '-20px', '-15px', '-10px', '-5px',
          '0px', '5px', '10px', '15px', '20px', '25px'
        ];
        
        let transform = `translateZ(${zTranslationValues[layerNum - 1]})`;
        
        // Special case for progress circle
        if (layerClass === 'layer-8') {
          transform += ' rotate(-90deg)';
        }
        
        layer.style.transform = transform;
      });
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    svgRef.current.addEventListener('mouseleave', handleMouseLeave);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (svgRef.current) {
        svgRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  // Handle circle pulse animation when running
  useEffect(() => {
    if (isRunning) {
      // Enhanced pulse animation
      const pulseAnimation = anime({
        targets: circleRef.current,
        scale: [1, 1.03],
        opacity: [0.8, 1],
        duration: 1000,
        direction: 'alternate',
        easing: 'easeInOutQuad',
        loop: true
      });
      
      // Increase glow intensity
      setGlowIntensity(8);
      
      return () => {
        pulseAnimation.pause();
        setGlowIntensity(3);
      };
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
    
    // Update 3D perspective based on time
    if (circleRef.current && circleRef.current.parentElement) {
      const perspective = 1000 + (time % 10000) / 100;
      circleRef.current.parentElement.style.perspective = `${perspective}px`;
    }
  }, [time]);
  
  // Update circle progress
  useEffect(() => {
    // Calculate progress percentage
    let progress;
    if (mode === 'stopwatch') {
      progress = (time % totalTime) / totalTime;
    } else { // timer mode
      progress = Math.max(0, time / totalTime);
    }
    
    const offset = circumference - (progress * circumference);
    
    // Apply stroke-dashoffset for the progress trail
    if (circleProgressRef.current) {
      circleProgressRef.current.style.transition = 'none'; // Disable transitions
      circleProgressRef.current.style.strokeDashoffset = offset;
      
      // Update gradient rotation for more dynamic effect
      const gradient = document.getElementById('progressGradient');
      if (gradient) {
        gradient.setAttribute('gradientTransform', `rotate(${progress * 360})`);
      }
      
      // Set glow intensity based on running state
      circleProgressRef.current.style.filter = `drop-shadow(0 0 ${glowIntensity}px var(--neon-color))`;
    }
    
    // Update glow filter
    if (glowFilterRef.current) {
      const stdDeviation = isRunning ? 4 + (time % 1000) / 250 : 4;
      glowFilterRef.current.setAttribute('stdDeviation', stdDeviation);
    }
  }, [time, isRunning, circumference, totalTime, mode, glowIntensity]);
  
  return (
    <div className="timer-circle-container">
      <svg width="300" height="300" viewBox="0 0 300 300" className="timer-svg" ref={svgRef}>
        {/* Dynamic filter for glow effect */}
        <filter id="glow">
          <feGaussianBlur ref={glowFilterRef} stdDeviation="4" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Advanced dynamic glow filter with turbulence */}
        <filter id="advancedGlow" filterUnits="userSpaceOnUse" width="300%" height="300%" x="-100%" y="-100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="2" result="noise" />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
          <feGaussianBlur in="displaced" stdDeviation="2.5" result="blurred" />
          <feBlend in="SourceGraphic" in2="blurred" mode="normal" />
          <feGaussianBlur stdDeviation="5" result="glow" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0" result="brighter" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="brighter" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        
        {/* Multiple gradients for richer visuals */}
        <defs>
          <linearGradient id="progressGradient" gradientTransform="rotate(0)">
            <stop offset="0%" stopColor="var(--neon-color)" />
            <stop offset="100%" stopColor="var(--neon-secondary)" />
          </linearGradient>
          
          <radialGradient id="circleGlow" cx="0.5" cy="0.5" r="0.5" fx="0.5" fy="0.5">
            <stop offset="0%" stopColor="var(--neon-color)" stopOpacity="0.8" />
            <stop offset="100%" stopColor="var(--neon-color)" stopOpacity="0" />
          </radialGradient>
          
          <linearGradient id="textGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--text-color)" />
            <stop offset="100%" stopColor="var(--neon-color)" />
          </linearGradient>
        </defs>
        
        {/* Multilayered 3D effect background elements - Parallax Layers */}
        {/* Far Background Layer */}
        <circle
          cx="150"
          cy="150"
          r={radius + 30}
          fill="transparent"
          stroke="var(--bg-secondary)"
          strokeWidth="1"
          opacity="0.1"
          className="background-circle-outer layer-1"
        />
        
        {/* Middle Background Layer */}
        <circle
          cx="150"
          cy="150"
          r={radius + 20}
          fill="transparent"
          stroke="var(--bg-secondary)"
          strokeWidth="1"
          opacity="0.2"
          className="background-circle-mid layer-2"
        />
        
        {/* Closer Background Layer */}
        <circle
          cx="150"
          cy="150"
          r={radius + 10}
          fill="transparent"
          stroke="var(--bg-secondary)"
          strokeWidth="1"
          opacity="0.3"
          className="background-circle-inner layer-3"
        />
        
        {/* Glow halo effect behind the circle */}
        <circle 
          cx="150" 
          cy="150" 
          r={radius + 15} 
          fill="url(#circleGlow)" 
          opacity={isRunning ? "0.4" : "0.15"} 
          className="halo-effect layer-4"
        />
        
        {/* Background circle */}
        <circle
          ref={circleRef}
          cx="150"
          cy="150"
          r={radius}
          fill="transparent"
          stroke="var(--bg-accent)"
          strokeWidth="5"
          opacity="0.5"
          className="timer-bg-circle layer-5"
        />
        
        {/* Tick marks */}
        <g ref={tickMarksRef} className="tick-marks layer-6">
          {Array.from({ length: 60 }).map((_, i) => {
            const angle = (i * 6) * (Math.PI / 180); // 6 degrees per tick
            const x1 = 150 + (radius - 5) * Math.cos(angle);
            const y1 = 150 + (radius - 5) * Math.sin(angle);
            const x2 = 150 + (radius - (i % 5 === 0 ? 15 : 10)) * Math.cos(angle);
            const y2 = 150 + (radius - (i % 5 === 0 ? 15 : 10)) * Math.sin(angle);
            
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className={i % 5 === 0 ? 'tick-major' : 'tick-minor'}
                style={{
                  opacity: i % 5 === 0 ? 0.8 : 0.5,
                  transform: `rotate(${(time / 10000) * i}deg)`,
                  transformOrigin: '150px 150px',
                  transition: 'transform 0.5s ease'
                }}
                stroke={i % 5 === 0 ? "#144366" : "#144366"}
                strokeWidth={i % 5 === 0 ? 2 : 1}
              />
            );
          })}
        </g>
        
        {/* Digital circular patterns for futuristic look */}
        <g className="digital-markers layer-7">
          <path
            d={`M 150,${150 - radius - 10} A 5,5 0 0 1 155,${150 - radius - 5} A 5,5 0 0 1 150,${150 - radius} A 5,5 0 0 1 145,${150 - radius - 5} A 5,5 0 0 1 150,${150 - radius - 10}`}
            fill="var(--neon-color)"
            opacity="0.7"
            className="digital-marker top"
          />
          
          <path
            d={`M 150,${150 + radius + 10} A 5,5 0 0 1 155,${150 + radius + 5} A 5,5 0 0 1 150,${150 + radius} A 5,5 0 0 1 145,${150 + radius + 5} A 5,5 0 0 1 150,${150 + radius + 10}`}
            fill="var(--neon-color)"
            opacity="0.7"
            className="digital-marker bottom"
          />
          
          <path
            d={`M ${150 - radius - 10},150 A 5,5 0 0 1 ${150 - radius - 5},145 A 5,5 0 0 1 ${150 - radius},150 A 5,5 0 0 1 ${150 - radius - 5},155 A 5,5 0 0 1 ${150 - radius - 10},150`}
            fill="var(--neon-color)"
            opacity="0.7"
            className="digital-marker left"
          />
          
          <path
            d={`M ${150 + radius + 10},150 A 5,5 0 0 1 ${150 + radius + 5},145 A 5,5 0 0 1 ${150 + radius},150 A 5,5 0 0 1 ${150 + radius + 5},155 A 5,5 0 0 1 ${150 + radius + 10},150`}
            fill="var(--neon-color)"
            opacity="0.7"
            className="digital-marker right"
          />
        </g>
        
        {/* Progress circle with enhanced 3D effect */}
        <circle
          ref={circleProgressRef}
          cx="150"
          cy="150"
          r={radius}
          stroke="url(#progressGradient)"
          fill="transparent"
          strokeWidth="6" 
          strokeLinecap="round"
          className="timer-progress-circle layer-8"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform="rotate(-90, 150, 150)"
          style={{
            filter: `drop-shadow(0 0 ${glowIntensity}px var(--neon-color))`,
          }}
        />
        
        {/* Little cursor marker that moves along the progress */}
        <circle
          cx={150 + radius * Math.cos(2 * Math.PI * (time % totalTime) / totalTime - Math.PI / 2)}
          cy={150 + radius * Math.sin(2 * Math.PI * (time % totalTime) / totalTime - Math.PI / 2)}
          r="4"
          fill="white"
          filter="url(#glow)"
          className="progress-cursor layer-9"
        />
        
        {/* Timer Text with enhanced styling */}
        <text
          ref={textRef}
          x="150"
          y="170"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="url(#textGradient)"
          fontSize="42"
          fontFamily="'Orbitron', sans-serif"
          fontWeight="bold"
          letterSpacing="2"
          className="timer-text layer-10"
          filter="url(#glow)"
        >
          {formatTime(mode === 'stopwatch' ? time : Math.max(0, time))}
        </text>
        
        {/* Mode indicator */}
        <text
          x="150"
          y="130"
          textAnchor="middle"
          dominantBaseline="middle"
          fill="var(--text-secondary)"
          fontSize="16"
          fontFamily="'Orbitron', sans-serif"
          opacity="0.7"
          className="mode-text layer-11"
        >
          {mode === 'stopwatch' ? 'Stopwatch' : 'Timer'}
        </text>
        
        {/* Holographic scanning line effect */}
        <line
          x1="0"
          y1={150 + 50 * Math.sin(time / 500)}
          x2="300"
          y2={150 + 50 * Math.sin(time / 500)}
          stroke="var(--neon-color)"
          strokeWidth="1"
          opacity="0.3"
          strokeDasharray="5,3"
          className="scan-line layer-12"
        />
      </svg>
    </div>
  );
};

export default TimerCircle;