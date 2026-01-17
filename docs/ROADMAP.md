# Detailed Project Roadmap - Lupad

**Project Name:** Lupad ("Fly" in local language) - Ride-Hailing App  
**Project Type:** Uber/Grab-style ride-hailing for Calbayog City  
**Target Location:** Calbayog City, Samar, Philippines  
**Tech Stack:** Expo (Development Build), Node.js, PostgreSQL, Redis  
**Monorepo Structure:** Turborepo with Customer App, Driver App, Backend, and Shared Packages  
**Development Strategy:** Local hosting during Phase 1, move to test environment after completion  
**Created:** January 17, 2026

---

## Pre-Development Phase (Week 1-2)

### Week 1: Setup & Planning

- [ ] Set up monorepo with Turborepo
- [ ] Initialize Expo apps with Development Build configuration
- [ ] Set up shared packages structure
- [ ] Configure TypeScript, ESLint, Prettier across workspace
- [ ] Set up Git repository & branching strategy
- [ ] Create initial database schema design
- [ ] Set up local development environment:
  - Local PostgreSQL database
  - Local Redis instance
  - Google Maps API key (can use free tier for development)
  - Consider mock SMS service or limited Twilio credits for testing

### Week 2: Backend Foundation

- [ ] Set up Node.js + Express backend with TypeScript (running locally)
- [ ] Configure Prisma ORM with local PostgreSQL
- [ ] Implement basic API structure (REST endpoints)
- [ ] Set up Socket.io server
- [ ] Create authentication system (JWT)
- [ ] Set up local Redis for caching
- [ ] Configure environment variables & secrets management
- [ ] Document local development setup for team members

---

## Phase 1: MVP Development (Week 3-8) - 6 weeks

### Week 3-4: User Management & Authentication

**Backend:**

- [ ] User registration API (customers & drivers)
- [ ] Login/logout endpoints
- [ ] Phone verification with OTP (via Twilio)
- [ ] JWT token generation & validation
- [ ] User profile CRUD operations
- [ ] Driver application & verification workflow

**Frontend (Both Apps):**

- [ ] Onboarding/splash screens
- [ ] Registration flow with phone verification
- [ ] Login screen
- [ ] Profile setup screens
- [ ] Basic navigation structure

**Deliverable:** Users can register, verify phone, and log in

### Week 5-6: Core Booking Flow (Customer App)

**Backend:**

- [ ] Ride booking API endpoints
- [ ] Fare calculation logic (base fare + per km rate for Calbayog)
- [ ] Get available drivers endpoint
- [ ] Ride status management (pending, accepted, in-progress, completed, cancelled)
- [ ] Real-time ride updates via Socket.io

**Customer App:**

- [ ] Home screen with map (react-native-maps)
- [ ] Current location detection
- [ ] Destination picker (with Calbayog City landmarks/areas)
- [ ] Fare estimate display
- [ ] Book ride functionality
- [ ] Ride status screen (waiting for driver)
- [ ] Active ride tracking screen

**Deliverable:** Customers can book rides and see fare estimates

### Week 7: Driver App Core Features

**Backend:**

- [ ] Driver availability toggle API
- [ ] Ride request notification system
- [ ] Driver location update endpoints
- [ ] Accept/reject ride APIs
- [ ] Start/complete ride APIs

**Driver App:**

- [ ] Driver home screen with map
- [ ] Online/offline toggle
- [ ] Incoming ride requests UI
- [ ] Accept/reject ride functionality
- [ ] Navigate to pickup location
- [ ] Pick up customer flow
- [ ] Navigate to destination
- [ ] Complete ride flow

**Deliverable:** Drivers can receive and fulfill ride requests

### Week 8: Real-time Tracking & Completion

**Backend:**

- [ ] Real-time location broadcasting (Socket.io)
- [ ] Ride completion logic
- [ ] Rating system API
- [ ] Ride history endpoints

**Both Apps:**

- [ ] Real-time driver location updates on customer app
- [ ] Real-time route tracking during ride
- [ ] Ride completion screen
- [ ] Rating system (rate driver/customer)
- [ ] Ride history screen
- [ ] Basic trip receipt

**Deliverable:** End-to-end ride experience with tracking and completion

**🎯 Phase 1 Milestone:** At this point, deploy to test environment and invite friends for testing

