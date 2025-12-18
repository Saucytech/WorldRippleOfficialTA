/**
 * USGS Earthquake API Service
 * FREE earthquake data - no API key required!
 * Documentation: https://earthquake.usgs.gov/fdsnws/event/1/
 */

export interface Earthquake {
  id: string;
  magnitude: number;
  place: string;
  time: number;
  coordinates: [number, number];
  depth: number;
  type: string;
  url: string;
  felt?: number;
  tsunami?: number;
  significance: number;
  status: string;
  alert?: string;
}

export interface EarthquakeCollection {
  type: 'FeatureCollection';
  features: EarthquakeFeature[];
  metadata: {
    generated: number;
    title: string;
    count: number;
  };
}

export interface EarthquakeFeature {
  type: 'Feature';
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    felt?: number;
    tsunami?: number;
    sig: number;
    alert?: string;
    status: string;
    type: string;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number, number]; // [lon, lat, depth]
  };
}

export type EarthquakeFeedType = 
  | 'significant_hour'
  | 'significant_day'
  | 'significant_week'
  | 'significant_month'
  | 'all_hour'
  | 'all_day'
  | 'all_week'
  | 'all_month'
  | '4.5_hour'
  | '4.5_day'
  | '4.5_week'
  | '4.5_month'
  | '2.5_hour'
  | '2.5_day'
  | '2.5_week'
  | '2.5_month'
  | '1.0_hour'
  | '1.0_day'
  | '1.0_week'
  | '1.0_month';

