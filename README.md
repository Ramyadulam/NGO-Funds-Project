# Blockchain NGO Fund Management Platform

A full-stack web application for transparent and accountable NGO fund management, built with Next.js and Express.js with MongoDB backend.

![NGO Fund Management](https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800)

## 🚀 Features

### For Donors
- ✅ Browse and search verified NGOs by category
- ✅ Make secure donations with transaction tracking
- ✅ View personal donation history and statistics
- ✅ Real-time funding progress tracking
- ✅ Transaction IDs for transparency

### For Administrators
- ✅ Full NGO management (Create, Read, Update, Delete)
- ✅ View all platform donations
- ✅ Platform statistics dashboard
- ✅ Role-based access control

### Technical Features
- ✅ JWT Authentication (Register/Login)
- ✅ MongoDB database integration
- ✅ RESTful API design
- ✅ Responsive UI with Tailwind CSS
- ✅ Modern React with Next.js 16
- ✅ TypeScript for type safety

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## 🛠️ Installation

### 1. Clone and Install

```bash
# Navigate to project directory
cd blockchain-ngo-fund-management

# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment

```bash
# Backend configuration
cd backend
cp .env.example .env
```

Edit `backend/.env` with your settings:
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/ngo-fund-management
JWT_SECRET=your_secure_secret_key
JWT_EXPIRE=7d
NODE_ENV=development
```

### 3. Start MongoDB

```bash
# If running locally
mongod
```

### 4. Seed Database (Optional but Recommended)

```bash
cd backend
node seed.js
```

This creates sample data including:
- Admin user: `admin@ngo.com` / `admin123`
- Regular users: `john@example.com`, `jane@example.com`, `bob@example.com` (all with password: `password123`)
- 8 sample NGOs with various categories
- Sample donations

### 5. Run the Application

```bash
# Terminal 1: Start Backend
cd backend
npm start

# Terminal 2: Start Frontend
cd blockchain-ngo-fund-management
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
blockchain-ngo-fund-management/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard
│   ├── dashboard/         # NGO browsing & donation
│   ├── donate/            # Donation page
│   ├── login/             # Login page
│   ├── my-donations/      # User donation history
│   ├── ngo/[id]/          # Individual NGO details
│   ├── register/          # Registration page
│   ├── api/               # Next.js API routes
│   ├── page.tsx           # Landing page
│   └── layout.tsx         # Root layout
├── backend/               # Express.js API
│   ├── config/            # Database configuration
│   ├── controllers/       # Route handlers
│   ├── middleware/        # Auth & error handling
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── seed.js            # Database seeder
│   └── index.js           # Server entry point
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── navbar.tsx         # Navigation component
└── lib/                   # Utilities
    ├── api.ts             # API client functions
    ├── mock-data.ts       # Sample data
    └── utils.ts           # Helper functions
```

## 🔗 API Endpoints

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login user | Public |
| GET | `/me` | Get current user | Private |

### NGOs (`/api/ngos`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get all NGOs | Public |
| GET | `/:id` | Get single NGO | Public |
| POST | `/` | Create new NGO | Admin |
| PUT | `/:id` | Update NGO | Admin |
| DELETE | `/:id` | Delete NGO | Admin |
| GET | `/stats/overview` | Get statistics | Public |

### Donations (`/api/donations`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get user's donations | Private |
| POST | `/` | Create donation | Private |
| GET | `/ngo/:ngoId` | Get NGO donations | Public |
| GET | `/stats/me` | Get user stats | Private |
| GET | `/admin/all` | Get all donations | Admin |

## 🎨 UI Components

Built with [shadcn/ui](https://ui.shadcn.com/):
- Button, Card, Dialog, Input, Label
- Badge, Progress, Select, Tabs
- Table, Textarea, and more

## 🔒 Authentication

The application uses JWT tokens stored in localStorage:
- Tokens are included in API requests via `Authorization: Bearer <token>`
- User session persists across browser sessions
- Role-based access (user/admin) for protected features

## 📊 Database Schema

### User
- name, email, password (hashed)
- role: 'user' | 'admin'
- timestamps

### NGO
- name, description, category
- location, targetAmount, raisedAmount
- image, isActive
- createdBy (User reference)
- timestamps

### Donation
- amount, ngo (NGO reference)
- donor (User reference)
- paymentMethod, paymentStatus
- message, isAnonymous
- transactionId
- timestamps

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy

### Backend (Render/Railway/Heroku)
1. Set environment variables
2. Configure MongoDB Atlas connection
3. Deploy

## 🧪 Testing

Use Postman collection located at:
```
backend/NGO-Fund-Management.postman_collection.json
```

## 🛡️ Security Features

- Password hashing with bcrypt
- JWT token authentication
- Role-based access control
- Input validation
- CORS configuration

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Built as a full-stack ML project demonstrating:
- Modern web development with Next.js
- RESTful API design with Express.js
- MongoDB database integration
- Authentication & Authorization
- Responsive UI design
