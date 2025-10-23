import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  ViewStyle,
} from 'react-native';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

export interface CustomButtonProps {
  title: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  style?: ViewStyle;
  testID?: string;
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  style,
  testID,
}) => {
  const { theme } = useTheme();

  // Variant별 스타일
  const getButtonStyle = () => {
    const baseStyle = {
      borderWidth: 1,
    };

    switch (variant) {
      case 'primary':
        return {
          ...baseStyle,
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        };
      case 'secondary':
        return {
          ...baseStyle,
          backgroundColor: theme.secondary,
          borderColor: theme.secondary,
        };
      case 'outline':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: theme.border,
        };
      case 'ghost':
        return {
          ...baseStyle,
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      case 'danger':
        return {
          ...baseStyle,
          backgroundColor: theme.error,
          borderColor: theme.error,
        };
      default:
        return {
          ...baseStyle,
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        };
    }
  };

  // Text 색상
  const getTextColor = () => {
    switch (variant) {
      case 'primary':
      case 'secondary':
      case 'danger':
        return '#FFFFFF';
      case 'outline':
      case 'ghost':
        return theme.text;
      default:
        return theme.text;
    }
  };

  // Size별 스타일
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          height: 36,
          paddingHorizontal: 12,
          borderRadius: 8,
        };
      case 'large':
        return {
          height: 56,
          paddingHorizontal: 24,
          borderRadius: 14,
        };
      case 'medium':
      default:
        return {
          height: 48,
          paddingHorizontal: 16,
          borderRadius: 12,
        };
    }
  };

  // Text variant
  const getTextVariant = () => {
    switch (size) {
      case 'small':
        return 'button4';
      case 'large':
        return 'button1';
      case 'medium':
      default:
        return 'button2';
    }
  };

  return (
    <Pressable
      testID={testID}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading }}
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.base,
        getButtonStyle(),
        getSizeStyle(),
        {
          opacity: disabled ? 0.5 : pressed ? 0.8 : 1,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <TextBox variant={getTextVariant() as any} color={getTextColor()}>
          {title}
        </TextBox>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default CustomButton;
