# WorldRipple Data Layers Structure

## Overview
The WorldRipple platform organizes historical and contemporary data into 7 main categories, each with extensive subcategories for granular analysis. Each layer can be toggled on/off and has adjustable intensity for visualization on the world map.

---

## 1. 🟣 **Politics**
*Political trends and electoral changes*

### Subcategories (13):
- Wars & Battles
- Treaties & Peace Accords
- Assassinations & Coups
- Political Alliances / Unions
- Revolutions / Uprisings
- Leaders & Monarchs
- Political Ideologies
- Colonization / Independence Movements
- Government Spending / Debt
- Military Expenditure
- Corruption Perception
- Political Prisoners / State Oppression
- Law Enforcement Reform Events

---

## 2. 🔴 **Health** 
*Tracking infectious disease patterns and outbreaks across regions*

### Subcategories (20):
- Mortality Rate
- Cause-of-Death Breakdown
- Epidemics & Pandemics
- Infant Mortality Rate
- Vaccination Rates
- Infectious Disease Incidence
- Non-communicable Disease Rates
- Mental Health Indicators
- Life Expectancy at Birth
- Hospital Bed Capacity
- Access to Clean Water
- Sanitation Infrastructure
- Malnutrition / Hunger Statistics
- Air Quality & Respiratory Illness
- Health Expenditure per Capita
- Health Workforce
- Medical Innovation Timeline
- Health Policy Changes
- Disability-Adjusted Life Years (DALYs)
- Regional Disease Hotspots

---

## 3. 🟡 **Housing**
*Housing affordability and availability trends*

### Subcategories (9):
- Housing Market Index
- Urban vs Rural Distribution
- Population Density Maps
- Household Size
- Regional Growth Trends
- Public Infrastructure Investment
- Major Infrastructure Projects
- Land Reclamation Projects
- Migration & Immigration Flows

---

## 4. 🟢 **Climate**
*Environmental changes and climate-related events*

### Subcategories (27):
- Temperature Anomalies
- Precipitation Levels
- Drought Index
- Extreme Weather Events
- Tornado / Hurricane Tracks
- Flood Occurrences
- Snowfall / Ice Coverage
- Ocean Temperatures (ENSO events)
- Heatwaves / Cold Spells
- Climate Classifications
- Greenhouse Gas Concentrations
- Air Pressure / Wind Patterns
- Atmospheric CO₂ by Year
- Deforestation-Climate Feedback
- Wildfire Incidents
- Agricultural Impact
- Sea Level Rise
- Global Climate Shift Indicators
- Drought Zones
- Flood Plains
- Earthquake History
- Volcano Activity
- Forest Coverage
- Air Quality by Region
- Soil Quality Index
- Wetlands & Protected Areas
- Glacial Retreat or Growth

---

## 5. 🟠 **Economics**
*Economic indicators and market changes*

### Subcategories (19):
- GDP (Nominal & Real)
- Inflation (CPI, PPI)
- Unemployment Rate
- Industrial Production
- Wages & Income Inequality
- Trade Balance
- Interest Rates
- Stock Market Indices
- Exchange Rates
- Gold & Commodity Prices
- Banking & Credit Supply
- Energy Prices
- Currency Crises or Defaults
- Hyperinflation Episodes
- Consumer Sentiment Index
- Business Confidence Index
- Poverty Rates
- Employment by Sector
- Wage Levels by Occupation

---

## 6. 🔷 **Innovation and Industry**
*Technological innovation, industrial development, and manufacturing trends*

### Subcategories (20):
- Mechanical Patents
- Electrical Engineering Patents
- Chemical / Pharmaceutical Patents
- Aviation Technology
- Communications & Radio Inventions
- Automotive Innovations
- Textile Manufacturing
- Weapons & Defense Technology
- Shipbuilding / Naval Design
- Civil Engineering Patents
- Mining & Metallurgy
- Energy Innovations
- Agricultural Machinery
- Medical Devices
- Early Computer / Automation Systems
- Synthetic Materials
- Mass Production Techniques
- Industrial Accidents or Safety Innovations
- Patent Ownership by Country
- Wartime R&D Output

---

## 7. 🩷 **Social Movements**
*Social change movements and demographic shifts*

### Subcategories (14):
- Cultural Movements
- Scientific Milestones
- Social Reforms / Rights Movements
- Inventions & Discoveries
- Industrialization Milestones
- Migration Patterns
- Natural Disasters & Humanitarian Crises
- Environmental Changes
- Civil Unrest / Protests
- Organized Crime Presence
- Terrorism Incidents
- Drug Trafficking Routes
- Human Trafficking / Kidnapping
- Crime & Justice Trends

---

## Statistics

| Category | Subcategories | Color | Default State |
|----------|--------------|-------|---------------|
| Politics | 13 | Purple (#8B5CF6) | Inactive |
| Health | 20 | Red (#EF4444) | **Active** |
| Housing | 9 | Yellow (#EAB308) | **Active** |
| Climate | 27 | Green (#10B981) | Inactive |
| Economics | 19 | Orange (#F59E0B) | Inactive |
| Innovation | 20 | Cyan (#06B6D4) | Inactive |
| Social | 14 | Pink (#EC4899) | Inactive |

**Total: 7 Main Categories, 122 Subcategories**

## Implementation Notes

- Each layer has an **intensity slider** (0-1) to control visualization strength
- Layers can be **expanded/collapsed** to show subcategories
- Individual subcategories can be toggled independently
- By default, only **Health** and **Housing** layers are active
- The system is designed to overlay multiple data sources on the Mapbox world map
- Historical data spans from 5000 BC to 2024 AD

## Potential Data Sources

Based on the subcategories, potential APIs and data sources could include:
- **WHO** (World Health Organization) - Health data
- **World Bank** - Economic indicators
- **NOAA** - Climate and weather data
- **UN Data** - Population and migration statistics
- **USPTO** - Patent data
- **FRED** (Federal Reserve) - Economic data
- **NASA** - Environmental and climate data
- **USGS** - Earthquake and geological data
- **Various National Statistics Offices** - Housing and demographic data

This comprehensive categorization system allows users to explore complex historical patterns and relationships between different types of global events and trends.