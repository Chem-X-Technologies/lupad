# Lupad - Technical Architecture

**Last Updated:** January 17, 2026  
**Status:** Planning Phase

---

## 🏛️ System Architecture Overview

Lupad follows a **client-server architecture** with real-time capabilities:

```
┌─────────────────────────────────────────────────────────────┐
│                    Mobile Applications                       │
│  ┌──────────────────────┐    ┌──────────────────────┐     │
│  │   Customer App       │    │    Driver App        │     │
│  │   (Expo/React Native)│    │  (Expo/React Native) │     │
│  └──────────┬───────────┘    └──────────┬───────────┘     │
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
│   ├── customer/       # Customer mobile app
│   ├── driver/         # Driver mobile app
│   └── backend/        # API server
├── packages/
│   ├── shared-types/   # TypeScript definitions shared across apps
│   ├── shared-ui/      # Reusable React Native components
│   ├── shared-utils/   # Common utility functions
│   └── shared-config/  # ESLint, TypeScript, Prettier configs
└── turbo.json          # Turborepo configuration
```

---

## 🗄️ Database Schema (Preliminary)

### PostgreSQL Schema

**Core Entities:**

1. **Users**

   - Stores both customers and drivers
   - `id`, `phone`, `email`, `name`, `user_type` (customer/driver)
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

### JWT-Based Authentication

**Flow:**

1. User registers/logs in with phone number
2. OTP sent via SMS for verification
3. Upon verification, server issues JWT token
4. Token includes: `user_id`, `user_type`, `exp`
5. Client stores token securely and includes in API requests

**Token Structure:**

```json
{
  "user_id": "uuid",
  "user_type": "customer" | "driver",
  "phone": "+639xxxxxxxxx",
  "iat": 1234567890,
  "exp": 1234567890
}
```

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

### REST API Endpoints

**Authentication:**

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - Send OTP
- `POST /api/auth/verify` - Verify OTP and get token
- `POST /api/auth/logout` - Invalidate token

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
