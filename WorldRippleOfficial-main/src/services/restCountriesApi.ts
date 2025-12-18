/**
 * REST Countries API Service
 * FREE country information - no API key required!
 * Documentation: https://restcountries.com/
 */

export interface Country {
  name: {
    common: string;
    official: string;
    nativeName?: Record<string, { official: string; common: string }>;
  };
  cca2: string; // 2-letter country code
  cca3: string; // 3-letter country code
  capital?: string[];
  region: string;
  subregion?: string;
  languages?: Record<string, string>;
  latlng?: [number, number];
  area: number;
  population: number;
  gini?: Record<string, number>;
  timezones: string[];
  borders?: string[];
  currencies?: Record<string, { name: string; symbol: string }>;
  flags: {
    png: string;
    svg: string;
    alt?: string;
  };
  coatOfArms?: {
    png?: string;
    svg?: string;
  };
  maps: {
    googleMaps: string;
    openStreetMaps: string;
  };
  demonym?: {
    f: string;
    m: string;
  };
  independent: boolean;
  landlocked: boolean;
  unMember: boolean;
  startOfWeek: string;
  capitalInfo?: {
    latlng?: [number, number];
  };
}

export interface CountryBasic {
  name: string;
  code: string;
  flag: string;
  population: number;
  area: number;
  capital: string;
  region: string;
  coordinates?: [number, number];
}

