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
eas login

# Initialize EAS project (first time only)
eas init

# Start development server (for Expo Go testing)
pnpm start

# To build development client (for device testing)
eas build --profile development --platform android
```

**Note:** The customer app uses:
- Expo Router v4 for file-based navigation
- NativeWind (Tailwind CSS) for styling
- Zustand for state management

### Driver App

```bash
cd apps/driver

# Login to Expo (first time only)
npx expo login
eas login

# Initialize EAS project (first time only)
eas init

# Start development server (for Expo Go testing)
pnpm start

# To build development client (for device testing)
eas build --profile development --platform android
```

**Note:** The driver app uses:
- Expo Router v4 for file-based navigation
- NativeWind (Tailwind CSS) for styling
- Zustand for state management (multi-step registration)
- expo-secure-store for JWT token storage

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

1. Login to Expo and EAS:

```bash
npx expo login
eas login
```

2. Initialize the customer app project:

```bash
cd apps/customer
eas init  # This links to your Expo account and sets projectId
```

3. Initialize the driver app:

```bash
cd apps/driver
eas init
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

### Database Setup

#### PostgreSQL

1. Install PostgreSQL (v14+):
   ```bash
   # Ubuntu/Debian
   sudo apt install postgresql postgresql-contrib

   # macOS with Homebrew
   brew install postgresql@14
   ```

2. Start PostgreSQL service:
   ```bash
   # Ubuntu/Debian
   sudo systemctl start postgresql

   # macOS
   brew services start postgresql@14
   ```

3. Create database and user:
   ```bash
   sudo -u postgres psql
   CREATE DATABASE lupad_dev;
   CREATE USER lupad_user WITH ENCRYPTED PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE lupad_dev TO lupad_user;
   \q
   ```

4. Update `apps/backend/.env`:
   ```env
   DATABASE_URL="postgresql://lupad_user:your_password@localhost:5432/lupad_dev"
   ```

5. Run migrations:
   ```bash
   cd apps/backend
   npx prisma migrate dev
   ```

#### Redis

1. Install Redis (v6+):
   ```bash
   # Ubuntu/Debian
   sudo apt install redis-server

   # macOS with Homebrew
   brew install redis
   ```

2. Start Redis service:
   ```bash
   # Ubuntu/Debian
   sudo systemctl start redis

   # macOS
   brew services start redis
   ```

3. Update `apps/backend/.env`:
   ```env
   REDIS_URL="redis://localhost:6379"
   ```

#### Verify Connections

```bash
cd apps/backend
pnpm dev
# Check console for "Database connected" and "Redis connected" messages
```

## Testing on Physical Device (WSL/Windows)

If you're developing on WSL (Windows Subsystem for Linux) and want to test on a physical Android device, additional networking setup is required.

### 1. Configure Environment Variables

Create `.env.development` in **both** mobile apps (`apps/customer/` and `apps/driver/`):
```env
# Get your Windows IP: powershell.exe -Command "Get-NetIPAddress -AddressFamily IPv4 | Where-Object InterfaceAlias -eq 'Wi-Fi'"
EXPO_PUBLIC_API_URL=http://YOUR_WINDOWS_IP:3000/api
REACT_NATIVE_PACKAGER_HOSTNAME=YOUR_WINDOWS_IP
```

### 2. Set Up Port Forwarding (PowerShell as Admin)

```powershell
# Get WSL IP
wsl hostname -I

# Forward ports from Windows to WSL (replace WSL_IP with actual IP)
netsh interface portproxy add v4tov4 listenport=8081 listenaddress=0.0.0.0 connectport=8081 connectaddress=WSL_IP
netsh interface portproxy add v4tov4 listenport=3000 listenaddress=0.0.0.0 connectport=3000 connectaddress=WSL_IP

# Allow ports through Windows Firewall
netsh advfirewall firewall add rule name="Expo Metro" dir=in action=allow protocol=TCP localport=8081
netsh advfirewall firewall add rule name="Lupad Backend" dir=in action=allow protocol=TCP localport=3000
```

### 3. Start Development Server

```bash
cd apps/customer
REACT_NATIVE_PACKAGER_HOSTNAME=YOUR_WINDOWS_IP pnpm dev
```

### 4. Connect Phone

1. Ensure phone and computer are on the same Wi-Fi network
2. Scan the QR code from the Expo dev server
3. The app should connect and load

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
