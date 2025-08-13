import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


const LoadingScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* App Icon */}
        <Text style={styles.weatherIcon}>🌤️</Text>

        {/* App Title */}
        <Text style={styles.title}>SkyScout</Text>

        {/* Loading Message */}
        <Text style={styles.subtitle}>Getting weather information...</Text>

        {/* Loading Spinner */}
        <ActivityIndicator 
          size="large" 
          color="#007AFF" 
          style={styles.spinner}
        />

        {/* Status Messages */}
        <View style={styles.statusContainer}>
          <Text style={styles.statusText}>• Requesting location permission</Text>
          <Text style={styles.statusText}>• Fetching current weather</Text>
          <Text style={styles.statusText}>• Loading hourly forecast</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  weatherIcon: {
    fontSize: 80,
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 32,
    textAlign: 'center',
  },
  spinner: {
    marginBottom: 40,
  },
  statusContainer: {
    alignItems: 'flex-start',
  },
  statusText: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 8,
    textAlign: 'left',
  },
});

export default LoadingScreen;