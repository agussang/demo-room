#!/bin/bash

# Hotel Management System - Targeted Optimization
# This script optimizes your existing structure with minimal changes

echo "🏨 Hotel Management System - Targeted Optimization"
echo "=================================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Analyzing current structure...${NC}"

# Check current state
if [ ! -f "index.html" ]; then
    echo -e "${RED}❌ Error: index.html not found. Are you in the right directory?${NC}"
    exit 1
fi

if [ ! -d "hotel-manager" ]; then
    echo -e "${RED}❌ Error: hotel-manager directory not found.${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Current structure validated${NC}"
echo ""

# Create backup
BACKUP_DIR="backup_targeted_$(date +%Y%m%d_%H%M%S)"
echo -e "${BLUE}📦 Creating backup in ${BACKUP_DIR}...${NC}"
mkdir -p "$BACKUP_DIR"
cp index.html "$BACKUP_DIR/" 2>/dev/null || true
cp admin/index.html "$BACKUP_DIR/" 2>/dev/null || true
echo -e "${GREEN}✅ Backup created${NC}"

# Choice of implementation
echo ""
echo -e "${YELLOW}🎯 Choose optimization approach:${NC}"
echo "1. Keep existing structure (minimal changes)"
echo "2. Move registration to root level (recommended)"
echo ""
read -p "Enter choice (1 or 2): " choice

case $choice in
    1)
        echo -e "${BLUE}📋 Option 1: Minimal changes to existing structure${NC}"
        REGISTRATION_PATH="hotel-manager/registration/"
        ;;
    2)
        echo -e "${BLUE}📋 Option 2: Move registration to root level${NC}"
        REGISTRATION_PATH="registration/"
        ;;
    *)
        echo -e "${RED}❌ Invalid choice. Defaulting to Option 1${NC}"
        REGISTRATION_PATH="hotel-manager/registration/"
        choice=1
        ;;
esac

echo ""

# Step 1: Create/Update admin selector
echo -e "${BLUE}🔧 Step 1: Creating admin portal selector...${NC}"

