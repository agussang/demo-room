#!/bin/bash

# Hotel Management System - Project Reorganization Script
# This script will reorganize your messy project structure into a clean, maintainable structure

echo "🏨 Hotel Management System - Project Reorganization"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Backup function
create_backup() {
    BACKUP_DIR="backup_$(date +%Y%m%d_%H%M%S)"
    echo -e "${BLUE}📦 Creating backup in ${BACKUP_DIR}...${NC}"
    mkdir -p "$BACKUP_DIR"
    cp -r . "$BACKUP_DIR/" 2>/dev/null || true
    echo -e "${GREEN}✅ Backup created successfully${NC}"
}

# Function to create directory structure
create_structure() {
    echo -e "${BLUE}📁 Creating new directory structure...${NC}"
    
    # Main structure
    mkdir -p hotel-manager/{dashboard,forms,room-management,venue-management,mice-management}
    mkdir -p hotel-manager/assets/{css,js,images}
    
    # Admin structure (already exists, but ensure it's clean)
    mkdir -p admin/{pemda,pusat,shared}
    mkdir -p admin/assets/{css,js}
    
    # API and backend
    mkdir -p api/{hotel,pemda,pusat,shared}
    mkdir -p api/middleware
    
    # Shared resources
    mkdir -p shared/{components,utilities,services}
    mkdir -p shared/assets/{css,js,images,fonts}
    
    # Config and deployment
    mkdir -p deployment/{docker,scripts}
    mkdir -p config/{database,app,env}
    
    # Development and build
    mkdir -p build/{dist,src}
    mkdir -p build/typescript/{components,services}
    
    # Logs and uploads
    mkdir -p storage/{logs,uploads/{documents,images}}
    
    # Documentation
    mkdir -p documentation/{api,user-guide,development}
    
    echo -e "${GREEN}✅ Directory structure created${NC}"
}

