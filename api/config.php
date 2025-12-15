<?php
// ============================================
// DATABASE CONFIGURATION - FIXED
// ============================================

$host = "localhost";
$dbname = "stilletto";
$username = "root";
$password = "123456";

// Create connection using mysqli
$mysqli = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($mysqli->connect_errno) {
    http_response_code(500);
    echo json_encode([
        "success" => false,
        "message" => "Database connection failed",
        "error" => $mysqli->connect_error
    ]);
    exit;
}

// Set charset
$mysqli->set_charset("utf8mb4");

// ✅ Create alias for compatibility
$conn = $mysqli;

// Log successful connection (for debugging)
error_log("✅ Database connected successfully");
?>