#!/bin/bash

# Setup Hotel Management System
# Skrip untuk membuat struktur folder dan file sistem manajemen hotel

echo "🏨 Setting up Hotel Management System..."
echo "================================================"

# Warna untuk output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fungsi untuk membuat direktori dengan pesan
create_dir() {
    if [ ! -d "$1" ]; then
        mkdir -p "$1"
        echo -e "${GREEN}✅ Created directory:${NC} $1"
    else
        echo -e "${YELLOW}📁 Directory already exists:${NC} $1"
    fi
}

# Fungsi untuk membuat file dengan template dasar
create_file() {
    local filepath="$1"
    local template="$2"
    
    if [ ! -f "$filepath" ]; then
        echo "$template" > "$filepath"
        echo -e "${BLUE}📄 Created file:${NC} $filepath"
    else
        echo -e "${YELLOW}📄 File already exists:${NC} $filepath"
    fi
}

echo -e "${BLUE}Step 1: Creating main directories...${NC}"
echo "----------------------------------------"

# Membuat struktur direktori utama
create_dir "admin"
create_dir "admin/pemda"
create_dir "admin/pusat"
create_dir "admin/shared"
create_dir "api"
create_dir "assets"
create_dir "assets/css"
create_dir "assets/js"
create_dir "assets/images"
create_dir "docs"
create_dir "config"

echo ""
echo -e "${BLUE}Step 2: Creating HTML files for admin panels...${NC}"
echo "----------------------------------------------"