cat > admin/index.html << 'EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Portal Admin | Sistem Manajemen Hotel Indonesia</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #2A4061 0%, #1a2c42 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #333;
        }

        .admin-selector {
            max-width: 900px;
            width: 90%;
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
            animation: fadeInUp 0.8s ease;
        }

        .header {
            margin-bottom: 40px;
        }

        .header h1 {
            color: #2A4061;
            font-size: 2.5rem;
            margin-bottom: 15px;
            font-weight: 700;
        }

        .header p {
            color: #666;
            font-size: 1.2rem;
            line-height: 1.6;
        }

        .admin-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 30px;
            margin-bottom: 40px;
        }

        .admin-card {
            background: white;
            border-radius: 15px;
            padding: 40px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.1);
            transition: all 0.3s;
            cursor: pointer;
            border: 3px solid transparent;
            text-decoration: none;
            color: inherit;
            display: block;
        }

        .admin-card:hover {
            transform: translateY(-8px);
            box-shadow: 0 15px 40px rgba(0,0,0,0.2);
            border-color: #D6A955;
        }

        .admin-card.pemda {
            border-left: 5px solid #10b981;
        }

        .admin-card.pusat {
            border-left: 5px solid #3b82f6;
        }

        .admin-icon {
            width: 100px;
            height: 100px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 0 auto 25px;
            color: white;
            font-size: 40px;
        }

        .admin-card.pemda .admin-icon {
            background: linear-gradient(135deg, #10b981, #059669);
        }

        .admin-card.pusat .admin-icon {
            background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        }

        .admin-title {
            font-size: 1.8rem;
            color: #2A4061;
            margin-bottom: 15px;
            font-weight: 600;
        }

        .admin-subtitle {
            color: #D6A955;
            font-size: 14px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 20px;
        }

        .admin-description {
            color: #666;
            line-height: 1.6;
            margin-bottom: 25px;
        }

        .admin-stats {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #eee;
        }

        .stat-item {
            text-align: center;
        }

        .stat-number {
            font-size: 1.5rem;
            font-weight: bold;
            color: #2A4061;
        }

        .stat-label {
            font-size: 11px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .back-button {
            padding: 12px 25px;
            background: transparent;
            color: #666;
            border: 2px solid #ddd;
            border-radius: 8px;
            text-decoration: none;
            transition: all 0.3s;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            font-weight: 500;
        }

        .back-button:hover {
            background: #f8f9fa;
            border-color: #2A4061;
            color: #2A4061;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .admin-selector {
                padding: 20px;
                margin: 20px;
            }

            .header h1 {
                font-size: 2rem;
            }

            .admin-grid {
                grid-template-columns: 1fr;
                gap: 20px;
            }

            .admin-stats {
                grid-template-columns: 1fr;
                gap: 10px;
            }
        }
    </style>
</head>
<body>
    <div class="admin-selector">
        <div class="header">
            <h1>Portal Administrasi</h1>
            <p>Pilih portal administrasi sesuai dengan level kewenangan dan tanggung jawab Anda dalam sistem verifikasi hotel.</p>
        </div>

        <div class="admin-grid">
            <!-- Pemda Portal -->
            <a href="pemda/dashboard.html" class="admin-card pemda">
                <div class="admin-icon">
                    <i class="fas fa-building"></i>
                </div>
                <div class="admin-subtitle">Pemerintah Daerah</div>
                <h3 class="admin-title">Portal Pemda</h3>
                <p class="admin-description">
                    Dashboard untuk verifikasi dan validasi pengajuan hotel di tingkat daerah. Melakukan review awal dokumen dan compliance check.
                </p>
                <div class="admin-stats">
                    <div class="stat-item">
                        <div class="stat-number">24</div>
                        <div class="stat-label">Pengajuan Baru</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">89</div>
                        <div class="stat-label">Diverifikasi</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">15</div>
                        <div class="stat-label">Dalam Review</div>
                    </div>
                </div>
            </a>

            <!-- Pemerintah Pusat Portal -->
            <a href="pusat/dashboard.html" class="admin-card pusat">
                <div class="admin-icon">
                    <i class="fas fa-university"></i>
                </div>
                <div class="admin-subtitle">Kementerian Pariwisata</div>
                <h3 class="admin-title">Portal Pemerintah Pusat</h3>
                <p class="admin-description">
                    Dashboard untuk final approval dan penerbitan SK resmi. Melakukan review akhir dan menerbitkan sertifikat hotel.
                </p>
                <div class="admin-stats">
                    <div class="stat-item">
                        <div class="stat-number">12</div>
                        <div class="stat-label">Pending Approval</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">156</div>
                        <div class="stat-label">SK Diterbitkan</div>
                    </div>
                    <div class="stat-item">
                        <div class="stat-number">1,247</div>
                        <div class="stat-label">Hotel Aktif</div>
                    </div>
                </div>
            </a>
        </div>

        <div style="margin-top: 30px;">
            <a href="../" class="back-button">
                <i class="fas fa-arrow-left"></i>
                Kembali ke Beranda
            </a>
        </div>
    </div>

    <script>
        // Add click analytics
        document.querySelectorAll('.admin-card').forEach(card => {
            card.addEventListener('click', function() {
                console.log('Admin portal selected:', this.querySelector('.admin-title').textContent);
            });
        });
    </script>
</body>
</html>
EOF

echo -e "${GREEN}✅ Admin selector created${NC}"

# Step 2: Handle registration based on choice
if [ "$choice" = "2" ]; then
    echo -e "${BLUE}🔧 Step 2: Moving registration to root level...${NC}"
    
    if [ -d "hotel-manager/registration" ]; then
        mkdir -p registration
        cp -r hotel-manager/registration/* registration/
        
        # Update paths in registration files
        if [ -f "registration/index.html" ]; then
            sed -i.bak 's|forms/|../hotel-manager/forms/|g' registration/index.html
            sed -i.bak 's|href="../shared/|href="../shared/|g' registration/index.html
            rm registration/index.html.bak 2>/dev/null || true
        fi
        
        # Remove old registration
        rm -rf hotel-manager/registration
        
        echo -e "${GREEN}✅ Registration moved to root level${NC}"
    else
        echo -e "${YELLOW}⚠️ hotel-manager/registration not found, creating new one${NC}"
        mkdir -p registration
        # Copy the unified registration system content here if needed
    fi
else
    echo -e "${BLUE}🔧 Step 2: Keeping registration in hotel-manager (no changes needed)${NC}"
    echo -e "${GREEN}✅ Registration location unchanged${NC}"
fi

# Step 3: Update main portal
echo -e "${BLUE}🔧 Step 3: Creating optimized main portal...${NC}"

cat > index.html << EOF
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Manajemen Hotel Indonesia | Kementerian Pariwisata</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"></script>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            overflow-x: hidden;
        }

        /* Header Navigation */
        .navbar {
            background: rgba(42, 64, 97, 0.95);
            backdrop-filter: blur(10px);
            padding: 15px 0;
            position: fixed;
            width: 100%;
            top: 0;
            z-index: 1000;
            transition: all 0.3s ease;
        }

        .nav-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 15px;
            color: white;
        }

        .logo-icon {
            width: 50px;
            height: 50px;
            background: linear-gradient(135deg, #D6A955, #B8934A);
            border-radius: 10px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
        }

        .logo-text h2 {
            font-size: 20px;
            margin-bottom: 2px;
        }

        .logo-text p {
            font-size: 12px;
            opacity: 0.8;
        }

        /* Hero Section */
        .hero {
            height: 100vh;
            background: linear-gradient(135deg, 
                rgba(42, 64, 97, 0.9), 
                rgba(42, 64, 97, 0.7)
            ),
            url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000"><defs><pattern id="hotel-pattern" patternUnits="userSpaceOnUse" width="100" height="100"><rect width="100" height="100" fill="%23f8f9fa" opacity="0.1"/><path d="M20 20h60v60H20z" fill="%23D6A955" opacity="0.1"/><circle cx="80" cy="20" r="8" fill="%23D6A955" opacity="0.15"/></pattern></defs><rect width="1000" height="1000" fill="url(%23hotel-pattern)"/></svg>');
            background-size: cover;
            background-position: center;
            display: flex;
            align-items: center;
            justify-content: center;
            text-align: center;
            color: white;
            position: relative;
        }

        .hero-content {
            max-width: 800px;
            padding: 0 20px;
            animation: fadeInUp 1s ease;
        }

        .hero h1 {
            font-size: 3.5rem;
            margin-bottom: 20px;
            font-weight: 700;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .hero p {
            font-size: 1.3rem;
            margin-bottom: 40px;
            opacity: 0.9;
            line-height: 1.8;
        }

        .hero-buttons {
            display: flex;
            gap: 20px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .btn {
            padding: 15px 30px;
            border: none;
            border-radius: 50px;
            font-size: 16px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 10px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .btn-primary {
            background: linear-gradient(135deg, #D6A955, #B8934A);
            color: white;
            box-shadow: 0 4px 15px rgba(214, 169, 85, 0.3);
        }

        .btn-primary:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(214, 169, 85, 0.4);
        }

        .btn-outline {
            background: transparent;
            color: white;
            border: 2px solid white;
        }

        .btn-outline:hover {
            background: white;
            color: #2A4061;
            transform: translateY(-3px);
        }

        /* Statistics Section */
        .stats {
            padding: 80px 0;
            background: #f8f9fa;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 0 20px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 40px;
            text-align: center;
        }

        .stat-card {
            background: white;
            padding: 40px 20px;
            border-radius: 15px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            transition: transform 0.3s;
            border-top: 5px solid #D6A955;
        }

        .stat-card:hover {
            transform: translateY(-5px);
        }

        .stat-number {
            font-size: 3rem;
            font-weight: bold;
            color: #2A4061;
            margin-bottom: 10px;
        }

        .stat-label {
            color: #666;
            font-size: 16px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        @media (max-width: 768px) {
            .hero h1 {
                font-size: 2.5rem;
            }

            .hero p {
                font-size: 1.1rem;
            }

            .hero-buttons {
                flex-direction: column;
                align-items: center;
            }

            .btn {
                width: 100%;
                max-width: 300px;
                justify-content: center;
            }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-container">
            <div class="logo">
                <div class="logo-icon">
                    <i class="fas fa-hotel"></i>
                </div>
                <div class="logo-text">
                    <h2>HOTEL MANAGEMENT</h2>
                    <p>Kementerian Pariwisata RI</p>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section class="hero">
        <div class="hero-content">
            <h1>Sistem Manajemen Hotel Indonesia</h1>
            <p>Platform terintegrasi untuk pendaftaran, verifikasi, dan pengelolaan hotel di Indonesia. Mendukung ekosistem pariwisata dan industri MICE yang berkelanjutan.</p>
            <div class="hero-buttons">
                <a href="${REGISTRATION_PATH}" class="btn btn-primary">
                    <i class="fas fa-plus-circle"></i>
                    Pendaftaran Baru
                </a>
                <a href="hotel-manager/" class="btn btn-outline">
                    <i class="fas fa-user-tie"></i>
                    Portal Hotel Manager
                </a>
                <a href="admin/" class="btn btn-outline">
                    <i class="fas fa-shield-alt"></i>
                    Portal Admin
                </a>
            </div>
        </div>
    </section>

    <!-- Statistics Section -->
    <section class="stats">
        <div class="container">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-number">1,247</div>
                    <div class="stat-label">Hotel Terdaftar</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">34</div>
                    <div class="stat-label">Provinsi</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">892</div>
                    <div class="stat-label">Sertifikat CHSE</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">156</div>
                    <div class="stat-label">Venue MICE</div>
                </div>
            </div>
        </div>
    </section>

    <script>
        // Navigation analytics
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function() {
                console.log('Navigation clicked:', this.textContent.trim());
            });
        });

        // Navbar scroll effect
        window.addEventListener('scroll', function() {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.style.background = 'rgba(42, 64, 97, 0.98)';
                navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
            } else {
                navbar.style.background = 'rgba(42, 64, 97, 0.95)';
                navbar.style.boxShadow = 'none';
            }
        });
    </script>
</body>
</html>
EOF

echo -e "${GREEN}✅ Main portal created${NC}"

# Step 4: Create quick access script
echo -e "${BLUE}🔧 Step 4: Creating quick access tools...${NC}"

cat > quick-access.sh << 'EOF'
#!/bin/bash
echo "🏨 Hotel Management System - Quick Access Links"
echo "=============================================="
echo ""
echo "🌐 Main Portal:          http://localhost:8000"
echo "🆕 Registration:         http://localhost:8000/$REGISTRATION_PATH"
echo "👤 Hotel Manager:        http://localhost:8000/hotel-manager/"
echo "🛡️ Admin Portal:         http://localhost:8000/admin/"
echo "🏛️ Pemda Dashboard:      http://localhost:8000/admin/pemda/"
echo "🏛️ Pusat Dashboard:      http://localhost:8000/admin/pusat/"
echo ""
echo "🚀 To start development server:"
echo "   ./start-dev.sh"
echo ""
echo "📱 Mobile testing:"
echo "   http://[your-ip]:8000"
EOF

# Update the registration path in quick-access
sed -i "s|\$REGISTRATION_PATH|${REGISTRATION_PATH}|g" quick-access.sh
chmod +x quick-access.sh

echo -e "${GREEN}✅ Quick access script created${NC}"

# Step 5: Validation
echo ""
echo -e "${BLUE}🔍 Step 5: Validating optimization...${NC}"

validation_score=0
total_checks=6

# Check main portal
if [ -f "index.html" ] && grep -q "Pendaftaran Baru" index.html; then
    echo -e "${GREEN}✅ Main portal updated${NC}"
    ((validation_score++))
else
    echo -e "${RED}❌ Main portal issue${NC}"
fi

# Check admin selector
if [ -f "admin/index.html" ] && grep -q "Portal Administrasi" admin/index.html; then
    echo -e "${GREEN}✅ Admin selector created${NC}"
    ((validation_score++))
else
    echo -e "${RED}❌ Admin selector issue${NC}"
fi

# Check registration path
if [ -f "${REGISTRATION_PATH}index.html" ]; then
    echo -e "${GREEN}✅ Registration accessible at ${REGISTRATION_PATH}${NC}"
    ((validation_score++))
else
    echo -e "${RED}❌ Registration not found at ${REGISTRATION_PATH}${NC}"
fi

# Check admin dashboards
if [ -f "admin/pemda/dashboard.html" ]; then
    echo -e "${GREEN}✅ Pemda dashboard exists${NC}"
    ((validation_score++))
else
    echo -e "${RED}❌ Pemda dashboard missing${NC}"
fi

if [ -f "admin/pusat/dashboard.html" ]; then
    echo -e "${GREEN}✅ Pusat dashboard exists${NC}"
    ((validation_score++))
else
    echo -e "${RED}❌ Pusat dashboard missing${NC}"
fi

# Check hotel manager
if [ -f "hotel-manager/index.html" ]; then
    echo -e "${GREEN}✅ Hotel manager portal exists${NC}"
    ((validation_score++))
else
    echo -e "${RED}❌ Hotel manager portal missing${NC}"
fi

# Calculate score
if [ $total_checks -gt 0 ]; then
    score=$((validation_score * 100 / total_checks))
else
    score=0
fi

echo ""
echo -e "${BLUE}📊 Optimization Score: ${validation_score}/${total_checks} (${score}%)${NC}"

if [ $validation_score -eq $total_checks ]; then
    echo -e "${GREEN}🎉 Optimization completed successfully!${NC}"
    echo ""
    echo -e "${BLUE}🔗 New workflow:${NC}"
    if [ "$choice" = "2" ]; then
        echo "   Main Portal → Registration → Hotel Manager"
    else
        echo "   Main Portal → Hotel Manager → Registration"
    fi
    echo "   Main Portal → Admin → Pemda/Pusat"
    echo ""
    echo -e "${YELLOW}🚀 Next steps:${NC}"
    echo "   1. Test the workflow: ./start-dev.sh"
    echo "   2. Quick access links: ./quick-access.sh"
    echo "   3. Open: http://localhost:8000"
    echo ""
    echo -e "${GREEN}✨ Your system is now optimized!${NC}"
elif [ $validation_score -ge 4 ]; then
    echo -e "${YELLOW}⚠️ Optimization mostly successful with minor issues${NC}"
    echo -e "${YELLOW}Please check the failed items above${NC}"
else
    echo -e "${RED}❌ Optimization encountered issues${NC}"
    echo -e "${RED}Please review the failed checks and try again${NC}"
fi

echo ""
echo -e "${BLUE}📦 Backup available in: ${BACKUP_DIR}${NC}"
echo -e "${BLUE}🔧 Optimization completed!${NC}"
