# Lupad - Decision Log

This document records important technical and architectural decisions made during the development of Lupad.

---

## 2026-02-05: Mobile-Only Shared UI Components

### Decision: Remove Web-Specific Code from Shared UI Components

**Status:** ✅ Accepted
**Context:** The shared-ui package was built using React Native Reusables which includes web-specific code (hover states, focus-visible, responsive breakpoints). Lupad is a mobile-only app.
**Alternatives Considered:**

- Keep web-specific code for potential future web app (adds bloat, unused)
- Remove web code now, add back later if needed (cleaner, simpler)

**Decision:** Remove all web-specific code from shared-ui components
**Rationale:**

- Lupad is strictly a mobile app (no web version planned)
- Cleaner, more readable component code
- Smaller bundle size
- Easier to maintain and understand
- Can always add web support later if needed

**Changes Made:**

- Button: Removed `Platform.select({ web: ... })`, removed `sm:` responsive prefixes
- Text: Removed unused variants (h4, p, blockquote, code, lead), removed web styles
- Input: Simplified to underline style matching Figma designs
- Header: Already clean, no changes needed

**Consequences:**

- Components are now mobile-focused and simpler
- TextClassContext pattern kept for Button/Text integration
- CVA (class-variance-authority) kept for variant management
- If web support needed later, will require adding back web styles

---

## 2026-01-31: Simplified OTP Auth Flow for Customer App

### Decision: Add Unified OTP Endpoints That Handle Both New and Existing Users

**Status:** ✅ Accepted
**Context:** The original backend had separate register/login flows which required the frontend to know if a user existed before requesting OTP
**Alternatives Considered:**

- Keep separate register and login flows (more frontend complexity)
- Have frontend check user existence first, then call appropriate endpoint (extra API call)
- Unified flow: one endpoint handles both cases (simpler frontend)

**Decision:** Add `/auth/otp/request` and `/auth/otp/verify` endpoints
**Rationale:**

- Simpler frontend code - just request OTP for any phone number
- Better UX - user doesn't need to know if they're "registering" or "logging in"
- Backend determines if user is new and creates account on verification
- Matches modern auth flows (WhatsApp, Telegram style)
- Original endpoints kept for backwards compatibility and driver app

**Consequences:**

- Two auth flows coexist: original (register/login) and simplified (otp/request, otp/verify)
- Customer app uses simplified flow
- Driver app will use original password-based flow
- Slightly more backend code, but much simpler frontend

---

## 2026-01-31: Dynamic Environment Configuration with app.config.ts

### Decision: Replace app.json with app.config.ts for Dynamic Configuration

**Status:** ✅ Accepted
**Context:** Need to configure API URL differently for development (local IP) vs production without rebuilding
**Alternatives Considered:**

