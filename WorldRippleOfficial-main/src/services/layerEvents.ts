export interface LayerEvent {
  id: string;
  title: string;
  description: string;
  year: number;
  date: string;
  coordinates: [number, number]; // [longitude, latitude]
  layerType: 'politics' | 'disease' | 'housing' | 'environment' | 'economy' | 'innovation' | 'social';
  magnitude: number; // 1-10 scale of impact
  rippleEffects: string[];
  sources?: string[];
  icon?: string;
}

export const layerEvents: LayerEvent[] = [
  // ==================== POLITICS LAYER (10 events) ====================
  {
    id: 'pol-1',
    title: 'Fall of the Berlin Wall',
    description: 'The fall of the Berlin Wall marked the end of the Cold War and reunified Germany, triggering democratic revolutions across Eastern Europe.',
    year: 1989,
    date: '1989-11-09',
    coordinates: [13.4050, 52.5200], // Berlin, Germany
    layerType: 'politics',
    magnitude: 10,
    rippleEffects: [
      'Reunification of Germany',
      'Collapse of Soviet Union',
      'NATO expansion eastward',
      'EU expansion to Eastern Europe',
      'Global shift to unipolar world'
    ],
    icon: '🏛️'
  },
  {
    id: 'pol-2',
    title: 'Arab Spring Begins',
    description: 'Mohamed Bouazizi\'s self-immolation in Tunisia sparked protests that toppled governments across the Middle East and North Africa.',
    year: 2011,
    date: '2011-01-14',
    coordinates: [10.1815, 36.8065], // Tunisia
    layerType: 'politics',
    magnitude: 9,
    rippleEffects: [
      'Overthrow of multiple governments',
      'Syrian civil war',
      'Rise of ISIS',
      'European refugee crisis',
      'Social media as political tool'
    ],
    icon: '✊'
  },
  {
    id: 'pol-3',
    title: 'Brexit Vote',
    description: 'UK votes to leave the European Union, reshaping European politics and triggering global populist movements.',
    year: 2016,
    date: '2016-06-23',
    coordinates: [-0.1276, 51.5074], // London, UK
    layerType: 'politics',
    magnitude: 8,
    rippleEffects: [
      'UK economic uncertainty',
      'Scottish independence movement',
      'Northern Ireland border issues',
      'Rise of nationalism in Europe',
      'Global trade realignment'
    ],
    icon: '🗳️'
  },
  {
    id: 'pol-4',
    title: 'American Revolution',
    description: 'Declaration of Independence proclaimed, establishing the first modern democracy and inspiring global revolutionary movements.',
    year: 1776,
    date: '1776-07-04',
    coordinates: [-75.1652, 39.9526], // Philadelphia, USA
    layerType: 'politics',
    magnitude: 10,
    rippleEffects: [
      'Birth of modern democracy',
      'French Revolution inspiration',
      'Latin American independence',
      'Constitutional government model',
      'End of colonial era begins'
    ],
    icon: '🦅'
  },
  {
    id: 'pol-5',
    title: 'French Revolution',
    description: 'The storming of the Bastille began a revolution that ended monarchy in France and spread revolutionary ideals across Europe.',
    year: 1789,
    date: '1789-07-14',
    coordinates: [2.3522, 48.8566], // Paris, France
    layerType: 'politics',
    magnitude: 10,
    rippleEffects: [
      'End of absolute monarchy',
      'Napoleonic Wars',
      'Spread of nationalism',
      'Modern political ideologies',
      'Metric system adoption'
    ],
    icon: '⚔️'
  },
  {
    id: 'pol-6',
    title: 'Russian Revolution',
    description: 'Bolsheviks seize power, creating the world\'s first communist state and initiating the Cold War ideological divide.',
    year: 1917,
    date: '1917-11-07',
    coordinates: [30.3351, 59.9343], // St. Petersburg, Russia
    layerType: 'politics',
    magnitude: 10,
    rippleEffects: [
      'Creation of Soviet Union',
      'Global communist movement',
      'Cold War begins',
      'Chinese Revolution',
      'Space race initiated'
    ],
    icon: '☭'
  },
  {
    id: 'pol-7',
    title: 'End of Apartheid',
    description: 'Nelson Mandela becomes South Africa\'s first Black president, ending decades of racial segregation.',
    year: 1994,
    date: '1994-05-10',
    coordinates: [28.0473, -26.2041], // Johannesburg, South Africa
    layerType: 'politics',
    magnitude: 9,
    rippleEffects: [
      'Racial reconciliation model',
      'African democracy wave',
      'Truth and Reconciliation Commission',
      'Economic transformation',
      'Global human rights advancement'
    ],
    icon: '🕊️'
  },
  {
    id: 'pol-8',
    title: 'Cuban Missile Crisis',
    description: 'Nuclear confrontation between USA and USSR brings world to brink of nuclear war, leading to détente.',
    year: 1962,
    date: '1962-10-16',
    coordinates: [-82.3666, 23.1136], // Cuba
    layerType: 'politics',
    magnitude: 9,
    rippleEffects: [
      'Nuclear test ban treaty',
      'Hotline between superpowers',
      'Nuclear non-proliferation',
      'Détente period begins',
      'MAD doctrine established'
    ],
    icon: '☢️'
  },
  {
    id: 'pol-9',
    title: 'Tiananmen Square Protests',
    description: 'Pro-democracy protests in Beijing crushed by military force, freezing China\'s political reform.',
    year: 1989,
    date: '1989-06-04',
    coordinates: [116.4074, 39.9042], // Beijing, China
    layerType: 'politics',
    magnitude: 8,
    rippleEffects: [
      'China political freeze',
      'Economic liberalization continues',
      'Hong Kong concerns rise',
      'Western sanctions imposed',
      'Internet censorship expansion'
    ],
    icon: '🚫'
  },
  {
    id: 'pol-10',
    title: 'Treaty of Versailles',
    description: 'Peace treaty ending WWI imposes harsh terms on Germany, setting stage for WWII.',
    year: 1919,
    date: '1919-06-28',
    coordinates: [2.1201, 48.8049], // Versailles, France
    layerType: 'politics',
    magnitude: 9,
    rippleEffects: [
      'German economic collapse',
      'Rise of fascism',
      'League of Nations created',
      'Ottoman Empire dissolved',
      'Redrawing of European borders'
    ],
    icon: '📜'
  },

  // ==================== DISEASE/HEALTH LAYER (10 events) ====================
  {
    id: 'dis-1',
    title: 'Black Death Arrives in Europe',
    description: 'Bubonic plague kills 30-60% of Europe\'s population, fundamentally reshaping society, economy, and culture.',
    year: 1347,
    date: '1347-10-01',
    coordinates: [12.5674, 41.8719], // Sicily, Italy (entry point)
    layerType: 'disease',
    magnitude: 10,
    rippleEffects: [
      'End of feudalism',
      'Labor shortages increase wages',
      'Religious reformation seeds',
      'Quarantine concept invented',
      'Modern medicine beginnings'
    ],
    icon: '☠️'
  },
  {
    id: 'dis-2',
    title: 'Spanish Flu Pandemic',
    description: 'H1N1 influenza kills 50-100 million people worldwide, more than WWI, reshaping public health systems.',
    year: 1918,
    date: '1918-03-04',
    coordinates: [-94.5786, 39.0997], // Kansas, USA (first recorded)
    layerType: 'disease',
    magnitude: 10,
    rippleEffects: [
      'Modern epidemiology born',
      'National health services created',
      'Mask mandates normalized',
      'Accelerated end of WWI',
      'Lost generation impact'
    ],
    icon: '😷'
  },
  {
    id: 'dis-3',
    title: 'COVID-19 Outbreak',
    description: 'Novel coronavirus pandemic triggers global lockdowns, killing millions and transforming society.',
    year: 2020,
    date: '2020-01-23',
    coordinates: [114.2578, 30.5928], // Wuhan, China
    layerType: 'disease',
    magnitude: 10,
    rippleEffects: [
      'Remote work revolution',
      'mRNA vaccine technology',
      'Global supply chain crisis',
      'Digital transformation acceleration',
      'Mental health crisis'
    ],
    icon: '🦠'
  },
  {
    id: 'dis-4',
    title: 'HIV/AIDS Identified',
    description: 'First cases of AIDS reported in Los Angeles, beginning a pandemic that would kill 36 million people.',
    year: 1981,
    date: '1981-06-05',
    coordinates: [-118.2437, 34.0522], // Los Angeles, USA
    layerType: 'disease',
    magnitude: 9,
    rippleEffects: [
      'LGBTQ rights movement',
      'Blood screening protocols',
      'Antiretroviral therapy development',
      'Global health initiatives',
      'Destigmatization campaigns'
    ],
    icon: '🎗️'
  },
  {
    id: 'dis-5',
    title: 'Smallpox Eradicated',
    description: 'WHO declares smallpox eradicated, the first disease eliminated by human effort.',
    year: 1980,
    date: '1980-05-08',
    coordinates: [6.1319, 46.2022], // Geneva, Switzerland (WHO)
    layerType: 'disease',
    magnitude: 9,
    rippleEffects: [
      'Vaccination triumph proof',
      'Global health cooperation',
      'Polio eradication campaign',
      'Bioweapon concerns',
      'Public health confidence'
    ],
    icon: '💉'
  },
  {
    id: 'dis-6',
    title: 'First Cholera Pandemic',
    description: 'Cholera spreads from India across Asia and Europe, killing millions and spurring sanitation reform.',
    year: 1817,
    date: '1817-08-01',
    coordinates: [88.3639, 22.5726], // Kolkata, India
    layerType: 'disease',
    magnitude: 8,
    rippleEffects: [
      'Modern sewage systems',
      'Public health boards created',
      'Germ theory development',
      'Clean water initiatives',
      'Urban planning reform'
    ],
    icon: '💧'
  },
  {
    id: 'dis-7',
    title: 'SARS Outbreak',
    description: 'First major pandemic threat of 21st century, exposing weaknesses in global health systems.',
    year: 2003,
    date: '2003-02-26',
    coordinates: [114.1694, 22.3193], // Hong Kong
    layerType: 'disease',
    magnitude: 7,
    rippleEffects: [
      'Pandemic preparedness plans',
      'Airport health screening',
      'WHO reform initiatives',
      'Asian mask culture spread',
      'International health regulations'
    ],
    icon: '🏥'
  },
  {
    id: 'dis-8',
    title: 'Ebola Crisis West Africa',
    description: 'Largest Ebola outbreak kills over 11,000 people, transforming global health emergency response.',
    year: 2014,
    date: '2014-03-23',
    coordinates: [-10.8000, 6.3156], // Guinea
    layerType: 'disease',
    magnitude: 8,
    rippleEffects: [
      'Rapid vaccine development',
      'Global health security agenda',
      'Contact tracing systems',
      'African CDC creation',
      'Emergency response reforms'
    ],
    icon: '🚨'
  },
  {
    id: 'dis-9',
    title: 'Polio Vaccine Success',
    description: 'Jonas Salk\'s polio vaccine proves effective, beginning the end of a disease that paralyzed thousands.',
    year: 1955,
    date: '1955-04-12',
    coordinates: [-79.9959, 40.4406], // Pittsburgh, USA
    layerType: 'disease',
    magnitude: 9,
    rippleEffects: [
      'Mass vaccination campaigns',
      'Vaccine confidence boost',
      'March of Dimes success',
      'Global polio eradication',
      'Biomedical research funding'
    ],
    icon: '🧬'
  },
  {
    id: 'dis-10',
    title: 'Discovery of Penicillin',
    description: 'Alexander Fleming discovers penicillin, launching the antibiotic era and saving millions of lives.',
    year: 1928,
    date: '1928-09-28',
    coordinates: [-0.1276, 51.5074], // London, UK
    layerType: 'disease',
    magnitude: 10,
    rippleEffects: [
      'Antibiotic revolution',
      'Surgical advancement',
      'Population explosion',
      'Agricultural antibiotics',
      'Antibiotic resistance crisis'
    ],
    icon: '💊'
  },

  // ==================== HOUSING/URBAN LAYER (10 events) ====================
  {
    id: 'hou-1',
    title: '2008 Housing Crisis',
    description: 'Subprime mortgage crisis triggers global financial meltdown, millions lose homes.',
    year: 2008,
    date: '2008-09-15',
    coordinates: [-74.0109, 40.7074], // Wall Street, New York
    layerType: 'housing',
    magnitude: 10,
    rippleEffects: [
      'Global recession',
      'Bank bailouts',
      'Occupy Wall Street',
      'Mortgage reform',
      'Millennial homeownership crisis'
    ],
    icon: '🏚️'
  },
  {
    id: 'hou-2',
    title: 'Great Fire of London',
    description: 'Fire destroys 13,200 houses, leading to building regulations and modern urban planning.',
    year: 1666,
    date: '1666-09-02',
    coordinates: [-0.0877, 51.5099], // Pudding Lane, London
    layerType: 'housing',
    magnitude: 8,
    rippleEffects: [
      'Fire insurance invention',
      'Building codes created',
      'Brick construction mandated',
      'Urban planning birth',
      'Fire brigade establishment'
    ],
    icon: '🔥'
  },
  {
    id: 'hou-3',
    title: 'Haussmann\'s Paris Renovation',
    description: 'Massive urban renewal creates modern Paris with wide boulevards and parks.',
    year: 1853,
    date: '1853-01-01',
    coordinates: [2.3522, 48.8566], // Paris, France
    layerType: 'housing',
    magnitude: 9,
    rippleEffects: [
      'Modern city planning model',
      'Gentrification concept',
      'Public health improvement',
      'Revolutionary control design',
      'Tourism industry birth'
    ],
    icon: '🏛️'
  },
  {
    id: 'hou-4',
    title: 'Great Chicago Fire',
    description: 'Fire destroys 17,500 buildings, leads to modern fire codes and skyscraper development.',
    year: 1871,
    date: '1871-10-08',
    coordinates: [-87.6298, 41.8781], // Chicago, USA
    layerType: 'housing',
    magnitude: 8,
    rippleEffects: [
      'Fireproof construction',
      'Skyscraper innovation',
      'Urban fire codes',
      'Insurance industry growth',
      'Steel frame buildings'
    ],
    icon: '🔥'
  },
  {
    id: 'hou-5',
    title: 'Japan Asset Bubble Burst',
    description: 'Property and stock market collapse ends Japan\'s economic miracle, creating "Lost Decade".',
    year: 1991,
    date: '1991-12-01',
    coordinates: [139.6503, 35.6762], // Tokyo, Japan
    layerType: 'housing',
    magnitude: 9,
    rippleEffects: [
      'Decades of deflation',
      'Zombie companies',
      'Demographic crisis',
      'Global financial caution',
      'QE policy development'
    ],
    icon: '📉'
  },
  {
    id: 'hou-6',
    title: 'Chinese Ghost Cities',
    description: 'Massive overbuilding creates empty cities, symbolizing China\'s property bubble.',
    year: 2010,
    date: '2010-01-01',
    coordinates: [109.7889, 39.6086], // Ordos, China
    layerType: 'housing',
    magnitude: 7,
    rippleEffects: [
      'Debt crisis warnings',
      'Economic rebalancing',
      'Urban planning critique',
      'Shadow banking growth',
      'Global commodity impact'
    ],
    icon: '👻'
  },
  {
    id: 'hou-7',
    title: 'NYC Rent Control Begins',
    description: 'Emergency wartime measure becomes permanent, reshaping urban housing policy.',
    year: 1943,
    date: '1943-11-01',
    coordinates: [-74.0060, 40.7128], // New York City
    layerType: 'housing',
    magnitude: 8,
    rippleEffects: [
      'Tenant rights movement',
      'Housing shortage debate',
      'Gentrification resistance',
      'Policy model spread',
      'Property rights conflict'
    ],
    icon: '🏢'
  },
  {
    id: 'hou-8',
    title: 'Singapore Public Housing Launch',
    description: 'HDB program houses 80% of population, becoming model for affordable housing.',
    year: 1960,
    date: '1960-02-01',
    coordinates: [103.8198, 1.3521], // Singapore
    layerType: 'housing',
    magnitude: 9,
    rippleEffects: [
      'Homeownership society',
      'Racial integration policy',
      'Economic development tool',
      'Social stability achieved',
      'Urban model exported'
    ],
    icon: '🏘️'
  },
  {
    id: 'hou-9',
    title: 'Berlin Housing Referendum',
    description: 'Voters approve expropriating large landlords, challenging property rights.',
    year: 2021,
    date: '2021-09-26',
    coordinates: [13.4050, 52.5200], // Berlin, Germany
    layerType: 'housing',
    magnitude: 7,
    rippleEffects: [
      'Property rights debate',
      'Rent control expansion',
      'Investment flight fears',
      'European policy influence',
      'Housing activism surge'
    ],
    icon: '🗳️'
  },
  {
    id: 'hou-10',
    title: 'San Francisco Earthquake',
    description: 'Earthquake and fires destroy 80% of city, spurring seismic building codes.',
    year: 1906,
    date: '1906-04-18',
    coordinates: [-122.4194, 37.7749], // San Francisco, USA
    layerType: 'housing',
    magnitude: 9,
    rippleEffects: [
      'Seismic building codes',
      'Earthquake insurance',
      'Urban renewal opportunity',
      'Engineering advancement',
      'Disaster preparedness'
    ],
    icon: '🌋'
  },

  // ==================== ENVIRONMENT LAYER (10 events) ====================
  {
    id: 'env-1',
    title: 'Chernobyl Nuclear Disaster',
    description: 'Nuclear reactor explosion releases radiation across Europe, transforming nuclear policy globally.',
    year: 1986,
    date: '1986-04-26',
    coordinates: [30.0997, 51.3894], // Chernobyl, Ukraine
    layerType: 'environment',
    magnitude: 10,
    rippleEffects: [
      'Nuclear phase-out movements',
      'Glasnost acceleration',
      'Environmental activism surge',
      'Renewable energy push',
      'Nuclear safety revolution'
    ],
    icon: '☢️'
  },
  {
    id: 'env-2',
    title: 'Fukushima Nuclear Disaster',
    description: 'Earthquake and tsunami trigger nuclear meltdown, ending nuclear renaissance.',
    year: 2011,
    date: '2011-03-11',
    coordinates: [141.0281, 37.4211], // Fukushima, Japan
    layerType: 'environment',
    magnitude: 9,
    rippleEffects: [
      'Germany nuclear exit',
      'Renewable energy acceleration',
      'Tsunami warning systems',
      'Food safety concerns',
      'Ocean contamination fears'
    ],
    icon: '🌊'
  },
  {
    id: 'env-3',
    title: 'Mount Vesuvius Erupts',
    description: 'Volcanic eruption buries Pompeii and Herculaneum, preserving ancient Roman life.',
    year: 79,
    date: '0079-08-24',
    coordinates: [14.4260, 40.8210], // Mount Vesuvius, Italy
    layerType: 'environment',
    magnitude: 8,
    rippleEffects: [
      'Volcanology birth',
      'Archaeological preservation',
      'Disaster documentation',
      'Urban planning lessons',
      'Tourism industry'
    ],
    icon: '🌋'
  },
  {
    id: 'env-4',
    title: 'Indian Ocean Tsunami',
    description: 'Magnitude 9.1 earthquake triggers tsunami killing 230,000 across 14 countries.',
    year: 2004,
    date: '2004-12-26',
    coordinates: [95.9820, 3.3160], // Off Sumatra, Indonesia
    layerType: 'environment',
    magnitude: 10,
    rippleEffects: [
      'Tsunami warning systems',
      'International aid coordination',
      'Tourism industry impact',
      'Building code changes',
      'Climate refugee awareness'
    ],
    icon: '🌊'
  },
  {
    id: 'env-5',
    title: 'Hurricane Katrina',
    description: 'Category 5 hurricane devastates New Orleans, exposing infrastructure and inequality.',
    year: 2005,
    date: '2005-08-29',
    coordinates: [-90.0715, 29.9511], // New Orleans, USA
    layerType: 'environment',
    magnitude: 9,
    rippleEffects: [
      'FEMA reform',
      'Climate change awareness',
      'Environmental racism exposed',
      'Wetland protection',
      'Mass displacement'
    ],
    icon: '🌀'
  },
  {
    id: 'env-6',
    title: 'Dust Bowl Begins',
    description: 'Severe drought and poor farming create ecological disaster across Great Plains.',
    year: 1930,
    date: '1930-01-01',
    coordinates: [-101.0012, 37.0000], // Great Plains, USA
    layerType: 'environment',
    magnitude: 9,
    rippleEffects: [
      'Agricultural reform',
      'Soil conservation service',
      'Mass migration west',
      'New Deal programs',
      'Environmental awareness'
    ],
    icon: '🌾'
  },
  {
    id: 'env-7',
    title: 'Amazon Rainforest Fires',
    description: 'Record fires in Amazon trigger global climate emergency declarations.',
    year: 2019,
    date: '2019-08-01',
    coordinates: [-55.5000, -10.0000], // Amazon, Brazil
    layerType: 'environment',
    magnitude: 8,
    rippleEffects: [
      'Climate emergency declarations',
      'International pressure',
      'Indigenous rights focus',
      'Corporate responsibility',
      'Carbon market impact'
    ],
    icon: '🔥'
  },
  {
    id: 'env-8',
    title: 'Australian Bushfires',
    description: 'Unprecedented fires kill billions of animals, smoke reaches South America.',
    year: 2020,
    date: '2020-01-01',
    coordinates: [133.7751, -25.2744], // Australia
    layerType: 'environment',
    magnitude: 9,
    rippleEffects: [
      'Wildlife extinction fears',
      'Climate policy pressure',
      'Fire management reform',
      'Global air quality impact',
      'Tourism devastation'
    ],
    icon: '🔥'
  },
  {
    id: 'env-9',
    title: 'Exxon Valdez Oil Spill',
    description: 'Tanker spills 11 million gallons of oil in pristine Alaska waters.',
    year: 1989,
    date: '1989-03-24',
    coordinates: [-146.0400, 60.8372], // Prince William Sound, Alaska
    layerType: 'environment',
    magnitude: 8,
    rippleEffects: [
      'Double-hull tanker requirements',
      'Oil spill response plans',
      'Corporate liability expansion',
      'Environmental movement boost',
      'Alaska economy impact'
    ],
    icon: '🛢️'
  },
  {
    id: 'env-10',
    title: 'Bhopal Gas Tragedy',
    description: 'Chemical plant leak kills thousands immediately, hundreds of thousands affected long-term.',
    year: 1984,
    date: '1984-12-03',
    coordinates: [77.4126, 23.2599], // Bhopal, India
    layerType: 'environment',
    magnitude: 9,
    rippleEffects: [
      'Chemical industry regulation',
      'Corporate liability laws',
      'Environmental justice movement',
      'Industrial safety standards',
      'Right to know laws'
    ],
    icon: '☠️'
  },

  // ==================== ECONOMY LAYER (10 events) ====================
  {
    id: 'eco-1',
    title: 'Great Depression Begins',
    description: 'Stock market crash triggers worldwide economic depression, reshaping capitalism.',
    year: 1929,
    date: '1929-10-29',
    coordinates: [-74.0109, 40.7074], // Wall Street, New York
    layerType: 'economy',
    magnitude: 10,
    rippleEffects: [
      'New Deal programs',
      'Social security creation',
      'Banking regulation',
      'Keynesian economics',
      'WWII economic boom'
    ],
    icon: '📉'
  },
  {
    id: 'eco-2',
    title: '2008 Financial Crisis',
    description: 'Lehman Brothers collapse triggers worst recession since Great Depression.',
    year: 2008,
    date: '2008-09-15',
    coordinates: [-74.0109, 40.7074], // Wall Street, New York
    layerType: 'economy',
    magnitude: 10,
    rippleEffects: [
      'Bank bailouts',
      'Quantitative easing',
      'Dodd-Frank regulation',
      'Eurozone crisis',
      'Cryptocurrency rise'
    ],
    icon: '🏦'
  },
  {
    id: 'eco-3',
    title: 'Dot-com Bubble Burst',
    description: 'Internet stock bubble bursts, wiping out $5 trillion in market value.',
    year: 2000,
    date: '2000-03-10',
    coordinates: [-122.0322, 37.3230], // Silicon Valley, USA
    layerType: 'economy',
    magnitude: 8,
    rippleEffects: [
      'Tech industry consolidation',
      'Venture capital caution',
      'Sarbanes-Oxley Act',
      'Web 2.0 emergence',
      'Cloud computing rise'
    ],
    icon: '💻'
  },
  {
    id: 'eco-4',
    title: 'Asian Financial Crisis',
    description: 'Currency crisis spreads across Asia, forcing IMF interventions.',
    year: 1997,
    date: '1997-07-02',
    coordinates: [100.5018, 13.7563], // Bangkok, Thailand
    layerType: 'economy',
    magnitude: 9,
    rippleEffects: [
      'IMF reform debates',
      'Capital controls return',
      'Regional currency ideas',
      'China\'s rise acceleration',
      'Emerging market caution'
    ],
    icon: '💱'
  },
  {
    id: 'eco-5',
    title: 'German Hyperinflation',
    description: 'Weimar Republic experiences hyperinflation, money becomes worthless.',
    year: 1923,
    date: '1923-11-01',
    coordinates: [13.4050, 52.5200], // Berlin, Germany
    layerType: 'economy',
    magnitude: 9,
    rippleEffects: [
      'Rise of extremism',
      'Central bank independence',
      'Gold standard abandonment',
      'Economic planning',
      'Currency reform models'
    ],
    icon: '💸'
  },
  {
    id: 'eco-6',
    title: 'Tulip Mania Peak',
    description: 'First recorded speculative bubble bursts in Dutch tulip market.',
    year: 1637,
    date: '1637-02-03',
    coordinates: [4.8952, 52.3676], // Amsterdam, Netherlands
    layerType: 'economy',
    magnitude: 7,
    rippleEffects: [
      'Futures market development',
      'Bubble theory creation',
      'Options trading birth',
      'Market psychology study',
      'Financial regulation'
    ],
    icon: '🌷'
  },
  {
    id: 'eco-7',
    title: 'OPEC Oil Embargo',
    description: 'Arab oil embargo quadruples oil prices, triggering stagflation.',
    year: 1973,
    date: '1973-10-17',
    coordinates: [46.6753, 24.7136], // Riyadh, Saudi Arabia
    layerType: 'economy',
    magnitude: 9,
    rippleEffects: [
      'Energy crisis',
      'Alternative energy research',
      'Petrodollar system',
      'Fuel efficiency standards',
      'Strategic oil reserves'
    ],
    icon: '⛽'
  },
  {
    id: 'eco-8',
    title: 'Japanese Economic Miracle',
    description: 'Japan becomes world\'s second-largest economy through rapid industrialization.',
    year: 1960,
    date: '1960-01-01',
    coordinates: [139.6503, 35.6762], // Tokyo, Japan
    layerType: 'economy',
    magnitude: 9,
    rippleEffects: [
      'Asian Tiger model',
      'Just-in-time manufacturing',
      'Quality revolution',
      'Trade friction with US',
      'Development model export'
    ],
    icon: '🗾'
  },
  {
    id: 'eco-9',
    title: 'Bitcoin Genesis Block',
    description: 'First cryptocurrency launched, beginning blockchain revolution.',
    year: 2009,
    date: '2009-01-03',
    coordinates: [0, 0], // Digital/Global
    layerType: 'economy',
    magnitude: 8,
    rippleEffects: [
      'Cryptocurrency explosion',
      'DeFi development',
      'Central bank digital currencies',
      'Blockchain applications',
      'Financial decentralization'
    ],
    icon: '₿'
  },
  {
    id: 'eco-10',
    title: 'Black Monday Crash',
    description: 'Dow Jones falls 22% in single day, largest one-day percentage decline.',
    year: 1987,
    date: '1987-10-19',
    coordinates: [-74.0109, 40.7074], // Wall Street, New York
    layerType: 'economy',
    magnitude: 8,
    rippleEffects: [
      'Circuit breakers introduced',
      'Program trading limits',
      'Portfolio insurance failure',
      'Fed intervention model',
      'Global market correlation'
    ],
    icon: '📊'
  },

  // ==================== INNOVATION LAYER (10 events) ====================
  {
    id: 'inn-1',
    title: 'World Wide Web Goes Public',
    description: 'Tim Berners-Lee releases WWW to public, transforming human communication.',
    year: 1991,
    date: '1991-08-06',
    coordinates: [6.0503, 46.2338], // CERN, Switzerland
    layerType: 'innovation',
    magnitude: 10,
    rippleEffects: [
      'Information democratization',
      'E-commerce birth',
      'Social media creation',
      'Digital economy',
      'Remote work possibility'
    ],
    icon: '🌐'
  },
  {
    id: 'inn-2',
    title: 'First iPhone Launch',
    description: 'Apple launches iPhone, putting computers in everyone\'s pocket.',
    year: 2007,
    date: '2007-01-09',
    coordinates: [-122.0322, 37.3318], // Cupertino, USA
    layerType: 'innovation',
    magnitude: 10,
    rippleEffects: [
      'App economy creation',
      'Mobile-first world',
      'Social media explosion',
      'Gig economy enablement',
      'Digital addiction concerns'
    ],
    icon: '📱'
  },
  {
    id: 'inn-3',
    title: 'Steam Engine Patent',
    description: 'James Watt patents improved steam engine, powering Industrial Revolution.',
    year: 1769,
    date: '1769-01-05',
    coordinates: [-4.2518, 55.8642], // Glasgow, Scotland
    layerType: 'innovation',
    magnitude: 10,
    rippleEffects: [
      'Industrial Revolution',
      'Railway transportation',
      'Factory system',
      'Urbanization wave',
      'Coal dependency'
    ],
    icon: '🚂'
  },
  {
    id: 'inn-4',
    title: 'First Electric Grid',
    description: 'Edison opens first power plant, beginning electrification of the world.',
    year: 1882,
    date: '1882-09-04',
    coordinates: [-74.0109, 40.7061], // Pearl Street, NYC
    layerType: 'innovation',
    magnitude: 10,
    rippleEffects: [
      'Electric appliances',
      '24-hour society',
      'Industrial productivity',
      'Urban transformation',
      'Energy dependency'
    ],
    icon: '💡'
  },
  {
    id: 'inn-5',
    title: 'Wright Brothers First Flight',
    description: 'First powered flight lasts 12 seconds, launching aviation age.',
    year: 1903,
    date: '1903-12-17',
    coordinates: [-75.9680, 36.0169], // Kitty Hawk, USA
    layerType: 'innovation',
    magnitude: 10,
    rippleEffects: [
      'Global travel revolution',
      'Military aviation',
      'Economic globalization',
      'Space exploration',
      'Climate impact'
    ],
    icon: '✈️'
  },
  {
    id: 'inn-6',
    title: 'Transistor Invented',
    description: 'Bell Labs invents transistor, enabling digital revolution.',
    year: 1947,
    date: '1947-12-23',
    coordinates: [-74.4032, 40.6852], // Bell Labs, New Jersey
    layerType: 'innovation',
    magnitude: 10,
    rippleEffects: [
      'Computer revolution',
      'Silicon Valley birth',
      'Miniaturization trend',
      'Digital economy',
      'Information age'
    ],
    icon: '🔌'
  },
  {
    id: 'inn-7',
    title: 'Printing Press Invented',
    description: 'Gutenberg invents movable type printing, democratizing knowledge.',
    year: 1440,
    date: '1440-01-01',
    coordinates: [8.2473, 49.9929], // Mainz, Germany
    layerType: 'innovation',
    magnitude: 10,
    rippleEffects: [
      'Protestant Reformation',
      'Scientific Revolution',
      'Mass literacy',
      'Newspaper industry',
      'Democratic ideals'
    ],
    icon: '📚'
  },
  {
    id: 'inn-8',
    title: 'First Telegraph Message',
    description: 'Morse sends "What hath God wrought", beginning instant communication era.',
    year: 1844,
    date: '1844-05-24',
    coordinates: [-77.0369, 38.9072], // Washington DC, USA
    layerType: 'innovation',
    magnitude: 9,
    rippleEffects: [
      'News wire services',
      'Financial markets integration',
      'Railroad coordination',
      'Weather forecasting',
      'Time zone creation'
    ],
    icon: '📡'
  },
  {
    id: 'inn-9',
    title: 'CRISPR Gene Editing',
    description: 'Revolutionary gene-editing technology discovered, opening new medical frontiers.',
    year: 2012,
    date: '2012-06-28',
    coordinates: [-122.2585, 37.8719], // Berkeley, USA
    layerType: 'innovation',
    magnitude: 9,
    rippleEffects: [
      'Gene therapy revolution',
      'Agricultural modification',
      'Ethical debates',
      'Disease eradication potential',
      'Designer baby concerns'
    ],
    icon: '🧬'
  },
  {
    id: 'inn-10',
    title: 'SpaceX Lands Reusable Rocket',
    description: 'First orbital rocket successfully lands, revolutionizing space economics.',
    year: 2015,
    date: '2015-12-21',
    coordinates: [-80.5778, 28.5620], // Cape Canaveral, USA
    layerType: 'innovation',
    magnitude: 8,
    rippleEffects: [
      'Space commercialization',
      'Mars colonization plans',
      'Satellite constellation',
      'Space tourism',
      'Launch cost reduction'
    ],
    icon: '🚀'
  },

  // ==================== SOCIAL MOVEMENTS LAYER (10 events) ====================
  {
    id: 'soc-1',
    title: 'Civil Rights Act Signed',
    description: 'Landmark legislation outlaws discrimination, transforming American society.',
    year: 1964,
    date: '1964-07-02',
    coordinates: [-77.0369, 38.9072], // Washington DC, USA
    layerType: 'social',
    magnitude: 10,
    rippleEffects: [
      'Voting rights expansion',
      'Affirmative action',
      'Women\'s rights movement',
      'LGBTQ rights inspiration',
      'Global civil rights'
    ],
    icon: '⚖️'
  },
  {
    id: 'soc-2',
    title: 'Mandela Freed from Prison',
    description: 'After 27 years, Mandela\'s release signals apartheid\'s end.',
    year: 1990,
    date: '1990-02-11',
    coordinates: [18.4241, -33.9249], // Cape Town, South Africa
    layerType: 'social',
    magnitude: 9,
    rippleEffects: [
      'Apartheid dismantling',
      'Truth and reconciliation',
      'African democratization',
      'Racial justice model',
      'International sanctions end'
    ],
    icon: '🕊️'
  },
  {
    id: 'soc-3',
    title: 'Women\'s Suffrage (19th Amendment)',
    description: 'US women gain right to vote after decades of struggle.',
    year: 1920,
    date: '1920-08-26',
    coordinates: [-77.0369, 38.9072], // Washington DC, USA
    layerType: 'social',
    magnitude: 9,
    rippleEffects: [
      'Political participation',
      'Gender equality movement',
      'Labor rights expansion',
      'Global suffrage spread',
      'Feminist waves'
    ],
    icon: '🗳️'
  },
  {
    id: 'soc-4',
    title: 'Stonewall Riots',
    description: 'Police raid on gay bar sparks modern LGBTQ rights movement.',
    year: 1969,
    date: '1969-06-28',
    coordinates: [-74.0022, 40.7338], // Greenwich Village, NYC
    layerType: 'social',
    magnitude: 8,
    rippleEffects: [
      'Pride movement birth',
      'LGBTQ rights activism',
      'Same-sex marriage path',
      'Anti-discrimination laws',
      'Cultural acceptance shift'
    ],
    icon: '🏳️‍🌈'
  },
  {
    id: 'soc-5',
    title: 'May 1968 Paris Protests',
    description: 'Student protests nearly topple French government, inspire global movement.',
    year: 1968,
    date: '1968-05-03',
    coordinates: [2.3522, 48.8566], // Paris, France
    layerType: 'social',
    magnitude: 8,
    rippleEffects: [
      'Global student movements',
      'Workers\' rights expansion',
      'Cultural revolution',
      'Educational reform',
      'New Left emergence'
    ],
    icon: '✊'
  },
  {
    id: 'soc-6',
    title: '#MeToo Movement Explodes',
    description: 'Harvey Weinstein allegations trigger global reckoning on sexual harassment.',
    year: 2017,
    date: '2017-10-05',
    coordinates: [-118.2437, 34.0522], // Los Angeles, USA
    layerType: 'social',
    magnitude: 9,
    rippleEffects: [
      'Workplace culture change',
      'Power structure challenges',
      'Legal reform push',
      'Global movement spread',
      'Time\'s Up creation'
    ],
    icon: '#️⃣'
  },
  {
    id: 'soc-7',
    title: 'Occupy Wall Street',
    description: '"We are the 99%" movement highlights income inequality.',
    year: 2011,
    date: '2011-09-17',
    coordinates: [-74.0109, 40.7074], // Wall Street, New York
    layerType: 'social',
    magnitude: 8,
    rippleEffects: [
      'Inequality awareness',
      'Progressive politics rise',
      'Student debt focus',
      'Global occupy movements',
      'Wealth tax debates'
    ],
    icon: '⛺'
  },
  {
    id: 'soc-8',
    title: 'Gandhi\'s Salt March',
    description: 'Nonviolent protest against British salt tax galvanizes independence movement.',
    year: 1930,
    date: '1930-03-12',
    coordinates: [72.8311, 21.1702], // Dandi, India
    layerType: 'social',
    magnitude: 9,
    rippleEffects: [
      'Nonviolent resistance model',
      'Indian independence',
      'Civil rights inspiration',
      'Decolonization wave',
      'Gandhi global influence'
    ],
    icon: '🧂'
  },
  {
    id: 'soc-9',
    title: 'Fall of Berlin Wall',
    description: 'Citizens tear down wall, reuniting families and ending Cold War division.',
    year: 1989,
    date: '1989-11-09',
    coordinates: [13.3778, 52.5163], // Brandenburg Gate, Berlin
    layerType: 'social',
    magnitude: 10,
    rippleEffects: [
      'German reunification',
      'Eastern Europe liberation',
      'Soviet Union collapse',
      'European integration',
      'Democracy spread'
    ],
    icon: '🧱'
  },
  {
    id: 'soc-10',
    title: 'Tunisian Revolution Begins',
    description: 'Mohamed Bouazizi\'s self-immolation sparks Arab Spring.',
    year: 2010,
    date: '2010-12-17',
    coordinates: [9.5375, 35.1028], // Sidi Bouzid, Tunisia
    layerType: 'social',
    magnitude: 9,
    rippleEffects: [
      'Arab Spring wave',
      'Social media activism',
      'Regime changes',
      'Youth movements',
      'Democratic struggles'
    ],
    icon: '🔥'
  }
];

