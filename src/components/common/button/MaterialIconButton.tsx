import { ComponentProps } from 'react';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { MaterialIcons } from '@expo/vector-icons';

import { useTheme } from '@/context/ThemeProvider';

type IconVariant = 'default' | 'filled' | 'outlined' | 'ghost';

interface MaterialIconButtonProps {
  icon: ComponentProps<typeof MaterialIcons>['name'];
  size?: number;
  color?: string;
  onPress?: () => void;
  variant?: IconVariant;
  disabled?: boolean;
  style?: ViewStyle;
}

const MaterialIconButton = ({
  icon,
  size = 24,
  color,
  onPress,
  variant = 'default',
  disabled = false,
  style,
}: MaterialIconButtonProps) => {
  const { theme } = useTheme();

  // variant에 따른 배경색 결정
  const getBackgroundColor = () => {
    if (disabled) return '#E0E0E0';

    switch (variant) {
      case 'filled':
        return theme.primary;
      case 'outlined':
        return 'transparent';
      case 'ghost':
        return 'transparent';
      default:
        return theme.surface;
    }
  };

  // variant에 따른 아이콘 색상 결정
  const getIconColor = () => {
    if (disabled) return theme.textSecondary;
    if (color) return color;

    switch (variant) {
      case 'filled':
        return '#fff';
      default:
        return theme.text;
    }
  };

  // variant에 따른 테두리 스타일
  const getBorderStyle = () => {
    if (variant === 'outlined') {
      return {
        borderWidth: 1,
        borderColor: disabled ? '#E0E0E0' : theme.border,
      };
    }
    return {};
  };

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.container,
        {
          backgroundColor: getBackgroundColor(),
          opacity: pressed ? 0.7 : 1,
          padding: variant === 'ghost' ? 4 : 8,
        },
        getBorderStyle(),
        style,
      ]}
    >
      <MaterialIcons name={icon} size={size} color={getIconColor()} />
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
});

export default MaterialIconButton;
