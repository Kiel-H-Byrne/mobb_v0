import { z } from 'zod';

// Location schema
export const LocationSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

// Social media schema
export const SocialSchema = z.object({
  facebook: z.string().optional(),
  instagram: z.string().optional(),
  twitter: z.string().optional(),
});

// Owner schema
export const OwnerSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
});

// Claim schema
export const ClaimSchema = z.object({
  ownerId: z.string().optional(),
  ownerName: z.string().optional(),
  ownerPhone: z.string().optional(),
  ownerEmail: z.string().email().optional(),
  ownerProof: z.string().optional(),
});

// User profile schema
export const UserProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  social: SocialSchema.optional(),
  ownedListings: z.array(z.string()).optional(),
  verifiedListings: z.array(z.string()).optional(),
  deverifiedListings: z.array(z.string()).optional(),
  favorites: z.array(z.string()).optional(),
});

// User schema
export const UserSchema = z.object({
  _id: z.string().optional(),
  username: z.string().min(3).max(30).optional(),
  emails: z.array(z.object({
    address: z.string().email(),
    verified: z.boolean(),
  })).optional(),
  createdAt: z.date().optional(),
  profile: UserProfileSchema.optional(),
  services: z.record(z.any()).optional(),
});

// Listing schema
export const ListingSchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().length(2).optional(),
  zip: z.string().optional(),
  country: z.string().min(2).max(3).optional(),
  address: z.string().optional(),
  location: z.string().optional(), // "lat,lng" format
  coordinates: LocationSchema.optional(),
  phone: z.string().optional(),
  url: z.string().url().optional(),
  email: z.string().email().optional(),
  categories: z.array(z.string()).optional(),
  social: SocialSchema.optional(),
  image: z.string().optional(),
  owner: OwnerSchema.optional(),
  claims: z.array(ClaimSchema).optional(),
  claimsCount: z.number().min(0).optional(),
  verifiers: z.array(z.string()).optional(),
  verifierCount: z.number().min(0).optional(),
  deverifiers: z.array(z.string()).optional(),
  deverifierCount: z.number().min(0).optional(),
  google_id: z.string().optional(),
  yelp_id: z.string().optional(),
  creator: z.string().optional(),
  submitted: z.date().optional(),
  updatedAt: z.date().optional(),
});

// Category schema
export const CategorySchema = z.object({
  _id: z.string().optional(),
  name: z.string().min(1).max(100),
  count: z.number().min(0).optional(),
});

// Search filters schema
export const SearchFiltersSchema = z.object({
  query: z.string().optional(),
  categories: z.array(z.string()).optional(),
  location: LocationSchema.optional(),
  radius: z.number().min(0).max(50000).optional(), // max 50km
  verified: z.boolean().optional(),
});

// Pagination schema
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20),
});

// Auth schemas
export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const RegisterSchema = z.object({
  username: z.string().min(3).max(30),
  email: z.string().email(),
  password: z.string().min(6),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

// Create listing schema (for POST requests)
export const CreateListingSchema = ListingSchema.omit({
  _id: true,
  creator: true,
  submitted: true,
  updatedAt: true,
  claimsCount: true,
  verifierCount: true,
  deverifierCount: true,
});

// Update listing schema (for PUT/PATCH requests)
export const UpdateListingSchema = CreateListingSchema.partial();

// Export types
export type LocationInput = z.infer<typeof LocationSchema>;
export type SocialInput = z.infer<typeof SocialSchema>;
export type OwnerInput = z.infer<typeof OwnerSchema>;
export type ClaimInput = z.infer<typeof ClaimSchema>;
export type UserProfileInput = z.infer<typeof UserProfileSchema>;
export type UserInput = z.infer<typeof UserSchema>;
export type ListingInput = z.infer<typeof ListingSchema>;
export type CategoryInput = z.infer<typeof CategorySchema>;
export type SearchFiltersInput = z.infer<typeof SearchFiltersSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type RegisterInput = z.infer<typeof RegisterSchema>;
export type CreateListingInput = z.infer<typeof CreateListingSchema>;
export type UpdateListingInput = z.infer<typeof UpdateListingSchema>;
