import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';

import WeatherDisplay from './components/WeatherDisplay';
import LocationSearch from './components/LocationSearch';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import { WeatherService } from './services/WeatherService';
import { WeatherData } from './types';
import { SafeAreaProvider,SafeAreaView } from 'react-native-safe-area-context';

const STORAGE_KEYS = {
  LAST_LOCATION: 'lastLocation',
  LAST_CITY: 'lastCity',
};

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Check if we have a saved location
      const savedLocation = await AsyncStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
      const savedCity = await AsyncStorage.getItem(STORAGE_KEYS.LAST_CITY);

      if (savedLocation) {
        const location = JSON.parse(savedLocation);
        await fetchWeatherData(location.latitude, location.longitude);
      } else if (savedCity) {
        await handleCitySearch(savedCity);
      } else {
        // First time - request location permission
        await requestLocationPermission();
      }
    } catch (err) {
      setError('Failed to initialize app');
      setLoading(false);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const permission = Platform.OS === 'ios' 
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE 
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

      const result = await request(permission);

      if (result === RESULTS.GRANTED) {
        getCurrentLocation();
      } else {
        setShowSearch(true);
        setLoading(false);
      }
    } catch (err) {
      setShowSearch(true);
      setLoading(false);
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await AsyncStorage.setItem(
          STORAGE_KEYS.LAST_LOCATION,
          JSON.stringify({ latitude, longitude })
        );
        await fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.log('Location error:', error);
        // Try to get last known position if available
        tryLastKnownPosition();
      },
      { 
        enableHighAccuracy: false, // Set to false for faster response
        timeout: 30000, // Increased to 30 seconds
        maximumAge: 300000 // Accept cached location up to 5 minutes old
      }
    );
  };
  
  const tryLastKnownPosition = () => {
    // Fallback: try to get position with lower accuracy
    Geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await AsyncStorage.setItem(
          STORAGE_KEYS.LAST_LOCATION,
          JSON.stringify({ latitude, longitude })
        );
        await fetchWeatherData(latitude, longitude);
      },
      (error) => {
        console.log('Fallback location error:', error);
        setShowSearch(true);
        setLoading(false);
      },
      { 
        enableHighAccuracy: false,
        timeout: 60000, // Even longer timeout
        maximumAge: 600000 // Accept cached location up to 10 minutes old
      }
    );
  };

  const handleCitySearch = async (cityName: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const location = await WeatherService.geocodeCity(cityName);
      await AsyncStorage.setItem(STORAGE_KEYS.LAST_CITY, cityName);
      await AsyncStorage.removeItem(STORAGE_KEYS.LAST_LOCATION);
      
      await fetchWeatherData(location.latitude, location.longitude);
      setShowSearch(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find city');
      setLoading(false);
    }
  };

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setError(null);
      const data = await WeatherService.getWeatherData(lat, lon);
      setWeatherData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    initializeApp();
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorScreen
        error={error}
        onRetry={handleRetry}
        onSearch={toggleSearch}
      />
    );
  }

  if (showSearch || !weatherData) {
    return (
      <LocationSearch
        onCitySelect={handleCitySearch}
        onCancel={weatherData ? toggleSearch : undefined}
      />
    );
  }

  return (
    <SafeAreaProvider>
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <WeatherDisplay
        weatherData={weatherData}
        onSearch={toggleSearch}
        />
    </SafeAreaView>
        </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
});

export default App;