# Lupad - Technical Architecture

**Last Updated:** February 10, 2026
**Status:** Phase 1 MVP Development (Week 5 Driver App Onboarding Complete)

---

## 🏛️ System Architecture Overview

Lupad follows a **client-server architecture** with real-time capabilities:

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Applications                      │
│  ┌──────────────────────┐    ┌──────────────────────┐       │
│  │   Customer App       │    │    Driver App        │       │
│  │   (Expo/React Native)│    │  (Expo/React Native) │       │
│  └──────────┬───────────┘    └──────────┬───────────┘       │
│             │                           │                   │
└─────────────┼───────────────────────────┼───────────────────┘
              │                           │
              │     REST API + WebSocket  │
              │                           │
         ┌────┴───────────────────────────┴────┐
         │      Backend API Server             │
         │      (Node.js + Express)            │
         │      + Socket.io                    │
         └────┬──────────────────┬─────────────┘
              │                  │
    ┌─────────┴────────┐    ┌────┴──────────┐
    │   PostgreSQL     │    │     Redis     │
    │  (Primary DB)    │    │   (Caching)   │
    └──────────────────┘    └───────────────┘
              │
    ┌─────────┴────────────────────┐
    │   External Services          │
    │  • Google Maps API           │
    │  • Twilio (SMS)              │
    │  • Payment Gateway (Phase 2) │
    └──────────────────────────────┘
```

---

## 📦 Monorepo Structure

### Why Monorepo?

- **Code Sharing:** Shared types, utilities, and UI components
- **Atomic Changes:** Update API and apps together
- **Consistent Tooling:** Same linting, formatting, TypeScript configs
- **Simplified Development:** Single repo to manage

### Workspace Organization

```
lupad/
├── apps/
│   ├── customer/       # Customer mobile app (Expo Router + NativeWind)
│   ├── driver/         # Driver mobile app (Expo Router + NativeWind)
│   └── backend/        # API server (Express + Prisma)
├── packages/
│   ├── shared-types/   # TypeScript definitions shared across apps
│   ├── shared-ui/      # Reusable React Native components
│   ├── shared-utils/   # Common utility functions + API client
│   └── shared-config/  # ESLint, TypeScript, Prettier configs
└── turbo.json          # Turborepo configuration
```

---

## 📱 Mobile App Architecture

### Technology Stack (Customer & Driver Apps)

| Component | Choice | Purpose |
|-----------|--------|---------|
| **Framework** | Expo SDK 54 | React Native with managed workflow |
| **Navigation** | Expo Router v4 | File-based routing, deep linking |
| **Styling** | NativeWind v4 + Tailwind v3 | Utility-first CSS, custom theme |
| **State Management** | Zustand | Lightweight, TypeScript-first |
| **Server State** | TanStack Query v5 | Caching, background refetch |
| **API Client** | Axios | Interceptors, token refresh |
| **Secure Storage** | expo-secure-store | JWT token storage |
| **Maps** | react-native-maps | Google Maps integration |
| **Location** | expo-location | GPS and background tracking |

### Customer App Structure

```
apps/customer/
├── app/                      # Expo Router file-based routes
│   ├── _layout.tsx           # Root layout (providers, auth init)
│   ├── index.tsx             # Entry point (auth-aware redirect)
│   ├── (auth)/               # Auth flow (unauthenticated)
│   │   ├── _layout.tsx       # Auth stack layout
│   │   ├── onboarding.tsx    # Welcome slides
│   │   ├── register.tsx      # Phone input
│   │   ├── verify-otp.tsx    # OTP verification
│   │   └── name.tsx          # Name setup
│   └── (app)/                # Main app (authenticated)
│       ├── _layout.tsx       # App stack layout
│       └── index.tsx         # Home screen (placeholder)
├── src/
│   ├── services/
│   │   ├── api.ts            # API client (uses shared-utils)
│   │   └── auth.ts           # Auth API functions (OTP-based)
│   └── stores/
│       └── authStore.ts      # Zustand auth state
├── app.config.ts             # Dynamic Expo config (env vars)
├── tailwind.config.js        # Custom theme colors
├── global.css                # Tailwind directives
└── eas.json                  # EAS Build configuration
```

### Driver App Structure

```
apps/driver/
├── app/                      # Expo Router file-based routes
│   ├── _layout.tsx           # Root layout (providers, auth init)
│   ├── index.tsx             # Entry point (auth-aware redirect)
│   ├── (auth)/               # Auth flow (unauthenticated)
│   │   ├── _layout.tsx       # Auth stack layout
│   │   ├── onboarding.tsx    # Welcome slides (driver-themed)
│   │   ├── login.tsx         # Phone + password login
│   │   ├── register-personal.tsx  # Step 1/3: Personal info
│   │   ├── register-vehicle.tsx   # Step 2/3: Vehicle info
│   │   ├── register-password.tsx  # Step 3/3: Password + submit
│   │   └── verify-otp.tsx    # OTP verification (after registration)
│   └── (app)/                # Main app (authenticated)
│       ├── _layout.tsx       # App stack layout
│       └── index.tsx         # Home screen (placeholder)
├── src/
│   ├── services/
│   │   ├── api.ts            # API client (uses shared-utils)
│   │   └── auth.ts           # Auth API functions (password-based)
│   └── stores/
│       └── authStore.ts      # Zustand auth state (multi-step registration)
├── app.config.ts             # Dynamic Expo config (env vars)
├── tailwind.config.js        # Custom theme colors
├── global.css                # Tailwind directives
└── eas.json                  # EAS Build configuration
```

### Shared API Client Architecture

```
packages/shared-utils/
└── src/
    ├── api.ts                # createApiClient factory
    │   ├── TokenStorage interface
    │   ├── Request interceptor (add Bearer token)
    │   └── Response interceptor (auto-refresh on 401)
    └── index.ts              # Exports + utility functions
