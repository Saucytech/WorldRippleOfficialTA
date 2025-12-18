/**
 * API Test Panel - Quick visual test of all FREE APIs
 * Shows real data from each service without needing any API keys
 */

import React, { useState } from 'react';
import { openMeteoService } from '../services/openMeteoApi';
import { earthquakeService } from '../services/earthquakeApi';
import { restCountriesService } from '../services/restCountriesApi';
import { nominatimService } from '../services/nominatimApi';
import { apiDataTransformers } from '../utils/apiDataTransformers';
import { Cloud, Activity, Flag, MapPin, CheckCircle, XCircle, Loader, X } from 'lucide-react';

interface TestResult {
  service: string;
  status: 'idle' | 'loading' | 'success' | 'error';
  data?: any;
  error?: string;
  time?: number;
}

export const ApiTestPanel: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false); // Start closed to reduce visual noise
  const [results, setResults] = useState<Record<string, TestResult>>({
    weather: { service: 'Open-Meteo Weather', status: 'idle' },
    earthquake: { service: 'USGS Earthquakes', status: 'idle' },
    country: { service: 'REST Countries', status: 'idle' },
    geocoding: { service: 'Nominatim Geocoding', status: 'idle' }
  });

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium shadow-xl z-50"
      >
        API Tests
      </button>
    );
  }

  const updateResult = (key: string, update: Partial<TestResult>) => {
    setResults(prev => ({
      ...prev,
      [key]: { ...prev[key], ...update }
    }));
  };

  // Test 1: Weather for New York City
  const testWeather = async () => {
    const startTime = Date.now();
    updateResult('weather', { status: 'loading' });
    
    try {
      const weather = await openMeteoService.getCurrentWeather(40.7128, -74.0060);
      const transformed = weather ? apiDataTransformers.weatherToWorldRipple(weather) : null;
      
      updateResult('weather', {
        status: 'success',
        data: weather,
        time: Date.now() - startTime
      });
    } catch (error) {
      updateResult('weather', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Test 2: Recent significant earthquakes
  const testEarthquakes = async () => {
    const startTime = Date.now();
    updateResult('earthquake', { status: 'loading' });
    
    try {
      const earthquakes = await earthquakeService.getSignificantEarthquakes();
      const recentQuakes = earthquakes.slice(0, 5);
      
      updateResult('earthquake', {
        status: 'success',
        data: recentQuakes,
        time: Date.now() - startTime
      });
    } catch (error) {
      updateResult('earthquake', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Test 3: Country information for USA
  const testCountry = async () => {
    const startTime = Date.now();
    updateResult('country', { status: 'loading' });
    
    try {
      const country = await restCountriesService.getCountryByCode('USA');
      
      updateResult('country', {
        status: 'success',
        data: country,
        time: Date.now() - startTime
      });
    } catch (error) {
      updateResult('country', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Test 4: Geocoding search for "Paris"
  const testGeocoding = async () => {
    const startTime = Date.now();
    updateResult('geocoding', { status: 'loading' });
    
    try {
      const places = await nominatimService.search('Paris', { limit: 3 });
      
      updateResult('geocoding', {
        status: 'success',
        data: places,
        time: Date.now() - startTime
      });
    } catch (error) {
      updateResult('geocoding', {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  };

  // Run all tests
  const runAllTests = async () => {
    await Promise.all([
      testWeather(),
      testEarthquakes(),
      testCountry(),
      testGeocoding()
    ]);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'loading':
        return <Loader className="w-5 h-5 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return null;
    }
  };

  const getServiceIcon = (key: string) => {
    switch (key) {
      case 'weather':
        return <Cloud className="w-5 h-5 text-blue-400" />;
      case 'earthquake':
        return <Activity className="w-5 h-5 text-red-400" />;
      case 'country':
        return <Flag className="w-5 h-5 text-green-400" />;
      case 'geocoding':
        return <MapPin className="w-5 h-5 text-purple-400" />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-gray-900 border border-gray-700 rounded-lg shadow-xl p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">API Test Panel</h3>
        <div className="flex items-center gap-2">
          <button
            onClick={runAllTests}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Test All APIs
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 hover:bg-gray-800 rounded transition-colors"
            title="Close panel"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {Object.entries(results).map(([key, result]) => (
          <div key={key} className="bg-gray-800 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                {getServiceIcon(key)}
                <span className="text-sm font-medium text-gray-300">{result.service}</span>
              </div>
              <div className="flex items-center gap-2">
                {result.time && (
                  <span className="text-xs text-gray-500">{result.time}ms</span>
                )}
                {getStatusIcon(result.status)}
              </div>
            </div>

            {result.status === 'success' && result.data && (
              <div className="mt-2 text-xs text-gray-400 bg-gray-900 rounded p-2 max-h-32 overflow-y-auto">
                {key === 'weather' && result.data.current && (
                  <div>
                    <div>📍 {result.data.location}</div>
                    <div>🌡️ {result.data.current.temperature}°C</div>
                    <div>💧 {result.data.current.humidity}% humidity</div>
                    <div>🌤️ {result.data.current.description}</div>
                  </div>
                )}

                {key === 'earthquake' && Array.isArray(result.data) && (
                  <div>
                    {result.data.map((eq: any, i: number) => (
                      <div key={i} className="mb-1">
                        M{eq.magnitude} - {eq.place}
                      </div>
                    ))}
                  </div>
                )}

                {key === 'country' && result.data && (
                  <div>
                    <div>🏳️ {result.data.name?.common}</div>
                    <div>👥 Population: {new Intl.NumberFormat().format(result.data.population)}</div>
                    <div>📍 Capital: {result.data.capital?.[0]}</div>
                    <div>🌍 Region: {result.data.region}</div>
                    {result.data.flags?.svg && (
                      <img src={result.data.flags.svg} alt="Flag" className="w-12 h-8 mt-1" />
                    )}
                  </div>
                )}

                {key === 'geocoding' && Array.isArray(result.data) && (
                  <div>
                    {result.data.map((place: any, i: number) => (
                      <div key={i} className="mb-1">
                        📍 {place.display_name?.substring(0, 50)}...
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {result.status === 'error' && (
              <div className="mt-2 text-xs text-red-400">
                Error: {result.error}
              </div>
            )}

            {result.status === 'idle' && (
              <div className="mt-2 text-xs text-gray-500">
                Click "Test All APIs" to start
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-gray-500 text-center">
        All APIs are FREE - No API keys required! 🎉
      </div>
    </div>
  );
};

export default ApiTestPanel;