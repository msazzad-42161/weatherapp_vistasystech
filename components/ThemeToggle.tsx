// components/ThemeToggle.tsx
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import { useThemeStore } from '../stores/themeStore';

interface Props {
  showLabel?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ThemeToggle: React.FC<Props> = ({ showLabel = false, size = 'medium' }) => {
  const { mode, isDark, setMode, theme } = useThemeStore();

  const getIcon = () => {
    switch (mode) {
      case 'light':
        return '☀️';
      case 'dark':
        return '🌙';
      case 'system':
        return '⚙️';
      default:
        return isDark ? '🌙' : '☀️';
    }
  };

  const getLabel = () => {
    switch (mode) {
      case 'light':
        return 'Light';
      case 'dark':
        return 'Dark';
      case 'system':
        return 'System';
      default:
        return 'Auto';
    }
  };

  const cycleTheme = () => {
    switch (mode) {
      case 'light':
        setMode('dark');
        break;
      case 'dark':
        setMode('system');
        break;
      case 'system':
        setMode('light');
        break;
    }
  };

  const iconSize = size === 'small' ? 16 : size === 'large' ? 24 : 20;
  const containerSize = size === 'small' ? 32 : size === 'large' ? 48 : 40;

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.surface,
          borderColor: theme.colors.border,
          width: containerSize,
          height: containerSize,
        },
      ]}
      onPress={cycleTheme}
      accessibilityLabel={`Current theme: ${getLabel()}. Tap to change theme`}
      accessibilityRole="button"
      accessibilityHint="Cycles between light, dark, and system themes"
    >
      <Text style={[styles.icon, { fontSize: iconSize }]}>
        {getIcon()}
      </Text>
      {showLabel && (
        <Text style={[styles.label, { color: theme.colors.textSecondary }]}>
          {getLabel()}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  icon: {
    textAlign: 'center',
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: 4,
  },
});

export default ThemeToggle;