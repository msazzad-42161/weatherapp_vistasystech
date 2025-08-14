// stores/themeStore.ts
import { create } from 'zustand';
import { Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Theme {
  colors: {
    background: string;
    surface: string;
    primary: string;
    secondary: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
    card: string;
    error: string;
    success: string;
    warning: string;
    info: string;
  };
}

const lightTheme: Theme = {
  colors: {
    background: '#ffffff',
    surface: '#f8f8f8',
    primary: '#007AFF',
    secondary: '#5856D6',
    text: '#333333',
    textSecondary: '#666666',
    textMuted: '#999999',
    border: '#e0e0e0',
    card: '#ffffff',
    error: '#FF3B30',
    success: '#34C759',
    warning: '#FF9500',
    info: '#007AFF',
  },
};

const darkTheme: Theme = {
  colors: {
    background: '#000000',
    surface: '#1c1c1e',
    primary: '#0A84FF',
    secondary: '#5E5CE6',
    text: '#ffffff',
    textSecondary: '#d1d1d6',
    textMuted: '#8e8e93',
    border: '#38383a',
    card: '#2c2c2e',
    error: '#FF453A',
    success: '#32D74B',
    warning: '#FF9F0A',
    info: '#64D2FF',
  },
};

interface ThemeState {
  mode: ThemeMode;
  isDark: boolean;
  theme: Theme;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  initializeTheme: () => Promise<void>;
}

const THEME_STORAGE_KEY = 'theme_mode';

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  isDark: Appearance.getColorScheme() === 'dark',
  theme: Appearance.getColorScheme() === 'dark' ? darkTheme : lightTheme,

  setMode: async (mode: ThemeMode) => {
    let isDark: boolean;
    
    if (mode === 'system') {
      isDark = Appearance.getColorScheme() === 'dark';
    } else {
      isDark = mode === 'dark';
    }

    set({
      mode,
      isDark,
      theme: isDark ? darkTheme : lightTheme,
    });

    // Persist theme preference
    await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
  },

  toggleTheme: () => {
    const { mode } = get();
    const newMode = mode === 'light' ? 'dark' : 'light';
    get().setMode(newMode);
  },

  initializeTheme: async () => {
    try {
      const savedMode = await AsyncStorage.getItem(THEME_STORAGE_KEY) as ThemeMode;
      if (savedMode) {
        get().setMode(savedMode);
      } else {
        // Default to system theme
        get().setMode('system');
      }
    } catch (error) {
      console.log('Error loading theme:', error);
      // Fallback to system theme
      get().setMode('system');
    }
  },
}));

// Listen to system theme changes
Appearance.addChangeListener(({ }) => {
  const { mode, setMode } = useThemeStore.getState();
  if (mode === 'system') {
    setMode('system'); // This will update the theme based on new system setting
  }
});