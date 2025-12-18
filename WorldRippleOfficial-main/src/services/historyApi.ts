// Historical Events API integration

export interface HistoricalEvent {
  id: string;
  date: string;
  year: number;
  title: string;
  description: string;
  location: string;
  category: 'political' | 'social' | 'economic' | 'cultural' | 'military' | 'scientific';
  significance?: string;
  participants?: string[];
}

export interface HistoricalPerson {
  id: string;
  name: string;
  birthYear: number;
  deathYear?: number;
  description: string;
  significance: string;
  category: 'political' | 'social' | 'economic' | 'cultural' | 'military' | 'scientific';
  location: string;
  coordinates?: [number, number];
  associatedEvents: string[];
  occupation?: string;
  achievements?: string[];
}

// Since the API returns today's events, we'll create a comprehensive historical database
// organized by location and year for the map hover functionality
export const HISTORICAL_EVENTS_BY_LOCATION: Record<string, HistoricalEvent[]> = {
  'United States': [
    {
      id: 'us-1776',
      date: 'July 4, 1776',
      year: 1776,
      title: 'Declaration of Independence',
      description: 'The Continental Congress approved the Declaration of Independence, marking the birth of the United States as an independent nation.',
      location: 'Philadelphia, Pennsylvania',
      category: 'political'
    },
    {
      id: 'us-1861',
      date: 'April 12, 1861',
      year: 1861,
      title: 'Civil War Begins',
      description: 'Confederate forces fired on Fort Sumter in South Carolina, marking the beginning of the American Civil War.',
      location: 'Charleston, South Carolina',
      category: 'military'
    },
    {
      id: 'us-1918',
      date: 'October 1918',
      year: 1918,
      title: 'Spanish Flu Peak',
      description: 'The Spanish flu pandemic reached its deadliest phase in the United States, killing over 675,000 Americans.',
      location: 'Nationwide',
      category: 'social'
    },
    {
      id: 'us-1929',
      date: 'October 29, 1929',
      year: 1929,
      title: 'Black Tuesday',
      description: 'The stock market crash of 1929 marked the beginning of the Great Depression, the worst economic downturn in American history.',
      location: 'New York City',
      category: 'economic'
    },
    {
      id: 'us-1939',
      date: 'September 1, 1939',
      year: 1939,
      title: 'World War II Begins',
      description: 'Germany invaded Poland, marking the beginning of World War II. The U.S. initially remained neutral.',
      location: 'United States',
      category: 'military'
    },
    {
      id: 'us-1941',
      date: 'December 7, 1941',
      year: 1941,
      title: 'Pearl Harbor Attack',
      description: 'Japanese forces launched a surprise attack on Pearl Harbor, leading to U.S. entry into World War II.',
      location: 'Pearl Harbor, Hawaii',
      category: 'military'
    },
    {
      id: 'us-1942',
      date: 'June 4-7, 1942',
      year: 1942,
      title: 'Battle of Midway',
      description: 'Decisive U.S. naval victory over Japan in the Pacific Theater, turning the tide of World War II.',
      location: 'Midway Atoll',
      category: 'military'
    },
    {
      id: 'us-1944',
      date: 'June 6, 1944',
      year: 1944,
      title: 'D-Day Invasion',
      description: 'Allied forces launched the largest amphibious invasion in history on the beaches of Normandy.',
      location: 'Normandy, France (U.S. forces)',
      category: 'military'
    },
    {
      id: 'us-1945',
      date: 'May 8, 1945',
      year: 1945,
      title: 'VE Day - Victory in Europe',
      description: 'Nazi Germany surrendered unconditionally, ending World War II in Europe.',
      location: 'United States',
      category: 'military'
    },
    {
      id: 'us-1945-aug',
      date: 'August 6-9, 1945',
      year: 1945,
      title: 'Atomic Bombs Dropped',
      description: 'U.S. dropped atomic bombs on Hiroshima and Nagasaki, leading to Japan\'s surrender and ending World War II.',
      location: 'Japan (U.S. action)',
      category: 'military'
    },
    {
      id: 'us-1969',
      date: 'July 20, 1969',
      year: 1969,
      title: 'Moon Landing',
      description: 'Apollo 11 astronauts Neil Armstrong and Buzz Aldrin became the first humans to land on the Moon.',
      location: 'NASA Mission Control, Houston',
      category: 'scientific'
    },
    {
      id: 'us-2001',
      date: 'September 11, 2001',
      year: 2001,
      title: '9/11 Terrorist Attacks',
      description: 'Coordinated terrorist attacks on the World Trade Center and Pentagon killed nearly 3,000 people and changed American foreign policy.',
      location: 'New York City & Washington D.C.',
      category: 'political'
    },
    {
      id: 'us-2008',
      date: 'September 15, 2008',
      year: 2008,
      title: 'Financial Crisis',
      description: 'The collapse of Lehman Brothers triggered the worst financial crisis since the Great Depression.',
      location: 'New York City',
      category: 'economic'
    },
    {
      id: 'us-2020',
      date: 'March 11, 2020',
      year: 2020,
      title: 'COVID-19 Pandemic Declared',
      description: 'The WHO declared COVID-19 a pandemic. The U.S. would go on to have one of the highest case counts globally.',
      location: 'Nationwide',
      category: 'social'
    }
  ],
  'United Kingdom': [
    {
      id: 'uk-1066',
      date: 'October 14, 1066',
      year: 1066,
      title: 'Battle of Hastings',
      description: 'William the Conqueror defeated King Harold II, beginning Norman rule in England and fundamentally changing English culture.',
      location: 'Hastings, England',
      category: 'military'
    },
    {
      id: 'uk-1666',
      date: 'September 2, 1666',
      year: 1666,
      title: 'Great Fire of London',
      description: 'A devastating fire destroyed medieval London, leading to the city\'s reconstruction and modern urban planning.',
      location: 'London, England',
      category: 'social'
    },
    {
      id: 'uk-1707',
      date: 'May 1, 1707',
      year: 1707,
      title: 'Act of Union',
      description: 'England and Scotland united to form the Kingdom of Great Britain, creating the political foundation of modern Britain.',
      location: 'London & Edinburgh',
      category: 'political'
    },
    {
      id: 'uk-1918',
      date: 'November 11, 1918',
      year: 1918,
      title: 'Armistice Day',
      description: 'World War I ended with an armistice, after Britain lost nearly 1 million soldiers in the conflict.',
      location: 'London, England',
      category: 'military'
    },
    {
      id: 'uk-1940',
      date: 'July 10, 1940',
      year: 1940,
      title: 'Battle of Britain Begins',
      description: 'The German Luftwaffe began its air campaign against Britain, leading to the famous "Battle of Britain."',
      location: 'Southern England',
      category: 'military'
    },
    {
      id: 'uk-2016',
      date: 'June 23, 2016',
      year: 2016,
      title: 'Brexit Referendum',
      description: 'The UK voted to leave the European Union, beginning a complex process that would reshape British politics.',
      location: 'United Kingdom',
      category: 'political'
    },
    {
      id: 'uk-2020',
      date: 'March 23, 2020',
      year: 2020,
      title: 'First COVID-19 Lockdown',
      description: 'Prime Minister Boris Johnson announced the first national lockdown to combat the COVID-19 pandemic.',
      location: 'United Kingdom',
      category: 'social'
    }
  ],
  'Germany': [
    {
      id: 'de-1517',
      date: 'October 31, 1517',
      year: 1517,
      title: 'Protestant Reformation Begins',
      description: 'Martin Luther posted his 95 Theses in Wittenberg, sparking the Protestant Reformation across Europe.',
      location: 'Wittenberg, Germany',
      category: 'cultural'
    },
    {
      id: 'de-1871',
      date: 'January 18, 1871',
      year: 1871,
      title: 'German Unification',
      description: 'The German Empire was proclaimed at Versailles, unifying German states under Prussian leadership.',
      location: 'Versailles, France (German ceremony)',
      category: 'political'
    },
    {
      id: 'de-1918',
      date: 'November 9, 1918',
      year: 1918,
      title: 'Kaiser Abdicates',
      description: 'Kaiser Wilhelm II abdicated, ending the German Empire and leading to the Weimar Republic.',
      location: 'Berlin, Germany',
      category: 'political'
    },
    {
      id: 'de-1933',
      date: 'January 30, 1933',
      year: 1933,
      title: 'Hitler Becomes Chancellor',
      description: 'Adolf Hitler was appointed Chancellor of Germany, beginning the Nazi era that would lead to World War II.',
      location: 'Berlin, Germany',
      category: 'political'
    },
    {
      id: 'de-1945',
      date: 'May 8, 1945',
      year: 1945,
      title: 'Germany Surrenders',
      description: 'Nazi Germany surrendered unconditionally, ending World War II in Europe and beginning Allied occupation.',
      location: 'Berlin, Germany',
      category: 'military'
    },
    {
      id: 'de-1961',
      date: 'August 13, 1961',
      year: 1961,
      title: 'Berlin Wall Built',
      description: 'East German authorities began construction of the Berlin Wall, physically dividing the city for 28 years.',
      location: 'Berlin, Germany',
      category: 'political'
    },
    {
      id: 'de-1989',
      date: 'November 9, 1989',
      year: 1989,
      title: 'Fall of Berlin Wall',
      description: 'The Berlin Wall fell, symbolizing the end of the Cold War and leading to German reunification.',
      location: 'Berlin, Germany',
      category: 'political'
    },
    {
      id: 'de-2020',
      date: 'March 22, 2020',
      year: 2020,
      title: 'COVID-19 Restrictions',
      description: 'Germany implemented strict COVID-19 restrictions, becoming a model for pandemic response in Europe.',
      location: 'Germany',
      category: 'social'
    }
  ],
  'California': [
    {
      id: 'ca-1849',
      date: 'January 24, 1848',
      year: 1848,
      title: 'California Gold Rush Begins',
      description: 'Gold was discovered at Sutter\'s Mill, triggering the California Gold Rush and massive westward migration.',
      location: 'Coloma, California',
      category: 'economic'
    },
    {
      id: 'ca-1906',
      date: 'April 18, 1906',
      year: 1906,
      title: 'San Francisco Earthquake',
      description: 'A devastating earthquake and fire destroyed much of San Francisco, killing over 3,000 people.',
      location: 'San Francisco, California',
      category: 'social'
    },
    {
      id: 'ca-1960s',
      date: '1967',
      year: 1967,
      title: 'Summer of Love',
      description: 'San Francisco became the center of the counterculture movement, attracting over 100,000 young people.',
      location: 'San Francisco, California',
      category: 'cultural'
    },
    {
      id: 'ca-1970s',
      date: '1976',
      year: 1976,
      title: 'Apple Computer Founded',
      description: 'Steve Jobs and Steve Wozniak founded Apple Computer in a garage, beginning the personal computer revolution.',
      location: 'Los Altos, California',
      category: 'scientific'
    },
    {
      id: 'ca-2008',
      date: '2008',
      year: 2008,
      title: 'Housing Crisis Peak',
      description: 'California was hit hardest by the subprime mortgage crisis, with home values dropping over 40% in some areas.',
      location: 'California',
      category: 'economic'
    },
    {
      id: 'ca-2020',
      date: '2020',
      year: 2020,
      title: 'Tech Boom During Pandemic',
      description: 'California tech companies saw massive growth during COVID-19 as remote work and digital services surged.',
      location: 'Silicon Valley, California',
      category: 'economic'
    }
  ],
  'San Francisco': [
    {
      id: 'sf-1849',
      title: 'Gold Rush Boom',
      description: 'San Francisco transformed from a small settlement to a major city during the California Gold Rush.',
      year: 1849,
      location: 'San Francisco, California',
      category: 'economic'
    },
    {
      id: 'sf-1906',
      title: 'Great Earthquake and Fire',
      description: 'A devastating 7.9 earthquake and subsequent fires destroyed 80% of San Francisco.',
      year: 1906,
      location: 'San Francisco, California',
      category: 'social'
    },
    {
      id: 'sf-1967',
      title: 'Summer of Love',
      description: 'San Francisco became the epicenter of the hippie counterculture movement.',
      year: 1967,
      location: 'Haight-Ashbury, San Francisco',
      category: 'cultural'
    },
    {
      id: 'sf-2020',
      title: 'Tech Pandemic Boom',
      description: 'San Francisco tech companies experienced massive growth during COVID-19 lockdowns.',
      year: 2020,
      location: 'San Francisco, California',
      category: 'economic'
    }
  ],
  'Los Angeles': [
    {
      id: 'la-1781',
      title: 'El Pueblo Founded',
      description: 'Spanish colonists founded El Pueblo de Nuestra Señora la Reina de los Ángeles.',
      year: 1781,
      location: 'Los Angeles, California',
      category: 'political'
    },
    {
      id: 'la-1911',
      title: 'Hollywood Film Industry',
      description: 'The first movie studio opened in Hollywood, beginning the film industry boom.',
      year: 1911,
      location: 'Hollywood, California',
      category: 'cultural'
    },
    {
      id: 'la-1992',
      title: 'LA Riots',
      description: 'Civil unrest erupted following the Rodney King verdict, lasting six days.',
      year: 1992,
      location: 'Los Angeles, California',
      category: 'social'
    }
  ],
  'Detroit': [
    {
      id: 'det-1701',
      title: 'Fort Detroit Founded',
      description: 'French explorer Antoine de la Mothe Cadillac founded Fort Detroit.',
      year: 1701,
      location: 'Detroit, Michigan',
      category: 'political'
    },
    {
      id: 'det-1908',
      title: 'Model T Production',
      description: 'Henry Ford began mass production of the Model T, revolutionizing manufacturing.',
      year: 1908,
      location: 'Detroit, Michigan',
      category: 'economic'
    },
    {
      id: 'det-1967',
      title: '12th Street Riot',
      description: 'One of the most destructive riots in US history occurred in Detroit.',
      year: 1967,
      location: 'Detroit, Michigan',
      category: 'social'
    },
    {
      id: 'det-2013',
      title: 'Detroit Bankruptcy',
      description: 'Detroit became the largest US city to file for bankruptcy.',
      year: 2013,
      location: 'Detroit, Michigan',
      category: 'economic'
    }
  ],
  'New York': [
    {
      id: 'ny-1624',
      date: '1624',
      year: 1624,
      title: 'New Amsterdam Founded',
      description: 'Dutch colonists established New Amsterdam on Manhattan Island, which would later become New York City.',
      location: 'Manhattan, New York',
      category: 'political'
    },
    {
      id: 'ny-1942',
      date: '1942-1945',
      year: 1943,
      title: 'World War II Home Front',
      description: 'New York became a major hub for wartime production and military mobilization during World War II.',
      location: 'New York City',
      category: 'military'
    },
    {
      id: 'ny-1886',
      date: 'October 28, 1886',
      year: 1886,
      title: 'Statue of Liberty Dedicated',
      description: 'The Statue of Liberty was dedicated, becoming a symbol of freedom and welcoming millions of immigrants.',
      location: 'New York Harbor',
      category: 'cultural'
    },
    {
      id: 'ny-1929',
      date: 'October 24, 1929',
      year: 1929,
      title: 'Wall Street Crash',
      description: 'Black Thursday marked the beginning of the stock market crash that led to the Great Depression.',
      location: 'Wall Street, New York City',
      category: 'economic'
    },
    {
      id: 'ny-2001',
      date: 'September 11, 2001',
      year: 2001,
      title: 'World Trade Center Attack',
      description: 'Terrorist attacks destroyed the Twin Towers, killing nearly 3,000 people and reshaping American security policy.',
      location: 'Lower Manhattan, New York City',
      category: 'political'
    },
    {
      id: 'ny-2020',
      date: 'March 2020',
      year: 2020,
      title: 'COVID-19 Epicenter',
      description: 'New York became the early epicenter of COVID-19 in the US, with hospitals overwhelmed and the city in lockdown.',
      location: 'New York City',
      category: 'social'
    }
  ]
};

