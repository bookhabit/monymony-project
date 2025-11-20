import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useRouter } from 'expo-router';

import { useTheme } from '@/context/ThemeProvider';

import TextBox from '@/components/common/TextBox';

interface NavButton {
  title: string;
  route: string;
  color?: string;
}

interface NavigationBarProps {
  buttons: NavButton[];
}

export const NavigationBar: React.FC<NavigationBarProps> = ({ buttons }) => {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {buttons.map((button, index) => (
        <Pressable
          key={index}
          style={[
            styles.button,
            { backgroundColor: button.color || theme.primary },
          ]}
          onPress={() => router.push(button.route as any)}
        >
          <TextBox variant="button2" color="#fff">
            {button.title}
          </TextBox>
        </Pressable>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 15,
  },
  title: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 8,
    alignItems: 'center',
  },
});

export default NavigationBar;
