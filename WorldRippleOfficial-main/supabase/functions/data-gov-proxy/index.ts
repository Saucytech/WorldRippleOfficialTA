import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const DATA_GOV_API_KEY = '1UpJUbm5eTvTLjjQ57w3yeSwydNJnejf3DDmLEFn';

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const { endpoint, params } = await req.json();
    
    if (!endpoint) {
      return new Response(
        JSON.stringify({ error: 'Endpoint is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    let url: URL;
    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // Route to appropriate API based on endpoint
    if (endpoint.startsWith('nps/')) {
      // National Park Service API - uses developer.nps.gov
      url = new URL(`https://developer.nps.gov/api/v1/${endpoint.replace('nps/v1/', '')}`);
      // NPS requires api_key as query parameter
      if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
          if (key !== 'api_key') {
            url.searchParams.append(key, params[key]);
          }
        });
      }
      url.searchParams.append('api_key', DATA_GOV_API_KEY);
    } else if (endpoint.startsWith('drug/enforcement')) {
      // FDA openFDA API - uses api.fda.gov (no authentication required)
      url = new URL(`https://api.fda.gov/${endpoint}`);
      if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
          url.searchParams.append(key, params[key]);
        });
      }
    } else if (endpoint.startsWith('earthquakes/')) {
      // USGS Earthquake API - uses earthquake.usgs.gov (no authentication required)
      url = new URL(`https://earthquake.usgs.gov/${endpoint}`);
      if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
          url.searchParams.append(key, params[key]);
        });
      }
    } else if (endpoint.startsWith('census/')) {
      // US Census API - uses api.census.gov
      // Extract year from params and build proper Census API URL
      const year = params?.year || '2022';
      const censusPath = endpoint.replace('census/', '');
      url = new URL(`https://api.census.gov/data/${year}/${censusPath}`);

      if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
          if (key !== 'year') {
            url.searchParams.append(key, params[key]);
          }
        });
      }
    } else {
      // Generic data.gov API - uses api.data.gov with X-Api-Key header
      url = new URL(endpoint, 'https://api.data.gov/');
      if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
          url.searchParams.append(key, params[key]);
        });
      }
      headers['X-Api-Key'] = DATA_GOV_API_KEY;
    }

    console.log('[Data.gov Proxy] Fetching:', url.toString());

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    console.log('[Data.gov Proxy] Response status:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Data.gov Proxy] Error:', errorText);
      return new Response(
        JSON.stringify({ 
          error: `Data.gov API error: ${response.status}`,
          details: errorText 
        }),
        {
          status: response.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const data = await response.json();
    console.log('[Data.gov Proxy] Success, returning data');

    return new Response(
      JSON.stringify(data),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('[Data.gov Proxy] Unexpected error:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message 
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});