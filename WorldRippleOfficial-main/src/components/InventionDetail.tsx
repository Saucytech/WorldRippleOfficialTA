import React from 'react';
import { Lightbulb, User, MapPin, Calendar, TrendingUp, Clock, X } from 'lucide-react';
import { Invention } from '../services/inventionsApi';

interface InventionDetailProps {
  invention: Invention;
  onClose?: () => void;
}

export const InventionDetail: React.FC<InventionDetailProps> = ({ invention, onClose }) => {
  return (
    <div className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-b border-yellow-500/30 p-6">
        <div className="flex items-start justify-between mb-4">
          <h3 className="text-sm font-semibold text-yellow-400 uppercase tracking-wider">Invention Details</h3>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-yellow-500/20 rounded-lg transition-colors"
              aria-label="Close invention details"
            >
              <X className="w-5 h-5 text-yellow-400" />
            </button>
          )}
        </div>
        <div className="flex items-start space-x-4">
          <div className="p-3 bg-yellow-500/20 rounded-lg">
            <Lightbulb className="w-8 h-8 text-yellow-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-white mb-2">{invention.name}</h2>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center text-gray-300">
                <User className="w-4 h-4 mr-1.5 text-yellow-400" />
                {invention.inventor}
              </div>
              <div className="flex items-center text-gray-300">
                <Calendar className="w-4 h-4 mr-1.5 text-yellow-400" />
                {invention.year}
              </div>
              <div className="flex items-center text-gray-300">
                <MapPin className="w-4 h-4 mr-1.5 text-yellow-400" />
                {invention.location.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Category Badge */}
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300 border border-yellow-500/30">
            {invention.category}
          </span>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
            <Lightbulb className="w-5 h-5 mr-2 text-yellow-400" />
            About
          </h3>
          <p className="text-gray-300 leading-relaxed">{invention.description}</p>
        </div>

        {/* Impact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-yellow-400" />
            Impact
          </h3>
          <p className="text-gray-300 leading-relaxed">{invention.impact}</p>
        </div>

        {/* Timeline */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
            <Clock className="w-5 h-5 mr-2 text-yellow-400" />
            Historical Timeline
          </h3>
          <div className="space-y-3">
            {invention.timeline.map((event, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-16 text-sm font-medium text-yellow-400">
                  {event.year}
                </div>
                <div className="flex-1">
                  <div className="relative pl-4 pb-3 border-l-2 border-gray-700 last:border-l-0">
                    <div className="absolute left-0 top-0 w-2 h-2 bg-yellow-400 rounded-full -translate-x-[5px]" />
                    <p className="text-gray-300 text-sm leading-relaxed">{event.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Info */}
        <div className="pt-4 border-t border-gray-700">
          <h3 className="text-sm font-semibold text-gray-400 mb-2">Location Details</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Country:</span>
              <p className="text-white font-medium">{invention.location.country}</p>
            </div>
            <div>
              <span className="text-gray-500">City:</span>
              <p className="text-white font-medium">{invention.location.name}</p>
            </div>
            <div className="col-span-2">
              <span className="text-gray-500">Coordinates:</span>
              <p className="text-white font-mono text-xs">
                {invention.location.coordinates[1].toFixed(4)}°N, {invention.location.coordinates[0].toFixed(4)}°E
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
