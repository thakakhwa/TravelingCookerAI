# TravelCooker Backend API

A Node.js/Express backend with PostgreSQL database for user authentication and chat history management.

## Features

- 🔐 JWT-based authentication
- 👤 User registration and login
- 💬 Chat session management
- 📝 Chat message storage
- 🛡️ Password hashing with bcrypt
- 🗃️ PostgreSQL database with Prisma ORM
- 🔒 Rate limiting and security middleware

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v13 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Database Setup
Make sure PostgreSQL is running, then create a database:
```sql
CREATE DATABASE travelcooker_db;
CREATE USER travelcooker WITH PASSWORD 'password123';
GRANT ALL PRIVILEGES ON DATABASE travelcooker_db TO travelcooker;
```

### 3. Environment Configuration
Copy the example environment file and configure it:
```bash
cp .env.example .env
```

Update the `.env` file with your database credentials:
```env
DATABASE_URL="postgresql://travelcooker:password123@localhost:5432/travelcooker_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
PORT=5000
NODE_ENV=development
FRONTEND_URL="http://localhost:5173"
```

### 4. Database Migration
Run Prisma migrations to set up the database schema:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Start the Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The API will be available at `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/logout` - User logout

### Chat Management
- `GET /api/chat/sessions` - Get user's chat sessions
- `POST /api/chat/sessions` - Create new chat session
- `GET /api/chat/sessions/:id` - Get specific chat session
- `POST /api/chat/sessions/:id/messages` - Add message to session
- `PATCH /api/chat/sessions/:id` - Update session title
- `DELETE /api/chat/sessions/:id` - Delete chat session

### User Management
- `GET /api/user/profile` - Get user profile
- `PATCH /api/user/profile` - Update user profile
- `PATCH /api/user/password` - Change password
- `DELETE /api/user/account` - Delete user account

## Database Schema

### Users
- `id` - Unique identifier
- `email` - User email (unique)
- `username` - Username (unique)
- `password` - Hashed password
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Chat Sessions
- `id` - Unique identifier
- `title` - Session title
- `userId` - Foreign key to User
- `createdAt` - Creation timestamp
- `updatedAt` - Last update timestamp

### Chat Messages
- `id` - Unique identifier
- `content` - Message content
- `sender` - 'user' or 'ai'
- `sessionId` - Foreign key to Chat Session
- `createdAt` - Creation timestamp

## Development

### View Database
```bash
npx prisma studio
```

### Reset Database
```bash
npx prisma migrate reset
```

### Generate Prisma Client
```bash
npx prisma generate
```

## Security Features

- JWT token authentication
- Password hashing with bcrypt (12 rounds)
- Rate limiting (100 requests per 15 minutes)
- CORS protection
- Helmet security headers
- Input validation with express-validator

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT tokens | Required |
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment mode | development |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 | 