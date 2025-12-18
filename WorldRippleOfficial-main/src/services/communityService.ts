export interface CommunityContribution {
  id: string;
  author: string;
  title: string;
  content: string;
  type: 'story' | 'data' | 'insight' | 'question';
  votes: number;
  timestamp: Date;
  status: 'pending' | 'approved' | 'flagged';
  tags: string[];
  location?: string;
  coordinates?: [number, number];
}

// Sample community contributions with coordinates
export const communityContributions: CommunityContribution[] = [
  {
    id: '1',
    author: 'Dr. Sarah Chen',
    title: 'COVID-19 Impact on Bay Area Housing',
    content: 'During 2020-2021, I observed a 40% increase in remote work policies in tech companies, which directly correlated with increased housing demand in suburban areas. This caused a ripple effect: urban rent decreased by 15% while suburban prices increased by 25%. The social fabric changed as communities adapted to new residents.',
    type: 'insight',
    votes: 24,
    timestamp: new Date('2024-01-15'),
    status: 'approved',
    tags: ['housing', 'pandemic', 'bay-area'],
    location: 'San Francisco, CA',
    coordinates: [-122.4194, 37.7749]
  },
  {
    id: '2',
    author: 'Marcus Rodriguez',
    title: 'Local Food Desert Data',
    content: 'I\'ve been tracking food accessibility in Detroit since 2018. Would like to contribute census tract-level data showing the correlation between food deserts and health outcomes. Areas with limited grocery access show 30% higher diabetes rates.',
    type: 'data',
    votes: 18,
    timestamp: new Date('2024-01-12'),
    status: 'approved',
    tags: ['health', 'food', 'detroit'],
    location: 'Detroit, MI',
    coordinates: [-83.0458, 42.3314]
  },
  {
    id: '3',
    author: 'Prof. Elena Vasquez',
    title: 'Climate Migration Patterns',
    content: 'My research shows climate-induced migration from coastal areas to inland cities is accelerating. Miami has lost 50,000 residents to Atlanta and Nashville since 2020, creating housing pressure and cultural shifts in receiving cities.',
    type: 'insight',
    votes: 31,
    timestamp: new Date('2024-01-10'),
    status: 'approved',
    tags: ['climate', 'migration', 'demographics'],
    location: 'Miami, FL',
    coordinates: [-80.1918, 25.7617]
  },
  {
    id: '4',
    author: 'James Watanabe',
    title: 'Tokyo Olympics Economic Ripple',
    content: 'The 2021 Tokyo Olympics without spectators created unexpected economic patterns. Small businesses lost ¥200 billion, but e-commerce and streaming services saw 300% growth. This accelerated Japan\'s digital transformation by 5 years.',
    type: 'story',
    votes: 42,
    timestamp: new Date('2024-01-08'),
    status: 'approved',
    tags: ['economics', 'sports', 'japan'],
    location: 'Tokyo, Japan',
    coordinates: [139.6503, 35.6762]
  },
  {
    id: '5',
    author: 'Dr. Amara Okonkwo',
    title: 'Nigeria Tech Hub Growth',
    content: 'Lagos has become Africa\'s Silicon Valley. Since 2020, 200+ startups launched, creating 50,000 jobs and attracting $2 billion in investment. This triggered infrastructure development and reversed brain drain.',
    type: 'data',
    votes: 28,
    timestamp: new Date('2024-01-05'),
    status: 'approved',
    tags: ['technology', 'economics', 'africa'],
    location: 'Lagos, Nigeria',
    coordinates: [3.3792, 6.5244]
  },
  {
    id: '6',
    author: 'Maria Fernandez',
    title: 'Amazon Deforestation Tipping Point',
    content: 'Local observations show unprecedented drought in regions that were rainforest 10 years ago. The microclimate changes are affecting agriculture 500km away. We\'re witnessing the cascading collapse of an ecosystem in real-time.',
    type: 'insight',
    votes: 56,
    timestamp: new Date('2024-01-03'),
    status: 'approved',
    tags: ['environment', 'climate', 'brazil'],
    location: 'Manaus, Brazil',
    coordinates: [-60.0217, -3.1190]
  },
  {
    id: '7',
    author: 'Dr. Lars Peterson',
    title: 'Nordic Green Energy Success',
    content: 'Norway\'s 98% renewable electricity created a ripple: EV adoption hit 80%, air quality improved 40%, and the country became a battery technology hub, attracting €5 billion in investments.',
    type: 'story',
    votes: 35,
    timestamp: new Date('2023-12-28'),
    status: 'approved',
    tags: ['energy', 'environment', 'innovation'],
    location: 'Oslo, Norway',
    coordinates: [10.7522, 59.9139]
  },
  {
    id: '8',
    author: 'Ahmed Al-Rashid',
    title: 'Dubai Floods Infrastructure Impact',
    content: 'The 2024 floods exposed infrastructure vulnerabilities. Insurance claims exceeded $10 billion, construction standards changed overnight, and the city is now investing $50 billion in climate adaptation.',
    type: 'data',
    votes: 22,
    timestamp: new Date('2023-12-25'),
    status: 'approved',
    tags: ['climate', 'infrastructure', 'economics'],
    location: 'Dubai, UAE',
    coordinates: [55.2708, 25.2048]
  },
  {
    id: '9',
    author: 'Dr. Chen Wei',
    title: 'Shanghai Lockdown Ripple Effects',
    content: 'The 2022 Shanghai lockdown affected global supply chains for 18 months. Auto production dropped 30% worldwide, semiconductor shortages worsened, and companies restructured entire supply strategies.',
    type: 'insight',
    votes: 48,
    timestamp: new Date('2023-12-20'),
    status: 'approved',
    tags: ['pandemic', 'economics', 'supply-chain'],
    location: 'Shanghai, China',
    coordinates: [121.4737, 31.2304]
  },
  {
    id: '10',
    author: 'Sophie Dubois',
    title: 'Paris 15-Minute City Success',
    content: 'Paris\'s 15-minute city concept reduced car traffic by 40%, increased local business revenue by 30%, and improved air quality. Other cities are now copying this model, reshaping urban planning globally.',
    type: 'story',
    votes: 39,
    timestamp: new Date('2023-12-15'),
    status: 'approved',
    tags: ['urban-planning', 'environment', 'innovation'],
    location: 'Paris, France',
    coordinates: [2.3522, 48.8566]
  }
];

export const communityService = {
  getContributions: () => communityContributions,
  
  getApprovedContributions: () => 
    communityContributions.filter(c => c.status === 'approved'),
  
  getContributionsByType: (type: CommunityContribution['type']) =>
    communityContributions.filter(c => c.type === type),
  
  getContributionsWithCoordinates: () =>
    communityContributions.filter(c => c.coordinates && c.status === 'approved')
};