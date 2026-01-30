# Lupad Design System

**Last Updated:** January 30, 2026
**Source:** Figma designs exported to `docs/designs/`

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Teal** | `#00BFA5` | Headers, primary buttons, accents, pickup markers |
| **Orange/Amber** | `#FFB300` | Secondary buttons, dropoff markers, highlights, CTA |

### Neutral Colors

| Name | Hex | Usage |
|------|-----|-------|
| **White** | `#FFFFFF` | Backgrounds, cards, button text |
| **Light Gray** | `#F5F5F5` | Secondary backgrounds, dividers |
| **Medium Gray** | `#9E9E9E` | Placeholder text, secondary text, icons |
| **Dark Gray** | `#333333` | Primary text, headings |
| **Black** | `#000000` | High emphasis text |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#00BFA5` | Success states, confirmations |
| **Error** | `#F44336` | Error states, destructive actions |
| **Warning** | `#FFB300` | Warning states |
| **Info** | `#2196F3` | Informational states |

### Map Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Route Line** | `#5C6BC0` | Route path on map (indigo/blue) |
| **Pickup Marker** | `#00BFA5` | Pickup location (teal) |
| **Dropoff Marker** | `#FFB300` | Dropoff location (orange) |
| **Location Pulse** | `#00BFA5` (20% opacity) | Current location indicator |

---

## Typography

### Font Family
- **Primary:** System default (San Francisco on iOS, Roboto on Android)
- **Fallback:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif`

### Font Sizes

| Name | Size | Weight | Usage |
|------|------|--------|-------|
| **H1** | 28px | Bold (700) | Screen titles on teal headers |
| **H2** | 24px | Bold (700) | Section headers |
| **H3** | 20px | SemiBold (600) | Card titles, modal headers |
| **Body Large** | 18px | Regular (400) | Primary body text |
| **Body** | 16px | Regular (400) | Standard body text |
| **Body Small** | 14px | Regular (400) | Secondary text, captions |
| **Caption** | 12px | Regular (400) | Labels, timestamps |
| **Button** | 16px | SemiBold (600) | Button text (uppercase) |

### Text Colors
- **On Teal Background:** White (`#FFFFFF`)
- **On White Background:** Dark Gray (`#333333`)
- **Secondary/Placeholder:** Medium Gray (`#9E9E9E`)

---

## Spacing

### Base Unit
- **4px** base unit for consistent spacing

### Spacing Scale

| Name | Size | Usage |
|------|------|-------|
| **xs** | 4px | Tight spacing, inline elements |
| **sm** | 8px | Small gaps, icon padding |
| **md** | 16px | Standard component spacing |
| **lg** | 24px | Section spacing |
| **xl** | 32px | Large section gaps |
| **2xl** | 48px | Screen padding top/bottom |

### Screen Padding
- **Horizontal:** 24px (left and right)
- **Vertical:** 16px (content areas)

---

## Border Radius

| Name | Size | Usage |
|------|------|-------|
| **sm** | 4px | Small elements, tags |
| **md** | 8px | Inputs, small cards |
| **lg** | 12px | Buttons, cards |
| **xl** | 16px | Bottom sheets, modals |
| **full** | 9999px | Pills, avatars, circular buttons |

---

## Components

### Buttons

#### Primary Button
- **Background:** Teal (`#00BFA5`)
- **Text:** White, uppercase, 16px semibold
- **Border Radius:** 12px
- **Height:** 52px
- **Width:** Full width (with 24px horizontal margin)
- **Shadow:** Subtle elevation

#### Secondary Button
- **Background:** Orange (`#FFB300`)
- **Text:** White, uppercase, 16px semibold
- **Border Radius:** 12px
- **Height:** 52px

#### Outline Button
- **Background:** Transparent
- **Border:** 1px solid Teal
- **Text:** Teal, 16px semibold
- **Border Radius:** 12px
- **Height:** 52px

#### Cancel/Destructive Button
- **Background:** Teal (`#00BFA5`) or Coral for emphasis
- **Text:** White
- **Usage:** Cancel booking, destructive actions

### Input Fields

#### Text Input
- **Style:** Underline (no border, bottom line only)
- **Line Color:** Light gray, Teal when focused
- **Text:** 18px, dark gray
- **Placeholder:** Medium gray
- **Height:** 48px

#### Phone Input
- **Country Code:** +63 with dropdown indicator
- **Separator:** Vertical line
- **Number Field:** Placeholder "Mobile Number"

#### OTP Input
- **Style:** 6 separate boxes
- **Box Size:** ~48px x 48px
- **Border:** Bottom line only
- **Spacing:** 8px between boxes
- **Font:** 24px, centered

### Headers

#### Teal Header
- **Background:** Teal (`#00BFA5`)
- **Shape:** Curved bottom edge (border-radius on bottom corners)
- **Height:** ~180px (varies by content)
- **Back Button:** White chevron left icon
- **Title:** White, bold, 28px
- **Subtitle:** White, regular, 16px (70% opacity)

### Cards & Bottom Sheets

#### Bottom Sheet
- **Background:** White
- **Border Radius:** 16px (top corners only)
- **Shadow:** `0 -4px 20px rgba(0, 0, 0, 0.1)`
- **Drag Indicator:** 40px x 4px, centered, light gray, rounded

