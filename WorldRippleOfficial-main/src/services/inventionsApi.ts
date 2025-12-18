export interface Invention {
  id: string;
  name: string;
  inventor: string;
  year: number;
  location: {
    name: string;
    coordinates: [number, number]; // [longitude, latitude]
    country: string;
  };
  description: string;
  category: string;
  impact: string;
  timeline: {
    year: number;
    event: string;
  }[];
}

// Comprehensive inventions database
const inventionsDatabase: Invention[] = [
  {
    id: 'telephone',
    name: 'Telephone',
    inventor: 'Alexander Graham Bell',
    year: 1876,
    location: {
      name: 'Boston, Massachusetts',
      coordinates: [-71.0589, 42.3601],
      country: 'United States'
    },
    description: 'The telephone revolutionized long-distance communication by converting sound into electrical signals that could be transmitted over wires.',
    category: 'Communication',
    impact: 'Transformed global communication and laid the foundation for modern telecommunications.',
    timeline: [
      { year: 1876, event: 'First telephone patent granted to Alexander Graham Bell' },
      { year: 1877, event: 'First commercial telephone service established' },
      { year: 1915, event: 'First transcontinental telephone call' },
      { year: 1927, event: 'First transatlantic telephone service' }
    ]
  },
  {
    id: 'lightbulb',
    name: 'Practical Incandescent Light Bulb',
    inventor: 'Thomas Edison',
    year: 1879,
    location: {
      name: 'Menlo Park, New Jersey',
      coordinates: [-74.3318, 40.5609],
      country: 'United States'
    },
    description: 'Edison developed a practical and commercially viable incandescent light bulb that could burn for hours.',
    category: 'Energy',
    impact: 'Transformed daily life by extending productive hours beyond daylight and enabling modern civilization.',
    timeline: [
      { year: 1879, event: 'Edison creates first long-lasting carbon filament bulb' },
      { year: 1880, event: 'Edison Electric Light Company begins production' },
      { year: 1882, event: 'First commercial power station opens in New York' },
      { year: 1910, event: 'Tungsten filaments replace carbon' }
    ]
  },
  {
    id: 'airplane',
    name: 'Airplane',
    inventor: 'Wright Brothers',
    year: 1903,
    location: {
      name: 'Kitty Hawk, North Carolina',
      coordinates: [-75.7002, 36.0626],
      country: 'United States'
    },
    description: 'The Wright Brothers achieved the first powered, sustained, and controlled airplane flight.',
    category: 'Transportation',
    impact: 'Revolutionized transportation and connected the world, making global travel accessible.',
    timeline: [
      { year: 1903, event: 'First powered flight at Kitty Hawk (12 seconds)' },
      { year: 1914, event: 'First commercial airline service begins' },
      { year: 1927, event: 'Charles Lindbergh crosses Atlantic solo' },
      { year: 1969, event: 'Boeing 747 introduces mass air travel' }
    ]
  },
  {
    id: 'internet',
    name: 'Internet (ARPANET)',
    inventor: 'ARPA Team',
    year: 1969,
    location: {
      name: 'Los Angeles, California',
      coordinates: [-118.2437, 34.0522],
      country: 'United States'
    },
    description: 'ARPANET, the precursor to the modern internet, connected computers across long distances for the first time.',
    category: 'Communication',
    impact: 'Created the foundation for the digital age and transformed every aspect of modern society.',
    timeline: [
      { year: 1969, event: 'First ARPANET message sent between UCLA and Stanford' },
      { year: 1983, event: 'TCP/IP protocol becomes standard' },
      { year: 1989, event: 'World Wide Web invented by Tim Berners-Lee' },
      { year: 1995, event: 'Commercial internet becomes widely available' }
    ]
  },
  {
    id: 'printing-press',
    name: 'Printing Press',
    inventor: 'Johannes Gutenberg',
    year: 1440,
    location: {
      name: 'Mainz, Germany',
      coordinates: [8.2473, 49.9929],
      country: 'Germany'
    },
    description: 'Gutenberg\'s movable type printing press enabled mass production of books and documents.',
    category: 'Communication',
    impact: 'Democratized knowledge, enabled the Renaissance and Reformation, and revolutionized literacy.',
    timeline: [
      { year: 1440, event: 'Gutenberg develops movable type printing' },
      { year: 1455, event: 'Gutenberg Bible printed' },
      { year: 1500, event: 'Over 20 million books printed in Europe' },
      { year: 1517, event: 'Luther\'s 95 Theses spread rapidly via printing' }
    ]
  },
  {
    id: 'steam-engine',
    name: 'Steam Engine',
    inventor: 'James Watt',
    year: 1765,
    location: {
      name: 'Glasgow, Scotland',
      coordinates: [-4.2518, 55.8642],
      country: 'United Kingdom'
    },
    description: 'Watt\'s improved steam engine provided reliable mechanical power and sparked the Industrial Revolution.',
    category: 'Energy',
    impact: 'Powered the Industrial Revolution and transformed manufacturing, transportation, and society.',
    timeline: [
      { year: 1765, event: 'Watt develops separate condenser design' },
      { year: 1776, event: 'First commercial Watt engine installed' },
      { year: 1804, event: 'First steam locomotive' },
      { year: 1850, event: 'Steam power dominates industry and transport' }
    ]
  },
  {
    id: 'computer',
    name: 'Electronic Computer (ENIAC)',
    inventor: 'John Presper Eckert & John Mauchly',
    year: 1945,
    location: {
      name: 'Philadelphia, Pennsylvania',
      coordinates: [-75.1652, 39.9526],
      country: 'United States'
    },
    description: 'ENIAC was the first general-purpose electronic digital computer, capable of being reprogrammed to solve various problems.',
    category: 'Computing',
    impact: 'Launched the computer age and enabled modern digital technology.',
    timeline: [
      { year: 1945, event: 'ENIAC completed at University of Pennsylvania' },
      { year: 1951, event: 'UNIVAC I becomes first commercial computer' },
      { year: 1971, event: 'First microprocessor invented' },
      { year: 1981, event: 'IBM PC launches personal computer era' }
    ]
  },
  {
    id: 'penicillin',
    name: 'Penicillin',
    inventor: 'Alexander Fleming',
    year: 1928,
    location: {
      name: 'London, England',
      coordinates: [-0.1276, 51.5074],
      country: 'United Kingdom'
    },
    description: 'Fleming discovered penicillin, the first widely effective antibiotic, by accident in his laboratory.',
    category: 'Medicine',
    impact: 'Saved millions of lives and launched the antibiotic era of medicine.',
    timeline: [
      { year: 1928, event: 'Fleming discovers penicillin in contaminated culture' },
      { year: 1940, event: 'Penicillin purified for medical use' },
      { year: 1942, event: 'First successful treatment of bacterial infection' },
      { year: 1945, event: 'Fleming, Florey, and Chain win Nobel Prize' }
    ]
  },
  {
    id: 'transistor',
    name: 'Transistor',
    inventor: 'John Bardeen, Walter Brattain & William Shockley',
    year: 1947,
    location: {
      name: 'Murray Hill, New Jersey',
      coordinates: [-74.4032, 40.6852],
      country: 'United States'
    },
    description: 'The transistor replaced vacuum tubes as a semiconductor device for amplifying and switching electronic signals.',
    category: 'Computing',
    impact: 'Enabled miniaturization of electronics and made modern computers and smartphones possible.',
    timeline: [
      { year: 1947, event: 'First working transistor demonstrated at Bell Labs' },
      { year: 1954, event: 'First transistor radio sold' },
      { year: 1958, event: 'Integrated circuit invented' },
      { year: 1971, event: 'Microprocessor combines thousands of transistors' }
    ]
  },
  {
    id: 'world-wide-web',
    name: 'World Wide Web',
    inventor: 'Tim Berners-Lee',
    year: 1989,
    location: {
      name: 'Geneva, Switzerland',
      coordinates: [6.1432, 46.2044],
      country: 'Switzerland'
    },
    description: 'Berners-Lee created the World Wide Web at CERN, including HTTP, HTML, and the first web browser.',
    category: 'Communication',
    impact: 'Made the internet accessible to everyone and created the foundation for modern digital life.',
    timeline: [
      { year: 1989, event: 'Berners-Lee proposes World Wide Web' },
      { year: 1991, event: 'First website goes live' },
      { year: 1993, event: 'Mosaic browser makes web graphical' },
      { year: 1995, event: 'Commercial web explosion begins' }
    ]
  },
  {
    id: 'vaccine',
    name: 'Vaccine (Smallpox)',
    inventor: 'Edward Jenner',
    year: 1796,
    location: {
      name: 'Berkeley, Gloucestershire',
      coordinates: [-2.4552, 51.6909],
      country: 'United Kingdom'
    },
    description: 'Jenner developed the first vaccine by using cowpox to create immunity to smallpox.',
    category: 'Medicine',
    impact: 'Established the principle of vaccination and eventually led to the eradication of smallpox.',
    timeline: [
      { year: 1796, event: 'Jenner performs first vaccination' },
      { year: 1801, event: 'Over 100,000 people vaccinated in England' },
      { year: 1967, event: 'WHO launches smallpox eradication campaign' },
      { year: 1980, event: 'Smallpox declared eradicated worldwide' }
    ]
  },
  {
    id: 'automobile',
    name: 'Automobile',
    inventor: 'Karl Benz',
    year: 1886,
    location: {
      name: 'Mannheim, Germany',
      coordinates: [8.4660, 49.4875],
      country: 'Germany'
    },
    description: 'Benz created the Motorwagen, the first true automobile powered by an internal combustion engine.',
    category: 'Transportation',
    impact: 'Revolutionized personal transportation and shaped modern cities and infrastructure.',
    timeline: [
      { year: 1886, event: 'Benz patents Motorwagen' },
      { year: 1908, event: 'Ford Model T begins mass production' },
      { year: 1913, event: 'Assembly line production revolutionizes manufacturing' },
      { year: 1950, event: 'Car ownership becomes widespread' }
    ]
  },
  {
    id: 'radio',
    name: 'Radio',
    inventor: 'Guglielmo Marconi',
    year: 1895,
    location: {
      name: 'Bologna, Italy',
      coordinates: [11.3426, 44.4949],
      country: 'Italy'
    },
    description: 'Marconi developed practical wireless telegraphy, enabling long-distance radio communication.',
    category: 'Communication',
    impact: 'Enabled mass communication and broadcasting, transforming news, entertainment, and emergency services.',
    timeline: [
      { year: 1895, event: 'Marconi demonstrates wireless telegraph' },
      { year: 1901, event: 'First transatlantic radio signal' },
      { year: 1920, event: 'First commercial radio broadcasts' },
      { year: 1930, event: 'Radio becomes primary mass medium' }
    ]
  },
  {
    id: 'x-ray',
    name: 'X-Ray',
    inventor: 'Wilhelm Röntgen',
    year: 1895,
    location: {
      name: 'Würzburg, Germany',
      coordinates: [9.9534, 49.7913],
      country: 'Germany'
    },
    description: 'Röntgen discovered X-rays while experimenting with cathode rays, revolutionizing medical diagnostics.',
    category: 'Medicine',
    impact: 'Transformed medical diagnosis and treatment, enabling doctors to see inside the body non-invasively.',
    timeline: [
      { year: 1895, event: 'Röntgen discovers X-rays' },
      { year: 1896, event: 'First medical X-ray diagnosis' },
      { year: 1901, event: 'Röntgen wins first Nobel Prize in Physics' },
      { year: 1970, event: 'CT scans developed using X-ray technology' }
    ]
  },
  {
    id: 'dna-structure',
    name: 'DNA Structure',
    inventor: 'James Watson & Francis Crick',
    year: 1953,
    location: {
      name: 'Cambridge, England',
      coordinates: [0.1218, 52.2053],
      country: 'United Kingdom'
    },
    description: 'Watson and Crick discovered the double helix structure of DNA, explaining how genetic information is stored and transmitted.',
    category: 'Medicine',
    impact: 'Revolutionized biology and medicine, enabling genetic engineering and personalized medicine.',
    timeline: [
      { year: 1953, event: 'Double helix structure published' },
      { year: 1962, event: 'Watson, Crick, and Wilkins win Nobel Prize' },
      { year: 1990, event: 'Human Genome Project launched' },
      { year: 2003, event: 'Human genome fully sequenced' }
    ]
  }
];

export const searchInventions = (query: string): Invention[] => {
  const lowerQuery = query.toLowerCase().trim();

  if (lowerQuery.length < 2) {
    return [];
  }

  return inventionsDatabase.filter(invention =>
    invention.name.toLowerCase().includes(lowerQuery) ||
    invention.inventor.toLowerCase().includes(lowerQuery) ||
    invention.category.toLowerCase().includes(lowerQuery) ||
    invention.description.toLowerCase().includes(lowerQuery) ||
    invention.location.name.toLowerCase().includes(lowerQuery)
  );
};

export const getInventionById = (id: string): Invention | undefined => {
  return inventionsDatabase.find(inv => inv.id === id);
};

export const getAllInventions = (): Invention[] => {
  return inventionsDatabase;
};