export const HISTORICAL_PEOPLE: HistoricalPerson[] = [
  {
    id: 'person-washington',
    name: 'George Washington',
    birthYear: 1732,
    deathYear: 1799,
    description: 'First President of the United States and commander of the Continental Army',
    significance: 'Led American forces to victory in Revolutionary War, established presidential precedents',
    category: 'political',
    location: 'Virginia, United States',
    coordinates: [-77.4360, 37.5407],
    associatedEvents: ['us-1776']
  },
  {
    id: 'person-lincoln',
    name: 'Abraham Lincoln',
    birthYear: 1809,
    deathYear: 1865,
    description: '16th President of the United States who led the nation through its greatest moral, constitutional, and political crisis in the American Civil War. He preserved the Union, abolished slavery, and modernized the U.S. economy.',
    significance: 'Preserved the Union, abolished slavery, and modernized the economy',
    category: 'political',
    location: 'Illinois, United States',
    coordinates: [-89.3985, 40.6331],
    associatedEvents: ['us-1861'],
    occupation: 'Lawyer, Statesman, 16th President',
    achievements: [
      'Issued the Emancipation Proclamation freeing slaves',
      'Preserved the United States during the Civil War',
      'Delivered the Gettysburg Address',
      'Passed the 13th Amendment abolishing slavery'
    ]
  },
  {
    id: 'person-roosevelt-fdr',
    name: 'Franklin D. Roosevelt',
    birthYear: 1882,
    deathYear: 1945,
    description: '32nd President of the United States, led through Great Depression and World War II',
    significance: 'Implemented New Deal programs, led Allied strategy in WWII',
    category: 'political',
    location: 'New York, United States',
    coordinates: [-74.0060, 40.7128],
    associatedEvents: ['us-1929', 'us-1941', 'us-1945']
  },
  {
    id: 'person-mlk',
    name: 'Martin Luther King Jr.',
    birthYear: 1929,
    deathYear: 1968,
    description: 'Baptist minister and civil rights leader',
    significance: 'Led the American civil rights movement using nonviolent resistance',
    category: 'social',
    location: 'Atlanta, Georgia',
    coordinates: [-84.3880, 33.7490],
    associatedEvents: []
  },
  {
    id: 'person-churchill',
    name: 'Winston Churchill',
    birthYear: 1874,
    deathYear: 1965,
    description: 'British Prime Minister during World War II',
    significance: 'Led Britain through WWII, rallied British resistance against Nazi Germany',
    category: 'political',
    location: 'London, England',
    coordinates: [-0.1276, 51.5074],
    associatedEvents: ['uk-1940', 'uk-1918']
  },
  {
    id: 'person-hitler',
    name: 'Adolf Hitler',
    birthYear: 1889,
    deathYear: 1945,
    description: 'Nazi dictator of Germany',
    significance: 'Led Germany in WWII, orchestrated the Holocaust',
    category: 'political',
    location: 'Berlin, Germany',
    coordinates: [13.4050, 52.5200],
    associatedEvents: ['de-1933', 'de-1945']
  },
  {
    id: 'person-einstein',
    name: 'Albert Einstein',
    birthYear: 1879,
    deathYear: 1955,
    description: 'Theoretical physicist who developed the theory of relativity',
    significance: 'Revolutionized physics with E=mc², influenced development of atomic energy',
    category: 'scientific',
    location: 'Princeton, New Jersey',
    coordinates: [-74.6672, 40.3573],
    associatedEvents: ['us-1945-aug']
  },
  {
    id: 'person-jobs',
    name: 'Steve Jobs',
    birthYear: 1955,
    deathYear: 2011,
    description: 'Co-founder of Apple Inc. and pioneer of personal computing',
    significance: 'Revolutionized personal computers, smartphones, and digital media',
    category: 'scientific',
    location: 'California, United States',
    coordinates: [-122.0838, 37.3875],
    associatedEvents: ['ca-1970s']
  },
  {
    id: 'person-armstrong',
    name: 'Neil Armstrong',
    birthYear: 1930,
    deathYear: 2012,
    description: 'Astronaut and first person to walk on the Moon',
    significance: 'Commanded Apollo 11 mission, made historic first steps on lunar surface',
    category: 'scientific',
    location: 'Ohio, United States',
    coordinates: [-82.9071, 40.4173],
    associatedEvents: ['us-1969']
  },
  {
    id: 'person-ford',
    name: 'Henry Ford',
    birthYear: 1863,
    deathYear: 1947,
    description: 'Industrialist and founder of Ford Motor Company',
    significance: 'Pioneered mass production techniques, made automobiles affordable',
    category: 'economic',
    location: 'Detroit, Michigan',
    coordinates: [-83.0458, 42.3314],
    associatedEvents: ['det-1908']
  },
  {
    id: 'person-rockefeller',
    name: 'John D. Rockefeller',
    birthYear: 1839,
    deathYear: 1937,
    description: 'Oil industry magnate and philanthropist',
    significance: "Founded Standard Oil, became America's first billionaire",
    category: 'economic',
    location: 'New York, United States',
    coordinates: [-74.0060, 40.7128],
    associatedEvents: ['ny-1929']
  },
  {
    id: 'person-gandhi',
    name: 'Mahatma Gandhi',
    birthYear: 1869,
    deathYear: 1948,
    description: 'Indian independence leader and advocate of nonviolent resistance',
    significance: 'Led India to independence through nonviolent civil disobedience',
    category: 'political',
    location: 'India',
    coordinates: [78.9629, 20.5937],
    associatedEvents: []
  },
  {
    id: 'person-mandela',
    name: 'Nelson Mandela',
    birthYear: 1918,
    deathYear: 2013,
    description: 'South African anti-apartheid revolutionary and first Black president',
    significance: 'Fought apartheid, led South Africa to democracy',
    category: 'political',
    location: 'South Africa',
    coordinates: [22.9375, -30.5595],
    associatedEvents: []
  },
  {
    id: 'person-curie',
    name: 'Marie Curie',
    birthYear: 1867,
    deathYear: 1934,
    description: 'Physicist and chemist who pioneered research on radioactivity',
    significance: 'First woman to win Nobel Prize, only person to win in two sciences',
    category: 'scientific',
    location: 'Paris, France',
    coordinates: [2.3522, 48.8566],
    associatedEvents: []
  },
  {
    id: 'person-rosa-parks',
    name: 'Rosa Parks',
    birthYear: 1913,
    deathYear: 2005,
    description: 'Civil rights activist who sparked the Montgomery Bus Boycott',
    significance: 'Her refusal to give up her bus seat became a symbol of civil rights movement',
    category: 'social',
    location: 'Alabama, United States',
    coordinates: [-86.9023, 32.3792],
    associatedEvents: []
  }
];

