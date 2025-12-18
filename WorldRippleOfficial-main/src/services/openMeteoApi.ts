/**
 * Open-Meteo Weather API Service
 * FREE weather and climate data - no API key required!
 * Documentation: https://open-meteo.com/
 */

export interface WeatherData {
  temperature: number;
  precipitation: number;
  windSpeed: number;
  windDirection: number;
  humidity?: number;
  weatherCode: number;
  description?: string;
  timestamp: string;
}

export interface HistoricalWeatherData {
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    precipitation_sum: number[];
    windspeed_10m_max: number[];
  };
}

export interface LocationWeather {
  current: WeatherData;
  coordinates: [number, number];
  location: string;
  timezone: string;
}

// Weather code descriptions
const WEATHER_CODES: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  71: 'Slight snow',
  73: 'Moderate snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

export const openMeteoService = {
  /**
   * Get current weather for coordinates
   */
  async getCurrentWeather(lat: number, lon: number): Promise<LocationWeather | null> {
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?` +
        `latitude=${lat}&longitude=${lon}` +
        `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m,wind_direction_10m` +
        `&timezone=auto`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch weather data');
      }

      const data = await response.json();
      
      return {
        current: {
          temperature: data.current.temperature_2m,
          precipitation: data.current.precipitation,
          windSpeed: data.current.wind_speed_10m,
          windDirection: data.current.wind_direction_10m,
          humidity: data.current.relative_humidity_2m,
          weatherCode: data.current.weather_code,
          description: WEATHER_CODES[data.current.weather_code] || 'Unknown',
          timestamp: data.current.time
        },
        coordinates: [lon, lat],
        location: `${Math.abs(lat).toFixed(2)}°${lat >= 0 ? 'N' : 'S'}, ${Math.abs(lon).toFixed(2)}°${lon >= 0 ? 'E' : 'W'}`,
        timezone: data.timezone
      };
    } catch (error) {
      console.error('Error fetching weather data:', error);
      return null;
    }
  },

  /**
   * Get historical weather for a specific date range
   */
  async getHistoricalWeather(
    lat: number,
    lon: number,
    startDate: string,
    endDate: string
  ): Promise<HistoricalWeatherData | null> {
    try {
      const response = await fetch(
        `https://archive-api.open-meteo.com/v1/era5?` +
        `latitude=${lat}&longitude=${lon}` +
        `&start_date=${startDate}&end_date=${endDate}` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max` +
        `&timezone=auto`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch historical weather data');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching historical weather:', error);
      return null;
    }
  },

  /**
   * Get weather for multiple locations (batch request)
   */
  async getMultipleLocationWeather(locations: Array<{lat: number, lon: number}>): Promise<LocationWeather[]> {
    const promises = locations.map(loc => this.getCurrentWeather(loc.lat, loc.lon));
    const results = await Promise.all(promises);
    return results.filter((result): result is LocationWeather => result !== null);
  },

  /**
   * Get climate averages for a location (30-year normals)
   */
  async getClimateAverages(lat: number, lon: number, month?: number): Promise<any> {
    try {
      // Calculate date range for 30-year average
      const currentYear = new Date().getFullYear();
      const startYear = currentYear - 30;
      
      let startDate = `${startYear}-01-01`;
      let endDate = `${currentYear - 1}-12-31`;
      
      if (month) {
        startDate = `${startYear}-${String(month).padStart(2, '0')}-01`;
        endDate = `${currentYear - 1}-${String(month).padStart(2, '0')}-${month === 2 ? '28' : '30'}`;
      }

      const response = await fetch(
        `https://archive-api.open-meteo.com/v1/era5?` +
        `latitude=${lat}&longitude=${lon}` +
        `&start_date=${startDate}&end_date=${endDate}` +
        `&daily=temperature_2m_mean,precipitation_sum` +
        `&timezone=auto`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch climate data');
      }

      const data = await response.json();
      
      // Calculate averages
      const temps = data.daily.temperature_2m_mean;
      const precip = data.daily.precipitation_sum;
      
      return {
        averageTemperature: temps.reduce((a: number, b: number) => a + b, 0) / temps.length,
        totalPrecipitation: precip.reduce((a: number, b: number) => a + b, 0),
        averageDailyPrecipitation: precip.reduce((a: number, b: number) => a + b, 0) / precip.length
      };
    } catch (error) {
      console.error('Error fetching climate averages:', error);
      return null;
    }
  },

  /**
   * Get extreme weather events for a location
   */
  async getExtremeWeatherEvents(lat: number, lon: number, year: number): Promise<any[]> {
    try {
      const response = await fetch(
        `https://archive-api.open-meteo.com/v1/era5?` +
        `latitude=${lat}&longitude=${lon}` +
        `&start_date=${year}-01-01&end_date=${year}-12-31` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,windgusts_10m_max` +
        `&timezone=auto`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch extreme weather data');
      }

      const data = await response.json();
      const events = [];

      // Find extreme events (simplified logic)
      for (let i = 0; i < data.daily.time.length; i++) {
        // Extreme heat (> 40°C)
        if (data.daily.temperature_2m_max[i] > 40) {
          events.push({
            date: data.daily.time[i],
            type: 'extreme_heat',
            value: data.daily.temperature_2m_max[i],
            description: `Extreme heat: ${data.daily.temperature_2m_max[i]}°C`
          });
        }
        
        // Extreme cold (< -20°C)
        if (data.daily.temperature_2m_min[i] < -20) {
          events.push({
            date: data.daily.time[i],
            type: 'extreme_cold',
            value: data.daily.temperature_2m_min[i],
            description: `Extreme cold: ${data.daily.temperature_2m_min[i]}°C`
          });
        }
        
        // Heavy precipitation (> 50mm)
        if (data.daily.precipitation_sum[i] > 50) {
          events.push({
            date: data.daily.time[i],
            type: 'heavy_precipitation',
            value: data.daily.precipitation_sum[i],
            description: `Heavy precipitation: ${data.daily.precipitation_sum[i]}mm`
          });
        }
        
        // Strong winds (> 100 km/h)
        if (data.daily.windgusts_10m_max && data.daily.windgusts_10m_max[i] > 100) {
          events.push({
            date: data.daily.time[i],
            type: 'strong_winds',
            value: data.daily.windgusts_10m_max[i],
            description: `Strong winds: ${data.daily.windgusts_10m_max[i]} km/h`
          });
        }
      }

      return events;
    } catch (error) {
      console.error('Error fetching extreme weather events:', error);
      return [];
    }
  }
};

export default openMeteoService;