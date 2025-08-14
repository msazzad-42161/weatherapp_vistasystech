import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useThemeStore } from '../stores/themeStore';

interface Props {
  onCitySelect: (cityName: string) => Promise<void>;
  onCancel?: () => void;
}

const LocationSearch: React.FC<Props> = ({ onCitySelect, onCancel }) => {
  const [cityName, setCityName] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme } = useThemeStore();

  const handleSearch = async () => {
    const trimmedCity = cityName.trim();
    
    if (!trimmedCity) {
      Alert.alert('Invalid Input', 'Please enter a city name');
      return;
    }

    if (trimmedCity.length < 2) {
      Alert.alert('Invalid Input', 'City name must be at least 2 characters long');
      return;
    }

    setLoading(true);
    Keyboard.dismiss();

    try {
      await onCitySelect(trimmedCity);
    } catch (error) {
      Alert.alert(
        'City Not Found',
        error instanceof Error ? error.message : 'Please check the city name and try again',
        [{ text: 'OK', style: 'default' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.colors.text }]}>
            🌍 Search Location
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
            Enter a city name to get weather information
          </Text>
        </View>

        {/* Search Input */}
        <View style={styles.searchContainer}>
          <TextInput
            style={[styles.searchInput, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
              color: theme.colors.text,
            }]}
            placeholder="Enter city name (e.g., Dhaka, London)"
            placeholderTextColor={theme.colors.textMuted}
            value={cityName}
            onChangeText={setCityName}
            onKeyPress={handleKeyPress}
            autoCapitalize="words"
            autoCorrect={false}
            returnKeyType="search"
            onSubmitEditing={handleSearch}
            editable={!loading}
            accessibilityLabel="City name input"
            accessibilityHint="Enter a city name to search for weather"
          />
        </View>

        {/* Search Button */}
        <TouchableOpacity
          style={[
            styles.searchButton,
            { backgroundColor: theme.colors.primary },
            loading && styles.searchButtonDisabled,
          ]}
          onPress={handleSearch}
          disabled={loading || !cityName.trim()}
          accessibilityLabel="Search for weather"
          accessibilityRole="button"
        >
          {loading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.searchButtonText}>🔍 Search Weather</Text>
          )}
        </TouchableOpacity>

        {/* Cancel Button */}
        {onCancel && (
          <TouchableOpacity
            style={[styles.cancelButton, { borderColor: theme.colors.border }]}
            onPress={onCancel}
            disabled={loading}
            accessibilityLabel="Cancel search"
            accessibilityRole="button"
          >
            <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>
              Cancel
            </Text>
          </TouchableOpacity>
        )}

        {/* Helper Text */}
        <View style={styles.helperContainer}>
          <Text style={[styles.helperTitle, { color: theme.colors.text }]}>
            💡 Tips:
          </Text>
          <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
            • Try major cities like "London", "New York", "Tokyo"
          </Text>
          <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
            • Include country for better results: "Paris, France"
          </Text>
          <Text style={[styles.helperText, { color: theme.colors.textSecondary }]}>
            • Check your internet connection if search fails
          </Text>
        </View>

        {/* Permission Info */}
        {!onCancel && (
          <View style={[styles.permissionInfo, { 
            backgroundColor: theme.colors.surface,
            borderLeftColor: theme.colors.primary,
          }]}>
            <Text style={[styles.permissionTitle, { color: theme.colors.text }]}>
              📍 Location Permission
            </Text>
            <Text style={[styles.permissionText, { color: theme.colors.textSecondary }]}>
              Location permission was denied or unavailable. You can search for cities manually or 
              enable location permission in your device settings to automatically get weather for your current location.
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    borderWidth: 1,
  },
  searchButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  searchButtonDisabled: {
    opacity: 0.6,
    elevation: 0,
    shadowOpacity: 0,
  },
  searchButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  helperContainer: {
    marginBottom: 30,
  },
  helperTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  helperText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  permissionInfo: {
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  permissionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default LocationSearch;