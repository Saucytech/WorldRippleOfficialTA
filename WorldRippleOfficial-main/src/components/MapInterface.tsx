import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/mapMarkers.css';
import { historyService, HistoricalEvent } from '../services/historyApi';
import { DataLayer } from '../App';
import { LayerDataPoint } from '../hooks/useDataCommons';
import { ACCURATE_BOUNDARIES } from '../utils/countryBoundaries';
import { Invention } from '../services/inventionsApi';
import { getEventsForYear, getNearestEvents } from '../services/timelineEvents';
import { RippleManager, RippleEvent } from './RippleAnimation';
import { earthquakeService } from '../services/earthquakeApi';
import { communityService } from '../services/communityService';
import { layerEventsService, LayerEvent } from '../services/layerEvents';
import { EventDetailCard } from './EventDetailCard';

interface SearchResult {
  id: string;
  title: string;
  type: 'location' | 'event' | 'layer' | 'year' | 'person' | 'invention';
  description: string;
  coordinates?: [number, number];
  year?: number;
  layerId?: string;
  historicalEvent?: any;
  historicalPerson?: any;
  invention?: Invention;
}

interface MapInterfaceProps {
  dataLayers: DataLayer[];
  currentYear: number;
  realData: Map<string, LayerDataPoint[]>;
  dataLoading: boolean;
  searchResult?: SearchResult | null;
  onSearchResultDisplayed?: () => void;
  onMapReady?: (map: mapboxgl.Map) => void;
  selectedCategoryEvents?: string | null;
  onClearCategoryEvents?: () => void;
  isPanelCollapsed?: boolean;
  isLeftPanelCollapsed?: boolean;
  onToggleLeftPanel?: () => void;
}

// Region definitions with accurate boundaries
const REGION_DEFINITIONS: Record<string, Array<{ name: string; intensity: number }>> = {
  disease: [
    { name: 'United States', intensity: 0.9 },
    { name: 'United Kingdom', intensity: 0.7 },
    { name: 'Germany', intensity: 0.6 }
  ],
  housing: [
    { name: 'California', intensity: 1.0 },
    { name: 'New York', intensity: 0.9 },
    { name: 'Texas', intensity: 0.8 },
    { name: 'Florida', intensity: 0.85 }
  ],
  environment: [
    { name: 'China', intensity: 0.8 },
    { name: 'United States', intensity: 0.6 }
  ],
  politics: [
    { name: 'United States', intensity: 1.0 },
    { name: 'Germany', intensity: 0.7 },
    { name: 'United Kingdom', intensity: 0.6 }
  ],
  economy: [
    { name: 'United States', intensity: 0.9 },
    { name: 'China', intensity: 1.0 },
    { name: 'Japan', intensity: 0.8 }
  ],
  social: [
    { name: 'United States', intensity: 0.8 },
    { name: 'United Kingdom', intensity: 0.7 },
    { name: 'Germany', intensity: 0.6 }
  ],
  innovation: [
    { name: 'California', intensity: 1.0 },
    { name: 'United States', intensity: 0.8 },
    { name: 'Japan', intensity: 0.9 },
    { name: 'Germany', intensity: 0.7 },
    { name: 'China', intensity: 0.85 }
  ]
};

