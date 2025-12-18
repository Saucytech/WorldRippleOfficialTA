# Local Testing Guide for WorldRipple

## 🚀 Quick Start

The dev server is running at: **http://localhost:5173/**

## Current Status

### ✅ What's Working Without Credentials:
1. **Dev server starts successfully** - No build errors
2. **Authentication screen displays** - But can't actually login without Supabase
3. **All UI components compile** - React/TypeScript/Tailwind working

### ⚠️ What Needs Real Credentials:
1. **Supabase Authentication** - Need real Supabase project
2. **Data.gov APIs** - May have CORS issues
3. **Mapbox** - May need API token for full features

## Testing Without Supabase

To bypass authentication and see the main app, you can temporarily modify the code:

1. Edit `src/App.tsx` line 453:
   ```typescript
   // Change from:
   if (!isAuthenticated) {
   // To:
   if (false) {  // Bypass auth for testing
   ```

2. This will let you see:
   - The main map interface
   - Timeline controls
   - Data layer panels
   - Search functionality
   - Historical events browser

## What You Can Test Right Now

Even without full credentials, you can:

1. **Browse the codebase** - All components are viewable
2. **See the UI design** - Authentication screen is visible
3. **Check responsive design** - Works on different screen sizes
4. **Review historical data** - Built-in events, inventions, people databases

## Quick Wins to Make It More Functional

1. **Get Free Supabase Account** (5 minutes)
   - Go to https://supabase.com
   - Create project
   - Copy credentials to .env file

2. **Add Mapbox Token** (2 minutes)
   - Get free token from https://mapbox.com
   - Add to MapInterface component

3. **Use Mock Data Mode**
   - The app has built-in historical data
   - Works without external APIs

## Browser Console Commands

Open browser DevTools (F12) and try:

```javascript
// Check if app loaded
console.log('App loaded:', !!window.React)

// See Vite config
console.log(import.meta.env)
```

## Next Steps

1. **For Quick Demo**: 
   - Set up Supabase (free tier is fine)
   - Bypass auth temporarily to show features

2. **For Full Functionality**:
   - Set up all environment variables
   - Deploy to Vercel
   - Add production API keys

## Files to Modify for Testing

- `src/App.tsx` - Bypass auth check (line 453)
- `src/lib/supabase.ts` - Mock Supabase client
- `src/components/MapInterface.tsx` - Add Mapbox token or use free tiles

The app is actually well-built and ready to go - it just needs the infrastructure connections!