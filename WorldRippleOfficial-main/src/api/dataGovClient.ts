const EDGE_FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/data-gov-proxy`;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

async function fetchFromDataGov(endpoint: string, params: Record<string, any> = {}) {
  console.log('[DataGov Client] Calling edge function for endpoint:', endpoint);

  // Check if Supabase environment variables are configured
  if (!EDGE_FUNCTION_URL || EDGE_FUNCTION_URL.includes('placeholder') || !SUPABASE_ANON_KEY) {
    console.log('[DataGov Client] Supabase not configured - returning empty data');
    return [];
  }

  try {
    const response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        endpoint,
        params
      })
    });

    console.log('[DataGov Client] Edge function response status:', response.status);

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      console.error('[DataGov Client] Edge function error:', err);
      throw new Error(`Edge function error: ${response.status} ${JSON.stringify(err)}`);
    }

    const data = await response.json();
    console.log('[DataGov Client] Got data from edge function');
    return data;
  } catch (error) {
    console.error('[DataGov Client] Failed to fetch from edge function:', error);
    // Return empty data instead of throwing to prevent app crashes
    return [];
  }
}

export default fetchFromDataGov;
