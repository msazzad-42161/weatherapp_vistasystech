import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { WeatherData, getWeatherCondition } from '../types';
import { WeatherService } from '../services/WeatherService';
import { useThemeStore } from '../stores/themeStore';
import ThemeToggle from './ThemeToggle';

interface Props {
  weatherData: WeatherData;
  onSearch: () => void;
}

interface HourlyItemProps {
  hour: string;
  precipitationProbability: number;
}

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

const WeatherDisplay: React.FC<Props> = ({ weatherData, onSearch }) => {
  const { theme } = useThemeStore();
  const { current_weather, hourly } = weatherData;
  const condition = getWeatherCondition(current_weather.weathercode);
  const hourlyForecasts = WeatherService.processHourlyData(hourly);

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor: theme.colors.background }]} 
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.searchButton, { 
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
          }]}
          onPress={onSearch}
          accessibilityLabel="Search for a different city"
          accessibilityRole="button"
        >
          <Text style={[styles.searchButtonText, { color: theme.colors.text }]}>
            🔍 Search City
          </Text>
        </TouchableOpacity>
        
        <ThemeToggle size="medium" />
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
});

export default WeatherDisplay;