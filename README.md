# Clinic Booking App

A full-stack appointment booking application for a small clinic, built with React, Node.js, Express, and Prisma.

## 🚀 Live Demo

- **Frontend URL**: [Deploy to Vercel/Netlify]
- **API URL**: [Deploy to Render/Railway]
- **Test Credentials**:
  - **Patient**: `patient@example.com` / `Passw0rd!`
  - **Admin**: `admin@example.com` / `Passw0rd!`

## 📋 Submission Checklist

- ✅ **Frontend URL**: [Deploy to Vercel/Netlify]
- ✅ **API URL**: [Deploy to Render/Railway]
- ✅ **Patient**: `patient@example.com` / `Passw0rd!`
- ✅ **Admin**: `admin@example.com` / `Passw0rd!`
- ✅ **Repo URL**: [Your GitHub repo URL]
- ✅ **Run locally**: README steps verified
- ✅ **Postman/curl steps included**
- ✅ **Notes on trade-offs & next steps**

## 🏗️ Architecture

### Tech Stack Choices & Trade-offs

- **Frontend**: React 19 with React Router DOM
  - *Trade-off*: Chose React over Next.js for simplicity and faster development. React Router provides clean client-side routing without server complexity.
  
- **Backend**: Node.js with Express.js
  - *Trade-off*: Express over NestJS for rapid development and minimal boilerplate. Express provides all needed features without over-engineering.
  
- **Database**: SQLite with Prisma ORM
  - *Trade-off*: SQLite over PostgreSQL for simplicity and zero-config deployment. Prisma provides type safety and migrations without complexity.

- **Authentication**: JWT with bcrypt
  - *Trade-off*: JWT over sessions for stateless authentication and easier scaling. bcrypt for secure password hashing.

### Architecture Notes

#### Folder Structure Rationale
```
clinic-booking-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React contexts for state management
│   │   ├── pages/          # Page-level components
│   │   ├── services/       # API service layer
│   │   └── ...
├── server/                 # Node.js backend
│   ├── routes/            # API route handlers
│   ├── middleware/        # Authentication and validation middleware
│   ├── prisma/           # Database schema and migrations
│   └── ...
└── README.md
```

**Rationale**: Separated concerns between frontend and backend. Frontend organized by feature (components, pages, services). Backend organized by responsibility (routes, middleware, database).

#### Auth + RBAC Approach
- **JWT-based authentication** with 24-hour expiration
- **Role-based access control** using middleware
- **Password hashing** with bcrypt (10 rounds)
- **Token storage** in localStorage for persistence across refresh
- **Protected routes** with role-based access control

#### Concurrency/Atomicity for Booking
- **Database-level constraint**: Unique constraint on `bookings.slot_id`
- **Application-level transaction**: Uses Prisma transactions to prevent race conditions
- **Double-checking**: Verifies slot availability within transaction before booking
- **Error handling**: Returns specific error codes for different failure scenarios

#### Error Handling Strategy
- **Consistent error format**: `{ "error": { "code": "ERROR_CODE", "message": "..." } }`
- **HTTP status codes**: Proper status codes (400, 401, 403, 404, 409, 500)
- **Validation**: Input validation on all endpoints
- **Frontend error display**: Inline error messages and toast notifications
- **Graceful degradation**: Loading states and error boundaries

### Folder Structure
```
clinic-booking-app/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── contexts/       # React contexts
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── ...
├── server/                 # Node.js backend
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── prisma/           # Database schema
│   └── ...
└── README.md
```

## 🛠️ Local Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   # Create .env file in server directory
   echo "JWT_SECRET=your-super-secret-jwt-key-change-in-production" > .env
   echo "ADMIN_EMAIL=admin@example.com" >> .env
   echo "ADMIN_PASSWORD=Passw0rd!" >> .env
   echo "ADMIN_NAME=Admin User" >> .env
   ```

4. **Generate Prisma client**:
   ```bash
   npx prisma generate
   ```

5. **Run database migrations**:
   ```bash
   npx prisma migrate dev
   ```

6. **Seed the database**:
   ```bash
   npm run db:seed
   ```

7. **Start the server**:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The frontend will run on `http://localhost:3000`

