# 🚀 Lupad - Quick Start Guide

Congratulations! Your Lupad development environment is now set up. Here's what you can do next:

## ✅ What's Been Set Up

1. **Monorepo Structure** with Turborepo and pnpm
2. **Customer App** (Expo + React Native + TypeScript)
3. **Driver App** (Expo + React Native + TypeScript)
4. **Backend API** (Node.js + Express + TypeScript + Socket.io)
5. **Shared Packages** (Types, Utils, Config)
6. **EAS Build** configuration for both apps
7. **Git** repository initialized

## 🏃 Quick Commands

### Start Backend Server

```bash
cd apps/backend
pnpm dev
```

Server will run at: http://localhost:3000

### Start Customer App

```bash
cd apps/customer
pnpm dev
```

### Start Driver App

```bash
cd apps/driver
pnpm dev
```

## 📱 Testing on Your Android Phone

### First Time: Build Development Client

You need to build the development client APK once for each app:

```bash
# Login to Expo (if not already logged in)
npx expo login

# Build Customer App Development Client
cd apps/customer
npx eas build --profile development --platform android

# Build Driver App Development Client
cd apps/driver
npx eas build --profile development --platform android
```

After the builds complete (takes ~10-15 minutes):

1. Download the APK from the EAS build page
2. Transfer to your Android phone
3. Install the APK
4. You're ready to test!

### Daily Development

Once you have the development client installed:

1. Make sure your phone and computer are on the same WiFi
2. Start the dev server: `pnpm dev`
3. Scan the QR code with your phone or open the dev client app
4. Code changes will hot-reload automatically!

## 🗄️ Next: Set Up Databases

To complete the development environment, you need to set up:

### PostgreSQL

```bash
# Install PostgreSQL (Ubuntu/WSL)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo service postgresql start

# Create database and user
sudo -u postgres psql
postgres=# CREATE DATABASE lupad;
postgres=# CREATE USER lupad WITH PASSWORD 'lupad';
postgres=# GRANT ALL PRIVILEGES ON DATABASE lupad TO lupad;
postgres=# \q
```

### Redis

```bash
# Install Redis (Ubuntu/WSL)
sudo apt install redis-server

# Start Redis service
sudo service redis-server start

# Test Redis
redis-cli ping
# Should return: PONG
```

### Configure Backend Environment

```bash
cd apps/backend
cp .env.example .env
# Edit .env and update the database URLs if needed
```

## 📚 Important Files

- [SETUP.md](SETUP.md) - Detailed setup instructions
- [docs/ROADMAP.md](docs/ROADMAP.md) - Development roadmap
- [docs/PROGRESS.md](docs/PROGRESS.md) - Current progress
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Technical architecture
- [docs/DECISIONS.md](docs/DECISIONS.md) - Key decisions

## 🎯 Next Development Steps

According to your roadmap, you should now:

1. ✅ Complete Pre-Development Phase (~90% done)
   - Set up PostgreSQL and Redis
   - Test the complete stack

2. 🚀 Start Phase 1: MVP Development
   - Week 3-4: User Management & Authentication
   - Week 5-6: Core Booking Flow (Customer App)
   - Week 7: Driver App Core Features
   - Week 8: Real-time Communication & Testing

## 💡 Tips

- Use `pnpm` for all package management (not npm)
- Shared types are in `packages/shared-types` - update them when adding new features
- Backend runs on port 3000 by default
- All apps are configured with TypeScript strict mode
- Git is initialized - commit frequently!

## 🆘 Need Help?

- Check [SETUP.md](SETUP.md) for detailed instructions
- See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design
- Review [docs/DECISIONS.md](docs/DECISIONS.md) for context on technical choices

---

**Ready to build something amazing! 🎉**