#### Info Card
- **Background:** White
- **Border Radius:** 12px
- **Padding:** 16px
- **Shadow:** `0 2px 8px rgba(0, 0, 0, 0.08)`

### Vehicle Selection Item

#### Unselected
- **Background:** White
- **Border:** None or light gray
- **Icon:** Vehicle silhouette (dark gray)
- **Text:** Name (bold), subtitle (gray), price (right-aligned)

#### Selected
- **Background:** Teal (`#00BFA5`)
- **Text:** White
- **Icon:** White

### Map Components

#### Current Location Marker
- **Center:** Teal circle with navigation arrow icon
- **Pulse:** Teal with 20% opacity, animated

#### Pickup Marker
- **Style:** Teal circle with white center dot
- **Size:** 24px

#### Dropoff Marker
- **Style:** Orange pin/teardrop shape
- **Size:** 32px height

#### Route Line
- **Color:** Indigo/Blue (`#5C6BC0`)
- **Width:** 4px
- **Style:** Solid

### Driver Info Card

- **Avatar:** 48px circle, border
- **Name:** Bold, 18px
- **Vehicle Info:** Regular, 14px, gray
- **Rating:** Yellow star + number
- **Action Buttons:** Message (teal), Call (teal), circular

### Rating Component

- **Stars:** 5 stars, 32px each
- **Active:** Yellow/gold (`#FFC107`)
- **Inactive:** Light gray outline
- **Interactive:** Tap to select rating

### Modal/Dialog

- **Background Overlay:** Black, 50% opacity
- **Card:** White, centered, 16px border radius
- **Icon:** Teal checkmark for success (48px)
- **Title:** Bold, 20px, centered
- **Body:** Regular, 16px, gray, centered
- **Actions:** Text buttons (Cancel, Done)

---

## Iconography

### Style
- **Type:** Outlined or filled (consistent within context)
- **Size:** 24px default
- **Color:** Inherits from context (teal, white, or gray)

### Common Icons
- Back arrow (chevron left)
- Current location (navigation arrow)
- Pin/marker
- Car/vehicle
- Motorcycle
- Star (rating)
- Phone (call)
- Message/chat
- Menu (hamburger)
- Search
- Close (X)

---

## Shadows

| Name | Value | Usage |
|------|-------|-------|
| **sm** | `0 1px 2px rgba(0, 0, 0, 0.05)` | Subtle elevation |
| **md** | `0 2px 8px rgba(0, 0, 0, 0.08)` | Cards, buttons |
| **lg** | `0 4px 16px rgba(0, 0, 0, 0.12)` | Modals, bottom sheets |
| **xl** | `0 8px 24px rgba(0, 0, 0, 0.16)` | Floating elements |

---

## Animation Guidelines

### Durations
- **Fast:** 150ms (micro-interactions, button press)
- **Normal:** 250ms (transitions, modals)
- **Slow:** 350ms (page transitions, complex animations)

### Easing
- **Default:** `ease-in-out`
- **Enter:** `ease-out`
- **Exit:** `ease-in`

### Common Animations
- Bottom sheet slide up
- Modal fade in + scale
- Button press scale (0.98)
- Location pulse (scale + fade)
- Loading spinner rotation

---

## Screen Reference

| # | Screen | File |
|---|--------|------|
| 1 | Splash | `1. splash-screen.png` |
| 2 | Onboarding | `2. onboarding-1.png` |
| 3 | Phone Entry | `3. onboarding-2-mobile-number.png` |
| 4 | OTP Verification | `4. onboarding-3-otp-verification.png` |
| 5 | Nickname Setup | `5. onboarding-4-customer-nickname.png` |
| 6 | GPS Permission | `6. setup-GPS.png` |
| 7 | Home Map | `7. home.png` |
| 8 | Destination Search | `8. choose-drop-off-search.png` |
| 9 | Manual Pin Drop | `9. choose-drop-off-manual-pin.png` |
| 10 | Route & Fare | `10. route-and-fare-calculated.png` |
| 11 | Vehicle Type | `11. choose-vehicle-type-view.png` |
| 12 | Payment Method | `12. choose-payment-method.png` |
| 13 | Searching | `13. searching-for-drivers.png` |
| 14 | Driver Found | `14. driver-found.png` |
| 15 | Booking Details | `15. booking-details.png` |
| 16 | Message Driver | `16. message-driver.png` |
| 17 | Driver Arrived | `17. driver-arrived-at-pickup.png` |
| 18 | Ride Ongoing | `18. ride-ongoing.png` |
| 19 | Rate Driver | `19. rate-your-driver.png` |
| 20 | Send Tips | `20. send-tips.png` |

---

## Implementation Notes

### React Native / Expo

```typescript
// Example theme constants
export const colors = {
  primary: '#00BFA5',
  secondary: '#FFB300',
  background: '#FFFFFF',
  text: '#333333',
  textSecondary: '#9E9E9E',
  border: '#E0E0E0',
  error: '#F44336',
  success: '#00BFA5',
  route: '#5C6BC0',
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

export const fontSize = {
  caption: 12,
  bodySmall: 14,
  body: 16,
  bodyLarge: 18,
  h3: 20,
  h2: 24,
  h1: 28,
};
```

### Accessibility
- Minimum touch target: 44x44 points
- Color contrast ratio: 4.5:1 minimum for text
- Support for dynamic type sizes
- Screen reader labels for all interactive elements