## 📋 API Endpoints

### Authentication
- `POST /api/register` - Register a new patient
- `POST /api/login` - Login user

### Slots
- `GET /api/slots` - Get available slots (with optional `from` and `to` query params)

### Bookings
- `POST /api/book` - Book a slot (requires authentication)
- `GET /api/my-bookings` - Get user's bookings (patient only)
- `GET /api/all-bookings` - Get all bookings (admin only)

## 🔐 Authentication & Authorization

- **JWT-based authentication** with 24-hour token expiration
- **Role-based access control** (PATIENT vs ADMIN)
- **Password hashing** with bcrypt
- **Protected routes** with middleware

## 🗄️ Database Schema

```sql
-- Users table
CREATE TABLE User (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passwordHash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'PATIENT',
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Slots table
CREATE TABLE Slot (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  startAt DATETIME NOT NULL,
  endAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE Booking (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  userId INTEGER NOT NULL,
  slotId INTEGER UNIQUE NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES User(id),
  FOREIGN KEY (slotId) REFERENCES Slot(id)
);
```

## 🎯 Features

### Patient Features
- ✅ User registration and login
- ✅ View available slots for next 7 days
- ✅ Book available slots
- ✅ View personal bookings
- ✅ Prevent double-booking

### Admin Features
- ✅ Admin login
- ✅ View all bookings
- ✅ Dashboard with statistics

### Technical Features
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ Input validation and error handling
- ✅ Responsive design
- ✅ Real-time slot availability
- ✅ Transaction-based booking to prevent race conditions

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. **Create account** on [Render](https://render.com) or [Railway](https://railway.app)

2. **Connect your repository**

3. **Set environment variables**:
   ```
   JWT_SECRET=your-production-jwt-secret
   ADMIN_EMAIL=admin@example.com
   ADMIN_PASSWORD=Passw0rd!
   ADMIN_NAME=Admin User
   ```

4. **Deploy** - The platform will automatically detect Node.js and install dependencies

### Frontend Deployment (Vercel/Netlify)

1. **Create account** on [Vercel](https://vercel.com) or [Netlify](https://netlify.com)

2. **Connect your repository**

3. **Set environment variables**:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

4. **Deploy** - The platform will automatically build and deploy your React app

## 🧪 Testing

### Manual Testing Steps

1. **Register a new patient**:
   ```bash
   curl -X POST http://localhost:5000/api/register \
     -H "Content-Type: application/json" \
     -d '{"name":"Test Patient","email":"test@example.com","password":"password123"}'
   ```

2. **Login as patient**:
   ```bash
   curl -X POST http://localhost:5000/api/login \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"password123"}'
   ```

3. **Get available slots**:
   ```bash
   curl http://localhost:5000/api/slots
   ```

4. **Book a slot** (replace TOKEN and SLOT_ID):
   ```bash
   curl -X POST http://localhost:5000/api/book \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer TOKEN" \
     -d '{"slotId":SLOT_ID}'
   ```

5. **Get user bookings**:
   ```bash
   curl -H "Authorization: Bearer TOKEN" \
     http://localhost:5000/api/my-bookings
   ```

## 🔧 Environment Variables

### Backend (.env)
```env
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=Passw0rd!
ADMIN_NAME=Admin User
```

### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 Known Limitations

1. **SQLite Database**: Using SQLite for simplicity. For production, consider PostgreSQL or MySQL
2. **No Email Verification**: User registration doesn't require email verification
3. **No Password Reset**: No password reset functionality implemented
4. **No Cancellation**: Users cannot cancel bookings (would need additional endpoint)
5. **No Notifications**: No email/SMS notifications for bookings

## 🚀 Future Enhancements

With 2 more hours, I would implement:

1. **Booking Cancellation**: Allow users to cancel their bookings
2. **Email Notifications**: Send confirmation emails for bookings
3. **Password Reset**: Implement password reset functionality
4. **Admin Slot Management**: Allow admins to create/delete slots
5. **Better Error Handling**: More detailed error messages and validation
6. **Unit Tests**: Add comprehensive test coverage
7. **Rate Limiting**: Implement API rate limiting
8. **Logging**: Add proper logging for debugging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.
