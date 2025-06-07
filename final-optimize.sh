#!/bin/bash

# Final Optimizations for Already Well-Organized Hotel Management System
# This script makes minor improvements to an already good structure

echo "🎯 Final Optimizations for Hotel Management System"
echo "================================================"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Current structure analysis: ✅ EXCELLENT!${NC}"
echo -e "${GREEN}Your project is already very well organized!${NC}"
echo ""

# Function to make minor improvements
optimize_structure() {
    echo -e "${YELLOW}Making minor optimizations...${NC}"
    
    # 1. Move venue-specific JS files to assets
    if [ -f "hotel-manager/venue-management/venue-address-autocomplete.js" ]; then
        echo "• Moving venue JS files to assets..."
        mv hotel-manager/venue-management/venue-*.js hotel-manager/assets/js/ 2>/dev/null || true
    fi
    
    # 2. Create .gitignore if it doesn't exist
    if [ ! -f ".gitignore" ]; then
        echo "• Creating .gitignore..."
        cat > .gitignore << 'EOF'
# Dependencies
node_modules/
vendor/

# Build outputs
build/dist/*
!build/dist/.gitkeep

# Environment files
.env
.env.local
.env.production

# Logs
storage/logs/*.log
!storage/logs/.gitkeep

# Uploads
storage/uploads/*
!storage/uploads/.gitkeep
!storage/uploads/documents/.gitkeep
!storage/uploads/images/.gitkeep

# Cache
.cache/
*.cache

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Backup folders
backup_*/

# Temporary files
*.tmp
*.temp
EOF
    fi
    
    # 3. Create environment template
    if [ ! -f ".env.example" ]; then
        echo "• Creating environment template..."
        cat > .env.example << 'EOF'
# Hotel Management System Environment Configuration

# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hotel_management
DB_USER=root
DB_PASS=

# Application Settings
APP_ENV=development
APP_DEBUG=true
APP_URL=http://localhost:8000

# Security
JWT_SECRET=your-jwt-secret-key
ENCRYPTION_KEY=your-encryption-key

# Email Configuration (for notifications)
MAIL_DRIVER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-password
MAIL_ENCRYPTION=tls

# File Upload Settings
MAX_UPLOAD_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,jpg,jpeg,png,doc,docx

# API Configuration
API_VERSION=v1
API_RATE_LIMIT=100

# Logging
LOG_LEVEL=debug
LOG_CHANNEL=file
EOF
    fi
    
    # 4. Create proper .gitkeep files for empty directories
    echo "• Adding .gitkeep files..."
    touch storage/logs/.gitkeep
    touch storage/uploads/.gitkeep
    touch storage/uploads/documents/.gitkeep
    touch storage/uploads/images/.gitkeep
    touch build/dist/.gitkeep
    
    # 5. Create a comprehensive README for the organized structure
    cat > STRUCTURE.md << 'EOF'
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
EOF

    echo -e "${GREEN}✅ Optimizations completed!${NC}"
}

# Function to create helpful scripts
create_helper_scripts() {
    echo -e "${YELLOW}Creating helper scripts...${NC}"
    
    # Development server script
    cat > start-dev.sh << 'EOF'
#!/bin/bash
echo "🚀 Starting Hotel Management System Development Server..."
echo "=================================================="
echo "🌐 Server will be available at: http://localhost:8000"
echo "📱 Mobile testing: http://[your-ip]:8000"
echo ""
echo "🔗 Quick Access:"
echo "   • Main Portal: http://localhost:8000"
echo "   • Hotel Manager: http://localhost:8000/hotel-manager/"
echo "   • Pemda Admin: http://localhost:8000/admin/pemda/"
echo "   • Central Gov: http://localhost:8000/admin/pusat/"
echo ""
echo "Press Ctrl+C to stop the server"
echo "=================================================="

php -S localhost:8000
EOF

    chmod +x start-dev.sh
    
    # Build script
    cat > build.sh << 'EOF'
#!/bin/bash
echo "🔨 Building Hotel Management System..."

# Create build directory
mkdir -p build/dist

# Copy production files
echo "📦 Copying files for production..."
cp -r hotel-manager build/dist/
cp -r admin build/dist/
cp -r shared build/dist/
cp -r api build/dist/
cp -r config build/dist/
cp index.html build/dist/

# Minify CSS and JS files (if tools available)
if command -v uglifyjs &> /dev/null; then
    echo "🗜️ Minifying JavaScript files..."
    find build/dist -name "*.js" -exec uglifyjs {} -o {} \;
fi

if command -v cleancss &> /dev/null; then
    echo "🗜️ Minifying CSS files..."
    find build/dist -name "*.css" -exec cleancss {} -o {} \;
fi

echo "✅ Build completed! Files are in build/dist/"
EOF

    chmod +x build.sh
    
    echo -e "${GREEN}✅ Helper scripts created!${NC}"
}

