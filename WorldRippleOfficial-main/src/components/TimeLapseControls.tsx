import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Play, Pause, SkipBack, SkipForward, FastForward, Rewind, Clock } from 'lucide-react';
import { layerEventsService } from '../services/layerEvents';

interface TimeLapseControlsProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  minYear?: number;
  maxYear?: number;
  activeLayers?: string[];
  majorEvents?: Array<{
    year: number;
    title: string;
    type: 'war' | 'pandemic' | 'invention' | 'economic' | 'disaster' | 'social';
  }>;
}

const DEFAULT_EVENTS = [
  { year: -3000, title: 'Bronze Age begins', type: 'social' as const },
  { year: -776, title: 'First Olympic Games', type: 'social' as const },
  { year: -221, title: 'Great Wall of China construction', type: 'social' as const },
  { year: 476, title: 'Fall of Western Roman Empire', type: 'war' as const },
  { year: 1347, title: 'Black Death pandemic', type: 'pandemic' as const },
  { year: 1492, title: 'Columbus reaches Americas', type: 'social' as const },
  { year: 1760, title: 'Industrial Revolution begins', type: 'invention' as const },
  { year: 1914, title: 'World War I begins', type: 'war' as const },
  { year: 1918, title: 'Spanish Flu pandemic', type: 'pandemic' as const },
  { year: 1929, title: 'Great Depression', type: 'economic' as const },
  { year: 1939, title: 'World War II begins', type: 'war' as const },
  { year: 1969, title: 'Moon landing', type: 'invention' as const },
  { year: 1989, title: 'Fall of Berlin Wall', type: 'social' as const },
  { year: 2008, title: 'Global Financial Crisis', type: 'economic' as const },
  { year: 2020, title: 'COVID-19 pandemic', type: 'pandemic' as const }
];

