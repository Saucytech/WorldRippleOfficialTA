# WorldRipple — Development Brain for Claude

## 🌍 North Star Vision

**WorldRipple is a trusted global intelligence platform that reveals how events reshape the world by visualizing their ripple effects across geography, time, and interconnected systems.**

### Core Purpose
WorldRipple exists to bring clarity to a noisy world by showing how historical and real-time events influence health, economies, climate, technology, conflict, and human behavior. It transforms disconnected data into understandable, visual cause-and-effect insights.

### What WorldRipple Is
A **historic event impact analyzer** that uses interactive maps, timelines, and layered data to show how a single event creates measurable consequences across the globe.

## 🎯 Development Philosophy

**North Star Principle**: If a feature does not improve understanding of how events ripple through interconnected systems, it does not belong in WorldRipple.

### Core Values
1. **Clarity Over Complexity** - Make complex patterns understandable
2. **Trust Through Transparency** - Every data point has a source
3. **Impact-First Design** - Show the human story behind the data
4. **Pattern Recognition, Not Prediction** - We reveal historical patterns, not fortune-telling

## 🏗️ Current Implementation Status

### ✅ Working Core Features
1. **Interactive Global Map** (Mapbox GL JS)
   - Event-first visualization with auto-zoom to origin
   - Multiple data layer overlays
   - Real-time rendering of data changes

2. **Timeline Controls** 
   - Historical range: -5000 to 2024
   - Time-scrubbing to watch changes unfold
   - Event markers with focus capability

3. **Data Layer System**
   - 7 main categories with 100+ subcategories
   - Toggle and intensity controls
   - Politics, Health, Housing, Climate, Economics, Innovation, Social Movements

4. **Search & Discovery**
   - Search across events, people, inventions, locations
   - "Surprise Me" random discovery feature
   - Historical database integration

5. **Authentication** (Supabase - temporarily bypassed for testing)

### 🚧 In Progress / Needs Work

1. **Ripple Visualization Engine**
   - Need animated ripple effects from event origins
   - Implement node/connection visualizations
   - Add directional flow arrows for causality

2. **AI-Assisted Intelligence**
   - Correlation detection system
   - Pattern overlay identification
   - Confidence scoring implementation
   - Clear AI vs. historical fact labeling

3. **Data Integration**
   - Multiple APIs integrated but need CORS fixes
   - Need to implement data transformation layer
   - Caching strategy for performance

4. **Side-by-Side Comparison**
   - UI for comparing multiple events
   - Synchronized timeline controls

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **Map**: Mapbox GL JS
- **Auth/Database**: Supabase
- **APIs**: Multiple data sources (see API Integration section)
- **Deployment**: Vercel

## 🔌 API Integration Strategy

### Currently Integrated (Need Testing/Fixes)
- Data.gov APIs (multiple endpoints)
- Mapbox for visualization
- Supabase for auth/data

### Quick Win APIs to Add
1. **OpenMeteo API** - Weather & climate data (FREE, no key needed)
2. **REST Countries API** - Country data & flags (FREE, no key)
3. **Nominatim/OpenStreetMap** - Geocoding (FREE, no key)
4. **USGS Earthquake API** - Real-time earthquake data (FREE)
5. **Wikipedia API** - Historical context (FREE)

### Future Premium APIs
- News aggregation for current events
- Financial market data
- Satellite imagery

## 🎨 UI/UX Priorities

### Immediate Visual Improvements (Quick Wins)
1. **Ripple Animation System**
   - CSS/Canvas animations for event impacts
   - Particle effects for data flow
   - Smooth transitions between years

2. **Loading States**
   - Skeleton loaders for data fetching
   - Progress indicators for timeline scrubbing
   - Smooth transitions

3. **Event Cards**
   - Rich media previews
   - Source attribution badges
   - Confidence level indicators

4. **Color Psychology**
   - Current palette is good but needs refinement
   - Add subtle gradients for depth
   - Implement dark/light theme toggle

## 📊 Data Architecture

