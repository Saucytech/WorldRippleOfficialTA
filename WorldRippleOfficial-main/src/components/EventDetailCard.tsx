import React, { useState } from 'react';
import { X, Calendar, MapPin, TrendingUp, ChevronRight, ChevronDown, Sparkles } from 'lucide-react';
import { layerEventsService, LayerEvent } from '../services/layerEvents';

interface EventDetailCardProps {
  categoryId: string;
  onClose: () => void;
  onEventClick?: (event: LayerEvent) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const EventDetailCard: React.FC<EventDetailCardProps> = ({ 
  categoryId, 
  onClose, 
  onEventClick,
  isCollapsed = false,
  onToggleCollapse
}) => {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  
  // Get events for the category
  const events = layerEventsService.getEventsByLayers([categoryId]);
  const sortedEvents = events.sort((a, b) => a.year - b.year);
  const layerColor = layerEventsService.getLayerColor(categoryId);
  
  // Get category name
  const categoryNames: Record<string, string> = {
    politics: 'Politics & Power',
    disease: 'Health & Pandemics',
    housing: 'Housing & Urban',
    environment: 'Climate & Disasters',
    economy: 'Economics & Trade',
    innovation: 'Innovation & Technology',
    social: 'Social Movements'
  };
  
  const categoryName = categoryNames[categoryId] || categoryId;

  return (
    <>
      {/* Collapse/Expand Button - attached to the left */}
      {onToggleCollapse && (
        <button
          onClick={onToggleCollapse}
          className={`fixed ${isCollapsed ? 'left-0' : 'left-96'} top-24 z-50 p-2 bg-gray-800 hover:bg-gray-700 text-white ${isCollapsed ? 'rounded-r-lg' : 'rounded-r-lg -ml-[1px]'} transition-all duration-300 border border-l-0 border-gray-600 shadow-lg`}
          title={isCollapsed ? 'Show Events' : 'Hide Events'}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isCollapsed ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            )}
          </svg>
        </button>
      )}
      
      <div className={`absolute top-4 ${isCollapsed ? '-left-96' : 'left-4'} z-50 w-96 bg-gray-900/95 backdrop-blur-sm border border-gray-700 rounded-lg shadow-2xl max-h-[calc(100vh-120px)] overflow-hidden flex flex-col transition-all duration-300`}>
      {/* Header */}
      <div className="p-4 border-b border-gray-700 bg-gradient-to-r from-gray-800 to-gray-900">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white flex items-center">
            <div 
              className="w-8 h-8 rounded-full mr-3 flex items-center justify-center"
              style={{ backgroundColor: layerColor }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            {categoryName}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
        <p className="text-sm text-gray-400">
          {sortedEvents.length} historical events • Sorted chronologically
        </p>
      </div>

      {/* Events List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sortedEvents.map((event, index) => (
          <div
            key={event.id}
            className={`border rounded-lg transition-all cursor-pointer ${
              expandedEvent === event.id 
                ? 'border-blue-500 bg-gray-800/50' 
                : 'border-gray-700 hover:border-gray-600 bg-gray-800/30'
            }`}
            onClick={() => {
              setExpandedEvent(expandedEvent === event.id ? null : event.id);
              if (onEventClick) onEventClick(event);
            }}
          >
            <div className="p-3">
              <div className="flex items-start">
                {/* Number indicator */}
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mr-3 flex-shrink-0"
                  style={{ 
                    backgroundColor: `${layerColor}20`,
                    color: layerColor,
                    border: `2px solid ${layerColor}`
                  }}
                >
                  {index + 1}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white text-sm flex items-center">
                      <span className="mr-2">{event.icon}</span>
                      {event.title}
                    </h3>
                    <button className="text-gray-500">
                      {expandedEvent === event.id ? 
                        <ChevronDown className="w-4 h-4" /> : 
                        <ChevronRight className="w-4 h-4" />
                      }
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {event.year}
                    </span>
                    <span className="flex items-center">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Magnitude: {event.magnitude}/10
                    </span>
                  </div>
                  
                  {/* Expanded content */}
                  {expandedEvent === event.id && (
                    <div className="mt-3 space-y-3">
                      <p className="text-xs text-gray-300 leading-relaxed">
                        {event.description}
                      </p>
                      
                      <div className="flex items-center text-xs text-gray-400">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.date}
                      </div>
                      
                      {event.rippleEffects && event.rippleEffects.length > 0 && (
                        <div className="pt-3 border-t border-gray-700">
                          <h4 className="text-xs font-semibold text-gray-400 mb-2">
                            Ripple Effects:
                          </h4>
                          <ul className="space-y-1">
                            {event.rippleEffects.map((effect, idx) => (
                              <li key={idx} className="text-xs text-gray-300 flex items-start">
                                <span className="text-blue-400 mr-2">→</span>
                                {effect}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-700 bg-gray-800/50">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Scroll to explore all events</span>
          <span className="text-blue-400">Click event to focus on map</span>
        </div>
      </div>
    </div>
    </>
  );
};