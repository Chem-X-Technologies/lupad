# Phase 1 MVP Development Plan - Lupad Ride-Hailing App

**Duration:** 6 Weeks (Weeks 3-8)
**Goal:** Complete end-to-end ride-hailing experience with customer booking, driver matching, real-time tracking, and ratings
**Created:** January 30, 2026

---

## Technology Decisions for Mobile Apps

| Component | Choice | Rationale |
|-----------|--------|-----------|
| Navigation | **Expo Router v4** | File-based routing, deep linking, Expo native integration |
| State Management | **Zustand** | Minimal boilerplate, TypeScript-first, no Provider wrapping |
| Server State | **TanStack Query v5** | Automatic caching, background refetch, optimistic updates |
| API Client | **Axios** | Interceptors for auth tokens, better error handling |
| Maps | **react-native-maps** + **Google Maps API** | Best coverage in Philippines |
| Location | **expo-location** | Native Expo integration, background location support |
| Forms | **React Hook Form** + **Zod** | Type-safe validation, matches backend schemas |
| Secure Storage | **expo-secure-store** | JWT token storage |
| Socket Client | **socket.io-client** | Matches backend Socket.io server |

---

## Cross-Platform (Android + iOS) Considerations

All chosen libraries are **fully cross-platform compatible**:

### Platform-Specific Setup Required

| Component | Android | iOS |
|-----------|---------|-----|
| **react-native-maps** | Google Maps (default) | Apple Maps or Google Maps |
| **expo-location** | Works natively | Requires `NSLocationWhenInUseUsageDescription` in Info.plist |
| **Background Location** | `ACCESS_BACKGROUND_LOCATION` permission | Requires `UIBackgroundModes: location` |
| **Push Notifications** | Firebase Cloud Messaging | Apple Push Notification Service (APNs) |
| **Secure Storage** | Android Keystore | iOS Keychain |

### Code Patterns for Cross-Platform

1. **Use `Platform.select()` or `Platform.OS`** for platform-specific styling
2. **Avoid hardcoded dimensions** - use `Dimensions`, `useWindowDimensions`, or responsive units
3. **Test safe areas** - use `SafeAreaView` from react-native-safe-area-context
4. **Handle notches/dynamic island** - Expo Router handles this automatically
5. **Maps provider config** - Set Google Maps for both platforms for consistency

### Build Targets

```json
// eas.json already configured for both platforms
{
  "build": {
    "development": {
      "ios": { "simulator": true },
      "android": { "buildType": "apk" }
    }
  }
}
```

### Testing Strategy

- **Android**: Physical device + emulator throughout development
- **iOS**: Simulator during development, TestFlight for device testing
- **EAS Build**: Generate development builds for both platforms at Week 4 milestone

---

## Week-by-Week Summary

| Week | Focus | Deliverable | Status |
|------|-------|-------------|--------|
| **Week 3** | Mobile foundation + Profile APIs | Navigation, stores, API client working | ✅ Done |
| **Week 4** | Auth UI + Onboarding | Users can register, login, view profile | ✅ Customer Done |
| **Week 5** | Maps + Location + Destination | Customer can see map, pick destination, get fare estimate | ⏳ Next |
| **Week 6** | Booking Flow | Customer can book ride, see driver search | ⏳ Pending |
| **Week 7** | Driver Core Features | Driver can go online, receive/accept rides, complete trips | ⏳ Pending |
| **Week 8** | Real-time + Completion | Live tracking, ratings, ride history | ⏳ Pending |

---

## Week 3: Mobile Foundation + Profile APIs ✅ COMPLETED

### Backend Tasks
| Task | Files | Status |
|------|-------|--------|
| User Profile CRUD | `routes/users.routes.ts`, `controllers/users.controller.ts`, `schemas/users.schema.ts` | ✅ Done |
| Driver Profile API | `routes/drivers.routes.ts`, `controllers/drivers.controller.ts`, `schemas/drivers.schema.ts` | ✅ Done |