export class HistoryService {
  private cache = new Map<string, any>();
  private apiCache = new Map<string, any>();

  // Get historical events for a specific location and year range
  getEventsForLocation(locationName: string, currentYear: number, yearRange: number = 5): HistoricalEvent[] {
    const events = HISTORICAL_EVENTS_BY_LOCATION[locationName] || [];
    
    // Filter events within the year range
    return events.filter(event => 
      Math.abs(event.year - currentYear) <= yearRange
    ).sort((a, b) => Math.abs(a.year - currentYear) - Math.abs(b.year - currentYear));
  }

  // Get the most relevant event for a location and year
  getMostRelevantEvent(locationName: string, currentYear: number): HistoricalEvent | null {
    const events = this.getEventsForLocation(locationName, currentYear, 10);
    return events.length > 0 ? events[0] : null;
  }

  // Get events that happened exactly in the specified year
  getEventsForExactYear(locationName: string, year: number): HistoricalEvent[] {
    const events = HISTORICAL_EVENTS_BY_LOCATION[locationName] || [];
    return events.filter(event => event.year === year);
  }

  // Get the closest event to a specific year (within reasonable range)
  getClosestEventToYear(locationName: string, targetYear: number): HistoricalEvent | null {
    const events = HISTORICAL_EVENTS_BY_LOCATION[locationName] || [];
    
    if (events.length === 0) return null;
    
    // Find events within 20 years of the target year
    const nearbyEvents = events.filter(event => 
      Math.abs(event.year - targetYear) <= 20
    );
    
    if (nearbyEvents.length === 0) return null;
    
    // Sort by proximity to target year
    nearbyEvents.sort((a, b) => 
      Math.abs(a.year - targetYear) - Math.abs(b.year - targetYear)
    );
    
    return nearbyEvents[0];
  }

