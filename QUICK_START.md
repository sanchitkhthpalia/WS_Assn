# 🚀 Quick Start Guide

Get the clinic booking app running in 5 minutes!

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## 🎯 Quick Setup

### 1. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Setup environment and database (creates .env, runs migrations, seeds data)
npm run setup

# Start the server
npm run dev
```

The server will be running on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Open a new terminal and navigate to client directory
cd client

# Install dependencies
npm install

# Start the frontend
npm start
```

The frontend will be running on `http://localhost:3000`

## 🧪 Test the App

### Test Credentials
- **Patient**: `patient@example.com` / `Passw0rd!`
- **Admin**: `admin@example.com` / `Passw0rd!`

### Quick Test Steps

1. **Open** `http://localhost:3000` in your browser
2. **Login** as admin using the credentials above
3. **View** all bookings in the admin dashboard
4. **Logout** and **register** a new patient account
5. **Login** as the new patient
6. **Book** an available slot
7. **View** your bookings

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**:
   - Change the port in `server/index.js` (line 58) or `client/package.json` scripts

2. **Database errors**:
   - Run `npm run db:migrate` in the server directory
   - Run `npm run db:seed` to recreate test data

3. **Environment file missing**:
   - Run `node setup-env.js` in the server directory
   - Or manually create `.env` file with the content from the README

4. **CORS errors**:
   - Ensure the frontend is running on `http://localhost:3000`
   - Check the CORS configuration in `server/index.js`

## 📞 Support

If you encounter any issues:
1. Check the console for error messages
2. Ensure all dependencies are installed
3. Verify the environment file exists
4. Check that both servers are running

## 🎉 Success!

Once everything is running, you should see:
- ✅ Backend API responding at `http://localhost:5000`
- ✅ Frontend app loading at `http://localhost:3000`
- ✅ Ability to register/login users
- ✅ Ability to view and book slots
- ✅ Admin dashboard showing all bookings
