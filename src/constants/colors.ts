// Design System Color Palette
export const palette = {
  // Primary Colors
  primary: {
    light: '#007AFF',
    dark: '#0A84FF',
  },
  secondary: {
    light: '#5856D6',
    dark: '#5E5CE6',
  },

  // Status Colors
  success: {
    light: '#34C759',
    dark: '#32D74B',
  },
  error: {
    light: '#FF3B30',
    dark: '#FF453A',
  },
  warning: {
    light: '#FF9500',
    dark: '#FF9F0A',
  },

  // Neutral Colors
  background: {
    light: '#FFFFFF',
    dark: '#000000',
  },
  surface: {
    light: '#F5F5F5',
    dark: '#1C1C1E',
  },
  text: {
    light: '#000000',
    dark: '#FFFFFF',
  },
  textSecondary: {
    light: '#666666',
    dark: '#ABABAB',
  },
  border: {
    light: '#E0E0E0',
    dark: '#38383A',
  },
};

export const lightTheme = {
  primary: palette.primary.light,
  secondary: palette.secondary.light,
  success: palette.success.light,
  error: palette.error.light,
  warning: palette.warning.light,
  background: palette.background.light,
  surface: palette.surface.light,
  text: palette.text.light,
  textSecondary: palette.textSecondary.light,
  border: palette.border.light,
};

export const darkTheme = {
  primary: palette.primary.dark,
  secondary: palette.secondary.dark,
  success: palette.success.dark,
  error: palette.error.dark,
  warning: palette.warning.dark,
  background: palette.background.dark,
  surface: palette.surface.dark,
  text: palette.text.dark,
  textSecondary: palette.textSecondary.dark,
  border: palette.border.dark,
};