```

**Usage in apps:**
```typescript
// apps/customer/src/services/api.ts
import { createApiClient, TokenStorage } from '@lupad/shared-utils';

const tokenStorage: TokenStorage = {
  getAccessToken: () => SecureStore.getItemAsync('access_token'),
  // ... other methods using expo-secure-store
};

export const api = createApiClient({ baseURL, tokenStorage });
```

### Design System (NativeWind Theme)

Custom colors defined in `tailwind.config.js`:
- **Primary:** `#00BFA5` (Teal - brand color)
- **Secondary:** `#FFB300` (Orange/Amber - CTAs)
- **Gray Dark:** `#333333` (Text)
- **Gray Medium:** `#9E9E9E` (Secondary text)
- **Gray Light:** `#E0E0E0` (Borders, backgrounds)

---

## 🗄️ Database Schema (Preliminary)

### PostgreSQL Schema

**Core Entities:**

1. **Users**
   - Stores both customers and drivers
   - `id`, `phone`, `email`, `name`, `user_type` (customer/driver)
   - `password` (optional - only for drivers)
   - `auth_method` (OTP/PASSWORD) - tracks authentication type
   - `created_at`, `updated_at`

2. **Drivers** (extends Users)
   - Driver-specific information
   - `user_id` (FK), `vehicle_type`, `license_number`, `plate_number`
   - `is_verified`, `is_available`, `rating`, `total_rides`

3. **Rides**
   - Core ride entity
   - `id`, `customer_id` (FK), `driver_id` (FK)
   - `pickup_lat`, `pickup_lng`, `pickup_address`
   - `dropoff_lat`, `dropoff_lng`, `dropoff_address`
   - `status` (pending, accepted, in_progress, completed, cancelled)
   - `fare`, `distance`, `duration`
   - `payment_method` (cash, digital)
   - `created_at`, `started_at`, `completed_at`

4. **Ratings**
   - `id`, `ride_id` (FK)
   - `rater_id` (FK), `ratee_id` (FK)
   - `rating` (1-5), `comment`
   - `created_at`

5. **Locations** (Real-time tracking)
   - `driver_id` (FK)
   - `lat`, `lng`, `heading`, `speed`
   - `timestamp`

### Redis Data Structures

1. **Active Driver Locations**
   - Key: `driver:location:{driver_id}`
   - Value: JSON with lat, lng, timestamp
   - TTL: 5 minutes (refreshed on updates)

2. **Active Rides**
   - Key: `ride:active:{ride_id}`
   - Value: Ride state for quick access
   - TTL: 24 hours

