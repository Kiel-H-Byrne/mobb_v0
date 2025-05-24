#!/usr/bin/env node

/**
 * Development Setup Script for MOBB v3
 * 
 * This script helps set up the development environment by:
 * - Creating necessary environment files
 * - Installing dependencies
 * - Setting up the database
 * - Providing helpful instructions
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.dirname(__dirname);

// Environment file templates
const backendEnvTemplate = `# Backend Environment Variables
# Copy this file to backend/.env and fill in your values

# MongoDB Atlas connection string
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mobb

# JWT secret for authentication (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random

# Google Maps API keys
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GOOGLE_PLACES_API_KEY=your-google-places-api-key

# Optional: Environment identifier
ENVIRONMENT=development
`;

const frontendEnvTemplate = `# Frontend Environment Variables
# Copy this file to frontend/.env and fill in your values

# API URL (use localhost for development)
VITE_API_URL=http://localhost:8787/api/v1

# Google Maps API key (can be the same as backend)
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Optional: Enable development features
VITE_DEV_MODE=true
`;

const wranglerTemplate = `name = "mobb-api-dev"
main = "src/index.ts"
compatibility_date = "2023-12-18"
node_compat = true

[env.development]
name = "mobb-api-dev"

[env.staging]
name = "mobb-api-staging"

[env.production]
name = "mobb-api-prod"

# KV namespace for caching (optional)
# [[kv_namespaces]]
# binding = "CACHE"
# id = "your-kv-namespace-id"
# preview_id = "your-preview-kv-namespace-id"

[vars]
ENVIRONMENT = "development"
API_VERSION = "v1"
CORS_ORIGINS = "http://localhost:5173,https://localhost:5173"
`;

async function createEnvFiles() {
  console.log('📝 Creating environment files...');
  
  // Backend .env
  const backendEnvPath = path.join(rootDir, 'backend', '.env.example');
  await fs.writeFile(backendEnvPath, backendEnvTemplate);
  console.log('   ✅ Created backend/.env.example');
  
  // Frontend .env
  const frontendEnvPath = path.join(rootDir, 'frontend', '.env.example');
  await fs.writeFile(frontendEnvPath, frontendEnvTemplate);
  console.log('   ✅ Created frontend/.env.example');
  
  // Wrangler config
  const wranglerPath = path.join(rootDir, 'backend', 'wrangler.toml');
  try {
    await fs.access(wranglerPath);
    console.log('   ℹ️  backend/wrangler.toml already exists');
  } catch {
    await fs.writeFile(wranglerPath, wranglerTemplate);
    console.log('   ✅ Created backend/wrangler.toml');
  }
}

async function installDependencies() {
  console.log('\n📦 Installing dependencies...');
  
  try {
    console.log('   Installing root dependencies...');
    execSync('npm install', { cwd: rootDir, stdio: 'inherit' });
    
    console.log('   Installing frontend dependencies...');
    execSync('npm install', { cwd: path.join(rootDir, 'frontend'), stdio: 'inherit' });
    
    console.log('   Installing backend dependencies...');
    execSync('npm install', { cwd: path.join(rootDir, 'backend'), stdio: 'inherit' });
    
    console.log('   ✅ All dependencies installed successfully');
  } catch (error) {
    console.error('   ❌ Error installing dependencies:', error.message);
    throw error;
  }
}

async function checkPrerequisites() {
  console.log('🔍 Checking prerequisites...');
  
  const checks = [
    { name: 'Node.js', command: 'node --version', minVersion: '18.0.0' },
    { name: 'npm', command: 'npm --version', minVersion: '9.0.0' },
  ];
  
  for (const check of checks) {
    try {
      const version = execSync(check.command, { encoding: 'utf8' }).trim();
      console.log(`   ✅ ${check.name}: ${version}`);
    } catch (error) {
      console.error(`   ❌ ${check.name} not found or not working`);
      throw new Error(`${check.name} is required but not found`);
    }
  }
}

async function createDirectories() {
  console.log('\n📁 Creating necessary directories...');
  
  const directories = [
    'backend/src/routes',
    'backend/src/lib',
    'frontend/src/components',
    'frontend/src/pages',
    'frontend/src/stores',
    'frontend/src/services',
    'shared/types',
    'scripts',
  ];
  
  for (const dir of directories) {
    const fullPath = path.join(rootDir, dir);
    try {
      await fs.mkdir(fullPath, { recursive: true });
      console.log(`   ✅ Created ${dir}`);
    } catch (error) {
      if (error.code !== 'EEXIST') {
        console.error(`   ❌ Error creating ${dir}:`, error.message);
      }
    }
  }
}

function printInstructions() {
  console.log(`
🎉 Development environment setup complete!

📋 Next Steps:

1. 🔧 Configure Environment Variables:
   
   Backend (backend/.env):
   cp backend/.env.example backend/.env
   # Edit backend/.env with your MongoDB URI and API keys
   
   Frontend (frontend/.env):
   cp frontend/.env.example frontend/.env
   # Edit frontend/.env with your API keys

2. 🗄️  Set up MongoDB Atlas:
   - Create a MongoDB Atlas account at https://cloud.mongodb.com
   - Create a new cluster
   - Get your connection string
   - Add it to backend/.env as MONGODB_URI

3. 🗝️  Get Google Maps API Keys:
   - Go to https://console.cloud.google.com
   - Enable Maps JavaScript API and Places API
   - Create API keys
   - Add them to both .env files

4. 🚀 Start Development:
   npm run dev
   
   This will start:
   - Frontend: http://localhost:5173
   - Backend: http://localhost:8787

5. 📊 Optional - Migrate Existing Data:
   node scripts/migrate-data.js --dry-run
   # Remove --dry-run when ready to migrate

📚 Documentation:
   - API docs: http://localhost:8787 (when backend is running)
   - Frontend: http://localhost:5173
   - README: ./README.MD

🆘 Need Help?
   - Check the README.MD for detailed instructions
   - Review the API documentation
   - Check the GitHub issues for common problems

Happy coding! 🚀
`);
}

async function setup() {
  console.log('🚀 Setting up MOBB v3 Development Environment\n');
  
  try {
    await checkPrerequisites();
    await createDirectories();
    await createEnvFiles();
    await installDependencies();
    
    printInstructions();
    
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error('\nPlease fix the error and run the setup script again.');
    process.exit(1);
  }
}

// Run setup
if (import.meta.url === `file://${process.argv[1]}`) {
  setup().catch(console.error);
}
