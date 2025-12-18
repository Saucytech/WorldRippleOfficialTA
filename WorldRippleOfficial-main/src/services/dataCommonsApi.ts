// Data Commons API integration for WorldRipple
const API_KEY = "CDrI2fUCFtjXCD7BS4AbpIUCl9DHh3vgAqDF6oiKU9i2Uwqd";
const BASE_URL = "https://api.datacommons.org/v1";

export interface DataCommonsObservation {
  date: string;
  value: number;
}

export interface DataCommonsResponse {
  observations: DataCommonsObservation[];
  facet?: {
    unit?: string;
    measurementMethod?: string;
    scalingFactor?: number;
  };
}

export interface EntityVariable {
  entity: string;
  variable: string;
  name: string;
  description: string;
}

// Data mappings for WorldRipple layers
export const DATA_LAYER_MAPPINGS = {
  disease: [
    {
      entity: "country/USA",
      variable: "Count_MedicalConditionIncident_COVID_19_ConfirmedCase",
      name: "COVID-19 Cases (USA)",
      description: "Confirmed COVID-19 cases in the United States"
    },
    {
      entity: "country/GBR", 
      variable: "Count_MedicalConditionIncident_COVID_19_ConfirmedCase",
      name: "COVID-19 Cases (UK)",
      description: "Confirmed COVID-19 cases in the United Kingdom"
    },
    {
      entity: "country/DEU",
      variable: "Count_MedicalConditionIncident_COVID_19_ConfirmedCase", 
      name: "COVID-19 Cases (Germany)",
      description: "Confirmed COVID-19 cases in Germany"
    }
  ],
  housing: [
    {
      entity: "country/USA",
      variable: "Median_Price_SoldPropertyUnit_ResidentialProperty",
      name: "US Housing Prices",
      description: "Median residential property prices in the United States"
    },
    {
      entity: "geoId/06", // California
      variable: "Median_Price_SoldPropertyUnit_ResidentialProperty",
      name: "California Housing Prices", 
      description: "Median residential property prices in California"
    },
    {
      entity: "geoId/36", // New York
      variable: "Median_Price_SoldPropertyUnit_ResidentialProperty",
      name: "New York Housing Prices",
      description: "Median residential property prices in New York"
    }
  ],
  environment: [
    {
      entity: "country/USA",
      variable: "Annual_Emissions_CarbonDioxide",
      name: "US CO2 Emissions",
      description: "Annual carbon dioxide emissions in the United States"
    },
    {
      entity: "Earth",
      variable: "Mean_Temperature",
      name: "Global Temperature",
      description: "Global mean temperature"
    },
    {
      entity: "country/USA",
      variable: "Area_Forest",
      name: "US Forest Area",
      description: "Forest area in the United States"
    }
  ],
  politics: [
    {
      entity: "country/USA",
      variable: "Count_Person_Voter",
      name: "US Registered Voters",
      description: "Number of registered voters in the United States"
    },
    {
      entity: "country/USA",
      variable: "Amount_EconomicActivity_ExpenditureActivity_Government_Federal",
      name: "Federal Government Spending",
      description: "Federal government expenditure in the United States"
    }
  ],
  economy: [
    {
      entity: "country/USA",
      variable: "Amount_EconomicActivity_GrossDomesticProduction_Nominal",
      name: "US GDP",
      description: "Gross Domestic Product of the United States"
    },
    {
      entity: "country/USA",
      variable: "UnemploymentRate_Person",
      name: "US Unemployment Rate",
      description: "Unemployment rate in the United States"
    },
    {
      entity: "country/USA",
      variable: "Amount_EconomicActivity_ExpenditureActivity_Government_Federal",
      name: "Federal Spending",
      description: "Federal government spending in the United States"
    }
  ],
  social: [
    {
      entity: "country/USA",
      variable: "Count_Person",
      name: "US Population",
      description: "Total population of the United States"
    },
    {
      entity: "country/USA",
      variable: "Count_Person_EducationalAttainmentBachelorsDegreeOrHigher",
      name: "College Education",
      description: "Population with bachelor's degree or higher"
    },
    {
      entity: "country/USA",
      variable: "Median_Income_Household",
      name: "Median Household Income",
      description: "Median household income in the United States"
    }
  ]
};

export class DataCommonsService {
  private cache = new Map<string, DataCommonsResponse>();

  async fetchSeries(entity: string, variable: string): Promise<DataCommonsResponse> {
    const cacheKey = `${entity}:${variable}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey)!;
    }

    try {
      const url = `${BASE_URL}/observations/series/${encodeURIComponent(entity)}/${encodeURIComponent(variable)}?key=${API_KEY}`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: DataCommonsResponse = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, data);
      
      return data;
    } catch (error) {
      console.error(`Error fetching data for ${entity}/${variable}:`, error);
      // Return empty data on error
      return { observations: [] };
    }
  }

  async fetchMultipleSeries(entityVariables: EntityVariable[]): Promise<Map<string, DataCommonsResponse>> {
    const results = new Map<string, DataCommonsResponse>();
    
    // Fetch all series in parallel
    const promises = entityVariables.map(async (ev) => {
      const data = await this.fetchSeries(ev.entity, ev.variable);
      results.set(`${ev.entity}:${ev.variable}`, data);
    });

    await Promise.all(promises);
    return results;
  }

  async getLayerData(layerId: string): Promise<Map<string, DataCommonsResponse>> {
    const entityVariables = DATA_LAYER_MAPPINGS[layerId as keyof typeof DATA_LAYER_MAPPINGS];
    if (!entityVariables) {
      return new Map();
    }

    return this.fetchMultipleSeries(entityVariables);
  }

  // Helper method to get data for a specific year
  getValueForYear(observations: DataCommonsObservation[], year: number): number | null {
    // Find the observation closest to the target year
    const yearStr = year.toString();
    
    // First try exact match
    const exactMatch = observations.find(obs => obs.date === yearStr);
    if (exactMatch) {
      return exactMatch.value;
    }

    // If no exact match, find the closest year
    const sortedObs = observations
      .map(obs => ({
        ...obs,
        yearNum: parseInt(obs.date)
      }))
      .filter(obs => !isNaN(obs.yearNum))
      .sort((a, b) => Math.abs(a.yearNum - year) - Math.abs(b.yearNum - year));

    return sortedObs.length > 0 ? sortedObs[0].value : null;
  }

  // Helper method to normalize values for visualization
  normalizeValue(value: number, min: number, max: number): number {
    if (max === min) return 0.5;
    return Math.max(0, Math.min(1, (value - min) / (max - min)));
  }
}

export const dataCommonsService = new DataCommonsService();