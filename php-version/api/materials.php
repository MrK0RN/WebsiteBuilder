<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config/database.php';
require_once '../models/Material.php';

$database = new Database();
$db = $database->connect();
$material = new Material($db);

$method = $_SERVER['REQUEST_METHOD'];

switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            // Get single material
            $result = $material->readOne($_GET['id']);
            if($result) {
                echo json_encode($result);
            } else {
                http_response_code(404);
                echo json_encode(['message' => 'Material not found']);
            }
        } else {
            // Get materials with filters
            $filters = [];
            $allowed_filters = [
                'material_type', 'manufacturer', 'tensile_strength_min', 'tensile_strength_max',
                'melting_temp_min', 'melting_temp_max', 'density_min', 'density_max',
                'fda_approved', 'ul94_rating', 'search'
            ];
            
            foreach($allowed_filters as $filter) {
                if(isset($_GET[$filter]) && !empty($_GET[$filter])) {
                    $filters[$filter] = $_GET[$filter];
                }
            }
            
            $result = $material->read($filters);
            echo json_encode($result);
        }
        break;
        
    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        if(!empty($data->name) && !empty($data->manufacturer) && !empty($data->material_type)) {
            $material->name = $data->name;
            $material->manufacturer = $data->manufacturer;
            $material->material_type = $data->material_type;
            $material->grade = $data->grade ?? null;
            $material->description = $data->description ?? null;
            $material->tensile_strength = $data->tensile_strength ?? null;
            $material->flexural_strength = $data->flexural_strength ?? null;
            $material->impact_strength = $data->impact_strength ?? null;
            $material->elongation_at_break = $data->elongation_at_break ?? null;
            $material->melting_temperature = $data->melting_temperature ?? null;
            $material->heat_deflection_temp = $data->heat_deflection_temp ?? null;
            $material->density = $data->density ?? null;
            $material->mfr = $data->mfr ?? null;
            $material->water_absorption = $data->water_absorption ?? null;
            $material->fda_approved = $data->fda_approved ?? false;
            $material->ul94_rating = $data->ul94_rating ?? null;
            $material->color = $data->color ?? null;
            $material->transparency = $data->transparency ?? null;
            
            if($material->create()) {
                http_response_code(201);
                echo json_encode(['message' => 'Material created successfully']);
            } else {
                http_response_code(500);
                echo json_encode(['message' => 'Material could not be created']);
            }
        } else {
            http_response_code(400);
            echo json_encode(['message' => 'Missing required fields']);
        }
        break;
        
    default:
        http_response_code(405);
        echo json_encode(['message' => 'Method not allowed']);
        break;
}
?>