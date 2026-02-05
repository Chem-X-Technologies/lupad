import { cn } from '../../lib/utils';
import * as Slot from '@rn-primitives/slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';
import { Text as RNText, type Role } from 'react-native';

const textVariants = cva('text-base', {
  variants: {
    variant: {
      default: '',
      h1: 'text-3xl font-bold tracking-tight',
      h2: 'text-2xl font-semibold tracking-tight',
      h3: 'text-xl font-semibold tracking-tight',
      large: 'text-lg font-semibold',
      small: 'text-sm',
      muted: 'text-sm text-muted-foreground',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

type TextVariantProps = VariantProps<typeof textVariants>;

type TextVariant = NonNullable<TextVariantProps['variant']>;

const ROLE: Partial<Record<TextVariant, Role>> = {
  h1: 'heading',
  h2: 'heading',
  h3: 'heading',
};

const ARIA_LEVEL: Partial<Record<TextVariant, string>> = {
  h1: '1',
  h2: '2',
  h3: '3',
};

const TextClassContext = React.createContext<string | undefined>(undefined);

function Text({
  className,
  asChild = false,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof RNText> &
  TextVariantProps &
  React.RefAttributes<RNText> & {
    asChild?: boolean;
  }) {
  const textClass = React.useContext(TextClassContext);
  const Component = asChild ? Slot.Text : RNText;
  return (
    <Component
      className={cn(
        textVariants({ variant }),
        // Only apply default foreground color when not inside a styled context (e.g., Button)
        !textClass && 'text-foreground',
        textClass,
        className
      )}
      role={variant ? ROLE[variant] : undefined}
      aria-level={variant ? ARIA_LEVEL[variant] : undefined}
      {...props}
    />
  );
}

export { Text, TextClassContext };
