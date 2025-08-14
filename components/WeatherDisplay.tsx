import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  RefreshControl,
} from 'react-native';
import ReactNativeHapticFeedback from "react-native-haptic-feedback";
import { WeatherData, getWeatherCondition } from '../types';
import { WeatherService } from '../services/WeatherService';
import { useThemeStore } from '../stores/themeStore';
import ThemeToggle from './ThemeToggle';

interface Props {
  weatherData: WeatherData;
  onSearch: () => void;
  onRefresh?: () => Promise<void>;
}

interface HourlyItemProps {
  hour: string;
  precipitationProbability: number;
}
const haptic_feedback_options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};


const HourlyItem: React.FC<HourlyItemProps> = ({ hour, precipitationProbability }) => {
  const { theme } = useThemeStore();
  
  return (
    <View style={[styles.hourlyItem, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.hourText, { color: theme.colors.text }]} accessibilityLabel={`${hour} hour`}>
        {hour}
      </Text>
      <View style={styles.precipitationContainer}>
        <Text style={styles.precipitationIcon}>💧</Text>
        <Text 
          style={[styles.precipitationText, { color: theme.colors.primary }]}
          accessibilityLabel={`${precipitationProbability}% chance of precipitation`}
        >
          {precipitationProbability}%
        </Text>
      </View>
    </View>
  );
};

