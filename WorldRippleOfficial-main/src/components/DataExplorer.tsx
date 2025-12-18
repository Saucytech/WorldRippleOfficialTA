import React, { useState } from 'react';
import { 
  Globe, 
  Activity, 
  Home, 
  Leaf, 
  Vote, 
  TrendingUp, 
  Heart, 
  Factory, 
  Sparkles,
  ChevronRight,
  Database,
  MapPin,
  Calendar,
  Users,
  Zap,
  AlertCircle,
  Shield,
  Flame,
  Cloud,
  Building,
  Briefcase,
  Award,
  BookOpen
} from 'lucide-react';

interface DataCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  availableData: {
    sources: number;
    timeRange: string;
    coverage: string;
    updateFrequency: string;
  };
  sampleQuestions: string[];
  rippleEffects: string[];
  liveIndicator?: boolean;
}

const dataCategories: DataCategory[] = [
  {
    id: 'politics',
    name: 'Politics & Power',
    icon: Vote,
    color: '#8B5CF6',
    description: 'Track how political decisions cascade through societies',
    availableData: {
      sources: 15,
      timeRange: '1900-2024',
      coverage: '195 countries',
      updateFrequency: 'Daily'
    },
    sampleQuestions: [
      'How did Brexit affect global markets?',
      'What was the ripple effect of the Arab Spring?',
      'How do elections impact neighboring countries?'
    ],
    rippleEffects: [
      'Elections → Market volatility → Employment',
      'War → Refugee crisis → Housing prices',
      'Treaties → Trade flows → Innovation'
    ]
  },
  {
    id: 'disease',
    name: 'Health & Pandemics',
    icon: Activity,
    color: '#EF4444',
    description: 'Visualize how diseases spread and impact everything',
    availableData: {
      sources: 12,
      timeRange: '1800-2024',
      coverage: 'Global',
      updateFrequency: 'Real-time'
    },
    sampleQuestions: [
      'How did COVID-19 change remote work globally?',
      'What was the economic impact of the 1918 flu?',
      'How do vaccination rates affect economies?'
    ],
    rippleEffects: [
      'Pandemic → Supply chains → Food prices',
      'Vaccination → Travel → Tourism economy',
      'Disease outbreak → School closures → Education gaps'
    ],
    liveIndicator: true
  },
  {
    id: 'economy',
    name: 'Economics & Trade',
    icon: TrendingUp,
    color: '#10B981',
    description: 'See how financial events trigger global changes',
    availableData: {
      sources: 20,
      timeRange: '1929-2024',
      coverage: 'All markets',
      updateFrequency: 'Real-time'
    },
    sampleQuestions: [
      'How did 2008 crisis affect global housing?',
      'What happens when oil prices spike?',
      'How do trade wars impact innovation?'
    ],
    rippleEffects: [
      'Stock crash → Unemployment → Migration',
      'Interest rates → Housing → Birth rates',
      'Sanctions → Black markets → Conflict'
    ],
    liveIndicator: true
  },
  {
    id: 'environment',
    name: 'Climate & Disasters',
    icon: Cloud,
    color: '#06B6D4',
    description: 'Track environmental changes and their cascading effects',
    availableData: {
      sources: 18,
      timeRange: '1850-2024',
      coverage: 'Global + Regional',
      updateFrequency: 'Hourly'
    },
    sampleQuestions: [
      'How do hurricanes affect supply chains?',
      'What is the ripple effect of droughts?',
      'How does sea level rise trigger migration?'
    ],
    rippleEffects: [
      'Natural disaster → Infrastructure → Economy',
      'Climate change → Agriculture → Conflict',
      'Extreme weather → Energy prices → Politics'
    ],
    liveIndicator: true
  },
  {
    id: 'innovation',
    name: 'Innovation & Technology',
    icon: Factory,
    color: '#F59E0B',
    description: 'Watch how inventions reshape civilization',
    availableData: {
      sources: 25,
      timeRange: '1750-2024',
      coverage: 'Global',
      updateFrequency: 'Weekly'
    },
    sampleQuestions: [
      'How did the internet change global commerce?',
      'What was the ripple effect of smartphones?',
      'How do AI breakthroughs affect employment?'
    ],
    rippleEffects: [
      'New technology → Job displacement → Education',
      'Social media → Political movements → Policy',
      'Automation → Wealth gap → Social unrest'
    ]
  },
  {
    id: 'social',
    name: 'Social Movements',
    icon: Users,
    color: '#EC4899',
    description: 'Understand how social changes spread globally',
    availableData: {
      sources: 14,
      timeRange: '1800-2024',
      coverage: '150+ countries',
      updateFrequency: 'Daily'
    },
    sampleQuestions: [
      'How did #MeToo spread globally?',
      'What triggered the civil rights movement?',
      'How do protests in one country inspire others?'
    ],
    rippleEffects: [
      'Protest → Policy change → Economic impact',
      'Social movement → Corporate response → Markets',
      'Cultural shift → Immigration → Demographics'
    ]
  },
  {
    id: 'housing',
    name: 'Housing & Urban',
    icon: Building,
    color: '#64748B',
    description: 'Explore how housing crises ripple through societies',
    availableData: {
      sources: 10,
      timeRange: '1950-2024',
      coverage: 'Major cities',
      updateFrequency: 'Monthly'
    },
    sampleQuestions: [
      'How do housing bubbles affect birth rates?',
      'What triggers mass urbanization?',
      'How does gentrification spread?'
    ],
    rippleEffects: [
      'Housing crisis → Homelessness → Health',
      'Rent increases → Migration → Labor markets',
      'Urban development → Environment → Climate'
    ]
  },
  {
    id: 'community',
    name: 'Community Insights',
    icon: Users,
    color: '#22C55E',
    description: 'Crowdsourced stories and local observations from around the world',
    availableData: {
      sources: 1000,
      timeRange: 'Real-time',
      coverage: 'Global',
      updateFrequency: 'Live'
    },
    sampleQuestions: [
      'What are people observing locally?',
      'How do local changes connect globally?',
      'What patterns are emerging from collective observations?'
    ],
    rippleEffects: [
      'Local observation → Community awareness → Policy change',
      'Personal story → Media attention → Global movement',
      'Crowdsourced data → Pattern recognition → Early warning'
    ],
    liveIndicator: true
  }
];

