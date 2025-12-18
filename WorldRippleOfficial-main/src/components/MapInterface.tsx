import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { historyService, HistoricalEvent } from '../services/historyApi';
import { DataLayer } from '../App';
import { LayerDataPoint } from '../hooks/useDataCommons';
import { ACCURATE_BOUNDARIES } from '../utils/countryBoundaries';
import { Invention } from '../services/inventionsApi';

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

export const MapInterface: React.FC<MapInterfaceProps> = ({
  dataLayers,
  currentYear,
  realData,
  dataLoading,
  searchResult,
  onSearchResultDisplayed
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [layersAdded, setLayersAdded] = useState<Set<string>>(new Set());
  const currentPopups = useRef<mapboxgl.Popup[]>([]);
  const searchMarker = useRef<mapboxgl.Marker | null>(null);
  const eventHandlers = useRef<Map<string, any>>(new Map());

  // Initialize Mapbox
  useEffect(() => {
    if (map.current) return;
    
    mapboxgl.accessToken = 'pk.eyJ1IjoidG9iaWVhbmRyZXdzIiwiYSI6ImNtZXQwN25vMjA4cTIyam16bGY4N3M0ZWIifQ.EjIqGhcMH_u432HEiu0NIw';

    if (mapContainer.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [0, 20],
        zoom: 1.5,
        attributionControl: false,
        logoPosition: 'bottom-right'
      });

      map.current.on('load', () => {
        setMapLoaded(true);
      });

      map.current.dragRotate.disable();
      map.current.touchZoomRotate.disableRotation();
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Clean up layers when they become inactive
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const activeLayers = dataLayers.filter(layer => layer.isActive);
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
  }, [dataLayers, mapLoaded]);

  // Add/update active layers with real geographical boundaries
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const activeLayers = dataLayers.filter(layer => layer.isActive);
    
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
  }, [dataLayers, mapLoaded, currentYear, realData]);

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
      searchMarker.current = new mapboxgl.Marker(markerEl)
        .setLngLat(coordinates)
        .addTo(map.current);

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
    };
  }, []);

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div ref={mapContainer} className="absolute inset-0" />

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
};