- [ ] Set up test environment (Supabase/Neon for PostgreSQL, Redis Cloud, Railway/Render for backend)
- [ ] Deploy backend to test server
- [ ] Build and distribute test apps to friends (EAS Build or TestFlight/Internal Testing)
- [ ] Gather feedback from friends' testing sessions
- [ ] Create feedback collection system (form/chat group)

---

## Phase 2: Essential Features (Week 9-11) - 3 weeks

### Week 9: Notifications & Communication

- [ ] Push notifications setup (Expo Notifications)
- [ ] SMS notifications for critical events
- [ ] In-app notification center
- [ ] Basic in-app calling (link to phone dialer)
- [ ] Driver-customer communication during active ride

### Week 10: Payment Integration (Digital Payments)

- [ ] Integrate payment provider (Stripe, PayMongo, or Xendit for PH)
- [ ] Cash payment tracking & management
- [ ] Digital payment flow (GCash, PayMaya integration)
- [ ] Payment history
- [ ] Driver earnings dashboard
- [ ] Payout system (manual for MVP)

### Week 11: Admin Dashboard (Basic)

- [ ] Simple web dashboard for operations
- [ ] View all rides (real-time)
- [ ] User management (approve/suspend drivers)
- [ ] Manual ride dispatch if needed
- [ ] Basic analytics (rides per day, revenue)
- [ ] Support ticket system (basic)

**Deliverable:** Production-ready MVP with payments and basic admin controls

---

## Phase 3: Polish & Testing (Week 12-13) - 2 weeks

### Week 12: Testing & Bug Fixes

- [ ] End-to-end testing of all flows
- [ ] Load testing (simulate multiple concurrent rides)
- [ ] Test in Calbayog City areas (different barangays)
- [ ] GPS accuracy testing in various areas
- [ ] Network failure handling
- [ ] Offline mode handling
- [ ] Edge case testing (cancellations, timeouts)

### Week 13: UI/UX Polish & Optimization

- [ ] UI refinements based on testing
- [ ] Performance optimization
- [ ] Reduce app bundle size
- [ ] Improve load times
- [ ] Add loading states & skeleton screens
- [ ] Error message improvements
- [ ] Add onboarding tutorials
- [ ] Localization preparation (English & Waray-Waray if needed)

---

## Phase 4: Pre-Launch (Week 14-15) - 2 weeks

### Week 14: Soft Launch Preparation

- [ ] Create marketing materials
- [ ] Driver recruitment in Calbayog City
- [ ] Driver training materials/sessions
- [ ] Set up customer support channels (Facebook Page, phone line)
- [ ] Legal compliance (business permits, insurance)
- [ ] Terms of service & privacy policy
- [ ] Build apps for production (create EAS builds)
- [ ] Submit apps to App Store & Play Store

### Week 15: Beta Testing

- [ ] Closed beta with 10-20 test users
- [ ] Closed beta with 5-10 test drivers
- [ ] Monitor all rides closely
- [ ] Gather feedback
- [ ] Fix critical issues
- [ ] Adjust pricing if needed

---

## Phase 5: Launch (Week 16+)

### Week 16: Soft Launch

- [ ] Launch to limited area (1-2 barangays in Calbayog)
- [ ] Limit to 50 customers, 10 drivers
- [ ] Daily monitoring & support
- [ ] Quick iteration on feedback

### Week 17-18: Gradual Expansion

- [ ] Expand to more barangays
- [ ] Onboard more drivers
- [ ] Monitor system performance & scaling needs
- [ ] Marketing campaigns (social media, local radio)

### Week 19+: Full City Launch

- [ ] Launch city-wide in Calbayog
- [ ] Scale infrastructure as needed
- [ ] Continue driver recruitment
- [ ] Implement Phase 6 features based on feedback

---

## Phase 6: Post-Launch Enhancements (Week 20+)

### Future Features (Priority TBD)

- [ ] Scheduled rides
- [ ] Ride sharing (multiple passengers)
- [ ] Multiple vehicle types (motorcycle, tricycle, car)
- [ ] Promo codes & referral system
- [ ] Driver incentive programs
- [ ] Heat maps for driver positioning
- [ ] Advanced analytics dashboard
- [ ] Customer loyalty program
- [ ] Integration with local businesses (package delivery)
- [ ] Favorite locations & drivers
- [ ] SOS/emergency button
- [ ] Ride insurance

