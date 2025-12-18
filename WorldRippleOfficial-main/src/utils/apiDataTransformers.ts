/**
 * API Data Transformers
 * Converts data from various free APIs to WorldRipple's unified format
 */

import { DataLayer } from '../App';
import { LayerDataPoint } from '../hooks/useDataCommons';
import { WeatherData, LocationWeather } from '../services/openMeteoApi';
import { Earthquake } from '../services/earthquakeApi';
import { CountryBasic } from '../services/restCountriesApi';
import { NominatimPlace } from '../services/nominatimApi';

export interface WorldRippleDataPoint {
  id: string;
  title: string;
  description: string;
  type: 'event' | 'location' | 'statistic' | 'marker';
  coordinates?: [number, number];
  value?: number;
  unit?: string;
  category: string;
  subcategory?: string;
  timestamp?: string | number;
  metadata?: Record<string, any>;
  color?: string;
  icon?: string;
  size?: number;
}

export interface MapMarker {
  id: string;
  coordinates: [number, number];
  title: string;
  description: string;
  type: 'earthquake' | 'weather' | 'country' | 'event' | 'custom';
  size: number;
  color: string;
  icon?: string;
  popup?: {
    content: string;
    showOnHover?: boolean;
  };
  animation?: 'pulse' | 'bounce' | 'ripple' | 'none';
}

