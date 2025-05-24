import { Hono } from 'hono';
import { ObjectId } from 'mongodb';
import { getCategoriesCollection, getListingsCollection } from '../lib/database';
import { CategorySchema } from '../lib/validation';
import type { Env } from '../index';
import type { Category, ApiResponse } from '../../../shared/types';

export const categoriesRouter = new Hono<{ Bindings: Env }>();

// GET /api/v1/categories - Get all categories
categoriesRouter.get('/', async (c) => {
  try {
    const collection = await getCategoriesCollection(c.env);
    const categories = await collection
      .find({})
      .sort({ count: -1, name: 1 })
      .toArray();

    const response: ApiResponse<Category[]> = {
      success: true,
      data: categories,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch categories',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// GET /api/v1/categories/:id - Get single category
categoriesRouter.get('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    if (!ObjectId.isValid(id)) {
      return c.json({
        success: false,
        error: 'Invalid category ID',
      }, 400);
    }

    const collection = await getCategoriesCollection(c.env);
    const category = await collection.findOne({ _id: new ObjectId(id) });

    if (!category) {
      return c.json({
        success: false,
        error: 'Category not found',
      }, 404);
    }

    const response: ApiResponse<Category> = {
      success: true,
      data: category,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching category:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch category',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// GET /api/v1/categories/name/:name - Get category by name
categoriesRouter.get('/name/:name', async (c) => {
  try {
    const name = decodeURIComponent(c.req.param('name'));
    
    const collection = await getCategoriesCollection(c.env);
    const category = await collection.findOne({ name: { $regex: new RegExp(`^${name}$`, 'i') } });

    if (!category) {
      return c.json({
        success: false,
        error: 'Category not found',
      }, 404);
    }

    const response: ApiResponse<Category> = {
      success: true,
      data: category,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error fetching category by name:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch category',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// POST /api/v1/categories - Create new category
categoriesRouter.post('/', async (c) => {
  try {
    const body = await c.req.json();
    const validatedData = CategorySchema.parse(body);

    const collection = await getCategoriesCollection(c.env);
    
    // Check if category already exists
    const existingCategory = await collection.findOne({ 
      name: { $regex: new RegExp(`^${validatedData.name}$`, 'i') } 
    });

    if (existingCategory) {
      return c.json({
        success: false,
        error: 'Category already exists',
      }, 409);
    }

    // Calculate count if not provided
    let count = validatedData.count || 0;
    if (!validatedData.count) {
      const listingsCollection = await getListingsCollection(c.env);
      count = await listingsCollection.countDocuments({
        categories: { $elemMatch: { $in: [validatedData.name] } }
      });
    }

    const categoryData: Partial<Category> = {
      ...validatedData,
      count,
    };

    const result = await collection.insertOne(categoryData as Category);
    const createdCategory = await collection.findOne({ _id: result.insertedId });

    const response: ApiResponse<Category> = {
      success: true,
      data: createdCategory!,
      message: 'Category created successfully',
    };

    return c.json(response, 201);
  } catch (error) {
    console.error('Error creating category:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Validation error',
        message: error.message,
      }, 400);
    }

    return c.json({
      success: false,
      error: 'Failed to create category',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// PUT /api/v1/categories/:id - Update category
categoriesRouter.put('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    if (!ObjectId.isValid(id)) {
      return c.json({
        success: false,
        error: 'Invalid category ID',
      }, 400);
    }

    const body = await c.req.json();
    const validatedData = CategorySchema.partial().parse(body);

    const collection = await getCategoriesCollection(c.env);
    
    // If name is being updated, check for duplicates
    if (validatedData.name) {
      const existingCategory = await collection.findOne({ 
        name: { $regex: new RegExp(`^${validatedData.name}$`, 'i') },
        _id: { $ne: new ObjectId(id) }
      });

      if (existingCategory) {
        return c.json({
          success: false,
          error: 'Category name already exists',
        }, 409);
      }
    }

    const result = await collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: validatedData }
    );

    if (result.matchedCount === 0) {
      return c.json({
        success: false,
        error: 'Category not found',
      }, 404);
    }

    const updatedCategory = await collection.findOne({ _id: new ObjectId(id) });

    const response: ApiResponse<Category> = {
      success: true,
      data: updatedCategory!,
      message: 'Category updated successfully',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error updating category:', error);
    
    if (error instanceof Error && error.name === 'ZodError') {
      return c.json({
        success: false,
        error: 'Validation error',
        message: error.message,
      }, 400);
    }

    return c.json({
      success: false,
      error: 'Failed to update category',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// DELETE /api/v1/categories/:id - Delete category
categoriesRouter.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id');
    
    if (!ObjectId.isValid(id)) {
      return c.json({
        success: false,
        error: 'Invalid category ID',
      }, 400);
    }

    const collection = await getCategoriesCollection(c.env);
    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return c.json({
        success: false,
        error: 'Category not found',
      }, 404);
    }

    const response: ApiResponse = {
      success: true,
      message: 'Category deleted successfully',
    };

    return c.json(response);
  } catch (error) {
    console.error('Error deleting category:', error);
    return c.json({
      success: false,
      error: 'Failed to delete category',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});

// POST /api/v1/categories/refresh-counts - Refresh all category counts
categoriesRouter.post('/refresh-counts', async (c) => {
  try {
    const categoriesCollection = await getCategoriesCollection(c.env);
    const listingsCollection = await getListingsCollection(c.env);
    
    const categories = await categoriesCollection.find({}).toArray();
    
    for (const category of categories) {
      const count = await listingsCollection.countDocuments({
        categories: { $elemMatch: { $in: [category.name] } }
      });
      
      await categoriesCollection.updateOne(
        { _id: category._id },
        { $set: { count } }
      );
    }

    const response: ApiResponse = {
      success: true,
      message: `Updated counts for ${categories.length} categories`,
    };

    return c.json(response);
  } catch (error) {
    console.error('Error refreshing category counts:', error);
    return c.json({
      success: false,
      error: 'Failed to refresh category counts',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, 500);
  }
});
