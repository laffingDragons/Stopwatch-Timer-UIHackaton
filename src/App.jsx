import { useState, useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js'; // Using animejs 4
import TimerCircle from './components/TimerCircle';
import LapList from './components/LapList';
import Controls from './components/Controls';
import Settings from './components/Settings';
import TimerInput from './components/TimerInput';

const App = () => {
  // Core timer states
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  
  // Mode states
  const [mode, setMode] = useState('stopwatch'); // 'stopwatch' or 'timer'
  const [presetTime, setPresetTime] = useState(60 * 1000); // Default 1 minute
  const [remainingTime, setRemainingTime] = useState(60 * 1000);
  
  // UI states
  const [loaded, setLoaded] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // Theme and settings states
  const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
  const [colorScheme, setColorScheme] = useState('cyan'); // 'cyan', 'purple', 'green', 'orange', 'rainbow'
  const [shakeToControl, setShakeToControl] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Audio references
  const timerCompleteSound = useRef(null);
  const buttonClickSound = useRef(null);
  
  // Animation and timer refs
  const intervalRef = useRef(null);
  const appRef = useRef(null);
  const timerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const lapsRef = useRef(null);
  const startTimeRef = useRef(0);
  const accumulatedTimeRef = useRef(0);
  const rotationIntervalRef = useRef(null);
  
  // Shake detection state
  const shakeThreshold = 15;
  const lastShakeTime = useRef(0);
  const accelerometer = useRef({ x: 0, y: 0, z: 0 });
  
  // Initialize sounds
  useEffect(() => {
    // Create audio elements
    timerCompleteSound.current = new Audio('/sounds/timer-complete.mp3');
    buttonClickSound.current = new Audio('/sounds/button-click.mp3');
    
    // Set up mute based on sound setting
    timerCompleteSound.current.muted = !soundEnabled;
    buttonClickSound.current.muted = !soundEnabled;
    
    return () => {
      // Clean up audio resources
      if (timerCompleteSound.current) {
        timerCompleteSound.current.pause();
        timerCompleteSound.current = null;
      }
      if (buttonClickSound.current) {
        buttonClickSound.current.pause();
        buttonClickSound.current = null;
      }
    };
  }, []);
  
  // Update sound mute state when setting changes
  useEffect(() => {
    if (timerCompleteSound.current) {
      timerCompleteSound.current.muted = !soundEnabled;
    }
    if (buttonClickSound.current) {
      buttonClickSound.current.muted = !soundEnabled;
    }
  }, [soundEnabled]);
  
  // Initialize shake detection
  useEffect(() => {
    const handleDeviceMotion = (event) => {
      if (!shakeToControl) return;
      
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;
      
      const { x, y, z } = accelerationIncludingGravity;
      const currentTime = new Date().getTime();
      
      // Only process if we're past the cooldown period (500ms)
      if ((currentTime - lastShakeTime.current) > 500) {
        const deltaX = Math.abs(x - accelerometer.current.x);
        const deltaY = Math.abs(y - accelerometer.current.y);
        const deltaZ = Math.abs(z - accelerometer.current.z);
        
        if ((deltaX > shakeThreshold && deltaY > shakeThreshold) || 
            (deltaX > shakeThreshold && deltaZ > shakeThreshold) || 
            (deltaY > shakeThreshold && deltaZ > shakeThreshold)) {
          // Shake detected, toggle timer
          if (isRunning) {
            handleStop();
          } else {
            handleStart();
          }
          lastShakeTime.current = currentTime;
        }
      }
      
      // Update current acceleration values
      accelerometer.current = { x, y, z };
    };
    
    // Only add listener if shake control is enabled
    if (shakeToControl) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }
    
    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [shakeToControl, isRunning]);
  
  // Initialize 3D rotation effect for timer
  useEffect(() => {
    if (rotationEnabled && loaded) {
      const handleMouseMove = (e) => {
        if (!timerContainerRef.current) return;
        
        const timerRect = timerContainerRef.current.getBoundingClientRect();
        const centerX = timerRect.left + timerRect.width / 2;
        const centerY = timerRect.top + timerRect.height / 2;
        
        // Calculate rotation based on mouse position relative to center
        const rotateY = ((e.clientX - centerX) / (timerRect.width / 2)) * 10;
        const rotateX = -((e.clientY - centerY) / (timerRect.height / 2)) * 10;
        
        anime({
          targets: timerContainerRef.current,
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 400,
          easing: 'easeOutQuad'
        });
      };
      
      // Auto rotation when no mouse interaction
      rotationIntervalRef.current = setInterval(() => {
        if (timerContainerRef.current && !isRunning) {
          anime({
            targets: timerContainerRef.current,
            rotateY: ['-5deg', '5deg'],
            rotateX: ['2deg', '-2deg'],
            duration: 8000,
            direction: 'alternate',
            easing: 'easeInOutQuad',
            loop: true
          });
        }
      }, 10000);
      
      window.addEventListener('mousemove', handleMouseMove);
      
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        clearInterval(rotationIntervalRef.current);
      };
    }
  }, [rotationEnabled, loaded, isRunning]);
  
  // Initialize animation state on component mount
  useEffect(() => {
    // Initial load animations with 3D zoom effect
    setTimeout(() => {
      setLoaded(true);
      
      // Animate the timer container with 3D zoom-in effect
      anime({
        targets: timerContainerRef.current,
        scale: [0.5, 1],
        opacity: [0, 1],
        translateZ: [-200, 0],
        rotateX: [-30, 0],
        rotateY: [20, 0],
        duration: 1500,
        easing: 'cubicBezier(0.19, 1, 0.22, 1)'
      });
      
      // Staggered animations for controls and lap list
      anime({
        targets: [controlsRef.current, lapsRef.current],
        opacity: [0, 1],
        translateY: [30, 0],
        delay: anime.stagger(200, {start: 400}),
        duration: 1000,
        easing: 'easeOutQuad'
      });
      
      // Animate the circular progress to initialize
      const circleElement = timerContainerRef.current.querySelector('.timer-progress-circle');
      if (circleElement) {
        anime({
          targets: circleElement,
          strokeDashoffset: [anime.setDashoffset, 0],
          duration: 1500,
          easing: 'easeInOutQuad',
          delay: 500
        });
      }
      
      // Animate the halo effect
      const haloElement = timerContainerRef.current.querySelector('.halo-effect');
      if (haloElement) {
        anime({
          targets: haloElement,
          opacity: [0, 0.15],
          duration: 1000,
          easing: 'easeOutQuad',
          delay: 700
        });
      }
    }, 100);
  }, []);
  
  // Timer/Stopwatch logic
  useEffect(() => {
    if (isRunning) {
      if (mode === 'stopwatch') {
        startTimeRef.current = Date.now() - accumulatedTimeRef.current;
        
        intervalRef.current = setInterval(() => {
          const currentTime = Date.now() - startTimeRef.current;
          setTime(currentTime);
        }, 10); // Update every 10ms for smoother animation
      } else if (mode === 'timer') {
        startTimeRef.current = Date.now();
        accumulatedTimeRef.current = remainingTime;
        
        intervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTimeRef.current;
          const newRemaining = Math.max(0, accumulatedTimeRef.current - elapsed);
          
          setRemainingTime(newRemaining);
          
          // Timer completed
          if (newRemaining <= 0) {
            handleTimerComplete();
          }
        }, 10);
      }
    } else {
      clearInterval(intervalRef.current);
      
      if (mode === 'stopwatch') {
        accumulatedTimeRef.current = time;
      } else {
        accumulatedTimeRef.current = remainingTime;
      }
    }
    
    // Cleanup function
    return () => {
      clearInterval(intervalRef.current);
    };
  }, [isRunning, mode]);
  
  // Handle timer complete
  const handleTimerComplete = () => {
    setIsRunning(false);
    
    // Play sound if enabled
    if (soundEnabled && timerCompleteSound.current) {
      timerCompleteSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
    
    // Flash animation for timer completion
    anime({
      targets: timerContainerRef.current,
      scale: [1, 1.1, 1],
      opacity: [1, 0.7, 1],
      duration: 1000,
      easing: 'easeInOutQuad'
    });
    
    // Intense glow effect
    const circleElement = timerContainerRef.current.querySelector('.timer-progress-circle');
    if (circleElement) {
      anime({
        targets: circleElement,
        filter: [
          'drop-shadow(0 0 5px var(--neon-color))',
          'drop-shadow(0 0 30px var(--neon-color))',
          'drop-shadow(0 0 5px var(--neon-color))'
        ],
        duration: 2000,
        easing: 'easeInOutQuad'
      });
    }
  };
  
  // Switch between stopwatch and timer modes
  const toggleMode = () => {
    // If timer is running, stop it first
    if (isRunning) {
      handleStop();
    }
    
    // Reset values
    setTime(0);
    setRemainingTime(presetTime);
    accumulatedTimeRef.current = 0;
    setLaps([]);
    
    // Toggle mode
    setMode(prevMode => prevMode === 'stopwatch' ? 'timer' : 'stopwatch');
    
    // Play button sound
    if (soundEnabled && buttonClickSound.current) {
      buttonClickSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
    
    // Animation for mode change
    anime({
      targets: timerContainerRef.current,
      rotateY: [0, 180, 0],
      scale: [1, 0.8, 1],
      opacity: [1, 0.5, 1],
      duration: 1000,
      easing: 'easeInOutQuad'
    });
  };
  
  // Handle preset time change for timer mode
  const handlePresetTimeChange = (newTime) => {
    setPresetTime(newTime);
    setRemainingTime(newTime);
    accumulatedTimeRef.current = newTime;
  };
  
  // Handle start button click
  const handleStart = () => {
    setIsRunning(true);
    
    // Play button sound
    if (soundEnabled && buttonClickSound.current) {
      buttonClickSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
    
    // Stop auto rotation when timer is running
    if (rotationIntervalRef.current) {
      clearInterval(rotationIntervalRef.current);
    }
    
    // Animate app container when starting
    anime({
      targets: appRef.current,
      scale: [0.98, 1],
      opacity: [0.8, 1],
      duration: 500,
      easing: 'easeOutElastic(1, .5)'
    });
    
    // Add pulsing glow to timer - target the SVG circle element for a circular glow
    if (timerContainerRef.current) {
      const circleElement = timerContainerRef.current.querySelector('.timer-progress-circle');
      if (circleElement) {
        anime({
          targets: circleElement,
          filter: 'drop-shadow(0 0 15px var(--neon-color))',
          duration: 500,
          easing: 'easeOutQuad'
        });
      }
    }
    
    // Animate buttons to increase glow
    const buttons = document.querySelectorAll('.control-button');
    anime({
      targets: buttons,
      boxShadow: '0 0 15px var(--neon-color)',
      duration: 500,
      easing: 'easeOutQuad'
    });
  };
  
  // Handle stop button click
  const handleStop = () => {
    setIsRunning(false);
    
    // Play button sound
    if (soundEnabled && buttonClickSound.current) {
      buttonClickSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
    
    // Animate app container when stopping
    anime({
      targets: appRef.current,
      scale: [1.02, 1],
      duration: 300,
      easing: 'easeOutQuad'
    });
    
    // Reduce glow on timer
    if (timerContainerRef.current) {
      const circleElement = timerContainerRef.current.querySelector('.timer-progress-circle');
      if (circleElement) {
        anime({
          targets: circleElement,
          filter: 'drop-shadow(0 0 5px var(--neon-color))',
          duration: 300,
          easing: 'easeOutQuad'
        });
      }
    }
    
    // Animate buttons to decrease glow
    const buttons = document.querySelectorAll('.control-button');
    anime({
      targets: buttons,
      boxShadow: '0 0 8px var(--neon-color)',
      duration: 300,
      easing: 'easeOutQuad'
    });
  };
  
  // Handle lap button click
  const handleLap = () => {
    if (mode === 'stopwatch' && isRunning) {
      setLaps([time, ...laps]);
      
      // Play button sound
      if (soundEnabled && buttonClickSound.current) {
        buttonClickSound.current.play().catch(e => console.error('Error playing sound:', e));
      }
      
      // Animate app container when recording lap
      anime({
        targets: appRef.current,
        translateY: [-5, 0],
        duration: 200,
        easing: 'easeOutQuad'
      });
    }
  };
  
  // Handle reset button click
  const handleReset = () => {
    if (mode === 'stopwatch') {
      setTime(0);
      accumulatedTimeRef.current = 0;
      setLaps([]);
    } else {
      setRemainingTime(presetTime);
      accumulatedTimeRef.current = presetTime;
    }
    
    // Play button sound
    if (soundEnabled && buttonClickSound.current) {
      buttonClickSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
    
    // Animate app container when resetting
    anime({
      targets: appRef.current,
      rotate: ['-1deg', '1deg', '0deg'],
      duration: 500,
      easing: 'easeInOutQuad'
    });
  };
  
  // Toggle settings panel
  const toggleSettings = () => {
    setShowSettings(!showSettings);
    
    // Play button sound
    if (soundEnabled && buttonClickSound.current) {
      buttonClickSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
    
    // Animate settings panel
    if (!showSettings) {
      anime({
        targets: '.settings-panel',
        translateX: ['100%', '0%'],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuad'
      });
    } else {
      anime({
        targets: '.settings-panel',
        translateX: ['0%', '100%'],
        opacity: [1, 0],
        duration: 500,
        easing: 'easeInQuad'
      });
    }
  };
  
  // Toggle theme between light and dark
  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    
    // Play button sound
    if (soundEnabled && buttonClickSound.current) {
      buttonClickSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
    
    // Animate theme transition
    anime({
      targets: document.body,
      opacity: [0.9, 1],
      duration: 300,
      easing: 'linear',
      begin: () => {
        document.body.setAttribute('data-theme', newTheme);
      }
    });
  };
  
  // Cycle through color schemes
  const cycleColorScheme = () => {
    const schemes = ['cyan', 'purple', 'green', 'orange', 'rainbow'];
    const currentIndex = schemes.indexOf(colorScheme);
    const nextIndex = (currentIndex + 1) % schemes.length;
    setColorScheme(schemes[nextIndex]);
    
    // Play button sound
    if (soundEnabled && buttonClickSound.current) {
      buttonClickSound.current.play().catch(e => console.error('Error playing sound:', e));
    }
    
    // Animate color change
    anime({
      targets: ['.timer-progress-circle', '.control-button', '.app-title'],
      opacity: [0.7, 1],
      scale: [0.98, 1],
      duration: 300,
      easing: 'easeOutQuad'
    });
  };
  
  return (
    <div className={`app-container ${theme} ${colorScheme} ${loaded ? 'loaded' : ''}`} ref={appRef} data-theme={theme} data-color-scheme={colorScheme}>
      <header className="app-header">
        <h1 className="app-title">OUTL!ER.AI</h1>
        <div className="header-controls">
          <button 
            className="mode-toggle" 
            onClick={toggleMode} 
            title={mode === 'stopwatch' ? "Switch to Timer Mode" : "Switch to Stopwatch Mode"}
          >
            {mode === 'stopwatch' ? '⏱️' : '⏲️'}
          </button>
          <button 
            className="settings-toggle" 
            onClick={toggleSettings}
          >
            ⚙️
          </button>
        </div>
      </header>
      
      <main className="stopwatch-container">
        <div className="timer-wrapper" ref={timerContainerRef}>
          <TimerCircle 
            time={mode === 'stopwatch' ? time : remainingTime} 
            isRunning={isRunning} 
            mode={mode}
            totalTime={mode === 'stopwatch' ? 60 * 1000 : presetTime} // 1 minute for stopwatch mode
          />
          <div className="timer-label">
            {mode === 'stopwatch' ? 'Stopwatch' : 'Timer'}
          </div>
        </div>
        
        {mode === 'timer' && !isRunning && (
          <div className="timer-input-wrapper" ref={controlsRef}>
            <TimerInput 
              presetTime={presetTime}
              onTimeChange={handlePresetTimeChange}
              soundEnabled={soundEnabled}
            />
          </div>
        )}
        
        <div className="controls-wrapper" ref={controlsRef}>
          <Controls
            isRunning={isRunning}
            mode={mode}
            onStart={handleStart}
            onStop={handleStop}
            onLap={handleLap}
            onReset={handleReset}
          />
        </div>
        
        <div className="laps-wrapper" ref={lapsRef}>
          {mode === 'stopwatch' && (
            <>
              <div className="performance-graph">
                <svg width="100%" height="50" viewBox="0 0 500 50" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="var(--gradient-start)" />
                      <stop offset="50%" stopColor="var(--gradient-mid)" />
                      <stop offset="100%" stopColor="var(--gradient-end)" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,25 C50,15 100,35 150,25 C200,15 250,35 300,15 C350,5 400,30 450,25 C480,22 500,15 500,15"
                    className="wave-path"
                  />
                </svg>
              </div>
              <LapList laps={laps} />
            </>
          )}
        </div>
      </main>
      
      {showSettings && (
        <Settings
          theme={theme}
          colorScheme={colorScheme}
          shakeToControl={shakeToControl}
          rotationEnabled={rotationEnabled}
          soundEnabled={soundEnabled}
          onToggleTheme={toggleTheme}
          onChangeColorScheme={cycleColorScheme}
          onToggleShakeControl={() => setShakeToControl(!shakeToControl)}
          onToggleRotation={() => setRotationEnabled(!rotationEnabled)}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onClose={toggleSettings}
        />
      )}
      
      <footer className="app-footer">
        <p>
          {shakeToControl ? "Shake to Start/Stop enabled" : "Swipe left/right for Lap/Reset"}
        </p>
      </footer>
    </div>
  );
};

export default App;