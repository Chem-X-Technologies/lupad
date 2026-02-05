import { View, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { cn } from '../../lib/utils';
import { Text } from './text';

interface HeaderProps {
  /** Main title text */
  title: string;
  /** Optional subtitle text */
  subtitle?: string;
  /** Show back button (default: true) */
  showBack?: boolean;
  /** Back button handler - required if showBack is true */
  onBack?: () => void;
  /** Additional className for the container */
  className?: string;
}

function Header({
  title,
  subtitle,
  showBack = true,
  onBack,
  className,
}: HeaderProps) {
  return (
    <View className={cn('bg-primary pt-12 pb-8 px-6', className)}>
      {showBack && onBack && (
        <Pressable onPress={onBack} className="mb-4">
          <Ionicons name="chevron-back" size={24} color="white" />
        </Pressable>
      )}
      <Text className="text-3xl font-bold text-white mb-2">{title}</Text>
      {subtitle && <Text className="text-base text-white/80">{subtitle}</Text>}
    </View>
  );
}

export { Header };
export type { HeaderProps };
