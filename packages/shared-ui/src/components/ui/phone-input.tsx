import * as React from 'react';
import { View, TextInput, type TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../../lib/utils';
import { Text } from './text';

interface PhoneInputProps extends Omit<TextInputProps, 'keyboardType' | 'maxLength'> {
  countryCode?: string;
}

const PhoneInput = React.forwardRef<TextInput, PhoneInputProps>(
  ({ className, countryCode = '+63', ...props }, ref) => {
    return (
      <View
        className={cn(
          'flex-row items-center border-b border-input pb-2',
          className
        )}
      >
        <View className="flex-row items-center pr-4 border-r border-input">
          <Text className="text-base text-foreground">{countryCode}</Text>
          <Ionicons
            name="chevron-down"
            size={16}
            color="#9E9E9E"
            style={{ marginLeft: 4 }}
          />
        </View>
        <TextInput
          ref={ref}
          className="flex-1 ml-4 text-lg text-foreground"
          placeholder="Mobile Number"
          placeholderTextColor="#9E9E9E"
          keyboardType="phone-pad"
          maxLength={10}
          {...props}
        />
      </View>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

export { PhoneInput, type PhoneInputProps };
