# The MoBB v3 - Modern Stack Migration

*The Map of Black Businesses* (_MoBB_) is a tool to practice group economics. The application allows for consumers to immediately identify black owned businesses (_BoBs_) in their vicinity (or search another area on the map); with the goal of growing The Community's economy.

_Assumption: If we drive more customers to BoBs, they in turn will bank with Black Banks, who will reinvest in small BoBs and projects which benefit The Community._

## 🚀 **v3 Modern Architecture**

This branch represents a complete modernization from the legacy Meteor.js application to a cutting-edge 2025 technology stack:

### **Technology Stack**
- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS
- **Frontend Hosting**: Cloudflare Pages
- **Backend API**: Cloudflare Workers + Hono
- **Database**: MongoDB Atlas
- **Data Scraping/Ingestion**: n8n (Docker locally, serverless deployment)
- **Authentication**: JWT with secure token management
- **State Management**: Zustand with persistence
- **Maps**: Google Maps JavaScript API
- **Deployment**: Cloudflare ecosystem

### **Key Improvements**
- ⚡ **Performance**: Vite for lightning-fast development and optimized builds
- 🔒 **Security**: Modern JWT authentication with refresh tokens
- 📱 **Mobile-First**: Responsive design with Tailwind CSS
- 🌐 **Global CDN**: Cloudflare Pages for worldwide performance
- 🔄 **Real-time**: Optimistic updates and efficient caching
- 📊 **Analytics**: Built-in performance monitoring
- 🛠️ **Developer Experience**: TypeScript, ESLint, hot reload
- 🚀 **Scalability**: Serverless architecture that scales automatically

## Prerequisites

Before you begin, ensure you have met the following requirements:
* **Node.js** >= 18.0.0
* **npm** >= 9.0.0 (or **yarn** >= 1.22.0)
* **Git** for version control
* **MongoDB Atlas** account (for database)
* **Cloudflare** account (for deployment)
* **Google Cloud** account (for Maps API)

## 🏗️ **Project Structure**

```
mobb_v0/
├── backend/                 # Cloudflare Workers API
│   ├── src/
│   │   ├── routes/         # API route handlers
│   │   ├── lib/           # Database, validation, utilities
│   │   └── index.ts       # Main worker entry point
│   ├── package.json
│   └── wrangler.toml      # Cloudflare Workers config
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── stores/        # Zustand state management
│   │   ├── services/      # API services
│   │   └── main.tsx       # App entry point
│   ├── package.json
│   └── vite.config.ts     # Vite configuration
├── shared/                 # Shared TypeScript types
│   └── types/
└── package.json           # Root workspace configuration
```

## 🚀 **Quick Start**

### 1. **Clone and Setup**
```bash
git clone https://github.com/Kiel-H-Byrne/mobb_v0.git
cd mobb_v0
git checkout v3

# Install dependencies for all workspaces
npm install
npm run setup
```

### 2. **Environment Configuration**

Create environment files:

**Backend** (`backend/.env`):
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/mobb
JWT_SECRET=your-super-secret-jwt-key-here
GOOGLE_MAPS_API_KEY=your-google-maps-api-key
GOOGLE_PLACES_API_KEY=your-google-places-api-key
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:8787/api/v1
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

### 3. **Development**

Start both frontend and backend in development mode:

```bash
# Start both frontend and backend concurrently
npm run dev

# Or start individually:
npm run dev:frontend  # Starts Vite dev server on http://localhost:5173
npm run dev:backend   # Starts Cloudflare Workers on http://localhost:8787
```

### 4. **Database Setup**

The application will automatically create indexes when the backend starts. To populate with initial data:

1. **Categories**: Use the existing `lib/config/categories.json`
2. **Listings**: Import from `lib/config/listings.json` or existing CSV files
3. **Users**: Register through the application UI

## 📦 **Deployment**

### **Frontend (Cloudflare Pages)**

```bash
cd frontend
npm run build
npm run deploy
```

### **Backend (Cloudflare Workers)**

```bash
cd backend

# Set up secrets
wrangler secret put MONGODB_URI
wrangler secret put JWT_SECRET
wrangler secret put GOOGLE_MAPS_API_KEY
wrangler secret put GOOGLE_PLACES_API_KEY

# Deploy
npm run deploy
```

