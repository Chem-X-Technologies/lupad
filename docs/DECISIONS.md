# Lupad - Decision Log

This document records important technical and architectural decisions made during the development of Lupad.

---

## 2026-01-17: Project Initialization

### Decision: App Name - "Lupad"

**Status:** ✅ Accepted  
**Context:** Needed a memorable name for the ride-hailing app  
**Decision:** Use "Lupad" (meaning "Fly" in local language)  
**Rationale:**

- Inside joke between founders and friends
- Easy to remember and pronounce locally
- Short and catchy
- .ph domain availability (to be checked)

**Consequences:**

- Branding will be built around this name
- May need to explain meaning to non-local users

---

## 2026-01-17: Monorepo Structure

### Decision: Use Turborepo for Monorepo Management

**Status:** ✅ Accepted  
**Context:** Need to manage multiple apps (customer, driver, backend) with shared code  
**Alternatives Considered:**

- Nx (more complex, enterprise-focused)
- Lerna (older, less maintained)
- pnpm workspaces only (no task orchestration)

**Decision:** Use Turborepo  
**Rationale:**

- Simple and fast
- Great developer experience
- Excellent caching mechanism
- Good documentation
- Active development and community

**Consequences:**

- Team needs to learn Turborepo basics
- Build pipeline configured through turbo.json

---

## 2026-01-17: Expo Strategy

### Decision: Use Expo Development Builds (Not Expo Go)

**Status:** ✅ Accepted  
**Context:** Need flexibility to use native modules and custom configurations  
**Alternatives Considered:**

- Expo Go (limited to Expo SDK only)
- React Native CLI (more complex setup)

**Decision:** Expo with Development Builds  
**Rationale:**

- More flexibility than Expo Go
- Access to any native library
- Still simpler than React Native CLI
- EAS Build for easy distribution
- Can eject if needed (last resort)

**Consequences:**

- Slightly longer build times
- Need to rebuild when adding native modules
- Better control over app configuration

---

## 2026-01-17: Local Development Strategy (Phase 1)

### Decision: Host Everything Locally During Phase 1

**Status:** ✅ Accepted  
**Context:** Want to minimize costs during initial development  
**Alternatives Considered:**

- Cloud hosting from day 1 (Supabase, Railway)
- Mix of local and cloud services

**Decision:** Full local development environment for Phase 1  
**Rationale:**

- Cost savings: ~$100-350/month saved
- Faster iteration (no network latency)
- Learn infrastructure before deploying
- Can test without internet dependency

**Consequences:**

- Need to document local setup clearly
- Team members need PostgreSQL and Redis installed
- Migration to cloud after Phase 1
- Testing will be limited to local network initially

**Migration Plan:**

- Deploy to test environment after Phase 1 completion
- Invite friends for real-world testing

---

## 2026-01-17: Database Choice

### Decision: PostgreSQL + Redis Combination

**Status:** ✅ Accepted  
**Context:** Need reliable database with geospatial support and real-time capabilities  
**Alternatives Considered:**

- MongoDB (NoSQL)
- Firebase (BaaS)
- MySQL (no PostGIS)

**Decision:** PostgreSQL as primary, Redis for caching/real-time  
**Rationale:**

**PostgreSQL:**

- ACID compliance (critical for payments/bookings)
- Excellent geospatial support (PostGIS)
- Proven reliability
- Great free hosting options (Supabase, Neon)
- Easy to scale vertically and horizontally

**Redis:**

- Perfect for real-time driver locations
- Fast caching layer
- Pub/Sub for real-time features
- Simple key-value store

**Consequences:**

- Need to manage two database systems
- Team needs SQL knowledge
- Better data integrity and scalability

---

## 2026-01-17: State Management

### Decision: Zustand (or Jotai) for State Management

**Status:** ✅ Accepted  
**Context:** Need lightweight state management for mobile apps  
**Alternatives Considered:**

- Redux Toolkit (more boilerplate)
- Context API only (can cause re-render issues)
- MobX (different paradigm)

**Decision:** Zustand as primary choice  
**Rationale:**

- Minimal boilerplate
- Simple API, easy to learn
- Good TypeScript support
- Small bundle size
- No Provider wrapping needed
- Can always switch to Redux if needed

**Consequences:**

- Team needs to learn Zustand patterns
- Less community resources than Redux
- Sufficient for Phase 1 scope

---

## 2026-01-17: Server State Management

### Decision: React Query (TanStack Query) for Server State

**Status:** ✅ Accepted  
**Context:** Need to manage API calls, caching, and synchronization  
**Alternatives Considered:**

- Manual fetch with useEffect
- Redux with RTK Query
- SWR

**Decision:** React Query (TanStack Query)  
**Rationale:**

- Industry standard for server state
- Automatic caching and refetching
- Optimistic updates support
- Built-in loading/error states
- Great DevTools
- Separates server state from client state

**Consequences:**

- Learning curve for team
- Another dependency to manage
- Significantly reduces boilerplate code