### Event Structure
```typescript
interface WorldRippleEvent {
  id: string;
  type: 'pandemic' | 'war' | 'disaster' | 'invention' | 'economic' | 'climate' | 'person';
  origin: {
    location: [longitude, latitude];
    timestamp: Date;
    certainty: 'confirmed' | 'approximate' | 'disputed';
  };
  impact: {
    geographic: GeoImpact[];
    temporal: TimeImpact[];
    systems: SystemImpact[];
  };
  sources: Source[];
  confidence: 'high' | 'moderate' | 'emerging' | 'insufficient';
}
```

### Correlation vs Causation Framework
- **Correlation**: Statistical relationship identified
- **Likely Cause**: AI-assisted with confidence score
- **Confirmed Cause**: Source-verified causal link

## 🚀 Quick Wins for Tobie (Implement These First!)

### Week 1: Visual Impact
1. **Ripple Animation** 
   - Simple CSS animation from event origin
   - Fade-out effect over distance
   - Different colors for different event types

2. **Live Data Integration**
   - Connect USGS Earthquake API for real-time events
   - Add OpenMeteo for current weather patterns
   - Show "Live" badge for recent events

3. **Enhanced Search Results**
   - Rich preview cards with images
   - Quick stats (death toll, economic impact, etc.)
   - "Explore Impact" button

### Week 2: Intelligence Features
1. **Pattern Overlay**
   - Simple pattern matching (e.g., "Similar to 1918 Flu")
   - Visual overlay showing pattern similarities
   - Confidence badges

2. **Impact Metrics**
   - Death toll counter
   - Economic impact calculator
   - Population affected radius

3. **Time-Lapse Mode**
   - Auto-play through time periods
   - Adjustable playback speed
   - Pause at major events

### Week 3: Social Features
1. **Share Current View**
   - Generate shareable link with current settings
   - Social media integration
   - Screenshot capability

2. **User Annotations**
   - Allow users to add notes to events
   - Flag disputed information
   - Suggest corrections

## 🎯 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Preview production build
npm run preview
```

## 🔐 Environment Variables

```env
# Required
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Optional (for enhanced features)
VITE_MAPBOX_TOKEN=your_mapbox_token
VITE_OPENAI_API_KEY=your_openai_key  # For AI insights
```

## ⚠️ Critical Path to Demo

1. **Fix CORS issues** - Implement proxy or use CORS-friendly APIs
2. **Add 2-3 working data sources** - Start with free, no-auth APIs
3. **Implement basic ripple animation** - Even simple is impressive
4. **Add one "wow" feature** - Time-lapse or pattern overlay
5. **Polish loading states** - No blank screens
6. **Create demo scenarios** - Pre-selected impressive examples

## 📝 Implementation Notes

### For Kaydin (Development Lead)
- Focus on visual impact first - Tobie wants to "wow" people
- Prioritize working features over comprehensive coverage
- Use mock data where real APIs aren't ready
- Keep the UI responsive and smooth

### For Tobie (Visionary & Client)
- Current foundation is solid but needs polish
- Many ambitious features are scaffolded but not connected
- Quick wins identified above will create impressive demos
- Focus on storytelling through data visualization

## 🎄 Holiday Demo Checklist

- [ ] At least 3 working data sources with real data
- [ ] Smooth ripple animations for events
- [ ] Time-lapse feature for dramatic effect  
- [ ] 5-10 pre-selected "wow" scenarios
- [ ] Share/screenshot capability
- [ ] Polished loading states
- [ ] Mobile-responsive (tablet at minimum)
- [ ] About/intro modal explaining the vision

## 🚨 Known Issues & Fixes

1. **CORS Errors**: Need proxy server or CORS-friendly alternatives
2. **Auth Bypass**: Currently bypassed for testing, needs reconnection
3. **Performance**: May lag with all layers active - needs optimization
4. **Mobile**: Desktop-first, needs responsive improvements
5. **Data Accuracy**: Using simplified boundaries - needs refinement

## 🌟 Remember the Vision

WorldRipple aims to become:
- A household name for understanding global change
- A tool used in schools worldwide
- A trusted platform for governments and institutions
- A system that helps prevent disasters and inform policy

Every line of code should serve this vision.