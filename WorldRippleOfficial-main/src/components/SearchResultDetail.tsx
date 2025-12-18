import React, { useState } from 'react';
import { MapPin, Calendar, User, X, Globe, Layers, Clock, Info, TrendingUp, Users, ChevronDown, ChevronUp } from 'lucide-react';

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
  timestamp?: number;
}

interface SearchResultDetailProps {
  result: SearchResult;
  onClose?: () => void;
}

export const SearchResultDetail: React.FC<SearchResultDetailProps> = ({ result, onClose }) => {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const shouldTruncate = result.description.length > 150;
  const displayDescription = shouldTruncate && !isDescriptionExpanded
    ? result.description.slice(0, 150) + '...'
    : result.description;
  const getHeaderGradient = () => {
    switch (result.type) {
      case 'location':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-500/30';
      case 'event':
        return 'from-red-500/20 to-orange-500/20 border-red-500/30';
      case 'person':
        return 'from-purple-500/20 to-pink-500/20 border-purple-500/30';
      case 'year':
        return 'from-green-500/20 to-emerald-500/20 border-green-500/30';
      case 'layer':
        return 'from-amber-500/20 to-yellow-500/20 border-amber-500/30';
      default:
        return 'from-gray-500/20 to-slate-500/20 border-gray-500/30';
    }
  };

  const getIconColor = () => {
    switch (result.type) {
      case 'location':
        return 'text-blue-400 bg-blue-500/20';
      case 'event':
        return 'text-red-400 bg-red-500/20';
      case 'person':
        return 'text-purple-400 bg-purple-500/20';
      case 'year':
        return 'text-green-400 bg-green-500/20';
      case 'layer':
        return 'text-amber-400 bg-amber-500/20';
      default:
        return 'text-gray-400 bg-gray-500/20';
    }
  };

  const getIcon = () => {
    switch (result.type) {
      case 'location':
        return MapPin;
      case 'event':
        return Calendar;
      case 'person':
        return User;
      case 'year':
        return Clock;
      case 'layer':
        return Layers;
      default:
        return Info;
    }
  };

  const getTypeLabel = () => {
    switch (result.type) {
      case 'location':
        return 'Location';
      case 'event':
        return 'Historical Event';
      case 'person':
        return 'Historical Figure';
      case 'year':
        return 'Year';
      case 'layer':
        return 'Data Layer';
      default:
        return 'Information';
    }
  };

  const IconComponent = getIcon();
  const headerColor = getIconColor();

  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className={`bg-gradient-to-r ${getHeaderGradient()} border-b p-6`}>
        <div className="flex items-start justify-between mb-4">
          <h3 className={`text-sm font-semibold uppercase tracking-wider ${headerColor.split(' ')[0]}`}>
            {getTypeLabel()}
          </h3>
          {onClose && (
            <button
              onClick={onClose}
              className={`p-1.5 hover:bg-white/10 rounded-lg transition-colors`}
              aria-label="Close details"
            >
              <X className={`w-5 h-5 ${headerColor.split(' ')[0]}`} />
            </button>
          )}
        </div>
        <div className="flex items-start space-x-4">
          <div className={`p-3 rounded-lg ${headerColor}`}>
            <IconComponent className={`w-8 h-8 ${headerColor.split(' ')[0]}`} />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">{result.title}</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              {result.year && (
                <div className={`flex items-center text-gray-300`}>
                  <Calendar className={`w-4 h-4 mr-1.5 ${headerColor.split(' ')[0]}`} />
                  {result.year}
                </div>
              )}
              {result.coordinates && (
                <div className={`flex items-center text-gray-300`}>
                  <MapPin className={`w-4 h-4 mr-1.5 ${headerColor.split(' ')[0]}`} />
                  {result.coordinates[1].toFixed(2)}°N, {result.coordinates[0].toFixed(2)}°E
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Type Badge */}
        <div>
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${headerColor.replace('bg-', 'bg-').replace('/20', '/20')} ${headerColor.split(' ')[0]} border-opacity-30`}>
            {getTypeLabel()}
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
            <Info className={`w-5 h-5 mr-2 ${headerColor.split(' ')[0]}`} />
            About
          </h3>
          <p className="text-gray-300 leading-relaxed">{displayDescription}</p>
          {shouldTruncate && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className={`mt-2 flex items-center space-x-1 text-sm font-medium transition-colors ${headerColor.split(' ')[0]} hover:opacity-80`}
            >
              <span>{isDescriptionExpanded ? 'Show Less' : 'Show More'}</span>
              {isDescriptionExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          )}
        </div>

        {/* Person-specific content */}
        {result.type === 'person' && result.historicalPerson && (
          <>
            {result.historicalPerson.birthYear && result.historicalPerson.deathYear && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <Calendar className={`w-5 h-5 mr-2 ${headerColor.split(' ')[0]}`} />
                  Lifespan
                </h3>
                <p className="text-gray-300">
                  {result.historicalPerson.birthYear} - {result.historicalPerson.deathYear}
                  {' '}({result.historicalPerson.deathYear - result.historicalPerson.birthYear} years)
                </p>
              </div>
            )}

            {result.historicalPerson.achievements && result.historicalPerson.achievements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <TrendingUp className={`w-5 h-5 mr-2 ${headerColor.split(' ')[0]}`} />
                  Key Achievements
                </h3>
                <ul className="space-y-2">
                  {result.historicalPerson.achievements.map((achievement: string, index: number) => (
                    <li key={index} className="flex items-start">
                      <span className={`inline-block w-1.5 h-1.5 rounded-full ${headerColor} mt-2 mr-3`}></span>
                      <span className="text-gray-300 text-sm leading-relaxed">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {result.historicalPerson.occupation && (
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Occupation</h3>
                <p className="text-white font-medium">{result.historicalPerson.occupation}</p>
              </div>
            )}
          </>
        )}

        {/* Event-specific content */}
        {result.type === 'event' && result.historicalEvent && (
          <>
            {result.historicalEvent.significance && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
                  <TrendingUp className={`w-5 h-5 mr-2 ${headerColor.split(' ')[0]}`} />
                  Historical Significance
                </h3>
                <p className="text-gray-300 leading-relaxed">{result.historicalEvent.significance}</p>
              </div>
            )}

            {result.historicalEvent.participants && result.historicalEvent.participants.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                  <Users className={`w-5 h-5 mr-2 ${headerColor.split(' ')[0]}`} />
                  Key Participants
                </h3>
                <div className="space-y-2">
                  {result.historicalEvent.participants.map((participant: string, index: number) => (
                    <div key={index} className="flex items-center space-x-2">
                      <User className={`w-4 h-4 ${headerColor.split(' ')[0]}`} />
                      <span className="text-gray-300 text-sm">{participant}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.historicalEvent.location && (
              <div className="pt-4 border-t border-gray-700">
                <h3 className="text-sm font-semibold text-gray-400 mb-2">Location</h3>
                <p className="text-white font-medium">{result.historicalEvent.location}</p>
              </div>
            )}
          </>
        )}

        {/* Location Info */}
        {result.coordinates && (
          <div className="pt-4 border-t border-gray-700">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Coordinates</h3>
            <div className="flex items-center space-x-2">
              <Globe className={`w-4 h-4 ${headerColor.split(' ')[0]}`} />
              <p className="text-white font-mono text-sm">
                {result.coordinates[1].toFixed(4)}°N, {result.coordinates[0].toFixed(4)}°E
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