# Function to move files
move_files() {
    echo -e "${BLUE}📋 Moving files to new structure...${NC}"
    
    # 1. Hotel Manager Interface
    echo -e "${YELLOW}Moving Hotel Manager files...${NC}"
    
    # Dashboard files
    mv dashboard/index.html hotel-manager/dashboard/ 2>/dev/null || true
    mv dashboard/hotel-dashboard.html hotel-manager/dashboard/ 2>/dev/null || true
    mv dashboard-venue/index.html hotel-manager/dashboard/venue-dashboard.html 2>/dev/null || true
    
    # Form files
    mv form/index.html hotel-manager/forms/hotel-registration.html 2>/dev/null || true
    mv form-venue/index.html hotel-manager/forms/venue-registration.html 2>/dev/null || true
    
    # Room management
    mv room/index.html hotel-manager/room-management/ 2>/dev/null || true
    mv room/detail.html hotel-manager/room-management/ 2>/dev/null || true
    
    # Venue management
    mv venue-management/index.html hotel-manager/venue-management/ 2>/dev/null || true
    mv mice-management/index.html hotel-manager/mice-management/ 2>/dev/null || true
    
    # Welcome and index
    mv welcome.html hotel-manager/ 2>/dev/null || true
    mv index.html hotel-manager/ 2>/dev/null || true
    
    # 2. Admin Interface (already in good structure)
    echo -e "${YELLOW}Admin files already organized...${NC}"
    
    # 3. API files
    echo -e "${YELLOW}Organizing API files...${NC}"
    mv api/hotel-submissions.php api/hotel/ 2>/dev/null || true
    mv api/pemda-verification.php api/pemda/ 2>/dev/null || true
    mv api/pusat-approval.php api/pusat/ 2>/dev/null || true
    
    # 4. JavaScript files reorganization
    echo -e "${YELLOW}Reorganizing JavaScript files...${NC}"
    
    # Hotel Manager JS
    mv js/dashboard-data.js hotel-manager/assets/js/ 2>/dev/null || true
    mv js/form.js hotel-manager/assets/js/ 2>/dev/null || true
    mv js/form-submit.js hotel-manager/assets/js/ 2>/dev/null || true
    mv js/submit-handler.js hotel-manager/assets/js/ 2>/dev/null || true
    mv js/file-upload.js hotel-manager/assets/js/ 2>/dev/null || true
    mv js/indexeddb-storage.js hotel-manager/assets/js/ 2>/dev/null || true
    
    # Venue specific JS
    mv js/venue-*.js hotel-manager/venue-management/ 2>/dev/null || true
    
    # Shared services JS
    mv js/address-autocomplete.js shared/services/ 2>/dev/null || true
    mv js/nearby-places*.js shared/services/ 2>/dev/null || true
    mv TypeScript/services/address-autocomplete.js shared/services/ 2>/dev/null || true
    
    # Login JS (shared)
    mv js/login.js shared/utilities/ 2>/dev/null || true
    
    # 5. CSS files
    echo -e "${YELLOW}Organizing CSS files...${NC}"
    
    # Hotel Manager CSS
    mv assets/css/form.css hotel-manager/assets/css/ 2>/dev/null || true
    mv assets/css/form-custom.css hotel-manager/assets/css/ 2>/dev/null || true
    
    # Shared CSS
    mv assets/css/main.css shared/assets/css/ 2>/dev/null || true
    mv assets/css/login.css shared/assets/css/ 2>/dev/null || true
    
    # 6. Build and development files
    echo -e "${YELLOW}Moving build and development files...${NC}"
    mv dist/* build/dist/ 2>/dev/null || true
    mv src/* build/src/ 2>/dev/null || true
    mv TypeScript build/typescript/ 2>/dev/null || true
    
    # 7. Assets
    echo -e "${YELLOW}Moving shared assets...${NC}"
    mv assets/images/* shared/assets/images/ 2>/dev/null || true
    mv assets/fonts/* shared/assets/fonts/ 2>/dev/null || true
    mv assets/js/main.js shared/assets/js/ 2>/dev/null || true
    
    # 8. Configuration
    echo -e "${YELLOW}Organizing configuration files...${NC}"
    mv config/* config/app/ 2>/dev/null || true
    
    # 9. Deployment files
    echo -e "${YELLOW}Moving deployment files...${NC}"
    mv Dockerfile deployment/docker/ 2>/dev/null || true
    mv docker-compose.yml deployment/docker/ 2>/dev/null || true
    mv docker-run.sh deployment/scripts/ 2>/dev/null || true
    mv serve.json deployment/ 2>/dev/null || true
    
    # 10. Documentation
    echo -e "${YELLOW}Organizing documentation...${NC}"
    mv README.md documentation/ 2>/dev/null || true
    mv CLAUDE.md documentation/development/ 2>/dev/null || true
    mv DEPLOYMENT.md documentation/deployment/ 2>/dev/null || true
    mv doc/README.md documentation/user-guide/ 2>/dev/null || true
    mv docs/schema.sql documentation/api/ 2>/dev/null || true
    
    # 11. Storage
    echo -e "${YELLOW}Moving storage files...${NC}"
    mv logs/* storage/logs/ 2>/dev/null || true
    mv uploads/* storage/uploads/ 2>/dev/null || true
    
    # 12. Package files (keep in root)
    echo -e "${YELLOW}Package files remain in root...${NC}"
    # package.json, package-lock.json stay in root
    
    echo -e "${GREEN}✅ File reorganization completed${NC}"
}

# Function to clean up empty directories
cleanup_empty_dirs() {
    echo -e "${BLUE}🧹 Cleaning up empty directories...${NC}"
    
    # Remove empty directories
    find . -type d -empty -delete 2>/dev/null || true
    
    # Remove old directories that should be empty now
    rmdir dashboard dashboard-venue form form-venue room mice-management venue-management 2>/dev/null || true
    rmdir dist src TypeScript 2>/dev/null || true
    rmdir assets/css assets/js assets/images assets/fonts assets 2>/dev/null || true
    rmdir js doc docs 2>/dev/null || true
    rmdir logs uploads/documents uploads/images uploads 2>/dev/null || true
    
    echo -e "${GREEN}✅ Cleanup completed${NC}"
}

# Function to create index files for navigation
create_index_files() {
    echo -e "${BLUE}📄 Creating navigation index files...${NC}"
    
    # Main project index
    cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Management System</title>
    <link rel="stylesheet" href="shared/assets/css/main.css">
</head>
<body>
    <div class="container">
        <h1>🏨 Hotel Management System</h1>
        <div class="navigation-grid">
            <div class="nav-card">
                <h3>Hotel Manager</h3>
                <a href="hotel-manager/index.html" class="btn btn-primary">
                    Masuk sebagai Hotel Manager
                </a>
            </div>
            <div class="nav-card">
                <h3>Pemda</h3>
                <a href="admin/pemda/dashboard.html" class="btn btn-accent">
                    Masuk sebagai Pemda
                </a>
            </div>
            <div class="nav-card">
                <h3>Pemerintah Pusat</h3>
                <a href="admin/pusat/dashboard.html" class="btn btn-primary">
                    Masuk sebagai Pemerintah Pusat
                </a>
            </div>
        </div>
    </div>
</body>
</html>
EOF

    # Hotel Manager index
    cat > hotel-manager/index.html << 'EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Manager Dashboard</title>
    <link rel="stylesheet" href="../shared/assets/css/main.css">
</head>
<body>
    <div class="container">
        <h1>🏨 Hotel Manager Portal</h1>
        <div class="dashboard-grid">
            <a href="dashboard/index.html" class="dashboard-card">
                <i class="fas fa-tachometer-alt"></i>
                <h3>Dashboard Utama</h3>
            </a>
            <a href="forms/hotel-registration.html" class="dashboard-card">
                <i class="fas fa-plus-circle"></i>
                <h3>Daftar Hotel Baru</h3>
            </a>
            <a href="room-management/index.html" class="dashboard-card">
                <i class="fas fa-bed"></i>
                <h3>Manajemen Kamar</h3>
            </a>
            <a href="venue-management/index.html" class="dashboard-card">
                <i class="fas fa-building"></i>
                <h3>Manajemen Venue</h3>
            </a>
        </div>
    </div>
</body>
</html>
EOF

    echo -e "${GREEN}✅ Index files created${NC}"
}

# Function to update file paths
update_file_paths() {
    echo -e "${BLUE}🔧 Updating file paths and references...${NC}"
    
    # Update CSS and JS paths in HTML files
    find hotel-manager -name "*.html" -exec sed -i 's|href="assets/css/|href="../shared/assets/css/|g' {} \; 2>/dev/null || true
    find hotel-manager -name "*.html" -exec sed -i 's|src="js/|src="assets/js/|g' {} \; 2>/dev/null || true
    find hotel-manager -name "*.html" -exec sed -i 's|href="css/|href="assets/css/|g' {} \; 2>/dev/null || true
    
    # Update admin paths
    find admin -name "*.html" -exec sed -i 's|href="assets/css/|href="../shared/assets/css/|g' {} \; 2>/dev/null || true
    find admin -name "*.html" -exec sed -i 's|src="js/|src="../shared/assets/js/|g' {} \; 2>/dev/null || true
    
    echo -e "${GREEN}✅ File paths updated${NC}"
}

# Function to create README for new structure
create_new_readme() {
    cat > README.md << 'EOF'
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

EOF

    echo -e "${GREEN}✅ New README created${NC}"
}

# Main execution
main() {
    echo -e "${PURPLE}Starting project reorganization...${NC}"
    echo ""
    
    # Ask for confirmation
    read -p "This will reorganize your entire project structure. Continue? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo -e "${RED}❌ Operation cancelled${NC}"
        exit 1
    fi
    
    # Create backup first
    create_backup
    echo ""
    
    # Execute reorganization steps
    create_structure
    echo ""
    
    move_files
    echo ""
    
    cleanup_empty_dirs
    echo ""
    
    create_index_files
    echo ""
    
    update_file_paths
    echo ""
    
    create_new_readme
    echo ""
    
    echo -e "${GREEN}🎉 Project reorganization completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}📋 What was done:${NC}"
    echo "   ✅ Created logical directory structure"
    echo "   ✅ Moved files to appropriate locations"
    echo "   ✅ Updated file references and paths"
    echo "   ✅ Created navigation index files"
    echo "   ✅ Cleaned up empty directories"
    echo "   ✅ Created backup of original structure"
    echo ""
    echo -e "${YELLOW}🔧 Next steps:${NC}"
    echo "   1. Test all functionality: php -S localhost:8000"
    echo "   2. Update any remaining broken paths manually"
    echo "   3. Commit changes to version control"
    echo "   4. Update deployment scripts if needed"
    echo ""
    echo -e "${GREEN}🚀 Your project is now properly organized!${NC}"
}

# Run the script
main
