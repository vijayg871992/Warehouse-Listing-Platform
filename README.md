# LogiSpace Network — Secure B2B Property Management

A full-stack application for listing, managing, and approving warehouse properties. Built with React, Node.js, Express, and MySQL, featuring JWT/Google OAuth authentication, multi-image uploads, and admin approval workflows.

**Live at**: [vijayg.dev/warehouse-listing](https://vijayg.dev/warehouse-listing)

## 🎯 Live Demo

- 🌐 **Production URL**: [https://vijayg.dev/warehouse-listing](https://vijayg.dev/warehouse-listing)
- 👤 **Demo Access**: Demo login available on request (seeded account with reset schedule)
- 📱 **Features**: Property listing, search filters, admin approval, image uploads
- 🔧 **API Endpoint**: `https://vijayg.dev/warehouse-listing/api`

### Quick API Test
```bash
# Test health endpoint
curl https://vijayg.dev/warehouse-listing/api/health

# Get public warehouses
curl https://vijayg.dev/warehouse-listing/api/warehouses/public
```

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Security Implementation](#security-implementation)
- [Installation & Setup](#installation--setup)
- [Production Deployment](#production-deployment)
- [Areas for Improvement](#areas-for-improvement)

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

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend | React | 18.3.1 |
| Backend | Node.js + Express | Latest |
| Database | MySQL + Sequelize | 8.0+ |
| Authentication | Passport.js + JWT | Latest |
| Styling | Tailwind CSS | 3.4.17 |
| Build Tool | Vite | 6.0.5 |
| Email Service | Nodemailer | 6.9.16 |
| Process Management | PM2 | Latest |

## Architecture

### High-Level Design

```
┌─────────────────────────────────────────────────────────────────────┐
│                      PRESENTATION LAYER                             │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │  Listings   │  │   Search    │  │   Admin     │  │  Profile  │ │
│  │    View     │  │   Filters   │  │  Dashboard  │  │   Page    │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
                         ┌──────┴──────┐
                         │   Nginx     │
                         │ Reverse Proxy│
                         └──────┬──────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                         API LAYER                                   │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │    Auth     │  │  Warehouse  │  │    Admin    │  │   Upload  │ │
│  │ Controller  │  │ Controller  │  │ Controller  │  │  Service  │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────────────────┘
                                │
┌─────────────────────────────────────────────────────────────────────┐
│                       DATABASE LAYER                                │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌───────────┐ │
│  │    Users    │  │ Warehouses  │  │   Images    │  │  Sessions │ │
│  │    Table    │  │    Table    │  │    Table    │  │   Table   │ │
│  └─────────────┘  └─────────────┘  └─────────────┘  └───────────┘ │
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

## Database Schema

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255),
  isAdmin BOOLEAN DEFAULT FALSE,
  googleId VARCHAR(255),
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Warehouses Table
```sql
CREATE TABLE warehouses (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255) NOT NULL,
  size BIGINT NOT NULL COMMENT 'Size in square feet',
  price DECIMAL(10, 2) NOT NULL,
  description TEXT,
  isApproved BOOLEAN DEFAULT FALSE,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

### Images Table
```sql
CREATE TABLE warehouse_images (
  id INT PRIMARY KEY AUTO_INCREMENT,
  warehouseId INT NOT NULL,
  imageUrl VARCHAR(500) NOT NULL,
  isPrimary BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (warehouseId) REFERENCES warehouses(id) ON DELETE CASCADE
);
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

## Production Deployment

### PM2 Configuration
```javascript
module.exports = {
  apps: [{
    name: 'warehouse-listing',
    script: 'server.js',
    cwd: '/var/www/vijayg.dev/projects/Warehouse-Listing-Platform/backend',
    env: {
      NODE_ENV: 'production',
      PORT: 8002
    }
  }]
};
```

### Nginx Configuration
```nginx
# SPA routing fix
location /warehouse-listing/ {
    alias /var/www/vijayg.dev/projects/Warehouse-Listing-Platform/frontend-dist/;
    try_files $uri $uri/ /index.html;
}

location /warehouse-listing/api {
    proxy_pass http://127.0.0.1:8002;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
}
```

### Build Commands
```bash
# Frontend build with environment
cd frontend
VITE_API_URL=https://vijayg.dev/warehouse-listing/api npm run build

# Copy to production directory (dist folder from Vite)
cp -r dist/* ../frontend-dist/

# Start backend with PM2
pm2 start ecosystem.config.js
pm2 save
```

## Areas for Improvement

### Planned Enhancements
- Advanced analytics dashboard
- Real-time notifications with WebSockets  
- Mobile application development
- Intelligent property recommendations
- Integration with mapping services (Google Maps/MapBox)
- Multi-language support
- Advanced reporting and export features

### Technical Debt
- Implement comprehensive test coverage
- Add API documentation with Swagger
- Optimize database queries with indexing
- Implement caching with Redis
- Add monitoring and logging aggregation
- Enhance error handling and recovery

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