3. **Driver Availability**
   - Key: `driver:available:{driver_id}`
   - Value: Boolean (true/false)
   - No TTL (persists until changed)

---

## 🔐 Authentication & Authorization

### Hybrid Authentication Strategy

**Design Decision:** Different authentication methods for different user types

#### Customers: Passwordless OTP Authentication

**Flow:**

1. Customer enters phone number
2. OTP sent via SMS
3. Customer enters OTP
4. Upon verification, server issues JWT token
5. No password required - simpler UX

**Rationale:**

- Faster onboarding (no password to create/remember)
- Better UX for occasional users
- Modern approach (WhatsApp-style)
- Reduced friction

#### Drivers: Password-Based Authentication (+ Optional 2FA)

**Flow:**

1. Driver registers with phone, name, and password
2. Phone verified via OTP
3. Subsequent logins: phone + password
4. Optional: OTP 2FA for extra security
5. Password reset available via OTP

**Rationale:**

- More security for professional accounts
- Drivers login frequently (OTP fatigue would be annoying)
- Handling money and sensitive data requires stronger auth
- Can add 2FA later without disrupting flow

### JWT Token Structure

```json
{
  "user_id": "uuid",
  "user_type": "customer" | "driver",
  "phone": "+639xxxxxxxxx",
  "auth_method": "OTP" | "PASSWORD",
  "iat": 1234567890,
  "exp": 1234567890
}
```

**Token Types:**

- **Access Token:** Short-lived (15 minutes), used for API requests
- **Refresh Token:** Long-lived (7 days), used to get new access tokens

---

## 🔄 Real-Time Communication

### Socket.io Implementation

**Events:**

**Driver → Server:**

- `driver:location:update` - Driver's location updates (every 5-10s when active)
- `driver:status:update` - Online/offline status
- `ride:accept` - Accept ride request
- `ride:start` - Start ride
- `ride:complete` - Complete ride

**Server → Driver:**

- `ride:request` - New ride request
- `ride:cancelled` - Customer cancelled

**Customer → Server:**

- `ride:book` - Book a new ride
- `ride:cancel` - Cancel ride

**Server → Customer:**

- `ride:accepted` - Driver accepted ride
- `driver:location:update` - Real-time driver location
- `ride:started` - Driver started trip
- `ride:completed` - Trip completed

---

## 📍 Location & Mapping

### Google Maps Integration

**APIs Used:**

1. **Maps SDK** - Map display in apps
2. **Geocoding API** - Convert addresses ↔ coordinates
3. **Distance Matrix API** - Calculate distance/duration
4. **Directions API** - Get route between points

**Location Strategy:**

- Customer app: Get location on-demand (when booking)
- Driver app: Continuous tracking when online (background location)
- Update interval: Every 5-10 seconds while in active ride
- Geofencing: Detect when driver arrives at pickup/dropoff

---

## 💰 Fare Calculation

### Simple Distance-Based Model (Phase 1)

```typescript
fare = BASE_FARE + (distance_km * RATE_PER_KM)

// Example for Calbayog City:
BASE_FARE = 40 PHP
RATE_PER_KM = 15 PHP
```

**Phase 2 Enhancements:**

- Time-based component (for traffic)
- Surge pricing (high demand)
- Different vehicle types
- Promo codes/discounts

---

## 🔍 Driver Matching Algorithm (Phase 1)

### Simple Nearest Driver

**Algorithm:**

1. Get customer's pickup location
2. Query all available drivers from Redis
3. Calculate distance to each driver (Haversine formula)
4. Sort by distance
5. Send request to nearest driver
6. If declined, send to next nearest (timeout: 30 seconds)

**Phase 2 Enhancements:**

- Consider driver rating
- Consider driver acceptance rate
- Predict driver availability
- Multi-dispatch (send to multiple drivers)

---

## 🏗️ API Design

### Technology Stack

**Backend Framework:**

- **Express.js** - Web framework for Node.js
- **TypeScript** - Type-safe JavaScript
- **Prisma 6** - ORM for database access (CommonJS compatible)
- **Zod** - Schema validation for requests
- **Socket.io** - Real-time WebSocket communication
- **ioredis** - Redis client with helper utilities

**Middleware:**

