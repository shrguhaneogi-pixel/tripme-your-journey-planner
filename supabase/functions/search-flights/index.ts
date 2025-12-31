import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface FlightSearchRequest {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  adults: number;
  children: number;
}

// Cache for Amadeus access token
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAmadeusToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const apiKey = Deno.env.get('AMADEUS_API_KEY');
  const apiSecret = Deno.env.get('AMADEUS_API_SECRET');

  if (!apiKey || !apiSecret) {
    throw new Error('Amadeus API credentials not configured');
  }

  console.log('Fetching new Amadeus access token...');

  const response = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: apiKey,
      client_secret: apiSecret,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Failed to get Amadeus token:', errorText);
    throw new Error('Failed to authenticate with Amadeus API');
  }

  const data = await response.json();
  
  // Cache the token (expires_in is in seconds, subtract 60 seconds for safety)
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };

  console.log('Successfully obtained Amadeus token');
  return cachedToken.token;
}

async function searchFlights(params: FlightSearchRequest, token: string) {
  const searchParams = new URLSearchParams({
    originLocationCode: params.origin,
    destinationLocationCode: params.destination,
    departureDate: params.departureDate,
    adults: params.adults.toString(),
    children: params.children.toString(),
    currencyCode: 'USD',
    max: '10',
  });

  if (params.returnDate) {
    searchParams.append('returnDate', params.returnDate);
  }

  console.log('Searching flights with params:', searchParams.toString());

  const response = await fetch(
    `https://test.api.amadeus.com/v2/shopping/flight-offers?${searchParams}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Flight search failed:', response.status, errorText);
    throw new Error(`Flight search failed: ${response.status}`);
  }

  return response.json();
}

function formatDuration(duration: string): string {
  // Convert ISO 8601 duration (e.g., PT2H30M) to readable format
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?/);
  if (!match) return duration;
  
  const hours = match[1] ? `${match[1]}h` : '';
  const minutes = match[2] ? ` ${match[2]}m` : '';
  return `${hours}${minutes}`.trim();
}

function transformFlightOffers(data: any) {
  if (!data.data || !Array.isArray(data.data)) {
    return [];
  }

  const dictionaries = data.dictionaries || {};
  const carriers = dictionaries.carriers || {};

  return data.data.map((offer: any, index: number) => {
    const firstSegment = offer.itineraries[0]?.segments[0];
    const lastSegment = offer.itineraries[0]?.segments[offer.itineraries[0].segments.length - 1];
    const carrierCode = firstSegment?.carrierCode || 'Unknown';
    const carrierName = carriers[carrierCode] || carrierCode;

    return {
      id: `flight-${offer.id || index}`,
      mode: 'air' as const,
      type: 'flight' as const,
      provider: carrierName,
      departureTime: firstSegment?.departure?.at?.slice(11, 16) || '',
      arrivalTime: lastSegment?.arrival?.at?.slice(11, 16) || '',
      duration: formatDuration(offer.itineraries[0]?.duration || ''),
      price: parseFloat(offer.price?.total || '0'),
      origin: firstSegment?.departure?.iataCode || '',
      destination: lastSegment?.arrival?.iataCode || '',
      amenities: ['WiFi Available'],
      class: offer.travelerPricings?.[0]?.fareDetailsBySegment?.[0]?.cabin || 'Economy',
      stops: offer.itineraries[0]?.segments?.length - 1 || 0,
      flightNumber: `${carrierCode}${firstSegment?.number || ''}`,
    };
  });
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: FlightSearchRequest = await req.json();
    
    console.log('Received search request:', JSON.stringify(body));

    // Validate required fields
    if (!body.origin || !body.destination || !body.departureDate) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: origin, destination, departureDate' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Amadeus token
    const token = await getAmadeusToken();

    // Search for flights
    const flightData = await searchFlights(body, token);

    // Transform the response to our format
    const flights = transformFlightOffers(flightData);

    console.log(`Found ${flights.length} flight offers`);

    return new Response(
      JSON.stringify({ flights, meta: { total: flights.length } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in search-flights function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
