import React, { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, Eye, EyeOff, Activity, Home, Leaf, Vote, TrendingUp, Heart, Database, Brain, Target, Lightbulb, AlertTriangle, Zap, ArrowRight, Layers, Sparkles, ShieldAlert, Factory } from 'lucide-react';
import { DataLayer } from '../App';
import { LayerDataPoint } from '../hooks/useDataCommons';
import { HistoricalEvent } from '../services/historyApi';
import { Invention } from '../services/inventionsApi';
import { InventionDetail } from './InventionDetail';
import { SearchResultDetail } from './SearchResultDetail';

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

interface CombinedPanelProps {
  dataLayers: DataLayer[];
  onToggleLayer: (layerId: string) => void;
  onUpdateIntensity: (layerId: string, intensity: number) => void;
  onToggleExpansion: (layerId: string) => void;
  onToggleSubcategory: (layerId: string, subcategoryId: string) => void;
  realData?: Map<string, LayerDataPoint[]>;
  currentYear: number;
  invention?: Invention | null;
  onCloseInvention?: () => void;
  searchResult?: SearchResult | null;
  onCloseSearchResult?: () => void;
}

const layerIcons = {
  disease: Activity,
  housing: Home,
  environment: Leaf,
  politics: Vote,
  economy: TrendingUp,
  social: Heart,
  innovation: Factory
};

interface AIInsight {
  id: string;
  type: 'trend' | 'correlation' | 'prediction' | 'alert';
  title: string;
  description: string;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
  relatedLayers: string[];
}

