import React, { useState, useEffect, useMemo } from 'react';
import { useMultiLayerData } from './hooks/useDataCommons';
import { Header } from './components/Header';
import { MapInterface } from './components/MapInterface';
import { CombinedPanel } from './components/CombinedPanel';
import { TimelineControls } from './components/TimelineControls';
import { CommunityPanel } from './components/CommunityPanel';
import { UserDashboard } from './components/UserDashboard';
import { AuthScreen } from './components/AuthScreen';
import { Invention, getAllInventions } from './services/inventionsApi';
import { historyService } from './services/historyApi';
import { supabase } from './lib/supabase';

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
  timestamp?: number;
}

export interface Subcategory {
  id: string;
  name: string;
  isActive: boolean;
}

export interface DataLayer {
  id: string;
  name: string;
  color: string;
  isActive: boolean;
  intensity: number;
  description: string;
  subcategories: Subcategory[];
  isExpanded?: boolean;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [activePanel, setActivePanel] = useState<'insights' | 'community' | 'dashboard' | null>('insights');
  const [dashboardTab, setDashboardTab] = useState<'overview' | 'achievements' | 'learning' | 'settings'>('overview');
  const [currentYear, setCurrentYear] = useState(2020);
  const [selectedSearchResult, setSelectedSearchResult] = useState<SearchResult | null>(null);
  const [selectedInvention, setSelectedInvention] = useState<Invention | null>(null);
  const [detailViewResult, setDetailViewResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);
  const [dataLayers, setDataLayers] = useState<DataLayer[]>([
    {
      id: 'politics',
      name: 'Politics',
      color: '#8B5CF6',
      isActive: false,
      intensity: 0.5,
      description: 'Political trends and electoral changes',
      isExpanded: false,
      subcategories: [
        { id: 'wars-battles', name: 'Wars & Battles', isActive: false },
        { id: 'treaties-peace', name: 'Treaties & Peace Accords', isActive: false },
        { id: 'assassinations-coups', name: 'Assassinations & Coups', isActive: false },
        { id: 'political-alliances', name: 'Political Alliances / Unions', isActive: false },
        { id: 'revolutions', name: 'Revolutions / Uprisings', isActive: false },
        { id: 'leaders-monarchs', name: 'Leaders & Monarchs', isActive: false },
        { id: 'political-ideologies', name: 'Political Ideologies', isActive: false },
        { id: 'colonization', name: 'Colonization / Independence Movements', isActive: false },
        { id: 'govt-spending', name: 'Government Spending / Debt', isActive: false },
        { id: 'military-expenditure', name: 'Military Expenditure', isActive: false },
        { id: 'corruption', name: 'Corruption Perception', isActive: false },
        { id: 'political-prisoners', name: 'Political Prisoners / State Oppression', isActive: false },
        { id: 'law-enforcement', name: 'Law Enforcement Reform Events', isActive: false }
      ]
    },
    {
      id: 'disease',
      name: 'Health',
      color: '#EF4444',
      isActive: true,
      intensity: 0.7,
      description: 'Tracking infectious disease patterns and outbreaks across regions',
      isExpanded: false,
      subcategories: [
        { id: 'mortality-rate', name: 'Mortality Rate', isActive: false },
        { id: 'cause-of-death', name: 'Cause-of-Death Breakdown', isActive: false },
        { id: 'epidemics', name: 'Epidemics & Pandemics', isActive: false },
        { id: 'infant-mortality', name: 'Infant Mortality Rate', isActive: false },
        { id: 'vaccination', name: 'Vaccination Rates', isActive: false },
        { id: 'infectious-disease', name: 'Infectious Disease Incidence', isActive: false },
        { id: 'non-communicable', name: 'Non-communicable Disease Rates', isActive: false },
        { id: 'mental-health', name: 'Mental Health Indicators', isActive: false },
        { id: 'life-expectancy', name: 'Life Expectancy at Birth', isActive: false },
        { id: 'hospital-capacity', name: 'Hospital Bed Capacity', isActive: false },
        { id: 'clean-water', name: 'Access to Clean Water', isActive: false },
        { id: 'sanitation', name: 'Sanitation Infrastructure', isActive: false },
        { id: 'malnutrition', name: 'Malnutrition / Hunger Statistics', isActive: false },
        { id: 'air-quality-health', name: 'Air Quality & Respiratory Illness', isActive: false },
        { id: 'health-expenditure', name: 'Health Expenditure per Capita', isActive: false },
        { id: 'health-workforce', name: 'Health Workforce', isActive: false },
        { id: 'medical-innovation', name: 'Medical Innovation Timeline', isActive: false },
        { id: 'health-policy', name: 'Health Policy Changes', isActive: false },
        { id: 'dalys', name: 'Disability-Adjusted Life Years (DALYs)', isActive: false },
        { id: 'disease-hotspots', name: 'Regional Disease Hotspots', isActive: false }
      ]
    },
    {
      id: 'housing',
      name: 'Housing',
      color: '#EAB308',
      isActive: true,
      intensity: 0.8,
      description: 'Housing affordability and availability trends',
      isExpanded: false,
      subcategories: [
        { id: 'housing-market', name: 'Housing Market Index', isActive: false },
        { id: 'urban-rural', name: 'Urban vs Rural Distribution', isActive: false },
        { id: 'population-density', name: 'Population Density Maps', isActive: false },
        { id: 'household-size', name: 'Household Size', isActive: false },
        { id: 'regional-growth', name: 'Regional Growth Trends', isActive: false },
        { id: 'infrastructure-investment', name: 'Public Infrastructure Investment', isActive: false },
        { id: 'major-projects', name: 'Major Infrastructure Projects', isActive: false },
        { id: 'land-reclamation', name: 'Land Reclamation Projects', isActive: false },
        { id: 'migration', name: 'Migration & Immigration Flows', isActive: false }
      ]
    },
    {
      id: 'environment',
      name: 'Climate',
      color: '#10B981',
      isActive: false,
      intensity: 0.6,
      description: 'Environmental changes and climate-related events',
      isExpanded: false,
      subcategories: [
        { id: 'temp-anomalies', name: 'Temperature Anomalies', isActive: false },
        { id: 'precipitation', name: 'Precipitation Levels', isActive: false },
        { id: 'drought-index', name: 'Drought Index', isActive: false },
        { id: 'extreme-weather', name: 'Extreme Weather Events', isActive: false },
        { id: 'tornado-hurricane', name: 'Tornado / Hurricane Tracks', isActive: false },
        { id: 'flood-occurrences', name: 'Flood Occurrences', isActive: false },
        { id: 'snowfall', name: 'Snowfall / Ice Coverage', isActive: false },
        { id: 'ocean-temps', name: 'Ocean Temperatures (ENSO events)', isActive: false },
        { id: 'heatwaves', name: 'Heatwaves / Cold Spells', isActive: false },
        { id: 'climate-classifications', name: 'Climate Classifications', isActive: false },
        { id: 'greenhouse-gas', name: 'Greenhouse Gas Concentrations', isActive: false },
        { id: 'air-pressure', name: 'Air Pressure / Wind Patterns', isActive: false },
        { id: 'co2-levels', name: 'Atmospheric CO₂ by Year', isActive: false },
        { id: 'deforestation-climate', name: 'Deforestation-Climate Feedback', isActive: false },
        { id: 'wildfires', name: 'Wildfire Incidents', isActive: false },
        { id: 'agricultural-impact', name: 'Agricultural Impact', isActive: false },
        { id: 'sea-level', name: 'Sea Level Rise', isActive: false },
        { id: 'climate-shift', name: 'Global Climate Shift Indicators', isActive: false },
        { id: 'drought-zones', name: 'Drought Zones', isActive: false },
        { id: 'flood-plains', name: 'Flood Plains', isActive: false },
        { id: 'earthquakes', name: 'Earthquake History', isActive: false },
        { id: 'volcanoes', name: 'Volcano Activity', isActive: false },
        { id: 'forest-coverage', name: 'Forest Coverage', isActive: false },
        { id: 'air-quality', name: 'Air Quality by Region', isActive: false },
        { id: 'soil-quality', name: 'Soil Quality Index', isActive: false },
        { id: 'wetlands', name: 'Wetlands & Protected Areas', isActive: false },
        { id: 'glacial', name: 'Glacial Retreat or Growth', isActive: false }
      ]
    },
    {
      id: 'economy',
      name: 'Economics',
      color: '#F59E0B',
      isActive: false,
      intensity: 0.7,
      description: 'Economic indicators and market changes',
      isExpanded: false,
      subcategories: [
        { id: 'gdp', name: 'GDP (Nominal & Real)', isActive: false },
        { id: 'inflation', name: 'Inflation (CPI, PPI)', isActive: false },
        { id: 'unemployment', name: 'Unemployment Rate', isActive: false },
        { id: 'industrial-production', name: 'Industrial Production', isActive: false },
        { id: 'wages-inequality', name: 'Wages & Income Inequality', isActive: false },
        { id: 'trade-balance', name: 'Trade Balance', isActive: false },
        { id: 'interest-rates', name: 'Interest Rates', isActive: false },
        { id: 'stock-market', name: 'Stock Market Indices', isActive: false },
        { id: 'exchange-rates', name: 'Exchange Rates', isActive: false },
        { id: 'commodity-prices', name: 'Gold & Commodity Prices', isActive: false },
        { id: 'banking-credit', name: 'Banking & Credit Supply', isActive: false },
        { id: 'energy-prices', name: 'Energy Prices', isActive: false },
        { id: 'currency-crises', name: 'Currency Crises or Defaults', isActive: false },
        { id: 'hyperinflation', name: 'Hyperinflation Episodes', isActive: false },
        { id: 'consumer-sentiment', name: 'Consumer Sentiment Index', isActive: false },
        { id: 'business-confidence', name: 'Business Confidence Index', isActive: false },
        { id: 'poverty-rates', name: 'Poverty Rates', isActive: false },
        { id: 'employment-sector', name: 'Employment by Sector', isActive: false },
        { id: 'wage-levels', name: 'Wage Levels by Occupation', isActive: false }
      ]
    },
    {
      id: 'innovation',
      name: 'Innovation and Industry',
      color: '#06B6D4',
      isActive: false,
      intensity: 0.75,
      description: 'Technological innovation, industrial development, and manufacturing trends',
      isExpanded: false,
      subcategories: [
        { id: 'mechanical-patents', name: 'Mechanical Patents', isActive: false },
        { id: 'electrical-patents', name: 'Electrical Engineering Patents', isActive: false },
        { id: 'chemical-patents', name: 'Chemical / Pharmaceutical Patents', isActive: false },
        { id: 'aviation-tech', name: 'Aviation Technology', isActive: false },
        { id: 'communications', name: 'Communications & Radio Inventions', isActive: false },
        { id: 'automotive', name: 'Automotive Innovations', isActive: false },
        { id: 'textile', name: 'Textile Manufacturing', isActive: false },
        { id: 'weapons-defense', name: 'Weapons & Defense Technology', isActive: false },
        { id: 'shipbuilding', name: 'Shipbuilding / Naval Design', isActive: false },
        { id: 'civil-engineering', name: 'Civil Engineering Patents', isActive: false },
        { id: 'mining-metallurgy', name: 'Mining & Metallurgy', isActive: false },
        { id: 'energy-innovations', name: 'Energy Innovations', isActive: false },
        { id: 'agricultural-machinery', name: 'Agricultural Machinery', isActive: false },
        { id: 'medical-devices', name: 'Medical Devices', isActive: false },
        { id: 'early-computers', name: 'Early Computer / Automation Systems', isActive: false },
        { id: 'synthetic-materials', name: 'Synthetic Materials', isActive: false },
        { id: 'mass-production', name: 'Mass Production Techniques', isActive: false },
        { id: 'industrial-accidents', name: 'Industrial Accidents or Safety Innovations', isActive: false },
        { id: 'patent-ownership', name: 'Patent Ownership by Country', isActive: false },
        { id: 'wartime-rd', name: 'Wartime R&D Output', isActive: false }
      ]
    },
    {
      id: 'social',
      name: 'Social Movements',
      color: '#EC4899',
      isActive: false,
      intensity: 0.6,
      description: 'Social change movements and demographic shifts',
      isExpanded: false,
      subcategories: [
        { id: 'cultural-movements', name: 'Cultural Movements', isActive: false },
        { id: 'scientific-milestones', name: 'Scientific Milestones', isActive: false },
        { id: 'social-reforms', name: 'Social Reforms / Rights Movements', isActive: false },
        { id: 'inventions-discoveries', name: 'Inventions & Discoveries', isActive: false },
        { id: 'industrialization', name: 'Industrialization Milestones', isActive: false },
        { id: 'migration-patterns', name: 'Migration Patterns', isActive: false },
        { id: 'natural-disasters', name: 'Natural Disasters & Humanitarian Crises', isActive: false },
        { id: 'environmental-changes', name: 'Environmental Changes', isActive: false },
        { id: 'civil-unrest', name: 'Civil Unrest / Protests', isActive: false },
        { id: 'organized-crime', name: 'Organized Crime Presence', isActive: false },
        { id: 'terrorism', name: 'Terrorism Incidents', isActive: false },
        { id: 'drug-trafficking', name: 'Drug Trafficking Routes', isActive: false },
        { id: 'human-trafficking', name: 'Human Trafficking / Kidnapping', isActive: false },
        { id: 'crime-justice', name: 'Crime & Justice Trends', isActive: false }
      ]
    }
  ]);