export const apiDataTransformers = {
  /**
   * Transform weather data to WorldRipple format
   */
  weatherToWorldRipple(weather: LocationWeather): WorldRippleDataPoint {
    return {
      id: `weather-${weather.coordinates[0]}-${weather.coordinates[1]}-${Date.now()}`,
      title: `Weather at ${weather.location}`,
      description: `${weather.current.description}: ${weather.current.temperature}°C`,
      type: 'location',
      coordinates: weather.coordinates,
      value: weather.current.temperature,
      unit: '°C',
      category: 'environment',
      subcategory: 'temp-anomalies',
      timestamp: weather.current.timestamp,
      metadata: {
        humidity: weather.current.humidity,
        windSpeed: weather.current.windSpeed,
        windDirection: weather.current.windDirection,
        precipitation: weather.current.precipitation,
        weatherCode: weather.current.weatherCode
      },
      color: this.getTemperatureColor(weather.current.temperature),
      icon: 'cloud'
    };
  },

  /**
   * Transform earthquake data to WorldRipple format
   */
  earthquakeToWorldRipple(earthquake: Earthquake): WorldRippleDataPoint {
    return {
      id: `earthquake-${earthquake.id}`,
      title: `M${earthquake.magnitude} Earthquake`,
      description: earthquake.place,
      type: 'event',
      coordinates: earthquake.coordinates,
      value: earthquake.magnitude,
      unit: 'magnitude',
      category: 'environment',
      subcategory: 'earthquakes',
      timestamp: earthquake.time,
      metadata: {
        depth: earthquake.depth,
        felt: earthquake.felt,
        tsunami: earthquake.tsunami,
        alert: earthquake.alert,
        significance: earthquake.significance,
        url: earthquake.url
      },
      color: this.getMagnitudeColor(earthquake.magnitude),
      icon: 'activity',
      size: this.getMagnitudeSize(earthquake.magnitude)
    };
  },

  /**
   * Transform country data to WorldRipple format
   */
  countryToWorldRipple(country: CountryBasic): WorldRippleDataPoint {
    return {
      id: `country-${country.code}`,
      title: country.name,
      description: `Capital: ${country.capital}, Population: ${this.formatNumber(country.population)}`,
      type: 'location',
      coordinates: country.coordinates,
      value: country.population,
      unit: 'people',
      category: 'housing',
      subcategory: 'population-density',
      metadata: {
        code: country.code,
        flag: country.flag,
        area: country.area,
        region: country.region,
        capital: country.capital
      },
      color: '#3B82F6',
      icon: 'flag'
    };
  },

  /**
   * Transform Nominatim place to WorldRipple format
   */
  nominatimToWorldRipple(place: NominatimPlace): WorldRippleDataPoint {
    return {
      id: `place-${place.place_id}`,
      title: place.name || place.display_name.split(',')[0],
      description: place.display_name,
      type: 'location',
      coordinates: [parseFloat(place.lon), parseFloat(place.lat)],
      category: 'location',
      metadata: {
        osmId: place.osm_id,
        osmType: place.osm_type,
        class: place.class,
        type: place.type,
        importance: place.importance,
        address: place.address,
        boundingbox: place.boundingbox
      },
      color: '#10B981',
      icon: 'map-pin'
    };
  },

  /**
   * Create map markers from various data sources
   */
  createMapMarker(data: WorldRippleDataPoint): MapMarker {
    let markerType: MapMarker['type'] = 'custom';
    let animation: MapMarker['animation'] = 'none';

    // Determine marker type and animation based on category
    if (data.category === 'environment' && data.subcategory === 'earthquakes') {
      markerType = 'earthquake';
      animation = 'ripple';
    } else if (data.category === 'environment' && data.subcategory === 'temp-anomalies') {
      markerType = 'weather';
      animation = 'pulse';
    } else if (data.category === 'housing' && data.subcategory === 'population-density') {
      markerType = 'country';
      animation = 'none';
    }

    return {
      id: data.id,
      coordinates: data.coordinates || [0, 0],
      title: data.title,
      description: data.description,
      type: markerType,
      size: data.size || 10,
      color: data.color || '#3B82F6',
      icon: data.icon,
      popup: {
        content: this.createPopupContent(data),
        showOnHover: true
      },
      animation
    };
  },

  /**
   * Create popup content for map markers
   */
  createPopupContent(data: WorldRippleDataPoint): string {
    let content = `<div class="p-2">`;
    content += `<h3 class="font-bold text-sm mb-1">${data.title}</h3>`;
    content += `<p class="text-xs text-gray-600 mb-2">${data.description}</p>`;

    if (data.value !== undefined) {
      content += `<div class="text-xs">`;
      content += `<span class="font-semibold">Value:</span> ${data.value} ${data.unit || ''}`;
      content += `</div>`;
    }

    // Add specific content based on type
    if (data.metadata) {
      if (data.metadata.flag) {
        content += `<img src="${data.metadata.flag}" alt="Flag" class="w-8 h-6 mt-2" />`;
      }
      if (data.metadata.depth !== undefined) {
        content += `<div class="text-xs"><span class="font-semibold">Depth:</span> ${data.metadata.depth} km</div>`;
      }
      if (data.metadata.humidity !== undefined) {
        content += `<div class="text-xs"><span class="font-semibold">Humidity:</span> ${data.metadata.humidity}%</div>`;
      }
      if (data.metadata.windSpeed !== undefined) {
        content += `<div class="text-xs"><span class="font-semibold">Wind:</span> ${data.metadata.windSpeed} km/h</div>`;
      }
    }

    content += `</div>`;
    return content;
  },

  /**
   * Convert multiple data points to layer data for visualization
   */
  toLayerData(dataPoints: WorldRippleDataPoint[]): LayerDataPoint[] {
    return dataPoints
      .filter(dp => dp.coordinates)
      .map(dp => ({
        location: dp.title,
        coordinates: dp.coordinates!,
        value: dp.value || 0,
        year: dp.timestamp ? new Date(dp.timestamp).getFullYear() : new Date().getFullYear(),
        metadata: dp.metadata
      }));
  },

  /**
   * Group data points by category and subcategory
   */
  groupByCategory(dataPoints: WorldRippleDataPoint[]): Record<string, Record<string, WorldRippleDataPoint[]>> {
    const grouped: Record<string, Record<string, WorldRippleDataPoint[]>> = {};

    dataPoints.forEach(dp => {
      if (!grouped[dp.category]) {
        grouped[dp.category] = {};
      }
      const subcategory = dp.subcategory || 'general';
      if (!grouped[dp.category][subcategory]) {
        grouped[dp.category][subcategory] = [];
      }
      grouped[dp.category][subcategory].push(dp);
    });

    return grouped;
  },

  /**
   * Filter data points by time range
   */
  filterByTimeRange(dataPoints: WorldRippleDataPoint[], startTime: number, endTime: number): WorldRippleDataPoint[] {
    return dataPoints.filter(dp => {
      if (!dp.timestamp) return true;
      const time = typeof dp.timestamp === 'string' ? new Date(dp.timestamp).getTime() : dp.timestamp;
      return time >= startTime && time <= endTime;
    });
  },

  /**
   * Filter data points by geographic bounds
   */
  filterByBounds(
    dataPoints: WorldRippleDataPoint[],
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number
  ): WorldRippleDataPoint[] {
    return dataPoints.filter(dp => {
      if (!dp.coordinates) return false;
      const [lon, lat] = dp.coordinates;
      return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
    });
  },

  /**
   * Helper: Get color based on temperature
   */
  getTemperatureColor(temp: number): string {
    if (temp < -10) return '#60A5FA'; // Light blue
    if (temp < 0) return '#93C5FD';   // Lighter blue
    if (temp < 10) return '#86EFAC';  // Light green
    if (temp < 20) return '#FDE047';  // Yellow
    if (temp < 30) return '#FB923C';  // Orange
    if (temp < 40) return '#F87171';  // Red
    return '#DC2626';                 // Dark red
  },

  /**
   * Helper: Get color based on earthquake magnitude
   */
  getMagnitudeColor(magnitude: number): string {
    if (magnitude < 3.0) return '#10B981';
    if (magnitude < 4.0) return '#84CC16';
    if (magnitude < 5.0) return '#EAB308';
    if (magnitude < 6.0) return '#F97316';
    if (magnitude < 7.0) return '#EF4444';
    if (magnitude < 8.0) return '#DC2626';
    return '#7C3AED';
  },

  /**
   * Helper: Get size based on earthquake magnitude
   */
  getMagnitudeSize(magnitude: number): number {
    return Math.max(5, Math.pow(magnitude, 2) * 2);
  },

  /**
   * Helper: Format large numbers
   */
  formatNumber(num: number): string {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(2)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(2)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(2)}K`;
    return num.toString();
  },

  /**
   * Aggregate data points for heatmap visualization
   */
  createHeatmapData(dataPoints: WorldRippleDataPoint[]): Array<{
    lat: number;
    lng: number;
    intensity: number;
  }> {
    return dataPoints
      .filter(dp => dp.coordinates && dp.value !== undefined)
      .map(dp => ({
        lat: dp.coordinates![1],
        lng: dp.coordinates![0],
        intensity: dp.value! / 100 // Normalize intensity
      }));
  },

  /**
   * Create time series data for charts
   */
  createTimeSeriesData(dataPoints: WorldRippleDataPoint[]): Array<{
    time: number;
    value: number;
    label: string;
  }> {
    return dataPoints
      .filter(dp => dp.timestamp && dp.value !== undefined)
      .sort((a, b) => {
        const timeA = typeof a.timestamp === 'string' ? new Date(a.timestamp).getTime() : a.timestamp!;
        const timeB = typeof b.timestamp === 'string' ? new Date(b.timestamp).getTime() : b.timestamp!;
        return timeA - timeB;
      })
      .map(dp => ({
        time: typeof dp.timestamp === 'string' ? new Date(dp.timestamp).getTime() : dp.timestamp!,
        value: dp.value!,
        label: dp.title
      }));
  }
};

export default apiDataTransformers;