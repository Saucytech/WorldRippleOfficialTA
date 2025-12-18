# Data.gov Integration Test Queries

This document lists search terms that should return data.gov results to verify the integration is working correctly.

## Recommended Test Searches

### General Catalog Searches (Data.gov Catalog API)
- **"education"** - Returns education-related datasets
- **"census"** - Returns population and demographic data
- **"climate"** - Returns environmental and climate datasets
- **"health"** - Returns healthcare and public health data
- **"employment"** - Returns labor and job statistics
- **"crime"** - Returns public safety datasets
- **"housing"** - Returns housing and real estate data
- **"transportation"** - Returns transit and infrastructure data

### National Park Service (NPS API)
- **"yellowstone"** - Should return Yellowstone National Park
- **"yosemite"** - Should return Yosemite National Park
- **"grand canyon"** - Should return Grand Canyon National Park
- **"park"** - Should return various national parks
- **"monument"** - Should return national monuments

### FDA Enforcement API
- **"recall"** - Returns recent FDA enforcement actions
- **"drug"** - Returns pharmaceutical enforcement data
- **"food"** - Returns food safety enforcement data

### USGS Earthquake API
- **"california"** - Returns recent earthquakes in California
- **"alaska"** - Returns recent earthquakes in Alaska
- **"japan"** - Returns recent earthquakes near Japan
- **"earthquake"** - Returns recent seismic events

## Visual Indicators for Data.gov Results

When you see data.gov results, they will have:

1. **Cyan badge** - A "Data.gov" badge next to the title
2. **Blue-cyan gradient background** - Subtle gradient background
3. **Cyan left border** - A 2px cyan border on the left side
4. **Pulsing icon** - The icon will have a subtle pulse animation
5. **Source prefix** - Description starts with `[Data.gov]`, `[NPS API]`, `[FDA]`, or `[USGS Earthquake API]`

## Testing Process

1. Try the searches listed above
2. Look for the visual indicators
3. Verify results appear in the dropdown
4. Check that clicking results navigates correctly
5. Verify coordinates are displayed on the map (for location-based results)

## Note on Historical Events

Data.gov is **less likely** to have specific historical events like:
- "Pearl Harbor Attack"
- "D-Day"
- "Battle of Gettysburg"

These searches will primarily return results from the local historical database, not data.gov.

Data.gov specializes in:
- Government datasets and statistics
- Current and ongoing data collections
- Geographic and scientific data
- Public records and regulatory information
