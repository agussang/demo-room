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