  // Fetch real data from Data Commons API
  const activeLayers = useMemo(() => 
    dataLayers.filter(layer => layer.isActive).map(layer => layer.id),
    [dataLayers]
  );
  const { allLayerData, loading: dataLoading, error: dataError } = useMultiLayerData(activeLayers, currentYear);

  const toggleDataLayer = (layerId: string) => {
    setDataLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, isActive: !layer.isActive } : layer
    ));
  };

  const updateLayerIntensity = (layerId: string, intensity: number) => {
    setDataLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, intensity } : layer
    ));
  };

  const toggleLayerExpansion = (layerId: string) => {
    setDataLayers(prev => prev.map(layer =>
      layer.id === layerId ? { ...layer, isExpanded: !layer.isExpanded } : layer
    ));
  };

  const toggleSubcategory = (layerId: string, subcategoryId: string) => {
    setDataLayers(prev => prev.map(layer =>
      layer.id === layerId
        ? {
            ...layer,
            subcategories: layer.subcategories.map(sub =>
              sub.id === subcategoryId ? { ...sub, isActive: !sub.isActive } : sub
            )
          }
        : layer
    ));
  };

  const handleSearchResult = (result: SearchResult) => {
    // Store the search result for the map to display
    setSelectedSearchResult(result);

    // Handle different types of search results
    switch (result.type) {
      case 'location':
        // For locations, we store it and the map will handle display
        console.log('Navigate to location:', result.coordinates);
        break;

      case 'event':
        // For events, change the timeline year and store the event
        if (result.year) {
          setCurrentYear(result.year);
        }
        break;

      case 'person':
        // For people, change timeline to their birth year
        if (result.year) {
          setCurrentYear(result.year);
        }
        break;

      case 'layer':
        // For layers, activate the specific data layer
        if (result.layerId) {
          setDataLayers(prev => prev.map(layer =>
            layer.id === result.layerId ? { ...layer, isActive: true } : layer
          ));
        }
        break;

      case 'year':
        // For years, change the timeline
        if (result.year) {
          setCurrentYear(result.year);
        }
        break;

      case 'invention':
        // For inventions, change timeline and show details
        if (result.year) {
          setCurrentYear(result.year);
        }
        if (result.invention) {
          setSelectedInvention(result.invention);
          setActivePanel('insights');
        }
        break;
    }

    // Show detail view for all search results
    setDetailViewResult(result);
    setActivePanel('insights');
  };

  const handlePanelChange = (panel: 'insights' | 'community' | 'dashboard' | null, tab?: 'overview' | 'achievements' | 'learning' | 'settings') => {
    setActivePanel(panel);
    if (panel === 'dashboard' && tab) {
      setDashboardTab(tab);
    }
  };

  const handleCloseInvention = () => {
    setSelectedInvention(null);
  };

  const handleCloseDetailView = () => {
    setDetailViewResult(null);
    if (!selectedInvention) {
      // Only clear the search result if there's no invention showing
      setSelectedSearchResult(null);
    }
  };

  const handleRandomize = () => {
    console.log('Randomize clicked!');
    const allInventions = getAllInventions();
    const allEvents = historyService.getAllEvents();
    const allPeople = historyService.getAllPeople();

    const allEducationalContent: SearchResult[] = [];

    allInventions.forEach(inv => {
      allEducationalContent.push({
        id: inv.id,
        title: inv.name,
        type: 'invention',
        description: inv.description,
        coordinates: inv.location.coordinates,
        year: inv.year,
        invention: inv
      });
    });

    allEvents.forEach(event => {
      if (event.coordinates) {
        allEducationalContent.push({
          id: event.id,
          title: event.title,
          type: 'event',
          description: event.description,
          coordinates: event.coordinates,
          year: event.year,
          historicalEvent: event
        });
      }
    });

    allPeople.forEach(person => {
      if (person.coordinates) {
        allEducationalContent.push({
          id: person.id,
          title: person.name,
          type: 'person',
          description: person.description,
          coordinates: person.coordinates,
          year: person.birthYear,
          historicalPerson: person
        });
      }
    });

    console.log(`Found ${allEducationalContent.length} educational items`);

    if (allEducationalContent.length > 0) {
      const randomIndex = Math.floor(Math.random() * allEducationalContent.length);
      const randomResult = allEducationalContent[randomIndex];

      console.log('Selected random item:', randomResult);

      // Use a new key/timestamp to force re-render
      const resultWithTimestamp = { ...randomResult, timestamp: Date.now() };
      setSelectedSearchResult(resultWithTimestamp);
      handleSearchResult(resultWithTimestamp);
    }
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-hidden">
      <Header
        activePanel={activePanel}
        onPanelChange={handlePanelChange}
        onSearchResult={handleSearchResult}
        onRandomize={handleRandomize}
      />
      
      <div className="flex h-screen pt-16">
        {/* Main Map Area */}
        <div className="flex-1 relative">
          <MapInterface
            dataLayers={dataLayers}
            currentYear={currentYear}
            realData={allLayerData}
            dataLoading={dataLoading}
            searchResult={selectedSearchResult}
            onSearchResultDisplayed={() => setSelectedSearchResult(null)}
          />

          {/* Timeline Controls */}
          <div className="absolute bottom-6 left-6">
            <TimelineControls
              currentYear={currentYear}
              onYearChange={setCurrentYear}
            />
          </div>
        </div>

        {/* Right Side Panel */}
        <div className="w-80">
          {activePanel === 'community' ? (
            <CommunityPanel />
          ) : activePanel === 'dashboard' ? (
            <UserDashboard key={dashboardTab} defaultTab={dashboardTab} />
          ) : (
            <CombinedPanel
              dataLayers={dataLayers}
              onToggleLayer={toggleDataLayer}
              onUpdateIntensity={updateLayerIntensity}
              onToggleExpansion={toggleLayerExpansion}
              onToggleSubcategory={toggleSubcategory}
              realData={allLayerData}
              currentYear={currentYear}
              invention={selectedInvention}
              onCloseInvention={handleCloseInvention}
              searchResult={detailViewResult}
              onCloseSearchResult={handleCloseDetailView}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;