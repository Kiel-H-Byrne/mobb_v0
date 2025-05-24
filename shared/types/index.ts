// Shared TypeScript types for MOBB application
// Converted from Meteor SimpleSchema definitions

export interface Location {
  lat: number;
  lng: number;
}

export interface Social {
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface Owner {
  id?: string;
  name?: string;
  phone?: string;
  email?: string;
}

export interface Verifier {
  id?: string;
  name?: string;
  date?: Date;
}

export interface Claim {
  ownerId?: string;
  ownerName?: string;
  ownerPhone?: string;
  ownerEmail?: string;
  ownerProof?: string; // File reference
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  email?: string;
  social?: Social;
  ownedListings?: string[];
  verifiedListings?: string[];
  deverifiedListings?: string[];
  favorites?: string[];
}

export interface User {
  _id?: string;
  username?: string;
  emails?: Array<{
    address: string;
    verified: boolean;
  }>;
  createdAt?: Date;
  profile?: UserProfile;
  services?: Record<string, any>;
}

export interface Listing {
  _id?: string;
  name: string;
  description?: string;
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  address?: string;
  location?: string; // Lat,lng string format
  coordinates?: Location; // Structured lat/lng
  phone?: string;
  url?: string;
  email?: string;
  
  // Business details
  categories?: string[];
  social?: Social;
  image?: string; // File reference
  
  // Ownership and verification
  owner?: Owner;
  claims?: Claim[];
  claimsCount?: number;
  verifiers?: string[];
  verifierCount?: number;
  deverifiers?: string[];
  deverifierCount?: number;
  
  // External IDs
  google_id?: string;
  yelp_id?: string;
  
  // Metadata
  creator?: string;
  submitted?: Date;
  updatedAt?: Date;
}

export interface Category {
  _id?: string;
  name: string;
  count?: number;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Search and filter types
export interface SearchFilters {
  query?: string;
  categories?: string[];
  location?: Location;
  radius?: number; // in meters
  verified?: boolean;
}

export interface ListingSearchResult extends Listing {
  distance?: number; // in meters from search location
  relevanceScore?: number;
}

// Google Places API types
export interface GooglePlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  geometry: {
    location: Location;
  };
  formatted_phone_number?: string;
  website?: string;
  photos?: Array<{
    photo_reference: string;
    width: number;
    height: number;
  }>;
}

// Environment configuration
export interface Config {
  mongodb: {
    uri: string;
    dbName: string;
  };
  google: {
    mapsApiKey: string;
    placesApiKey: string;
  };
  cloudflare: {
    accountId: string;
    apiToken: string;
  };
  auth: {
    jwtSecret: string;
    sessionDuration: number;
  };
}
