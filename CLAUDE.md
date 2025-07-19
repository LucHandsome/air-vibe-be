# CLAUDE.md
This file provides guidance to Claude Code (claude.ai/code) when working with the Air Vibe backend codebase.

## Project Overview

Air Vibe is a Node.js backend API for an intelligent weather and air quality application. The backend serves a Flutter mobile app that provides weather forecasts and PM2.5 air pollution predictions using AI/ML models. The system integrates with weather APIs and machine learning services to deliver personalized environmental insights to users.

## Technology Stack

**Runtime**: Node.js
**Web Framework**: Express.js v4.21.0
**Database**: MongoDB with Mongoose ODM v8.6.3
**Authentication**: JSON Web Tokens (jsonwebtoken v9.0.2)
**OAuth**: Google OAuth 2.0 (passport-google-oauth20 v2.0.0)
**Password Hashing**: bcryptjs v2.4.3
**Environment Variables**: dotenv v16.4.7
**CORS**: cors v2.8.5
**Development**: nodemon v3.1.7
**Email Service**: Nodemailer v6.9.15
**File Upload**: Multer v1.4.5-lts.1, Cloudinary v2.5.0
**Real-time Communication**: Socket.io v4.8.1
**Caching**: ioredis v5.4.1
**Payment**: Stripe v16.12.0
**AI Integration**: Google Generative AI v0.24.0
**Data Processing**: XLSX v0.18.5
**Push Notifications**: Firebase Cloud Messaging (FCM) integration planned
**External APIs**: OpenWeatherMap API (or equivalent weather service)

## Development Commands

# Install dependencies
npm install

# Start development server with auto-reload
npm run dev

# Initialize weather data seeding
npm run init-shipping

## Project Structure

air-vibe-backend/
├── controllers/
│   ├── admin/
│   │   └── user.controller.js      # Admin user management
│   ├── customer/
│   │   └── auth.controller.js      # Customer authentication
│   ├── weather/                    # Weather API controllers (planned)
│   │   ├── current.controller.js   # Current weather data
│   │   ├── forecast.controller.js  # Weather forecasts
│   │   └── location.controller.js  # Location management
│   └── airquality/                 # Air quality controllers (planned)
│       ├── current.controller.js   # Current AQI data
│       ├── forecast.controller.js  # PM2.5 predictions
│       └── alerts.controller.js    # Air quality alerts
├── routes/
│   ├── admin/
│   │   └── user.route.js          # Admin user routes
│   ├── customer/
│   │   └── auth.route.js          # Customer auth routes
│   ├── weather.route.js           # Weather API routes (planned)
│   └── airquality.route.js        # Air quality routes (planned)
├── models/
│   ├── user.model.js              # User schema with bcrypt password hashing
│   ├── location.model.js          # Saved user locations (planned)
│   ├── weatherData.model.js       # Cached weather data (planned)
│   ├── airQuality.model.js        # PM2.5 and AQI data (planned)
│   └── userSettings.model.js      # User notification preferences (planned)
├── services/
│   ├── customer/
│   │   └── auth.service.js        # Customer authentication logic
│   ├── nodemailer/
│   │   ├── email.service.js       # Email sending functionality
│   │   └── template.service.js    # Email templates
│   ├── weather/                   # Weather services (planned)
│   │   ├── openweather.service.js # OpenWeatherMap API integration
│   │   └── cache.service.js       # Weather data caching
│   ├── airquality/                # Air quality services (planned)
│   │   ├── prediction.service.js  # PM2.5 ML predictions
│   │   └── alerts.service.js      # Air quality notifications
│   ├── customer.service.js        # Customer profile management
│   ├── otp.service.js            # OTP generation and verification
│   └── token.service.js          # JWT token generation and management
├── middleware/
│   ├── auth.middleware.js         # JWT authentication & admin verification
│   ├── validation.middleware.js   # Request validation (planned)
│   └── rateLimit.middleware.js    # API rate limiting (planned)
├── helpers/
│   ├── appError.helper.js         # Custom error handling
│   ├── cloudinary.helper.js       # Cloudinary file upload
│   ├── cookie.helper.js           # Cookie management
│   ├── multer.helper.js           # File upload middleware
│   └── redis.helper.js            # Redis cache operations
├── libs/
│   ├── cloudinary.js              # Cloudinary configuration
│   ├── db.js                      # MongoDB connection
│   ├── initSocket.js              # Socket.io initialization
│   ├── passport.js                # Google OAuth configuration
│   ├── redis.js                   # Redis connection
│   ├── socket.js                  # Socket.io handlers
│   └── stripe.js                  # Stripe payment configuration
├── config/
│   ├── cors.js                    # CORS configuration
│   ├── external-apis.js           # Weather API & ML service config (planned)
│   └── constants.js               # AQI thresholds, weather codes (planned)
├── constants/
├── scripts/
└── app.js                         # Main application entry point

## API Endpoints Structure

### Customer Authentication (Base: /api/v1)

- POST /signup - User registration with email verification
- POST /verify-signup - Verify email with OTP
- POST /resent-otp - Resend OTP for verification
- POST /login - Standard email/password login
- GET /login-google - Google OAuth login initiation
- GET /login-google/callback - Google OAuth callback
- POST /logout - User logout
- POST /refresh-token - Refresh JWT access token
- GET /profile - Get user profile (requires authentication)
- POST /update-profile - Update user profile (requires authentication)
- POST /forgot-password - Request password reset
- POST /reset-password/:token - Reset password with token


## Weather (Base: /api/v1)

