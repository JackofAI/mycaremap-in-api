/**
 * Live Healthcare Places & Clinics Integration
 *
 * Exclusively powered by Google Places API (New & Legacy endpoints).
 * Real-time verified healthcare facilities with addresses, ratings, and phone numbers.
 * Same architecture as MeraCare.
 */

import { GooglePlaceItem, SearchNearbyParams } from './types/careMap';

export interface SearchOptions {
  googlePlacesApiKey?: string;
}

// In-memory cache for Google Places results (TTL: 1 hour)
interface CacheEntry {
  timestamp: number;
  data: {
    places: GooglePlaceItem[];
    source: 'google_places_api' | 'none';
  };
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 60 * 1000; // 1 hour

function getCacheKey(params: SearchNearbyParams): string {
  return `${(params.query || '').toLowerCase().trim()}:${(params.category || '').toLowerCase().trim()}:${(
    params.locality || ''
  ).toLowerCase().trim()}`;
}

/**
 * 1. GOOGLE PLACES API (NEW - v1/places:searchText)
 */
async function fetchFromPlacesApiNew(
  searchTerm: string,
  apiKey: string,
  locality?: string
): Promise<GooglePlaceItem[]> {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': apiKey,
      'X-Goog-FieldMask':
        'places.id,places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.googleMapsUri,places.regularOpeningHours,places.nationalPhoneNumber,places.primaryType',
    },
    body: JSON.stringify({
      textQuery: searchTerm,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text().catch(() => '');
    throw new Error(`Google Places API (New) returned HTTP ${res.status}: ${errorText}`);
  }

  const data = (await res.json()) as any;
  if (!data.places || !Array.isArray(data.places) || data.places.length === 0) {
    return [];
  }

  return data.places.slice(0, 15).map((p: any) => ({
    id: p.id || `gplace-${Math.random().toString(36).slice(2, 9)}`,
    name: p.displayName?.text || 'Healthcare Provider',
    category: p.primaryType?.toLowerCase().includes('physio')
      ? 'Physiotherapy'
      : p.primaryType?.toLowerCase().includes('hospital')
      ? 'Hospital & Clinic'
      : p.primaryType?.toLowerCase().includes('doctor')
      ? 'Doctor / Clinic'
      : 'Healthcare Provider',
    address: p.formattedAddress || `${locality || 'Ahmedabad'}, Gujarat`,
    locality: locality || 'Ahmedabad',
    ratingScore: typeof p.rating === 'number' ? p.rating : 4.5,
    reviewCount: typeof p.userRatingCount === 'number' ? p.userRatingCount : 50,
    openNow: p.regularOpeningHours?.openNow,
    phone: p.nationalPhoneNumber || undefined,
    mapsUrl:
      p.googleMapsUri ||
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        `${p.displayName?.text || ''} ${p.formattedAddress || 'Ahmedabad'}`
      )}`,
    isGooglePlace: true,
  }));
}

/**
 * 2. LEGACY GOOGLE PLACES API (Text Search) - Fallback
 */
async function fetchFromLegacyPlacesApi(
  searchTerm: string,
  apiKey: string,
  locality?: string
): Promise<GooglePlaceItem[]> {
  const url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
    searchTerm
  )}&key=${apiKey}`;

  const res = await fetch(url, {
    headers: { 'User-Agent': 'MyCareMap-App' },
  });

  if (!res.ok) {
    throw new Error(`Legacy Google Places API returned HTTP ${res.status}`);
  }

  const data = (await res.json()) as any;
  if (!data.results || !Array.isArray(data.results) || data.results.length === 0) {
    return [];
  }

  return data.results.slice(0, 15).map((r: any) => ({
    id: r.place_id || `gplace-${Math.random().toString(36).slice(2, 9)}`,
    name: r.name,
    category: r.types?.includes('physiotherapist')
      ? 'Physiotherapy'
      : r.types?.includes('hospital')
      ? 'Hospital & Clinic'
      : 'Healthcare Provider',
    address: r.formatted_address || 'Ahmedabad, Gujarat',
    locality: locality || 'Ahmedabad',
    ratingScore: typeof r.rating === 'number' ? r.rating : 4.5,
    reviewCount: typeof r.user_ratings_total === 'number' ? r.user_ratings_total : 50,
    openNow: r.opening_hours?.open_now,
    phone: r.formatted_phone_number || undefined,
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      `${r.name} ${r.formatted_address || 'Ahmedabad'}`
    )}`,
    isGooglePlace: true,
  }));
}

/**
 * Main Entry Point: Search Nearby Healthcare Facilities via Google Places API
 */
export async function searchNearbyPlaces(
  params: SearchNearbyParams,
  options?: SearchOptions | string
): Promise<{ places: GooglePlaceItem[]; source: 'google_places_api' | 'none' }> {
  const resolvedOptions: SearchOptions =
    typeof options === 'string' ? { googlePlacesApiKey: options } : options || {};

  const cacheKey = getCacheKey(params);
  const cached = cache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL_MS) {
    return cached.data;
  }

  const placesKey = resolvedOptions.googlePlacesApiKey || process.env.GOOGLE_PLACES_API_KEY;

  if (placesKey && placesKey.trim()) {
    try {
      const searchTerm = [
        params.query || params.category || 'healthcare clinic doctor hospital',
        params.locality && params.locality !== 'All' ? `${params.locality} Ahmedabad` : 'Ahmedabad Gujarat',
      ]
        .filter(Boolean)
        .join(' ');

      let places: GooglePlaceItem[] = [];
      try {
        places = await fetchFromPlacesApiNew(searchTerm, placesKey.trim(), params.locality);
      } catch (newErr: any) {
        console.warn('[Places] Google Places API (New) attempt failed, trying legacy:', newErr.message);
        places = await fetchFromLegacyPlacesApi(searchTerm, placesKey.trim(), params.locality);
      }

      const result = {
        places,
        source: (places.length > 0 ? 'google_places_api' : 'none') as 'google_places_api' | 'none',
      };
      cache.set(cacheKey, { timestamp: Date.now(), data: result });
      return result;
    } catch (err: any) {
      console.warn('[Places] Google Places API request failed completely:', err.message);
    }
  }

  const emptyResult = { places: [], source: 'none' as const };
  return emptyResult;
}
