# TravelBuddy - Knowledge Transfer Document

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Technology Stack](#architecture--technology-stack)
3. [Core Features & Functionality](#core-features--functionality)
4. [Database Models & Schema](#database-models--schema)
5. [API Endpoints](#api-endpoints)
6. [User Stories](#user-stories)
7. [Theoretical Details](#theoretical-details)
8. [Key Components & Modules](#key-components--modules)
9. [Integration Points](#integration-points)
10. [Mobile Application](#mobile-application)
11. [Web3 & Blockchain Integration](#web3--blockchain-integration)
12. [Payment System](#payment-system)
13. [Security & Authentication](#security--authentication)
14. [Deployment & Configuration](#deployment--configuration)
15. [Future Enhancements](#future-enhancements)

---

## Project Overview

**TravelBuddy** is a comprehensive travel companion platform designed specifically for exploring India. It combines AI-powered travel assistance, social networking for travelers, itinerary management, booking systems, and blockchain-based gamification through NFT rewards.

### Core Purpose
- Connect travelers with similar interests and destinations
- Provide AI-powered travel guidance (Gantavya AI)
- Manage travel itineraries and bookings
- Gamify travel experiences through NFT rewards
- Facilitate safe and verified travel companion matching

### Target Audience
- Solo travelers looking for companions
- Travel enthusiasts exploring India
- Adventure seekers wanting to document their journeys
- Users interested in blockchain-based travel rewards

---

## Architecture & Technology Stack

### Frontend
- **Framework**: Next.js 14.2.13 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Libraries**:
  - Framer Motion (animations)
  - React Icons
  - Lucide React
  - Swiper (image carousels)
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Database**: MongoDB (Mongoose ODM)
- **Authentication**: NextAuth.js v4
- **Password Hashing**: bcryptjs

### AI & External Services
- **AI Assistant**: OpenAI GPT-4o (Gantavya AI)
- **Image Storage**: Cloudinary
- **Email Service**: Nodemailer
- **Payment Gateway**: Razorpay
- **Blockchain**: Polygon Amoy Testnet (Ethers.js v6)
- **IPFS**: IPFS HTTP Client (for NFT metadata)

### Mobile Application
- **Framework**: React Native (Expo)
- **Location**: `TravelBuddyMobile/` directory
- **Navigation**: React Navigation
- **State Management**: React Context

---

## Core Features & Functionality

### 1. AI Travel Assistant (Gantavya AI)
- **Purpose**: Specialized AI chatbot for Indian travel guidance
- **Technology**: OpenAI GPT-4o with custom system prompts
- **Capabilities**:
  - Destination recommendations
  - Cultural insights
  - Local cuisine guidance
  - Itinerary suggestions
  - Travel tips specific to India
- **Location**: `/chatbot` page
- **API**: `/api/generate-response`

### 2. Travel Companion Matching
Two matching mechanisms:

#### a. Destination-Based Matching
- Users search by destination, dates, and budget
- System uses geocoding to find coordinates
- Matches users with:
  - Same/similar destinations (within 100km radius)
  - Overlapping travel dates
  - Compatible budget ranges (±30%)
- **Location**: `/find-people/destination`
- **API**: `/api/destination-matches`

#### b. Nearby Travelers
- Uses GPS coordinates (latitude/longitude)
- Finds travelers within proximity
- Calculates distance using Haversine formula
- **Location**: `/find-people/nearby`
- **API**: `/api/nearby-people`

### 3. Itinerary Management
- **Admin Features**: Create and publish travel itineraries
- **User Features**: Browse, view details, and book itineraries
- **Fields**: Title, description, duration, price, location, images, highlights, inclusions/exclusions
- **Location**: `/itineraries`
- **API**: `/api/itineraries`

### 4. Booking System
- Integrated with Razorpay payment gateway
- Supports booking confirmations
- Tracks booking status (pending, confirmed, cancelled, completed)
- Payment status tracking
- **Location**: `/booking-confirmation/[id]`
- **API**: `/api/bookings`

### 5. Travel Tasks & NFT Rewards
- **Gamification**: Users complete travel-related tasks
- **Tasks Include**:
  - Milestone photos
  - Highway/toll plaza captures
  - Landmark selfies
  - Local cuisine photos
  - Sunset views
  - Wildlife encounters
  - Market visits
  - Bridge/mountain views
- **NFT Minting**: Completed tasks can be minted as NFTs on Polygon blockchain
- **Location**: `/tasks`
- **API**: `/api/tasks`, `/api/complete-task`

### 6. User Profile Management
- Comprehensive user profiles with:
  - Personal information (name, age, gender, location)
  - Travel preferences (interests, languages, travel styles)
  - Profile images
  - About section
  - Instagram handle
  - Message acceptance settings
- **Location**: `/profile`, `/update-user`
- **API**: `/api/user/profile`, `/api/user/update-profile`

### 7. Authentication & Security
- Email/password authentication
- Email verification system
- OTP-based password reset
- JWT-based sessions
- Mobile authentication endpoints
- **Location**: `/sign-in`, `/signout`, `/verify-email`, `/reset-password`
- **API**: `/api/auth/*`

---

## Database Models & Schema

### User Model (`User.ts`)
```typescript
{
  email: string (unique, required)
  password: string (hashed, required)
  name: string
  age: number
  gender: string
  location: string
  latitude: number
  longitude: number
  phone: string
  about: string
  languages: string[]
  interests: string[]
  image: string
  isVerified: boolean (default: false)
  isNewUser: boolean (default: false)
  isAcceptingMessages: boolean (default: true)
  username: string
  instagram: string
  travelStyles: string[]
  timestamps: true
}
```

### Booking Model (`Booking.ts`)
```typescript
{
  itineraryId: string (required)
  userId: string (required)
  userEmail: string (required)
  userName: string (required)
  startDate: Date (required)
  numberOfPeople: number (required)
  totalPrice: number (required)
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
  specialRequests: string
  contactNumber: string
  paymentId: string
  orderId: string
  paymentSignature: string
  paymentStatus: 'pending' | 'completed' | 'failed'
  timestamps: true
}
```

### Itinerary Model (`Itinerary.ts`)
```typescript
{
  title: string (required)
  description: string (required)
  duration: number (days, required)
  price: number (required)
  location: string (required)
  images: string[] (required)
  highlights: string[]
  inclusions: string[]
  exclusions: string[]
  createdBy: string (required)
  isPublished: boolean (default: false)
  timestamps: true
}
```

### Travel Plan Model (`TravelPlan.ts`)
```typescript
{
  userId: ObjectId (required, ref: 'User')
  destination: string (required)
  fromDate: Date (required)
  toDate: Date (required)
  budget: number (required)
  coordinates: {
    type: 'Point'
    coordinates: [longitude, latitude] (GeoJSON)
  }
  formattedAddress: string (required)
  timestamps: true
}
// Index: 2dsphere on coordinates
```

### Task Model (`task.ts`)
```typescript
{
  userId: string (required, indexed)
  taskId: string (required, unique)
  title: string (required)
  description: string (required)
  category: 'transportation' | 'accommodation' | 'activities' | 'documentation' | 'planning'
  status: 'pending' | 'completed' | 'verified'
  completedAt: Date
  verifiedAt: Date
  nftTokenId: string
  metadataUri: string
  timestamps: true
}
```

### NFT Model (`NFT.ts`)
```typescript
{
  tokenId: string (required, unique)
  tokenURI: string (required)
  taskId: string (required)
  ownerAddress: string (required)
  metadata: {
    name: string (required)
    description: string (required)
    image: string (required)
    attributes: Array<{
      trait_type: string
      value: string
    }>
  }
  timestamps: true
}
```

### Destination Model (`Destination.ts`)
```typescript
{
  email: string
  searchedDestination: string
  dateFrom: Date
  dateTo: Date
  budgetRange: string
  timestamps: true
}
```

### OTP Model (`OTP.ts`)
- Stores OTP codes for password reset and verification
- Includes expiration timestamps

### VerificationToken Model (`VerificationToken.ts`)
- Manages email verification tokens
- Includes expiration handling

---

## API Endpoints

### Authentication (`/api/auth/*`)
- `POST /api/auth/[...nextauth]/route.ts` - NextAuth handler
- `POST /api/auth/mobile-signin` - Mobile app sign-in
- `POST /api/auth/mobile-signup` - Mobile app sign-up
- `POST /api/auth/send-otp` - Send OTP for verification
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/forgot-password` - Initiate password reset
- `POST /api/auth/send-verification` - Send email verification
- `GET /api/auth/verify` - Verify email token

### User Management (`/api/user/*`)
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/update-profile` - Update user profile
- `GET /api/user/mobile-profile` - Get mobile user profile
- `POST /api/user/coordinates` - Update user location coordinates
- `GET /api/user/nfts` - Get user's NFTs

### Itineraries (`/api/itineraries/*`)
- `GET /api/itineraries` - Get all published itineraries
- `POST /api/itineraries` - Create new itinerary (admin)
- `GET /api/itineraries/[id]` - Get itinerary by ID
- `PUT /api/itineraries/[id]` - Update itinerary
- `DELETE /api/itineraries/[id]` - Delete itinerary

### Bookings (`/api/bookings/*`)
- `GET /api/bookings` - Get user's bookings
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/all` - Get all bookings (admin)
- `GET /api/bookings/[id]` - Get booking by ID
- `PUT /api/bookings/[id]` - Update booking status

### Travel Matching (`/api/*`)
- `POST /api/destination-matches` - Find matches by destination
- `GET /api/destination-matches` - Get matches for user's travel plan
- `POST /api/nearby-people` - Find nearby travelers
- `GET /api/people/nearby` - Get nearby people (with auth)
- `POST /api/people/search` - Search for people by destination

### Tasks & NFTs (`/api/*`)
- `GET /api/tasks` - Get user's tasks
- `POST /api/complete-task` - Mark task as completed
- `GET /api/nfts` - Get NFTs by owner address
- `POST /api/nfts` - Create NFT record

### Payments (`/api/razorpay/*`)
- `POST /api/razorpay/create-order` - Create Razorpay order
- `POST /api/razorpay/verify-payment` - Verify payment signature
- `POST /api/razorpay/webhook` - Handle Razorpay webhooks

### AI & Utilities (`/api/*`)
- `POST /api/generate-response` - Generate AI response (Gantavya)
- `POST /api/upload-image` - Upload image to Cloudinary
- `GET /api/destinations/search` - Search destinations

---

## User Stories

### Story 1: New User Registration & Onboarding
**As a** new traveler  
**I want to** create an account and set up my profile  
**So that** I can start using TravelBuddy to plan my trips

**Acceptance Criteria:**
- User can sign up with email and password
- System creates account and marks as new user
- User is redirected to profile setup page
- User can add personal information, interests, and travel preferences
- Profile image can be uploaded via Cloudinary
- User receives verification email

### Story 2: AI Travel Assistant Consultation
**As a** traveler planning a trip to India  
**I want to** chat with Gantavya AI assistant  
**So that** I can get personalized recommendations and travel tips

**Acceptance Criteria:**
- User can access chatbot page
- AI responds with India-specific travel information
- Responses are contextual and helpful
- User can ask about destinations, cuisine, culture, and itineraries
- Chat history is maintained during session

### Story 3: Finding Travel Companions by Destination
**As a** solo traveler  
**I want to** find other travelers going to the same destination  
**So that** I can share costs and have company during my trip

**Acceptance Criteria:**
- User can search by destination, dates, and budget
- System geocodes destination and finds matches within 100km
- Matches show overlapping dates and compatible budgets
- User can view matched travelers' profiles
- User can see distance and travel plan details

### Story 4: Finding Nearby Travelers
**As a** traveler currently on a trip  
**I want to** find other travelers nearby  
**So that** I can meet up and explore together

**Acceptance Criteria:**
- User can share their current location (GPS coordinates)
- System finds travelers within proximity
- Results are sorted by distance
- User can view nearby travelers' profiles and interests
- Distance is displayed in kilometers

### Story 5: Booking a Travel Itinerary
**As a** traveler  
**I want to** browse and book travel itineraries  
**So that** I can have a structured travel plan

**Acceptance Criteria:**
- User can browse published itineraries
- User can view detailed itinerary information
- User can select dates and number of people
- User can make payment via Razorpay
- Booking confirmation is generated
- Booking status is tracked

### Story 6: Completing Travel Tasks for NFT Rewards
**As a** traveler  
**I want to** complete travel tasks and earn NFTs  
**So that** I can gamify my travel experience and collect digital souvenirs

**Acceptance Criteria:**
- User can view available travel tasks
- User can upload photos for task completion
- Tasks are marked as completed
- User can connect wallet (MetaMask)
- Completed tasks can be minted as NFTs on Polygon
- NFTs are stored with metadata on IPFS
- User can view their NFT collection

### Story 7: Profile Management
**As a** user  
**I want to** update my profile information  
**So that** other travelers can find me and know my preferences

**Acceptance Criteria:**
- User can edit personal information
- User can update travel preferences and interests
- User can change profile picture
- User can set message acceptance preferences
- Changes are saved to database
- Profile is visible to matched travelers

### Story 8: Password Reset
**As a** user who forgot password  
**I want to** reset my password securely  
**So that** I can regain access to my account

**Acceptance Criteria:**
- User can request password reset via email
- OTP is sent to registered email
- User can verify OTP
- User can set new password
- Password is securely hashed
- User can login with new password

### Story 9: Admin Itinerary Creation
**As an** admin  
**I want to** create and publish travel itineraries  
**So that** users can book them

**Acceptance Criteria:**
- Admin can access itinerary creation page
- Admin can add title, description, images
- Admin can set price, duration, location
- Admin can add highlights, inclusions, exclusions
- Admin can publish/unpublish itineraries
- Published itineraries appear in user browse page

### Story 10: Mobile App Experience
**As a** mobile user  
**I want to** use TravelBuddy on my phone  
**So that** I can access features while traveling

**Acceptance Criteria:**
- Mobile app provides authentication
- User can view profile and edit it
- User can search destinations
- User can find nearby travelers
- User can chat with AI assistant
- App uses same backend APIs

---

## Theoretical Details

### 1. Geospatial Matching Algorithm

The platform uses MongoDB's geospatial features for location-based matching:

**GeoJSON Format:**
- Coordinates stored as `[longitude, latitude]` (GeoJSON standard)
- 2dsphere index for efficient geospatial queries

**Matching Logic:**
```javascript
$geoNear: {
  near: { type: "Point", coordinates: [lng, lat] },
  distanceField: "distance",
  maxDistance: 100000, // 100km in meters
  spherical: true
}
```

**Budget Compatibility:**
- Matches users with budgets within ±30% range
- Formula: `budget * 0.7 <= matchedBudget <= budget * 1.3`

**Date Overlap:**
- User A's trip overlaps with User B if:
  - `A.fromDate <= B.toDate` AND `A.toDate >= B.fromDate`

### 2. AI Assistant Architecture

**System Prompt Design:**
- Specialized for Indian travel context
- Enforces topic boundaries (only India travel)
- Uses friendly, enthusiastic tone
- Includes emoji support

**API Integration:**
- OpenAI GPT-4o model
- Temperature: 0.7 (balanced creativity)
- Max tokens: 500 (concise responses)
- Error handling with fallback messages

**Response Flow:**
1. User sends message
2. System adds context (system prompt + user message)
3. OpenAI API generates response
4. Response formatted and displayed
5. Error handling for API failures

### 3. Blockchain Integration (NFT System)

**Network**: Polygon Amoy Testnet
- Chain ID: 0x13882
- RPC: https://rpc-amoy.polygon.technology
- Currency: MATIC

**Contract Details:**
- Address: `0xeC5e77aafbbe4EeE83aff84c3260f35716D83053`
- Standard: ERC-721 (NFT)
- Functions:
  - `mintNFT(address to, string tokenURI, string taskId)`
  - `getTaskId(uint256 tokenId)`
  - `balanceOf(address owner)`
  - `tokenURI(uint256 tokenId)`

**NFT Minting Flow:**
1. User completes travel task
2. Image uploaded to Cloudinary/IPFS
3. Metadata JSON created with task details
4. Metadata stored on IPFS (or as JSON string)
5. Smart contract `mintNFT` called
6. Transaction confirmed on blockchain
7. NFT record saved to MongoDB
8. User can view NFT in collection

**Metadata Structure:**
```json
{
  "name": "Travel Achievement: [taskId]",
  "description": "A travel achievement NFT...",
  "image": "ipfs://... or https://...",
  "attributes": [
    { "trait_type": "Task Type", "value": "taskId" },
    { "trait_type": "Date Earned", "value": "YYYY-MM-DD" }
  ]
}
```

### 4. Payment Processing

**Razorpay Integration:**
- Order creation via Razorpay API
- Payment verification using signatures
- Webhook support for payment status updates
- Amount stored in paise (INR * 100)

**Payment Flow:**
1. User initiates booking
2. Order created via `/api/razorpay/create-order`
3. Razorpay checkout opens
4. User completes payment
5. Payment verified via `/api/razorpay/verify-payment`
6. Booking status updated to "confirmed"
7. Webhook updates payment status (if configured)

**Security:**
- Payment signatures verified server-side
- Order IDs tracked in database
- Payment status synchronized

### 5. Authentication & Security

**NextAuth.js Configuration:**
- JWT-based sessions (stateless)
- Credentials provider (email/password)
- Session callbacks for user data
- Custom pages for sign-in/signout

**Password Security:**
- bcryptjs hashing (10 rounds)
- Passwords never stored in plain text
- Secure password reset via OTP

**Email Verification:**
- Verification tokens with expiration
- Email sent via Nodemailer
- Token verification on email click

**OTP System:**
- 6-digit OTP codes
- Stored in database with expiration
- Used for password reset and verification

### 6. Image Management

**Cloudinary Integration:**
- Image uploads via `/api/upload-image`
- Automatic optimization
- CDN delivery
- Supports multiple formats

**Use Cases:**
- Profile pictures
- Task completion photos
- Itinerary images
- NFT metadata images

### 7. Database Design Patterns

**Mongoose Models:**
- Schema validation
- Timestamps (createdAt, updatedAt)
- Indexes for performance (userId, coordinates)
- Virtual fields and methods

**Geospatial Indexes:**
- 2dsphere index on TravelPlan coordinates
- Enables efficient $geoNear queries

**Data Relationships:**
- User → TravelPlan (one-to-many)
- User → Booking (one-to-many)
- User → Task (one-to-many)
- User → NFT (one-to-many via ownerAddress)
- Itinerary → Booking (one-to-many)

---

## Key Components & Modules

### Frontend Components

**Layout Components:**
- `Header.tsx` - Navigation header
- `PageTransition.tsx` - Page transition animations
- `LoadingOverlay.tsx` - Loading states

**Feature Components:**
- `RevealText.tsx` - Animated text reveal
- `HomeImageSwiper.tsx` - Image carousel
- `FaqSection.tsx` - FAQ accordion
- `TaskCard.tsx` - Task display card
- `TaskManager.tsx` - Task management UI
- `RazorpayPayment.tsx` - Payment component
- `WalletConnect.tsx` - Web3 wallet connection
- `Toast.tsx` - Notification toasts
- `Spinner.tsx` - Loading spinner

### Library Modules (`/app/lib/`)

**auth.ts:**
- NextAuth configuration helpers
- Session management utilities

**dbConnect.ts:**
- MongoDB connection handler
- Connection string management

**contract.ts:**
- Smart contract interaction
- NFT minting functions
- Contract ABI definitions

**ipfs.ts:**
- IPFS client configuration
- Metadata upload functions

**cloudinary.ts:**
- Cloudinary client setup
- Image upload utilities

**mail.ts:**
- Nodemailer configuration
- Email sending functions

**wallet-context.tsx:**
- Web3 wallet context provider
- Wallet connection state management

**network-context.tsx:**
- Blockchain network configuration
- Network switching utilities

**utils.ts:**
- General utility functions
- Helper methods

---

## Integration Points

### 1. OpenAI API
- **Purpose**: Gantavya AI responses
- **Endpoint**: `https://api.openai.com/v1/chat/completions`
- **Authentication**: API key in environment variables
- **Rate Limiting**: Handled by OpenAI

### 2. MongoDB Atlas
- **Connection**: MongoDB Atlas cluster
- **Database**: Connection string in `dbConnect.ts`
- **Collections**: users, bookings, itineraries, tasks, nfts, travelplans, etc.

### 3. Cloudinary
- **Purpose**: Image storage and CDN
- **Configuration**: Environment variables
- **Features**: Auto-optimization, transformations

### 4. Razorpay
- **Purpose**: Payment processing
- **API**: REST API v1
- **Authentication**: Key ID and Secret
- **Webhooks**: Payment status updates

### 5. Polygon Blockchain
- **Network**: Polygon Amoy Testnet
- **Provider**: JSON-RPC provider
- **Wallet**: MetaMask integration
- **Contract**: ERC-721 NFT contract

### 6. IPFS
- **Purpose**: NFT metadata storage
- **Client**: IPFS HTTP Client
- **Gateway**: Public IPFS gateway for retrieval

### 7. Email Service (Nodemailer)
- **Purpose**: Transactional emails
- **SMTP**: Gmail or custom SMTP
- **Emails**: Verification, password reset, OTP

---

## Mobile Application

### Structure
Located in `TravelBuddyMobile/` directory

### Key Features
- Authentication (login/signup)
- Profile management
- Destination search
- Nearby travelers
- AI chatbot
- Home screen with navigation

### Technology
- React Native with Expo
- TypeScript
- React Navigation
- Context API for state

### API Integration
- Uses same backend APIs
- Mobile-specific endpoints:
  - `/api/auth/mobile-signin`
  - `/api/auth/mobile-signup`
  - `/api/user/mobile-profile`

### Navigation Structure
- Auth Navigator (login/signup)
- Main Tab Navigator (home, profile, search, chat)

---

## Web3 & Blockchain Integration

### Wallet Connection
- MetaMask integration
- Wallet context provider
- Network switching (Polygon Amoy)
- Account management

### NFT Minting Process
1. User completes task
2. Image uploaded to Cloudinary/IPFS
3. Metadata JSON created
4. Smart contract interaction via Ethers.js
5. Transaction signed and broadcast
6. NFT minted on blockchain
7. Token ID and metadata stored in database

### Contract Interaction
- Contract address: `0xeC5e77aafbbe4EeE83aff84c3260f35716D83053`
- Functions: `mintNFT`, `getTaskId`, `balanceOf`, `tokenURI`
- Events: `NFTMinted`, `Transfer`

### Network Configuration
- Chain ID: 0x13882 (Polygon Amoy)
- RPC URL: https://rpc-amoy.polygon.technology
- Block Explorer: https://amoy.polygonscan.com

---

## Payment System

### Razorpay Integration
- Order creation
- Payment verification
- Webhook handling
- Status tracking

### Booking Flow
1. User selects itinerary
2. Fills booking form (dates, people)
3. Order created via Razorpay
4. Payment processed
5. Payment verified
6. Booking confirmed
7. Confirmation page displayed

### Payment States
- `pending`: Order created, payment not completed
- `completed`: Payment successful
- `failed`: Payment failed

### Booking States
- `pending`: Awaiting confirmation
- `confirmed`: Booking confirmed
- `cancelled`: Booking cancelled
- `completed`: Trip completed

---

## Security & Authentication

### Authentication Flow
1. User provides email/password
2. Credentials validated
3. Password hashed with bcrypt
4. JWT token created
5. Session established
6. User data in session

### Password Security
- bcrypt hashing (10 salt rounds)
- Never stored in plain text
- Secure comparison for login

### Email Verification
- Token-based verification
- Expiration handling
- One-time use tokens

### OTP System
- 6-digit codes
- Time-limited validity
- Secure storage

### API Security
- Session-based authentication
- Protected routes
- User authorization checks
- Input validation

---

## Deployment & Configuration

### Environment Variables Required

```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# AI
OPENAI_API_KEY=your-openai-key

# Payment
RAZORPAY_KEY_ID=your-key-id
RAZORPAY_SECRET=your-secret

# Blockchain
NFT_CONTRACT_ADDRESS=0x...
PRIVATE_KEY=your-private-key
RPC_URL=https://rpc-amoy.polygon.technology

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Build & Run

**Development:**
```bash
npm run dev
# or
npm run dev:external  # For external network access
```

**Production:**
```bash
npm run build
npm start
# or
npm run start:external
```

### Database Setup
- MongoDB Atlas cluster required
- Collections created automatically on first use
- Indexes created via Mongoose schemas

### Blockchain Setup
- Deploy NFT contract to Polygon Amoy
- Update contract address in `contract.ts`
- Configure RPC URL
- Set up wallet with private key (for server-side minting)

---

## Future Enhancements

### Potential Features
1. **Real-time Chat**: WebSocket integration for traveler messaging
2. **Reviews & Ratings**: User reviews for itineraries and travel companions
3. **Group Bookings**: Support for group travel bookings
4. **Travel Blog**: User-generated travel content
5. **Social Features**: Follow travelers, share experiences
6. **Advanced Matching**: ML-based compatibility scoring
7. **Offline Support**: PWA features for offline access
8. **Multi-language**: Support for multiple languages
9. **Travel Insurance**: Integration with insurance providers
10. **Loyalty Program**: Points and rewards system

### Technical Improvements
1. **Caching**: Redis for session and data caching
2. **CDN**: Enhanced CDN for static assets
3. **Monitoring**: Application performance monitoring
4. **Testing**: Comprehensive test suite
5. **Documentation**: API documentation (Swagger/OpenAPI)
6. **CI/CD**: Automated deployment pipeline
7. **Error Tracking**: Sentry or similar error tracking
8. **Analytics**: User behavior analytics

### Blockchain Enhancements
1. **Mainnet Deployment**: Move to Polygon mainnet
2. **NFT Marketplace**: Trade travel NFTs
3. **Token Rewards**: ERC-20 token rewards
4. **DAO Governance**: Community governance for platform
5. **Soulbound Tokens**: Non-transferable achievement NFTs

---

## Conclusion

TravelBuddy is a comprehensive travel platform combining traditional web features with modern blockchain technology. The system is designed to be scalable, secure, and user-friendly, with a focus on the Indian travel market.

### Key Strengths
- Comprehensive feature set
- Modern tech stack
- Blockchain integration
- AI-powered assistance
- Mobile support

### Areas for Growth
- Enhanced social features
- Advanced matching algorithms
- Mainnet blockchain deployment
- Expanded payment options
- Multi-language support

This document serves as a complete knowledge transfer resource for understanding, maintaining, and extending the TravelBuddy platform.

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Maintained By**: Development Team