export const earthquakeService = {
  /**
   * Base URL for USGS Earthquake API
   */
  baseUrl: 'https://earthquake.usgs.gov/earthquakes/feed/v1.0',

  /**
   * Get earthquake feed by type
   */
  async getEarthquakeFeed(feedType: EarthquakeFeedType = 'significant_week'): Promise<Earthquake[]> {
    try {
      const response = await fetch(`${this.baseUrl}/summary/${feedType.replace('_', '_')}.geojson`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch earthquake data');
      }

      const data: EarthquakeCollection = await response.json();
      
      return this.transformEarthquakeData(data);
    } catch (error) {
      console.error('Error fetching earthquake data:', error);
      return [];
    }
  },

  /**
   * Get significant earthquakes (M4.5+) from the past month
   */
  async getSignificantEarthquakes(): Promise<Earthquake[]> {
    return this.getEarthquakeFeed('4.5_month');
  },

  /**
   * Get all earthquakes from the past day
   */
  async getRecentEarthquakes(): Promise<Earthquake[]> {
    return this.getEarthquakeFeed('all_day');
  },

  /**
   * Get earthquakes by magnitude and time range
   */
  async getEarthquakesByMagnitude(
    minMagnitude: number,
    days: number = 30
  ): Promise<Earthquake[]> {
    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - days * 24 * 60 * 60 * 1000);
      
      const response = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?` +
        `format=geojson` +
        `&starttime=${startTime.toISOString()}` +
        `&endtime=${endTime.toISOString()}` +
        `&minmagnitude=${minMagnitude}` +
        `&orderby=time`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch earthquake data');
      }

      const data: EarthquakeCollection = await response.json();
      return this.transformEarthquakeData(data);
    } catch (error) {
      console.error('Error fetching earthquakes by magnitude:', error);
      return [];
    }
  },

  /**
   * Get earthquakes within a radius of coordinates
   */
  async getEarthquakesByLocation(
    lat: number,
    lon: number,
    radiusKm: number = 1000,
    days: number = 30
  ): Promise<Earthquake[]> {
    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - days * 24 * 60 * 60 * 1000);
      
      const response = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?` +
        `format=geojson` +
        `&starttime=${startTime.toISOString()}` +
        `&endtime=${endTime.toISOString()}` +
        `&latitude=${lat}` +
        `&longitude=${lon}` +
        `&maxradiuskm=${radiusKm}` +
        `&orderby=time`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch earthquake data');
      }

      const data: EarthquakeCollection = await response.json();
      return this.transformEarthquakeData(data);
    } catch (error) {
      console.error('Error fetching earthquakes by location:', error);
      return [];
    }
  },

  /**
   * Get historical earthquakes for a specific year
   */
  async getHistoricalEarthquakes(year: number, minMagnitude: number = 5.0): Promise<Earthquake[]> {
    try {
      const startTime = new Date(`${year}-01-01`);
      const endTime = new Date(`${year}-12-31`);
      
      const response = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?` +
        `format=geojson` +
        `&starttime=${startTime.toISOString()}` +
        `&endtime=${endTime.toISOString()}` +
        `&minmagnitude=${minMagnitude}` +
        `&orderby=magnitude`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch historical earthquake data');
      }

      const data: EarthquakeCollection = await response.json();
      return this.transformEarthquakeData(data);
    } catch (error) {
      console.error('Error fetching historical earthquakes:', error);
      return [];
    }
  },

  /**
   * Transform GeoJSON earthquake data to our format
   */
  transformEarthquakeData(data: EarthquakeCollection): Earthquake[] {
    return data.features.map(feature => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      place: feature.properties.place,
      time: feature.properties.time,
      coordinates: [
        feature.geometry.coordinates[0], // longitude
        feature.geometry.coordinates[1]  // latitude
      ],
      depth: feature.geometry.coordinates[2],
      type: feature.properties.type,
      url: feature.properties.url,
      felt: feature.properties.felt,
      tsunami: feature.properties.tsunami,
      significance: feature.properties.sig,
      status: feature.properties.status,
      alert: feature.properties.alert
    }));
  },

  /**
   * Get earthquake details by ID
   */
  async getEarthquakeDetails(earthquakeId: string): Promise<Earthquake | null> {
    try {
      const response = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?` +
        `format=geojson` +
        `&eventid=${earthquakeId}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch earthquake details');
      }

      const data: EarthquakeCollection = await response.json();
      const earthquakes = this.transformEarthquakeData(data);
      
      return earthquakes.length > 0 ? earthquakes[0] : null;
    } catch (error) {
      console.error('Error fetching earthquake details:', error);
      return null;
    }
  },

  /**
   * Get earthquake statistics for a region
   */
  async getEarthquakeStats(
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number,
    days: number = 365
  ): Promise<any> {
    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - days * 24 * 60 * 60 * 1000);
      
      const response = await fetch(
        `https://earthquake.usgs.gov/fdsnws/event/1/query?` +
        `format=geojson` +
        `&starttime=${startTime.toISOString()}` +
        `&endtime=${endTime.toISOString()}` +
        `&minlatitude=${minLat}` +
        `&maxlatitude=${maxLat}` +
        `&minlongitude=${minLon}` +
        `&maxlongitude=${maxLon}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch earthquake statistics');
      }

      const data: EarthquakeCollection = await response.json();
      const earthquakes = this.transformEarthquakeData(data);
      
      // Calculate statistics
      const stats = {
        total: earthquakes.length,
        averageMagnitude: 0,
        maxMagnitude: 0,
        minMagnitude: Infinity,
        byMagnitude: {
          minor: 0,      // < 4.0
          light: 0,      // 4.0-4.9
          moderate: 0,   // 5.0-5.9
          strong: 0,     // 6.0-6.9
          major: 0,      // 7.0-7.9
          great: 0       // 8.0+
        }
      };

      earthquakes.forEach(eq => {
        stats.averageMagnitude += eq.magnitude;
        stats.maxMagnitude = Math.max(stats.maxMagnitude, eq.magnitude);
        stats.minMagnitude = Math.min(stats.minMagnitude, eq.magnitude);
        
        if (eq.magnitude < 4.0) stats.byMagnitude.minor++;
        else if (eq.magnitude < 5.0) stats.byMagnitude.light++;
        else if (eq.magnitude < 6.0) stats.byMagnitude.moderate++;
        else if (eq.magnitude < 7.0) stats.byMagnitude.strong++;
        else if (eq.magnitude < 8.0) stats.byMagnitude.major++;
        else stats.byMagnitude.great++;
      });

      if (earthquakes.length > 0) {
        stats.averageMagnitude /= earthquakes.length;
      }

      return stats;
    } catch (error) {
      console.error('Error calculating earthquake statistics:', error);
      return null;
    }
  },

  /**
   * Get magnitude color for visualization
   */
  getMagnitudeColor(magnitude: number): string {
    if (magnitude < 3.0) return '#10B981'; // Green
    if (magnitude < 4.0) return '#84CC16'; // Light green
    if (magnitude < 5.0) return '#EAB308'; // Yellow
    if (magnitude < 6.0) return '#F97316'; // Orange
    if (magnitude < 7.0) return '#EF4444'; // Red
    if (magnitude < 8.0) return '#DC2626'; // Dark red
    return '#7C3AED'; // Purple for 8.0+
  },

  /**
   * Get magnitude size for map markers
   */
  getMagnitudeSize(magnitude: number): number {
    // Scale exponentially for better visualization
    return Math.max(5, Math.pow(magnitude, 2) * 2);
  }
};

export default earthquakeService;