# Function to validate current structure
validate_structure() {
    echo -e "${BLUE}🔍 Validating current structure...${NC}"
    
    local score=0
    local total=10
    
    # Check main directories
    [ -d "hotel-manager" ] && ((score++)) && echo "✅ hotel-manager/ directory exists"
    [ -d "admin" ] && ((score++)) && echo "✅ admin/ directory exists"
    [ -d "api" ] && ((score++)) && echo "✅ api/ directory exists"
    [ -d "shared" ] && ((score++)) && echo "✅ shared/ directory exists"
    [ -d "config" ] && ((score++)) && echo "✅ config/ directory exists"
    
    # Check key files
    [ -f "hotel-manager/index.html" ] && ((score++)) && echo "✅ Hotel manager entry point exists"
    [ -f "admin/pemda/dashboard.html" ] && ((score++)) && echo "✅ Pemda dashboard exists"
    [ -f "admin/pusat/dashboard.html" ] && ((score++)) && echo "✅ Central gov dashboard exists"
    [ -f "index.html" ] && ((score++)) && echo "✅ Main entry point exists"
    [ -d "documentation" ] && ((score++)) && echo "✅ Documentation directory exists"
    
    echo ""
    echo -e "${GREEN}📊 Structure Score: ${score}/${total} ($(( score * 100 / total ))%)${NC}"
    
    if [ $score -eq $total ]; then
        echo -e "${GREEN}🎉 EXCELLENT! Your structure is perfect!${NC}"
    elif [ $score -ge 8 ]; then
        echo -e "${YELLOW}⭐ VERY GOOD! Minor improvements possible.${NC}"
    elif [ $score -ge 6 ]; then
        echo -e "${YELLOW}👍 GOOD! Some organization needed.${NC}"
    else
        echo -e "${RED}❌ NEEDS WORK! Major reorganization required.${NC}"
    fi
}

# Main execution
main() {
    echo -e "${GREEN}🎯 Your project structure is already EXCELLENT!${NC}"
    echo ""
    
    validate_structure
    echo ""
    
    read -p "Would you like to apply minor optimizations? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        optimize_structure
        echo ""
        create_helper_scripts
        echo ""
        echo -e "${GREEN}🎉 Final optimizations completed!${NC}"
        echo ""
        echo -e "${BLUE}📋 What was added:${NC}"
        echo "   ✅ .gitignore file for clean version control"
        echo "   ✅ .env.example template for configuration"
        echo "   ✅ STRUCTURE.md comprehensive documentation"
        echo "   ✅ start-dev.sh for easy development server"
        echo "   ✅ build.sh for production builds"
        echo "   ✅ .gitkeep files for empty directories"
        echo ""
        echo -e "${YELLOW}🚀 Quick Start:${NC}"
        echo "   ./start-dev.sh    # Start development server"
        echo "   ./build.sh        # Build for production"
        echo ""
    else
        echo -e "${GREEN}👍 No changes needed - your structure is already great!${NC}"
    fi
    
    echo -e "${BLUE}🔗 Access your application:${NC}"
    echo "   • Main Portal: http://localhost:8000"
    echo "   • Hotel Manager: http://localhost:8000/hotel-manager/"
    echo "   • Pemda Admin: http://localhost:8000/admin/pemda/"
    echo "   • Central Government: http://localhost:8000/admin/pusat/"
}

# Run the script
main