export const TimeLapseControls: React.FC<TimeLapseControlsProps> = ({
  currentYear,
  onYearChange,
  minYear = -5000,
  maxYear = 2024,
  activeLayers = [],
  majorEvents
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1); // 1x, 2x, 5x, 10x, 25x, 50x, 100x
  const [showEventMarkers, setShowEventMarkers] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Get events based on active layers or use defaults
  const displayEvents = useMemo(() => {
    if (activeLayers && activeLayers.length > 0) {
      // Get layer events for active layers
      const layerEvents = layerEventsService.getEventsByLayers(activeLayers);
      // Convert to display format and sort by year
      return layerEvents
        .map(event => ({
          year: event.year,
          title: event.title,
          type: event.layerType as any,
          icon: event.icon,
          magnitude: event.magnitude
        }))
        .sort((a, b) => a.year - b.year);
    } else if (majorEvents) {
      return majorEvents;
    } else {
      return DEFAULT_EVENTS;
    }
  }, [activeLayers, majorEvents]);

  const speeds = [
    { value: 1, label: '1x' },
    { value: 2, label: '2x' },
    { value: 5, label: '5x' },
    { value: 10, label: '10x' },
    { value: 25, label: '25x' },
    { value: 50, label: '50x' },
    { value: 100, label: '100x' }
  ];

  useEffect(() => {
    if (isPlaying) {
      // Clear any existing interval
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }

      // Calculate interval based on speed
      const baseInterval = 100; // Base: 100ms per year
      const interval = baseInterval / playbackSpeed;

      intervalRef.current = setInterval(() => {
        onYearChange(prev => {
          const nextYear = prev + playbackSpeed;
          if (nextYear >= maxYear) {
            setIsPlaying(false);
            return maxYear;
          }
          return nextYear;
        });
      }, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, playbackSpeed, maxYear, onYearChange]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSpeedChange = () => {
    const currentIndex = speeds.findIndex(s => s.value === playbackSpeed);
    const nextIndex = (currentIndex + 1) % speeds.length;
    setPlaybackSpeed(speeds[nextIndex].value);
  };

  const jumpToEvent = (year: number) => {
    onYearChange(year);
    setIsPlaying(false);
  };

  const skipBackward = () => {
    const prevEvent = [...displayEvents]
      .reverse()
      .find(e => e.year < currentYear);
    if (prevEvent) {
      jumpToEvent(prevEvent.year);
    } else {
      onYearChange(minYear);
    }
  };

  const skipForward = () => {
    const nextEvent = displayEvents.find(e => e.year > currentYear);
    if (nextEvent) {
      jumpToEvent(nextEvent.year);
    } else {
      onYearChange(maxYear);
    }
  };

  const getEventTypeColor = (type: string) => {
    const colors = {
      war: '#DC2626',
      pandemic: '#EF4444',
      invention: '#06B6D4',
      economic: '#F59E0B',
      disaster: '#F97316',
      social: '#EC4899'
    };
    return colors[type as keyof typeof colors] || '#6B7280';
  };

  return (
    <div className="bg-black/80 backdrop-blur-md rounded-xl border border-gray-700 p-4 shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          <span className="text-sm font-medium text-white">Time-Lapse Mode</span>
        </div>
        <button
          onClick={handleSpeedChange}
          className="px-3 py-1 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 rounded-md text-sm font-medium transition-colors"
        >
          {speeds.find(s => s.value === playbackSpeed)?.label}
        </button>
      </div>

      {/* Current Year Display */}
      <div className="text-center mb-4">
        <div className="text-3xl font-bold text-white">{currentYear}</div>
        <div className="text-xs text-gray-400">
          {currentYear < 0 ? `${Math.abs(currentYear)} BCE` : `${currentYear} CE`}
        </div>
      </div>

      {/* Timeline Slider */}
      <div className="relative mb-4">
        <input
          type="range"
          min={minYear}
          max={maxYear}
          value={currentYear}
          onChange={(e) => {
            onYearChange(Number(e.target.value));
            setIsPlaying(false);
          }}
          className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
              ((currentYear - minYear) / (maxYear - minYear)) * 100
            }%, #374151 ${
              ((currentYear - minYear) / (maxYear - minYear)) * 100
            }%, #374151 100%)`
          }}
        />
        
        {/* Event Markers */}
        {showEventMarkers && (
          <div className="absolute top-0 left-0 w-full h-2 pointer-events-none">
            {displayEvents.map(event => {
              const position = ((event.year - minYear) / (maxYear - minYear)) * 100;
              return (
                <div
                  key={event.year}
                  className="absolute top-0 w-1 h-2 cursor-pointer pointer-events-auto"
                  style={{
                    left: `${position}%`,
                    backgroundColor: getEventTypeColor(event.type),
                    transform: 'translateX(-50%)'
                  }}
                  onClick={() => jumpToEvent(event.year)}
                  title={`${event.year}: ${event.title}`}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center gap-2 mb-4">
        <button
          onClick={skipBackward}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          title="Previous Event"
        >
          <SkipBack className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={() => onYearChange(Math.max(minYear, currentYear - 100))}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          title="Back 100 Years"
        >
          <Rewind className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={handlePlayPause}
          className={`p-3 rounded-lg transition-all ${
            isPlaying
              ? 'bg-red-600 hover:bg-red-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 text-white" />
          ) : (
            <Play className="w-5 h-5 text-white" />
          )}
        </button>

        <button
          onClick={() => onYearChange(Math.min(maxYear, currentYear + 100))}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          title="Forward 100 Years"
        >
          <FastForward className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={skipForward}
          className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
          title="Next Event"
        >
          <SkipForward className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Quick Jump to Events */}
      <div className="border-t border-gray-700 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-gray-400">Quick Jump</span>
          <button
            onClick={() => setShowEventMarkers(!showEventMarkers)}
            className="text-xs text-blue-400 hover:text-blue-300"
          >
            {showEventMarkers ? 'Hide' : 'Show'} Markers
          </button>
        </div>
        <div className="grid grid-cols-2 gap-1 max-h-32 overflow-y-auto">
          {displayEvents
            .filter(e => Math.abs(e.year - currentYear) > 10)
            .slice(0, 6)
            .map(event => (
              <button
                key={event.year}
                onClick={() => jumpToEvent(event.year)}
                className="text-left px-2 py-1 rounded hover:bg-gray-700 transition-colors group"
              >
                <div className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: getEventTypeColor(event.type) }}
                  />
                  <span className="text-xs text-gray-300 group-hover:text-white truncate">
                    {event.year}: {event.title}
                  </span>
                </div>
              </button>
            ))}
        </div>
      </div>

      {/* Status Bar */}
      {isPlaying && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-xs text-green-400">Playing</span>
            </div>
            <span className="text-xs text-gray-400">
              Speed: {playbackSpeed}x
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TimeLapseControls;