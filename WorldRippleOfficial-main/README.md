# 🌍 WorldRipple

**A trusted global intelligence platform revealing how events reshape our world**

## Vision

WorldRipple visualizes the ripple effects of historical and real-time events across geography, time, and interconnected systems. We help humanity understand the past, recognize dangerous patterns, and make smarter decisions for the future.

## What is WorldRipple?

WorldRipple is a historic event impact analyzer that transforms fragmented global data into visual, understandable cause-and-effect insights. Through interactive maps, timelines, and layered data visualizations, we show how a single event — a pandemic, war, invention, or natural disaster — creates measurable consequences that ripple across the globe.

## Core Capabilities

### 🗺️ Event-First Global Map
- Auto-zoom to event origins
- Animated ripple effect visualizations
- Multi-layer data overlays
- Real-time and historical data integration

### ⏱️ Interactive Timeline
- Span from ancient history (-5000) to present day
- Time-scrubbing to watch changes unfold
- Event markers with detailed information
- Pattern recognition across time periods

### 📊 Stackable Data Layers
- **Politics**: Wars, treaties, revolutions, leadership changes
- **Health**: Pandemics, mortality rates, medical breakthroughs  
- **Housing**: Urban development, migration patterns, infrastructure
- **Climate**: Natural disasters, temperature changes, extreme weather
- **Economics**: Market crashes, trade flows, industrial growth
- **Innovation**: Inventions, technological advances, scientific discoveries
- **Social Movements**: Cultural shifts, rights movements, demographic changes

### 🤖 AI-Assisted Intelligence
- Pattern detection and historical overlays
- Correlation vs. causation indicators
- Confidence scoring for all insights
- Clear labeling of AI-generated vs. historical facts

### 🔍 Transparency & Trust
- Full source attribution for all data
- Academic-style disclaimers
- Confidence levels: High, Moderate, Emerging, Insufficient Data
- Ethical handling of sensitive events

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (for authentication)
- Mapbox token (optional, for enhanced maps)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/worldripple.git
cd worldripple

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Start development server
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_MAPBOX_TOKEN=your_mapbox_token  # Optional
```

## Architecture

```
WorldRipple/
├── src/
│   ├── components/       # React components
│   │   ├── MapInterface.tsx      # Mapbox visualization
│   │   ├── TimelineControls.tsx  # Time navigation
│   │   ├── CombinedPanel.tsx     # Data layers & insights
│   │   └── ...
│   ├── services/         # API integrations
│   │   ├── earthquakeApi.ts      # USGS earthquake data
│   │   ├── openMeteoApi.ts       # Weather/climate data
│   │   ├── restCountriesApi.ts   # Country information
│   │   └── ...
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utilities & helpers
│   └── types/           # TypeScript definitions
```

## Features in Development

### Near-Term (Holiday 2024 Demo)
- [ ] Animated ripple effects for event impacts
- [ ] Real-time earthquake data integration (USGS)
- [ ] Weather pattern overlays (OpenMeteo)
- [ ] Time-lapse playback mode
- [ ] Share/screenshot capabilities
- [ ] Pattern matching visualizations

### Long-Term Vision
- [ ] Side-by-side event comparison
- [ ] User-defined custom events
- [ ] Collaborative annotations
- [ ] Predictive pattern recognition
- [ ] Educational curriculum integration
- [ ] Government/institutional dashboards

## Data Sources

### Currently Integrated
- Historical events database (built-in)
- Inventions & innovations timeline
- MapBox for geographic visualization
- Data.gov APIs (various endpoints)

### Coming Soon
- USGS Earthquake real-time feed
- OpenMeteo weather & climate data
- REST Countries API
- Wikipedia historical context
- OpenStreetMap/Nominatim geocoding

## Philosophy

### What WorldRipple Is
✅ A pattern recognition tool  
✅ A historical impact analyzer  
✅ An educational platform  
✅ A transparency-first data visualizer  

### What WorldRipple Is NOT
❌ A future prediction engine  
❌ A conspiracy theory platform  
❌ A fear-mongering tool  
❌ An unverified data aggregator  

## Contributing

We welcome contributions that align with our North Star principle: **If a feature does not improve understanding of how events ripple through interconnected systems, it does not belong in WorldRipple.**

### Development Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes
npm run dev  # Test locally

# Run tests and linting
npm run lint
npm run test

# Commit with descriptive message
git commit -m "Add: Brief description of change"

# Push and create PR
git push origin feature/your-feature-name
```

## Deployment

WorldRipple is designed for deployment on Vercel:

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to Vercel
vercel deploy
```

## License

Copyright © 2024 WorldRipple. All rights reserved.

## Acknowledgments

Created by Tobie Vibe with the vision of bringing clarity to a complex world. 

Special thanks to all contributors helping to make global events understandable through the power of visualization.

## Contact

- **Project Vision**: Tobie Vibe
- **Development**: [Your GitHub]
- **Website**: [Coming Soon]
- **Demo**: [Coming Soon]

---

*"Understanding the past to navigate the future"* — WorldRipple