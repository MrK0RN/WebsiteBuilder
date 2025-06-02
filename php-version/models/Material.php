<?php
require_once '../config/database.php';

class Material {
    private $conn;
    private $table = 'materials';

    public $id;
    public $name;
    public $manufacturer;
    public $material_type;
    public $grade;
    public $description;
    public $tensile_strength;
    public $flexural_strength;
    public $impact_strength;
    public $elongation_at_break;
    public $melting_temperature;
    public $heat_deflection_temp;
    public $density;
    public $mfr;
    public $water_absorption;
    public $fda_approved;
    public $ul94_rating;
    public $color;
    public $transparency;

    public function __construct($db) {
        $this->conn = $db;
    }

    public function read($filters = []) {
        $query = "SELECT * FROM " . $this->table . " WHERE 1=1";
        $params = [];

        // Apply filters
        if (!empty($filters['material_type'])) {
            $query .= " AND material_type = :material_type";
            $params[':material_type'] = $filters['material_type'];
        }

        if (!empty($filters['manufacturer'])) {
            $query .= " AND manufacturer = :manufacturer";
            $params[':manufacturer'] = $filters['manufacturer'];
        }

        if (!empty($filters['tensile_strength_min'])) {
            $query .= " AND tensile_strength >= :tensile_strength_min";
            $params[':tensile_strength_min'] = $filters['tensile_strength_min'];
        }

        if (!empty($filters['tensile_strength_max'])) {
            $query .= " AND tensile_strength <= :tensile_strength_max";
            $params[':tensile_strength_max'] = $filters['tensile_strength_max'];
        }

        if (!empty($filters['melting_temp_min'])) {
            $query .= " AND melting_temperature >= :melting_temp_min";
            $params[':melting_temp_min'] = $filters['melting_temp_min'];
        }

        if (!empty($filters['melting_temp_max'])) {
            $query .= " AND melting_temperature <= :melting_temp_max";
            $params[':melting_temp_max'] = $filters['melting_temp_max'];
        }

        if (!empty($filters['density_min'])) {
            $query .= " AND density >= :density_min";
            $params[':density_min'] = $filters['density_min'];
        }

        if (!empty($filters['density_max'])) {
            $query .= " AND density <= :density_max";
            $params[':density_max'] = $filters['density_max'];
        }

        if (!empty($filters['fda_approved'])) {
            $query .= " AND fda_approved = :fda_approved";
            $params[':fda_approved'] = $filters['fda_approved'] === 'true' ? 1 : 0;
        }

        if (!empty($filters['ul94_rating'])) {
            $query .= " AND ul94_rating = :ul94_rating";
            $params[':ul94_rating'] = $filters['ul94_rating'];
        }

        if (!empty($filters['search'])) {
            $query .= " AND (name LIKE :search OR manufacturer LIKE :search_man OR description LIKE :search_desc)";
            $searchTerm = '%' . $filters['search'] . '%';
            $params[':search'] = $searchTerm;
            $params[':search_man'] = $searchTerm;
            $params[':search_desc'] = $searchTerm;
        }

        $query .= " ORDER BY name ASC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        return $stmt->fetchAll();
    }

    public function readOne($id) {
        $query = "SELECT * FROM " . $this->table . " WHERE id = ? LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);

        return $stmt->fetch();
    }

    public function create() {
        $query = "INSERT INTO " . $this->table . " 
                  (name, manufacturer, material_type, grade, description, 
                   tensile_strength, flexural_strength, impact_strength, elongation_at_break,
                   melting_temperature, heat_deflection_temp, density, mfr, water_absorption,
                   fda_approved, ul94_rating, color, transparency)
                  VALUES 
                  (:name, :manufacturer, :material_type, :grade, :description,
                   :tensile_strength, :flexural_strength, :impact_strength, :elongation_at_break,
                   :melting_temperature, :heat_deflection_temp, :density, :mfr, :water_absorption,
                   :fda_approved, :ul94_rating, :color, :transparency)";

        $stmt = $this->conn->prepare($query);

        $this->name = htmlspecialchars(strip_tags($this->name));
        $this->manufacturer = htmlspecialchars(strip_tags($this->manufacturer));
        $this->material_type = htmlspecialchars(strip_tags($this->material_type));

        $stmt->bindParam(':name', $this->name);
        $stmt->bindParam(':manufacturer', $this->manufacturer);
        $stmt->bindParam(':material_type', $this->material_type);
        $stmt->bindParam(':grade', $this->grade);
        $stmt->bindParam(':description', $this->description);
        $stmt->bindParam(':tensile_strength', $this->tensile_strength);
        $stmt->bindParam(':flexural_strength', $this->flexural_strength);
        $stmt->bindParam(':impact_strength', $this->impact_strength);
        $stmt->bindParam(':elongation_at_break', $this->elongation_at_break);
        $stmt->bindParam(':melting_temperature', $this->melting_temperature);
        $stmt->bindParam(':heat_deflection_temp', $this->heat_deflection_temp);
        $stmt->bindParam(':density', $this->density);
        $stmt->bindParam(':mfr', $this->mfr);
        $stmt->bindParam(':water_absorption', $this->water_absorption);
        $stmt->bindParam(':fda_approved', $this->fda_approved);
        $stmt->bindParam(':ul94_rating', $this->ul94_rating);
        $stmt->bindParam(':color', $this->color);
        $stmt->bindParam(':transparency', $this->transparency);

        return $stmt->execute();
    }

    public function getVendors($material_id) {
        $query = "SELECT v.*, mv.price, mv.currency, mv.minimum_order, 
                         mv.availability, mv.product_url
                  FROM vendors v 
                  JOIN material_vendors mv ON v.id = mv.vendor_id 
                  WHERE mv.material_id = ?";
        
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$material_id]);

        return $stmt->fetchAll();
    }

    public function getManufacturers() {
        $query = "SELECT DISTINCT manufacturer FROM " . $this->table . " ORDER BY manufacturer";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }

    public function getMaterialTypes() {
        $query = "SELECT DISTINCT material_type FROM " . $this->table . " ORDER BY material_type";
        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt->fetchAll(PDO::FETCH_COLUMN);
    }
}
?>