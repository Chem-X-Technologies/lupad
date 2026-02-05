# Lupad

**Lupad** (meaning "Fly" in local language) is a ride-hailing app for Calbayog City, Samar, Philippines.

**Status:** Phase 1 MVP Development (Week 3-4 Complete)

---

## Quick Start

### Prerequisites

- Node.js v22 LTS
- pnpm v10+
- PostgreSQL v14+
- Redis v6+
- Expo CLI and EAS CLI

### Installation

```bash
git clone <repo-url>
cd lupad
pnpm install

# Setup environment
cp apps/backend/.env.example apps/backend/.env
# Edit .env with your database credentials
```

### Running Locally

```bash
# 1. Start PostgreSQL and Redis

# 2. Start backend
cd apps/backend && pnpm dev

# 3. Start customer app (new terminal)
cd apps/customer && pnpm start
```

---

## Project Structure

```
lupad/
├── apps/
│   ├── customer/          # Customer mobile app (Expo)
│   ├── driver/            # Driver mobile app (Expo)
│   └── backend/           # API server (Node.js + Express)
├── packages/
│   ├── shared-types/      # Shared TypeScript types
│   ├── shared-ui/         # Shared React Native components
│   ├── shared-utils/      # Common utilities + API client
│   └── shared-config/     # Shared ESLint, TypeScript configs
└── docs/                  # Documentation
```

---

## Documentation

| File | Purpose |
|------|---------|
| [docs/PROGRESS.md](docs/PROGRESS.md) | Current status, roadmap, what's next |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Technical design, API, key decisions |
| [docs/DESIGN.md](docs/DESIGN.md) | UI design system + components |

---

## For AI Assistants

When starting a new conversation, copy and paste this prompt:

```
Hi! I'm working on the Lupad project, a ride-hailing app for Calbayog City, Philippines.

Please read these files to understand the project:
1. README.md - Project overview
2. docs/PROGRESS.md - Current status and roadmap
3. docs/ARCHITECTURE.md - Technical design and decisions
4. docs/DESIGN.md - UI design system (if working on UI)

After reviewing, please:
- Confirm you understand the current phase
- Note: Follow "Feature-First Development" - build features end-to-end (backend + frontend together)

Then help me with: [describe your task]
```

---

## Tech Stack

- **Mobile:** Expo SDK 54, Expo Router v4, NativeWind, Zustand, TanStack Query
- **Backend:** Node.js, Express, Prisma, Socket.io
- **Database:** PostgreSQL + Redis
- **Tools:** Turborepo, TypeScript, EAS Build

See [ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

---

## Commit Convention

```
feat(scope): add new feature
fix(scope): fix bug
docs: update documentation
chore: maintenance tasks
```

---

**Last Updated:** February 5, 2026
