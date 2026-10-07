# ASTRION 2026 // INNOVATE BEYOND BOUNDARIES

> An aerospace and deep-space-themed national tech & cultural fest web portal inspired by *Interstellar*, featuring Gargantua cosmic simulations, interactive flight launch transitions, holographic planetary briefings, dynamic mission boarding passes, and a 6-deck crew manifest.

---

## 🚀 Overview

**ASTRION 2026** is the flagship inter-collegiate festival organized in collaboration with the **Institution's Innovation Council (IIC)** and **VVIT**. Designed with an authentic deep-space aesthetic, this web portal delivers an immersive cinematic experience from the moment attendees enter orbit.

- **Dates**: November 23 – 24, 2026
- **Theme**: *Innovate Beyond Boundaries* (Gargantua & Nolan-inspired deep space exploration)
- **Official Accreditations**: Ministry of Education's Innovation Cell (IIC) & VVITU

---

 

## 🛠️ Technology Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool & Bundler**: [Vite 8](https://vitejs.dev/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Graphics & 3D**: [Three.js](https://threejs.org/) & Canvas API
- **QR Generation**: [QRCode](https://www.npmjs.com/package/qrcode)
- **Celebration Effects**: [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Linter**: [Oxlint](https://oxc.rs/)

---

## 📦 Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (or pnpm / yarn)

Verify your installations:
```bash
node -v
npm -v
```

---

## 📥 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SIVANAIK05/fest.git
   cd fest
   ```

2. **Install dependencies**:
   ```bash
   npm install

## 💻 Running the Project

### Development Server
Start the local development server with hot module replacement (HMR):
```bash
npm run dev
```

Once started, open your browser and navigate to:
```
http://localhost:5173/
```

### Production Build
Create an optimized, minified production bundle in the `dist/` directory:
```bash
npm run build
```

### Preview Production Build
Locally test and preview the production build output:
```bash
npm run preview
```

### Linting
Run Oxlint to check code quality and standards:
```bash
npm run lint
```

---

## 📂 Project Structure

```
fest/
├── public/
│   ├── animated.mp4          # Hero background cosmic video
│   ├── images/               # High-res aerospace & astronaut photography
│   ├── favicon.svg           # Mission crest favicon
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── AstronautHeroParallax.jsx  # Multi-layer astronaut parallax & video background
│   │   ├── CosmicParticleField.jsx    # 3D stardust & relativistic warp canvas
│   │   ├── EchoesSection.jsx          # Memories archive carousel
│   │   ├── EventModal.jsx             # Mission briefing popup dialog
│   │   ├── EventsSection.jsx          # Planetary competition grid
│   │   ├── Footer.jsx                 # Mission control telemetry footer
│   │   ├── Hero.jsx                   # Central cinematic banner & CTAs
│   │   ├── MissionPartnersSection.jsx # Sponsor & institutional badges
│   │   ├── MissionSection.jsx         # Section 01 mission statement & stats
│   │   ├── Navbar.jsx                 # Fixed telemetry navigation bar & audio toggle
│   │   ├── PassVerificationModal.jsx  # QR code security verification dialog
│   │   ├── RegistrationSection.jsx    # Multi-step registration & boarding pass generator
│   │   ├── SpaceshipLaunch.jsx        # 5-stage vertical shuttle launch transition
│   │   ├── TheCrewSection.jsx         # 6-panel flight personnel manifest & dossiers
│   │   ├── TiltCard.jsx               # 3D interactive tilt container
│   │   └── VenueSpotsSection.jsx      # Campus venue hotspots & coordinates
│   ├── data/
│   │   ├── crewData.js                # 72+ crew personnel manifest across 6 decks
│   │   └── eventsData.js              # Technical & Non-Technical event details
│   ├── utils/
│   │   ├── audioEngine.js             # Web Audio API sound generator & video audio
│   │   └── passGenerator.js           # Cockpit pass rendering & PNG export
│   ├── App.jsx                        # Application root & smooth scroll orchestration
│   ├── index.css                      # Aerospace design tokens & animations
│   └── main.jsx                       # React DOM entry point
├── package.json                       # Scripts and project dependencies
├── vite.config.js                     # Vite build configuration
└── README.md                          # Documentation and setup guide
```

---

## 🛡️ License

This project is built for the **Astrion 2026** festival. All rights reserved by **IIC & VVIT**.
