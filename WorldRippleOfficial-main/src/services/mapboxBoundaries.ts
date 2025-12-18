// Mapbox Administrative Boundaries Service
// Uses Mapbox's built-in boundary data for accurate geographic regions

import mapboxgl from 'mapbox-gl';

export interface BoundaryLevel {
  admin0: 'country';
  admin1: 'state/province';
  admin2: 'county/district';
  admin3: 'municipality';
  admin4: 'neighborhood';
}

export interface RegionData {
  id: string;
  name: string;
  level: keyof BoundaryLevel;
  intensity?: number;
  data?: any;
}

export class MapboxBoundariesService {
  private map: mapboxgl.Map | null = null;
  
  setMap(map: mapboxgl.Map) {
    this.map = map;
    this.initializeBoundarySource();
  }
  
  private initializeBoundarySource() {
    if (!this.map) return;
    
    // Add Mapbox boundaries as a source if not already added
    if (!this.map.getSource('mapbox-boundaries')) {
      this.map.addSource('mapbox-boundaries', {
        type: 'vector',
        url: 'mapbox://mapbox.boundaries-v4'
      });
    }
  }
  
  // Create a layer with accurate administrative boundaries
  createBoundaryLayer(
    layerId: string,
    regions: RegionData[],
    color: string,
    opacity: number = 0.4
  ) {
    if (!this.map) return;
    
    // Remove existing layer if it exists
    if (this.map.getLayer(`${layerId}-fill`)) {
      this.map.removeLayer(`${layerId}-fill`);
      this.map.removeLayer(`${layerId}-line`);
    }
    
    // Group regions by administrative level
    const regionsByLevel = regions.reduce((acc, region) => {
      if (!acc[region.level]) acc[region.level] = [];
      acc[region.level].push(region);
      return acc;
    }, {} as Record<string, RegionData[]>);
    
    // Create layers for each administrative level
    Object.entries(regionsByLevel).forEach(([level, levelRegions]) => {
      const sourceLayer = this.getSourceLayerForLevel(level);
      
      // Create fill layer
      this.map!.addLayer({
        id: `${layerId}-${level}-fill`,
        type: 'fill',
        source: 'mapbox-boundaries',
        'source-layer': sourceLayer,
        paint: {
          'fill-color': color,
          'fill-opacity': [
            'case',
            ...this.createIntensityConditions(levelRegions),
            0 // default opacity for non-matching regions
          ]
        },
        filter: ['in', 'name', ...levelRegions.map(r => r.name)]
      });
      
      // Create line layer for borders
      this.map!.addLayer({
        id: `${layerId}-${level}-line`,
        type: 'line',
        source: 'mapbox-boundaries',
        'source-layer': sourceLayer,
        paint: {
          'line-color': color,
          'line-width': 1,
          'line-opacity': opacity * 1.5
        },
        filter: ['in', 'name', ...levelRegions.map(r => r.name)]
      });
    });
  }
  
  private getSourceLayerForLevel(level: string): string {
    const levelMap: Record<string, string> = {
      'country': 'boundaries_admin_0',
      'state/province': 'boundaries_admin_1',
      'county/district': 'boundaries_admin_2',
      'municipality': 'boundaries_admin_3',
      'neighborhood': 'boundaries_admin_4'
    };
    return levelMap[level] || 'boundaries_admin_1';
  }
  
  private createIntensityConditions(regions: RegionData[]): any[] {
    const conditions: any[] = [];
    regions.forEach(region => {
      conditions.push(
        ['==', ['get', 'name'], region.name],
        (region.intensity || 1) * 0.4
      );
    });
    return conditions;
  }
  
  // Get boundary feature for a specific location
  async queryBoundaryAtPoint(
    lngLat: [number, number],
    level: keyof BoundaryLevel = 'state/province'
  ) {
    if (!this.map) return null;
    
    const sourceLayer = this.getSourceLayerForLevel(level);
    const features = this.map.querySourceFeatures('mapbox-boundaries', {
      sourceLayer
    });
    
    // Find feature containing the point
    // Note: This is simplified - real implementation would need point-in-polygon test
    return features[0];
  }
}

// Predefined accurate region sets for common use cases
export const ACCURATE_REGIONS = {
  // US States with disease data
  US_HEALTH_REGIONS: [
    { id: 'us-ca', name: 'California', level: 'state/province' as const, intensity: 0.9 },
    { id: 'us-tx', name: 'Texas', level: 'state/province' as const, intensity: 0.8 },
    { id: 'us-fl', name: 'Florida', level: 'state/province' as const, intensity: 0.85 },
    { id: 'us-ny', name: 'New York', level: 'state/province' as const, intensity: 0.9 },
    { id: 'us-pa', name: 'Pennsylvania', level: 'state/province' as const, intensity: 0.7 },
    { id: 'us-il', name: 'Illinois', level: 'state/province' as const, intensity: 0.75 },
    { id: 'us-oh', name: 'Ohio', level: 'state/province' as const, intensity: 0.7 },
    { id: 'us-ga', name: 'Georgia', level: 'state/province' as const, intensity: 0.8 },
    { id: 'us-nc', name: 'North Carolina', level: 'state/province' as const, intensity: 0.75 },
    { id: 'us-mi', name: 'Michigan', level: 'state/province' as const, intensity: 0.7 }
  ],
  
  // European countries
  EUROPEAN_REGIONS: [
    { id: 'gb', name: 'United Kingdom', level: 'country' as const, intensity: 0.8 },
    { id: 'fr', name: 'France', level: 'country' as const, intensity: 0.75 },
    { id: 'de', name: 'Germany', level: 'country' as const, intensity: 0.7 },
    { id: 'it', name: 'Italy', level: 'country' as const, intensity: 0.8 },
    { id: 'es', name: 'Spain', level: 'country' as const, intensity: 0.75 },
    { id: 'pl', name: 'Poland', level: 'country' as const, intensity: 0.6 },
    { id: 'nl', name: 'Netherlands', level: 'country' as const, intensity: 0.7 },
    { id: 'be', name: 'Belgium', level: 'country' as const, intensity: 0.7 },
    { id: 'se', name: 'Sweden', level: 'country' as const, intensity: 0.6 },
    { id: 'no', name: 'Norway', level: 'country' as const, intensity: 0.5 }
  ],
  
  // Major world cities
  WORLD_CITIES: [
    { id: 'nyc', name: 'New York City', level: 'municipality' as const, intensity: 1.0 },
    { id: 'lon', name: 'London', level: 'municipality' as const, intensity: 0.95 },
    { id: 'tok', name: 'Tokyo', level: 'municipality' as const, intensity: 0.9 },
    { id: 'par', name: 'Paris', level: 'municipality' as const, intensity: 0.85 },
    { id: 'ber', name: 'Berlin', level: 'municipality' as const, intensity: 0.8 },
    { id: 'syd', name: 'Sydney', level: 'municipality' as const, intensity: 0.75 },
    { id: 'tor', name: 'Toronto', level: 'municipality' as const, intensity: 0.7 },
    { id: 'mum', name: 'Mumbai', level: 'municipality' as const, intensity: 0.85 },
    { id: 'sha', name: 'Shanghai', level: 'municipality' as const, intensity: 0.9 },
    { id: 'sao', name: 'São Paulo', level: 'municipality' as const, intensity: 0.85 }
  ]
};

export const boundariesService = new MapboxBoundariesService();