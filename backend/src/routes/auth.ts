import { Hono } from 'hono';
import { sign, verify } from 'hono/jwt';
import bcrypt from 'bcryptjs';
import { getUsersCollection } from '../lib/database';
import { LoginSchema, RegisterSchema } from '../lib/validation';
import type { Env } from '../index';
import type { User, ApiResponse } from '../../../shared/types';

export const authRouter = new Hono<{ Bindings: Env }>();

// POST /api/v1/auth/register - Register new user
authRouter.post('/register', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = RegisterSchema.parse(body);

    const collection = await getUsersCollection(c.env);
    
    // Check if user already exists
    const existingUser = await collection.findOne({
      $or: [
        { username: validatedData.username },
        { 'emails.address': validatedData.email }
      ]
    });

    if (existingUser) {
      return c.json({
        success: false,
        error: 'User already exists',
        message: 'Username or email is already taken',
      }, 409);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);

    // Create user
    const now = new Date();
    const userData: Partial<User> = {
      username: validatedData.username,
      emails: [{
        address: validatedData.email,
        verified: false,
      }],
      createdAt: now,
      profile: {
        firstName: validatedData.firstName,
        lastName: validatedData.lastName,
        email: validatedData.email,
        ownedListings: [],
        verifiedListings: [],
        deverifiedListings: [],
        favorites: [],
      },
      services: {
        password: {
          bcrypt: hashedPassword,
        },
      },
    };

    const result = await collection.insertOne(userData as User);
    const createdUser = await collection.findOne(
      { _id: result.insertedId },
      { projection: { 'services.password': 0 } }
    );

    // Generate JWT token
    const token = await sign(
      {
        userId: result.insertedId.toString(),
        username: validatedData.username,
        email: validatedData.email,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      },
      c.env.JWT_SECRET
    );

    const response: ApiResponse<{ user: User; token: string }> = {
      success: true,
      data: {
        user: createdUser!,
        token,
      },
      message: 'User registered successfully',
    };

    return c.json(response, 201);
  } catch (error) {
    console.error('Error registering user:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Validation error',
        message: error.message,
      }, 400);
    }

    return c.json({
      success: false,
      error: 'Registration failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// POST /api/v1/auth/login - Login user
authRouter.post('/login', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = LoginSchema.parse(body);

    const collection = await getUsersCollection(c.env);
    
    // Find user by email
    const user = await collection.findOne({
      'emails.address': validatedData.email
    });

    if (!user || !user.services?.password?.bcrypt) {
      return c.json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      }, 401);
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      validatedData.password,
      user.services.password.bcrypt
    );

    if (!isValidPassword) {
      return c.json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect',
      }, 401);
    }

    // Generate JWT token
    const token = await sign(
      {
        userId: user._id!.toString(),
        username: user.username,
        email: validatedData.email,
        exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
      },
      c.env.JWT_SECRET
    );

    // Remove password from response
    const { services, ...userWithoutPassword } = user;

    const response: ApiResponse<{ user: Partial<User>; token: string }> = {
      success: true,
      data: {
        user: userWithoutPassword,
        token,
      },
      message: 'Login successful',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error logging in user:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Validation error',
        message: error.message,
      }, 400);
    }

    return c.json({
      success: false,
      error: 'Login failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// GET /api/v1/auth/me - Get current user
authRouter.get('/me', async (c) => {
  try {
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
      
      const collection = await getUsersCollection(c.env);
      const user = await collection.findOne(
        { _id: payload.userId },
        { projection: { 'services.password': 0 } }
      );

      if (!user) {
        return c.json({
          success: false,
          error: 'User not found',
        }, 404);
      }

      const response: ApiResponse<User> = {
        success: true,
        data: user,
      };

      return c.json(response);
    } catch (jwtError) {
      return c.json({
        success: false,
        error: 'Invalid token',
        message: 'Token is expired or invalid',
      }, 401);
    }
  } catch (error) {
    console.error('Error getting current user:', error);
    return c.json({
      success: false,
      error: 'Failed to get user',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// POST /api/v1/auth/refresh - Refresh token
authRouter.post('/refresh', async (c) => {
  try {
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
      
      // Generate new token
      const newToken = await sign(
        {
          userId: payload.userId,
          username: payload.username,
          email: payload.email,
          exp: Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60), // 7 days
        },
        c.env.JWT_SECRET
      );

      const response: ApiResponse<{ token: string }> = {
        success: true,
        data: { token: newToken },
        message: 'Token refreshed successfully',
      };

      return c.json(response);
    } catch (jwtError) {
      return c.json({
        success: false,
        error: 'Invalid token',
        message: 'Token is expired or invalid',
      }, 401);
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    return c.json({
      success: false,
      error: 'Token refresh failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// POST /api/v1/auth/logout - Logout user (client-side token removal)
authRouter.post('/logout', (c) => {
  return c.json({
    success: true,
    message: 'Logout successful. Please remove the token from client storage.',
  });
});