## 🧪 **Testing**

```bash
# Run all tests
npm run test

# Run tests for specific workspace
npm run test:frontend
npm run test:backend

# Watch mode
npm run test:frontend -- --watch
```

## 📋 **Available Scripts**

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both frontend and backend in development |
| `npm run build` | Build both frontend and backend for production |
| `npm run deploy` | Deploy both frontend and backend |
| `npm run test` | Run all tests |
| `npm run lint` | Lint all code |
| `npm run clean` | Clean all build artifacts and dependencies |

## 🔧 **API Documentation**

The API follows RESTful conventions with the following endpoints:

### **Authentication**
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout user

### **Listings**
- `GET /api/v1/listings` - Get all listings (paginated)
- `GET /api/v1/listings/:id` - Get single listing
- `POST /api/v1/listings` - Create new listing
- `PUT /api/v1/listings/:id` - Update listing
- `DELETE /api/v1/listings/:id` - Delete listing

### **Categories**
- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get single category
- `POST /api/v1/categories` - Create new category

### **Search**
- `GET /api/v1/search` - Search listings with filters
- `GET /api/v1/search/nearby` - Find nearby listings
- `GET /api/v1/search/autocomplete` - Get search suggestions

### **Users**
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update user profile
- `GET /api/v1/users/favorites` - Get user favorites
- `POST /api/v1/users/favorites/:id` - Add to favorites
- `DELETE /api/v1/users/favorites/:id` - Remove from favorites

## 🔄 **Migration from Legacy Meteor App**

The v3 branch represents a complete rewrite. Key migration considerations:

### **Data Migration**
1. **Export** existing data from Meteor MongoDB
2. **Transform** data to match new schemas (see `shared/types/`)
3. **Import** into MongoDB Atlas using provided scripts

### **Feature Parity**
- ✅ User authentication and profiles
- ✅ Business listings with full CRUD
- ✅ Categories and search functionality
- ✅ Google Maps integration
- ✅ Favorites and verification system
- ✅ Mobile-responsive design
- 🔄 Claims and ownership system (in progress)
- 🔄 Admin panel (planned)
- 🔄 Social media integration (planned)

## Contributing

### _First off, thank you for considering contributing to The MoBB. It’s people like you that make The MoBB such a great tool._ 🥂

1. [Fork](https://github.com/tdotholla/mobb_v0.git) this repo
2. Create a branch: `git checkout -b <branch_name>` (feature? bug?).
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the [pull request](). **(Don't forget to [test!](https://www.npmjs.com/package/zora))**

## Contributors

#### Thanks to the following people who have contributed to this project:

* [@DevCollectiv](https://github.com/DevCollectiv) 📖💻🤔⚠️
* [@tmanundercover](https://github.com/tmanundercover) 🐛💻🤔👀⚠️
* [@tdblackston0](https://github.com/tdblackston0) 🐛🤔👀⚠️
* [@ludakhris](https://github.com/ludakhris) 💬🐛💻🤔👀⚠️


## Licenses

Content is released under [Mozilla Public License Version 2.0](). See [LICENSE.md](LICENSE.MD) for complete details, including attribution guidelines, contribution terms, and software and third-party licenses and permissions.

### Roadmap as user stories

- [x] _As an end-user, I would like to see the locations of black owned businesses near me, on a map_
- [ ] _I would like to see the one closest business to me, at all times_
- [x] _I would like to see details of the busineses shown on the map_
- [ ] _I would like to become a registered user_
- [ ] _I would like to get directions to the business I am viewing_
- [ ] _As a registered user, I would like to add a business to the map_
- [ ] _As a registered user, I would like to modify business I am viewing_
- [ ] _The map and business details should be current_

### Branches:

Try to name branches in a descriptive way, `master`, `ft-<featureName>`, `fix-<fixName>`, etc...
**No pull requests will be merged into `master` branch.**

### Resources:

[Github Contribution setup](https://help.github.com/en/github/building-a-strong-community/setting-up-your-project-for-healthy-contributions)
