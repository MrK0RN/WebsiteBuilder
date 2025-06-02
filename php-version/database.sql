-- PlasticDB Database Schema for MySQL/MariaDB

CREATE DATABASE IF NOT EXISTS plasticdb;
USE plasticdb;

-- Materials table
CREATE TABLE materials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    manufacturer VARCHAR(255) NOT NULL,
    material_type VARCHAR(100) NOT NULL,
    grade VARCHAR(100),
    description TEXT,
    
    -- Mechanical Properties
    tensile_strength DECIMAL(8,2), -- MPa
    flexural_strength DECIMAL(8,2), -- MPa
    impact_strength DECIMAL(8,2), -- kJ/m²
    elongation_at_break DECIMAL(5,2), -- %
    hardness_shore VARCHAR(10),
    
    -- Thermal Properties
    melting_temperature DECIMAL(6,2), -- °C
    heat_deflection_temp DECIMAL(6,2), -- °C
    vicat_softening_point DECIMAL(6,2), -- °C
    thermal_conductivity DECIMAL(8,5), -- W/m·K
    thermal_expansion DECIMAL(12,8), -- /°C
    
    -- Physical Properties
    density DECIMAL(8,3), -- g/cm³
    mfr DECIMAL(8,2), -- g/10 min (Melt Flow Rate)
    water_absorption DECIMAL(8,2), -- %
    shore_hardness INT,
    
    -- Color and Appearance
    color VARCHAR(100),
    transparency VARCHAR(50), -- transparent, translucent, opaque
    
    -- Certifications
    fda_approved BOOLEAN DEFAULT FALSE,
    ul94_rating VARCHAR(10), -- V-0, V-1, V-2, HB
    rohs_compliant BOOLEAN DEFAULT FALSE,
    reach_compliant BOOLEAN DEFAULT FALSE,
    
    -- Documentation
    technical_data_sheet_url VARCHAR(500),
    safety_data_sheet_url VARCHAR(500),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Vendors table
CREATE TABLE vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Material-Vendor pricing relationship
CREATE TABLE material_vendors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    material_id INT NOT NULL,
    vendor_id INT NOT NULL,
    price DECIMAL(10,2), -- price per kg
    currency VARCHAR(3) DEFAULT 'USD',
    minimum_order DECIMAL(10,2), -- kg
    availability VARCHAR(50) DEFAULT 'in_stock',
    product_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE,
    FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

-- User favorites (optional)
CREATE TABLE favorites (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    material_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

-- User reviews and ratings
CREATE TABLE reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    material_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    application_area VARCHAR(100),
    processing_method VARCHAR(100),
    is_verified_purchase BOOLEAN DEFAULT FALSE,
    helpful_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (material_id) REFERENCES materials(id) ON DELETE CASCADE
);

-- Review helpful votes
CREATE TABLE review_helpful (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    review_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (review_id) REFERENCES reviews(id) ON DELETE CASCADE
);

-- Insert sample vendors
INSERT INTO vendors (name, website, contact_email) VALUES
('SABIC', 'https://www.sabic.com', 'info@sabic.com'),
('BASF', 'https://www.basf.com', 'contact@basf.com'),
('DuPont', 'https://www.dupont.com', 'info@dupont.com'),
('Covestro', 'https://www.covestro.com', 'contact@covestro.com'),
('Celanese', 'https://www.celanese.com', 'info@celanese.com');

-- Insert sample materials with real data from manufacturers
INSERT INTO materials (
    name, manufacturer, material_type, grade, description,
    tensile_strength, flexural_strength, impact_strength, elongation_at_break,
    melting_temperature, heat_deflection_temp, density, mfr,
    water_absorption, fda_approved, ul94_rating, rohs_compliant,
    color, transparency
) VALUES
('Cycolac ABS MG47', 'SABIC', 'ABS', 'MG47', 'High-impact ABS resin for automotive and consumer applications', 
 42.0, 68.0, 250.0, 25.0, 220.0, 98.0, 1.05, 12.0, 0.3, FALSE, 'HB', TRUE, 'Natural', 'Opaque'),

('Ultradur B4300 G6', 'BASF', 'PBT', 'B4300 G6', 'Glass fiber reinforced PBT for electrical and automotive applications',
 140.0, 220.0, 75.0, 3.0, 225.0, 200.0, 1.52, 25.0, 0.08, FALSE, 'V-0', TRUE, 'Black', 'Opaque'),

('Delrin 500P', 'DuPont', 'POM', '500P', 'Acetal homopolymer with excellent mechanical properties',
 70.0, 110.0, 80.0, 25.0, 175.0, 104.0, 1.41, 9.0, 0.2, TRUE, 'HB', TRUE, 'Natural', 'Opaque'),

('Makrolon 2405', 'Covestro', 'PC', '2405', 'General purpose polycarbonate for optical and electronic applications',
 65.0, 95.0, 650.0, 110.0, 230.0, 130.0, 1.20, 10.0, 0.15, FALSE, 'V-2', TRUE, 'Clear', 'Transparent'),

('Hostaform C9021', 'Celanese', 'POM', 'C9021', 'Acetal copolymer with enhanced chemical resistance',
 65.0, 95.0, 65.0, 40.0, 165.0, 100.0, 1.41, 8.5, 0.22, TRUE, 'HB', TRUE, 'Natural', 'Opaque'),

('Ultramid A3WG7', 'BASF', 'PA', 'A3WG7', 'Glass fiber reinforced nylon 66 for demanding applications',
 185.0, 280.0, 100.0, 3.5, 260.0, 230.0, 1.37, 35.0, 1.2, FALSE, 'V-2', TRUE, 'Black', 'Opaque');

-- Insert material-vendor relationships with pricing
INSERT INTO material_vendors (material_id, vendor_id, price, currency, minimum_order, product_url, availability) VALUES
(1, 1, 2.85, 'USD', 25.0, 'https://www.sabic.com/en/products/polymers/abs-resins/cycolac-mg47', 'in_stock'),
(2, 2, 4.20, 'USD', 25.0, 'https://www.basf.com/global/en/products/plastics/engineering-plastics/ultradur.html', 'in_stock'),
(3, 3, 5.15, 'USD', 10.0, 'https://www.dupont.com/products/delrin-acetal-resin.html', 'in_stock'),
(4, 4, 3.75, 'USD', 25.0, 'https://www.covestro.com/en/products/makrolon', 'in_stock'),
(5, 5, 4.95, 'USD', 25.0, 'https://www.celanese.com/products/hostaform-acetal', 'in_stock'),
(6, 2, 6.80, 'USD', 25.0, 'https://www.basf.com/global/en/products/plastics/engineering-plastics/ultramid.html', 'in_stock');

-- Create indexes for better performance
CREATE INDEX idx_materials_type ON materials(material_type);
CREATE INDEX idx_materials_manufacturer ON materials(manufacturer);
CREATE INDEX idx_materials_tensile ON materials(tensile_strength);
CREATE INDEX idx_materials_density ON materials(density);
CREATE INDEX idx_material_vendors_material ON material_vendors(material_id);
CREATE INDEX idx_material_vendors_vendor ON material_vendors(vendor_id);