# Warehouse Listing Platform - Real Estate Management System

A full-stack warehouse marketplace platform demonstrating expertise in building scalable B2B applications. This personal project showcases modern web development practices, complex state management, and enterprise-ready architecture using React, Node.js, and MySQL.

## 🚀 Features

### ✨ **Core Functionality**
- **Warehouse Listings**: Complete warehouse catalog with detailed specifications
- **Advanced Search**: Multi-criteria filtering with real-time results
- **User Management**: Role-based authentication for owners and tenants
- **Admin Dashboard**: Comprehensive analytics and management tools
- **Booking System**: Streamlined inquiry and booking process
- **Analytics Tracking**: Performance metrics and user engagement insights
- **Responsive Design**: Optimized experience across all devices

### 🏢 **Warehouse Management**
- **Detailed Profiles**: Comprehensive warehouse information and specifications
- **Image Gallery**: Multiple photo uploads with gallery management
- **Location Services**: Geographic mapping and location-based search
- **Availability Calendar**: Real-time availability and scheduling
- **Pricing Management**: Flexible pricing models and rate structures
- **Performance Analytics**: Views, inquiries, and engagement tracking

## 🏗️ **System Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React 18)                     │
│  • Vite • React Router • Tailwind CSS • Context API       │
│  • Advanced UI Components • Real-time Updates             │
└─────────────────┬───────────────────────────────────────────┘
                  │ RESTful API Calls
┌─────────────────▼───────────────────────────────────────────┐
│                    BACKEND (Node.js)                       │
│  • Express.js • JWT Auth • Sequelize ORM                  │
│  • File Upload • Analytics • Logging System               │
└─────────────────┬───────────────────────────────────────────┘
                  │ SQL Queries
┌─────────────────▼───────────────────────────────────────────┐
│                    DATABASE (MySQL)                        │
│  • Users • Warehouses • Inquiries • Analytics             │
│  • Complete Relational Schema with Foreign Keys            │
└─────────────────────────────────────────────────────────────┘
```

## 🛠️ **Technology Stack**

### Frontend
- **React 18** - Modern UI framework with hooks and context
- **Vite** - Next-generation build tool for fast development
- **Tailwind CSS 3** - Utility-first CSS framework
- **React Router 6** - Client-side routing with protected routes
- **Context API** - State management solution

### Backend
- **Node.js 18** - Server-side JavaScript runtime
- **Express.js 4** - Web application framework
- **Sequelize 6** - Object-Relational Mapping for MySQL
- **JWT** - JSON Web Token authentication
- **Multer** - File upload handling
- **Winston** - Advanced logging system

### Database
- **MySQL 8** - Relational database management
- **Multiple Tables** - Users, Warehouses, Inquiries, Analytics
- **Foreign Key Relationships** - Data integrity and consistency

## 🚀 **Quick Start**

### Prerequisites
- Node.js 18+ 
- MySQL 8+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Warehouse-Listing-Platform
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   
   # Configure environment variables
   cp .env.example .env
   # Edit .env with your database credentials
   
   # Start the server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   
   # Start the development server
   npm run dev
   ```

4. **Database Setup**
   ```bash
   # Create database
   mysql -u root -p
   CREATE DATABASE warehouse_listing;
   
   # Run migrations and seeders
   cd backend
   npm run migrate
   npm run seed
   ```

### 🔐 **Default Login Credentials**
- **Admin**: admin@warehouse.com / admin123
- **Demo User**: demo@warehouse.com / demo123

## 📊 **Database Schema**

### Tables Overview
| Table | Purpose | Key Features |
|-------|---------|--------------|
| `users` | User management | Authentication, roles, profiles |
| `warehouses` | Warehouse listings | Details, images, specifications |
| `warehouse_analytics` | Performance tracking | Views, inquiries, engagement |
| `warehouse_approvals` | Admin approval system | Status management, reviews |
| `inquiries` | Customer inquiries | Contact management, follow-ups |

## 🔗 **API Endpoints**

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Warehouses  
- `GET /api/warehouses` - Get warehouses with filtering
- `GET /api/warehouses/:id` - Get warehouse details
- `POST /api/warehouses` - Create warehouse (Admin)
- `PUT /api/warehouses/:id` - Update warehouse (Admin)
- `DELETE /api/warehouses/:id` - Delete warehouse (Admin)

### Public Access
- `GET /api/public/warehouses` - Public warehouse listings
- `GET /api/public/warehouses/:id` - Public warehouse details
- `POST /api/public/inquiries` - Submit inquiry