**Endpoints:**
- ✅ `GET/PUT/DELETE /api/users/me` - Profile management
- ✅ `GET/PUT /api/drivers/me` - Driver profile
- ✅ `PUT /api/drivers/me/vehicle` - Vehicle info
- ✅ `PUT /api/drivers/me/status` - Online/offline toggle

### Mobile Tasks (Customer App)
| Task | Files | Status |
|------|-------|--------|
| Install dependencies | `package.json` | ✅ Done |
| Expo Router setup | `app/_layout.tsx`, `app/index.tsx`, navigation structure | ✅ Done |
| API Client | `packages/shared-utils/src/api.ts` | ✅ Done |
| Auth Store (Zustand) | `src/stores/authStore.ts` | ✅ Done |
| NativeWind styling | `tailwind.config.js`, `global.css` | ✅ Done |
| EAS Build config | `eas.json` | ✅ Done |

### Shared Package Updates
- ✅ `packages/shared-utils/src/api.ts` - API client factory with token interceptors

### App Navigation Structure

**Customer App:**
```
app/
├── _layout.tsx           # Root with providers
├── index.tsx             # Entry redirect
├── (auth)/               # Auth stack
│   ├── onboarding.tsx
│   ├── login.tsx
│   ├── register.tsx
│   └── verify-otp.tsx
└── (app)/                # Main app
    ├── (tabs)/
    │   ├── home.tsx
    │   ├── activity.tsx
    │   └── profile.tsx
    ├── book/
    │   ├── destination.tsx
    │   ├── confirm.tsx
    │   └── searching.tsx
    └── ride/[id].tsx
```

**Driver App:**
```
app/
├── (auth)/               # Auth stack
│   ├── login.tsx
│   ├── register.tsx
│   └── verify-otp.tsx
└── (app)/
    ├── (tabs)/
    │   ├── home.tsx      # Map + online toggle
    │   ├── earnings.tsx
    │   └── profile.tsx
    └── ride/
        ├── request.tsx   # Incoming ride
        └── [id].tsx      # Active ride
```

---

## Week 4: Authentication UI + Onboarding (Customer App ✅ COMPLETED)

### Customer App Tasks
| Task | Screen | Status |
|------|--------|--------|
| Onboarding slides | `(auth)/onboarding.tsx` | ✅ Done |
| Registration form | `(auth)/register.tsx` | ✅ Done |
| OTP verification | `(auth)/verify-otp.tsx` | ✅ Done |
| Nickname setup | `(auth)/nickname.tsx` | ✅ Done |
| Auth-aware routing | `app/index.tsx` | ✅ Done |
| Home placeholder | `(app)/index.tsx` | ✅ Done |

### Driver App Tasks
| Task | Screen | Status |
|------|--------|--------|
| Registration with vehicle info | `(auth)/register.tsx` | ⏳ Pending |
| Password login | `(auth)/login.tsx` | ⏳ Pending |
| OTP verification | `(auth)/verify-otp.tsx` | ⏳ Pending |
| Driver profile | `(tabs)/profile.tsx` | ⏳ Pending |

### Testing Checklist
- [x] Customer registration flow complete
- [x] Customer OTP verification works
- [x] Tokens stored in secure storage (expo-secure-store)
- [x] Auth state persists across app restarts
- [ ] Driver registration with password + vehicle info
- [ ] Driver password login works
- [ ] Profile view/edit functional

---

## Week 5: Map + Location + Destination (Customer App)

### Backend Tasks
| Task | Files | Priority |
|------|-------|----------|
| Google Maps Service | `services/maps.service.ts` | CRITICAL |
| Fare Estimation API | `routes/rides.routes.ts`, `controllers/rides.controller.ts` | CRITICAL |
| Available Drivers API | `controllers/rides.controller.ts` | HIGH |

**Endpoints:**
- `POST /api/rides/estimate` - Calculate fare from coordinates
- `GET /api/rides/available-drivers` - Drivers within radius