- **Morgan** - HTTP request logging
- **express-async-errors** - Automatic async error handling
- Custom error handler for Zod/Prisma errors
- Custom validation middleware using Zod schemas
- JWT authentication middleware (authenticate, requireRole, requireCustomer, requireDriver)

**Project Structure:**

```
apps/backend/
├── src/
│   ├── index.ts              # Main entry point
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── redis.ts          # Redis client + helpers
│   ├── middleware/
│   │   ├── errorHandler.ts   # Global error handler
│   │   ├── logger.ts         # HTTP logging
│   │   ├── validate.ts       # Zod validation
│   │   ├── notFound.ts       # 404 handler
│   │   └── auth.ts           # JWT auth middleware ✅
│   ├── routes/
│   │   ├── index.ts          # Route aggregator
│   │   ├── auth.routes.ts    # Auth endpoints ✅
│   │   ├── users.routes.ts   # User endpoints
│   │   ├── rides.routes.ts   # Ride endpoints
│   │   └── drivers.routes.ts # Driver endpoints
│   ├── controllers/
│   │   └── auth.controller.ts # Auth logic ✅
│   ├── services/             # Business logic (to be implemented)
│   ├── schemas/
│   │   └── auth.schema.ts    # Auth validation schemas ✅
│   └── utils/
│       ├── jwt.ts            # JWT utilities ✅
│       └── password.ts       # Password utilities ✅
├── prisma/
│   ├── schema.prisma         # Database schema
│   └── migrations/           # Migration history
└── .env                      # Environment variables
```

### REST API Endpoints

**Authentication:** ✅ Implemented

- `POST /api/auth/register` - User registration (phone + OTP for customers, phone + password + OTP for drivers)
- `POST /api/auth/verify-otp` - Verify OTP and complete registration
- `POST /api/auth/login` - Login (send OTP for customers, phone + password for drivers)
- `POST /api/auth/login-otp` - Complete customer login with OTP
- `POST /api/auth/logout` - Invalidate token
- `GET /api/auth/me` - Get current user profile (requires authentication)
- `POST /api/auth/refresh` - Refresh access token using refresh token

**Simplified OTP Flow (Customer App):** ✅ Implemented

- `POST /api/auth/otp/request` - Request OTP (works for both new and existing users)
- `POST /api/auth/otp/verify` - Verify OTP and get tokens (creates user if new)

**Users:**

- `GET /api/users/me` - Get current user profile
- `PUT /api/users/me` - Update profile
- `GET /api/users/:id` - Get user by ID (limited info)

**Rides (Customer):**

- `POST /api/rides/estimate` - Get fare estimate
- `POST /api/rides/book` - Book a ride
- `GET /api/rides/:id` - Get ride details
- `POST /api/rides/:id/cancel` - Cancel ride
- `POST /api/rides/:id/rate` - Rate completed ride
- `GET /api/rides/history` - Get ride history

**Rides (Driver):**

- `GET /api/driver/rides/active` - Get active ride
- `POST /api/driver/rides/:id/accept` - Accept ride
- `POST /api/driver/rides/:id/decline` - Decline ride
- `POST /api/driver/rides/:id/start` - Start ride
- `POST /api/driver/rides/:id/complete` - Complete ride
- `GET /api/driver/rides/history` - Get completed rides
- `GET /api/driver/earnings` - Get earnings summary

**Driver Management:**

- `PUT /api/driver/status` - Update online/offline status
- `POST /api/driver/location` - Update location (fallback if WebSocket fails)

---

## 🛡️ Security Considerations

### Phase 1 Security Measures

1. **API Security:**
   - JWT authentication on all protected routes
   - Rate limiting on auth endpoints
   - Input validation and sanitization
   - HTTPS only (in production)

2. **Database Security:**
   - Parameterized queries (via Prisma)
   - Principle of least privilege for DB user
   - Regular backups

3. **Mobile App Security:**
   - Secure token storage (Expo SecureStore)
   - Certificate pinning (Phase 2)
   - No sensitive data in AsyncStorage

4. **Privacy:**
   - Phone numbers hashed where possible
   - Location data retained only for active/recent rides
   - Clear data retention policy

---

## 📊 Monitoring & Logging

### Phase 1 (Basic)

