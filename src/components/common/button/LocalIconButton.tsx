import { Pressable, StyleSheet, ViewStyle } from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import LocalIcon from '@/components/common/LocalIcon';

import * as Icons from '@/assets/images/svg';

type IconVariant = 'default' | 'filled' | 'outlined' | 'ghost';

interface LocalIconButtonProps {
  icon: keyof typeof Icons;
  size?: number;
  color?: string;
  onPress?: () => void;
  variant?: IconVariant;
  disabled?: boolean;
  style?: ViewStyle;
}

const LocalIconButton = ({
  icon,
  size = 24,
  color,
  onPress,
  variant = 'default',
  disabled = false,
  style,
}: LocalIconButtonProps) => {
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
      <LocalIcon name={icon} width={size} height={size} />
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

export default LocalIconButton;
