import {
  View,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text, Header, Input } from '@lupad/shared-ui';
import { useAuthStore } from '../../src/stores/authStore';

export default function RegisterVehicleScreen() {
  const router = useRouter();
  const { setVehicleInfo, pendingRegistration } = useAuthStore();
  const [vehicleType, setVehicleType] = useState(
    pendingRegistration.vehicleType || ''
  );
  const [licenseNumber, setLicenseNumber] = useState(
    pendingRegistration.licenseNumber || ''
  );
  const [plateNumber, setPlateNumber] = useState(
    pendingRegistration.plateNumber || ''
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (vehicleType.trim().length < 2) {
      newErrors.vehicleType = 'Enter a valid vehicle type';
    }
    if (licenseNumber.trim().length < 5) {
      newErrors.licenseNumber = 'Enter a valid license number';
    }
    if (plateNumber.trim().length < 3) {
      newErrors.plateNumber = 'Enter a valid plate number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validate()) return;

    setVehicleInfo({
      vehicleType: vehicleType.trim(),
      licenseNumber: licenseNumber.trim(),
      plateNumber: plateNumber.trim(),
    });

    router.push('/(auth)/register-password');
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['bottom']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <Header
          title="Vehicle Details"
          subtitle="Step 2 of 3 — Vehicle Info"
          onBack={() => router.back()}
        />

        <ScrollView
          className="flex-1 px-6 pt-8"
          keyboardShouldPersistTaps="handled"
        >
          {/* Vehicle Type */}
          <Text className="text-sm text-muted-foreground mb-1">
            Vehicle Type
          </Text>
          <Input
            placeholder="e.g. Motorcycle, Sedan, SUV"
            value={vehicleType}
            onChangeText={setVehicleType}
            autoCapitalize="words"
            className="mb-1"
          />
          {errors.vehicleType ? (
            <Text className="text-error text-sm mb-4">
              {errors.vehicleType}
            </Text>
          ) : (
            <View className="mb-6" />
          )}

          {/* License Number */}
          <Text className="text-sm text-muted-foreground mb-1">
            License Number
          </Text>
          <Input
            placeholder="Enter your driver's license number"
            value={licenseNumber}
            onChangeText={setLicenseNumber}
            autoCapitalize="characters"
            className="mb-1"
          />
          {errors.licenseNumber ? (
            <Text className="text-error text-sm mb-4">
              {errors.licenseNumber}
            </Text>
          ) : (
            <View className="mb-6" />
          )}

          {/* Plate Number */}
          <Text className="text-sm text-muted-foreground mb-1">
            Plate Number
          </Text>
          <Input
            placeholder="Enter your vehicle plate number"
            value={plateNumber}
            onChangeText={setPlateNumber}
            autoCapitalize="characters"
            className="mb-1"
          />
          {errors.plateNumber ? (
            <Text className="text-error text-sm mb-4">
              {errors.plateNumber}
            </Text>
          ) : (
            <View className="mb-6" />
          )}
        </ScrollView>

        {/* Button */}
        <View className="px-6 pb-8">
          <Button
            variant="secondary"
            onPress={handleNext}
            className="h-14 rounded-xl"
          >
            <Text>Next</Text>
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
