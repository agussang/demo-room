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