// Fallback simplified boundaries (only used if Mapbox boundaries unavailable)
const GEOGRAPHICAL_BOUNDARIES = {
  disease: {
    'United States': {
      type: 'Feature',
      properties: { name: 'United States', intensity: 1.0 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-125.0, 48.0], [-125.0, 45.0], [-124.0, 42.0], [-120.0, 39.0], [-117.0, 32.5],
          [-111.0, 31.0], [-108.0, 31.5], [-93.0, 29.0], [-84.0, 30.0], [-82.0, 25.0],
          [-80.0, 25.5], [-75.0, 35.0], [-71.0, 41.0], [-69.0, 44.0], [-69.0, 47.0],
          [-83.0, 46.0], [-95.0, 49.0], [-125.0, 48.0]
        ]]
      }
    },
    'United Kingdom': {
      type: 'Feature',
      properties: { name: 'United Kingdom', intensity: 0.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-8.0, 60.0], [-8.0, 57.0], [-6.0, 55.0], [-3.0, 54.5], [-2.0, 53.0],
          [1.0, 51.0], [2.0, 50.5], [1.0, 49.5], [-1.0, 49.0], [-5.0, 50.0],
          [-6.0, 54.0], [-8.0, 60.0]
        ]]
      }
    },
    'Germany': {
      type: 'Feature',
      properties: { name: 'Germany', intensity: 0.7 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [5.5, 55.0], [15.0, 54.5], [15.5, 50.0], [13.0, 47.5], [10.0, 47.0],
          [6.0, 49.0], [5.5, 51.5], [5.5, 55.0]
        ]]
      }
    },
    'New York City': {
      type: 'Feature',
      properties: { name: 'New York', intensity: 0.9 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-74.3, 40.9], [-73.7, 40.9], [-73.7, 40.4], [-74.3, 40.4], [-74.3, 40.9]
        ]]
      }
    },
    'San Francisco Bay Area': {
      type: 'Feature',
      properties: { name: 'California', intensity: 0.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-122.8, 38.0], [-121.5, 38.0], [-121.5, 37.2], [-122.8, 37.2], [-122.8, 38.0]
        ]]
      }
    },
    'London': {
      type: 'Feature',
      properties: { name: 'United Kingdom', intensity: 0.9 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-0.5, 51.7], [0.3, 51.7], [0.3, 51.3], [-0.5, 51.3], [-0.5, 51.7]
        ]]
      }
    },
    'Berlin': {
      type: 'Feature',
      properties: { name: 'Germany', intensity: 0.9 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [13.0, 52.7], [13.8, 52.7], [13.8, 52.3], [13.0, 52.3], [13.0, 52.7]
        ]]
      }
    }
  },
  housing: {
    'California': {
      type: 'Feature',
      properties: { name: 'California', intensity: 1.0 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-124.4, 42.0], [-124.4, 41.0], [-124.0, 40.0], [-123.0, 39.0], [-122.0, 38.0],
          [-121.0, 37.0], [-120.0, 36.0], [-119.0, 35.0], [-118.0, 34.0], [-117.0, 33.0],
          [-116.0, 32.5], [-114.5, 32.5], [-114.5, 35.0], [-117.0, 35.0], [-119.0, 36.0],
          [-120.0, 37.0], [-121.0, 38.0], [-122.0, 39.0], [-123.0, 40.0], [-124.0, 41.0],
          [-124.4, 42.0]
        ]]
      }
    },
    'New York': {
      type: 'Feature',
      properties: { name: 'New York', intensity: 0.9 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-79.8, 45.0], [-79.8, 42.0], [-79.0, 42.0], [-75.0, 42.0], [-73.3, 40.5],
          [-71.9, 40.9], [-71.9, 41.3], [-73.7, 42.7], [-76.8, 43.6], [-79.0, 43.3],
          [-79.8, 45.0]
        ]]
      }
    },
    'San Francisco': {
      type: 'Feature',
      properties: { name: 'California', intensity: 1.0 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-122.6, 37.9], [-122.3, 37.9], [-122.3, 37.6], [-122.6, 37.6], [-122.6, 37.9]
        ]]
      }
    },
    'Los Angeles': {
      type: 'Feature',
      properties: { name: 'California', intensity: 0.9 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-118.7, 34.3], [-117.9, 34.3], [-117.9, 33.7], [-118.7, 33.7], [-118.7, 34.3]
        ]]
      }
    },
    'Detroit': {
      type: 'Feature',
      properties: { name: 'United States', intensity: 0.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-83.3, 42.5], [-82.9, 42.5], [-82.9, 42.1], [-83.3, 42.1], [-83.3, 42.5]
        ]]
      }
    },
    'London': {
      type: 'Feature',
      properties: { name: 'London', intensity: 0.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-0.5, 51.7], [0.3, 51.7], [0.3, 51.3], [-0.5, 51.3], [-0.5, 51.7]
        ]]
      }
    }
  },
  environment: {
    'Arctic Region': {
      type: 'Feature',
      properties: { name: 'Arctic Region', intensity: 1.0 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-180, 85], [-135, 85], [-90, 85], [-45, 85], [0, 85], [45, 85], [90, 85], [135, 85], [180, 85],
          [180, 66.5], [135, 66.5], [90, 66.5], [45, 66.5], [0, 66.5], [-45, 66.5], [-90, 66.5], [-135, 66.5], [-180, 66.5],
          [-180, 85]
        ]]
      }
    },
    'Amazon Basin': {
      type: 'Feature',
      properties: { name: 'Amazon Basin', intensity: 0.9 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-73.0, 5.0], [-60.0, 5.0], [-50.0, 0.0], [-50.0, -10.0], [-55.0, -15.0],
          [-65.0, -15.0], [-70.0, -10.0], [-73.0, -5.0], [-73.0, 5.0]
        ]]
      }
    },
    'Sahara Desert': {
      type: 'Feature',
      properties: { name: 'Sahara Desert', intensity: 0.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-17.0, 30.0], [35.0, 30.0], [35.0, 15.0], [15.0, 10.0], [-5.0, 15.0], [-17.0, 20.0], [-17.0, 30.0]
        ]]
      }
    }
  },
  politics: {
    'United States': {
      type: 'Feature',
      properties: { name: 'United States', intensity: 1.0 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-125.0, 48.0], [-125.0, 45.0], [-124.0, 42.0], [-120.0, 39.0], [-117.0, 32.5],
          [-111.0, 31.0], [-108.0, 31.5], [-93.0, 29.0], [-84.0, 30.0], [-82.0, 25.0],
          [-80.0, 25.5], [-75.0, 35.0], [-71.0, 41.0], [-69.0, 44.0], [-69.0, 47.0],
          [-83.0, 46.0], [-95.0, 49.0], [-125.0, 48.0]
        ]]
      }
    },
    'European Union': {
      type: 'Feature',
      properties: { name: 'European Union', intensity: 0.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-10.0, 60.0], [30.0, 60.0], [30.0, 35.0], [20.0, 35.0], [10.0, 40.0],
          [0.0, 42.0], [-10.0, 45.0], [-10.0, 60.0]
        ]]
      }
    },
    'China': {
      type: 'Feature',
      properties: { name: 'China', intensity: 0.9 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [73.0, 53.0], [135.0, 53.0], [135.0, 18.0], [100.0, 18.0], [80.0, 28.0], [73.0, 35.0], [73.0, 53.0]
        ]]
      }
    }
  },
  economy: {
    'NAFTA Region': {
      type: 'Feature',
      properties: { name: 'NAFTA Region', intensity: 1.0 },
      geometry: {
        type: 'MultiPolygon',
        coordinates: [
          // United States
          [[
            [-125.0, 48.0], [-125.0, 45.0], [-124.0, 42.0], [-120.0, 39.0], [-117.0, 32.5],
            [-111.0, 31.0], [-108.0, 31.5], [-93.0, 29.0], [-84.0, 30.0], [-82.0, 25.0],
            [-80.0, 25.5], [-75.0, 35.0], [-71.0, 41.0], [-69.0, 44.0], [-69.0, 47.0],
            [-83.0, 46.0], [-95.0, 49.0], [-125.0, 48.0]
          ]],
          // Mexico
          [[
            [-117.0, 32.5], [-111.0, 31.0], [-108.0, 31.5], [-93.0, 29.0], [-87.0, 21.0],
            [-90.0, 14.0], [-95.0, 14.0], [-110.0, 24.0], [-117.0, 32.5]
          ]]
        ]
      }
    },
    'European Economic Area': {
      type: 'Feature',
      properties: { name: 'European Economic Area', intensity: 0.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-25.0, 70.0], [40.0, 70.0], [40.0, 35.0], [20.0, 35.0], [10.0, 40.0],
          [0.0, 42.0], [-10.0, 45.0], [-25.0, 60.0], [-25.0, 70.0]
        ]]
      }
    }
  },
  social: {
    'North America': {
      type: 'Feature',
      properties: { name: 'North America', intensity: 1.0 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-125.0, 48.0], [-125.0, 45.0], [-124.0, 42.0], [-120.0, 39.0], [-117.0, 32.5],
          [-111.0, 31.0], [-108.0, 31.5], [-93.0, 29.0], [-84.0, 30.0], [-82.0, 25.0],
          [-80.0, 25.5], [-75.0, 35.0], [-71.0, 41.0], [-69.0, 44.0], [-69.0, 47.0],
          [-83.0, 46.0], [-95.0, 49.0], [-125.0, 48.0]
        ]]
      }
    },
    'Western Europe': {
      type: 'Feature',
      properties: { name: 'Western Europe', intensity: 0.8 },
      geometry: {
        type: 'Polygon',
        coordinates: [[
          [-10.0, 60.0], [15.0, 60.0], [15.0, 35.0], [5.0, 35.0], [-5.0, 40.0], [-10.0, 45.0], [-10.0, 60.0]
        ]]
      }
    }
  }
};

