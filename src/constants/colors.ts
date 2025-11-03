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
  placeholder: {
    light: '#999999',
    dark: '#6D6D6D',
  },
  border: {
    light: '#E0E0E0',
    dark: '#38383A',
  },
};

// Workout App Color Palette
export const workoutPalette = {
  // Routine Colors
  routineA: {
    light: '#FF6B6B', // Red - 벤치/데드/이두
    dark: '#FF5252',
    gradient: ['#FF6B6B', '#FF8E8E'],
  },
  routineB: {
    light: '#4ECDC4', // Teal - 밀프/스쿼트/삼두
    dark: '#26A69A',
    gradient: ['#4ECDC4', '#6ED4CD'],
  },
  routineC: {
    light: '#95E1D3', // Mint - 바벨로우/덤벨로우/후면/사레레
    dark: '#80CBC4',
    gradient: ['#95E1D3', '#B4E8DD'],
  },
  rest: {
    light: '#B8B8B8', // Gray - 휴식
    dark: '#757575',
    gradient: ['#B8B8B8', '#D0D0D0'],
  },

  // Workout Status Colors
  workoutCompleted: {
    light: '#4ECDC4',
    dark: '#26A69A',
  },
  workoutActive: {
    light: '#FFD93D',
    dark: '#FFC107',
  },
  workoutChallenge: {
    light: '#FF6B6B',
    dark: '#FF5252',
  },

  // Accent Colors
  accentOrange: {
    light: '#FF8C42',
    dark: '#FF7043',
  },
  accentPurple: {
    light: '#9B59B6',
    dark: '#8E24AA',
  },
  accentBlue: {
    light: '#3498DB',
    dark: '#2980B9',
  },

  // Background Gradients
  workoutBg: {
    light: '#F8F9FA',
    dark: '#121212',
  },
  cardGradient: {
    light: ['#FFFFFF', '#F5F7FA'],
    dark: ['#1E1E1E', '#2C2C2C'],
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
  placeholder: palette.placeholder.light,
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
  placeholder: palette.placeholder.dark,
  border: palette.border.dark,
};

// Workout Theme Extensions
export const lightWorkoutTheme = {
  ...lightTheme,
  workoutBg: workoutPalette.workoutBg.light,
  routineA: workoutPalette.routineA.light,
  routineB: workoutPalette.routineB.light,
  routineC: workoutPalette.routineC.light,
  rest: workoutPalette.rest.light,
  workoutCompleted: workoutPalette.workoutCompleted.light,
  workoutActive: workoutPalette.workoutActive.light,
  workoutChallenge: workoutPalette.workoutChallenge.light,
  accentOrange: workoutPalette.accentOrange.light,
  accentPurple: workoutPalette.accentPurple.light,
  accentBlue: workoutPalette.accentBlue.light,
};

export const darkWorkoutTheme = {
  ...darkTheme,
  workoutBg: workoutPalette.workoutBg.dark,
  routineA: workoutPalette.routineA.dark,
  routineB: workoutPalette.routineB.dark,
  routineC: workoutPalette.routineC.dark,
  rest: workoutPalette.rest.dark,
  workoutCompleted: workoutPalette.workoutCompleted.dark,
  workoutActive: workoutPalette.workoutActive.dark,
  workoutChallenge: workoutPalette.workoutChallenge.dark,
  accentOrange: workoutPalette.accentOrange.dark,
  accentPurple: workoutPalette.accentPurple.dark,
  accentBlue: workoutPalette.accentBlue.dark,
};
