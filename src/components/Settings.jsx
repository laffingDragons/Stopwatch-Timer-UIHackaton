import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

const Settings = ({ 
  theme,
  colorScheme,
  shakeToControl,
  rotationEnabled,
  soundEnabled,
  onToggleTheme,
  onChangeColorScheme,
  onToggleShakeControl,
  onToggleRotation,
  onToggleSound,
  onClose
}) => {
  const settingsRef = useRef(null);
  
  // Colors for the color schemes
  const colorSchemes = {
    cyan: { name: 'Cyan', color: '#00ccff' },
    purple: { name: 'Purple', color: '#aa22ff' },
    green: { name: 'Green', color: '#00ff88' },
    orange: { name: 'Orange', color: '#ff6622' },
    rainbow: { name: 'Rainbow', color: 'linear-gradient(90deg, #ff0000, #ffaa00, #00ff00, #00ccff, #aa22ff)' }
  };
  
  // Entry animation
  useEffect(() => {
    if (settingsRef.current) {
      anime({
        targets: settingsRef.current,
        translateX: ['100%', '0%'],
        opacity: [0, 1],
        duration: 500,
        easing: 'easeOutQuad'
      });
      
      // Staggered animation for settings items
      anime({
        targets: '.settings-item',
        translateX: [50, 0],
        opacity: [0, 1],
        delay: anime.stagger(100),
        duration: 500,
        easing: 'easeOutQuad'
      });
    }
  }, []);
  
  // Handle close with animation
  const handleClose = () => {
    anime({
      targets: settingsRef.current,
      translateX: ['0%', '100%'],
      opacity: [1, 0],
      duration: 500,
      easing: 'easeInQuad',
      complete: onClose
    });
  };
  
  // Animate button press
  const animateButton = (target) => {
    anime({
      targets: target,
      scale: [1, 0.95, 1],
      duration: 300,
      easing: 'easeInOutQuad'
    });
  };
  
  return (
    <div className="settings-panel" ref={settingsRef}>
      <div className="settings-header">
        <h2 className="settings-title">Settings</h2>
        <button className="close-button" onClick={handleClose}>×</button>
      </div>
      
      <div className="settings-content">
        <div className="settings-item">
          <span className="settings-label">Theme</span>
          <button 
            className="toggle-button theme-toggle-btn"
            onClick={(e) => {
              onToggleTheme();
              animateButton(e.currentTarget);
            }}
          >
            <span className="toggle-label">{theme === 'dark' ? 'Dark' : 'Light'}</span>
            <span className="toggle-icon">{theme === 'dark' ? '🌙' : '☀️'}</span>
          </button>
        </div>
        
        <div className="settings-item">
          <span className="settings-label">Color Scheme</span>
          <div className="color-scheme-selector">
            <button 
              className="color-scheme-button"
              onClick={(e) => {
                onChangeColorScheme();
                animateButton(e.currentTarget);
              }}
              style={{
                background: typeof colorSchemes[colorScheme].color === 'string' && 
                           colorSchemes[colorScheme].color.includes('gradient') ? 
                           colorSchemes[colorScheme].color : 'transparent',
                borderColor: typeof colorSchemes[colorScheme].color === 'string' && 
                           !colorSchemes[colorScheme].color.includes('gradient') ? 
                           colorSchemes[colorScheme].color : 'transparent'
              }}
            >
              <span className="color-name">{colorSchemes[colorScheme].name}</span>
              {!colorSchemes[colorScheme].color.includes('gradient') && (
                <span className="color-dot" style={{ backgroundColor: colorSchemes[colorScheme].color }}></span>
              )}
            </button>
            <span className="hint-text">Click to cycle colors</span>
          </div>
        </div>
        
        <div className="settings-item">
          <span className="settings-label">Shake to Control</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={shakeToControl}
              onChange={(e) => {
                onToggleShakeControl();
                animateButton(e.currentTarget.parentElement);
              }}
            />
            <span className="slider round"></span>
          </label>
        </div>
        
        <div className="settings-item">
          <span className="settings-label">3D Rotation</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={rotationEnabled}
              onChange={(e) => {
                onToggleRotation();
                animateButton(e.currentTarget.parentElement);
              }}
            />
            <span className="slider round"></span>
          </label>
        </div>
        
        <div className="settings-item">
          <span className="settings-label">Sound Effects</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={soundEnabled}
              onChange={(e) => {
                onToggleSound();
                animateButton(e.currentTarget.parentElement);
              }}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
      
      <div className="settings-footer">
        <button className="reset-button" onClick={handleClose}>Close</button>
      </div>
    </div>
  );
};

export default Settings;