### Admin Panel
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/warehouses` - Manage all warehouses
- `GET /api/admin/users` - User management
- `GET /api/admin/analytics` - Advanced analytics

## 🎯 **Key Features Showcase**

### 🔍 **Advanced Search System**
- **Multi-criteria Filtering**: Location, size, price, features
- **Real-time Results**: Instant search with live updates
- **Sort Options**: Price, size, rating, availability
- **Map Integration**: Geographic location visualization

### 📊 **Analytics Dashboard**
- **Performance Metrics**: Views, inquiries, conversion rates
- **User Engagement**: Interaction tracking and analysis
- **Revenue Insights**: Financial performance tracking
- **Trend Analysis**: Historical data and forecasting

### 🏪 **Warehouse Management**
- **Comprehensive Profiles**: Detailed specifications and amenities
- **Image Management**: Multiple photo upload with gallery
- **Availability Tracking**: Real-time availability status
- **Inquiry Management**: Lead tracking and follow-up system

### 🔒 **Security Features**
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Admin, owner, and tenant permissions
- **Input Validation**: Comprehensive server-side validation
- **File Upload Security**: Image validation and processing

## 📱 **User Interface**

### Public Portal
- **Warehouse Directory**: Comprehensive listing with search
- **Detailed Views**: Complete warehouse information
- **Inquiry System**: Easy contact and booking process
- **Mobile Responsive**: Optimized mobile experience

### Owner Dashboard
- **Listing Management**: Add, edit, and manage warehouses
- **Analytics Overview**: Performance metrics and insights
- **Inquiry Management**: Track and respond to inquiries
- **Profile Management**: Account and preference settings

### Admin Panel
- **System Overview**: Platform statistics and metrics
- **Content Management**: Approve and manage listings
- **User Administration**: Manage user accounts and roles
- **Analytics Dashboard**: Comprehensive reporting tools

## 🔧 **Configuration**

### Environment Variables (`.env`)
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_NAME=warehouse_listing
DB_USER=root
DB_PASSWORD=your_password

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=24h

# Server
PORT=8080
NODE_ENV=development

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=5MB

# Email Service (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## 🚦 **Development Workflow**

### Running in Development
```bash
# Backend (Port 8080)
cd backend && npm run dev

# Frontend (Port 5173)
cd frontend && npm run dev
```

### Building for Production
```bash
# Frontend build
cd frontend && npm run build

# Backend production
cd backend && npm start
```

## 📋 **User Flows**

### Tenant Journey
1. **Browse Listings** → Search and filter warehouses
2. **View Details** → Comprehensive warehouse information
3. **Submit Inquiry** → Contact warehouse owner
4. **Receive Response** → Communication management
5. **Schedule Visit** → Arrange warehouse viewing
6. **Complete Booking** → Finalize rental agreement

### Owner Workflow
1. **Create Account** → Register as warehouse owner
2. **Add Listings** → Upload warehouse details and images
3. **Manage Inquiries** → Respond to tenant inquiries
4. **Track Performance** → Monitor listing analytics
5. **Update Listings** → Maintain current information

### Admin Management
1. **Review Submissions** → Approve new warehouse listings
2. **Monitor Platform** → Track system performance
3. **Manage Users** → User account administration
4. **Analyze Data** → Generate insights and reports

## 🎨 **UI/UX Highlights**

### Design System
- **Modern Aesthetic**: Clean, professional design
- **Color Palette**: Consistent brand colors and themes
- **Typography**: Readable font hierarchy and spacing
- **Component Library**: Reusable UI components

### User Experience
- **Intuitive Navigation**: Clear menu structure and flow
- **Loading States**: Smooth transitions and feedback
- **Error Handling**: User-friendly error messages
- **Accessibility**: WCAG compliant design principles

## 📈 **Performance Features**

### Frontend Optimizations
- **Vite Build Tool**: Fast development and build processes
- **Code Splitting**: Lazy loading for optimal performance
- **Image Optimization**: Compressed and responsive images
- **Caching Strategy**: Efficient browser caching

### Backend Optimizations
- **Database Indexing**: Optimized queries with indexes
- **Connection Pooling**: Efficient database connections
- **API Caching**: Response caching for frequent requests
- **File Handling**: Optimized upload and storage

## 🔐 **Security Implementation**

### Authentication & Authorization
- **JWT Tokens**: Secure authentication system
- **Password Security**: bcrypt hashing with salt
- **Role Management**: Granular permission control
- **Session Security**: Secure session handling

### Data Protection
- **Input Sanitization**: Protection against attacks
- **File Upload Security**: Validated uploads
- **CORS Configuration**: Secure resource sharing
- **Environment Protection**: Secure configuration

## 📚 **Documentation**

### System Documentation
- **README-PORT-FIX.md** - Port configuration guide
- **API Documentation** - Comprehensive endpoint guide
- **Database Schema** - Complete data model
- **Development Setup** - Local development guide

### Additional Resources
- **Development Guidelines** - Coding standards and practices
- **Deployment Guide** - Production deployment instructions
- **Troubleshooting** - Common issues and solutions
- **Performance Guide** - Optimization best practices

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow existing code style and conventions
- Write comprehensive tests for new features
- Update documentation as needed
- Ensure security best practices

## 📞 **Support**

For support and questions:
- Check the documentation and configuration files
- Review the API endpoints and database schema
- Examine the troubleshooting guide
- Contact the development team for assistance

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎯 **Project Status**

**Version**: 1.5 - Production Ready  
**Status**: ✅ Complete - Comprehensive warehouse listing platform  
**Features**: Full-stack application with advanced search and management  
**Code Quality**: Clean, documented, and maintainable codebase  

---

**🏢 Built with ❤️ for efficient warehouse listing and management**