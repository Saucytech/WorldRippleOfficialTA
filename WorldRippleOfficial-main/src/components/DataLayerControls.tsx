import React from 'react';
import { Eye, EyeOff, Activity, Home, Leaf, Vote, TrendingUp, Heart, Info, Database, Factory } from 'lucide-react';
import { DataLayer } from '../App';
import { LayerDataPoint } from '../hooks/useDataCommons';

interface DataLayerControlsProps {
  dataLayers: DataLayer[];
  onToggleLayer: (layerId: string) => void;
  onUpdateIntensity: (layerId: string, intensity: number) => void;
  realData?: Map<string, LayerDataPoint[]>;
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

export const DataLayerControls: React.FC<DataLayerControlsProps> = ({
  dataLayers,
  onToggleLayer,
  onUpdateIntensity,
  realData
}) => {
  return (
    <div className="h-full p-6 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-2">Data Layers</h2>
        <p className="text-sm text-gray-400">
          Toggle and adjust the intensity of data layers to explore interconnections
        </p>
      </div>

      <div className="space-y-4">
        {dataLayers.map(layer => {
          const IconComponent = layerIcons[layer.id as keyof typeof layerIcons] || Activity;
          const hasRealData = realData?.has(layer.id);
          const layerDataPoints = realData?.get(layer.id) || [];
          
          return (
            <div
              key={layer.id}
              className={`p-4 rounded-lg border transition-all duration-200 ${
                layer.isActive
                  ? 'bg-gray-800/80 border-gray-600'
                  : 'bg-gray-900/50 border-gray-700 hover:bg-gray-800/40'
              }`}
            >
              {/* Layer Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full border-2"
                    style={{
                      backgroundColor: layer.isActive ? layer.color : 'transparent',
                      borderColor: layer.color
                    }}
                  />
                  <IconComponent className="w-5 h-5 text-gray-300" />
                  <h3 className="font-semibold text-white">{layer.name}</h3>
                </div>
                
                <button
                  onClick={() => onToggleLayer(layer.id)}
                  className={`p-2 rounded-lg transition-colors ${
                    layer.isActive
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                  }`}
                  title={layer.isActive ? 'Hide layer' : 'Show layer'}
                >
                  {layer.isActive ? (
                    <Eye className="w-4 h-4" />
                  ) : (
                    <EyeOff className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Layer Description */}
              <p className="text-xs text-gray-400 mb-3 leading-relaxed">
                {layer.description}
              </p>

              {/* Intensity Slider */}
              {layer.isActive && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-gray-300">
                      Intensity
                    </label>
                    <span className="text-xs text-gray-400">
                      {Math.round(layer.intensity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={layer.intensity}
                    onChange={(e) => onUpdateIntensity(layer.id, parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, ${layer.color} 0%, ${layer.color} ${layer.intensity * 100}%, #374151 ${layer.intensity * 100}%, #374151 100%)`
                    }}
                  />
                </div>
              )}

              {/* Data Points Count */}
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-700">
                <div className="flex items-center space-x-1">
                  {hasRealData ? (
                    <Database className="w-3 h-3 text-green-500" />
                  ) : (
                    <Info className="w-3 h-3 text-gray-500" />
                  )}
                  <span className="text-xs text-gray-500">
                    {hasRealData ? `${layerDataPoints.length} data sources` : 'Mock data'}
                  </span>
                </div>
                {layer.isActive && (
                  <div className="flex items-center space-x-1">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: layer.color }}
                    />
                    <span className="text-xs text-gray-400">Active</span>
                  </div>
                )}
              </div>
              
              {/* Real Data Indicator */}
              {hasRealData && layer.isActive && (
                <div className="mt-2 text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">
                  ✓ {layer.id === 'housing' ? 'Real-time data from US Census Bureau' : 'Real-time data from Data Commons'}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="mt-8 pt-6 border-t border-gray-700">
        <h3 className="text-sm font-semibold text-white mb-3">Quick Actions</h3>
        <div className="space-y-2">
          <button
            onClick={() => {
              dataLayers.forEach(layer => {
                if (!layer.isActive) onToggleLayer(layer.id);
              });
            }}
            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            Show All Layers
          </button>
          <button
            onClick={() => {
              dataLayers.forEach(layer => {
                if (layer.isActive) onToggleLayer(layer.id);
              });
            }}
            className="w-full py-2 px-3 bg-gray-700 hover:bg-gray-600 text-white text-sm rounded-lg transition-colors"
          >
            Hide All Layers
          </button>
        </div>
      </div>
    </div>
  );
};