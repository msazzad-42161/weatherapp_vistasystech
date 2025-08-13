# SkyScout Weather App (Core Version)

A simple React Native weather application that shows current conditions and 12-hour precipitation probability for any location using the Open-Meteo API.

## Core Features ✅

### Location & Search
- **Auto location** - Requests location permission on first launch
- **City search** - Manual city search when location permission denied
- **Persistence** - Saves last successful location/city in AsyncStorage

### Weather Display
- **Current weather** - Temperature, condition, wind speed & direction
- **12-hour forecast** - Hourly precipitation probability for next 12 hours
- **Weather icons** - Simple emoji-based weather condition display

### States & Error Handling
- **Loading skeleton** - Simple loading screen with spinner
- **Error states** - Friendly error messages with retry functionality
- **Permission handling** - Clear messaging when location denied

### Accessibility & Responsiveness
- **Screen reader support** - Accessibility labels on key elements
- **Responsive design** - Works on small and large screens
- **Keyboard support** - Proper input handling and navigation

## API Used

**Open-Meteo** (No API key required)
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search?name={city}&count=1`
- **Weather**: `https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=precipitation_probability&forecast_days=1`

## Installation & Setup

### Prerequisites
- Node.js (>= 16)
- React Native CLI
- Xcode (for iOS)
- Android Studio (for Android)

### Install Dependencies
```bash
npm install
```

Core dependencies:
- `@react-native-async-storage/async-storage` - Local storage
- `@react-native-community/geolocation` - Location services  
- `react-native-permissions` - Permission handling

### Run on iOS
```bash
cd ios && pod install && cd ..
npx react-native run-ios
```

### Run on Android
```bash
# Start Android emulator or connect device
npx react-native run-android
```

## Project Structure

```
├── android/
├── ios/
├── components/
│   ├── WeatherDisplay.tsx    # Main weather screen
│   ├── LocationSearch.tsx    # City search interface
│   ├── LoadingScreen.tsx     # Simple loading screen
│   └── ErrorScreen.tsx       # Error handling UI
├── services/
│   └── WeatherService.ts     # API calls and data processing
└── types/
    └── index.ts              # TypeScript interfaces
├── App.tsx
```

## Permissions Required

### iOS (ios/SkyScoutWeather/Info.plist)
```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to provide weather for your current location.</string>
```

### Android (android/app/src/main/AndroidManifest.xml)
```xml
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />

<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
```

## What's Implemented

### ✅ Core Requirements (ALL)
- [x] Location permission request on first open
- [x] Fetch weather for current location when granted
- [x] Show city search when permission denied
- [x] Persist last choice in AsyncStorage
- [x] Display current temperature and condition
- [x] Show 12-hour precipitation probability
- [x] Loading skeleton/spinner
- [x] Friendly error states with retry
- [x] Clear permission denied messaging
- [x] Accessible labels on key data
- [x] Responsive design for small screens

### ❌ Nice-to-Have Features (Excluded)
- [ ] Pull to refresh
- [ ] Dark mode support
- [ ] Haptic feedback
- [ ] Deep link support
- [ ] Advanced animations
- [ ] State management libraries

## Usage Flow

1. **First Launch**: App requests location permission
2. **Permission Granted**: Shows weather for current location
3. **Permission Denied**: Shows city search screen
4. **City Search**: Enter city name and tap search
5. **Weather Display**: Shows current weather + 12-hour forecast
6. **Error Handling**: Retry button or switch to search

## Error Scenarios

The app handles these error cases:
- **Network connection issues** - Shows retry option
- **Location permission denied** - Redirects to city search
- **Invalid city name** - Clear error message
- **API failures** - User-friendly error with retry
- **No internet connection** - Helpful error message

## Testing

Test these core scenarios:
1. **Grant location** → Should show local weather
2. **Deny location** → Should show search screen
3. **Search valid city** → Should display weather data
4. **Search invalid city** → Should show error message
5. **No internet** → Should show connection error
6. **API timeout** → Should show retry option

## Known Limitations

- **Internet required** - No offline functionality
- **Basic error messages** - Simple, user-friendly errors only
- **Single location** - No multiple location support
- **12-hour limit** - Limited by free API constraints
- **Simple UI** - Basic design without advanced styling

## Trade-offs Made

- **Simple state management** - Used React hooks instead of Redux
- **Basic loading states** - Simple spinner instead of skeleton screens
- **Minimal animations** - Static UI for better performance
- **Basic styling** - Clean but simple design
- **Single API** - Only Open-Meteo for consistency

This core version focuses entirely on the essential functionality without any extra features, making it simpler to implement and maintain.