### Customer App Tasks
| Task | Files | Priority |
|------|-------|----------|
| Map component setup | `src/components/Map.tsx` | CRITICAL |
| Location hook | `src/hooks/useLocation.ts` | CRITICAL |
| Home screen with map | `(tabs)/home.tsx` | CRITICAL |
| Google Places service | `src/services/places.service.ts` | CRITICAL |
| Destination picker | `book/destination.tsx` | CRITICAL |

### Google Maps API Setup Required
- Maps SDK for Android/iOS
- Places API
- Distance Matrix API
- Geocoding API

### Testing Checklist
- [ ] Map renders correctly
- [ ] Current location detected
- [ ] Destination search works
- [ ] Fare estimate returns accurate data
- [ ] Available drivers API returns nearby drivers

---

## Week 6: Customer Booking Flow

### Backend Tasks
| Task | Files | Priority |
|------|-------|----------|
| Ride Booking API | `controllers/rides.controller.ts`, `services/ride.service.ts` | CRITICAL |
| Driver Matching Service | `services/matching.service.ts` | CRITICAL |
| Ride Status API | `controllers/rides.controller.ts` | HIGH |
| Socket.io Ride Events | `sockets/ride.socket.ts` | CRITICAL |

**Endpoints:**
- `POST /api/rides/book` - Create ride request
- `GET /api/rides/:id` - Get ride details
- `POST /api/rides/:id/cancel` - Cancel ride
- `GET /api/rides/active` - Get active ride

**Socket Events (Server → Customer):**
- `ride:driver_assigned` - Driver accepted
- `ride:driver_arriving` - Driver en route
- `ride:cancelled` - Ride cancelled

### Customer App Tasks
| Task | Files | Priority |
|------|-------|----------|
| Booking confirmation | `book/confirm.tsx` | CRITICAL |
| Driver search screen | `book/searching.tsx` | CRITICAL |
| Socket.io client | `src/services/socket.service.ts` | CRITICAL |
| Ride store (Zustand) | `src/stores/rideStore.ts` | HIGH |

### Driver Matching Algorithm (Simple Nearest)
1. Query available drivers from Redis
2. Calculate Haversine distance to each
3. Sort by distance, send to nearest
4. 30-second timeout, try next driver

### Testing Checklist
- [ ] Booking creates ride in database
- [ ] Driver matching finds nearest driver
- [ ] Socket events emit correctly
- [ ] Customer can cancel during search
- [ ] Fare displayed correctly

---

## Week 7: Driver App Core Features

### Backend Tasks
| Task | Files | Priority |
|------|-------|----------|
| Driver Availability API | `controllers/drivers.controller.ts` | CRITICAL |
| Driver Location Update | `controllers/drivers.controller.ts` | CRITICAL |
| Ride Accept/Reject API | `controllers/rides.controller.ts` | CRITICAL |
| Ride Start/Complete API | `controllers/rides.controller.ts` | CRITICAL |
| Socket.io Driver Events | `sockets/driver.socket.ts` | CRITICAL |

**Endpoints:**
- `PUT /api/drivers/me/status` - Online/offline toggle
- `POST /api/drivers/me/location` - Location update
- `POST /api/driver/rides/:id/accept` - Accept ride
- `POST /api/driver/rides/:id/reject` - Reject ride
- `POST /api/driver/rides/:id/start` - Start trip
- `POST /api/driver/rides/:id/complete` - Complete trip

### Driver App Tasks
| Task | Files | Priority |
|------|-------|----------|
| Driver store (Zustand) | `src/stores/driverStore.ts` | HIGH |
| Socket.io client | `src/services/socket.service.ts` | CRITICAL |
| Home screen with toggle | `(tabs)/home.tsx` | CRITICAL |
| Ride request modal | `ride/request.tsx` | CRITICAL |
| Active ride screen | `ride/[id].tsx` | CRITICAL |
| Background location | `src/services/location.service.ts` | CRITICAL |