- Hardcode API URL and rebuild for each environment (slow, error-prone)
- Use static app.json with environment in code (can't change bundler host)
- Dynamic app.config.ts with environment variables (flexible)

**Decision:** Use app.config.ts with EXPO_PUBLIC_API_URL env variable
**Rationale:**

- Environment variables read at build/dev time
- No code changes needed between environments
- Each developer can have their own .env.development with their local IP
- Production URL configured via EAS Secrets
- REACT_NATIVE_PACKAGER_HOSTNAME also configurable for WSL

**Configuration:**
```
apps/customer/
├── app.config.ts         # Dynamic config (reads env vars)
├── .env.development      # Local dev config (gitignored)
├── .env.production       # Production config (gitignored)
└── .env.example          # Template for developers
```

**Consequences:**

- app.json deleted (replaced by app.config.ts)
- Each developer needs to create .env.development
- More flexible deployment and testing
- WSL users can configure Windows IP for device testing

---

## 2026-01-30: Feature-First Development Approach

### Decision: Build Features End-to-End Instead of Infrastructure-First

**Status:** ✅ Accepted
**Context:** Need to decide development approach for Phase 1 MVP
**Alternatives Considered:**

- Infrastructure-first: Build all shared components, then all screens
- Feature-first: Build complete features one at a time (backend → frontend → integration)

**Decision:** Use feature-first development approach
**Rationale:**

- Faster feedback loops - can test features immediately
- Better context retention - work on related code together
- Reduces over-engineering - build only what's needed
- More satisfying progress - complete features instead of partial systems
- Easier to pivot if requirements change

**Consequences:**

- May have some code duplication initially (acceptable)
- Features are independently testable
- Team can see tangible progress faster
- Documented in AI_INSTRUCTIONS.md for consistency

---

## 2026-01-30: Shared Code Architecture (Hybrid Approach)

### Decision: Share API Client, Keep Auth Logic Per App

**Status:** ✅ Accepted
**Context:** Customer and Driver apps have different auth flows (OTP vs password)
**Alternatives Considered:**

- Fully shared: Everything in shared-utils (complex, tightly coupled)
- Fully separate: Duplicate all code per app (more maintenance)
- Hybrid: Share common utilities, keep app-specific logic separate

**Decision:** Hybrid approach
**Structure:**

- `packages/shared-utils/src/api.ts` - API client factory, token interceptors, types
- `apps/customer/src/services/auth.ts` - Customer-specific auth (OTP-based)
- `apps/driver/src/services/auth.ts` - Driver-specific auth (password-based)

**Rationale:**

- Customer: Passwordless OTP flow (simpler, frictionless)
- Driver: Password + optional OTP (more secure for earnings/payouts)
- API client is identical - share to avoid duplication
- Auth logic differs significantly - keep separate for clarity

**Consequences:**

- Clear separation of concerns
- Each app can evolve auth independently
- Shared code is truly reusable
- No awkward conditional logic in shared code

---

## 2026-01-30: Mobile Styling with NativeWind

### Decision: Use NativeWind (Tailwind CSS for React Native)

**Status:** ✅ Accepted
**Context:** Need styling solution for Customer and Driver apps
**Alternatives Considered:**

- StyleSheet (native RN - verbose, no theming)
- Styled Components (runtime overhead)
- Tamagui (complex setup)
- NativeWind (Tailwind for RN)
- Gluestack UI (component library)

**Decision:** NativeWind v4 with Tailwind CSS v3
**Rationale:**

- Familiar Tailwind syntax (team already knows it)
- Rapid prototyping with utility classes
- Easy theming with custom colors
- Good TypeScript support
- Matches design system colors easily
- Small runtime overhead

**Configuration:**

- Custom theme colors: primary (#00BFA5), secondary (#FFB300)
- Gray scale: dark (#333333), medium (#9E9E9E), light (#E0E0E0)

**Consequences:**

- Team needs React Native + Tailwind knowledge
- className strings instead of StyleSheet objects
- Some advanced styling may need native StyleSheet
- Design system colors documented in DESIGN_SYSTEM.md

---

## 2026-01-18: Authentication Strategy

### Decision: Hybrid Authentication - Passwordless for Customers, Password-Based for Drivers

**Status:** ✅ Accepted  
**Context:** Need to balance user experience with security for different user types  
**Alternatives Considered:**

- Password authentication for everyone (traditional approach)
- Passwordless OTP for everyone (modern, but SMS costs add up)
- Social login (Google, Facebook) - adds complexity

**Decision:** Implement hybrid authentication:

- **Customers:** Passwordless via phone OTP only
- **Drivers:** Phone + password with optional OTP 2FA

**Rationale:**

**For Customers (Passwordless):**

- Simpler onboarding: phone → OTP → nickname → done
- No password to remember or forget
- Faster login experience
- Less friction for occasional users
- Modern UX (like WhatsApp)

**For Drivers (Password-based):**

- More security (handling money, earnings, sensitive data)
- Login frequently throughout day (OTP fatigue would be annoying)
- Professional account requires stronger authentication
- Can add 2FA later for extra security
- Password reset available via OTP

**Consequences:**

- Schema: `password` field is optional, `authMethod` enum tracks auth type
- Two different auth flows in mobile apps
- SMS costs lower (only OTP for customers, optional for drivers)
- Need clear UX differentiation between customer and driver flows
- More flexible: can migrate drivers to passwordless later if needed

---

## 2026-01-18: API Validation Library

### Decision: Use Zod over Joi for Request Validation

**Status:** ✅ Accepted  
**Context:** Need schema validation for API requests  
**Alternatives Considered:**

- Joi (traditional, widely used)
- Yup (React-focused)
- Class-validator (decorator-based)

**Decision:** Use Zod  
**Rationale:**

- TypeScript-first (automatic type inference)
- Better DX with IntelliSense
- Smaller bundle size than Joi
- Modern API design
- Works seamlessly with Prisma types
- Growing ecosystem and community

**Consequences:**

- Team needs to learn Zod syntax
- Excellent TypeScript integration reduces bugs
- Can extract types from schemas automatically

---

## 2026-01-18: Prisma Version Selection

### Decision: Use Prisma 6 with CommonJS

**Status:** ✅ Accepted  
**Context:** Initially installed Prisma 7, but encountered ESM compatibility issues with the Node.js backend running in CommonJS mode  
**Alternatives Considered:**

- Prisma 7 with ES Modules (ESM-first approach)
- Prisma 5 (stable LTS version)
- Prisma 6 (intermediate release)

**Decision:** Use Prisma 6 with CommonJS  
**Rationale:**

- **Prisma 7 ESM Issues:** Requires full ESM migration, has dependency conflicts (zeptomatch ESM-only)
- **Prisma 5 too old:** In maintenance mode, missing performance improvements
- **Prisma 6 is the sweet spot:**
  - Excellent CommonJS support (no ESM complications)
  - Performance improvements over Prisma 5
  - TypedSQL feature available
  - Actively maintained
  - Works seamlessly with Express ecosystem

**Consequences:**

- No ESM migration needed now
- Better compatibility with Express/JWT/bcrypt libraries
- Can upgrade to Prisma 7 when ecosystem matures
- Simpler import statements (no .js extensions needed for relative imports)

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