- Console logging with timestamps
- Error logging to file
- Basic request logging (Morgan)

### Phase 2+ (Enhanced)

- Sentry for error tracking
- Analytics for app usage
- Performance monitoring
- Log aggregation (e.g., LogTail)

---

## 🚀 Deployment Strategy

### Phase 1: Local Development

- Backend: Run locally on developer machine
- Database: Local PostgreSQL instance
- Redis: Local Redis instance
- Apps: Development builds via EAS

### Phase 1 Completion: Test Environment

- Backend: Railway, Render, or Heroku
- Database: Supabase or Neon (PostgreSQL)
- Redis: Redis Cloud or Upstash
- Apps: Test builds distributed via TestFlight/Internal Testing

### Production (Phase 5)

- Backend: Cloud hosting with load balancer
- Database: Managed PostgreSQL with replicas
- Redis: Managed Redis cluster
- Apps: Published on App Store and Play Store
- CDN for static assets

---

## 🔄 Development Workflow

### Local Development

1. Start PostgreSQL and Redis
2. Run backend: `npm run dev:backend`
3. Run Prisma Studio: `npm run db:studio` (optional, for DB GUI)
4. Run customer app: `npm run dev:customer`
5. Run driver app: `npm run dev:driver`

### Git Workflow

_To be defined during setup_

### Creating Development Builds (EAS)

Before creating a new development build, **always increment the app version**:

1. **Update version in both files** (keep them in sync):
   - `apps/customer/app.config.ts` → `version: 'X.Y.Z'`
   - `apps/customer/package.json` → `"version": "X.Y.Z"`

2. **Version bump guidelines**:
   - **Patch (0.1.X)**: Bug fixes, minor tweaks
   - **Minor (0.X.0)**: New features, dependency upgrades (e.g., styling library migration)
   - **Major (X.0.0)**: Breaking changes, major rewrites

3. **Create the build**:
   ```bash
   cd apps/customer
   eas build --profile development --platform android
   ```

4. **Install on device** after build completes:
   - Download APK from EAS dashboard, or
   - Scan QR code from terminal

---

## 🎯 Performance Targets

### Phase 1 Targets

- API response time: < 200ms (average)
- Location update frequency: Every 5-10 seconds
- Ride matching: < 10 seconds
- App startup time: < 3 seconds

### Scalability Goals

- Support 100 concurrent rides
- 500+ active drivers
- 1000+ requests per minute

---

## 📋 Key Technical Decisions

### Prisma 6 (Not Prisma 7)

**Why:** Prisma 7 requires full ESM migration and has dependency conflicts. Prisma 6 offers excellent CommonJS support, works seamlessly with Express ecosystem, and has all needed features.

### Expo Development Builds (Not Expo Go)

**Why:** More flexibility than Expo Go, access to any native library (react-native-maps, etc.), still simpler than React Native CLI, EAS Build for easy distribution.

### Feature-First Development Approach

**Why:** Build features end-to-end (backend → frontend → integration) rather than infrastructure-first. Faster feedback loops, better context retention, reduces over-engineering.

### Mobile-Only Shared UI Components

**Why:** Lupad is strictly a mobile app. Removed web-specific code (hover states, focus-visible, responsive breakpoints) from shared-ui components for cleaner, smaller bundles.

### Simplified OTP Flow for Customers

**Why:** Added unified `/auth/otp/request` and `/auth/otp/verify` endpoints. Frontend doesn't need to know if user exists - backend handles both new registration and login. Better UX, simpler code.

### NativeWind over Other Styling Solutions

**Why:** Familiar Tailwind syntax, rapid prototyping, easy theming with custom colors. Alternative considered: StyleSheet (verbose), Styled Components (runtime overhead), Tamagui (complex setup).

---

## 📝 Future Architecture Considerations

### Potential Enhancements (Post-Phase 1)

- Microservices architecture (if scaling significantly)
- Message queue (RabbitMQ/Redis Pub-Sub) for async tasks
- Separate service for real-time location tracking
- GraphQL instead of REST (if complexity increases)
- Backend Admin Dashboard (separate Next.js app)
- CI/CD pipeline
- Kubernetes for container orchestration (if scaling heavily)

---

**Note:** This architecture document will be updated as development progresses and decisions are refined.