export const restCountriesService = {
  /**
   * Base URL for REST Countries API
   */
  baseUrl: 'https://restcountries.com/v3.1',

  /**
   * Get all countries (basic info)
   */
  async getAllCountries(): Promise<CountryBasic[]> {
    try {
      const response = await fetch(`${this.baseUrl}/all?fields=name,cca2,flags,population,area,capital,region,latlng`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch countries');
      }

      const data: Country[] = await response.json();
      
      return data.map(country => ({
        name: country.name.common,
        code: country.cca2,
        flag: country.flags.svg,
        population: country.population,
        area: country.area,
        capital: country.capital?.[0] || 'N/A',
        region: country.region,
        coordinates: country.latlng ? [country.latlng[1], country.latlng[0]] : undefined
      }));
    } catch (error) {
      console.error('Error fetching all countries:', error);
      return [];
    }
  },

  /**
   * Get country by name
   */
  async getCountryByName(name: string): Promise<Country | null> {
    try {
      const response = await fetch(`${this.baseUrl}/name/${encodeURIComponent(name)}?fullText=false`);
      
      if (!response.ok) {
        throw new Error('Country not found');
      }

      const data: Country[] = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching country by name:', error);
      return null;
    }
  },

  /**
   * Get country by code (alpha-2 or alpha-3)
   */
  async getCountryByCode(code: string): Promise<Country | null> {
    try {
      const response = await fetch(`${this.baseUrl}/alpha/${code}`);
      
      if (!response.ok) {
        throw new Error('Country not found');
      }

      const data: Country[] = await response.json();
      return data.length > 0 ? data[0] : null;
    } catch (error) {
      console.error('Error fetching country by code:', error);
      return null;
    }
  },

  /**
   * Get countries by region
   */
  async getCountriesByRegion(region: string): Promise<CountryBasic[]> {
    try {
      const response = await fetch(`${this.baseUrl}/region/${encodeURIComponent(region)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch countries by region');
      }

      const data: Country[] = await response.json();
      
      return data.map(country => ({
        name: country.name.common,
        code: country.cca2,
        flag: country.flags.svg,
        population: country.population,
        area: country.area,
        capital: country.capital?.[0] || 'N/A',
        region: country.region,
        coordinates: country.latlng ? [country.latlng[1], country.latlng[0]] : undefined
      }));
    } catch (error) {
      console.error('Error fetching countries by region:', error);
      return [];
    }
  },

  /**
   * Get countries by language
   */
  async getCountriesByLanguage(language: string): Promise<CountryBasic[]> {
    try {
      const response = await fetch(`${this.baseUrl}/lang/${encodeURIComponent(language)}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch countries by language');
      }

      const data: Country[] = await response.json();
      
      return data.map(country => ({
        name: country.name.common,
        code: country.cca2,
        flag: country.flags.svg,
        population: country.population,
        area: country.area,
        capital: country.capital?.[0] || 'N/A',
        region: country.region,
        coordinates: country.latlng ? [country.latlng[1], country.latlng[0]] : undefined
      }));
    } catch (error) {
      console.error('Error fetching countries by language:', error);
      return [];
    }
  },

  /**
   * Get neighboring countries
   */
  async getNeighboringCountries(countryCode: string): Promise<CountryBasic[]> {
    try {
      const country = await this.getCountryByCode(countryCode);
      
      if (!country || !country.borders || country.borders.length === 0) {
        return [];
      }

      const borderCodes = country.borders.join(',');
      const response = await fetch(`${this.baseUrl}/alpha?codes=${borderCodes}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch neighboring countries');
      }

      const data: Country[] = await response.json();
      
      return data.map(country => ({
        name: country.name.common,
        code: country.cca2,
        flag: country.flags.svg,
        population: country.population,
        area: country.area,
        capital: country.capital?.[0] || 'N/A',
        region: country.region,
        coordinates: country.latlng ? [country.latlng[1], country.latlng[0]] : undefined
      }));
    } catch (error) {
      console.error('Error fetching neighboring countries:', error);
      return [];
    }
  },

  /**
   * Search countries by query
   */
  async searchCountries(query: string): Promise<CountryBasic[]> {
    if (!query || query.length < 2) {
      return [];
    }

    try {
      // Try searching by name first
      let response = await fetch(`${this.baseUrl}/name/${encodeURIComponent(query)}`);
      
      if (!response.ok) {
        // If name search fails, try by capital
        response = await fetch(`${this.baseUrl}/capital/${encodeURIComponent(query)}`);
      }

      if (!response.ok) {
        return [];
      }

      const data: Country[] = await response.json();
      
      return data.map(country => ({
        name: country.name.common,
        code: country.cca2,
        flag: country.flags.svg,
        population: country.population,
        area: country.area,
        capital: country.capital?.[0] || 'N/A',
        region: country.region,
        coordinates: country.latlng ? [country.latlng[1], country.latlng[0]] : undefined
      }));
    } catch (error) {
      console.error('Error searching countries:', error);
      return [];
    }
  },

  /**
   * Get country statistics
   */
  async getCountryStats(countryCode: string): Promise<any> {
    try {
      const country = await this.getCountryByCode(countryCode);
      
      if (!country) {
        return null;
      }

      return {
        name: country.name.common,
        officialName: country.name.official,
        population: country.population,
        populationDensity: country.area > 0 ? country.population / country.area : 0,
        area: country.area,
        capital: country.capital?.[0] || 'N/A',
        languages: country.languages ? Object.values(country.languages) : [],
        currencies: country.currencies ? Object.values(country.currencies).map(c => c.name) : [],
        timezones: country.timezones,
        borders: country.borders?.length || 0,
        landlocked: country.landlocked,
        unMember: country.unMember,
        giniIndex: country.gini ? Object.values(country.gini)[0] : null
      };
    } catch (error) {
      console.error('Error fetching country statistics:', error);
      return null;
    }
  },

  /**
   * Get countries by population range
   */
  async getCountriesByPopulation(minPopulation: number, maxPopulation?: number): Promise<CountryBasic[]> {
    try {
      const allCountries = await this.getAllCountries();
      
      return allCountries.filter(country => {
        if (maxPopulation) {
          return country.population >= minPopulation && country.population <= maxPopulation;
        }
        return country.population >= minPopulation;
      }).sort((a, b) => b.population - a.population);
    } catch (error) {
      console.error('Error fetching countries by population:', error);
      return [];
    }
  },

  /**
   * Get countries by area range
   */
  async getCountriesByArea(minArea: number, maxArea?: number): Promise<CountryBasic[]> {
    try {
      const allCountries = await this.getAllCountries();
      
      return allCountries.filter(country => {
        if (maxArea) {
          return country.area >= minArea && country.area <= maxArea;
        }
        return country.area >= minArea;
      }).sort((a, b) => b.area - a.area);
    } catch (error) {
      console.error('Error fetching countries by area:', error);
      return [];
    }
  },

  /**
   * Get country flag URL
   */
  getCountryFlagUrl(countryCode: string, format: 'svg' | 'png' = 'svg'): string {
    return `https://flagcdn.com/${format === 'png' ? 'w320' : ''}/${countryCode.toLowerCase()}.${format}`;
  },

  /**
   * Format population number
   */
  formatPopulation(population: number): string {
    if (population >= 1000000000) {
      return `${(population / 1000000000).toFixed(2)}B`;
    } else if (population >= 1000000) {
      return `${(population / 1000000).toFixed(2)}M`;
    } else if (population >= 1000) {
      return `${(population / 1000).toFixed(2)}K`;
    }
    return population.toString();
  },

  /**
   * Format area in km²
   */
  formatArea(area: number): string {
    return new Intl.NumberFormat('en-US').format(area) + ' km²';
  }
};

export default restCountriesService;