interface DataExplorerProps {
  onSelectCategory?: (categoryId: string) => void;
  activeLayers: string[];
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ 
  onSelectCategory,
  activeLayers = []
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showRipples, setShowRipples] = useState(false);

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId === selectedCategory ? null : categoryId);
    if (onSelectCategory) {
      onSelectCategory(categoryId);
    }
  };

  const selected = selectedCategory ? 
    dataCategories.find(c => c.id === selectedCategory) : null;

  return (
    <div className="bg-gray-900 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-purple-900/20 to-blue-900/20">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-bold text-white flex items-center">
            <Globe className="w-5 h-5 mr-2 text-blue-400" />
            WorldRipple Data Explorer
          </h3>
          <button
            onClick={() => setShowRipples(!showRipples)}
            className="text-xs px-2 py-1 rounded bg-purple-600/20 text-purple-300 hover:bg-purple-600/30 transition-colors flex items-center"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            {showRipples ? 'Hide' : 'Show'} Ripple Effects
          </button>
        </div>
        <p className="text-xs text-gray-400">
          Click any category to explore how events create global ripples
        </p>
      </div>

      {/* Categories Grid */}
      <div className="p-4 space-y-3">
        {dataCategories.map((category) => {
          const isActive = activeLayers.includes(category.id);
          const isSelected = selectedCategory === category.id;
          
          return (
            <div
              key={category.id}
              className={`border rounded-lg transition-all cursor-pointer ${
                isSelected 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-gray-700 hover:border-gray-600 bg-gray-800/50'
              }`}
              onClick={() => handleCategoryClick(category.id)}
            >
              {/* Category Header */}
              <div className="p-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center mr-3"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <category.icon 
                        className="w-5 h-5" 
                        style={{ color: category.color }}
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h4 className="text-sm font-semibold text-white">
                          {category.name}
                        </h4>
                        {category.liveIndicator && (
                          <span className="ml-2 flex items-center">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            <span className="text-xs text-green-400 ml-1">LIVE</span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {category.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRight 
                    className={`w-4 h-4 text-gray-500 transition-transform ${
                      isSelected ? 'rotate-90' : ''
                    }`}
                  />
                </div>

                {/* Data Stats */}
                <div className="flex items-center mt-3 space-x-4 text-xs">
                  <span className="flex items-center text-gray-400">
                    <Database className="w-3 h-3 mr-1" />
                    {category.availableData.sources} sources
                  </span>
                  <span className="flex items-center text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {category.availableData.timeRange}
                  </span>
                  <span className="flex items-center text-gray-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    {category.availableData.coverage}
                  </span>
                </div>

                {/* Active Indicator */}
                {isActive && (
                  <div className="mt-2 px-2 py-1 bg-green-900/30 rounded text-xs text-green-400 inline-block">
                    Active on Map
                  </div>
                )}
              </div>

              {/* Expanded Content */}
              {isSelected && (
                <div className="border-t border-gray-700 p-3 space-y-3 bg-black/20">
                  {/* Sample Questions */}
                  <div>
                    <h5 className="text-xs font-semibold text-gray-300 mb-2 flex items-center">
                      <BookOpen className="w-3 h-3 mr-1" />
                      Questions This Data Can Answer
                    </h5>
                    <div className="space-y-1">
                      {category.sampleQuestions.map((question, idx) => (
                        <div 
                          key={idx}
                          className="text-xs text-gray-400 pl-4 border-l-2 border-gray-700 hover:border-blue-500 hover:text-gray-300 transition-colors"
                        >
                          {question}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ripple Effects */}
                  {showRipples && (
                    <div>
                      <h5 className="text-xs font-semibold text-gray-300 mb-2 flex items-center">
                        <Zap className="w-3 h-3 mr-1 text-yellow-400" />
                        Ripple Effect Chains
                      </h5>
                      <div className="space-y-1">
                        {category.rippleEffects.map((effect, idx) => (
                          <div 
                            key={idx}
                            className="text-xs text-gray-400 bg-gradient-to-r from-purple-900/10 to-transparent p-2 rounded"
                          >
                            {effect}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Update Frequency */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Updates: {category.availableData.updateFrequency}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectCategory) {
                          onSelectCategory(category.id);
                        }
                      }}
                      className="text-blue-400 hover:text-blue-300 transition-colors font-medium px-2 py-1 rounded hover:bg-blue-900/20"
                    >
                      View All {category.availableData.sources} Sources →
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vision Statement */}
      <div className="p-4 border-t border-gray-700 bg-gradient-to-r from-blue-900/10 to-purple-900/10">
        <p className="text-xs text-gray-400 italic">
          "Every event creates ripples. WorldRipple reveals how a pandemic becomes an economic crisis, 
          how an invention reshapes society, and how a protest in one country sparks change worldwide."
        </p>
        <p className="text-xs text-gray-500 mt-2">
          — Tobie's Vision
        </p>
      </div>
    </div>
  );
};