### Active Ride States
1. **ACCEPTED** - Navigate to pickup, "Arrived" button
2. **IN_PROGRESS** - Navigate to dropoff, "Complete" button

### Testing Checklist
- [ ] Online/offline toggle works
- [ ] Location updates sent when online
- [ ] Ride requests appear with 30s countdown
- [ ] Accept/reject functional
- [ ] "Arrived" and "Complete" buttons work
- [ ] Background location tracking works

---

## Week 8: Real-time Tracking + Completion

### Backend Tasks
| Task | Files | Priority |
|------|-------|----------|
| Location Broadcasting | `services/location.service.ts`, `sockets/location.socket.ts` | CRITICAL |
| Rating API | `routes/ratings.routes.ts`, `controllers/ratings.controller.ts` | HIGH |
| Ride History API | `controllers/rides.controller.ts` | MEDIUM |
| Driver Earnings API | `controllers/drivers.controller.ts` | MEDIUM |

**Endpoints:**
- `POST /api/rides/:id/rate` - Submit rating
- `GET /api/rides/history` - Customer history
- `GET /api/driver/rides/history` - Driver history
- `GET /api/drivers/me/earnings` - Earnings summary

### Customer App Tasks
| Task | Files | Priority |
|------|-------|----------|
| Active ride tracking | `ride/[id].tsx` | CRITICAL |
| Ride completion | `ride/complete.tsx` | HIGH |
| Ride history | `(tabs)/activity.tsx` | MEDIUM |
| Ride detail | `ride/history/[id].tsx` | MEDIUM |

### Driver App Tasks
| Task | Files | Priority |
|------|-------|----------|
| Ride completion | `ride/complete.tsx` | HIGH |
| Earnings screen | `(tabs)/earnings.tsx` | MEDIUM |
| Ride history | `ride/history.tsx` | MEDIUM |

### Shared Components
- `StarRating.tsx` - Interactive rating input
- `TripReceipt.tsx` - Trip summary component

### End-to-End Flow Test
1. Customer books ride
2. Driver receives and accepts
3. Driver arrives at pickup
4. Driver starts ride
5. Customer sees real-time driver location
6. Driver completes ride
7. Both rate each other
8. Ride appears in history

---

## Critical Files Summary

| File | Purpose |
|------|---------|
| `apps/backend/src/services/matching.service.ts` | Nearest-driver matching algorithm |
| `apps/backend/src/sockets/ride.socket.ts` | Real-time ride events |
| `apps/customer/app/_layout.tsx` | Root layout with providers |
| `apps/customer/src/stores/rideStore.ts` | Active ride state management |
| `apps/customer/src/services/socket.service.ts` | Socket.io client for real-time |
| `apps/driver/src/services/location.service.ts` | Background location tracking |

---

## Verification Plan

### Weekly Milestones
- **Week 3**: ✅ API client makes authenticated requests, navigation works
- **Week 4**: ✅ Customer app registration/login flow complete (Driver app pending)
- **Week 5**: Map displays, destination search works, fare estimates return
- **Week 6**: Customer can complete booking flow, socket events work
- **Week 7**: Driver can go online, accept rides, complete trips
- **Week 8**: End-to-end ride with real-time tracking and ratings

### Device Testing
- Android physical device throughout
- iOS Simulator for development
- EAS Development Build on device at Week 4

### API Testing
- Postman collection for all endpoints
- Socket.io testing with separate client

---

## Prerequisites / Setup Required

1. **Google Maps API Key** - Ready
   - Ensure these APIs are enabled: Maps SDK, Places API, Distance Matrix API, Geocoding API

2. **OTP Handling** - Console logging (already implemented, Twilio deferred to Phase 2)

3. **EAS Build** - Already configured, build development APK for device testing

---

## How to Start

When ready to begin implementation, say:
> "Let's start Week 3 of the MVP plan"

The work will proceed week by week with testable deliverables at each milestone.
