# Hotel Management System

## 📁 New Project Structure

```
hotel-management-system/
├── hotel-manager/              # Hotel Manager Interface
│   ├── dashboard/             # Hotel dashboards
│   ├── forms/                 # Registration forms
│   ├── room-management/       # Room management
│   ├── venue-management/      # Venue management
│   ├── mice-management/       # MICE management
│   └── assets/               # Hotel manager specific assets
├── admin/                     # Admin Interfaces
│   ├── pemda/                # Pemda verification interface
│   ├── pusat/                # Government approval interface
│   └── shared/               # Shared admin components
├── api/                       # Backend API
│   ├── hotel/                # Hotel related APIs
│   ├── pemda/                # Pemda APIs
│   ├── pusat/                # Government APIs
│   └── shared/               # Shared API utilities
├── shared/                    # Shared Resources
│   ├── assets/               # Common CSS, JS, images
│   ├── components/           # Reusable components
│   ├── services/             # Shared services
│   └── utilities/            # Common utilities
├── config/                    # Configuration
│   ├── app/                  # App configuration
│   ├── database/             # Database configuration
│   └── env/                  # Environment configuration
├── build/                     # Build and Development
│   ├── dist/                 # Built files
│   ├── src/                  # Source files
│   └── typescript/           # TypeScript files
├── storage/                   # Storage
│   ├── logs/                 # Application logs
│   └── uploads/              # File uploads
├── deployment/                # Deployment
│   ├── docker/               # Docker files
│   └── scripts/              # Deployment scripts
└── documentation/             # Documentation
    ├── api/                  # API documentation
    ├── user-guide/           # User guides
    └── development/          # Development docs
```

## 🚀 Quick Start

1. **Hotel Manager**: `/hotel-manager/index.html`
2. **Pemda Admin**: `/admin/pemda/dashboard.html`
3. **Government Admin**: `/admin/pusat/dashboard.html`

## 🔄 Workflow

1. Hotel Manager submits application
2. Pemda verifies and approves
3. Government gives final approval
4. SK (License) is issued

## 🛠 Development

- Start server: `php -S localhost:8000`
- Access: `http://localhost:8000`

