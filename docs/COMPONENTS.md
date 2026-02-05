# Lupad Shared UI Components

**Package:** `@lupad/shared-ui`
**Location:** `packages/shared-ui/src/components/ui/`
**Last Updated:** February 5, 2026

This document lists the reusable UI components available in the shared-ui package. These components are designed to be used across both the Customer and Driver apps.

---

## Design Principles

- **Mobile-only**: No web-specific code (hover states, focus-visible, etc.)
- **NativeWind**: Uses Tailwind CSS classes via NativeWind v4
- **CVA**: Uses class-variance-authority for variant management
- **TextClassContext**: Button and Text components share text styling context

---

## Available Components

### 1. Button

**File:** `button.tsx`

A pressable button component with multiple variants.

```tsx
import { Button } from '@lupad/shared-ui';

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
| `variant` | `'default' \| 'destructive' \| 'outline' \| 'secondary' \| 'ghost' \| 'link'` | `'default'` | Button style variant |
| `size` | `'default' \| 'sm' \| 'lg' \| 'icon'` | `'default'` | Button size |
| `disabled` | `boolean` | `false` | Disable button |
| `className` | `string` | - | Additional Tailwind classes |
| `onPress` | `() => void` | - | Press handler |

**Variants:**
- `default` - Teal background (#00BFA5), white text
- `secondary` - Orange background (#FFB300), white text
- `destructive` - Red background, white text
- `outline` - Transparent with border
- `ghost` - Transparent, no border
- `link` - Text only, link style

**Design Notes:**
- Height: 56px (h-14) by default
- Border radius: 12px (rounded-xl)
- Children must use `<Text>` component for proper text styling

---

### 2. Text

**File:** `text.tsx`

A text component with semantic variants for typography.

```tsx
import { Text } from '@lupad/shared-ui';

<Text variant="h1">Welcome</Text>
<Text variant="muted">Secondary information</Text>
<Text className="text-primary font-bold">Custom styled</Text>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `'default' \| 'h1' \| 'h2' \| 'h3' \| 'large' \| 'small' \| 'muted'` | `'default'` | Text style variant |
| `asChild` | `boolean` | `false` | Render as child component (Slot pattern) |
| `className` | `string` | - | Additional Tailwind classes |

**Variants:**
- `default` - Base text (16px)
- `h1` - Heading 1 (30px, bold)
- `h2` - Heading 2 (24px, semibold)
- `h3` - Heading 3 (20px, semibold)
- `large` - Large text (18px, semibold)
- `small` - Small text (14px)
- `muted` - Muted text (14px, gray)

---

### 3. Input

**File:** `input.tsx`

A text input component with underline style matching the design system.

```tsx
import { Input } from '@lupad/shared-ui';

<Input
  placeholder="Your name"
  value={name}
  onChangeText={setName}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `ref` | `React.Ref<TextInput>` | - | Forward ref to TextInput |
| `className` | `string` | - | Additional Tailwind classes |
| `editable` | `boolean` | `true` | Enable/disable input |
| ...rest | `TextInputProps` | - | All React Native TextInput props |

**Design Notes:**
- Underline style (bottom border only)
- Height: 48px (h-12)
- Placeholder color: #9E9E9E
- Supports `ref` forwarding for focus management

---

### 4. Header

**File:** `header.tsx`

A teal header component for auth/form screens.

```tsx
import { Header } from '@lupad/shared-ui';

<Header
  title="Sign Up"
  subtitle="Enter your mobile number"
  onBack={() => router.back()}
/>

<Header
  title="Welcome"
  showBack={false}
/>
```

**Props:**
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | required | Main title text |
| `subtitle` | `string` | - | Optional subtitle text |
| `showBack` | `boolean` | `true` | Show back button |
| `onBack` | `() => void` | - | Back button handler |
| `className` | `string` | - | Additional Tailwind classes |

**Design Notes:**
- Background: Teal (#00BFA5)
- Title: White, bold, 30px
- Subtitle: White with 80% opacity
- Back button: White chevron icon

---

## Usage in Apps

Import components from the shared-ui package:

```tsx
import { Button, Text, Input, Header } from '@lupad/shared-ui';
```

The package also exports utilities:
```tsx
import { cn } from '@lupad/shared-ui'; // Tailwind class merger
```

---

## Tailwind Configuration

Apps using shared-ui must include the package in their Tailwind content paths:

```js
// tailwind.config.js
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx}',
    '../../packages/shared-ui/src/**/*.{js,jsx,ts,tsx}', // Include shared-ui
  ],
  // ...
};
```

---

## Components to Add (Future)

Based on Figma designs, these components will be needed:

| Component | Description | Screen Reference |
|-----------|-------------|------------------|
| **OtpInput** | 6-digit OTP input with individual boxes | OTP Verification |
| **PhoneInput** | Country code + number field combo | Registration |
| **BottomSheet** | Sliding panel from bottom | Home, Booking |
| **Card** | Info cards with shadow | Various |
| **VehicleSelectItem** | Selectable vehicle type row | Vehicle Selection |
| **DriverCard** | Avatar, name, rating, actions | Booking Details |
| **StarRating** | Interactive 5-star rating | Rate Driver |
| **Modal** | Centered dialog with overlay | Confirmations |
| **LocationInput** | Pickup/dropoff location row | Home |

---

## Color Reference (CSS Variables)

The components use CSS variables defined in `global.css`:

| Variable | HSL Value | Hex Equivalent | Usage |
|----------|-----------|----------------|-------|
| `--primary` | 172 100% 37% | #00BFA5 | Teal - headers, primary buttons |
| `--secondary` | 42 100% 50% | #FFB300 | Orange - secondary buttons, CTAs |
| `--foreground` | 0 0% 20% | #333333 | Dark gray - text |
| `--muted-foreground` | 0 0% 45% | #737373 | Medium gray - secondary text |
| `--border` | 0 0% 88% | #E0E0E0 | Light gray - borders |