  // Get location-specific historical events with API integration
  getLocationHistoricalEvents(locationName: string, currentYear: number): HistoricalEvent[] {
    const cacheKey = `${locationName}-${currentYear}`;
    
    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    // First try to get events from the exact year
    let relevantEvents = this.getEventsForExactYear(locationName, currentYear);
    
    // If no exact year events, get the closest event
    if (relevantEvents.length === 0) {
      const closestEvent = this.getClosestEventToYear(locationName, currentYear);
      if (closestEvent) {
        relevantEvents = [closestEvent];
      }
    }
    
    // If still no events, try broader search
    if (relevantEvents.length === 0) {
      relevantEvents = this.getEventsForLocation(locationName, currentYear, 10);
    }
    
    // Cache and return local events
    const finalEvents = relevantEvents.slice(0, 3);
    this.cache.set(cacheKey, finalEvents);
    return finalEvents;
  }

  // Search across all historical events
  searchEvents(query: string): HistoricalEvent[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    const results: HistoricalEvent[] = [];

    // Search through all locations
    Object.entries(HISTORICAL_EVENTS_BY_LOCATION).forEach(([location, events]) => {
      events.forEach(event => {
        const matches =
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.location.toLowerCase().includes(searchTerm) ||
          event.category.toLowerCase().includes(searchTerm) ||
          location.toLowerCase().includes(searchTerm) ||
          event.year.toString().includes(searchTerm);

        if (matches) {
          results.push(event);
        }
      });
    });

    // Sort by relevance (title matches first, then year proximity to current year)
    results.sort((a, b) => {
      const aTitleMatch = a.title.toLowerCase().includes(searchTerm) ? 1 : 0;
      const bTitleMatch = b.title.toLowerCase().includes(searchTerm) ? 1 : 0;

      if (aTitleMatch !== bTitleMatch) {
        return bTitleMatch - aTitleMatch;
      }

      return b.year - a.year; // Most recent first
    });

    return results.slice(0, 20); // Limit to top 20 results
  }

