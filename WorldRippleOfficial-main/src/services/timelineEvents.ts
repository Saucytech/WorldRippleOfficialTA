// Comprehensive timeline events aggregator
import { historyService } from './historyApi';
import { getAllInventions } from './inventionsApi';

export interface TimelineEvent {
  year: number;
  label: string;
  description?: string;
  color: string;
  type: 'event' | 'invention' | 'person' | 'war' | 'discovery' | 'pandemic';
  location?: string;
  coordinates?: [number, number];
}

// Get coordinates for locations
const locationCoordinates: Record<string, [number, number]> = {
  'Philadelphia, Pennsylvania': [-75.1652, 39.9526],
  'Charleston, South Carolina': [-79.9311, 32.7765],
  'United States': [-98.5795, 39.8283],
  'New York City': [-74.0060, 40.7128],
  'Pearl Harbor, Hawaii': [-157.9524, 21.3643],
  'Houston': [-95.3698, 29.7604],
  'Hastings, England': [0.5729, 50.8548],
  'London, England': [-0.1276, 51.5074],
  'London': [-0.1276, 51.5074],
  'United Kingdom': [-3.4360, 55.3781],
  'Wittenberg, Germany': [12.6484, 51.8661],
  'Berlin, Germany': [13.4050, 52.5200],
  'Germany': [10.4515, 51.1657],
  'Coloma, California': [-120.8925, 38.7996],
  'San Francisco, California': [-122.4194, 37.7749],
  'San Francisco': [-122.4194, 37.7749],
  'California': [-119.4179, 36.7783],
  'Los Angeles, California': [-118.2437, 34.0522],
  'Los Angeles': [-118.2437, 34.0522],
  'Detroit, Michigan': [-83.0458, 42.3314],
  'Detroit': [-83.0458, 42.3314],
  'Manhattan, New York': [-73.9712, 40.7831],
  'New York Harbor': [-74.0445, 40.6892],
  'Wall Street, New York City': [-74.0109, 40.7074],
  'Lower Manhattan, New York City': [-74.0130, 40.7061],
  'Boston, Massachusetts': [-71.0589, 42.3601],
  'Menlo Park, New Jersey': [-74.3318, 40.5609],
  'Kitty Hawk, North Carolina': [-75.7002, 36.0626],
  'Mainz, Germany': [8.2473, 49.9929],
  'Glasgow, Scotland': [-4.2518, 55.8642],
  'Murray Hill, New Jersey': [-74.4032, 40.6852],
  'Geneva, Switzerland': [6.1432, 46.2044],
  'Berkeley, Gloucestershire': [-2.4552, 51.6909],
  'Mannheim, Germany': [8.4660, 49.4875],
  'Bologna, Italy': [11.3426, 44.4949],
  'Würzburg, Germany': [9.9534, 49.7913],
  'Cambridge, England': [0.1218, 52.2053],
  'Virginia, United States': [-78.6569, 37.4316],
  'Illinois, United States': [-89.3985, 40.6331],
  'Atlanta, Georgia': [-84.3880, 33.7490],
  'Princeton, New Jersey': [-74.6672, 40.3573],
  'Ohio, United States': [-82.9071, 40.4173],
  'India': [78.9629, 20.5937],
  'South Africa': [22.9375, -30.5595],
  'Paris, France': [2.3522, 48.8566],
  'Alabama, United States': [-86.9023, 32.3792]
};

export function getAllTimelineEvents(): TimelineEvent[] {
  const events: TimelineEvent[] = [];

  // Get all historical events
  const historicalEvents = historyService.getAllEvents();
  historicalEvents.forEach(event => {
    let coords = event.coordinates;
    if (!coords && event.location) {
      coords = locationCoordinates[event.location];
    }
    
    events.push({
      year: event.year,
      label: event.title,
      description: event.description,
      color: getCategoryColor(event.category),
      type: 'event',
      location: event.location,
      coordinates: coords
    });
  });

  // Get all inventions
  const inventions = getAllInventions();
  inventions.forEach(invention => {
    events.push({
      year: invention.year,
      label: invention.name,
      description: `Invented by ${invention.inventor}`,
      color: '#FBBF24', // Yellow for inventions
      type: 'invention',
      location: invention.location.name,
      coordinates: invention.location.coordinates
    });
  });

  // Get all historical people (birth years)
  const people = historyService.getAllPeople();
  people.forEach(person => {
    events.push({
      year: person.birthYear,
      label: `${person.name} born`,
      description: person.description,
      color: '#F97316', // Orange for people
      type: 'person',
      location: person.location,
      coordinates: person.coordinates
    });

    // Add death year if exists
    if (person.deathYear) {
      events.push({
        year: person.deathYear,
        label: `${person.name} died`,
        description: person.significance,
        color: '#6B7280', // Gray for deaths
        type: 'person',
        location: person.location,
        coordinates: person.coordinates
      });
    }
  });

  // Sort by year
  return events.sort((a, b) => a.year - b.year);
}

function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    'political': '#8B5CF6',  // Purple
    'military': '#EF4444',   // Red
    'social': '#10B981',     // Green
    'economic': '#F59E0B',   // Amber
    'cultural': '#EC4899',   // Pink
    'scientific': '#3B82F6'  // Blue
  };
  return colors[category] || '#6B7280';
}

// Get events for a specific year range
export function getEventsInRange(startYear: number, endYear: number): TimelineEvent[] {
  return getAllTimelineEvents().filter(event => 
    event.year >= startYear && event.year <= endYear
  );
}

// Get the most significant events for timeline markers
export function getMajorTimelineEvents(): TimelineEvent[] {
  // Define major events to always show on timeline
  const majorEvents = [
    { year: 1066, label: 'Battle of Hastings' },
    { year: 1440, label: 'Printing Press' },
    { year: 1492, label: 'Columbus Americas' },
    { year: 1517, label: 'Protestant Reformation' },
    { year: 1776, label: 'US Independence' },
    { year: 1789, label: 'French Revolution' },
    { year: 1861, label: 'US Civil War' },
    { year: 1914, label: 'WWI Begins' },
    { year: 1918, label: 'Spanish Flu' },
    { year: 1929, label: 'Great Depression' },
    { year: 1939, label: 'WWII Begins' },
    { year: 1945, label: 'WWII Ends' },
    { year: 1969, label: 'Moon Landing' },
    { year: 1989, label: 'Berlin Wall Falls' },
    { year: 2001, label: '9/11 Attacks' },
    { year: 2008, label: 'Financial Crisis' },
    { year: 2020, label: 'COVID-19' }
  ];

  const allEvents = getAllTimelineEvents();
  
  return majorEvents.map(major => {
    const fullEvent = allEvents.find(e => e.year === major.year);
    if (fullEvent) {
      return { ...fullEvent, label: major.label };
    }
    return {
      year: major.year,
      label: major.label,
      color: '#6B7280',
      type: 'event' as const
    };
  });
}

// Get event details for a specific year
export function getEventsForYear(year: number): TimelineEvent[] {
  return getAllTimelineEvents().filter(event => event.year === year);
}

// Get nearest events to a year
export function getNearestEvents(year: number, range: number = 5): TimelineEvent[] {
  return getAllTimelineEvents().filter(event => 
    Math.abs(event.year - year) <= range
  );
}