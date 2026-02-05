# Lupad Design System & Components

**Package:** `@lupad/shared-ui`
**Location:** `packages/shared-ui/src/components/ui/`
**Last Updated:** February 5, 2026

---

## Color Palette

### Primary Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **Teal** | `#00BFA5` | `--primary` | Headers, primary buttons, success states |
| **Orange** | `#FFB300` | `--secondary` | Secondary buttons, CTAs, highlights |

### Neutral Colors

| Name | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| **White** | `#FFFFFF` | `--background` | Backgrounds, cards |
| **Dark Gray** | `#333333` | `--foreground` | Primary text |
| **Medium Gray** | `#9E9E9E` | `--muted-foreground` | Secondary text, placeholders |
| **Light Gray** | `#E0E0E0` | `--border` | Borders, dividers |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Error** | `#F44336` | Error states, destructive actions |
| **Route** | `#5C6BC0` | Map route lines |

---

## Typography

### Font Family
System default (San Francisco on iOS, Roboto on Android)

### Scale

| Variant | Size | Weight | Usage |
|---------|------|--------|-------|
| `h1` | 30px | Bold | Screen titles |
| `h2` | 24px | SemiBold | Section headers |
| `h3` | 20px | SemiBold | Card titles |
| `large` | 18px | SemiBold | Emphasized body |
| `default` | 16px | Regular | Body text |
| `small` | 14px | Regular | Secondary text |
| `muted` | 14px | Regular | Captions (gray) |

---

## Spacing

**Base unit:** 4px

| Name | Size | Tailwind |
|------|------|----------|
| xs | 4px | `p-1` |
| sm | 8px | `p-2` |
| md | 16px | `p-4` |
| lg | 24px | `p-6` |
| xl | 32px | `p-8` |

**Screen padding:** 24px horizontal, 16px vertical

---

## Components

### Button

**File:** `packages/shared-ui/src/components/ui/button.tsx`

```tsx
import { Button, Text } from '@lupad/shared-ui';

<Button variant="default" onPress={handlePress}>
  <Text>Log In</Text>
</Button>

<Button variant="secondary" disabled={!isValid}>
  <Text>Send OTP</Text>
</Button>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `disabled` | `boolean` | `false` | Disable state |
| `onPress` | `() => void` | - | Press handler |

**Variants:**
- `default` - Teal background, white text
- `secondary` - Orange background, white text
- `destructive` - Red background, white text
- `outline` - Transparent with border
- `ghost` - Transparent, no border
- `link` - Text only

**Design specs:** Height 56px, border-radius 12px

---

### Text

**File:** `packages/shared-ui/src/components/ui/text.tsx`

```tsx
import { Text } from '@lupad/shared-ui';

<Text variant="h1">Welcome</Text>
<Text variant="muted">Secondary info</Text>
<Text className="text-primary font-bold">Custom</Text>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'h1' \| 'h2' \| 'h3' \| 'large' \| 'small' \| 'muted'` | `'default'` | Text style |
| `className` | `string` | - | Additional Tailwind classes |

---

### Input

**File:** `packages/shared-ui/src/components/ui/input.tsx`

```tsx
import { Input } from '@lupad/shared-ui';

<Input
  placeholder="Your name"
  value={name}
  onChangeText={setName}
/>
```

**Props:** All React Native `TextInputProps` plus:

| Prop | Type | Description |
|------|------|-------------|
| `ref` | `React.Ref<TextInput>` | Forward ref for focus |
| `className` | `string` | Additional Tailwind classes |

**Design specs:** Underline style (bottom border only), height 48px, placeholder #9E9E9E

---

### Header

**File:** `packages/shared-ui/src/components/ui/header.tsx`

```tsx
import { Header } from '@lupad/shared-ui';

<Header
  title="Sign Up"
  subtitle="Enter your mobile number"
  onBack={() => router.back()}
/>
```

**Props:**

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Main title |
| `subtitle` | `string` | - | Optional subtitle |
| `showBack` | `boolean` | `true` | Show back button |
| `onBack` | `() => void` | - | Back handler |

**Design specs:** Teal background (#00BFA5), white text, title 30px bold

---

## Components To Build

| Component | Description | Priority |
|-----------|-------------|----------|
| **OtpInput** | 6-digit OTP with individual boxes | High |
| **PhoneInput** | Country code + number combo | High |
| **BottomSheet** | Sliding panel from bottom | High |
| **VehicleSelectItem** | Selectable vehicle row | Medium |
| **DriverCard** | Avatar, name, rating, actions | Medium |
| **StarRating** | Interactive 5-star rating | Medium |
| **Modal** | Centered dialog with overlay | Medium |

---

## Usage

```tsx
import { Button, Text, Input, Header, cn } from '@lupad/shared-ui';
```

### Tailwind Config

Apps must include shared-ui in content paths:

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    '../../packages/shared-ui/src/**/*.{js,jsx,ts,tsx}',
  ],
};
```

---

## Screen Reference

| Screen | File | Key Components |
|--------|------|----------------|
| Splash | `1. splash-screen.png` | Logo, branding |
| Onboarding | `2. onboarding-1.png` | Slides, dots |
| Phone Entry | `3. onboarding-2-mobile-number.png` | PhoneInput, Button |
| OTP | `4. onboarding-3-otp-verification.png` | OtpInput, Header |
| Nickname | `5. onboarding-4-customer-nickname.png` | Input, Header |
| Home | `7. home.png` | Map, BottomSheet |
| Booking | `15. booking-details.png` | DriverCard, Map |
| Rating | `19. rate-your-driver.png` | StarRating, Modal |

Figma screenshots in `docs/designs/`