export const MapInterface: React.FC<MapInterfaceProps> = React.memo(({
  dataLayers,
  currentYear,
  realData,
  dataLoading,
  searchResult,
  onSearchResultDisplayed,
  onMapReady,
  selectedCategoryEvents,
  onClearCategoryEvents,
  isPanelCollapsed = false,
  isLeftPanelCollapsed = false,
  onToggleLeftPanel
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layersAdded, setLayersAdded] = useState<Set<string>>(new Set());
  const currentPopups = useRef<mapboxgl.Popup[]>([]);
  const searchMarker = useRef<mapboxgl.Marker | null>(null);
  const eventHandlers = useRef<Map<string, any>>(new Map());
  const yearMarkers = useRef<mapboxgl.Marker[]>([]);
  const [rippleEvents, setRippleEvents] = useState<RippleEvent[]>([]);
  const earthquakeUpdateInterval = useRef<NodeJS.Timeout | null>(null);
  const communityMarkers = useRef<mapboxgl.Marker[]>([]);
  const layerEventMarkers = useRef<mapboxgl.Marker[]>([]);

  // Initialize Mapbox - only once
  useEffect(() => {
    // Double-check to prevent multiple initializations
    if (map.current || !mapContainer.current) return;
    
    mapboxgl.accessToken = 'pk.eyJ1IjoidG9iaWVhbmRyZXdzIiwiYSI6ImNtZXQwN25vMjA4cTIyam16bGY4N3M0ZWIifQ.EjIqGhcMH_u432HEiu0NIw';

    // Create map instance
    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [0, 20],
      zoom: 1.5,
      attributionControl: false,
      projection: 'globe', // Use beautiful globe projection
      logoPosition: 'bottom-right',
      // Prevent flashing by waiting for style to load
      fadeDuration: 0
    });

    // Store the instance immediately
    map.current = mapInstance;

    mapInstance.on('load', () => {
      // Configure beautiful globe with blue universe/stars atmosphere
      mapInstance.setFog({
        'range': [0.8, 8],
        'color': '#0a0e27', // Deep blue space color
        'high-color': '#1c2951', // Lighter blue for atmosphere
        'space-color': '#0a0e27', // Deep space background
        'horizon-blend': 0.1,
        'star-intensity': 0.8 // Add beautiful stars
      });
      
      // Add atmosphere effect for beautiful blue glow
      mapInstance.setPaintProperty('sky', 'sky-atmosphere-sun', [0, 90]);
      mapInstance.setPaintProperty('sky', 'sky-atmosphere-color', '#4a90e2');
      
      setMapLoaded(true);
      if (onMapReady) {
        onMapReady(mapInstance);
      }
    });

    // Add zoom event handlers to stabilize markers
    mapInstance.on('zoomstart', () => {
      // Force all markers to stay locked to their coordinates during zoom
      layerEventMarkers.current.forEach(marker => {
        const lngLat = marker.getLngLat();
        marker.setLngLat(lngLat); // Force reposition
      });
    });

    mapInstance.on('zoomend', () => {
      // Force all markers to reposition after zoom completes
      setTimeout(() => {
        layerEventMarkers.current.forEach(marker => {
          const lngLat = marker.getLngLat();
          marker.setLngLat(lngLat); // Force reposition
        });
      }, 50); // Small delay to ensure zoom animation is complete
    });

    mapInstance.dragRotate.disable();
    mapInstance.touchZoomRotate.disableRotation();

    return () => {
      if (earthquakeUpdateInterval.current) {
        clearInterval(earthquakeUpdateInterval.current);
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [onMapReady]);

  // Store earthquake markers in a ref to avoid re-render issues
  const earthquakeMarkersRef = useRef<any[]>([]);
  const earthquakeFetched = useRef(false);

  // Fetch and display live earthquake data - DISABLED TO PREVENT FLASHING
  useEffect(() => {
    // TEMPORARILY DISABLED - Uncomment to enable earthquake data
    return;
    
    /*
    if (!mapLoaded || !map.current) return;
    
    // Prevent multiple fetches
    if (earthquakeFetched.current) return;
    earthquakeFetched.current = true;

    const fetchEarthquakes = async () => {
      try {
        const earthquakes = await earthquakeService.getRecentEarthquakes();
        
        // Clear existing earthquake markers from ref
        earthquakeMarkersRef.current.forEach(marker => marker.remove());
        earthquakeMarkersRef.current = [];
        
        const newMarkers: any[] = [];
        const newRipples: RippleEvent[] = [];
        
        earthquakes.slice(0, 10).forEach(eq => {
          // Create marker for each earthquake
          const el = document.createElement('div');
          el.className = 'earthquake-marker';
          el.style.width = `${Math.max(10, eq.magnitude * 5)}px`;
          el.style.height = `${Math.max(10, eq.magnitude * 5)}px`;
          el.style.backgroundColor = earthquakeService.getMagnitudeColor(eq.magnitude);
          el.style.borderRadius = '50%';
          el.style.border = '2px solid white';
          el.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
          el.style.cursor = 'pointer';
          
          const marker = new mapboxgl.Marker({
            element: el,
            anchor: 'center',
            offset: [0, 0]
          })
            .setLngLat(eq.coordinates)
            .setPopup(
              new mapboxgl.Popup({ offset: 25 })
                .setHTML(`
                  <div style="padding: 8px;">
                    <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
                      M${eq.magnitude} Earthquake
                    </h3>
                    <p style="margin: 0 0 4px 0; font-size: 12px;">${eq.place}</p>
                    <p style="margin: 0; font-size: 11px; color: #666;">
                      ${new Date(eq.time).toLocaleString()}
                    </p>
                    ${eq.tsunami ? '<p style="margin: 4px 0 0 0; color: red; font-size: 11px;">⚠️ Tsunami Warning</p>' : ''}
                  </div>
                `)
            );
          
          if (map.current) {
            marker.addTo(map.current);
            newMarkers.push(marker);
          }
          
          // Create ripple effect for significant earthquakes
          if (eq.magnitude >= 4.5) {
            newRipples.push({
              id: `earthquake-${eq.id}`,
              coordinates: eq.coordinates,
              type: 'disaster',
              magnitude: eq.magnitude,
              timestamp: eq.time,
              duration: 4000
            });
          }
        });
        
        // Store markers in ref instead of state
        earthquakeMarkersRef.current = newMarkers;
        
        // Don't add ripples on every update to avoid overwhelming the display
        // Only add ripples if this is the first fetch or if it's been a while
        // This prevents the flashing/spazzing effect
      } catch (error) {
        console.error('Failed to fetch earthquake data:', error);
      }
    };

    // Fetch immediately
    fetchEarthquakes();
    
    // Update every 5 minutes
    earthquakeUpdateInterval.current = setInterval(fetchEarthquakes, 5 * 60 * 1000);
    
    return () => {
      if (earthquakeUpdateInterval.current) {
        clearInterval(earthquakeUpdateInterval.current);
      }
      earthquakeMarkersRef.current.forEach(marker => marker.remove());
      earthquakeMarkersRef.current = [];
    };
    */
  }, [mapLoaded]);

  // Add data layers to map - DISABLED to prevent visual pulsing
  // We're now using event markers instead of regional fills
  useEffect(() => {
    // Skip adding fill layers - we're using event markers instead
    return;
    
    /* ORIGINAL FILL LAYER CODE - DISABLED
    if (!map.current || !mapLoaded) return;
    
    // CRITICAL: Wait for map style to be fully loaded
    const addLayersWhenReady = () => {
      if (!map.current || !map.current.isStyleLoaded()) {
        // Style not ready, wait a bit and retry
        setTimeout(addLayersWhenReady, 100);
        return;
      }
      
      // Prevent any action if no layers are active (initial state)
      const activeLayers = dataLayers.filter(layer => layer.isActive);
      if (activeLayers.length === 0 && layersAdded.size === 0) {
        return; // Nothing to do
      }

      const activeLayerIds = new Set(activeLayers.map(layer => layer.id));
    
    // Remove layers that are no longer active
    layersAdded.forEach(layerId => {
      if (!activeLayerIds.has(layerId)) {
        const sourceId = `${layerId}-source`;
        const mainLayerId = `${layerId}-layer`;
        const borderLayerId = `${layerId}-layer-border`;
        const stateLayerId = `${layerId}-state-layer`;
        const stateBorderId = `${layerId}-state-border`;

        try {
          // Remove event handlers
          const handlers = eventHandlers.current.get(mainLayerId);
          if (handlers && map.current) {
            map.current.off('mouseenter', mainLayerId, handlers.mouseenter);
            map.current.off('mouseleave', mainLayerId, handlers.mouseleave);
            eventHandlers.current.delete(mainLayerId);
          }

          // Clear any popups associated with this layer
          currentPopups.current.forEach(popup => popup.remove());
          currentPopups.current = [];

          // Remove map layers and source
          if (map.current?.getLayer(borderLayerId)) {
            map.current.removeLayer(borderLayerId);
          }
          if (map.current?.getLayer(mainLayerId)) {
            map.current.removeLayer(mainLayerId);
          }
          if (map.current?.getSource(sourceId)) {
            map.current.removeSource(sourceId);
          }
        } catch (error) {
          console.warn(`Error removing layer ${layerId}:`, error);
        }
      }
    });

    // Update the set of added layers
    setLayersAdded(activeLayerIds);
    
    // Now add the active layers
    activeLayers.forEach(layer => {
      const sourceId = `${layer.id}-source`;
      const mainLayerId = `${layer.id}-layer`;
      const borderLayerId = `${layer.id}-layer-border`;
      
      // Update existing layer opacity if it exists
      if (map.current?.getSource(sourceId)) {
        try {
          if (map.current?.getLayer(mainLayerId)) {
            map.current.setPaintProperty(mainLayerId, 'fill-opacity', layer.intensity * 0.4);
          }
          if (map.current?.getLayer(borderLayerId)) {
            map.current.setPaintProperty(borderLayerId, 'line-opacity', layer.intensity * 0.6);
          }
        } catch (error) {
          console.warn(`Error updating layer ${layer.id} opacity:`, error);
        }
        return;
      }

      // Get region definitions for this layer
      const regions = REGION_DEFINITIONS[layer.id as keyof typeof REGION_DEFINITIONS];

      if (!regions) {
        console.warn(`No region definitions found for layer: ${layer.id}`);
        return;
      }

      // Create GeoJSON features using accurate boundaries
      const features = regions.map(region => {
        const boundary = ACCURATE_BOUNDARIES[region.name];
        if (!boundary) {
          console.warn(`No accurate boundary found for region: ${region.name}`);
          return null;
        }

        return {
          ...boundary,
          properties: {
            ...boundary.properties,
            layerId: layer.id,
            intensity: region.intensity * layer.intensity
          }
        };
      }).filter(Boolean);

      if (features.length === 0) {
        console.warn(`No features could be created for layer: ${layer.id}`);
        return;
      }

      const geoJsonData = {
        type: 'FeatureCollection' as const,
        features
      };

      try {
        // Add source
        map.current?.addSource(sourceId, {
          type: 'geojson',
          data: geoJsonData
        });

        // Add fill layer
        map.current?.addLayer({
          id: mainLayerId,
          type: 'fill',
          source: sourceId,
          paint: {
            'fill-color': layer.color,
            'fill-opacity': layer.intensity * 0.4
          }
        });

        // Add border layer
        map.current?.addLayer({
          id: borderLayerId,
          type: 'line',
          source: sourceId,
          paint: {
            'line-color': layer.color,
            'line-width': 2,
            'line-opacity': layer.intensity * 0.6
          }
        });

        // Remove any existing event handlers for this layer
        const existingHandlers = eventHandlers.current.get(mainLayerId);
        if (existingHandlers && map.current) {
          map.current.off('mouseenter', mainLayerId, existingHandlers.mouseenter);
          map.current.off('mouseleave', mainLayerId, existingHandlers.mouseleave);
        }

        // Create new event handlers
        const mouseenterHandler = async (e: any) => {
          if (!map.current) return;

          map.current.getCanvas().style.cursor = 'pointer';

          // Only show popups for health layer
          if (layer.id !== 'health' || !e.features || !e.features[0]) return;

          const feature = e.features[0];
          const regionName = feature.properties?.name;

          if (regionName) {
            // Clear existing popups first
            currentPopups.current.forEach(popup => popup.remove());
            currentPopups.current = [];

            try {
              // Get location-specific historical events with API integration
              const historicalEvents = await historyService.getLocationHistoricalEvents(regionName, currentYear);

              if (historicalEvents.length > 0) {
                const event = historicalEvents[0]; // Show the most relevant event

                const yearDiff = Math.abs(event.year - currentYear);
                const timeContext = event.year === currentYear ? 'This year' :
                                  event.year < currentYear ? `${yearDiff} years ago` :
                                  `${yearDiff} years in the future`;

                const popup = new mapboxgl.Popup({
                  closeButton: false,
                  closeOnClick: false,
                  className: 'historical-event-popup',
                  maxWidth: '300px'
                })
                  .setLngLat(e.lngLat)
                  .setHTML(`
                    <div style="
                      background: white;
                      color: black;
                      padding: 14px;
                      border-radius: 8px;
                      box-shadow: 0 4px 16px rgba(0,0,0,0.3);
                      max-width: 280px;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                      border: 1px solid #e5e7eb;
                    ">
                      <div style="
                        font-size: 11px;
                        color: #6b7280;
                        text-transform: uppercase;
                        letter-spacing: 0.5px;
                        margin-bottom: 6px;
                        font-weight: 500;
                      ">${timeContext} • ${event.category}</div>
                      <div style="
                        font-size: 15px;
                        font-weight: 600;
                        color: #111827;
                        margin-bottom: 8px;
                        line-height: 1.3;
                      ">${event.title}</div>
                      <div style="
                        font-size: 13px;
                        color: #374151;
                        line-height: 1.4;
                        margin-bottom: 8px;
                      ">${event.description.length > 150 ? event.description.substring(0, 150) + '...' : event.description}</div>
                      <div style="
                        font-size: 11px;
                        color: #9ca3af;
                        border-top: 1px solid #f3f4f6;
                        padding-top: 8px;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                      ">
                        <span>📍 ${regionName}</span>
                        <span style="font-weight: 500;">${event.date}</span>
                      </div>
                    </div>
                  `)
                  .addTo(map.current!);

                currentPopups.current = [popup];
              }
            } catch (error) {
              console.warn('Error fetching historical events:', error);
            }
          }
        };

        const mouseleaveHandler = () => {
          if (map.current) {
            map.current.getCanvas().style.cursor = '';

            // Remove historical event popups on mouse leave
            currentPopups.current.forEach(popup => popup.remove());
            currentPopups.current = [];
          }
        };

        // Add the new handlers
        map.current?.on('mouseenter', mainLayerId, mouseenterHandler);
        map.current?.on('mouseleave', mainLayerId, mouseleaveHandler);

        // Store handlers for cleanup
        eventHandlers.current.set(mainLayerId, {
          mouseenter: mouseenterHandler,
          mouseleave: mouseleaveHandler
        });

      } catch (error) {
        console.warn(`Error adding layer ${layer.id}:`, error);
      }
    });
    }
    
    // Start the process
    addLayersWhenReady();
    */
  }, [dataLayers, mapLoaded, currentYear, realData]);

  // Display community insights markers
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Check if community layer is active
    const communityLayer = dataLayers.find(layer => layer.id === 'community');
    
    if (communityLayer?.isActive) {
      // Clear existing community markers
      communityMarkers.current.forEach(marker => marker.remove());
      communityMarkers.current = [];

      // Get community contributions with coordinates
      const contributions = communityService.getContributionsWithCoordinates();

      // Create markers for each contribution
      contributions.forEach(contribution => {
        if (!contribution.coordinates) return;

        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'community-marker';
        
        // Style based on contribution type
        const typeColors = {
          story: '#A855F7',
          data: '#3B82F6',
          insight: '#10B981',
          question: '#F59E0B'
        };
        
        el.style.cssText = `
          width: 32px;
          height: 32px;
          background: ${typeColors[contribution.type] || '#22C55E'};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: transform 0.2s;
        `;
        
        // Add icon based on type
        const icons = {
          story: '📖',
          data: '📊',
          insight: '💡',
          question: '❓'
        };
        el.innerHTML = `<span style="font-size: 16px;">${icons[contribution.type]}</span>`;
        
        // Add hover effect
        el.onmouseenter = () => {
          el.style.transform = 'scale(1.2)';
        };
        el.onmouseleave = () => {
          el.style.transform = 'scale(1)';
        };

        // Create popup
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: true,
          closeOnClick: false,
          maxWidth: '350px'
        })
        .setHTML(`
          <div style="
            padding: 12px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          ">
            <div style="
              display: flex;
              align-items: center;
              margin-bottom: 8px;
            ">
              <span style="
                background: ${typeColors[contribution.type]};
                color: white;
                padding: 2px 8px;
                border-radius: 4px;
                font-size: 11px;
                font-weight: 600;
                text-transform: uppercase;
                margin-right: 8px;
              ">${contribution.type}</span>
              <span style="
                color: #10B981;
                font-size: 12px;
                display: flex;
                align-items: center;
              ">
                <span style="font-size: 14px; margin-right: 4px;">👍</span>
                ${contribution.votes}
              </span>
            </div>
            <h3 style="
              margin: 0 0 8px 0;
              font-size: 16px;
              font-weight: 600;
              color: #111827;
              line-height: 1.3;
            ">${contribution.title}</h3>
            <p style="
              margin: 0 0 8px 0;
              font-size: 13px;
              color: #6B7280;
              line-height: 1.4;
            ">${contribution.content.substring(0, 150)}...</p>
            <div style="
              display: flex;
              justify-content: space-between;
              align-items: center;
              margin-top: 12px;
              padding-top: 8px;
              border-top: 1px solid #E5E7EB;
            ">
              <span style="
                font-size: 12px;
                color: #9CA3AF;
              ">By ${contribution.author}</span>
              <span style="
                font-size: 11px;
                color: #9CA3AF;
              ">${contribution.location}</span>
            </div>
            <div style="
              margin-top: 8px;
              display: flex;
              flex-wrap: wrap;
              gap: 4px;
            ">
              ${contribution.tags.map(tag => `
                <span style="
                  background: #F3F4F6;
                  color: #6B7280;
                  padding: 2px 6px;
                  border-radius: 3px;
                  font-size: 10px;
                ">#${tag}</span>
              `).join('')}
            </div>
          </div>
        `);

        // Create marker
        const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
          .setLngLat(contribution.coordinates)
          .setPopup(popup)
          .addTo(map.current!);

        communityMarkers.current.push(marker);

        // Add ripple effect for community insights
        setRippleEvents(prev => [
          ...prev.filter(e => !e.id.startsWith('community-')),
          {
            id: `community-${contribution.id}`,
            coordinates: contribution.coordinates,
            type: 'social',
            magnitude: Math.min(contribution.votes / 10, 5),
            timestamp: contribution.timestamp.getTime(),
            duration: 3000
          }
        ]);
      });
    } else {
      // Remove community markers if layer is not active
      communityMarkers.current.forEach(marker => marker.remove());
      communityMarkers.current = [];
      
      // Remove community ripples
      setRippleEvents(prev => prev.filter(e => !e.id.startsWith('community-')));
    }
  }, [dataLayers, mapLoaded]);

  // Display category events when selected from Data Explorer
  useEffect(() => {
    if (!map.current || !mapLoaded || !selectedCategoryEvents) return;

    // Clear existing layer event markers
    layerEventMarkers.current.forEach(marker => marker.remove());
    layerEventMarkers.current = [];

    // Get all events for the selected category
    const categoryEvents = layerEventsService.getEventsByLayers([selectedCategoryEvents]);
    
    // Sort events chronologically
    const sortedEvents = categoryEvents.sort((a, b) => a.year - b.year);

    // Create markers for ALL events in the category
    sortedEvents.forEach((event, index) => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'layer-event-marker category-event';
      
      const layerColor = layerEventsService.getLayerColor(event.layerType);
      const size = Math.round((25 + (event.magnitude * 3)) * 0.6); // Reduced by 40%
      
      el.style.cssText = `
        width: 12px;
        height: 12px;
        background: ${layerColor};
        border: 1px solid white;
        border-radius: 50%;
        cursor: pointer;
      `;
      
      // Add hover effect - only change shadow and border, NO transform
      el.addEventListener('mouseenter', () => {
        el.style.boxShadow = '0 6px 25px rgba(0,0,0,0.6)';
        el.style.borderColor = '#fbbf24';
        el.style.borderWidth = '4px';
      });
      
      el.addEventListener('mouseleave', () => {
        el.style.boxShadow = '0 4px 15px rgba(0,0,0,0.4)';
        el.style.borderColor = 'white';
        el.style.borderWidth = '3px';
      });

      // Create detailed popup - opens on click
      const popup = new mapboxgl.Popup({
        offset: [0, -size/2 - 5], // Offset based on marker size
        className: 'layer-event-popup',
        maxWidth: '400px',
        closeButton: true,
        closeOnClick: false,
        anchor: 'bottom' // Anchor to bottom of marker
      }).setHTML(`
        <div style="padding: 12px; max-width: 350px;">
          <div style="display: flex; align-items: center; margin-bottom: 10px;">
            <div style="
              width: 40px;
              height: 40px;
              background: ${layerColor};
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 12px;
              flex-shrink: 0;
            ">
              <span style="font-size: 20px;">${event.icon || '📍'}</span>
            </div>
            <div>
              <h3 style="margin: 0; font-size: 16px; font-weight: bold; color: #fff;">
                #${index + 1}: ${event.title}
              </h3>
              <div style="color: #94a3b8; font-size: 12px; margin-top: 2px;">
                ${event.date} • Magnitude: ${event.magnitude}/10
              </div>
            </div>
          </div>
          
          <p style="margin: 10px 0; font-size: 13px; line-height: 1.5; color: #e2e8f0;">
            ${event.description}
          </p>
          
          ${event.rippleEffects && event.rippleEffects.length > 0 ? `
            <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #334155;">
              <h4 style="margin: 0 0 8px 0; font-size: 12px; color: #94a3b8; text-transform: uppercase;">
                Ripple Effects:
              </h4>
              <ul style="margin: 0; padding-left: 20px; font-size: 12px; color: #cbd5e1;">
                ${event.rippleEffects.slice(0, 3).map(effect => `
                  <li style="margin: 4px 0;">${effect}</li>
                `).join('')}
              </ul>
            </div>
          ` : ''}
        </div>
      `);

      // Create marker with proper centering
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat(event.coordinates)
        .addTo(map.current!);

      // Add click handler to show popup
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        // Close any other open popups
        document.querySelectorAll('.mapboxgl-popup').forEach(p => p.remove());
        // Show this popup
        popup.setLngLat(event.coordinates).addTo(map.current!);
      });

      layerEventMarkers.current.push(marker);
    });

    // Fit map to show all markers with proper centering
    if (sortedEvents.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      sortedEvents.forEach(event => {
        bounds.extend(event.coordinates);
      });
      
      // Account for both panels
      const leftPadding = isLeftPanelCollapsed ? 100 : 450;
      const rightPadding = isPanelCollapsed ? 100 : 350;
      map.current.fitBounds(bounds, {
        padding: { top: 100, bottom: 100, left: leftPadding, right: rightPadding },
        duration: 1500,
        maxZoom: 5
      });
    }

    // Add initial ripple effect for the entire category
    setRippleEvents([{
      id: `category-${selectedCategoryEvents}`,
      coordinates: sortedEvents[0]?.coordinates || [0, 0],
      type: selectedCategoryEvents as any,
      magnitude: 5,
      timestamp: Date.now(),
      duration: 3000
    }]);

  }, [selectedCategoryEvents, mapLoaded, isPanelCollapsed, isLeftPanelCollapsed]);

  // Resize map when panels collapse/expand
  useEffect(() => {
    if (!map.current || !mapLoaded) return;
    
    // Wait for CSS transition to complete
    setTimeout(() => {
      map.current?.resize();
      
      // If we have category events selected, refit bounds
      if (selectedCategoryEvents) {
        const categoryEvents = layerEventsService.getEventsByLayers([selectedCategoryEvents]);
        const sortedEvents = categoryEvents.sort((a, b) => a.year - b.year);
        
        if (sortedEvents.length > 0) {
          const bounds = new mapboxgl.LngLatBounds();
          sortedEvents.forEach(event => {
            bounds.extend(event.coordinates);
          });
          
          // Adjust padding based on panel states
          const leftPadding = isLeftPanelCollapsed ? 100 : 450;
          const rightPadding = isPanelCollapsed ? 100 : 350;
          map.current.fitBounds(bounds, {
            padding: { top: 100, bottom: 100, left: leftPadding, right: rightPadding },
            duration: 500,
            maxZoom: 5
          });
        }
      }
    }, 300); // Match CSS transition duration
  }, [isPanelCollapsed, isLeftPanelCollapsed, mapLoaded, selectedCategoryEvents]);

  // Display layer-specific historical events
  useEffect(() => {
    if (!map.current || !mapLoaded || selectedCategoryEvents) return; // Skip if category events are selected

    // Clear existing layer event markers
    layerEventMarkers.current.forEach(marker => marker.remove());
    layerEventMarkers.current = [];

    // Get active layers (excluding community which has its own handler)
    const activeLayers = dataLayers
      .filter(layer => layer.isActive && layer.id !== 'community')
      .map(layer => layer.id);

    if (activeLayers.length === 0) {
      // Remove layer event ripples if no layers active
      setRippleEvents(prev => prev.filter(e => !e.id.startsWith('layer-event-')));
      return;
    }

    // Get events for active layers within current year range
    const events = layerEventsService.getEventsByLayers(activeLayers);
    
    // Filter events by current year (show events within 50 years of current year for visibility)
    const yearRange = 50;
    const visibleEvents = events.filter(event => 
      Math.abs(event.year - currentYear) <= yearRange
    );

    // Create markers for each visible event
    visibleEvents.forEach(event => {
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'layer-event-marker';
      
      const layerColor = layerEventsService.getLayerColor(event.layerType);
      
      // Style based on magnitude and proximity to current year
      const yearDiff = Math.abs(event.year - currentYear);
      const opacity = Math.max(0.4, 1 - (yearDiff / yearRange) * 0.5);
      const size = 20 + (event.magnitude * 3);
      
      el.style.cssText = `
        width: 8px;
        height: 8px;
        background: ${layerColor};
        border: 1px solid white;
        border-radius: 50%;
        cursor: pointer;
        opacity: ${opacity};
      `;

      // Create detailed popup
      const popup = new mapboxgl.Popup({
        offset: 25,
        closeButton: true,
        closeOnClick: false,
        maxWidth: '400px',
        className: 'layer-event-popup'
      })
      .setHTML(`
        <div style="
          padding: 16px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="
            display: flex;
            align-items: center;
            margin-bottom: 12px;
          ">
            <span style="
              background: ${layerColor};
              color: white;
              padding: 4px 10px;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 600;
              text-transform: uppercase;
              margin-right: 10px;
            ">${event.layerType}</span>
            <span style="
              background: ${event.magnitude >= 9 ? '#EF4444' : event.magnitude >= 7 ? '#F59E0B' : '#10B981'};
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 11px;
              font-weight: 500;
            ">Impact: ${event.magnitude}/10</span>
          </div>
          
          <h3 style="
            margin: 0 0 8px 0;
            font-size: 20px;
            font-weight: 700;
            color: #111827;
            line-height: 1.2;
          ">${event.icon} ${event.title}</h3>
          
          <div style="
            font-size: 14px;
            color: #6B7280;
            margin-bottom: 12px;
          ">
            <strong>${event.date}</strong> • Year ${event.year}
          </div>
          
          <p style="
            margin: 0 0 16px 0;
            font-size: 14px;
            color: #374151;
            line-height: 1.5;
          ">${event.description}</p>
          
          <div style="
            border-top: 1px solid #E5E7EB;
            padding-top: 12px;
            margin-bottom: 12px;
          ">
            <h4 style="
              margin: 0 0 8px 0;
              font-size: 13px;
              font-weight: 600;
              color: #111827;
            ">Ripple Effects:</h4>
            <ul style="
              margin: 0;
              padding: 0;
              list-style: none;
            ">
              ${event.rippleEffects.slice(0, 3).map(effect => `
                <li style="
                  font-size: 12px;
                  color: #6B7280;
                  padding: 4px 0;
                  padding-left: 16px;
                  position: relative;
                ">
                  <span style="
                    position: absolute;
                    left: 0;
                    top: 8px;
                    width: 4px;
                    height: 4px;
                    background: ${layerColor};
                    border-radius: 50%;
                  "></span>
                  ${effect}
                </li>
              `).join('')}
            </ul>
            ${event.rippleEffects.length > 3 ? `
              <p style="
                font-size: 11px;
                color: #9CA3AF;
                margin: 8px 0 0 0;
                font-style: italic;
              ">+${event.rippleEffects.length - 3} more effects...</p>
            ` : ''}
          </div>
          
          <div style="
            display: flex;
            align-items: center;
            justify-content: space-between;
            font-size: 11px;
            color: #9CA3AF;
          ">
            <span>📍 ${event.coordinates[1].toFixed(2)}°, ${event.coordinates[0].toFixed(2)}°</span>
            <span style="
              background: #F3F4F6;
              padding: 2px 6px;
              border-radius: 3px;
            ">${event.year < 0 ? Math.abs(event.year) + ' BCE' : event.year + ' CE'}</span>
          </div>
        </div>
      `);

      // Create marker
      const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
        .setLngLat(event.coordinates)
        .setPopup(popup)
        .addTo(map.current!);

      layerEventMarkers.current.push(marker);

      // Add ripple effect for significant events
      if (event.year === currentYear || (Math.abs(event.year - currentYear) <= 5 && event.magnitude >= 8)) {
        setRippleEvents(prev => {
          const filtered = prev.filter(e => !e.id.startsWith(`layer-event-${event.id}`));
          return [...filtered, {
            id: `layer-event-${event.id}`,
            coordinates: event.coordinates,
            type: event.layerType as any,
            magnitude: event.magnitude / 2,
            timestamp: Date.now(),
            duration: 5000
          }];
        });
      }
    });
  }, [dataLayers, mapLoaded, currentYear]);

  // Display event markers for current year
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Clear existing year markers
    if (yearMarkers.current) {
      yearMarkers.current.forEach(marker => marker.remove());
      yearMarkers.current = [];
    }

    // Get events for current year
    const currentYearEvents = getEventsForYear(currentYear);
    const nearbyEvents = getNearestEvents(currentYear, 10);
    
    // Combine and deduplicate
    const eventsToShow = [...currentYearEvents];
    nearbyEvents.forEach(event => {
      if (!eventsToShow.find(e => e.year === event.year && e.label === event.label)) {
        eventsToShow.push(event);
      }
    });

    // Create markers for each event with coordinates
    eventsToShow.forEach(event => {
      if (event.coordinates) {
        // Create custom marker element
        const el = document.createElement('div');
        el.className = 'timeline-event-marker';
        const isCurrentYear = event.year === currentYear;
        const baseSize = isCurrentYear ? 20 : 12;
        
        // Simple styles without any transforms or position changes
        el.style.cssText = `
          width: ${baseSize}px;
          height: ${baseSize}px;
          background: ${event.color};
          border: 2px solid white;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
        `;
        
        // Simple hover effect - only change colors/shadows, no size/position changes
        el.addEventListener('mouseenter', () => {
          el.style.boxShadow = '0 4px 16px rgba(0,0,0,0.6)';
          el.style.borderColor = '#f0f0f0';
          // Slightly brighten the background
          el.style.filter = 'brightness(1.2)';
        });
        
        el.addEventListener('mouseleave', () => {
          el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
          el.style.borderColor = 'white';
          el.style.filter = 'brightness(1)';
        });

        // Create marker
        const marker = new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
      })
          .setLngLat(event.coordinates)
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div style="
                  padding: 12px;
                  max-width: 250px;
                ">
                  <div style="
                    font-size: 11px;
                    color: ${event.color};
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 4px;
                    font-weight: 600;
                  ">${event.type} • ${event.year}</div>
                  <div style="
                    font-size: 14px;
                    font-weight: 600;
                    margin-bottom: 6px;
                  ">${event.label}</div>
                  ${event.description ? `
                    <div style="
                      font-size: 12px;
                      color: #666;
                      line-height: 1.4;
                    ">${event.description}</div>
                  ` : ''}
                  ${event.location ? `
                    <div style="
                      font-size: 11px;
                      color: #999;
                      margin-top: 6px;
                      padding-top: 6px;
                      border-top: 1px solid #eee;
                    ">📍 ${event.location}</div>
                  ` : ''}
                </div>
              `)
          )
          .addTo(map.current);

        yearMarkers.current.push(marker);
      }
    });
  }, [currentYear, mapLoaded]);

  // Handle search result display
  useEffect(() => {
    console.log('MapInterface searchResult changed:', searchResult);
    console.log('Map loaded:', mapLoaded);
    console.log('Map current:', !!map.current);

    if (!map.current || !mapLoaded || !searchResult) {
      console.log('Exiting early - conditions not met');
      return;
    }

    console.log('Processing search result:', searchResult.type, searchResult.title);

    // Clear existing search markers and popups
    if (searchMarker.current) {
      searchMarker.current.remove();
      searchMarker.current = null;
    }
    currentPopups.current.forEach(popup => popup.remove());
    currentPopups.current = [];

    let coordinates: [number, number] | undefined;
    let popupContent = '';

    // Trigger ripple effect for events
    const triggerEventRipple = (coords: [number, number], type: RippleEvent['type'] = 'social') => {
      const ripple: RippleEvent = {
        id: `search-${Date.now()}`,
        coordinates: coords,
        type: type,
        magnitude: 5,
        timestamp: Date.now(),
        duration: 3000
      };
      setRippleEvents(prev => [...prev, ripple]);
    };

    if (searchResult.type === 'event' && searchResult.historicalEvent) {
      const event = searchResult.historicalEvent;

      // Try to get coordinates from the event's location
      const locationCoords = getCoordinatesForLocation(event.location);
      coordinates = locationCoords || searchResult.coordinates;

      if (coordinates) {
        popupContent = `
          <div style="
            background: white;
            color: black;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            max-width: 320px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 2px solid #3b82f6;
          ">
            <div style="
              font-size: 10px;
              color: #3b82f6;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
              font-weight: 600;
            ">SEARCH RESULT • ${event.category}</div>
            <div style="
              font-size: 16px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 8px;
              line-height: 1.3;
            ">${event.title}</div>
            <div style="
              font-size: 13px;
              color: #374151;
              line-height: 1.5;
              margin-bottom: 10px;
            ">${event.description}</div>
            <div style="
              font-size: 11px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span>📍 ${event.location}</span>
              <span style="font-weight: 600;">${event.year}</span>
            </div>
          </div>
        `;
      }
    } else if (searchResult.type === 'person' && searchResult.historicalPerson) {
      const person = searchResult.historicalPerson;
      coordinates = person.coordinates;

      if (coordinates) {
        popupContent = `
          <div style="
            background: white;
            color: black;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            max-width: 320px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 2px solid #f97316;
          ">
            <div style="
              font-size: 10px;
              color: #f97316;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
              font-weight: 600;
            ">HISTORICAL FIGURE • ${person.category}</div>
            <div style="
              font-size: 16px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 8px;
              line-height: 1.3;
            ">${person.name}</div>
            <div style="
              font-size: 13px;
              color: #374151;
              line-height: 1.5;
              margin-bottom: 10px;
            ">${person.description}</div>
            <div style="
              font-size: 12px;
              color: #6b7280;
              background: #f3f4f6;
              padding: 8px;
              border-radius: 4px;
              margin-bottom: 8px;
            ">${person.significance}</div>
            <div style="
              font-size: 11px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span>📍 ${person.location}</span>
              <span style="font-weight: 600;">${person.birthYear}${person.deathYear ? ` - ${person.deathYear}` : ''}</span>
            </div>
          </div>
        `;
      }
    } else if (searchResult.type === 'invention' && searchResult.invention) {
      const invention = searchResult.invention;
      coordinates = invention.location.coordinates;

      if (coordinates) {
        popupContent = `
          <div style="
            background: white;
            color: black;
            padding: 16px;
            border-radius: 8px;
            box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            max-width: 320px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            border: 2px solid #eab308;
          ">
            <div style="
              font-size: 10px;
              color: #eab308;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
              font-weight: 600;
            ">INVENTION • ${invention.category}</div>
            <div style="
              font-size: 16px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 8px;
              line-height: 1.3;
            ">${invention.name}</div>
            <div style="
              font-size: 13px;
              color: #374151;
              line-height: 1.5;
              margin-bottom: 10px;
            ">${invention.description.substring(0, 100)}...</div>
            <div style="
              font-size: 12px;
              color: #6b7280;
              background: #fef3c7;
              padding: 8px;
              border-radius: 4px;
              margin-bottom: 8px;
            ">👤 Inventor: ${invention.inventor}</div>
            <div style="
              font-size: 11px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            ">
              <span>📍 ${invention.location.name}</span>
              <span style="font-weight: 600;">${invention.year}</span>
            </div>
          </div>
        `;
      }
    } else if (searchResult.type === 'location' && searchResult.coordinates) {
      coordinates = searchResult.coordinates;

      popupContent = `
        <div style="
          background: white;
          color: black;
          padding: 16px;
          border-radius: 8px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.3);
          max-width: 280px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          border: 2px solid #10b981;
        ">
          <div style="
            font-size: 10px;
            color: #10b981;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-bottom: 8px;
            font-weight: 600;
          ">LOCATION</div>
          <div style="
            font-size: 18px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
          ">${searchResult.title}</div>
          <div style="
            font-size: 13px;
            color: #374151;
            line-height: 1.4;
          ">${searchResult.description}</div>
        </div>
      `;
    }

    console.log('Coordinates:', coordinates);
    console.log('Popup content length:', popupContent.length);

    if (coordinates && popupContent) {
      console.log('Creating marker and starting animation');
      // Create a custom marker element
      const markerEl = document.createElement('div');
      markerEl.className = 'search-marker';
      markerEl.style.cssText = `
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, #3b82f6, #8b5cf6);
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 4px 12px rgba(0,0,0,0.4);
        cursor: pointer;
        animation: pulse 2s infinite;
      `;

      // Add marker
      searchMarker.current = new mapboxgl.Marker({
        element: markerEl,
        anchor: 'bottom'
      })
        .setLngLat(coordinates)
        .addTo(map.current);

      // Trigger ripple effect based on search result type
      let rippleType: RippleEvent['type'] = 'social';
      if (searchResult.type === 'event') {
        // Determine event type from description
        const desc = searchResult.description.toLowerCase();
        if (desc.includes('war') || desc.includes('battle')) rippleType = 'war';
        else if (desc.includes('disease') || desc.includes('pandemic')) rippleType = 'pandemic';
        else if (desc.includes('invention') || desc.includes('innovation')) rippleType = 'invention';
        else if (desc.includes('economic') || desc.includes('market')) rippleType = 'economic';
        else if (desc.includes('disaster') || desc.includes('earthquake')) rippleType = 'disaster';
      } else if (searchResult.type === 'invention') {
        rippleType = 'invention';
      } else if (searchResult.type === 'person') {
        rippleType = 'social';
      }
      
      triggerEventRipple(coordinates, rippleType);

      // Create and show popup
      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: false,
        maxWidth: '340px',
        offset: 25
      })
        .setLngLat(coordinates)
        .setHTML(popupContent)
        .addTo(map.current);

      currentPopups.current = [popup];

      // Fly to the location with appropriate zoom level
      let zoomLevel = 5; // default
      if (searchResult.type === 'event') {
        zoomLevel = 8;
      } else if (searchResult.type === 'invention') {
        zoomLevel = 10; // Close zoom for inventions to see the city
      } else if (searchResult.type === 'person') {
        zoomLevel = 7;
      }

      const currentCenter = map.current.getCenter();
      const targetLng = coordinates[0];

      const spinDuration = 3000;
      const spinLng = currentCenter.lng + 360;

      console.log('Starting globe spin animation');
      console.log('Current center:', currentCenter);
      console.log('Target coordinates:', coordinates);

      map.current.easeTo({
        center: [spinLng, currentCenter.lat],
        zoom: 2,
        duration: spinDuration,
        easing: (t) => t
      });

      setTimeout(() => {
        console.log('Spin complete, flying to target');
        map.current?.flyTo({
          center: coordinates,
          zoom: zoomLevel,
          duration: 2000,
          essential: true
        });

        if (onSearchResultDisplayed) {
          setTimeout(() => {
            console.log('Calling onSearchResultDisplayed');
            onSearchResultDisplayed();
          }, 2500);
        }
      }, spinDuration);

    }
  }, [searchResult, mapLoaded]);

  // Helper function to get coordinates for a location name
  const getCoordinatesForLocation = (location: string): [number, number] | undefined => {
    const locationMap: Record<string, [number, number]> = {
      'Philadelphia, Pennsylvania': [-75.1652, 39.9526],
      'Charleston, South Carolina': [-79.9311, 32.7765],
      'Nationwide': [-98.5795, 39.8283],
      'New York City': [-74.0060, 40.7128],
      'Pearl Harbor, Hawaii': [-157.9403, 21.3629],
      'NASA Mission Control, Houston': [-95.3698, 29.7604],
      'New York City & Washington D.C.': [-77.0369, 38.9072],
      'London, England': [-0.1276, 51.5074],
      'Hastings, England': [0.5767, 50.8540],
      'London & Edinburgh': [-3.1883, 55.9533],
      'Southern England': [-1.2577, 51.4545],
      'United Kingdom': [-3.4359, 55.3781],
      'Wittenberg, Germany': [12.6475, 51.8661],
      'Versailles, France (German ceremony)': [2.1204, 48.8049],
      'Berlin, Germany': [13.4050, 52.5200],
      'Germany': [10.4515, 51.1657],
      'Coloma, California': [-120.8996, 38.7963],
      'San Francisco, California': [-122.4194, 37.7749],
      'Los Altos, California': [-122.1141, 37.3688],
      'California': [-119.4179, 36.7783],
      'Silicon Valley, California': [-122.0838, 37.3875],
      'Haight-Ashbury, San Francisco': [-122.4467, 37.7699],
      'Los Angeles, California': [-118.2437, 34.0522],
      'Hollywood, California': [-118.3287, 34.0928],
      'Detroit, Michigan': [-83.0458, 42.3314],
      'Manhattan, New York': [-73.9712, 40.7831],
      'New York Harbor': [-74.0431, 40.7069],
      'Wall Street, New York City': [-74.0088, 40.7074],
      'Lower Manhattan, New York City': [-74.0134, 40.7092]
    };

    return locationMap[location];
  };

  // Clean up popup and event handlers when component unmounts
  useEffect(() => {
    return () => {
      // Remove all event handlers
      eventHandlers.current.forEach((handlers, layerId) => {
        if (map.current) {
          map.current.off('mouseenter', layerId, handlers.mouseenter);
          map.current.off('mouseleave', layerId, handlers.mouseleave);
        }
      });
      eventHandlers.current.clear();

      // Remove all popups
      currentPopups.current.forEach(popup => popup.remove());
      currentPopups.current = [];

      // Remove search marker
      if (searchMarker.current) {
        searchMarker.current.remove();
      }

      // Remove year markers
      if (yearMarkers.current) {
        yearMarkers.current.forEach(marker => marker.remove());
        yearMarkers.current = [];
      }
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden">
      {/* Map container - always rendered to prevent flashing */}
      <div 
        ref={mapContainer} 
        className="absolute inset-0"
        style={{ 
          // Ensure the container is always visible
          visibility: 'visible',
          // Prevent any transitions that might cause flashing
          transition: 'none'
        }} 
      />
      
      {/* Ripple animations overlay - only render when map is loaded */}
      {mapLoaded && <RippleManager events={rippleEvents} map={map.current} />}

      {/* Event Detail Card - shows when a category is selected */}
      {selectedCategoryEvents && onClearCategoryEvents && (
        <EventDetailCard 
          categoryId={selectedCategoryEvents}
          onClose={onClearCategoryEvents}
          isCollapsed={isLeftPanelCollapsed}
          onToggleCollapse={onToggleLeftPanel}
          onEventClick={(event) => {
            // Focus on the clicked event
            if (map.current && event.coordinates) {
              map.current.flyTo({
                center: event.coordinates,
                zoom: 6,
                duration: 1500,
                essential: true
              });
            }
          }}
        />
      )}

      {dataLoading && (
        <div className="absolute top-20 left-6 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 z-10">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-white">Loading real data...</span>
          </div>
        </div>
      )}

      <div className="absolute top-6 left-6 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 z-10">
        <div className="text-2xl font-bold text-white">{currentYear}</div>
        <div className="text-sm text-gray-400">Current Timeline</div>
      </div>

      <div className="absolute top-6 right-6 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-700 z-10">
        <div className="text-lg font-semibold text-white">
          {dataLayers.filter(l => l.isActive).length}
        </div>
        <div className="text-sm text-gray-400">Active Layers</div>
        {realData.size > 0 && (
          <div className="text-xs text-green-400 mt-1">Real Data</div>
        )}
      </div>

      <div className="absolute bottom-20 right-6 bg-black/70 backdrop-blur-sm p-4 rounded-lg border border-gray-700 max-w-xs z-10">
        <h3 className="text-sm font-semibold text-white mb-2">Active Regions</h3>
        <div className="space-y-1">
          {dataLayers.filter(layer => layer.isActive).slice(0, 4).map(layer => {
            const boundaries = GEOGRAPHICAL_BOUNDARIES[layer.id as keyof typeof GEOGRAPHICAL_BOUNDARIES];
            const regionCount = boundaries ? Object.keys(boundaries).length : 0;
            
            return (
              <div key={layer.id} className="flex items-center justify-between text-xs">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: layer.color }}
                />
                <span className="text-gray-300">{layer.name}</span>
                <span className="text-gray-500">{regionCount} regions</span>
              </div>
            );
          })}
          {dataLayers.filter(layer => layer.isActive).length > 4 && (
            <div className="text-xs text-gray-500">
              +{dataLayers.filter(layer => layer.isActive).length - 4} more
            </div>
          )}
        </div>
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison to prevent unnecessary re-renders
  // Only re-render if specific props have actually changed
  return (
    prevProps.currentYear === nextProps.currentYear &&
    prevProps.dataLoading === nextProps.dataLoading &&
    prevProps.searchResult === nextProps.searchResult &&
    prevProps.selectedCategoryEvents === nextProps.selectedCategoryEvents &&
    prevProps.isPanelCollapsed === nextProps.isPanelCollapsed &&
    prevProps.isLeftPanelCollapsed === nextProps.isLeftPanelCollapsed &&
    JSON.stringify(prevProps.dataLayers) === JSON.stringify(nextProps.dataLayers) &&
    prevProps.realData === nextProps.realData
  );
});