<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';
require_once '../models/Material.php';

$database = new Database();
$db = $database->connect();
$material = new Material($db);

$method = $_SERVER['REQUEST_METHOD'];

if($method === 'GET') {
    if(isset($_GET['material_id'])) {
        // Get vendors for specific material
        $vendors = $material->getVendors($_GET['material_id']);
        echo json_encode($vendors);
    } else {
        // Get all vendors
        $query = "SELECT * FROM vendors ORDER BY name";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $vendors = $stmt->fetchAll();
        echo json_encode($vendors);
    }
} else {
    http_response_code(405);
    echo json_encode(['message' => 'Method not allowed']);
}
?>