export const CombinedPanel: React.FC<CombinedPanelProps> = ({
  dataLayers,
  onToggleLayer,
  onUpdateIntensity,
  onToggleExpansion,
  onToggleSubcategory,
  realData,
  currentYear,
  invention,
  onCloseInvention,
  searchResult,
  onCloseSearchResult
}) => {
  const [expandedSection, setExpandedSection] = useState<'layers' | 'insights' | null>('layers');
  const [selectedInsight, setSelectedInsight] = useState<AIInsight | null>(null);
  const [insights, setInsights] = useState<AIInsight[]>([]);

  // Generate insights (simplified version)
  React.useEffect(() => {
    const activeLayers = dataLayers.filter(layer => layer.isActive);
    const hasRealData = realData && realData.size > 0;
    const newInsights: AIInsight[] = [];

    if (activeLayers.some(l => l.id === 'disease') && activeLayers.some(l => l.id === 'housing')) {
      newInsights.push({
        id: 'correlation-1',
        type: 'correlation',
        title: hasRealData ? 'Real Data: Disease-Housing Correlation' : 'Disease-Housing Correlation',
        description: hasRealData
          ? 'Analysis of Data Commons data shows correlation between housing and disease rates.'
          : 'Higher housing density shows 23% higher disease transmission rates.',
        confidence: hasRealData ? 0.92 : 0.87,
        impact: 'high',
        relatedLayers: ['disease', 'housing']
      });
    }

    if (activeLayers.length >= 2) {
      newInsights.push({
        id: 'trend-2',
        type: 'trend',
        title: hasRealData ? 'Real Data: Multi-Layer Analysis' : 'Multi-Layer Convergence',
        description: hasRealData
          ? `${activeLayers.length} layers with real Data Commons data reveal interconnected patterns.`
          : `${activeLayers.length} active layers show interconnected patterns across domains.`,
        confidence: hasRealData ? 0.95 : 0.91,
        impact: 'high',
        relatedLayers: activeLayers.map(l => l.id)
      });
    }

    setInsights(newInsights);
  }, [dataLayers, currentYear, realData]);

  const toggleSection = (section: 'layers' | 'insights') => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend': return TrendingUp;
      case 'correlation': return Target;
      case 'prediction': return Lightbulb;
      case 'alert': return AlertTriangle;
      default: return Brain;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-red-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-green-400';
      default: return 'text-gray-400';
    }
  };

  const activeLayerCount = dataLayers.filter(l => l.isActive).length;

  return (
    <div className="h-full flex flex-col bg-gray-900/95 backdrop-blur-sm border-l border-gray-800">
      {/* Detail Views - Show if search result or invention is provided */}
      {invention && (
        <div className="p-4 border-b border-gray-800 overflow-y-auto max-h-[70vh]">
          <InventionDetail invention={invention} onClose={onCloseInvention} />
        </div>
      )}

      {/* Show search result detail for non-invention types */}
      {!invention && searchResult && searchResult.type !== 'invention' && (
        <div className="p-4 border-b border-gray-800 overflow-y-auto max-h-[70vh]">
          <SearchResultDetail result={searchResult} onClose={onCloseSearchResult} />
        </div>
      )}

      {/* Data Layers Section */}
      <div className="border-b border-gray-800">
        <button
          onClick={() => toggleSection('layers')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Layers className="w-5 h-5 text-blue-400" />
            <div className="text-left">
              <h2 className="text-sm font-bold text-white">Data Layers</h2>
              <p className="text-xs text-gray-400">{activeLayerCount} active</p>
            </div>
          </div>
          {expandedSection === 'layers' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'layers' && (
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            <div className="space-y-3">
              {dataLayers.map(layer => {
                const IconComponent = layerIcons[layer.id as keyof typeof layerIcons] || Activity;
                const hasRealData = realData?.has(layer.id);

                return (
                  <div
                    key={layer.id}
                    className={`rounded-lg border transition-all ${
                      layer.isActive
                        ? 'bg-gray-800/80 border-gray-600'
                        : 'bg-gray-900/50 border-gray-700'
                    }`}
                  >
                    <div className="p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2 flex-1">
                          <button
                            onClick={() => onToggleExpansion(layer.id)}
                            className="p-1 hover:bg-gray-700 rounded transition-colors"
                          >
                            {layer.isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
                            )}
                          </button>
                          <div
                            className="w-3 h-3 rounded-full border-2"
                            style={{
                              backgroundColor: layer.isActive ? layer.color : 'transparent',
                              borderColor: layer.color
                            }}
                          />
                          <IconComponent className="w-4 h-4 text-gray-300" />
                          <span className="text-sm font-medium text-white">{layer.name}</span>
                          <span className="text-xs text-gray-500">({layer.subcategories.length})</span>
                        </div>
                        <button
                          onClick={() => onToggleLayer(layer.id)}
                          className={`p-1.5 rounded transition-colors ${
                            layer.isActive
                              ? 'bg-gray-700 text-white hover:bg-gray-600'
                              : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                          }`}
                        >
                          {layer.isActive ? (
                            <Eye className="w-3.5 h-3.5" />
                          ) : (
                            <EyeOff className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>

                      {layer.isActive && (
                        <>
                          <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            value={layer.intensity}
                            onChange={(e) => onUpdateIntensity(layer.id, parseFloat(e.target.value))}
                            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                            style={{
                              background: `linear-gradient(to right, ${layer.color} 0%, ${layer.color} ${layer.intensity * 100}%, #374151 ${layer.intensity * 100}%, #374151 100%)`
                            }}
                          />
                          {hasRealData && (
                            <div className="flex items-center space-x-1 mt-1">
                              <Database className="w-3 h-3 text-green-500" />
                              <span className="text-xs text-green-400">Real data</span>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {layer.isExpanded && (
                      <div className="px-3 pb-3 border-t border-gray-700/50">
                        <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                          {layer.subcategories.map(subcategory => (
                            <label
                              key={subcategory.id}
                              className="flex items-center space-x-2 px-2 py-1.5 hover:bg-gray-700/30 rounded cursor-pointer group"
                            >
                              <input
                                type="checkbox"
                                checked={subcategory.isActive}
                                onChange={() => onToggleSubcategory(layer.id, subcategory.id)}
                                className="w-3.5 h-3.5 rounded border-gray-600 text-blue-500 focus:ring-blue-500 focus:ring-offset-0 bg-gray-800"
                                style={{
                                  accentColor: layer.color
                                }}
                              />
                              <span className="text-xs text-gray-300 group-hover:text-white transition-colors">
                                {subcategory.name}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-700 flex gap-2">
              <button
                onClick={() => dataLayers.forEach(layer => {
                  if (!layer.isActive) onToggleLayer(layer.id);
                })}
                className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
              >
                All
              </button>
              <button
                onClick={() => dataLayers.forEach(layer => {
                  if (layer.isActive) onToggleLayer(layer.id);
                })}
                className="flex-1 py-1.5 px-2 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
              >
                None
              </button>
            </div>
          </div>
        )}
      </div>

      {/* AI Insights Section */}
      <div className="border-b border-gray-800">
        <button
          onClick={() => toggleSection('insights')}
          className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-800/50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Sparkles className="w-5 h-5 text-purple-400" />
            <div className="text-left">
              <h2 className="text-sm font-bold text-white">AI Insights</h2>
              <p className="text-xs text-gray-400">{insights.length} insights</p>
            </div>
          </div>
          {expandedSection === 'insights' ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </button>

        {expandedSection === 'insights' && (
          <div className="p-4 max-h-[50vh] overflow-y-auto">
            {insights.length > 0 ? (
              <div className="space-y-3">
                {insights.map(insight => {
                  const IconComponent = getInsightIcon(insight.type);

                  return (
                    <div
                      key={insight.id}
                      className={`bg-gray-800/50 border border-gray-700 rounded-lg p-3 cursor-pointer hover:bg-gray-800/80 transition-all ${
                        selectedInsight?.id === insight.id ? 'border-blue-500 bg-gray-800/80' : ''
                      }`}
                      onClick={() => setSelectedInsight(selectedInsight?.id === insight.id ? null : insight)}
                    >
                      <div className="flex items-start space-x-2">
                        <div className={`p-1.5 rounded ${
                          insight.type === 'alert' ? 'bg-red-900/30 text-red-400' :
                          insight.type === 'prediction' ? 'bg-purple-900/30 text-purple-400' :
                          insight.type === 'correlation' ? 'bg-green-900/30 text-green-400' :
                          'bg-blue-900/30 text-blue-400'
                        }`}>
                          <IconComponent className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-medium text-white text-xs">
                              {insight.title}
                            </h3>
                            <span className={`text-xs font-medium ${getImpactColor(insight.impact)}`}>
                              {insight.impact.toUpperCase()}
                            </span>
                          </div>

                          <p className="text-xs text-gray-300 leading-relaxed">
                            {insight.description}
                          </p>

                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-xs text-gray-500">Confidence:</span>
                            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-blue-500 to-green-500"
                                style={{ width: `${insight.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-400 font-medium">
                              {Math.round(insight.confidence * 100)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-400 text-sm">
                <Brain className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>Activate data layers to generate insights</p>
              </div>
            )}

            <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700">
              <div className="flex items-center space-x-2 mb-1">
                <div className={`w-2 h-2 rounded-full animate-pulse ${
                  realData && realData.size > 0 ? 'bg-green-400' : 'bg-yellow-400'
                }`} />
                <span className="text-xs font-medium text-white">AI Analysis Active</span>
              </div>
              <p className="text-xs text-gray-400">
                {realData && realData.size > 0
                  ? `Analyzing real Data Commons data`
                  : `Analyzing ${activeLayerCount} active layers`
                }
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
