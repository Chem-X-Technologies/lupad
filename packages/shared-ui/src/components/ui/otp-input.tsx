import * as React from 'react';
import { View, TextInput } from 'react-native';
import { cn } from '../../lib/utils';

interface OtpInputProps {
  length?: number;
  value: string[];
  onChange: (otp: string[]) => void;
  disabled?: boolean;
  className?: string;
}

const OtpInput = React.forwardRef<View, OtpInputProps>(
  ({ length = 6, value, onChange, disabled = false, className }, ref) => {
    const inputRefs = React.useRef<(TextInput | null)[]>([]);

    const handleChange = (text: string, index: number) => {
      if (text.length > 1) {
        text = text[text.length - 1];
      }

      const newOtp = [...value];
      newOtp[index] = text;
      onChange(newOtp);

      // Move to next input
      if (text && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyPress = (
      e: { nativeEvent: { key: string } },
      index: number
    ) => {
      if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    /** Focus the first empty input (useful after clearing) */
    const focusFirst = () => {
      inputRefs.current[0]?.focus();
    };

    // Expose focusFirst via imperative handle if needed
    React.useImperativeHandle(ref, () => {
      const viewRef = {} as View;
      (viewRef as any).focusFirst = focusFirst;
      return viewRef;
    });

    return (
      <View className={cn('flex-row justify-between', className)}>
        {Array.from({ length }).map((_, index) => (
          <TextInput
            key={index}
            ref={(inputRef) => {
              inputRefs.current[index] = inputRef;
            }}
            className="w-12 h-12 border-b-2 border-input text-center text-2xl text-foreground"
            keyboardType="number-pad"
            maxLength={1}
            value={value[index] || ''}
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            selectTextOnFocus
            editable={!disabled}
          />
        ))}
      </View>
    );
  }
);

OtpInput.displayName = 'OtpInput';

export { OtpInput, type OtpInputProps };