const WeatherDisplay: React.FC<Props> = ({ weatherData, onSearch, onRefresh }) => {
  const { theme } = useThemeStore();
  const [refreshing, setRefreshing] = useState(false);
  const { current_weather, hourly } = weatherData;
  const condition = getWeatherCondition(current_weather.weathercode);
  const hourlyForecasts = WeatherService.processHourlyData(hourly);

  const handleRefresh = async () => {
    if (!onRefresh) return;
    
    // Haptic feedback on refresh start
    ReactNativeHapticFeedback.trigger('impactLight', haptic_feedback_options);
    
    setRefreshing(true);
    try {
      await onRefresh();
      // Success haptic feedback
      ReactNativeHapticFeedback.trigger('notificationSuccess', haptic_feedback_options);
    } catch (error) {
      console.error('Refresh failed:', error);
      // Error haptic feedback
      ReactNativeHapticFeedback.trigger('notificationError', haptic_feedback_options);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          tintColor={theme.colors.primary} // iOS
          colors={[theme.colors.primary]} // Android
          progressBackgroundColor={theme.colors.surface} // Android
          title="Pull to refresh weather data"
          titleColor={theme.colors.textSecondary}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.searchButton, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }]}
          onPress={() => {
            ReactNativeHapticFeedback.trigger('impactLight', haptic_feedback_options);
            onSearch();
          }}
          accessibilityLabel="Search for a different city"
          accessibilityRole="button"
        >
          <Text style={[styles.searchButtonText, { color: theme.colors.text }]}>
            🔍 Search City
          </Text>
        </TouchableOpacity>
        
        <View style={styles.headerControls}>
          <TouchableOpacity
            style={[styles.refreshButton, { 
              backgroundColor: theme.colors.surface,
              borderColor: theme.colors.border,
            }]}
            onPress={() => {
              ReactNativeHapticFeedback.trigger('impactMedium', haptic_feedback_options);
              handleRefresh();
            }}
            disabled={refreshing}
            accessibilityLabel="Refresh weather data"
            accessibilityRole="button"
          >
            <Text style={[styles.refreshButtonText, { color: theme.colors.primary }]}>
              {refreshing ? '🔄' : '↻'}
            </Text>
          </TouchableOpacity>
          
          <ThemeToggle size="medium" />
        </View>
      </View>

      {/* Pull to Refresh Hint */}
      <View style={styles.refreshHintContainer}>
        <Text style={[styles.refreshHint, { color: theme.colors.textMuted }]}>
          ⬇️ Pull down to refresh weather data
        </Text>
      </View>

      {/* Current Weather */}
      <View style={styles.currentWeatherContainer}>
        <Text style={styles.weatherIcon}>{condition.icon}</Text>
        <Text 
          style={[styles.temperature, { color: theme.colors.text }]}
          accessibilityLabel={`Current temperature ${WeatherService.formatTemperature(current_weather.temperature)}`}
        >
          {WeatherService.formatTemperature(current_weather.temperature)}
        </Text>
        <Text 
          style={[styles.condition, { color: theme.colors.textSecondary }]}
          accessibilityLabel={`Weather condition: ${condition.description}`}
        >
          {condition.description}
        </Text>
        <Text style={[styles.lastUpdate, { color: theme.colors.textMuted }]}>
          Updated: {WeatherService.formatTime(current_weather.time)}
        </Text>
      </View>

      {/* Wind Information */}
      <View style={[styles.windContainer, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }]}>
        <View style={styles.windItem}>
          <Text style={[styles.windLabel, { color: theme.colors.textMuted }]}>
            Wind Speed
          </Text>
          <Text 
            style={[styles.windValue, { color: theme.colors.text }]}
            accessibilityLabel={`Wind speed ${current_weather.windspeed} kilometers per hour`}
          >
            {current_weather.windspeed} km/h
          </Text>
        </View>
        <View style={styles.windItem}>
          <Text style={[styles.windLabel, { color: theme.colors.textMuted }]}>
            Direction
          </Text>
          <Text 
            style={[styles.windValue, { color: theme.colors.text }]}
            accessibilityLabel={`Wind direction ${current_weather.winddirection} degrees`}
          >
            {current_weather.winddirection}°
          </Text>
        </View>
      </View>

      {/* 12-Hour Precipitation Forecast */}
      <View style={styles.forecastContainer}>
        <Text style={[styles.forecastTitle, { color: theme.colors.text }]}>
          Next 12 Hours - Precipitation Probability
        </Text>
        
        <FlatList
          horizontal
          data={hourlyForecasts}
          keyExtractor={(item) => item.time}
          renderItem={({ item }) => (
            <HourlyItem
              hour={item.hour}
              precipitationProbability={item.precipitationProbability}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.forecastList}
          ItemSeparatorComponent={() => <View style={styles.forecastSeparator} />}
          accessibilityLabel="12-hour precipitation forecast"
        />
      </View>

      {/* Refresh Info */}
      <View style={[styles.refreshInfo, { 
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.border,
      }]}>
        <Text style={[styles.refreshInfoTitle, { color: theme.colors.text }]}>
          💡 Refresh Tips
        </Text>
        <Text style={[styles.refreshInfoText, { color: theme.colors.textSecondary }]}>
          • Pull down from the top to refresh weather data{'\n'}
          • Tap the refresh button (↻) in the header{'\n'}
          • Data updates automatically show the latest time
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  searchButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  searchButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  refreshButton: {
    width: 40,
    height: 40,
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
  refreshButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  refreshHintContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  refreshHint: {
    fontSize: 12,
    fontWeight: '500',
  },
  currentWeatherContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  weatherIcon: {
    fontSize: 80,
    marginBottom: 16,
  },
  temperature: {
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  condition: {
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  lastUpdate: {
    fontSize: 14,
  },
  windContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  windItem: {
    alignItems: 'center',
  },
  windLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  windValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  forecastContainer: {
    marginBottom: 24,
  },
  forecastTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  forecastList: {
    paddingHorizontal: 16,
  },
  forecastSeparator: {
    width: 12,
  },
  hourlyItem: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minWidth: 80,
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  hourText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
  },
  precipitationContainer: {
    alignItems: 'center',
  },
  precipitationIcon: {
    fontSize: 16,
    marginBottom: 4,
  },
  precipitationText: {
    fontSize: 12,
    fontWeight: '600',
  },
  refreshInfo: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  refreshInfoTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  refreshInfoText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default WeatherDisplay;