  // Get all unique locations
  getAllLocations(): string[] {
    return Object.keys(HISTORICAL_EVENTS_BY_LOCATION);
  }

  // Get all events for a specific category
  getEventsByCategory(category: string): HistoricalEvent[] {
    const results: HistoricalEvent[] = [];

    Object.values(HISTORICAL_EVENTS_BY_LOCATION).forEach(events => {
      events.forEach(event => {
        if (event.category === category) {
          results.push(event);
        }
      });
    });

    return results.sort((a, b) => b.year - a.year);
  }

  // Get all events within a year range
  getEventsByYearRange(startYear: number, endYear: number): HistoricalEvent[] {
    const results: HistoricalEvent[] = [];

    Object.values(HISTORICAL_EVENTS_BY_LOCATION).forEach(events => {
      events.forEach(event => {
        if (event.year >= startYear && event.year <= endYear) {
          results.push(event);
        }
      });
    });

    return results.sort((a, b) => a.year - b.year);
  }

  // Search for people
  searchPeople(query: string): HistoricalPerson[] {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase();
    const results: HistoricalPerson[] = [];

    HISTORICAL_PEOPLE.forEach(person => {
      const matches =
        person.name.toLowerCase().includes(searchTerm) ||
        person.description.toLowerCase().includes(searchTerm) ||
        person.significance.toLowerCase().includes(searchTerm) ||
        person.category.toLowerCase().includes(searchTerm) ||
        person.location.toLowerCase().includes(searchTerm) ||
        person.birthYear.toString().includes(searchTerm) ||
        (person.deathYear && person.deathYear.toString().includes(searchTerm));

      if (matches) {
        results.push(person);
      }
    });

    return results.slice(0, 10);
  }