# Template dasar HTML dengan styling konsisten
read -r -d '' HTML_TEMPLATE << 'EOF'
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Hotel Management System</title>
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
            color: #333;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        .header {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 25px;
            margin-bottom: 25px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            border-left: 5px solid #D6A955;
        }
        .header h1 {
            color: #2A4061;
            margin-bottom: 10px;
        }
        .content {
            background: rgba(255,255,255,0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.1);
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1><i class="fas fa-hotel"></i> Hotel Management System</h1>
            <p>Sistem Manajemen Hotel - Indonesia</p>
        </div>
        <div class="content">
            <h2>Coming Soon...</h2>
            <p>Halaman ini sedang dalam pengembangan.</p>
        </div>
    </div>
</body>
</html>
EOF

# Membuat file HTML untuk Pemda
create_file "admin/pemda/verification-detail.html" "$HTML_TEMPLATE"
create_file "admin/pemda/reports.html" "$HTML_TEMPLATE"

# Membuat file HTML untuk Pemerintah Pusat
create_file "admin/pusat/sk-management.html" "$HTML_TEMPLATE"
create_file "admin/pusat/national-reports.html" "$HTML_TEMPLATE"

# Membuat file HTML untuk Shared
create_file "admin/shared/notifications.html" "$HTML_TEMPLATE"
create_file "admin/shared/document-viewer.html" "$HTML_TEMPLATE"

echo ""
echo -e "${BLUE}Step 3: Creating PHP API files...${NC}"
echo "----------------------------------"

# Template dasar PHP
read -r -d '' PHP_TEMPLATE << 'EOF'
<?php
/**
 * Hotel Management System API
 * Author: Development Team
 * Created: $(date +"%Y-%m-%d")
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Database configuration
require_once '../config/database.php';

class HotelAPI {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    public function handleRequest() {
        $method = $_SERVER['REQUEST_METHOD'];
        
        switch($method) {
            case 'GET':
                $this->handleGet();
                break;
            case 'POST':
                $this->handlePost();
                break;
            case 'PUT':
                $this->handlePut();
                break;
            case 'DELETE':
                $this->handleDelete();
                break;
            default:
                $this->sendResponse(405, ['error' => 'Method not allowed']);
        }
    }
    
    private function handleGet() {
        // TODO: Implement GET methods
        $this->sendResponse(200, ['message' => 'GET method - Under development']);
    }
    
    private function handlePost() {
        // TODO: Implement POST methods
        $this->sendResponse(200, ['message' => 'POST method - Under development']);
    }
    
    private function handlePut() {
        // TODO: Implement PUT methods
        $this->sendResponse(200, ['message' => 'PUT method - Under development']);
    }
    
    private function handleDelete() {
        // TODO: Implement DELETE methods
        $this->sendResponse(200, ['message' => 'DELETE method - Under development']);
    }
    
    private function sendResponse($code, $data) {
        http_response_code($code);
        echo json_encode($data);
        exit();
    }
}

// Initialize API
try {
    $api = new HotelAPI();
    $api->handleRequest();
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}
?>
EOF

# Membuat file PHP API
create_file "api/hotel-submissions.php" "$PHP_TEMPLATE"
create_file "api/pemda-verification.php" "$PHP_TEMPLATE"
create_file "api/pusat-approval.php" "$PHP_TEMPLATE"

echo ""
echo -e "${BLUE}Step 4: Creating configuration files...${NC}"
echo "---------------------------------------"

# Database configuration
read -r -d '' DB_CONFIG << 'EOF'
<?php
/**
 * Database Configuration
 * Hotel Management System
 */

class Database {
    private $host = 'localhost';
    private $db_name = 'hotel_management';
    private $username = 'root';
    private $password = '';
    public $conn;
    
    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name,
                $this->username,
                $this->password
            );
            $this->conn->exec("set names utf8");
        } catch(PDOException $exception) {
            echo "Connection error: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}
?>
EOF

create_file "config/database.php" "$DB_CONFIG"

# Config utama
read -r -d '' MAIN_CONFIG << 'EOF'
<?php
/**
 * Main Configuration File
 * Hotel Management System
 */

// Application Settings
define('APP_NAME', 'Hotel Management System');
define('APP_VERSION', '1.0.0');
define('APP_URL', 'http://localhost/hotel-management');

// Security Settings
define('JWT_SECRET', 'your-secret-key-here');
define('ENCRYPTION_KEY', 'your-encryption-key-here');

// File Upload Settings
define('MAX_FILE_SIZE', 10 * 1024 * 1024); // 10MB
define('ALLOWED_EXTENSIONS', ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx']);
define('UPLOAD_DIR', 'uploads/');

// Email Settings
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');
define('SMTP_PASSWORD', 'your-password');

// Notification Settings
define('ENABLE_EMAIL_NOTIFICATIONS', true);
define('ENABLE_SMS_NOTIFICATIONS', false);

// Development Settings
define('DEBUG_MODE', true);
define('LOG_ERRORS', true);
define('ERROR_LOG_FILE', 'logs/error.log');
?>
EOF

create_file "config/config.php" "$MAIN_CONFIG"

echo ""
echo -e "${BLUE}Step 5: Creating additional support files...${NC}"
echo "--------------------------------------------"

# CSS Main file
read -r -d '' CSS_MAIN << 'EOF'
/**
 * Hotel Management System - Main CSS
 * Color Palette: #2A4061 (Primary), #D6A955 (Accent)
 */

:root {
    --primary-color: #2A4061;
    --accent-color: #D6A955;
    --success-color: #10b981;
    --warning-color: #f59e0b;
    --danger-color: #ef4444;
    --light-bg: rgba(255,255,255,0.95);
    --dark-bg: linear-gradient(135deg, #2A4061 0%, #1a2c42 100%);
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: var(--dark-bg);
    min-height: 100vh;
    color: #333;
}

/* Utility Classes */
.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
}

.btn-primary {
    background: var(--primary-color);
    color: white;
}

.btn-accent {
    background: var(--accent-color);
    color: white;
}

.btn-success {
    background: var(--success-color);
    color: white;
}

.btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.card {
    background: var(--light-bg);
    backdrop-filter: blur(10px);
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.1);
    border-left: 5px solid var(--accent-color);
}

/* Responsive */
@media (max-width: 768px) {
    .card {
        padding: 15px;
        margin: 10px;
    }
}
EOF

create_file "assets/css/main.css" "$CSS_MAIN"

# JavaScript main file
read -r -d '' JS_MAIN << 'EOF'
/**
 * Hotel Management System - Main JavaScript
 * Common functions and utilities
 */

class HotelManagement {
    constructor() {
        this.apiBase = '/api';
        this.init();
    }
    
    init() {
        console.log('Hotel Management System initialized');
        this.setupEventListeners();
        this.loadNotifications();
    }
    
    setupEventListeners() {
        // Global event listeners
        document.addEventListener('DOMContentLoaded', () => {
            this.initializeComponents();
        });
    }
    
    initializeComponents() {
        // Initialize tooltips, modals, etc.
        console.log('Components initialized');
    }
    
    async apiCall(endpoint, method = 'GET', data = null) {
        try {
            const config = {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                }
            };
            
            if (data) {
                config.body = JSON.stringify(data);
            }
            
            const response = await fetch(`${this.apiBase}${endpoint}`, config);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : 'exclamation'}"></i>
            ${message}
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
    
    loadNotifications() {
        // Load real-time notifications
        console.log('Loading notifications...');
    }
    
    formatDate(date) {
        return new Date(date).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    
    formatCurrency(amount) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR'
        }).format(amount);
    }
}

// Initialize system
const hotelSystem = new HotelManagement();

// Export for use in other files
window.HotelManagement = HotelManagement;
EOF

create_file "assets/js/main.js" "$JS_MAIN"

# README file
read -r -d '' README_CONTENT << 'EOF'
# Hotel Management System

