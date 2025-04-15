import { useState, useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';
import TimerCircle from './components/TimerCircle';
import LapList from './components/LapList';
import Controls from './components/Controls';
import TimerInput from './components/TimerInput';
import Settings from './components/Settings';

const App = () => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const [mode, setMode] = useState('stopwatch');
  const [presetTime, setPresetTime] = useState(60 * 1000);
  const [remainingTime, setRemainingTime] = useState(60 * 1000);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('dark');
  const [colorScheme, setColorScheme] = useState('cyan');
  const [shakeToControl, setShakeToControl] = useState(false);
  const [rotationEnabled, setRotationEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [glowEffect, setGlowEffect] = useState(true); // NEW: Toggle for glow effect

  const timerCompleteSound = useRef(new Audio('/sounds/timer-complete.mp3'));
  const buttonClickSound = useRef(new Audio('/sounds/button-click.mp3'));

  const appRef = useRef(null);
  const timerContainerRef = useRef(null);
  const controlsRef = useRef(null);
  const lapsRef = useRef(null);
  const intervalRef = useRef(null);

  const shakeThreshold = 15;
  const lastShakeTime = useRef(0);
  const accelerometer = useRef({ x: 0, y: 0, z: 0 });

  // Audio cleanup
  useEffect(() => {
    timerCompleteSound.current.muted = !soundEnabled;
    buttonClickSound.current.muted = !soundEnabled;

    return () => {
      timerCompleteSound.current.pause();
      buttonClickSound.current.pause();
    };
  }, [soundEnabled]);

  // Shake detection
  useEffect(() => {
    const handleDeviceMotion = (event) => {
      if (!shakeToControl) return;
      const { accelerationIncludingGravity } = event;
      if (!accelerationIncludingGravity) return;

      const { x, y, z } = accelerationIncludingGravity;
      const currentTime = Date.now();

      if ((currentTime - lastShakeTime.current) > 500) {
        const deltaX = Math.abs(x - accelerometer.current.x);
        const deltaY = Math.abs(y - accelerometer.current.y);
        const deltaZ = Math.abs(z - accelerometer.current.z);

        if (
          (deltaX > shakeThreshold && deltaY > shakeThreshold) ||
          (deltaX > shakeThreshold && deltaZ > shakeThreshold) ||
          (deltaY > shakeThreshold && deltaZ > shakeThreshold)
        ) {
          if (isRunning) {
            handleStop();
          } else {
            handleStart();
          }
          lastShakeTime.current = currentTime;
        }
      }

      accelerometer.current = { x, y, z };
    };

    if (shakeToControl) {
      window.addEventListener('devicemotion', handleDeviceMotion);
    }

    return () => {
      window.removeEventListener('devicemotion', handleDeviceMotion);
    };
  }, [shakeToControl, isRunning]);

  // 3D rotation effect
  useEffect(() => {
    if (rotationEnabled) {
      const handleMouseMove = (e) => {
        if (!timerContainerRef.current) return;
        const timerRect = timerContainerRef.current.getBoundingClientRect();
        const centerX = timerRect.left + timerRect.width / 2;
        const centerY = timerRect.top + timerRect.height / 2;

        const rotateY = ((e.clientX - centerX) / (timerRect.width / 2)) * 10;
        const rotateX = -((e.clientY - centerY) / (timerRect.height / 2)) * 10;

        anime({
          targets: timerContainerRef.current,
          rotateX: rotateX,
          rotateY: rotateY,
          duration: 400,
          easing: 'easeOutQuad',
        });
      };

      window.addEventListener('mousemove', handleMouseMove);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [rotationEnabled]);

  // Initial animations
  useEffect(() => {
    anime({
      targets: timerContainerRef.current,
      scale: [0.5, 1],
      opacity: [0, 1],
      translateZ: [-200, 0],
      rotateX: [-30, 0],
      rotateY: [20, 0],
      duration: 1500,
      easing: 'cubicBezier(0.19, 1, 0.22, 1)',
    });

    anime({
      targets: [controlsRef.current, lapsRef.current],
      opacity: [0, 1],
      translateY: [30, 0],
      delay: anime.stagger(200, { start: 400 }),
      duration: 1000,
      easing: 'easeOutQuad',
    });
  }, []);

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        if (mode === 'stopwatch') {
          setTime((prev) => prev + 10);
        } else {
          setRemainingTime((prev) => {
            const newTime = Math.max(0, prev - 10);
            if (newTime <= 0) {
              handleTimerComplete();
            }
            return newTime;
          });
        }
      }, 10);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    if (soundEnabled) {
      timerCompleteSound.current.play().catch((e) => console.error('Error playing sound:', e));
    }
    anime({
      targets: timerContainerRef.current,
      scale: [1, 1.1, 1],
      opacity: [1, 0.7, 1],
      duration: 1000,
      easing: 'easeInOutQuad',
    });
  };

  const toggleMode = () => {
    if (isRunning) {
      handleStop();
    }
    setTime(0);
    setRemainingTime(presetTime);
    setLaps([]);
    setMode((prev) => (prev === 'stopwatch' ? 'timer' : 'stopwatch'));
    if (soundEnabled) {
      buttonClickSound.current.play().catch((e) => console.error('Error playing sound:', e));
    }
  };

  const handlePresetTimeChange = (newTime) => {
    setPresetTime(newTime);
    setRemainingTime(newTime);
  };

  const handleStart = () => {
    setIsRunning(true);
    if (soundEnabled) {
      buttonClickSound.current.play().catch((e) => console.error('Error playing sound:', e));
    }
    anime({
      targets: appRef.current,
      scale: [0.98, 1],
      duration: 500,
      easing: 'easeOutElastic(1, .5)',
    });
  };

  const handleStop = () => {
    setIsRunning(false);
    if (soundEnabled) {
      buttonClickSound.current.play().catch((e) => console.error('Error playing sound:', e));
    }
    anime({
      targets: appRef.current,
      scale: [1.02, 1],
      duration: 300,
      easing: 'easeOutQuad',
    });
  };

  const handleLap = () => {
    if (mode === 'stopwatch' && isRunning) { // FIX: Only allow laps in stopwatch mode when running
      setLaps([time, ...laps]);
      if (soundEnabled) {
        buttonClickSound.current.play().catch((e) => console.error('Error playing sound:', e));
      }
    }
  };

  const handleReset = () => {
    if (mode === 'stopwatch') {
      setTime(0);
      setLaps([]);
    } else {
      setRemainingTime(presetTime); // FIX: Reset to preset time in timer mode
    }
    setIsRunning(false);
    if (soundEnabled) {
      buttonClickSound.current.play().catch((e) => console.error('Error playing sound:', e));
    }
  };

  const toggleSettings = () => {
    setShowSettings(!showSettings);
    if (soundEnabled) {
      buttonClickSound.current.play().catch((e) => console.error('Error playing sound:', e));
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    if (soundEnabled) {
      buttonClickSound.current.play().catch((e) => console.error('Error playing sound:', e));
    }
  };

  const cycleColorScheme = () => {
    const schemes = ['cyan', 'purple', 'green', 'orange', 'rainbow'];
    setColorScheme(schemes[(schemes.indexOf(colorScheme) + 1) % schemes.length]);
    if (soundEnabled) {
      buttonClickSound.current.play().catch((e) => console.error('Error playing sound:', e));
    }
  };

  return (
    <div
      className={`app-container ${theme} ${colorScheme}`}
      ref={appRef}
      data-theme={theme}
      data-color-scheme={colorScheme}
      data-glow={glowEffect} // NEW: Glow effect attribute
    >
      <header className="app-header">
        <h1 className="app-title">TimeMaster</h1> {/* NEW: Added title for branding */}
        <div className="header-controls">
          <button
            className="mode-toggle"
            onClick={toggleMode}
            aria-label={mode === 'stopwatch' ? 'Switch to Timer' : 'Switch to Stopwatch'} // FIX: Accessibility
          >
            {mode === 'stopwatch' ? '⏱️' : '⏲️'}
          </button>
          <button
            className="settings-toggle"
            onClick={toggleSettings}
            aria-label="Open Settings" // FIX: Accessibility
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
            totalTime={mode === 'stopwatch' ? 60 * 1000 : presetTime}
          />
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

        {mode === 'stopwatch' && (
          <div className="laps-wrapper" ref={lapsRef}>
            <LapList laps={laps} />
          </div>
        )}
      </main>

      {showSettings && (
        <Settings
          theme={theme}
          colorScheme={colorScheme}
          shakeToControl={shakeToControl}
          rotationEnabled={rotationEnabled}
          soundEnabled={soundEnabled}
          glowEffect={glowEffect} // NEW: Glow effect setting
          onToggleTheme={toggleTheme}
          onChangeColorScheme={cycleColorScheme}
          onToggleShakeControl={() => setShakeToControl(!shakeToControl)}
          onToggleRotation={() => setRotationEnabled(!rotationEnabled)}
          onToggleSound={() => setSoundEnabled(!soundEnabled)}
          onToggleGlowEffect={() => setGlowEffect(!glowEffect)} // NEW: Glow effect toggle
          onClose={toggleSettings}
        />
      )}

      <footer className="app-footer">
        <p>{shakeToControl && 'Shake to Start/Stop enabled'}</p>
      </footer>
    </div>
  );
};

export default App;