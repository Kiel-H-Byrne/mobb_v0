import { Hono } from 'hono';
import { getListingsCollection } from '../lib/database';
import { SearchFiltersSchema, PaginationSchema } from '../lib/validation';
import type { Env } from '../index';
import type { ListingSearchResult, PaginatedResponse } from '../../../shared/types';

export const searchRouter = new Hono<{ Bindings: Env }>();

// GET /api/v1/search - Search listings with filters and location
searchRouter.get('/', async (c) => {
  try {
    const collection = await getListingsCollection(c.env);
    
    // Parse query parameters
    const query = c.req.query();
    const pagination = PaginationSchema.parse({
      page: query.page ? parseInt(query.page) : 1,
      limit: query.limit ? parseInt(query.limit) : 20,
    });
    
    const filters = SearchFiltersSchema.parse({
      query: query.q || query.query,
      categories: query.categories ? query.categories.split(',') : undefined,
      location: query.lat && query.lng ? {
        lat: parseFloat(query.lat),
        lng: parseFloat(query.lng)
      } : undefined,
      radius: query.radius ? parseInt(query.radius) : 10000, // default 10km
      verified: query.verified === 'true' ? true : query.verified === 'false' ? false : undefined,
    });

    // Build MongoDB aggregation pipeline
    const pipeline: any[] = [];
    
    // Match stage
    const matchStage: any = {};
    
    // Text search
    if (filters.query) {
      matchStage.$or = [
        { name: { $regex: filters.query, $options: 'i' } },
        { description: { $regex: filters.query, $options: 'i' } },
        { city: { $regex: filters.query, $options: 'i' } },
        { state: { $regex: filters.query, $options: 'i' } },
        { categories: { $elemMatch: { $regex: filters.query, $options: 'i' } } },
      ];
    }
    
    // Category filter
    if (filters.categories && filters.categories.length > 0) {
      matchStage.categories = { $in: filters.categories };
    }
    
    // Verification filter
    if (filters.verified !== undefined) {
      if (filters.verified) {
        matchStage.verifierCount = { $gt: 0 };
      } else {
        matchStage.$or = [
          { verifierCount: { $exists: false } },
          { verifierCount: 0 }
        ];
      }
    }

    pipeline.push({ $match: matchStage });

    // Location-based search
    if (filters.location) {
      pipeline.push({
        $addFields: {
          distance: {
            $cond: {
              if: { $and: [
                { $ne: ['$coordinates', null] },
                { $ne: ['$coordinates.lat', null] },
                { $ne: ['$coordinates.lng', null] }
              ]},
              then: {
                $multiply: [
                  6371000, // Earth radius in meters
                  {
                    $acos: {
                      $add: [
                        {
                          $multiply: [
                            { $sin: { $degreesToRadians: filters.location.lat } },
                            { $sin: { $degreesToRadians: '$coordinates.lat' } }
                          ]
                        },
                        {
                          $multiply: [
                            { $cos: { $degreesToRadians: filters.location.lat } },
                            { $cos: { $degreesToRadians: '$coordinates.lat' } },
                            { $cos: {
                              $degreesToRadians: {
                                $subtract: ['$coordinates.lng', filters.location.lng]
                              }
                            }}
                          ]
                        }
                      ]
                    }
                  }
                ]
              },
              else: 999999999 // Large number for listings without coordinates
            }
          }
        }
      });

      // Filter by radius
      if (filters.radius) {
        pipeline.push({
          $match: {
            distance: { $lte: filters.radius }
          }
        });
      }

      // Sort by distance
      pipeline.push({ $sort: { distance: 1, name: 1 } });
    } else {
      // Sort by relevance/name if no location
      pipeline.push({ $sort: { submitted: -1, name: 1 } });
    }

    // Add relevance score for text search
    if (filters.query) {
      pipeline.push({
        $addFields: {
          relevanceScore: {
            $add: [
              // Name match gets highest score
              { $cond: [{ $regexMatch: { input: '$name', regex: filters.query, options: 'i' } }, 10, 0] },
              // Category match gets medium score
              { $cond: [{ $in: [{ $toLower: filters.query }, { $map: { input: '$categories', as: 'cat', in: { $toLower: '$$cat' } } }] }, 5, 0] },
              // Description match gets lower score
              { $cond: [{ $regexMatch: { input: '$description', regex: filters.query, options: 'i' } }, 2, 0] },
              // City/state match gets medium score
              { $cond: [{ $regexMatch: { input: '$city', regex: filters.query, options: 'i' } }, 3, 0] },
              { $cond: [{ $regexMatch: { input: '$state', regex: filters.query, options: 'i' } }, 3, 0] },
            ]
          }
        }
      });
    }

    // Get total count
    const countPipeline = [...pipeline, { $count: 'total' }];
    const countResult = await collection.aggregate(countPipeline).toArray();
    const total = countResult[0]?.total || 0;

    // Add pagination
    const skip = (pagination.page - 1) * pagination.limit;
    pipeline.push({ $skip: skip });
    pipeline.push({ $limit: pagination.limit });

    // Execute search
    const results = await collection.aggregate(pipeline).toArray();

    const response: PaginatedResponse<ListingSearchResult> = {
      success: true,
      data: results as ListingSearchResult[],
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages: Math.ceil(total / pagination.limit),
      },
    };

    return c.json(response);
  } catch (error) {
    console.error('Error searching listings:', error);
    return c.json({
      success: false,
      error: 'Search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// GET /api/v1/search/nearby - Find listings near a location
searchRouter.get('/nearby', async (c) => {
  try {
    const query = c.req.query();
    
    if (!query.lat || !query.lng) {
      return c.json({
        success: false,
        error: 'Location coordinates (lat, lng) are required',
      }, 400);
    }

    const lat = parseFloat(query.lat);
    const lng = parseFloat(query.lng);
    const radius = query.radius ? parseInt(query.radius) : 5000; // default 5km
    const limit = query.limit ? parseInt(query.limit) : 10;

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return c.json({
        success: false,
        error: 'Invalid coordinates',
      }, 400);
    }

    const collection = await getListingsCollection(c.env);

    // Use MongoDB's geospatial query
    const results = await collection.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distance',
          maxDistance: radius,
          spherical: true,
          query: {
            coordinates: { $exists: true, $ne: null }
          }
        }
      },
      { $limit: limit },
      { $sort: { distance: 1 } }
    ]).toArray();

    const response: PaginatedResponse<ListingSearchResult> = {
      success: true,
      data: results as ListingSearchResult[],
      pagination: {
        page: 1,
        limit,
        total: results.length,
        totalPages: 1,
      },
    };

    return c.json(response);
  } catch (error) {
    console.error('Error finding nearby listings:', error);
    return c.json({
      success: false,
      error: 'Nearby search failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// GET /api/v1/search/autocomplete - Autocomplete suggestions
searchRouter.get('/autocomplete', async (c) => {
  try {
    const query = c.req.query('q');
    
    if (!query || query.length < 2) {
      return c.json({
        success: true,
        data: [],
      });
    }

    const collection = await getListingsCollection(c.env);
    
    // Get suggestions from business names and categories
    const suggestions = await collection.aggregate([
      {
        $match: {
          $or: [
            { name: { $regex: query, $options: 'i' } },
            { categories: { $elemMatch: { $regex: query, $options: 'i' } } },
            { city: { $regex: query, $options: 'i' } }
          ]
        }
      },
      {
        $project: {
          suggestions: {
            $concatArrays: [
              [{ type: 'business', value: '$name', category: null }],
              {
                $map: {
                  input: {
                    $filter: {
                      input: '$categories',
                      cond: { $regexMatch: { input: '$$this', regex: query, options: 'i' } }
                    }
                  },
                  as: 'cat',
                  in: { type: 'category', value: '$$cat', category: '$$cat' }
                }
              },
              [{ type: 'location', value: '$city', category: null }]
            ]
          }
        }
      },
      { $unwind: '$suggestions' },
      { $replaceRoot: { newRoot: '$suggestions' } },
      { $group: { _id: '$value', type: { $first: '$type' }, category: { $first: '$category' } } },
      { $project: { _id: 0, value: '$_id', type: 1, category: 1 } },
      { $limit: 10 }
    ]).toArray();

    return c.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error('Error getting autocomplete suggestions:', error);
    return c.json({
      success: false,
      error: 'Autocomplete failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});
