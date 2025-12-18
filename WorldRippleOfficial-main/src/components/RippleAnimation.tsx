import React, { useEffect, useState, useRef } from 'react';
import '../styles/rippleAnimation.css';

export interface RippleEvent {
  id: string;
  coordinates: [number, number];
  type: 'pandemic' | 'war' | 'disaster' | 'invention' | 'economic' | 'climate' | 'social';
  magnitude: number; // 1-10 scale
  timestamp: number;
  color?: string;
  duration?: number; // in milliseconds
}

interface RippleAnimationProps {
  event: RippleEvent;
  mapProjection: (coords: [number, number]) => [number, number] | null;
  onAnimationComplete?: () => void;
}

const EVENT_COLORS: Record<RippleEvent['type'], string> = {
  pandemic: '#EF4444',    // Red
  war: '#DC2626',        // Dark Red
  disaster: '#F97316',   // Orange
  invention: '#06B6D4',  // Cyan
  economic: '#F59E0B',   // Amber
  climate: '#10B981',    // Green
  social: '#EC4899'      // Pink
};

export const RippleAnimation: React.FC<RippleAnimationProps> = ({
  event,
  mapProjection,
  onAnimationComplete
}) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Project coordinates to screen position
    const screenPos = mapProjection(event.coordinates);
    if (screenPos) {
      setPosition(screenPos);
    }
  }, [event.coordinates, mapProjection]);

  useEffect(() => {
    const duration = event.duration || 3000;
    const timer = setTimeout(() => {
      setIsAnimating(false);
      onAnimationComplete?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [event.duration, onAnimationComplete]);

  if (!position || !isAnimating) return null;

  const color = event.color || EVENT_COLORS[event.type];
  const scale = 1 + (event.magnitude / 10) * 4; // Scale based on magnitude

  return (
    <div
      className="ripple-container"
      style={{
        left: position[0],
        top: position[1],
        '--ripple-color': color,
        '--ripple-scale': scale,
      } as React.CSSProperties}
    >
      <div className="ripple-wave ripple-wave-1" />
      <div className="ripple-wave ripple-wave-2" />
      <div className="ripple-wave ripple-wave-3" />
      
      {/* Impact indicator */}
      <div className="ripple-center">
        <div className="ripple-pulse" />
      </div>
    </div>
  );
};

interface RippleManagerProps {
  events: RippleEvent[];
  map: mapboxgl.Map | null;
}

export const RippleManager: React.FC<RippleManagerProps> = ({ events, map }) => {
  const [activeRipples, setActiveRipples] = useState<RippleEvent[]>([]);
  const processedEvents = useRef<Set<string>>(new Set());

  useEffect(() => {
    // Only add new events that haven't been processed
    const newEvents = events.filter(event => !processedEvents.current.has(event.id));
    
    if (newEvents.length > 0) {
      newEvents.forEach(event => processedEvents.current.add(event.id));
      setActiveRipples(prev => [...prev, ...newEvents]);
    }
    
    // Clean up old processed events periodically
    if (processedEvents.current.size > 100) {
      processedEvents.current.clear();
    }
  }, [events]);

  const mapProjection = (coords: [number, number]): [number, number] | null => {
    if (!map) return null;
    const point = map.project(coords);
    return [point.x, point.y];
  };

  const handleAnimationComplete = (eventId: string) => {
    setActiveRipples(prev => prev.filter(e => e.id !== eventId));
  };

  if (!map) return null;

  return (
    <div className="ripple-overlay">
      {activeRipples.map(event => (
        <RippleAnimation
          key={event.id}
          event={event}
          mapProjection={mapProjection}
          onAnimationComplete={() => handleAnimationComplete(event.id)}
        />
      ))}
    </div>
  );
};

export default RippleAnimation;