---

## 2026-01-17: Backend Framework

### Decision: Node.js + Express (Consider Fastify)

**Status:** ✅ Accepted  
**Context:** Need backend API server with real-time capabilities  
**Alternatives Considered:**

- NestJS (more opinionated, TypeScript-first)
- Fastify (faster, similar API to Express)
- Hono (newer, very fast)

**Decision:** Start with Express, evaluate Fastify  
**Rationale:**

- Express: Most popular, huge ecosystem
- Team familiarity likely higher
- Socket.io integration well-documented
- Can switch to Fastify easily if performance needed
- TypeScript support in both

**Consequences:**

- May need to migrate to Fastify if performance becomes issue
- Express is slightly slower but difference minimal at Phase 1 scale

---

## 2026-01-17: ORM Choice

### Decision: Prisma for Database Management

**Status:** ✅ Accepted  
**Context:** Need type-safe database access with migrations  
**Alternatives Considered:**

- TypeORM (older, more complex)
- Sequelize (less type-safe)
- Drizzle ORM (newer, promising)
- Raw SQL (no type safety)

**Decision:** Prisma ORM  
**Rationale:**

- Excellent TypeScript support
- Intuitive schema definition
- Great migration system
- Prisma Studio (visual DB editor)
- Active development
- Great documentation

**Consequences:**

- Vendor lock-in (moderate)
- Some complex queries might need raw SQL
- Excellent DX overall

---

## 2026-01-17: Real-Time Communication

### Decision: Socket.io for Real-Time Features

**Status:** ✅ Accepted  
**Context:** Need real-time location updates and ride status  
**Alternatives Considered:**

- WebSockets (native)
- Server-Sent Events (SSE)
- Firebase Realtime Database
- Supabase Realtime

**Decision:** Socket.io  
**Rationale:**

- Battle-tested in production
- Automatic fallback to polling if WebSocket fails
- Room-based architecture fits ride matching
- Good React Native support
- Built-in reconnection logic

**Consequences:**

- Adds complexity to backend
- Stateful connections (need sticky sessions if scaling)
- Great fit for ride-hailing use case

---

## 2026-01-17: Maps Provider

### Decision: Google Maps API (Evaluate Mapbox Later)

**Status:** ✅ Accepted  
**Context:** Need maps, geocoding, routing, and distance calculation  
**Alternatives Considered:**

- Mapbox (cheaper, more customizable)
- OpenStreetMap (free, less features)
- Apple Maps (iOS only)

**Decision:** Start with Google Maps API  
**Rationale:**

- Most comprehensive API
- Better coverage in Philippines
- Familiar to users
- react-native-maps supports both Google and Apple
- Can switch to Mapbox if costs become issue

**Consequences:**

- Higher costs at scale (~$200/month with usage)
- Excellent data quality
- May evaluate Mapbox in Phase 2+ if cost optimization needed

---

## 2026-01-17: Documentation Strategy

### Decision: Maintain Multiple Documentation Files

**Status:** ✅ Accepted  
**Context:** Need to preserve context across conversations and for team  
**Decision:** Create and maintain:

- README.md (setup and overview)
- ROADMAP.md (timeline and milestones)
- PROGRESS.md (current status tracking)
- ARCHITECTURE.md (technical decisions)
- DECISIONS.md (this file)

**Rationale:**

- Helps AI assistants understand project context
- Onboards new team members easily
- Documents decisions for future reference
- Tracks progress systematically

**Consequences:**

- Need to keep files updated
- Small overhead but massive benefit
- Better project continuity

---

## 2026-01-17: Target Market Strategy

### Decision: Focus on Calbayog City Only (Initial Launch)

**Status:** ✅ Accepted  
**Context:** Need to start with manageable scope  
**Alternatives Considered:**

- Launch in multiple cities
- Regional launch (all of Samar)

**Decision:** Calbayog City only for initial production  
**Rationale:**

- Focused operations and support
- Easier driver recruitment and training
- Can optimize for local conditions
- Test and iterate faster
- Lower marketing costs

**Consequences:**

- Limited initial market size
- Can expand later based on learnings
- Build strong foundation in one city first

---

## Template for Future Decisions

### Decision: [Decision Title]

**Status:** 🔄 Proposed | ✅ Accepted | ❌ Rejected | 🔄 Under Review  
**Date:** YYYY-MM-DD  
**Context:** [Why this decision is needed]  
**Alternatives Considered:**

- Option 1 (reason for not choosing)
- Option 2 (reason for not choosing)

**Decision:** [What was decided]  
**Rationale:**

- Reason 1
- Reason 2

**Consequences:**

- Positive consequence 1
- Trade-off 1

**Related Decisions:**

- Link to related decision (if any)

---

**Note:** When making a new decision:

1. Copy the template above
2. Add date in YYYY-MM-DD format
3. Fill in all sections thoughtfully
4. Add to the top of the file (after initial decisions)
5. Update status as decision evolves
