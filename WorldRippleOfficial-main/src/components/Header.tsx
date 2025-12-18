import React, { useState, useEffect } from 'react';
import { Globe2, Users, BarChart3, User, Settings, Search, Menu, MapPin, Calendar, Database, TrendingUp, UserCircle, Lightbulb, LogOut, Shuffle } from 'lucide-react';
import { historyService, HistoricalEvent, HistoricalPerson } from '../services/historyApi';
import { searchInventions, Invention } from '../services/inventionsApi';
import { dataGovService } from '../services/dataGovApi';
import { supabase } from '../lib/supabase';

interface HeaderProps {
  activePanel: 'insights' | 'community' | 'dashboard' | null;
  onPanelChange: (panel: 'insights' | 'community' | 'dashboard' | null, tab?: 'overview' | 'achievements' | 'learning' | 'settings') => void;
  onSearchResult?: (result: SearchResult) => void;
  onRandomize?: () => void;
}

interface SearchResult {
  id: string;
  title: string;
  type: 'location' | 'event' | 'layer' | 'year' | 'person' | 'invention';
  description: string;
  coordinates?: [number, number];
  year?: number;
  layerId?: string;
  historicalEvent?: HistoricalEvent;
  historicalPerson?: HistoricalPerson;
  invention?: Invention;
}

