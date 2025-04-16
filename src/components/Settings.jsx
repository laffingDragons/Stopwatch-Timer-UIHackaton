import { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';


const Settings = ({
  onClose,
  theme,
  toggleTheme,
  glowEffect,
  toggleGlow,
  colorScheme,
  cycleColorScheme,
  shakeEnabled,
  setShakeEnabled
}) => {
  const colorSchemes = {
    cyan: { name: 'Cyan', color: '#00ccff' },
    purple: { name: 'Purple', color: '#aa22ff' },
    green: { name: 'Green', color: '#00ff88' },
    orange: { name: 'Orange', color: '#ff6622' },
    magenta: { name: 'Magenta', color: '#ff3399' },
  };

  return (
    <div className="settings-panel">
      <div className="settings-header">
        <h2>Settings</h2>
        <button
          className="close-button"
          onClick={onClose}
          aria-label="Close Settings"
        >
          ✕
        </button>
      </div>
      <div className="settings-content">
        <div className="settings-item">
          <span>Theme: {theme === 'dark' ? 'Dark' : 'Light'}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={theme === 'light'}
              onChange={toggleTheme}
              aria-label="Toggle Theme"
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="settings-item">
          <span>Glow Effect: {glowEffect ? 'On' : 'Off'}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={glowEffect}
              onChange={toggleGlow}
              aria-label="Toggle Glow Effect"
            />
            <span className="slider"></span>
          </label>
        </div>
        <div className="settings-item">
          <span>Color Scheme: {colorSchemes[colorScheme]?.name || 'Unknown'}</span>
          <button
            className="color-scheme-button"
            onClick={cycleColorScheme}
            aria-label="Change Color Scheme"
          >
            <span
              className="color-dot"
              style={{ backgroundColor: colorSchemes[colorScheme]?.color }}
            ></span>
            Change Color
          </button>
        </div>
        <div className="settings-item">
          <span>Shake to Start/Stop: {shakeEnabled ? 'Enabled' : 'Disabled'}</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={shakeEnabled}
              onChange={() => setShakeEnabled(!shakeEnabled)}
              aria-label="Toggle Shake to Start/Stop"
            />
            <span className="slider"></span>
          </label>
        </div>
        <p className="hint-text">Hint: Toggle settings to customize your experience!</p>
      </div>
    </div>
  );
};

export default Settings;