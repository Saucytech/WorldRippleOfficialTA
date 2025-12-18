/**
 * OpenStreetMap Nominatim API Service
 * FREE geocoding service - no API key required!
 * Documentation: https://nominatim.org/release-docs/latest/
 * 
 * IMPORTANT: Must include User-Agent header and respect rate limits (1 request/second)
 */

export interface NominatimPlace {
  place_id: number;
  osm_id: number;
  osm_type: string;
  lat: string;
  lon: string;
  display_name: string;
  name?: string;
  class: string;
  type: string;
  importance: number;
  address?: {
    house_number?: string;
    road?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
  boundingbox?: [string, string, string, string];
  geojson?: any;
  extratags?: Record<string, string>;
}

export interface SearchOptions {
  limit?: number;
  addressdetails?: boolean;
  extratags?: boolean;
  namedetails?: boolean;
  viewbox?: [number, number, number, number];
  bounded?: boolean;
  polygon_geojson?: boolean;
  polygon_text?: boolean;
  polygon_kml?: boolean;
  polygon_svg?: boolean;
  countrycodes?: string[];
  exclude_place_ids?: number[];
  format?: 'json' | 'jsonv2' | 'geojson' | 'geocodejson';
}

export interface ReverseGeocodeOptions {
  addressdetails?: boolean;
  extratags?: boolean;
  namedetails?: boolean;
  zoom?: number; // 0-18, higher = more detailed
  format?: 'json' | 'jsonv2' | 'geojson' | 'geocodejson';
}

// Rate limiter to respect Nominatim's 1 request/second limit
class RateLimiter {
  private lastRequestTime: number = 0;
  private minDelay: number = 1000; // 1 second

  async throttle(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minDelay) {
      await new Promise(resolve => setTimeout(resolve, this.minDelay - timeSinceLastRequest));
    }
    
    this.lastRequestTime = Date.now();
  }
}

