import { useState, useEffect } from 'react';
import { dataCommonsService, DataCommonsResponse } from '../services/dataCommonsApi';
import { censusService, CENSUS_VARIABLES } from '../services/censusApi';

export interface LayerDataPoint {
  id: string;
  entity: string;
  variable: string;
  name: string;
  description: string;
  data: DataCommonsResponse;
  currentValue: number | null;
  normalizedValue: number;
}

// Simplified data mappings with guaranteed structure
const LAYER_CONFIGS = {
  disease: {
    sources: [
      { entity: "country/USA", variable: "Count_MedicalConditionIncident_COVID_19_ConfirmedCase", name: "COVID-19 Cases (USA)" },
      { entity: "country/GBR", variable: "Count_MedicalConditionIncident_COVID_19_ConfirmedCase", name: "COVID-19 Cases (UK)" },
      { entity: "census-us", variable: "HEALTH_INSURANCE_COVERAGE", name: "US Health Insurance Coverage" },
      { entity: "census-California", variable: "HEALTH_INSURANCE_COVERAGE", name: "CA Health Insurance Coverage" },
      { entity: "census-New York", variable: "UNINSURED_POPULATION", name: "NY Uninsured Population" }
    ]
  },
  housing: {
    sources: [
      { entity: "census-us", variable: "MEDIAN_HOME_VALUE", name: "US Median Home Value" },
      { entity: "census-California", variable: "MEDIAN_HOME_VALUE", name: "California Median Home Value" },
      { entity: "census-New York", variable: "MEDIAN_HOME_VALUE", name: "New York Median Home Value" },
      { entity: "census-Texas", variable: "MEDIAN_HOME_VALUE", name: "Texas Median Home Value" },
      { entity: "census-Florida", variable: "MEDIAN_HOME_VALUE", name: "Florida Median Home Value" },
      { entity: "census-us", variable: "MEDIAN_RENT", name: "US Median Rent" },
      { entity: "census-California", variable: "MEDIAN_RENT", name: "California Median Rent" },
      { entity: "census-us", variable: "HOUSING_UNITS", name: "US Total Housing Units" },
      { entity: "census-us", variable: "HOMEOWNERSHIP_RATE", name: "US Homeownership Rate" },
      { entity: "census-us", variable: "HOUSEHOLD_SIZE", name: "US Median Household Size" }
    ]
  },
  environment: {
    sources: [
      { entity: "country/USA", variable: "Annual_Emissions_CarbonDioxide", name: "US CO2 Emissions" },
      { entity: "Earth", variable: "Mean_Temperature", name: "Global Temperature" }
    ]
  },
  politics: {
    sources: [
      { entity: "country/USA", variable: "Count_Person_Voter", name: "US Registered Voters" }
    ]
  },
  economy: {
    sources: [
      { entity: "country/USA", variable: "Amount_EconomicActivity_GrossDomesticProduction_Nominal", name: "US GDP" },
      { entity: "country/USA", variable: "UnemploymentRate_Person", name: "US Unemployment Rate" },
      { entity: "census-us", variable: "MEDIAN_HOUSEHOLD_INCOME", name: "US Median Household Income" },
      { entity: "census-California", variable: "MEDIAN_HOUSEHOLD_INCOME", name: "CA Median Household Income" },
      { entity: "census-New York", variable: "MEDIAN_HOUSEHOLD_INCOME", name: "NY Median Household Income" },
      { entity: "census-us", variable: "PER_CAPITA_INCOME", name: "US Per Capita Income" },
      { entity: "census-us", variable: "POVERTY_RATE", name: "US Poverty Rate" }
    ]
  },
  social: {
    sources: [
      { entity: "country/USA", variable: "Count_Person", name: "US Population" },
      { entity: "census-us", variable: "TOTAL_POPULATION", name: "US Census Population" },
      { entity: "census-California", variable: "TOTAL_POPULATION", name: "California Population" },
      { entity: "census-New York", variable: "TOTAL_POPULATION", name: "New York Population" },
      { entity: "census-Texas", variable: "TOTAL_POPULATION", name: "Texas Population" },
      { entity: "census-us", variable: "MEDIAN_AGE", name: "US Median Age" },
      { entity: "census-us", variable: "EDUCATIONAL_ATTAINMENT_BACHELORS", name: "US Bachelor's Degree Holders" }
    ]
  }
};

