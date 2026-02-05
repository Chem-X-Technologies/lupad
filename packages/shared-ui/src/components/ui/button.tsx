import { TextClassContext } from './text';
import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { Pressable } from 'react-native';

const buttonVariants = cva(
  'group shrink-0 flex-row items-center justify-center gap-2 rounded-xl',
  {
    variants: {
      variant: {
        default: 'bg-primary active:bg-primary/90 shadow-sm shadow-black/5',
        destructive: 'bg-destructive active:bg-destructive/90 shadow-sm shadow-black/5',
        outline: 'border border-border bg-background active:bg-accent shadow-sm shadow-black/5',
        secondary: 'bg-secondary active:bg-secondary/80 shadow-sm shadow-black/5',
        ghost: 'active:bg-accent',
        link: '',
      },
      size: {
        default: 'h-14 px-4 py-2',
        sm: 'h-9 gap-1.5 rounded-md px-3',
        lg: 'h-11 rounded-md px-6',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const buttonTextVariants = cva('text-base font-semibold', {
  variants: {
    variant: {
      default: 'text-primary-foreground',
      destructive: 'text-white',
      outline: 'group-active:text-accent-foreground',
      secondary: 'text-secondary-foreground',
      ghost: 'group-active:text-accent-foreground',
      link: 'text-primary group-active:underline',
    },
    size: {
      default: '',
      sm: '',
      lg: '',
      icon: '',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
});

type ButtonProps = React.ComponentProps<typeof Pressable> &
  React.RefAttributes<typeof Pressable> &
  VariantProps<typeof buttonVariants>;

function Button({ className, variant, size, ...props }: ButtonProps) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ variant, size })}>
      <Pressable
        className={cn(
          props.disabled && 'opacity-50',
          buttonVariants({ variant, size }),
          className
        )}
        role="button"
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export { Button, buttonTextVariants, buttonVariants };
export type { ButtonProps };