export const Header: React.FC<HeaderProps> = ({ activePanel, onPanelChange, onSearchResult, onRandomize }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLogoutMenu, setShowLogoutMenu] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsAuthenticated(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setShowLogoutMenu(false);
    window.location.reload();
  };

  // Sample search data - in a real app, this would come from an API
  const searchData: SearchResult[] = [
    // Locations
    { id: '1', title: 'New York City', type: 'location', description: 'Major metropolitan area', coordinates: [-74.0060, 40.7128] },
    { id: '2', title: 'San Francisco', type: 'location', description: 'Tech hub and housing crisis epicenter', coordinates: [-122.4194, 37.7749] },
    { id: '3', title: 'London', type: 'location', description: 'UK capital and financial center', coordinates: [-0.1276, 51.5074] },
    { id: '4', title: 'Tokyo', type: 'location', description: 'Japanese capital and economic center', coordinates: [139.6917, 35.6895] },
    { id: '5', title: 'Berlin', type: 'location', description: 'German capital and political center', coordinates: [13.4050, 52.5200] },
    
    // Historical Events
    { id: '6', title: 'Spanish Flu Pandemic', type: 'event', description: 'Global pandemic of 1918-1919', year: 1918 },
    { id: '7', title: 'Great Depression', type: 'event', description: 'Economic downturn starting in 1929', year: 1929 },
    { id: '8', title: 'World War II Ends', type: 'event', description: 'End of global conflict in 1945', year: 1945 },
    { id: '9', title: 'Moon Landing', type: 'event', description: 'First human moon landing in 1969', year: 1969 },
    { id: '10', title: '9/11 Attacks', type: 'event', description: 'Terrorist attacks in 2001', year: 2001, coordinates: [-74.0060, 40.7128] },
    { id: '11', title: 'Financial Crisis', type: 'event', description: 'Global financial crisis of 2008', year: 2008 },
    { id: '12', title: 'COVID-19 Pandemic', type: 'event', description: 'Global pandemic starting in 2020', year: 2020 },
    
    // Data Layers
    { id: '13', title: 'Disease Outbreaks', type: 'layer', description: 'Infectious disease patterns', layerId: 'disease' },
    { id: '14', title: 'Housing Crisis', type: 'layer', description: 'Housing affordability trends', layerId: 'housing' },
    { id: '15', title: 'Climate Impact', type: 'layer', description: 'Environmental changes', layerId: 'environment' },
    { id: '16', title: 'Political Shifts', type: 'layer', description: 'Political trends', layerId: 'politics' },
    { id: '17', title: 'Economic Trends', type: 'layer', description: 'Economic indicators', layerId: 'economy' },
    { id: '18', title: 'Social Movements', type: 'layer', description: 'Social change movements', layerId: 'social' },
    
    // Years/Periods
    { id: '19', title: '1918', type: 'year', description: 'Spanish Flu pandemic year', year: 1918 },
    { id: '20', title: '1929', type: 'year', description: 'Great Depression begins', year: 1929 },
    { id: '21', title: '1945', type: 'year', description: 'End of World War II', year: 1945 },
    { id: '22', title: '1969', type: 'year', description: 'Moon landing year', year: 1969 },
    { id: '23', title: '2001', type: 'year', description: '9/11 attacks', year: 2001 },
    { id: '24', title: '2008', type: 'year', description: 'Financial crisis', year: 2008 },
    { id: '25', title: '2020', type: 'year', description: 'COVID-19 pandemic begins', year: 2020 }
  ];

  const handlePanelToggle = (panel: 'insights' | 'community' | 'dashboard') => {
    onPanelChange(activePanel === panel ? null : panel);
  };

  const handleSettingsClick = () => {
    onPanelChange('dashboard', 'settings');
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (query.trim().length === 0) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    if (query.trim().length < 2) {
      setShowResults(false);
      return;
    }

    const results: SearchResult[] = [];

    // Search inventions
    const inventions = searchInventions(query);
    inventions.forEach(invention => {
      results.push({
        id: invention.id,
        title: invention.name,
        type: 'invention',
        description: `${invention.inventor} (${invention.year}) - ${invention.description.substring(0, 80)}...`,
        coordinates: invention.location.coordinates,
        year: invention.year,
        invention: invention
      });
    });

    // Search people
    const people = historyService.searchPeople(query);
    people.forEach(person => {
      results.push({
        id: person.id,
        title: person.name,
        type: 'person',
        description: person.description,
        coordinates: person.coordinates,
        year: person.birthYear,
        historicalPerson: person
      });
    });

    // Search by date (flexible year extraction)
    const dateResults = historyService.searchByDate(query);
    dateResults.forEach(result => {
      if ('name' in result) {
        const person = result as HistoricalPerson;
        if (!results.find(r => r.id === person.id)) {
          results.push({
            id: person.id,
            title: person.name,
            type: 'person',
            description: person.description,
            coordinates: person.coordinates,
            year: person.birthYear,
            historicalPerson: person
          });
        }
      } else {
        const event = result as HistoricalEvent;
        if (!results.find(r => r.id === event.id)) {
          results.push({
            id: event.id,
            title: event.title,
            type: 'event',
            description: `${event.description.substring(0, 100)}...`,
            year: event.year,
            historicalEvent: event
          });
        }
      }
    });

    // Search historical events
    const historicalEvents = historyService.searchEvents(query);
    historicalEvents.forEach(event => {
      if (!results.find(r => r.id === event.id)) {
        results.push({
          id: event.id,
          title: event.title,
          type: 'event',
          description: `${event.description.substring(0, 100)}...`,
          year: event.year,
          historicalEvent: event
        });
      }
    });

    // Search locations
    const locations = historyService.searchLocations(query);
    locations.forEach(location => {
      results.push({
        id: `loc-${location}`,
        title: location,
        type: 'location',
        description: `View historical events in ${location}`,
        coordinates: getLocationCoordinates(location)
      });
    });

    // Search data.gov API
    try {
      console.log('[Search] Fetching data.gov results for:', query);
      const dataGovResults = await dataGovService.searchAll(query, 500);
      console.log('[Search] Got', dataGovResults.length, 'data.gov results');
      dataGovResults.forEach(dgResult => {
        const source = dgResult.source || 'Data.gov';
        results.push({
          id: dgResult.id,
          title: `${dgResult.title}`,
          type: dgResult.type === 'dataset' ? 'layer' : dgResult.type,
          description: `[${source}] ${dgResult.description.substring(0, 80)}${dgResult.description.length > 80 ? '...' : ''}`,
          coordinates: dgResult.coordinates
        });
      });
    } catch (error) {
      console.error('Error fetching data.gov results:', error);
    }

    // Filter static search data (layers and years)
    const filtered = searchData.filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.description.toLowerCase().includes(query.toLowerCase())
    );

    results.push(...filtered);

    // Remove duplicates but don't limit results
    const uniqueResults = results.filter((result, index, self) =>
      index === self.findIndex(r => r.id === result.id)
    );

    console.log('[Search] Total unique results:', uniqueResults.length);
    console.log('[Search] Results:', uniqueResults);

    setSearchResults(uniqueResults);
    setShowResults(true);
  };

  // Helper function to get coordinates for locations
  const getLocationCoordinates = (location: string): [number, number] | undefined => {
    const coordMap: Record<string, [number, number]> = {
      'United States': [-98.5795, 39.8283],
      'United Kingdom': [-3.4359, 55.3781],
      'Germany': [10.4515, 51.1657],
      'California': [-119.4179, 36.7783],
      'San Francisco': [-122.4194, 37.7749],
      'Los Angeles': [-118.2437, 34.0522],
      'Detroit': [-83.0458, 42.3314],
      'New York': [-74.0060, 40.7128]
    };
    return coordMap[location];
  };

  const handleResultClick = (result: SearchResult) => {
    setSearchQuery(result.title);
    setShowResults(false);
    
    // Call the callback to handle the search result
    if (onSearchResult) {
      onSearchResult(result);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'location': return MapPin;
      case 'event': return Calendar;
      case 'layer': return Database;
      case 'year': return TrendingUp;
      case 'person': return UserCircle;
      case 'invention': return Lightbulb;
      default: return Search;
    }
  };

  const getResultColor = (type: string) => {
    switch (type) {
      case 'location': return 'text-blue-400';
      case 'event': return 'text-red-400';
      case 'layer': return 'text-green-400';
      case 'year': return 'text-purple-400';
      case 'person': return 'text-orange-400';
      case 'invention': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-gray-800">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Logo and Brand */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Globe2 className="w-8 h-8 text-blue-400" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-full animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            WorldRipple
          </h1>
        </div>

        {/* Search Bar with Randomize Button */}
        <div className="hidden md:flex flex-1 max-w-md mx-8 items-center space-x-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, inventions, locations, data... (Press Enter)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchResults.length > 0) {
                  e.preventDefault();
                  handleResultClick(searchResults[0]);
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
            />

            {/* Search Results Dropdown */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto z-50">
                {searchResults.map(result => {
                  const IconComponent = getResultIcon(result.type);
                  const colorClass = getResultColor(result.type);
                  
                  const isDataGov = result.description.includes('[Data.gov]') ||
                                    result.description.includes('[NPS API]') ||
                                    result.description.includes('[FDA]') ||
                                    result.description.includes('[USGS');

                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 flex items-center space-x-3 ${
                        isDataGov ? 'bg-gradient-to-r from-blue-900/10 to-cyan-900/10 border-l-2 border-l-cyan-500' : ''
                      }`}
                    >
                      <IconComponent className={`w-4 h-4 ${colorClass} ${isDataGov ? 'animate-pulse' : ''}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm flex items-center gap-2">
                          {result.title}
                          {isDataGov && (
                            <span className="text-xs px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                              Data.gov
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {result.description}
                          {result.year && ` (${result.year})`}
                        </div>
                      </div>
                      <div className={`text-xs px-2 py-1 rounded ${
                        result.type === 'location' ? 'bg-blue-900/30 text-blue-400' :
                        result.type === 'event' ? 'bg-red-900/30 text-red-400' :
                        result.type === 'layer' ? 'bg-green-900/30 text-green-400' :
                        result.type === 'person' ? 'bg-orange-900/30 text-orange-400' :
                        'bg-purple-900/30 text-purple-400'
                      }`}>
                        {result.type}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Search Button */}
          <button
            onClick={() => {
              if (searchResults.length > 0) {
                handleResultClick(searchResults[0]);
              }
            }}
            disabled={searchResults.length === 0}
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 font-medium"
            title="Search (Enter)"
          >
            Search
          </button>

          {/* Randomize Button */}
          <button
            onClick={() => {
              console.log('Button clicked in Header!');
              if (onRandomize) {
                onRandomize();
              } else {
                console.error('onRandomize is undefined!');
              }
            }}
            className="flex-shrink-0 p-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-blue-500/50"
            title="Discover Something Random"
          >
            <Shuffle className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePanelToggle('insights')}
            className={`p-2 rounded-lg transition-colors ${
              activePanel === 'insights'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            title="AI Insights"
          >
            <BarChart3 className="w-5 h-5" />
          </button>
          
          <button
            onClick={() => handlePanelToggle('community')}
            className={`p-2 rounded-lg transition-colors ${
              activePanel === 'community'
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            title="Community Insights"
          >
            <Users className="w-5 h-5" />
          </button>
          
          <div className="relative">
            <button
              onClick={handleSettingsClick}
              onMouseEnter={() => isAuthenticated && setShowLogoutMenu(true)}
              onMouseLeave={() => setShowLogoutMenu(false)}
              className={`p-2 rounded-lg transition-colors ${
                activePanel === 'dashboard'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
              title="User Dashboard"
            >
              <User className="w-5 h-5" />
            </button>

            {isAuthenticated && showLogoutMenu && (
              <div
                onMouseEnter={() => setShowLogoutMenu(true)}
                onMouseLeave={() => setShowLogoutMenu(false)}
                className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50"
              >
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-center space-x-2 text-red-400 hover:text-red-300"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm font-medium">Log Out</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Search */}
      {isMenuOpen && (
        <div className="md:hidden px-6 pb-4 border-t border-gray-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search events, locations, data... (Press Enter)"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => searchQuery && setShowResults(true)}
              onBlur={() => setTimeout(() => setShowResults(false), 200)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && searchResults.length > 0) {
                  e.preventDefault();
                  handleResultClick(searchResults[0]);
                }
              }}
              className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors"
            />
            
            {/* Mobile Search Results */}
            {showResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-y-auto z-50">
                {searchResults.map(result => {
                  const IconComponent = getResultIcon(result.type);
                  const colorClass = getResultColor(result.type);

                  const isDataGov = result.description.includes('[Data.gov]') ||
                                    result.description.includes('[NPS API]') ||
                                    result.description.includes('[FDA]') ||
                                    result.description.includes('[USGS');

                  return (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-700 transition-colors border-b border-gray-700 last:border-b-0 flex items-center space-x-2 ${
                        isDataGov ? 'bg-gradient-to-r from-blue-900/10 to-cyan-900/10 border-l-2 border-l-cyan-500' : ''
                      }`}
                    >
                      <IconComponent className={`w-3 h-3 ${colorClass} ${isDataGov ? 'animate-pulse' : ''}`} />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-xs flex items-center gap-1.5">
                          {result.title}
                          {isDataGov && (
                            <span className="text-xs px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                              Data.gov
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-400 truncate">
                          {result.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};