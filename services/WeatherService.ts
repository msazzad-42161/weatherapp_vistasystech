import { WeatherData, Location, GeocodeResponse, HourlyForecast } from '../types';

export class WeatherService {
  private static readonly GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1';
  private static readonly WEATHER_BASE_URL = 'https://api.open-meteo.com/v1';

  static async geocodeCity(cityName: string): Promise<Location> {
    try {
      const encodedCity = encodeURIComponent(cityName.trim());
      const url = `${this.GEOCODING_BASE_URL}/search?name=${encodedCity}&count=1&language=en&format=json`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Geocoding failed: ${response.status}`);
      }

      const data: GeocodeResponse = await response.json();
      
      if (!data.results || data.results.length === 0) {
        throw new Error(`City "${cityName}" not found`);
      }

      const result = data.results[0];
      return {
        latitude: result.latitude,
        longitude: result.longitude,
        name: result.name,
        country: result.country,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to find city location');
    }
  }

  static async getWeatherData(latitude: number, longitude: number): Promise<WeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current_weather: 'true',
        hourly: 'precipitation_probability',
        forecast_days: '1',
        timezone: 'auto',
      });

      const url = `${this.WEATHER_BASE_URL}/forecast?${params}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Weather API failed: ${response.status}`);
      }

      const data: WeatherData = await response.json();
      
      if (!data.current_weather || !data.hourly) {
        throw new Error('Invalid weather data received');
      }

      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch weather data');
    }
  }

  static processHourlyData(hourly: { time: string[]; precipitation_probability: number[] }): HourlyForecast[] {
    const currentTime = new Date();
    const forecasts: HourlyForecast[] = [];
    
    for (let i = 0; i < Math.min(hourly.time.length, 12); i++) {
      const time = new Date(hourly.time[i]);
      
      // Skip past hours
      if (time <= currentTime) continue;
      
      const hour = time.getHours().toString().padStart(2, '0') + ':00';
      
      forecasts.push({
        time: hourly.time[i],
        hour,
        precipitationProbability: hourly.precipitation_probability[i] || 0,
      });
      
      // Stop when we have 12 future hours
      if (forecasts.length >= 12) break;
    }
    
    return forecasts;
  }

  static formatTemperature(temp: number): string {
    return `${Math.round(temp)}°C`;
  }

  static formatTime(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  }

  static formatDate(timeString: string): string {
    const date = new Date(timeString);
    return date.toLocaleDateString([], {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
}