export function useMultiLayerData(activeLayers: string[], currentYear: number) {
  const [allLayerData, setAllLayerData] = useState<Map<string, LayerDataPoint[]>>(new Map());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      // Reset state
      setAllLayerData(new Map());
      setError(null);

      // Early return if no active layers
      if (!activeLayers || activeLayers.length === 0) {
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const layerDataMap = new Map<string, LayerDataPoint[]>();

        // Process each active layer sequentially to avoid race conditions
        for (const layerId of activeLayers) {
          const config = LAYER_CONFIGS[layerId as keyof typeof LAYER_CONFIGS];
          
          if (!config || !config.sources) {
            console.warn(`No configuration found for layer: ${layerId}`);
            continue;
          }

          const points: LayerDataPoint[] = [];
          const allValues: number[] = [];

          // Fetch data for each source in this layer
          for (let i = 0; i < config.sources.length; i++) {
            const source = config.sources[i];

            try {
              let currentValue: number | null = null;
              let data: any = null;

              // Check if this is a Census API source
              if (source.entity.startsWith('census-')) {
                // TEMPORARILY DISABLED: Census API requires Supabase configuration
                // Skipping Census data to avoid console spam
                continue;
                /*
                const stateName = source.entity.replace('census-', '');
                const variableCode = CENSUS_VARIABLES[source.variable as keyof typeof CENSUS_VARIABLES];
                console.log(`[Census] Fetching ${source.variable} for ${stateName}, year ${currentYear}`);

                if (variableCode) {
                  if (stateName === 'us') {
                    const censusData = await censusService.getNationalVariableData(variableCode, String(currentYear));
                    if (censusData) {
                      currentValue = censusData.value;
                      data = {
                        observations: [
                          { date: String(currentYear), value: censusData.value }
                        ]
                      };
                    }
                  } else {
                    const censusData = await censusService.getStateVariableData([stateName], variableCode, String(currentYear));
                    const stateData = censusData.get(stateName);
                    if (stateData) {
                      currentValue = stateData.value;
                      data = {
                        observations: [
                          { date: String(currentYear), value: stateData.value }
                        ]
                      };
                    }
                  }
                } else {
                  console.warn(`No Census variable code found for: ${source.variable}`);
                }
                */

                if (currentValue !== null && !isNaN(currentValue)) {
                  allValues.push(currentValue);
                }

                if (data) {
                  points.push({
                    id: `${layerId}-${i}`,
                    entity: source.entity,
                    variable: source.variable,
                    name: source.name,
                    description: `Census data for ${source.name}`,
                    data,
                    currentValue,
                    normalizedValue: 0
                  });
                }
              } else {
                // Use Data Commons for non-Census sources
                data = await dataCommonsService.fetchSeries(source.entity, source.variable);

                if (data && data.observations && data.observations.length > 0) {
                  currentValue = dataCommonsService.getValueForYear(data.observations, currentYear);

                  if (currentValue !== null && !isNaN(currentValue)) {
                    allValues.push(currentValue);
                  }

                  points.push({
                    id: `${layerId}-${i}`,
                    entity: source.entity,
                    variable: source.variable,
                    name: source.name,
                    description: `Data for ${source.name}`,
                    data,
                    currentValue,
                    normalizedValue: 0
                  });
                }
              }
            } catch (sourceError) {
              console.warn(`Failed to fetch data for ${source.name}:`, sourceError);
            }
          }

          // Normalize values for this layer
          if (allValues.length > 0) {
            const min = Math.min(...allValues);
            const max = Math.max(...allValues);
            
            points.forEach(point => {
              if (point.currentValue !== null && !isNaN(point.currentValue)) {
                point.normalizedValue = max === min ? 0.5 : 
                  Math.max(0, Math.min(1, (point.currentValue - min) / (max - min)));
              }
            });
          }

          if (points.length > 0) {
            layerDataMap.set(layerId, points);
          }
        }

        setAllLayerData(layerDataMap);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        console.error('Error in fetchAllData:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [activeLayers.join(','), currentYear]);

  return { allLayerData, loading, error };
}