  // Get person by ID
  getPersonById(id: string): HistoricalPerson | undefined {
    return HISTORICAL_PEOPLE.find(person => person.id === id);
  }

  // Search by date with flexible parsing
  searchByDate(query: string): (HistoricalEvent | HistoricalPerson)[] {
    const results: (HistoricalEvent | HistoricalPerson)[] = [];

    // Try to extract year from query
    const yearMatch = query.match(/\b(1[0-9]{3}|20[0-9]{2})\b/);
    if (yearMatch) {
      const year = parseInt(yearMatch[0]);

      // Search events by year
      Object.values(HISTORICAL_EVENTS_BY_LOCATION).forEach(events => {
        events.forEach(event => {
          if (event.year === year) {
            results.push(event);
          }
        });
      });

      // Search people by birth/death year
      HISTORICAL_PEOPLE.forEach(person => {
        if (person.birthYear === year || person.deathYear === year) {
          results.push(person);
        }
      });
    }

    return results;
  }

  // Enhanced location search
  searchLocations(query: string): string[] {
    const searchTerm = query.toLowerCase();
    const locations = this.getAllLocations();

    return locations.filter(location =>
      location.toLowerCase().includes(searchTerm)
    );
  }

  // Get all people
  getAllPeople(): HistoricalPerson[] {
    return HISTORICAL_PEOPLE;
  }

