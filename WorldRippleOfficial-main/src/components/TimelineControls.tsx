import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Clock } from 'lucide-react';
import { getAllTimelineEvents, getEventsForYear, getMajorTimelineEvents } from '../services/timelineEvents';

interface TimelineControlsProps {
  currentYear: number;
  onYearChange: (year: number) => void;
  onEventFocus?: (coordinates: [number, number], eventData: any) => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentYear,
  onYearChange,
  onEventFocus
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const minYear = -5000;
  const maxYear = 2024;
  const [displayRange, setDisplayRange] = useState({ min: 1900, max: 2024 });
  const allEvents = React.useMemo(() => getAllTimelineEvents(), []);
  const majorEvents = React.useMemo(() => getMajorTimelineEvents(), []);
  
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        onYearChange((prevYear: number) => {
          const nextYear = prevYear + (playbackSpeed > 2 ? 5 : 1);
          
          if (nextYear > displayRange.max) {
            setIsPlaying(false);
            return displayRange.max;
          }
          
          // Check for events at this year and focus on them
          const yearEvents = getEventsForYear(nextYear);
          if (yearEvents.length > 0 && onEventFocus) {
            const event = yearEvents[0];
            if (event.coordinates) {
              onEventFocus(event.coordinates, event);
            }
          }
          
          return nextYear;
        });
      }, 1000 / playbackSpeed);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, onYearChange, displayRange.max, onEventFocus]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    onYearChange(displayRange.min);
  };

  const handleYearChange = (year: number) => {
    const clampedYear = Math.max(displayRange.min, Math.min(displayRange.max, year));
    onYearChange(clampedYear);
    
    // Check for events at this year
    const yearEvents = getEventsForYear(clampedYear);
    if (yearEvents.length > 0 && onEventFocus) {
      const event = yearEvents[0];
      if (event.coordinates) {
        onEventFocus(event.coordinates, event);
      }
    }
  };

  // Get visible events for current range
  const visibleEvents = React.useMemo(() => {
    return allEvents.filter(event => 
      event.year >= displayRange.min && event.year <= displayRange.max
    );
  }, [allEvents, displayRange]);

  return (
    <div className="relative">
      {/* Timeline Panel */}
      <div
        className={`absolute bottom-0 left-0 transition-all duration-300 ease-in-out ${
          isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
        style={{ width: '600px' }}
      >
        <div className="bg-black/80 backdrop-blur-md rounded-xl p-6 border border-gray-700 mb-2">
          {/* Timeline Slider */}
          <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-gray-300">Timeline</span>
          <span className="text-lg font-bold text-white">{currentYear}</span>
        </div>
        
        {/* Main Timeline */}
        <div className="relative">
          <input
            type="range"
            min={displayRange.min}
            max={displayRange.max}
            value={currentYear}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer timeline-slider"
          />
          
          {/* Event Markers - Show more events */}
          <div className="absolute top-0 left-0 w-full h-3 pointer-events-none">
            {visibleEvents.map((event, idx) => {
              const position = ((event.year - displayRange.min) / (displayRange.max - displayRange.min)) * 100;
              // Only show every nth event to avoid overcrowding
              const shouldShow = visibleEvents.length < 30 || idx % Math.ceil(visibleEvents.length / 30) === 0;
              if (!shouldShow) return null;
              
              return (
                <div
                  key={`${event.year}-${idx}`}
                  className="absolute transform -translate-x-1/2 group"
                  style={{ left: `${position}%` }}
                >
                  <div
                    className="w-2 h-2 rounded-full border border-white shadow-lg transition-all hover:scale-150"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/95 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-50">
                    <div className="font-bold">{event.year}: {event.label}</div>
                    {event.description && (
                      <div className="text-xs text-gray-300 max-w-xs">
                        {event.description.substring(0, 50)}...
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Year Labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{displayRange.min}</span>
          <span>{Math.round(displayRange.min + (displayRange.max - displayRange.min) * 0.33)}</span>
          <span>{Math.round(displayRange.min + (displayRange.max - displayRange.min) * 0.66)}</span>
          <span>{displayRange.max}</span>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleReset}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            title="Reset to start"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          
          <button
            onClick={() => handleYearChange(currentYear - 10)}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            title="Back 10 years"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button
            onClick={handlePlay}
            className={`p-3 rounded-lg transition-colors ${
              isPlaying 
                ? 'bg-red-600 hover:bg-red-700 text-white' 
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
          </button>
          
          <button
            onClick={() => handleYearChange(currentYear + 10)}
            className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            title="Forward 10 years"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Playback Speed */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-400">Speed:</span>
          <select
            value={playbackSpeed}
            onChange={(e) => setPlaybackSpeed(parseFloat(e.target.value))}
            className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-400"
          >
            <option value={0.5}>0.5x</option>
            <option value={1}>1x</option>
            <option value={2}>2x</option>
            <option value={5}>5x</option>
            <option value={10}>10x</option>
          </select>
        </div>
      </div>

      {/* Current Era Info & Range Selector */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex justify-between items-center mb-2">
          <div className="text-xs text-gray-400">
            {currentYear < 0 && "Ancient Era"}
            {currentYear >= 0 && currentYear < 500 && "Classical Era"}
            {currentYear >= 500 && currentYear < 1000 && "Medieval Era"}
            {currentYear >= 1000 && currentYear < 1500 && "Late Medieval"}
            {currentYear >= 1500 && currentYear < 1800 && "Early Modern"}
            {currentYear >= 1800 && currentYear < 1900 && "Industrial Era"}
            {currentYear >= 1900 && currentYear < 1950 && "Early 20th Century"}
            {currentYear >= 1950 && currentYear < 1990 && "Post-War Period"}
            {currentYear >= 1990 && currentYear < 2000 && "Digital Revolution"}
            {currentYear >= 2000 && currentYear < 2020 && "Information Age"}
            {currentYear >= 2020 && "Modern Era"}
          </div>
          <select
            value={`${displayRange.min}-${displayRange.max}`}
            onChange={(e) => {
              const [min, max] = e.target.value.split('-').map(Number);
              setDisplayRange({ min, max });
              if (currentYear < min || currentYear > max) {
                onYearChange(min);
              }
            }}
            className="bg-gray-700 text-white text-xs px-2 py-1 rounded border border-gray-600 focus:outline-none focus:border-blue-400"
          >
            <option value="-5000-2024">All Time</option>
            <option value="-3000-0">Ancient</option>
            <option value="0-1000">Classical</option>
            <option value="1000-1500">Medieval</option>
            <option value="1500-1800">Early Modern</option>
            <option value="1800-1900">19th Century</option>
            <option value="1900-2024">20th-21st Century</option>
            <option value="1900-1950">Early 20th</option>
            <option value="1950-2000">Late 20th</option>
            <option value="2000-2024">21st Century</option>
          </select>
        </div>
        
        {/* Current Events Display */}
        {getEventsForYear(currentYear).length > 0 && (
          <div className="mt-2 p-2 bg-gray-800 rounded text-xs">
            <div className="font-bold text-white mb-1">Events in {currentYear}:</div>
            {getEventsForYear(currentYear).slice(0, 3).map((event, idx) => (
              <div key={idx} className="text-gray-300 mb-1">
                • {event.label}
              </div>
            ))}
          </div>
        )}
      </div>
        </div>
      </div>

      {/* Toggle Button - Always on top */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="relative z-10 w-12 h-12 rounded-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-blue-500/50 transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
        title={isExpanded ? "Hide Timeline" : "Show Timeline"}
      >
        <Clock className="w-6 h-6" />
      </button>
    </div>
  );
};