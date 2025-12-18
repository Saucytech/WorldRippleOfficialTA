# 🔧 Troubleshooting the Flashing Issue

## Current Status
The app is experiencing flashing/spazzing on load due to:
1. Map layers trying to add before map style is ready
2. Multiple re-renders from state updates
3. Earthquake data fetching triggering updates

## Temporary Solution
To stop the flashing immediately:

### Option 1: Disable Features Temporarily
1. All data layers now start as `isActive: false`
2. Earthquake fetching only happens once
3. API Test Panel starts closed

### Option 2: Manual Layer Activation
Instead of starting with layers active, manually activate them after the map loads:
- Click on the data layers in the right panel to activate them
- This prevents the initial flash

## How to Test Properly

1. **Fresh Load Test**:
   - Clear browser cache (Ctrl+Shift+R or Cmd+Shift+R)
   - Load the page
   - Wait 2-3 seconds for map to stabilize
   - Then activate data layers

2. **Check Console**:
   - Ignore browser extension errors (they're not from our app)
   - Look for "Style is not done loading" - this is the main issue
   - If you see this error, the map needs more time to load

3. **Performance Mode**:
   - Start with NO layers active
   - Add one layer at a time
   - This identifies which layer causes issues

## Permanent Fix Needed

The real solution requires:
1. Proper map initialization sequence
2. Debounced state updates
3. Better layer management
4. Potentially switching from Mapbox to a simpler map library

## If Still Flashing

Try these steps in order:
1. Refresh the page
2. Wait 5 seconds before interacting
3. Open DevTools > Network tab > Disable cache
4. Use Chrome Incognito mode (disables extensions)
5. Try Firefox or Safari

## Config to Reduce Issues

In your local environment, you can:
1. Comment out the earthquake fetching
2. Disable all data layers by default
3. Remove the ripple animations temporarily

The app will be less impressive but more stable.