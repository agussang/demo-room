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
