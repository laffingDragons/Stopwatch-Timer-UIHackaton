# Futuristic Stopwatch/Timer

A modern, sleek stopwatch and timer application with futuristic 3D effects, neon glowing elements, and smooth animations.

![Futuristic Stopwatch](screenshot.png)

## Features

- **Dual Mode:** Switch between Stopwatch and Timer functionality
- **3D Effects:** Multi-layered parallax UI with depth and perspective
- **Neon Glow:** Dynamic glowing elements that respond to interaction
- **Gradient Trail:** Colorful progress indicator with smooth gradient
- **Multiple Themes:** Various color schemes to match your preference
- **Mobile Responsive:** Fully responsive design that works on all devices
- **Gesture Control:** Swipe gestures for mobile interaction and optional shake-to-control
- **Sound Effects:** Audio feedback for timer completion and interactions

## Live Demo

Check out the live demo: [Futuristic Stopwatch](https://yourusername.github.io/futuristic-stopwatch)

## Technologies Used

- **React** - Component-based UI architecture
- **Anime.js** - Smooth and sophisticated animations
- **SVG** - Advanced vector graphics for the timer interface
- **CSS3** - Modern styling with 3D transforms and effects
- **@use-gesture/react** - Touch and gesture interactions

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/futuristic-stopwatch.git
   ```

2. Navigate to the project directory:
   ```bash
   cd futuristic-stopwatch
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Deployment

To deploy to GitHub Pages:

1. Update the `homepage` in `package.json` with your GitHub username
2. Update the `base` in `vite.config.js` with your repository name
3. Run the deployment script:
   ```bash
   npm run deploy
   ```

## Usage

- **Start/Stop:** Begin or pause the timer
- **Lap/Reset:** In stopwatch mode, record lap times; in timer mode, reset the timer
- **Mode Switch:** Toggle between stopwatch and timer functionality
- **Settings:** Access theme options, sound settings, and other preferences
- **Timer Preset:** In timer mode, set a custom countdown duration

## Customization

### Color Schemes

The application comes with multiple built-in color schemes:
- Cyan (default)
- Purple
- Green
- Orange
- Rainbow

Choose your preferred scheme in the settings panel.

### Settings

Access the settings panel by clicking the gear icon to customize:
- Theme (Dark/Light)
- Color Scheme
- 3D Rotation Effects
- Sound Effects
- Gesture Controls

## Project Structure

```
futuristic-stopwatch/
├── .gitignore
├── index.html
├── package.json
├── README.md
├── vite.config.js
└── src/
    ├── App.jsx
    ├── index.jsx
    ├── index.css
    ├── components/
    │   ├── TimerCircle.jsx
    │   ├── Controls.jsx
    │   ├── LapList.jsx
    │   ├── Settings.jsx
    │   └── TimerInput.jsx
    └── assets/
        ├── sounds/
        │   ├── button-click.mp3
        │   └── timer-complete.mp3
        └── fonts/
            └── Orbitron/
                └── [font files]
```

## Browser Support

The application is optimized for modern browsers that support:
- CSS 3D Transforms
- SVG Animations
- JavaScript ES6+

For the best experience, we recommend using the latest versions of Chrome, Firefox, Safari, or Edge.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Anime.js](https://animejs.com/) for the animation library
- [React](https://reactjs.org/) for the UI framework
- [use-gesture](https://use-gesture.netlify.app/) for gesture handling

---

Built with ❤️ and a lot of ⚡ neon glow