export const nominatimService = {
  /**
   * Base URL for Nominatim API
   */
  baseUrl: 'https://nominatim.openstreetmap.org',

  /**
   * Rate limiter instance
   */
  rateLimiter: new RateLimiter(),

  /**
   * User agent for API requests (required by Nominatim)
   */
  userAgent: 'WorldRipple/1.0 (https://worldripple.com)',

  /**
   * Search for locations by query
   */
  async search(query: string, options: SearchOptions = {}): Promise<NominatimPlace[]> {
    try {
      await this.rateLimiter.throttle();

      const params = new URLSearchParams({
        q: query,
        format: options.format || 'json',
        limit: (options.limit || 5).toString(),
        addressdetails: (options.addressdetails !== false ? 1 : 0).toString(),
        extratags: (options.extratags ? 1 : 0).toString(),
        namedetails: (options.namedetails ? 1 : 0).toString(),
      });

      if (options.viewbox) {
        params.append('viewbox', options.viewbox.join(','));
      }
      
      if (options.bounded) {
        params.append('bounded', '1');
      }
      
      if (options.polygon_geojson) {
        params.append('polygon_geojson', '1');
      }
      
      if (options.countrycodes) {
        params.append('countrycodes', options.countrycodes.join(','));
      }

      const response = await fetch(`${this.baseUrl}/search?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to search locations');
      }

      const data = await response.json();
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error('Error searching locations:', error);
      return [];
    }
  },

  /**
   * Reverse geocode coordinates to address
   */
  async reverse(lat: number, lon: number, options: ReverseGeocodeOptions = {}): Promise<NominatimPlace | null> {
    try {
      await this.rateLimiter.throttle();

      const params = new URLSearchParams({
        lat: lat.toString(),
        lon: lon.toString(),
        format: options.format || 'json',
        addressdetails: (options.addressdetails !== false ? 1 : 0).toString(),
        extratags: (options.extratags ? 1 : 0).toString(),
        namedetails: (options.namedetails ? 1 : 0).toString(),
        zoom: (options.zoom || 18).toString()
      });

      const response = await fetch(`${this.baseUrl}/reverse?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to reverse geocode');
      }

      const data = await response.json();
      return data.error ? null : data;
    } catch (error) {
      console.error('Error reverse geocoding:', error);
      return null;
    }
  },

  /**
   * Get details for a specific place
   */
  async getPlaceDetails(placeId: number): Promise<NominatimPlace | null> {
    try {
      await this.rateLimiter.throttle();

      const params = new URLSearchParams({
        place_id: placeId.toString(),
        format: 'json',
        addressdetails: '1',
        extratags: '1',
        namedetails: '1'
      });

      const response = await fetch(`${this.baseUrl}/details?${params}`, {
        headers: {
          'User-Agent': this.userAgent,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get place details');
      }

      const data = await response.json();
      return data.error ? null : data;
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  },

  /**
   * Search for specific types of places
   */
  async searchByType(type: string, nearLat?: number, nearLon?: number, radius?: number): Promise<NominatimPlace[]> {
    try {
      let query = `[${type}]`;
      const options: SearchOptions = {
        limit: 20,
        addressdetails: true
      };

      // If coordinates provided, search within bounding box
      if (nearLat && nearLon && radius) {
        const kmToDegrees = radius / 111; // Rough conversion
        options.viewbox = [
          nearLon - kmToDegrees,
          nearLat - kmToDegrees,
          nearLon + kmToDegrees,
          nearLat + kmToDegrees
        ];
        options.bounded = true;
      }

      return await this.search(query, options);
    } catch (error) {
      console.error('Error searching by type:', error);
      return [];
    }
  },

  /**
   * Search for cities
   */
  async searchCities(query: string, country?: string): Promise<NominatimPlace[]> {
    const searchQuery = `${query} city`;
    const options: SearchOptions = {
      limit: 10,
      addressdetails: true
    };

    if (country) {
      options.countrycodes = [country.toLowerCase()];
    }

    const results = await this.search(searchQuery, options);
    
    // Filter to only return actual cities
    return results.filter(place => 
      place.class === 'place' && 
      ['city', 'town', 'village'].includes(place.type)
    );
  },

  /**
   * Search for countries
   */
  async searchCountries(query: string): Promise<NominatimPlace[]> {
    const results = await this.search(query, {
      limit: 10,
      addressdetails: true
    });
    
    // Filter to only return countries
    return results.filter(place => 
      place.class === 'boundary' && 
      place.type === 'administrative' &&
      place.address?.country
    );
  },

  /**
   * Get country boundaries
   */
  async getCountryBoundaries(countryCode: string): Promise<any> {
    try {
      const results = await this.search(countryCode, {
        limit: 1,
        polygon_geojson: true,
        addressdetails: true
      });

      if (results.length > 0 && results[0].geojson) {
        return results[0].geojson;
      }
      
      return null;
    } catch (error) {
      console.error('Error fetching country boundaries:', error);
      return null;
    }
  },

  /**
   * Convert place to simplified location object
   */
  placeToLocation(place: NominatimPlace): {
    name: string;
    coordinates: [number, number];
    address: string;
    type: string;
    country?: string;
  } {
    return {
      name: place.name || place.display_name.split(',')[0],
      coordinates: [parseFloat(place.lon), parseFloat(place.lat)],
      address: place.display_name,
      type: place.type,
      country: place.address?.country
    };
  },

  /**
   * Batch geocode multiple addresses (with rate limiting)
   */
  async batchGeocode(addresses: string[]): Promise<Array<{ address: string; location: NominatimPlace | null }>> {
    const results = [];
    
    for (const address of addresses) {
      const searchResults = await this.search(address, { limit: 1 });
      results.push({
        address,
        location: searchResults.length > 0 ? searchResults[0] : null
      });
    }
    
    return results;
  },

  /**
   * Get location suggestions for autocomplete
   */
  async getAutocompleteSuggestions(query: string, maxResults: number = 5): Promise<Array<{
    label: string;
    value: string;
    coordinates: [number, number];
  }>> {
    if (query.length < 3) {
      return [];
    }

    const results = await this.search(query, {
      limit: maxResults,
      addressdetails: true
    });

    return results.map(place => ({
      label: place.display_name,
      value: place.display_name.split(',')[0],
      coordinates: [parseFloat(place.lon), parseFloat(place.lat)]
    }));
  }
};

export default nominatimService;