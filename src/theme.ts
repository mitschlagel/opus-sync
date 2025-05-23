import { useColorScheme } from 'react-native';

export interface ThemeColors {
  primary: string;
  background: string;
  cardBackground: string;
  cardBackgroundTranslucent: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  separator: string;
  accent: string;
}

const lightColors: ThemeColors = {
  primary: '#6366F1',
  background: '#F8FAFC',
  cardBackground: '#FFFFFF',
  cardBackgroundTranslucent: 'rgba(255, 255, 255, 0.95)',
  text: '#1E293B',
  textSecondary: '#475569',
  textTertiary: '#94A3B8',
  separator: '#E2E8F0',
  accent: '#EC4899'
};

const darkColors: ThemeColors = {
  primary: '#818CF8',
  background: '#0F172A',
  cardBackground: '#1E293B',
  cardBackgroundTranslucent: 'rgba(30, 41, 59, 0.95)',
  text: '#F1F5F9',
  textSecondary: '#CBD5E1',
  textTertiary: '#64748B',
  separator: '#334155',
  accent: '#F472B6'
};

export function useTheme() {
  const colorScheme = useColorScheme();
  return colorScheme === 'dark' ? darkColors : lightColors;
} 