Sistem manajemen hotel dengan workflow verifikasi Pemda dan approval Pemerintah Pusat.

## Struktur Proyek

```
hotel-management-system/
├── admin/                  # Panel admin
│   ├── pemda/             # Dashboard Pemda
│   ├── pusat/             # Dashboard Pemerintah Pusat
│   └── shared/            # Komponen bersama
├── api/                   # REST API endpoints
├── assets/                # CSS, JS, images
├── config/                # Konfigurasi database dan aplikasi
└── docs/                  # Dokumentasi
```

## Color Palette

- **Primary**: #2A4061 (Navy Blue)
- **Accent**: #D6A955 (Gold)
- **Success**: #10b981
- **Warning**: #f59e0b
- **Danger**: #ef4444

## Workflow

1. **Hotel Manager**: Submit pengajuan
2. **Pemda**: Verifikasi dokumen dan compliance
3. **Pemerintah Pusat**: Final approval dan penerbitan SK

## Installation

1. Clone repository
2. Run `chmod +x setup.sh && ./setup.sh`
3. Configure database in `config/database.php`
4. Import database schema
5. Start development server

## Development

- Frontend: HTML5, CSS3, JavaScript ES6+
- Backend: PHP 7.4+
- Database: MySQL 5.7+
- Icons: Font Awesome 6

## API Endpoints

- `POST /api/hotel-submissions.php` - Hotel submissions
- `POST /api/pemda-verification.php` - Pemda verification
- `POST /api/pusat-approval.php` - Final approval

## License

MIT License - Internal Use Only
EOF

create_file "README.md" "$README_CONTENT"

# Database SQL schema
read -r -d '' SQL_SCHEMA << 'EOF'
-- Hotel Management System Database Schema
-- Created: $(date +"%Y-%m-%d")

CREATE DATABASE IF NOT EXISTS hotel_management;
USE hotel_management;

-- Table: hotels
CREATE TABLE hotels (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nib VARCHAR(20) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    hotel_name VARCHAR(255) NOT NULL,
    classification INT NOT NULL,
    total_rooms INT NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    province VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    website VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: hotel_workflow
CREATE TABLE hotel_workflow (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    current_stage ENUM('submitted', 'pemda_review', 'pusat_review', 'approved', 'rejected') DEFAULT 'submitted',
    pemda_verifier_id INT,
    pusat_approver_id INT,
    sk_number VARCHAR(50) UNIQUE,
    valid_from DATE,
    valid_until DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- Table: verification_comments
CREATE TABLE verification_comments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT NOT NULL,
    user_type ENUM('pemda', 'pusat') NOT NULL,
    user_id INT NOT NULL,
    comment TEXT,
    status ENUM('approved', 'rejected', 'returned') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE CASCADE
);

-- Table: users
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('hotel_manager', 'pemda', 'pusat') NOT NULL,
    organization VARCHAR(255),
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table: audit_log
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    hotel_id INT,
    user_id INT,
    action VARCHAR(100) NOT NULL,
    details TEXT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hotel_id) REFERENCES hotels(id) ON DELETE SET NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- Insert sample users
INSERT INTO users (username, email, password_hash, full_name, role, organization) VALUES
('admin_pemda', 'pemda@example.com', '$2y$10$example_hash', 'Budi Santoso', 'pemda', 'Dinas Pariwisata'),
('admin_pusat', 'pusat@example.com', '$2y$10$example_hash', 'Dr. Siti Nurhaliza', 'pusat', 'Kementerian Pariwisata'),
('hotel_manager', 'hotel@example.com', '$2y$10$example_hash', 'Ahmad Wijaya', 'hotel_manager', 'Hotel Santika');
EOF

create_file "docs/schema.sql" "$SQL_SCHEMA"

# Logs directory
create_dir "logs"
touch "logs/error.log"
touch "logs/access.log"

# Uploads directory
create_dir "uploads"
create_dir "uploads/documents"
create_dir "uploads/images"

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo "================================================"
echo -e "${BLUE}📂 Project structure created:${NC}"
echo "   • Admin panels (Pemda & Pemerintah Pusat)"
echo "   • API endpoints with PHP templates"
echo "   • Configuration files"
echo "   • Assets (CSS, JS)"
echo "   • Database schema"
echo "   • Documentation"
echo ""
echo -e "${YELLOW}🔧 Next steps:${NC}"
echo "   1. Configure database settings in config/database.php"
echo "   2. Import database schema: mysql < docs/schema.sql"
echo "   3. Set proper file permissions: chmod 755 uploads/ logs/"
echo "   4. Start development server: php -S localhost:8000"
echo ""
echo -e "${GREEN}🎉 Happy coding!${NC}"
EOF
