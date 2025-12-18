import fetchFromDataGov from '../api/dataGovClient';

export interface DataGovSearchResult {
  id: string;
  title: string;
  description: string;
  type: 'dataset' | 'event' | 'location';
  metadata?: any;
  modified?: string;
  publisher?: string;
  tags?: string[];
  spatial?: string;
  temporal?: string;
  downloadURL?: string;
  accessURL?: string;
  coordinates?: [number, number];
  source?: string;
}

export const dataGovService = {
  async searchDatasets(query: string, limit: number = 100): Promise<DataGovSearchResult[]> {
    try {
      const response = await fetchFromDataGov('ed/collegescorecard/v1/schools.json', {
        'api_key': '1UpJUbm5eTvTLjjQ57w3yeSwydNJnejf3DDmLEFn',
        '_fields': 'id,school.name,school.city,school.state,location',
        'school.name': query,
        '_per_page': limit
      });

      if (response.results && Array.isArray(response.results)) {
        return response.results.map((item: any, index: number) => ({
          id: `datagov-${item.id || index}`,
          title: item['school.name'] || 'Untitled',
          description: `${item['school.city']}, ${item['school.state']}`,
          type: 'location' as const,
          metadata: item,
          publisher: 'Data.gov',
          spatial: item.location ? `${item.location.lat}, ${item.location.lon}` : undefined
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching data.gov:', error);
      return [];
    }
  },

  async searchCatalog(query: string, limit: number = 100): Promise<DataGovSearchResult[]> {
    try {
      const response = await fetchFromDataGov('catalog/v1', {
        q: query,
        rows: limit,
        sort: 'score desc, modified desc'
      });

      if (response.results && Array.isArray(response.results)) {
        return response.results.map((item: any) => {
          const coordinates = this.extractCoordinates(item);

          return {
            id: `datagov-catalog-${item.identifier || item.title}`,
            title: item.title || 'Untitled Dataset',
            description: item.description || 'No description available',
            type: this.determineType(item),
            metadata: item,
            modified: item.modified,
            publisher: item.publisher?.name || item.organization || 'Unknown',
            tags: item.keyword || [],
            spatial: item.spatial,
            temporal: item.temporal,
            downloadURL: item.distribution?.[0]?.downloadURL,
            accessURL: item.distribution?.[0]?.accessURL,
            coordinates
          };
        });
      }

      return [];
    } catch (error) {
      console.error('Error searching data.gov catalog:', error);
      return [];
    }
  },

  extractCoordinates(item: any): [number, number] | undefined {
    if (item.spatial) {
      const coordMatch = item.spatial.match(/(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
      if (coordMatch) {
        return [parseFloat(coordMatch[2]), parseFloat(coordMatch[1])];
      }
    }
    return undefined;
  },

  determineType(item: any): 'dataset' | 'event' | 'location' {
    const title = (item.title || '').toLowerCase();
    const description = (item.description || '').toLowerCase();
    const keywords = (item.keyword || []).join(' ').toLowerCase();

    const text = `${title} ${description} ${keywords}`;

    if (text.includes('event') || text.includes('incident') || text.includes('occurrence')) {
      return 'event';
    }

    if (item.spatial || text.includes('location') || text.includes('geographic') || text.includes('map')) {
      return 'location';
    }

    return 'dataset';
  },

  async searchNPS(query: string, limit: number = 100): Promise<DataGovSearchResult[]> {
    try {
      console.log('[NPS] Searching for:', query);
      const response = await fetchFromDataGov('nps/v1/parks', {
        q: query,
        limit: limit.toString()
      });

      console.log('[NPS] Response:', response);

      if (response.data && Array.isArray(response.data)) {
        const results = response.data.map((park: any) => ({
          id: `datagov-nps-${park.parkCode}`,
          title: park.fullName || park.name,
          description: park.description?.substring(0, 150) || 'National Park Service location',
          type: 'location' as const,
          coordinates: park.latitude && park.longitude ?
            [parseFloat(park.longitude), parseFloat(park.latitude)] : undefined,
          metadata: park,
          publisher: 'National Park Service',
          tags: park.topics?.map((t: any) => t.name) || [],
          source: 'NPS API'
        }));
        console.log('[NPS] Returning', results.length, 'results');
        return results;
      }

      console.log('[NPS] No data in response');
      return [];
    } catch (error) {
      console.error('Error searching NPS:', error);
      return [];
    }
  },

  async searchFDA(query: string, limit: number = 100): Promise<DataGovSearchResult[]> {
    try {
      const response = await fetchFromDataGov('drug/enforcement.json', {
        search: `product_description:"${query}"`,
        limit: limit.toString()
      });

      if (response.results && Array.isArray(response.results)) {
        return response.results.map((item: any, index: number) => ({
          id: `datagov-fda-${item.recall_number || index}`,
          title: item.product_description || 'FDA Enforcement Action',
          description: `${item.reason_for_recall || 'Product recall'} - ${item.status || 'Status unknown'}`,
          type: 'event' as const,
          metadata: item,
          publisher: 'FDA',
          tags: [item.classification, item.product_type].filter(Boolean),
          source: 'FDA Enforcement API'
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching FDA:', error);
      return [];
    }
  },

  async searchUSGS(query: string): Promise<DataGovSearchResult[]> {
    try {
      const now = new Date();
      const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

      const response = await fetchFromDataGov('earthquakes/feed/v1.0/summary/all_month.geojson', {});

      if (response.features && Array.isArray(response.features)) {
        const filtered = response.features
          .filter((feature: any) => {
            const place = feature.properties?.place || '';
            return place.toLowerCase().includes(query.toLowerCase());
          })
          .slice(0, 5);

        return filtered.map((feature: any) => ({
          id: `datagov-usgs-${feature.id}`,
          title: `Earthquake: ${feature.properties.place}`,
          description: `Magnitude ${feature.properties.mag} - ${new Date(feature.properties.time).toLocaleDateString()}`,
          type: 'event' as const,
          coordinates: feature.geometry?.coordinates ?
            [feature.geometry.coordinates[0], feature.geometry.coordinates[1]] : undefined,
          metadata: feature,
          publisher: 'USGS',
          tags: ['earthquake', 'natural disaster'],
          source: 'USGS Earthquake API'
        }));
      }

      return [];
    } catch (error) {
      console.error('Error searching USGS:', error);
      return [];
    }
  },

  async searchAll(query: string, limit: number = 500): Promise<DataGovSearchResult[]> {
    const results = await Promise.allSettled([
      this.searchCatalog(query, limit),
      this.searchNPS(query, limit),
      this.searchFDA(query, limit),
      this.searchUSGS(query)
    ]);

    const allResults: DataGovSearchResult[] = [];

    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value) {
        allResults.push(...result.value);
      }
    });

    const uniqueResults = allResults.filter((result, index, self) =>
      index === self.findIndex(r => r.id === result.id)
    );

    return uniqueResults;
  }
};
