import React, { useState } from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, Clock } from 'lucide-react';

interface TimelineControlsProps {
  currentYear: number;
  onYearChange: (year: number) => void;
}

export const TimelineControls: React.FC<TimelineControlsProps> = ({
  currentYear,
  onYearChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isExpanded, setIsExpanded] = useState(false);
  
  const minYear = 1900;
  const maxYear = 2024;
  
  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        onYearChange(prevYear => {
          if (prevYear >= maxYear) {
            setIsPlaying(false);
            return maxYear;
          }
          return prevYear + 1;
        });
      }, 1000 / playbackSpeed);
    }
    
    return () => clearInterval(interval);
  }, [isPlaying, playbackSpeed, onYearChange, maxYear]);

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    onYearChange(1900);
  };

  const handleYearChange = (year: number) => {
    onYearChange(Math.max(minYear, Math.min(maxYear, year)));
  };

  const majorEvents = [
    { year: 1918, label: 'Spanish Flu', color: '#EF4444' },
    { year: 1929, label: 'Great Depression', color: '#F59E0B' },
    { year: 1945, label: 'WWII Ends', color: '#8B5CF6' },
    { year: 1969, label: 'Moon Landing', color: '#10B981' },
    { year: 2001, label: '9/11', color: '#EC4899' },
    { year: 2008, label: 'Financial Crisis', color: '#F59E0B' },
    { year: 2020, label: 'COVID-19', color: '#EF4444' }
  ];

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
            min={minYear}
            max={maxYear}
            value={currentYear}
            onChange={(e) => handleYearChange(parseInt(e.target.value))}
            className="w-full h-3 bg-gray-700 rounded-lg appearance-none cursor-pointer timeline-slider"
          />
          
          {/* Major Event Markers */}
          <div className="absolute top-0 left-0 w-full h-3 pointer-events-none">
            {majorEvents.map(event => {
              const position = ((event.year - minYear) / (maxYear - minYear)) * 100;
              return (
                <div
                  key={event.year}
                  className="absolute transform -translate-x-1/2 group"
                  style={{ left: `${position}%` }}
                >
                  <div
                    className="w-3 h-3 rounded-full border-2 border-white shadow-lg"
                    style={{ backgroundColor: event.color }}
                  />
                  <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                    {event.year}: {event.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Year Labels */}
        <div className="flex justify-between text-xs text-gray-500 mt-2">
          <span>{minYear}</span>
          <span>1950</span>
          <span>2000</span>
          <span>{maxYear}</span>
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
          </select>
        </div>
      </div>

      {/* Current Era Info */}
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="text-xs text-gray-400">
          {currentYear < 1950 && "Early Industrial Era"}
          {currentYear >= 1950 && currentYear < 1990 && "Post-War Period"}
          {currentYear >= 1990 && currentYear < 2000 && "Digital Revolution"}
          {currentYear >= 2000 && currentYear < 2020 && "Information Age"}
          {currentYear >= 2020 && "Modern Era"}
        </div>
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