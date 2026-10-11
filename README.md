# ASTRION 2026 // INNOVATE BEYOND BOUNDARIES

> An aerospace and deep-space-themed national tech & cultural fest web portal inspired by *Interstellar*, featuring Gargantua cosmic simulations, 3D interactive flight launch transitions, holographic planetary briefings, dynamic mission boarding passes, and a centralized full-stack registration system.

---

## 🚀 Overview

**ASTRION 2026** is the flagship inter-collegiate festival organized in collaboration with the **Institution's Innovation Council (IIC)** and **VVIT**. Designed with an authentic deep-space aesthetic, this web portal delivers an immersive cinematic experience from the moment attendees enter orbit.

- **Dates**: October 23 – 24, 2026
- **Theme**: *Innovate Beyond Boundaries* (Gargantua & Nolan-inspired deep space exploration)
- **Official Accreditations**: Ministry of Education's Innovation Cell (IIC) & VVITU
- **Architecture**: Decoupled Full-Stack Architecture (React/Vite Frontend + Express/Supabase Backend)

---

## 🛠️ Technology Stack

### Frontend Client
- **Framework**: [React 19](https://react.dev/)
- **Build Tool & Bundler**: [Vite 8](https://vitejs.dev/)
- **Graphics & 3D**: [Three.js](https://threejs.org/) & HTML5 Canvas API
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Generation**: [QRCode](https://www.npmjs.com/package/qrcode)
- **Audio Engine**: Custom Web Audio API Synthesizer & Soundtrack controller
- **Celebration Effects**: [Canvas-Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Linter**: [Oxlint](https://oxc.rs/)

### Backend Service
- **Runtime**: [Node.js](https://nodejs.org/) (ES Modules)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database & Auth**: [Supabase](https://supabase.com/) (`@supabase/supabase-js`)
- **Security & Utilities**: CORS, Dotenv

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

## 📥 Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/SIVANAIK05/fest.git
cd fest
```

### 2. Configure Backend Service
```bash
cd backend
npm install
```

Create your backend `.env` file from the template:
```bash
cp .env.example .env
```

Edit `backend/.env` with your Supabase credentials:
```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
```

### 3. Configure Frontend Client
```bash
cd ../frontend
npm install
```

Create your frontend `.env` file from the template:
```bash
cp .env.example .env
```

Edit `frontend/.env` with your backend server URL and public Supabase credentials:
```env
VITE_BACKEND_URL=http://localhost:3000
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

> 🔒 **Security Notice**: All `.env` files are strictly excluded from Git tracking via `.gitignore` across the root, frontend, and backend to protect secret service role keys and configuration data.

---

## 💻 Running the Application

### Running Backend API
From the `backend` directory:
```bash
cd backend
npm run dev
# or: node app.js
```
The API server will launch on `http://localhost:3000`.

### Running Frontend Client
From the `frontend` directory in a new terminal:
```bash
cd frontend
npm run dev
```
Open your browser and navigate to:
```
http://localhost:5173/
```

### Frontend Production Build
To build the optimized static production bundle:
```bash
cd frontend
npm run build
```
To test and preview the production build locally:
```bash
npm run preview
```

---

## 🔌 Backend API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API status and root information |
| `GET` | `/api/health` | Health check verifying Supabase database connectivity |
| `POST` | `/api/register` | Registers participant/squad. Supports Roll Number deduplication and event merging |
| `POST` | `/api/contact` | Submits contact inquiries directly to Mission Control database |

---

## 📂 Project Structure

```
fest/
├── .gitignore                         # Root Git ignore rules (includes all .env files)
├── README.md                          # Full-stack documentation
│
├── backend/                           # Node.js & Express REST API
│   ├── .env.example                   # Backend environment template
│   ├── .gitignore                     # Backend-specific ignore rules (.env, node_modules)
│   ├── app.js                         # Express server & API routes (/api/register, /api/contact)
│   ├── package.json                   # Backend dependencies
│   └── supabaseClient.js              # Initialized Supabase admin client
│
└── frontend/                          # Vite + React Client Application
    ├── .env.example                   # Frontend environment template
    ├── .gitignore                     # Frontend-specific ignore rules (.env, dist, node_modules)
    ├── index.html                     # HTML5 entry point & Google Fonts
    ├── vite.config.js                 # Vite bundler configuration
    ├── package.json                   # Frontend dependencies
    ├── public/
    │   ├── animated.mp4               # Cinematic cosmic background video
    │   ├── images/                    # High-res logos, space assets & astronaut photos
    │   └── favicon.svg                # Mission crest favicon
    └── src/
        ├── App.jsx                    # Root view & smooth hash navigation orchestration
        ├── index.css                  # Sci-Fi theme design tokens, glassmorphism & keyframes
        ├── main.jsx                   # React 19 root mount
        ├── components/
        │   ├── AstronautHeroParallax.jsx  # Multi-layer astronaut parallax
        │   ├── CosmicParticleField.jsx    # 3D stardust & relativistic warp canvas
        │   ├── EventModal.jsx             # Mission briefing popup modal
        │   ├── EventsSection.jsx          # Planetary competition grid (Tech & Non-Tech)
        │   ├── ExploreIICSection.jsx      # Ministry of Education IIC overview
        │   ├── Footer.jsx                 # Mission control contact console & location telemetry
        │   ├── Hero.jsx                   # Central cinematic banner & CTAs
        │   ├── HeroSpaceshipCursor.jsx    # Custom interactive spaceship mouse pointer
        │   ├── InterstellarGalaxyBackground.jsx # Gargantua black hole & galaxy canvas
        │   ├── MissionPartnersSection.jsx # Sponsor & institutional badges
        │   ├── MissionSection.jsx         # Section 01 mission statement & live metrics
        │   ├── Navbar.jsx                 # Dynamic HUD navigation bar & mobile command dock
        │   ├── PassVerificationModal.jsx  # QR code clearance & boarding pass modal
        │   ├── RegistrationModal.jsx      # Popup modal flight pass issuance terminal
        │   ├── RegistrationSection.jsx    # Inline boarding pass registration terminal
        │   ├── SpaceshipLaunch.jsx        # 5-stage vertical shuttle launch transition
        │   └── TheCrewSection.jsx         # 6-panel flight personnel manifest
        ├── data/
        │   ├── crewData.js                # 72+ crew personnel manifest across 6 decks
        │   └── eventsData.js              # Technical & Non-Technical event details
        └── utils/
            ├── audioEngine.js             # Web Audio API sound generator & interstellar ambient music
            └── passGenerator.js           # Cockpit pass rendering & PNG export
```

---

## 🛡️ License

This project is built for the **Astrion 2026** festival. All rights reserved by **IIC & VVIT**.