// Helper functions
export const layerEventsService = {
  // Get all events for specific layer(s)
  getEventsByLayers: (layerTypes: string[]): LayerEvent[] => {
    return layerEvents.filter(event => 
      layerTypes.includes(event.layerType)
    );
  },

  // Get events within a year range
  getEventsByYearRange: (startYear: number, endYear: number): LayerEvent[] => {
    return layerEvents.filter(event => 
      event.year >= startYear && event.year <= endYear
    );
  },

  // Get events for specific layer within year range
  getLayerEventsByYear: (layerType: string, startYear: number, endYear: number): LayerEvent[] => {
    return layerEvents.filter(event => 
      event.layerType === layerType && 
      event.year >= startYear && 
      event.year <= endYear
    );
  },

  // Get all events sorted by year
  getAllEventsSorted: (): LayerEvent[] => {
    return [...layerEvents].sort((a, b) => a.year - b.year);
  },

  // Get events by magnitude threshold
  getHighImpactEvents: (minMagnitude: number = 8): LayerEvent[] => {
    return layerEvents.filter(event => event.magnitude >= minMagnitude);
  },

  // Get layer color
  getLayerColor: (layerType: string): string => {
    const colors = {
      politics: '#8B5CF6',
      disease: '#EF4444',
      housing: '#64748B',
      environment: '#06B6D4',
      economy: '#10B981',
      innovation: '#F59E0B',
      social: '#EC4899'
    };
    return colors[layerType as keyof typeof colors] || '#6B7280';
  }
};