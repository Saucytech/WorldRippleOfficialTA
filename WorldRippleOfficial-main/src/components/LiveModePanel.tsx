import React, { useState, useEffect } from 'react';
import { Activity, CloudRain, AlertCircle, Radio } from 'lucide-react';
import { earthquakeService } from '../services/earthquakeApi';
import { openMeteoService } from '../services/openMeteoApi';

interface LiveModeProps {
  onEarthquakeUpdate?: (earthquakes: any[]) => void;
  onWeatherUpdate?: (weather: any[]) => void;
}

export const LiveModePanel: React.FC<LiveModeProps> = ({ 
  onEarthquakeUpdate, 
  onWeatherUpdate 
}) => {
  const [isLiveMode, setIsLiveMode] = useState(true);
  const [earthquakesEnabled, setEarthquakesEnabled] = useState(true);
  const [weatherEnabled, setWeatherEnabled] = useState(true);
  const [autoFocus, setAutoFocus] = useState(true);
  const [earthquakeCount, setEarthquakeCount] = useState(0);
  const [weatherCities, setWeatherCities] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch earthquake data
  const fetchEarthquakes = async () => {
    if (!earthquakesEnabled) return;
    
    try {
      setIsUpdating(true);
      const earthquakes = await earthquakeService.getRecentEarthquakes();
      setEarthquakeCount(earthquakes.length);
      setLastUpdate(new Date());
      if (onEarthquakeUpdate) {
        onEarthquakeUpdate(earthquakes);
      }
    } catch (error) {
      console.error('Error fetching earthquakes:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Fetch weather data for major cities
  const fetchWeather = async () => {
    if (!weatherEnabled) return;
    
    try {
      const majorCities = [
        { lat: 40.7128, lon: -74.0060, name: 'New York' },
        { lat: 51.5074, lon: -0.1278, name: 'London' },
        { lat: 35.6762, lon: 139.6503, name: 'Tokyo' },
        { lat: -33.8688, lon: 151.2093, name: 'Sydney' },
        { lat: 48.8566, lon: 2.3522, name: 'Paris' }
      ];
      
      const weatherData = await openMeteoService.getMultipleLocationWeather(majorCities);
      setWeatherCities(weatherData.length);
      if (onWeatherUpdate) {
        onWeatherUpdate(weatherData);
      }
    } catch (error) {
      console.error('Error fetching weather:', error);
    }
  };

  // Auto-update every 5 minutes for earthquakes, 10 minutes for weather
  useEffect(() => {
    if (!isLiveMode) return;

    fetchEarthquakes();
    fetchWeather();

    const earthquakeInterval = setInterval(fetchEarthquakes, 5 * 60 * 1000);
    const weatherInterval = setInterval(fetchWeather, 10 * 60 * 1000);

    return () => {
      clearInterval(earthquakeInterval);
      clearInterval(weatherInterval);
    };
  }, [isLiveMode, earthquakesEnabled, weatherEnabled]);

  const formatLastUpdate = () => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);
    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    return `${Math.floor(diff / 3600)} hours ago`;
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Radio className={`w-5 h-5 ${isLiveMode ? 'text-red-500' : 'text-gray-500'}`} />
          <h3 className="text-lg font-bold text-white">Live Mode</h3>
          {isLiveMode && (
            <span className="px-2 py-1 bg-red-500 text-white text-xs rounded animate-pulse">
              LIVE
            </span>
          )}
        </div>
        <button
          onClick={() => setIsLiveMode(!isLiveMode)}
          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
            isLiveMode 
              ? 'bg-red-500 text-white hover:bg-red-600' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          {isLiveMode ? 'ON' : 'OFF'}
        </button>
      </div>

      {/* Auto-focus option */}
      <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-yellow-500" />
          <span className="text-sm text-gray-300">Auto-focus on new events</span>
        </div>
        <button
          onClick={() => setAutoFocus(!autoFocus)}
          className={`w-10 h-5 rounded-full transition-colors ${
            autoFocus ? 'bg-blue-500' : 'bg-gray-600'
          }`}
        >
          <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
            autoFocus ? 'translate-x-5' : 'translate-x-0.5'
          }`} />
        </button>
      </div>

      <div className="text-xs text-gray-500 mb-3">
        Viewing: Earthquake
      </div>

      {/* Live Data Toggles */}
      <div className="space-y-3">
        {/* Earthquakes Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4 text-red-400" />
            <span className="text-sm text-gray-300">Live Earthquakes</span>
          </div>
          <button
            onClick={() => setEarthquakesEnabled(!earthquakesEnabled)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              earthquakesEnabled
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {earthquakesEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        {earthquakesEnabled && (
          <div className="ml-6 text-xs text-gray-400">
            {earthquakeCount} quakes (M3.0+) in last 24h
            <br />
            Auto-updates every 5 minutes
          </div>
        )}

        {/* Weather Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CloudRain className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">Live Weather</span>
          </div>
          <button
            onClick={() => setWeatherEnabled(!weatherEnabled)}
            className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
              weatherEnabled
                ? 'bg-green-500 text-white'
                : 'bg-gray-700 text-gray-400'
            }`}
          >
            {weatherEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        {weatherEnabled && (
          <div className="ml-6 text-xs text-gray-400">
            {weatherCities} major cities monitored
            <br />
            Auto-updates every 10 minutes
          </div>
        )}
      </div>

      {/* Last Update */}
      {isLiveMode && (
        <div className="mt-4 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">
              Last updated: {formatLastUpdate()}
            </span>
            {isUpdating && (
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-xs text-gray-400">Updating...</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveModePanel;