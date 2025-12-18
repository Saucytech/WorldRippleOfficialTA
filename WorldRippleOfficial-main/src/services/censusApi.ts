import fetchFromDataGov from '../api/dataGovClient';

export interface CensusDataPoint {
  name: string;
  state: string;
  value: number;
  year: string;
}

export interface CensusResponse {
  data: CensusDataPoint[];
  metadata: {
    variable: string;
    description: string;
    source: string;
  };
}

export const CENSUS_VARIABLES = {
  MEDIAN_HOME_VALUE: 'B25077_001E',
  MEDIAN_RENT: 'B25064_001E',
  HOUSING_UNITS: 'B25001_001E',
  OCCUPIED_UNITS: 'B25002_002E',
  VACANT_UNITS: 'B25002_003E',
  OWNER_OCCUPIED: 'B25003_002E',
  RENTER_OCCUPIED: 'B25003_003E',
  MEDIAN_HOUSEHOLD_INCOME: 'B19013_001E',
  PER_CAPITA_INCOME: 'B19301_001E',
  POVERTY_RATE: 'B17001_002E',
  TOTAL_POPULATION: 'B01003_001E',
  POPULATION_DENSITY: 'B01003_001E',
  MEDIAN_AGE: 'B01002_001E',
  HEALTH_INSURANCE_COVERAGE: 'B27001_001E',
  UNINSURED_POPULATION: 'B27010_017E',
  EDUCATIONAL_ATTAINMENT_BACHELORS: 'B15003_022E',
  UNEMPLOYMENT_RATE: 'B23025_005E',
  LABOR_FORCE: 'B23025_002E',
  HOUSEHOLD_SIZE: 'B25010_001E',
  HOMEOWNERSHIP_RATE: 'B25003_002E'
};

const STATE_FIPS_CODES: Record<string, string> = {
  'California': '06',
  'New York': '36',
  'Texas': '48',
  'Florida': '12',
  'Illinois': '17',
  'Pennsylvania': '42',
  'Ohio': '39',
  'Georgia': '13',
  'North Carolina': '37',
  'Michigan': '26',
  'New Jersey': '34',
  'Virginia': '51',
  'Washington': '53',
  'Arizona': '04',
  'Massachusetts': '25',
  'Tennessee': '47',
  'Indiana': '18',
  'Missouri': '29',
  'Maryland': '24',
  'Wisconsin': '55',
  'Colorado': '08',
  'Minnesota': '27',
  'South Carolina': '45',
  'Alabama': '01',
  'Louisiana': '22'
};

class CensusService {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async getStateHousingData(states: string[], year: string = '2022'): Promise<Map<string, CensusDataPoint>> {
    const stateDataMap = new Map<string, CensusDataPoint>();

    try {
      for (const stateName of states) {
        const stateFips = STATE_FIPS_CODES[stateName];

        if (!stateFips) {
          console.warn(`No FIPS code found for state: ${stateName}`);
          continue;
        }

        try {
          const medianValue = await this.fetchStateVariable(
            stateFips,
            CENSUS_VARIABLES.MEDIAN_HOME_VALUE,
            year
          );

          if (medianValue !== null) {
            stateDataMap.set(stateName, {
              name: stateName,
              state: stateFips,
              value: medianValue,
              year
            });
          }
        } catch (error) {
          console.error(`Error fetching data for ${stateName}:`, error);
        }
      }

      return stateDataMap;
    } catch (error) {
      console.error('Error in getStateHousingData:', error);
      return stateDataMap;
    }
  }

  async getNationalHousingData(year: string = '2022'): Promise<CensusDataPoint | null> {
    try {
      const value = await this.fetchNationalVariable(
        CENSUS_VARIABLES.MEDIAN_HOME_VALUE,
        year
      );

      if (value !== null) {
        return {
          name: 'United States',
          state: 'us',
          value,
          year
        };
      }

      return null;
    } catch (error) {
      console.error('Error in getNationalHousingData:', error);
      return null;
    }
  }

