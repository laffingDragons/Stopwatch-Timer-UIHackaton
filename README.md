
<div align="center">
  <img src="https://via.placeholder.com/150.png?text=TimeMaster+Logo" alt="TimeMaster Logo" width="150"/>
  <h1>TimeMaster: Stopwatch & Timer</h1>
  <p>
    <strong>A sleek, interactive web app for time tracking with stunning neomorphic design and dynamic particle effects.</strong>
  </p>
  <p>
    Built for the <strong>UI Hackathon 2025</strong> by <a href="https://www.linkedin.com/in/akkshay-paatil/">Akkshay Paatil</a> and the LaffingDragons team.
  </p>

  <a href="https://github.com/laffingDragons/Stopwatch-Timer-UIHackaton">
    <img src="https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github" alt="GitHub Repository"/>
  </a>
  <a href="https://laffingdragons.github.io/Stopwatch-Timer-UIHackaton">
    <img src="https://img.shields.io/badge/Live%20Demo-Visit%20Now-green?style=for-the-badge" alt="Live Demo"/>
  </a>
</div>

---

## 🏆 Hackathon Winner: Best UI/UX Design

**TimeMaster** won the **Best UI/UX Design Award** at the UI Hackathon 2025! 🎉 Judges praised its modern neomorphic design, intuitive interactions, and mesmerizing background effects that enhance the user experience without distraction.

---

## 🌟 About TimeMaster

TimeMaster is not just a stopwatch and timer—it's an experience. Designed with a focus on aesthetics and functionality, this web app combines a futuristic **neomorphic UI** with subtle, dynamic particle effects to create a time-tracking tool that’s as beautiful as it is practical. Whether you're timing a workout, a study session, or a cooking recipe, TimeMaster makes every second visually engaging.

### Key Features
- **Dual Modes**: Seamlessly switch between **Stopwatch** and **Timer** modes with a single click.
- **Neomorphic Design**: Boxy, tactile buttons with a press-in effect for a modern, premium feel.
- **Dynamic Particle Trails**: Background particles with trails that follow their movement, slowing down in stopwatch mode and speeding up in timer mode for an immersive experience.
- **Shake to Start/Stop**: Intuitive shake detection for hands-free control on mobile devices.
- **Customizable Presets**: Quick timer presets (1m, 3m, 5m, 10m) with animated feedback.
- **Responsive Layout**: Works flawlessly on desktop, tablet, and mobile devices.
- **Light/Dark Themes**: Toggle between themes with a glow effect for enhanced visibility.

---

## 🚀 Live Demo

Try TimeMaster now!  
👉 [Live Demo](https://laffingdragons.github.io/Stopwatch-Timer-UIHackaton)

Watch the particles slow down as the stopwatch runs, or speed up as the timer counts down—an effect that wowed the hackathon judges!

---

## 🎥 Screenshots

<div align="center">
  <img src="https://via.placeholder.com/600x300.png?text=Stopwatch+Mode" alt="Stopwatch Mode" width="300"/>
  <img src="https://via.placeholder.com/600x300.png?text=Timer+Mode" alt="Timer Mode" width="300"/>
  <p><em>Left: Stopwatch mode with slowed particle trails. Right: Timer mode with accelerated particle trails.</em></p>
</div>

---

## 🛠️ Tech Stack

- **Frontend**: React.js for a modular, component-based architecture.
- **Styling**: CSS with custom variables for themes and color schemes.
- **Animations**: Anime.js for smooth button presses and particle effects.
- **Canvas API**: Used for rendering dynamic particle trails in the background.
- **Device Motion API**: Enables shake-to-start/stop functionality on mobile devices.

---

## ✨ What Makes TimeMaster Stand Out?

### 1. Neomorphic UI
We ditched traditional flat buttons for a **neomorphic design**, giving the controls a tactile, 3D feel. The buttons feature a subtle press-in animation, making interactions satisfying and intuitive.

### 2. Dynamic Particle Trails
The background isn’t just a static layer—it’s alive! Each particle has a fading trail that follows its movement:
- In **Stopwatch** mode, particles slow down to 30% speed, creating a calming effect as time progresses.
- In **Timer** mode, particles speed up to 150% speed, adding urgency as the countdown ticks down.
- Trails are rendered using the Canvas API, ensuring smooth performance even on low-end devices.

### 3. Bug-Free Experience
We tackled common issues head-on:
- Fixed an infinite loop in the timer input logic (`TimerInput.jsx`) to ensure smooth state updates.
- Separated stopwatch and timer logic for reliable, independent operation.
- Removed visual glitches in button animations for a polished user experience.

### 4. Accessibility & Responsiveness
- Keyboard navigation support for all controls.
- Responsive design that adapts to any screen size.
- High-contrast themes (light/dark) for better visibility.

---

## 🏃‍♂️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/laffingDragons/Stopwatch-Timer-UIHackaton.git
   cd Stopwatch-Timer-UIHackaton
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open http://localhost:3000 in your browser to see TimeMaster in action!

### Usage
- **Switch Modes**: Use the / button in the header to toggle between Stopwatch and Timer modes.
- **Set a Timer**: In Timer mode, adjust hours, minutes, and seconds using the wave inputs, or select a preset (e.g., 5m).
- **Start/Stop**: Press the START/STOP button, or shake your device (on mobile) to toggle the timer/stopwatch.
- **Lap/Reset**: In Stopwatch mode, add laps while running or reset when stopped. In Timer mode, reset to the initial time.
- **Customize**: Open the settings () to toggle themes, glow effects, and shake functionality.

---

## Contributing
We welcome contributions! To contribute:
1. Fork the repository.
2. Create a new branch (git checkout -b feature/your-feature).
3. Commit your changes (git commit -m "Add your feature").
4. Push to your branch (git push origin feature/your-feature).
5. Open a Pull Request.

Please ensure your code follows our contributing guidelines (CONTRIBUTING.md).

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## About the Team
TimeMaster was created by the LaffingDragons team for the UI Hackathon 2025. I’m Akkshay Paatil, the lead developer and UI/UX enthusiast behind this project. Connect with me on LinkedIn to chat about design, code, or hackathons!
<div align="center">
  <strong>Made with ❤️ by LaffingDragons</strong>
</div>