---

## Technology Milestones

| Phase                | Infrastructure Needs                                           | Hosting              |
| -------------------- | -------------------------------------------------------------- | -------------------- |
| MVP (Week 1-8)       | Local PostgreSQL, Local Redis, development builds              | **Local Machine**    |
| Phase 1 Complete     | Deploy to test environment, invite friends for testing         | **Test Environment** |
| Phase 2 (Week 9-11)  | Payment gateway, SMS service, basic monitoring                 | Test Environment     |
| Phase 3 (Week 12-13) | Error tracking (Sentry), analytics                             | Test Environment     |
| Launch (Week 16+)    | Production builds on stores, CDN for assets, backup systems    | **Production**       |
| Scale (Month 3+)     | Load balancer, database scaling, multiple regions if expanding | Production (scaled)  |

---

## Success Metrics to Track

### MVP Success Criteria:

- 50+ completed rides in beta
- < 5% ride cancellation rate
- Average driver response time < 3 minutes
- App crash rate < 1%
- 4+ star average rating

### Launch Success Criteria (Month 1):

- 500+ registered customers
- 30+ active drivers
- 100+ rides per week
- Payment success rate > 95%
- Customer retention > 60%

---

## Estimated Timeline Summary

- **Total MVP Development:** 13 weeks (~3 months)
- **Pre-Launch & Testing:** 2 weeks
- **Beta to Full Launch:** 3-4 weeks
- **Total to Full Launch:** ~4.5 months

**Assumptions:**

- 1-2 full-time developers
- Part-time designer (UI/UX)
- Working 40 hours/week
- Minimal scope creep

---

## Budget Considerations (Monthly Estimates)

### Phase 1: Local Development (Week 1-8)

- Local PostgreSQL: $0 (self-hosted)
- Local Redis: $0 (self-hosted)
- Google Maps API: $0-50 (free tier + minimal testing)
- Twilio SMS: $0-20 (minimal testing or mocked)
- Expo EAS: $0 (free for development builds)

**Total Monthly: ~$0-70 during Phase 1** ✅ Cost savings!

### Phase 1+ Test Environment (After Week 8)

- Supabase/Neon (PostgreSQL): $0-25 (free tier)
- Redis Cloud: $0 (free tier)
- Railway/Render (backend hosting): $5-25
- Google Maps API: ~$50-100 (testing with friends)
- Twilio SMS: ~$20-50 (Philippine rates)
- Expo EAS: $0-29 (for test builds)

**Total Monthly: ~$75-230 during testing phase**

### Post-Launch (scaling costs increase)

- Add Sentry: $26+
- Increase hosting: $50-200
- More API usage: $200-500
- Payment processing fees: 2-3.5% of transactions

---

## Tech Stack Summary

### Frontend

- **Expo SDK** with Development Build
- **TypeScript**
- **React Navigation**
- **Zustand** or **Jotai** (state management)
- **React Query (TanStack Query)** (server state)
- **Expo Location**
- **react-native-maps**
- **Socket.io-client**
- **Stripe SDK** or **Xendit**

### Backend

- **Node.js + Express** or **Fastify**
- **TypeScript**
- **Socket.io**
- **Prisma ORM**
- **JWT** authentication
- **Google Maps API** or **Mapbox**

### Database

- **PostgreSQL** (primary database)
- **Redis** (caching & real-time)

### Additional Services

- **Google Maps Platform** or **Mapbox**
- **Twilio** or **AWS SNS** (SMS)
- **Expo Notifications** (push notifications)
- **Sentry** (error tracking)
- **Cloudinary** (image storage)

---

## Phase 1 Features (MVP Focus)

1. ✅ User registration/login (customers & drivers)
2. ✅ Basic ride booking flow
3. ✅ Simple driver matching (nearest available)
4. ✅ Real-time location tracking
5. ✅ Basic fare calculation (distance-based)
6. ✅ In-app chat (optional, can start with phone calls)
7. ✅ Cash payment only (add digital payments in Phase 2)

---

## Notes

- Start with single city (Calbayog City, Samar, Philippines)
- Use API versioning from day 1
- Implement proper logging & monitoring
- Keep business logic in backend (easy to modify)
- Use feature flags for gradual rollouts
- Structure code with clean architecture patterns
