import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import { verify } from 'hono/jwt';
import { getUsersCollection, getListingsCollection } from '../lib/database';
import { UserProfileSchema } from '../lib/validation';
import type { Env } from '../index';
import type { User, ApiResponse } from '../../../shared/types';

export const usersRouter = new Hono<{ Bindings: Env }>();

// Middleware to verify JWT token
const authMiddleware = async (c: any, next: any) => {
  const authHeader = c.req.header('Authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return c.json({
      success: false,
      error: 'Unauthorized',
      message: 'No valid token provided',
    }, 401);
  }

  const token = authHeader.substring(7);
  
  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set('user', payload);
    await next();
  } catch (error) {
    return c.json({
      success: false,
      error: 'Invalid token',
      message: 'Token is expired or invalid',
    }, 401);
  }
};

// GET /api/v1/users/profile - Get user profile
usersRouter.get('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const collection = await getUsersCollection(c.env);
    
    const userData = await collection.findOne(
      { _id: new ObjectId(user.userId) },
      { projection: { 'services.password': 0 } }
    );

    if (!userData) {
      return c.json({
        success: false,
        error: 'User not found',
      }, 404);
    }

    const response: ApiResponse<User> = {
      success: true,
      data: userData,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// PUT /api/v1/users/profile - Update user profile
usersRouter.put('/profile', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const body = await c.req.json();
    const validatedData = UserProfileSchema.parse(body);

    const collection = await getUsersCollection(c.env);
    
    const result = await collection.updateOne(
      { _id: new ObjectId(user.userId) },
      { $set: { profile: validatedData } }
    );

    if (result.matchedCount === 0) {
      return c.json({
        success: false,
        error: 'User not found',
      }, 404);
    }

    const updatedUser = await collection.findOne(
      { _id: new ObjectId(user.userId) },
      { projection: { 'services.password': 0 } }
    );

    const response: ApiResponse<User> = {
      success: true,
      data: updatedUser!,
      message: 'Profile updated successfully',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error updating user profile:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Validation error',
        message: error.message,
      }, 400);
    }

    return c.json({
      success: false,
      error: 'Failed to update profile',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// GET /api/v1/users/favorites - Get user's favorite listings
usersRouter.get('/favorites', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const usersCollection = await getUsersCollection(c.env);
    const listingsCollection = await getListingsCollection(c.env);
    
    const userData = await usersCollection.findOne({ _id: new ObjectId(user.userId) });
    
    if (!userData || !userData.profile?.favorites) {
      return c.json({
        success: true,
        data: [],
      });
    }

    const favoriteIds = userData.profile.favorites.map(id => new ObjectId(id));
    const favorites = await listingsCollection
      .find({ _id: { $in: favoriteIds } })
      .sort({ name: 1 })
      .toArray();

    const response: ApiResponse = {
      success: true,
      data: favorites,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching user favorites:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch favorites',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// POST /api/v1/users/favorites/:listingId - Add listing to favorites
usersRouter.post('/favorites/:listingId', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const listingId = c.req.param('listingId');
    
    if (!ObjectId.isValid(listingId)) {
      return c.json({
        success: false,
        error: 'Invalid listing ID',
      }, 400);
    }

    const usersCollection = await getUsersCollection(c.env);
    const listingsCollection = await getListingsCollection(c.env);
    
    // Check if listing exists
    const listing = await listingsCollection.findOne({ _id: new ObjectId(listingId) });
    if (!listing) {
      return c.json({
        success: false,
        error: 'Listing not found',
      }, 404);
    }

    // Add to favorites
    const result = await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      { $addToSet: { 'profile.favorites': listingId } }
    );

    if (result.matchedCount === 0) {
      return c.json({
        success: false,
        error: 'User not found',
      }, 404);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Listing added to favorites',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error adding to favorites:', error);
    return c.json({
      success: false,
      error: 'Failed to add to favorites',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// DELETE /api/v1/users/favorites/:listingId - Remove listing from favorites
usersRouter.delete('/favorites/:listingId', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const listingId = c.req.param('listingId');
    
    if (!ObjectId.isValid(listingId)) {
      return c.json({
        success: false,
        error: 'Invalid listing ID',
      }, 400);
    }

    const collection = await getUsersCollection(c.env);
    
    const result = await collection.updateOne(
      { _id: new ObjectId(user.userId) },
      { $pull: { 'profile.favorites': listingId } }
    );

    if (result.matchedCount === 0) {
      return c.json({
        success: false,
        error: 'User not found',
      }, 404);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Listing removed from favorites',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error removing from favorites:', error);
    return c.json({
      success: false,
      error: 'Failed to remove from favorites',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// POST /api/v1/users/verify/:listingId - Verify a listing
usersRouter.post('/verify/:listingId', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const listingId = c.req.param('listingId');
    
    if (!ObjectId.isValid(listingId)) {
      return c.json({
        success: false,
        error: 'Invalid listing ID',
      }, 400);
    }

    const usersCollection = await getUsersCollection(c.env);
    const listingsCollection = await getListingsCollection(c.env);
    
    // Check if listing exists
    const listing = await listingsCollection.findOne({ _id: new ObjectId(listingId) });
    if (!listing) {
      return c.json({
        success: false,
        error: 'Listing not found',
      }, 404);
    }

    // Add user to verifiers and update counts
    await listingsCollection.updateOne(
      { _id: new ObjectId(listingId) },
      { 
        $addToSet: { verifiers: user.userId },
        $pull: { deverifiers: user.userId }
      }
    );

    // Update verifier count
    const updatedListing = await listingsCollection.findOne({ _id: new ObjectId(listingId) });
    await listingsCollection.updateOne(
      { _id: new ObjectId(listingId) },
      { 
        $set: { 
          verifierCount: updatedListing?.verifiers?.length || 0,
          deverifierCount: updatedListing?.deverifiers?.length || 0
        }
      }
    );

    // Add to user's verified listings
    await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      { 
        $addToSet: { 'profile.verifiedListings': listingId },
        $pull: { 'profile.deverifiedListings': listingId }
      }
    );

    const response: ApiResponse = {
      success: true,
      message: 'Listing verified successfully',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error verifying listing:', error);
    return c.json({
      success: false,
      error: 'Failed to verify listing',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// POST /api/v1/users/deverify/:listingId - Deverify a listing
usersRouter.post('/deverify/:listingId', authMiddleware, async (c) => {
  try {
    const user = c.get('user');
    const listingId = c.req.param('listingId');
    
    if (!ObjectId.isValid(listingId)) {
      return c.json({
        success: false,
        error: 'Invalid listing ID',
      }, 400);
    }

    const usersCollection = await getUsersCollection(c.env);
    const listingsCollection = await getListingsCollection(c.env);
    
    // Check if listing exists
    const listing = await listingsCollection.findOne({ _id: new ObjectId(listingId) });
    if (!listing) {
      return c.json({
        success: false,
        error: 'Listing not found',
      }, 404);
    }

    // Add user to deverifiers and remove from verifiers
    await listingsCollection.updateOne(
      { _id: new ObjectId(listingId) },
      { 
        $addToSet: { deverifiers: user.userId },
        $pull: { verifiers: user.userId }
      }
    );

    // Update counts
    const updatedListing = await listingsCollection.findOne({ _id: new ObjectId(listingId) });
    await listingsCollection.updateOne(
      { _id: new ObjectId(listingId) },
      { 
        $set: { 
          verifierCount: updatedListing?.verifiers?.length || 0,
          deverifierCount: updatedListing?.deverifiers?.length || 0
        }
      }
    );

    // Update user's lists
    await usersCollection.updateOne(
      { _id: new ObjectId(user.userId) },
      { 
        $addToSet: { 'profile.deverifiedListings': listingId },
        $pull: { 'profile.verifiedListings': listingId }
      }
    );

    const response: ApiResponse = {
      success: true,
      message: 'Listing deverified successfully',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error deverifying listing:', error);
    return c.json({
      success: false,
      error: 'Failed to deverify listing',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});