- GET /weather/current/:lat/:lon - Current weather by coordinates
- GET /weather/forecast/:lat/:lon - 7-day forecast
- GET /weather/hourly/:lat/:lon - 24-hour forecast
- GET /weather/city/:cityName - Weather by city name

## Air Quality (Base: /api/v1)

- GET /air-quality/current/:lat/:lon - Current AQI and PM2.5
- GET /air-quality/forecast/:lat/:lon - PM2.5 predictions
- GET /air-quality/heatmap/:lat/:lon/:radius - Area air quality map
- GET /air-quality/alerts/:userId - User-specific air quality alerts

### Admin User Management (Base: /api/v1/admin)

- GET / - Get all users/customers (requires admin role)
- GET /:userId - Get specific user details (requires admin role)

### Message Routes (Base: /api/v1/messages)

- Socket.io real-time messaging endpoints (implementation pending)

## Implemented Features

### ✅ User Authentication & Security
- JWT tokens with refresh mechanism implemented
- Password hashing with bcryptjs (10 rounds)
- Google OAuth 2.0 integration
- Email verification with OTP system
- Password reset with secure tokens
- Cookie-based refresh token storage
- Role-based access control (user/admin)
- Input validation and sanitization

### ✅ Email System
- Nodemailer integration for transactional emails
- Email verification templates
- Password reset email functionality
- OTP resend functionality

### ✅ File Upload Infrastructure
- Cloudinary integration for file storage
- Multer middleware for file handling
- Upload helper functions

### ✅ Real-time Communication
- Socket.io setup and initialization
- Basic infrastructure for real-time messaging

### ⏳ Weather & Air Quality Features (To Be Implemented)
- Weather data fetching from external APIs
- Air quality monitoring and PM2.5 predictions
- Location-based services
- Data caching for performance
- Real-time alerts and notifications

### ✅ Caching System
- Redis integration
- Cache helper functions
- Session and data caching capabilities

### ✅ AI Integration
- Google Generative AI setup
- Foundation for AI-powered features

## Development Guidelines

### User Authentication & Security
- JWT access tokens expire after configured time
- Refresh tokens stored securely in HTTP-only cookies
- Passwords hashed with bcryptjs (10 rounds)
- Google OAuth flow properly implemented
- Email verification required for new accounts
- Password reset uses secure token generation

## Weather Data Integration (To Be Implemented)

- Cache weather data to reduce external API calls (10 minutes cache)
- Implement fallback mechanisms for API failures
- Use geolocation validation for coordinate inputs
- Handle timezone conversions properly
- Integrate with OpenWeatherMap API or equivalent
- Support current weather, forecasts, and historical data
- Implement weather alerts and notifications

## Air Quality & PM2.5 Predictions (To Be Implemented)

- Integrate with Python ML microservice for PM2.5 predictions
- Implement data validation for air quality metrics
- Cache prediction results appropriately (30 minutes cache)
- Provide health recommendations based on AQI levels
- Support real-time air quality monitoring
- Generate air quality heatmaps for geographic areas
- Send alerts for dangerous air quality levels

## Location Management (To Be Implemented)

- Allow users to save favorite locations
- Support geolocation-based weather and air quality data
- Implement location search and autocomplete
- Store location preferences in user profiles
- Support multiple location tracking for users

### Database Design
- User model with proper validation (✅ implemented)
- MongoDB with Mongoose ODM (✅ implemented)
- Proper schema structure with timestamps (✅ implemented)
- Address schema embedded in user model (✅ implemented)
- Unique email constraint with sparse indexes (✅ implemented)
- Location model for saved user locations (⏳ planned)
- WeatherData model for cached weather information (⏳ planned)
- AirQuality model for PM2.5 and AQI data (⏳ planned)
- UserSettings model for notification preferences (⏳ planned)
- Implement indexing for geospatial queries (⏳ planned)

### Error Handling
- Global error handling middleware implemented
- Custom AppError helper for consistent error responses
- Proper HTTP status codes
- Structured error messages

### Email System
- Template-based email system
- Verification, password reset, and success emails
- Environment-based configuration
- Error handling for email failures

### File Management
- Cloudinary for cloud storage
- Multer for local file handling
- Proper file validation and processing
- Upload directory structure

### Real-time Features
- Socket.io configured for real-time communication
- Proper CORS handling for socket connections
- Foundation for chat and notification systems

### Caching Strategy
- Redis for session storage (✅ implemented)
- Cache helper functions available (✅ implemented)
- Configurable cache expiration (✅ implemented)
- Proper cache invalidation patterns (✅ implemented)
- Weather data caching (10 minutes) (⏳ planned)
- Air quality data caching (30 minutes) (⏳ planned)
- Location-based cache keys (⏳ planned)
- Cache warming for frequently accessed locations (⏳ planned)

## Future Implementation Roadmap

### Phase 1: Core Weather Features
1. OpenWeatherMap API integration
2. Basic weather endpoints (current, forecast, hourly)
3. Weather data models and caching
4. Location management system

### Phase 2: Air Quality Integration
1. Air quality data models
2. PM2.5 prediction service integration
3. Air quality endpoints and alerts
4. Health recommendations based on AQI

### Phase 3: Advanced Features
1. Real-time notifications via Socket.io
2. Push notifications with FCM
3. Weather and air quality heatmaps
4. Historical data analysis
5. Personalized recommendations

### Phase 4: Mobile App Support
1. Flutter app API integration
2. Offline data synchronization
3. Background location updates
4. Enhanced notification system