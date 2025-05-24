import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import { getListingsCollection } from '../lib/database';
import { 
  CreateListingSchema, 
  UpdateListingSchema, 
  PaginationSchema,
  SearchFiltersSchema 
} from '../lib/validation';
import type { Env } from '../index';
import type { Listing, ApiResponse, PaginatedResponse } from '../../../shared/types';

export const listingsRouter = new Hono<{ Bindings: Env }>();

// GET /api/v1/listings - Get all listings with pagination and filters
listingsRouter.get('/', async (c) => {
  try {
    const collection = await getListingsCollection(c.env);
    
    // Parse query parameters
    const query = c.req.query();
    const pagination = PaginationSchema.parse({
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
    });
    
    const filters = SearchFiltersSchema.parse({
      categories: query.categories ? query.categories.split(',') : undefined,
      verified: query.verified === 'true' ? true : query.verified === 'false' ? false : undefined,
    });

    // Build MongoDB query
    const mongoQuery: any = {};
    
    if (filters.categories && filters.categories.length > 0) {
      mongoQuery.categories = { $in: filters.categories };
    }
    
    if (filters.verified !== undefined) {
      if (filters.verified) {
        mongoQuery.verifierCount = { $gt: 0 };
      } else {
        mongoQuery.$or = [
          { verifierCount: { $exists: false } },
          { verifierCount: 0 }
        ];
      }
    }

    // Get total count
    const total = await collection.countDocuments(mongoQuery);
    
    // Get paginated results
    const skip = (pagination.page - 1) * pagination.limit;
    const listings = await collection
      .find(mongoQuery)
      .sort({ submitted: -1, name: 1 })
      .skip(skip)
      .limit(pagination.limit)
      .toArray();

    const response: PaginatedResponse<Listing> = {
      success: true,
      data: listings,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch listings',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// GET /api/v1/listings/:id - Get single listing
listingsRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    if (!ObjectId.isValid(id)) {
      return c.json({
        success: false,
        error: 'Invalid listing ID',
      }, 400);
    }

    const collection = await getListingsCollection(c.env);
    const listing = await collection.findOne({ _id: new ObjectId(id) });

    if (!listing) {
      return c.json({
        success: false,
        error: 'Listing not found',
      }, 404);
    }

    const response: ApiResponse<Listing> = {
      success: true,
      data: listing,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching listing:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch listing',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// POST /api/v1/listings - Create new listing
listingsRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = CreateListingSchema.parse(body);

    const collection = await getListingsCollection(c.env);
    
    // Add metadata
    const now = new Date();
    const listingData: Partial<Listing> = {
      ...validatedData,
      submitted: now,
      updatedAt: now,
      claimsCount: 0,
      verifierCount: 0,
      deverifierCount: 0,
    };

    // Convert location string to coordinates if provided
    if (listingData.location && !listingData.coordinates) {
      const [lat, lng] = listingData.location.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        listingData.coordinates = { lat, lng };
      }
    }

    const result = await collection.insertOne(listingData as Listing);
    const createdListing = await collection.findOne({ _id: result.insertedId });

    const response: ApiResponse<Listing> = {
      success: true,
      data: createdListing!,
      message: 'Listing created successfully',
    };

    return c.json(response, 201);
  } catch (error) {
    console.error('Error creating listing:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Validation error',
        message: error.message,
      }, 400);
    }

    return c.json({
      success: false,
      error: 'Failed to create listing',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// PUT /api/v1/listings/:id - Update listing
listingsRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    if (!ObjectId.isValid(id)) {
      return c.json({
        success: false,
        error: 'Invalid listing ID',
      }, 400);
    }

    const body = await c.req.json();
    const validatedData = UpdateListingSchema.parse(body);

    const collection = await getListingsCollection(c.env);
    
    // Add update timestamp
    const updateData = {
      ...validatedData,
      updatedAt: new Date(),
    };

    // Convert location string to coordinates if provided
    if (updateData.location && !updateData.coordinates) {
      const [lat, lng] = updateData.location.split(',').map(Number);
      if (!isNaN(lat) && !isNaN(lng)) {
        updateData.coordinates = { lat, lng };
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return c.json({
        success: false,
        error: 'Listing not found',
      }, 404);
    }

    const updatedListing = await collection.findOne({ _id: new ObjectId(id) });

    const response: ApiResponse<Listing> = {
      success: true,
      data: updatedListing!,
      message: 'Listing updated successfully',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error updating listing:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Validation error',
        message: error.message,
      }, 400);
    }

    return c.json({
      success: false,
      error: 'Failed to update listing',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// DELETE /api/v1/listings/:id - Delete listing
listingsRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    if (!ObjectId.isValid(id)) {
      return c.json({
        success: false,
        error: 'Invalid listing ID',
      }, 400);
    }

    const collection = await getListingsCollection(c.env);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return c.json({
        success: false,
        error: 'Listing not found',
      }, 404);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Listing deleted successfully',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error deleting listing:', error);
    return c.json({
      success: false,
      error: 'Failed to delete listing',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});
