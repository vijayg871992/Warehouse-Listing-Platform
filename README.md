# Warehouse Listing Platform
A full-stack application for listing, managing, and approving warehouse properties. Built with React, Node.js, Express, and MySQL, featuring JWT/Google OAuth authentication, multi-image uploads, and admin approval workflows.

**Live at**: [vijayg.dev/warehouse-listing](https://vijayg.dev/warehouse-listing)

## 🎯 Live Demo

- 🌐 **Production URL**: [https://vijayg.dev/warehouse-listing](https://vijayg.dev/warehouse-listing)
- 📱 **Features**: Property listing, search filters, admin approval, image uploads
- 🔧 **API Endpoint**: `https://vijayg.dev/warehouse-listing/api`


## Overview

Warehouse Listing Platform is a comprehensive B2B solution for warehouse property management, designed for property owners to list their warehouses and for businesses to find suitable storage facilities.

### Key Features

- **Multi-Authentication**: Email/Password login with JWT and Google OAuth 2.0
- **Property Management**: Complete CRUD operations for warehouse listings
- **Admin Approval System**: Two-tier approval workflow for quality control
- **Advanced Search**: Location-based filtering with multiple parameters
- **Image Management**: Multi-image upload with Multer integration
- **Email Notifications**: Automated emails for approvals and updates
- **Security-First**: Rate limiting, input validation, XSS protection
- **Responsive Design**: Mobile-first approach with Tailwind CSS

### Technical Stack

| Component | Technology | 
|-----------|------------|
| Frontend | React |
| Backend | Node.js + Express |
| Database | MySQL + Sequelize | 
| Authentication | Passport.js + JWT |
| Styling | Tailwind CSS |
| Build Tool | Vite | 6.0.5 |
| Email Service | Nodemailer | 
| Process Management | PM2 |

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐   │
│  │  Listings   │  │   Search    │  │   Admin     │  │  Profile  │   │
│  │    View     │  │   Filters   │  │  Dashboard  │  │   Page    │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                │
                         ┌──────┴───────┐
                         │   Nginx      │
                         │ Reverse Proxy│
                         └──────┬───────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐   │
│  │    Auth     │  │  Warehouse  │  │    Admin    │  │   Upload  │   │
│  │ Controller  │  │ Controller  │  │ Controller  │  │  Service  │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘   │
└─────────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐   │
│  │    Users    │  │ Warehouses  │  │   Images    │  │  Sessions │   │
│  │    Table    │  │    Table    │  │    Table    │  │   Table   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Authentication Flow

```
User Login Request → JWT Validation → Access Token → Protected Routes
                 ↓
          Google OAuth → Profile Sync → JWT Generation
```

## API Documentation

### Authentication Endpoints

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "securepassword"
}
```

#### Google OAuth
```http
GET /api/auth/google
```

### Warehouse Endpoints

#### List Public Warehouses
```http
GET /api/warehouses/public
```

#### Create Warehouse (Protected)
```http
POST /api/warehouses
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "name": "Premium Storage Facility",
  "location": "Mumbai",
  "size": "10000",
  "price": "50000",
  "description": "Modern warehouse with 24/7 security",
  "images": [files]
}
```

#### Admin Approval Actions
```http
# Approve warehouse
PUT /api/admin/warehouses/:id/approve
Authorization: Bearer <admin-token>

# Reject warehouse
PUT /api/admin/warehouses/:id/reject
Authorization: Bearer <admin-token>

# Get pending reviews
GET /api/admin/warehouses/pending
Authorization: Bearer <admin-token>
```

## Security Implementation

### Password Security
- **Hashing**: bcrypt with salt rounds of 10
- **Validation**: Minimum 8 characters with complexity requirements
- **Storage**: Never stored in plain text

### Token Security
- **JWT Tokens**: Signed with strong secret keys
- **Expiration**: 24-hour token lifetime
- **Refresh Tokens**: Stored securely in HttpOnly cookies, rotated regularly
- **Refresh Strategy**: Automatic token refresh on activity

### Data Protection
- **Input Validation**: Sanitize all user inputs
- **SQL Injection**: Parameterized queries with Sequelize
- **XSS Protection**: React's built-in protection + Helmet.js
- **CORS**: Configured for specific origins only
- **Rate Limiting**: API endpoint protection

## Installation & Setup

### Prerequisites
- Node.js 16.0 or higher
- MySQL 8.0 or higher
- npm or yarn package manager

### Local Development Setup

1. **Clone Repository**
```bash
git clone <repository-url>
cd Warehouse-Listing-Platform
```

2. **Install Dependencies**
```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

3. **Database Setup**
```bash
# Create database
mysql -u root -p -e "CREATE DATABASE warehouse_listing;"
```

4. **Environment Configuration**

Backend `.env`:
```env
PORT=8002
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=warehouse_listing
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:3000
```

5. **Run Development Servers**
```bash
# Backend
cd backend
npm run dev

# Frontend (new terminal)
cd frontend
npm run dev
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - Free to use, modify, and distribute.

## 🏷️ Keywords & Tags

`#warehouse` `#property-management` `#b2b` `#nodejs` `#express` `#mysql` `#react` `#jwt` `#oauth` `#sequelize` `#tailwindcss` `#production-ready` `#enterprise`

---

**⭐ Star this repository if you found it helpful!**
