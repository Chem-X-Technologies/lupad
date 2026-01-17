# Lupad - Development Setup

## Prerequisites

- Node.js v22 LTS
- pnpm v10+
- Expo account
- Android device for testing (physical phone)

## Installation

1. Clone the repository:

```bash
cd ~/work/lupad
```

2. Install dependencies:

```bash
pnpm install
```

## Running the Apps

### Backend API Server

```bash
# Start the backend in development mode
cd apps/backend
cp .env.example .env  # Copy and configure your environment variables
pnpm dev
```

The API will be available at http://localhost:3000

### Customer App

```bash
cd apps/customer

# Login to Expo (first time only)
npx expo login

# Start development server
pnpm dev

# To build development client (run this first before testing on device)
npx eas build --profile development --platform android
```

### Driver App

```bash
cd apps/driver

# Start development server
pnpm dev

# To build development client
npx eas build --profile development --platform android
```

## Monorepo Commands

From the root directory:

```bash
# Run all apps in development mode
pnpm dev

# Build all apps
pnpm build

# Lint all packages
pnpm lint

# Format all code
pnpm format

# Clean all build artifacts and node_modules
pnpm clean
```

## Project Structure

```
lupad/
├── apps/
│   ├── customer/      # Customer mobile app
│   ├── driver/        # Driver mobile app
│   └── backend/       # API server
├── packages/
│   ├── shared-types/  # Shared TypeScript types
│   ├── shared-ui/     # Shared React Native components
│   ├── shared-utils/  # Utility functions
│   └── shared-config/ # Shared configuration
└── docs/             # Documentation
```

## EAS Build Configuration

### First Time Setup

1. Login to Expo:

```bash
npx expo login
```

2. Link the customer app to your Expo account:

```bash
cd apps/customer
npx eas build:configure
```

3. Link the driver app:

```bash
cd apps/driver
npx eas build:configure
```

### Building Development Client

For testing on your Android phone:

```bash
# Customer app
cd apps/customer
npx eas build --profile development --platform android

# Driver app
cd apps/driver
npx eas build --profile development --platform android
```

After the build completes, download the APK to your phone and install it.

## Local Development Environment

### Database Setup (Coming Soon)

Instructions for setting up PostgreSQL and Redis locally will be added here.

## Troubleshooting

### Port Already in Use

If port 3000 is already in use:

```bash
# Find the process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

### pnpm Workspace Issues

If you encounter workspace dependency issues:

```bash
pnpm install --force
```

### Expo Cache Issues

```bash
cd apps/customer  # or apps/driver
npx expo start -c  # Clear cache
```

## Next Steps

See [docs/ROADMAP.md](docs/ROADMAP.md) for the development roadmap and [docs/PROGRESS.md](docs/PROGRESS.md) for current progress.
