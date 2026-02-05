import * as React from 'react';
import { cn } from '../../lib/utils';
import { TextInput, type TextInputProps } from 'react-native';

const Input = React.forwardRef<TextInput, TextInputProps>(
  ({ className, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'h-12 w-full border-b border-input text-lg text-foreground',
          props.editable === false && 'opacity-50',
          className
        )}
        placeholderTextColor="#9E9E9E"
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