  // Get all events
  getAllEvents(): (HistoricalEvent & { coordinates?: [number, number] })[] {
    const events: (HistoricalEvent & { coordinates?: [number, number] })[] = [];

    Object.values(HISTORICAL_EVENTS_BY_LOCATION).forEach(locationEvents => {
      locationEvents.forEach(event => {
        const coords = this.getLocationCoordinates(event.location);
        events.push({ ...event, coordinates: coords });
      });
    });

    return events;
  }

  // Get people by category
  getPeopleByCategory(category: string): HistoricalPerson[] {
    return HISTORICAL_PEOPLE.filter(person => person.category === category);
  }

  // Get location coordinates from city/location string
  getLocationCoordinates(location: string): [number, number] | undefined {
    const locationMap: Record<string, [number, number]> = {
      'Philadelphia, Pennsylvania': [-75.1652, 39.9526],
      'Charleston, South Carolina': [-79.9311, 32.7765],
      'Nationwide': [-98.5795, 39.8283],
      'New York City': [-74.0060, 40.7128],
      'United States': [-98.5795, 39.8283],
      'Hiroshima, Japan': [132.4553, 34.3853],
      'Nagasaki, Japan': [129.8737, 32.7503],
      'Paris, France': [2.3522, 48.8566],
      'Berlin, Germany': [13.4050, 52.5200],
      'London, England': [-0.1276, 51.5074],
      'Moscow, Russia': [37.6173, 55.7558],
      'Washington, D.C.': [-77.0369, 38.9072],
      'New York, New York': [-74.0060, 40.7128],
      'Lower Manhattan, New York City': [-74.0130, 40.7061],
      'Lower Manhattan, New York': [-74.0130, 40.7061]
    };

    return locationMap[location];
  }

  // Clear cache periodically
  clearCache() {
    this.cache.clear();
  }
}

export const historyService = new HistoryService();