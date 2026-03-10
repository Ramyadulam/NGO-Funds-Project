# NGO Fund Management - Backend API

A complete Node.js backend API for NGO fund management with MongoDB integration.

## 🚀 Features

- ✅ User Authentication (Register/Login with JWT)
- ✅ NGO Management (CRUD operations)
- ✅ Donation System with automatic amount tracking
- ✅ User Profiles
- ✅ Role-based Access Control (User/Admin)
- ✅ MongoDB Integration
- ✅ RESTful API design

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` file with your configurations:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ngo-fund-management
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

4. Start MongoDB (if running locally):
```bash
mongod
```

5. Run the server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |
| PUT | `/updatedetails` | Update user profile | Private |

### NGO Routes (`/api/ngos`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all NGOs (with filters) | Public |
| GET | `/:id` | Get single NGO | Public |
| POST | `/` | Create new NGO | Admin |
| PUT | `/:id` | Update NGO | Admin |
| DELETE | `/:id` | Delete NGO | Admin |
| GET | `/stats/overview` | Get NGO statistics | Public |

### Donation Routes (`/api/donations`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user's donations | Private |
| POST | `/` | Create donation | Private |
| GET | `/:id` | Get single donation | Private |
| GET | `/ngo/:ngoId` | Get donations for NGO | Public |
| GET | `/stats/me` | Get user donation stats | Private |
| GET | `/admin/all` | Get all donations | Admin |

## 📝 Request Examples

### Register User
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
```bash
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create NGO (Admin only)
```bash
POST /api/ngos
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "name": "Education for All",
  "description": "Providing quality education to underprivileged children",
  "category": "education",
  "location": "Mumbai, India",
  "targetAmount": 100000,
  "image": "https://example.com/image.jpg"
}
```

### Make Donation
```bash
POST /api/donations
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json

{
  "ngoId": "NGO_ID_HERE",
  "amount": 1000,
  "paymentMethod": "credit-card",
  "message": "Keep up the great work!",
  "isAnonymous": false
}
```

### Get NGOs with Filters
```bash
GET /api/ngos?category=education&search=children
```

## 🗄️ Database Models

### User
- name, email, password (hashed)
- role (user/admin)
- timestamps

### NGO
- name, description, category
- location, targetAmount, raisedAmount
- image, isActive
- createdBy (reference to User)
- timestamps

### Donation
- amount, paymentMethod, paymentStatus
- ngo (reference to NGO)
- donor (reference to User)
- message, isAnonymous, transactionId
- timestamps

## 🔒 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🎯 Categories

Available NGO categories:
- `education`
- `healthcare`
- `environment`
- `poverty`
- `animal-welfare`
- `disaster-relief`
- `other`

## ✨ Features

### Automatic Amount Tracking
When a donation is made, the NGO's `raisedAmount` is automatically updated.

### Anonymous Donations
Users can choose to make anonymous donations. The donor's name will be hidden from public donation lists.

### Role-Based Access
- **Users**: Can donate, view NGOs, manage their profile
- **Admins**: Can create/update/delete NGOs, view all donations

### Input Validation
All inputs are validated for type, format, and required fields.

### Error Handling
Centralized error handling with meaningful error messages.

## 🧪 Testing

Use tools like Postman or Thunder Client to test the API endpoints.

## 📦 Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ODM
- **bcryptjs**: Password hashing
- **jsonwebtoken**: JWT authentication
- **dotenv**: Environment variables
- **cors**: CORS middleware
- **express-validator**: Input validation

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production` in environment variables
2. Use a secure `JWT_SECRET`
3. Use MongoDB Atlas for database
4. Enable HTTPS
5. Set up proper error logging
6. Configure CORS for your frontend domain

## 👨‍💻 Development

Install nodemon for auto-restart during development:
```bash
npm install -D nodemon
npm run dev
```

## 📄 License

This project is for educational purposes.
