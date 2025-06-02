<?php
/**
 * PlasticDB Deployment Script
 * Run this script to set up the database and verify installation
 */

require_once 'config/database.php';

// Check PHP version
if (version_compare(PHP_VERSION, '7.4.0', '<')) {
    die("PHP 7.4 or higher is required. Current version: " . PHP_VERSION . "\n");
}

// Check required extensions
$required_extensions = ['pdo', 'pdo_mysql', 'json'];
foreach ($required_extensions as $ext) {
    if (!extension_loaded($ext)) {
        die("Required PHP extension '$ext' is not loaded.\n");
    }
}

echo "PlasticDB Deployment Script\n";
echo "===========================\n\n";

try {
    $database = new Database();
    $conn = $database->connect();
    
    if (!$conn) {
        die("Database connection failed. Please check your configuration.\n");
    }
    
    echo "✓ Database connection successful\n";
    
    // Check if tables exist
    $stmt = $conn->query("SHOW TABLES LIKE 'materials'");
    if ($stmt->rowCount() == 0) {
        echo "⚠ Materials table not found. Please import database.sql\n";
        echo "Run: mysql -u username -p plasticdb < database.sql\n";
    } else {
        echo "✓ Database tables found\n";
        
        // Check sample data
        $stmt = $conn->query("SELECT COUNT(*) as count FROM materials");
        $count = $stmt->fetch()['count'];
        echo "✓ Found $count materials in database\n";
    }
    
    // Check file permissions
    if (!is_writable('.')) {
        echo "⚠ Directory is not writable. Please check file permissions.\n";
    } else {
        echo "✓ File permissions OK\n";
    }
    
    // Test API endpoints
    $api_url = 'http://' . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . '/api/materials.php';
    echo "Testing API at: $api_url\n";
    
    $context = stream_context_create([
        'http' => [
            'timeout' => 5,
            'ignore_errors' => true
        ]
    ]);
    
    $response = @file_get_contents($api_url, false, $context);
    if ($response !== false) {
        $data = json_decode($response, true);
        if (is_array($data)) {
            echo "✓ API endpoint working (" . count($data) . " materials)\n";
        } else {
            echo "⚠ API returned invalid JSON\n";
        }
    } else {
        echo "⚠ API endpoint not accessible\n";
    }
    
    echo "\nDeployment Status: READY\n";
    echo "Access your application at: http://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['PHP_SELF']) . "/\n";
    
} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
    exit(1);
}
?>