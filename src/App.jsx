import { useState, useEffect, useRef } from 'react';
import TimerCircle from './components/TimerCircle';
import LapList from './components/LapList';
import Controls from './components/Controls';
import TimerInput from './components/TimerInput';
import Settings from './components/Settings';

function App() {
  const [time, setTime] = useState(0);
  const [laps, setLaps] = useState([]);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState('stopwatch');
  const [totalTime, setTotalTime] = useState(60 * 1000);
  const [theme, setTheme] = useState('dark');
  const [colorScheme, setColorScheme] = useState('magenta');
  const [glowEffect, setGlowEffect] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shakeEnabled, setShakeEnabled] = useState(true);
  const [focusSuggestion, setFocusSuggestion] = useState(null);

  const appRef = useRef(null);
  const intervalRef = useRef(null);
  const canvasRef = useRef(null);

  const toggleMode = () => {
    setMode(mode === 'stopwatch' ? 'timer' : 'stopwatch');
    setTime(0);
    setLaps([]);
    setIsRunning(false);
    setTotalTime(mode === 'stopwatch' ? 5 * 60 * 1000 : 60 * 1000);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const cycleColorScheme = () => {
    const schemes = ['cyan', 'purple', 'green', 'orange', 'magenta'];
    setColorScheme(schemes[(schemes.indexOf(colorScheme) + 1) % schemes.length]);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleGlow = () => {
    setGlowEffect(!glowEffect);
  };

  const handleShake = () => {
    if (!shakeEnabled) return;
    setIsRunning(!isRunning);
  };

  const handleStartStop = () => {
    setIsRunning(!isRunning);
  };

  const handleLapReset = () => {
    if (mode === 'stopwatch') {
      if (isRunning) {
        setLaps([...laps, time - (laps.length > 0 ? laps[laps.length - 1] : 0)]);
      } else {
        setTime(0);
        setLaps([]);
      }
    } else {
      setTime(totalTime);
      setIsRunning(false);
    }
  };

  const handleTimeInput = (newTime) => {
    setTotalTime(newTime);
    setTime(newTime);
    setIsRunning(false);
  };

  // Timer/Stopwatch Logic
  useEffect(() => {
    if (!isRunning) {
      clearInterval(intervalRef.current);
      return;
    }

    intervalRef.current = setInterval(() => {
      if (mode === 'stopwatch') {
        setTime((prevTime) => prevTime + 10);
      } else {
        setTime((prevTime) => {
          const newTime = prevTime - 10;
          if (newTime <= 0) {
            setIsRunning(false);
            return 0;
          }
          return newTime;
        });
      }
    }, 10);

    return () => clearInterval(intervalRef.current);
  }, [isRunning, mode]);

  // Particle system for background with trails
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let particles = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = () => {
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: (Math.random() - 0.5) * 1.5,
        opacity: Math.random() * 0.5 + 0.5,
        trail: [], // Array to store previous positions for the trail
        maxTrailLength: 10, // Number of trail positions to store
      };
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < 30; i++) {
        particles.push(createParticle());
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        // Adjust speed based on mode when running
        let speedMultiplier = 1; // Default speed when not running
        if (isRunning) {
          if (mode === 'stopwatch') {
            speedMultiplier = 0.3; // Slow down for stopwatch
          } else if (mode === 'timer') {
            speedMultiplier = 1.5; // Speed up for timer
          }
        }

        // Update position
        particle.x += particle.speedX * speedMultiplier;
        particle.y += particle.speedY * speedMultiplier;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        // Add current position to trail
        particle.trail.push({ x: particle.x, y: particle.y });
        if (particle.trail.length > particle.maxTrailLength) {
          particle.trail.shift(); // Remove oldest position
        }

        // Draw the trail (fading dots behind the particle)
        particle.trail.forEach((pos, index) => {
          const trailOpacity = particle.opacity * (index / particle.maxTrailLength); // Fade effect
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, particle.size * (1 - index / particle.maxTrailLength), 0, Math.PI * 2); // Smaller size as trail fades
          ctx.fillStyle = `rgba(255, 255, 255, ${trailOpacity})`;
          ctx.fill();
        });

        // Draw the main particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animateParticles);
    };

    resizeCanvas();
    initParticles();
    animateParticles();

    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, [isRunning, mode]);

  return (
    <div
      key={colorScheme}
      className={`app-container ${theme} ${colorScheme}`}
      ref={appRef}
      data-theme={theme}
      data-color-scheme={colorScheme}
      data-glow={glowEffect}
    >
      <canvas ref={canvasRef} className="bg-particles" />
      <div className="app-header">
        <h1 className="app-title">TimeMaster</h1>
        <div className="header-controls">
          <button
            className="mode-toggle"
            onClick={toggleMode}
            aria-label={mode === 'stopwatch' ? 'Switch to Timer' : 'Switch to Stopwatch'}
          >
            {mode === 'stopwatch' ? '⏱️' : '⏲️'}
          </button>
          <button
            className="settings-toggle"
            onClick={toggleSettings}
            aria-label="Open Settings"
          >
            ⚙️
          </button>
        </div>
      </div>

      <main className="app-main">
        <TimerCircle time={time} isRunning={isRunning} mode={mode} totalTime={totalTime} />
        {mode === 'timer' && !isRunning && (
          <TimerInput onTimeInput={handleTimeInput} totalTime={totalTime} />
        )}
        <Controls
          isRunning={isRunning}
          onStartStop={handleStartStop}
          onLapReset={handleLapReset}
          mode={mode}
          time={time}
          totalTime={totalTime}
          shakeEnabled={shakeEnabled}
          onShake={handleShake}
        />
        {mode === 'stopwatch' && <LapList laps={laps} />}
        {focusSuggestion && (
          <div className="focus-suggestion">
            {focusSuggestion}
            <button onClick={() => setFocusSuggestion(null)} aria-label="Dismiss Suggestion">
              Dismiss
            </button>
          </div>
        )}
      </main>

      <footer className="app-footer">
        Shake to Start/Stop {shakeEnabled ? 'enabled' : 'disabled'}
      </footer>

      {settingsOpen && (
        <Settings
          onClose={toggleSettings}
          theme={theme}
          toggleTheme={toggleTheme}
          glowEffect={glowEffect}
          toggleGlow={toggleGlow}
          colorScheme={colorScheme}
          cycleColorScheme={cycleColorScheme}
          shakeEnabled={shakeEnabled}
          setShakeEnabled={setShakeEnabled}
        />
      )}
    </div>
  );
}

export default App;