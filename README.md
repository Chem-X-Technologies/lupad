# Lupad 🚀

**Lupad** (meaning "Fly" in local language) is a ride-hailing application for Calbayog City, Samar, Philippines. Similar to Uber and Grab, Lupad connects customers with drivers for convenient and affordable transportation.

---

## 📱 Project Overview

- **Type:** Ride-hailing mobile application
- **Target Market:** Calbayog City, Samar, Philippines
- **Development Status:** Pre-Development Phase
- **Architecture:** Monorepo with separate customer and driver apps
- **Tech Stack:** Expo (React Native), Node.js, PostgreSQL, Redis

---

## 🏗️ Project Structure

```
lupad/
├── apps/
│   ├── customer/          # Customer-facing mobile app (Expo)
│   ├── driver/            # Driver-facing mobile app (Expo)
│   └── backend/           # Backend API server (Node.js + Express)
├── packages/
│   ├── shared-types/      # Shared TypeScript types and interfaces
│   ├── shared-ui/         # Shared React Native components
│   ├── shared-utils/      # Common utility functions
│   └── shared-config/     # Shared configuration (ESLint, TypeScript, etc.)
├── docs/                  # All project documentation
│   ├── ROADMAP.md        # Detailed project roadmap and timeline
│   ├── PROGRESS.md       # Current development progress tracker
│   ├── ARCHITECTURE.md   # Technical architecture and design decisions
│   ├── DECISIONS.md      # Log of important project decisions
│   └── AI_INSTRUCTIONS.md # Guide for working with AI assistants
├── README.md             # This file
└── package.json          # Root package.json for monorepo
```

---

## 🛠️ Tech Stack

### Frontend (Mobile Apps)

- **Expo SDK** with Development Build (not Expo Go)
- **TypeScript** for type safety
- **React Navigation** for routing
- **Zustand** or **Jotai** for state management
- **React Query (TanStack Query)** for server state management
- **react-native-maps** for map display
- **Expo Location** for GPS tracking
- **Socket.io-client** for real-time updates

### Backend

- **Node.js** with **Express** (or Fastify)
- **TypeScript**
- **Prisma ORM** for database management
- **Socket.io** for real-time communication
- **JWT** for authentication
- **Google Maps API** for geocoding and routing

### Database

- **PostgreSQL** (primary database)
- **Redis** (caching and real-time data)

### Development Tools

- **Turborepo** for monorepo management
- **ESLint** for code linting
- **Prettier** for code formatting
- **Git** for version control

---

## 🚀 Getting Started

> **Note:** This section will be expanded as the project is set up.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **pnpm** (pnpm recommended for monorepo)
- **PostgreSQL** (v14 or higher)
- **Redis** (v6 or higher)
- **Git**
- **Expo CLI**
- **Android Studio** (for Android development) or **Xcode** (for iOS development)

### Installation

_Instructions will be added after initial setup_

### Running the Project Locally

_Instructions will be added after initial setup_

---

## 📖 Documentation

All project documentation is in the [`docs/`](docs/) folder:

- **[ROADMAP.md](docs/ROADMAP.md)** - Complete project roadmap with timeline and milestones
- **[PROGRESS.md](docs/PROGRESS.md)** - Current development progress and status
- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** - Technical architecture and system design
- **[DECISIONS.md](docs/DECISIONS.md)** - Log of important decisions made during development
- **[AI_INSTRUCTIONS.md](docs/AI_INSTRUCTIONS.md)** - Guide for working with AI assistants

---

## 🤖 Working with AI Assistants

### Starting a Fresh Conversation

When starting a new conversation with an AI assistant (after context has been cleared), use this prompt:

```
Hi! I'm working on the Lupad project. Please read the following files to understand the current state:

1. README.md - Project overview
2. docs/PROGRESS.md - Current development status
3. docs/ROADMAP.md - Project timeline
4. docs/ARCHITECTURE.md - Technical decisions
5. docs/DECISIONS.md - Decision log

After reviewing these files, help me with: [your specific task]
```

**Tip:** See [docs/AI_INSTRUCTIONS.md](docs/AI_INSTRUCTIONS.md) for detailed guidance on working with AI assistants.

### Before Ending a Session

Ask the AI to help you update:

1. **docs/PROGRESS.md** - Mark completed items, update current status
2. Add any new decisions to **docs/DECISIONS.md**
3. Document any new setup steps in **README.md**

---

## 📋 Development Workflow

### Branching Strategy

_To be defined during setup_

### Commit Message Convention

Use conventional commits:

- `feat(scope): add new feature`
- `fix(scope): fix bug`
- `docs: update documentation`
- `chore: maintenance tasks`
- `refactor: code refactoring`
- `test: add or update tests`

Examples:

```
feat(customer-app): add ride booking screen
fix(backend): correct fare calculation logic
docs: update local setup instructions
chore(monorepo): configure Turborepo caching
```

---

## 🎯 Phase 1 Features (MVP)

1. User registration/login (customers & drivers)
2. Basic ride booking flow
3. Simple driver matching (nearest available)
4. Real-time location tracking
5. Basic fare calculation (distance-based)
6. Cash payment only (digital payments in Phase 2)
7. Rating system

---

## 📞 Development Notes

- **Local Development:** Phase 1 will be developed entirely on local infrastructure
- **Test Environment:** Will be set up after Phase 1 completion
- **Testing:** Friends will be invited to test after Phase 1
- **Target City:** Calbayog City, Samar, Philippines only

---

## 📄 License

_To be determined_

---

## 👥 Contributors

_Project is in early development phase_

---

**Last Updated:** January 17, 2026