  async getAllStatesHousingData(year: string = '2022'): Promise<CensusDataPoint[]> {
    const states = Object.keys(STATE_FIPS_CODES);
    const stateData = await this.getStateHousingData(states, year);
    return Array.from(stateData.values());
  }

  private async fetchStateVariable(
    stateFips: string,
    variable: string,
    year: string
  ): Promise<number | null> {
    try {
      console.log(`[Census API] Fetching ${variable} for state ${stateFips}, year ${year}`);

      const endpoint = `census/acs/acs5`;
      const response = await fetchFromDataGov(endpoint, {
        get: variable,
        for: `state:${stateFips}`,
        key: this.apiKey,
        year
      });

      console.log(`[Census API] Response for state ${stateFips}:`, response);

      if (Array.isArray(response) && response.length > 1) {
        const value = parseFloat(response[1][0]);
        return isNaN(value) ? null : value;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching state variable ${variable}:`, error);
      return null;
    }
  }

  private async fetchNationalVariable(
    variable: string,
    year: string
  ): Promise<number | null> {
    try {
      console.log(`[Census API] Fetching ${variable} for US, year ${year}`);

      const endpoint = `census/acs/acs5`;
      const response = await fetchFromDataGov(endpoint, {
        get: variable,
        for: 'us:*',
        key: this.apiKey,
        year
      });

      console.log(`[Census API] Response for US:`, response);

      if (Array.isArray(response) && response.length > 1) {
        const value = parseFloat(response[1][0]);
        return isNaN(value) ? null : value;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching national variable ${variable}:`, error);
      return null;
    }
  }

  async getDetailedHousingMetrics(stateFips: string, year: string = '2022') {
    try {
      const [medianValue, medianRent, totalUnits, ownerOccupied, renterOccupied] =
        await Promise.all([
          this.fetchStateVariable(stateFips, CENSUS_VARIABLES.MEDIAN_HOME_VALUE, year),
          this.fetchStateVariable(stateFips, CENSUS_VARIABLES.MEDIAN_RENT, year),
          this.fetchStateVariable(stateFips, CENSUS_VARIABLES.HOUSING_UNITS, year),
          this.fetchStateVariable(stateFips, CENSUS_VARIABLES.OWNER_OCCUPIED, year),
          this.fetchStateVariable(stateFips, CENSUS_VARIABLES.RENTER_OCCUPIED, year)
        ]);

      return {
        medianHomeValue: medianValue,
        medianRent,
        totalHousingUnits: totalUnits,
        ownerOccupied,
        renterOccupied,
        year
      };
    } catch (error) {
      console.error('Error fetching detailed housing metrics:', error);
      return null;
    }
  }

  async getStateVariableData(states: string[], variableCode: string, year: string = '2022'): Promise<Map<string, CensusDataPoint>> {
    const stateDataMap = new Map<string, CensusDataPoint>();

    try {
      for (const stateName of states) {
        const stateFips = STATE_FIPS_CODES[stateName];

        if (!stateFips) {
          console.warn(`No FIPS code found for state: ${stateName}`);
          continue;
        }

        try {
          const value = await this.fetchStateVariable(stateFips, variableCode, year);

          if (value !== null) {
            stateDataMap.set(stateName, {
              name: stateName,
              state: stateFips,
              value: value,
              year
            });
          }
        } catch (error) {
          console.error(`Error fetching data for ${stateName}:`, error);
        }
      }

      return stateDataMap;
    } catch (error) {
      console.error('Error in getStateVariableData:', error);
      return stateDataMap;
    }
  }

  async getNationalVariableData(variableCode: string, year: string = '2022'): Promise<CensusDataPoint | null> {
    try {
      const value = await this.fetchNationalVariable(variableCode, year);

      if (value !== null) {
        return {
          name: 'United States',
          state: 'us',
          value,
          year
        };
      }

      return null;
    } catch (error) {
      console.error('Error in getNationalVariableData:', error);
      return null;
    }
  }
}

export const censusService = new CensusService('921666e680bc505e1e6612f3270d288406d9ca4c');
