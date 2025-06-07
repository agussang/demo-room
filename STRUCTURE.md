# 🏨 Hotel Management System - Project Structure

## 📁 Directory Overview

```
hotel-management-system/
├── 🏨 hotel-manager/              # Hotel Manager Interface
│   ├── 📊 dashboard/              # Hotel dashboards & analytics
│   ├── 📝 forms/                  # Registration & submission forms
│   ├── 🛏️ room-management/        # Room inventory management
│   ├── 🏢 venue-management/       # Venue & MICE management
│   ├── 🎪 mice-management/        # MICE specific features
│   └── 📦 assets/                 # Hotel manager specific resources
├── 👥 admin/                      # Administrative Interfaces
│   ├── 🏛️ pemda/                  # Regional Government (Pemda)
│   ├── 🏛️ pusat/                  # Central Government
│   └── 🔗 shared/                 # Shared admin components
├── 🔌 api/                        # Backend API Layer
│   ├── 🏨 hotel/                  # Hotel-related endpoints
│   ├── 🏛️ pemda/                  # Pemda verification endpoints
│   └── 🏛️ pusat/                  # Central government endpoints
├── 🌐 shared/                     # Shared Resources
│   ├── 📦 assets/                 # Global CSS, JS, images
│   ├── 🧩 components/             # Reusable UI components
│   ├── 🛠️ services/               # Business logic services
│   └── 🔧 utilities/              # Helper functions
├── ⚙️ config/                     # Configuration Files
├── 🚀 deployment/                 # Deployment & Docker files
├── 📖 documentation/              # All documentation
├── 🔨 build/                      # Build artifacts & TypeScript
└── 💾 storage/                    # Logs, uploads, cache
```

## 🔄 Workflow Structure

### 1. Hotel Manager Flow
```
hotel-manager/index.html
├── dashboard/              # View hotel status & analytics
├── forms/                  # Submit new hotel registration
├── room-management/        # Manage room inventory
└── venue-management/       # Manage venue facilities
```

### 2. Admin Verification Flow
```
admin/pemda/dashboard.html  # Pemda reviews submissions
        ↓
admin/pusat/dashboard.html  # Central gov final approval
        ↓
SK (License) issued
```

### 3. API Flow
```
api/hotel/          # Hotel submissions
    ↓
api/pemda/          # Pemda verification
    ↓
api/pusat/          # Final approval
```

## 🚀 Getting Started

1. **Development Server**:
   ```bash
   php -S localhost:8000
   ```

2. **Access Points**:
   - Main: `http://localhost:8000`
   - Hotel Manager: `http://localhost:8000/hotel-manager/`
   - Pemda Admin: `http://localhost:8000/admin/pemda/`
   - Central Gov: `http://localhost:8000/admin/pusat/`

3. **API Endpoints**:
   - Base URL: `http://localhost:8000/api/`
   - Documentation: `/documentation/api/`

## 🎨 Design System

- **Primary Color**: #2A4061 (Navy Blue)
- **Accent Color**: #D6A955 (Gold)
- **Success**: #10b981
- **Warning**: #f59e0b
- **Danger**: #ef4444

## 📱 Responsive Design

All interfaces are fully responsive and work on:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🔒 Security Features

- Input validation on all forms
- File upload restrictions
- User role-based access control
- Audit logging for all actions
- SQL injection prevention

## 🧪 Testing

- Unit tests: `npm test`
- Integration tests: `npm run test:integration`
- E2E tests: `npm run test:e2e`

## 📚 Documentation

- User Guide: `/documentation/user-guide/`
- API Docs: `/documentation/api/`
- Development: `/documentation/development/`

## 🤝 Contributing

1. Follow the established directory structure
2. Use consistent naming conventions
3. Add appropriate documentation
4. Test thoroughly before committing

## 📞 Support

For technical support or questions:
- Check documentation first
- Create an issue in the project repository
- Contact the development team

---

**Note**: This structure follows modern web development best practices and provides clear separation of concerns for maintainability and scalability.
