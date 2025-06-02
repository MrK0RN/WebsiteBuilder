# PlasticDB - PHP Version

A comprehensive plastic materials database application built with PHP, HTML, CSS, and JavaScript.

## Features

- **Material Search & Filtering**: Advanced search with multiple filter criteria
- **Material Comparison**: Side-by-side technical specifications comparison
- **Technical Calculator**: Engineering property calculations with formulas
- **Admin Panel**: Add new materials and manage database
- **Vendor Integration**: Supplier information and pricing
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Requirements

- PHP 7.4 or higher
- MySQL 5.7 or MariaDB 10.3+
- Web server (Apache/Nginx)
- PDO MySQL extension

## Installation

### 1. Database Setup

Create a MySQL database and import the schema:

```sql
mysql -u root -p
CREATE DATABASE plasticdb;
```

Import the database structure:
```bash
mysql -u root -p plasticdb < database.sql
```

### 2. Configure Database Connection

Edit `config/database.php` and update the connection settings:

```php
private $host = 'localhost';
private $db_name = 'plasticdb';
private $username = 'your_username';
private $password = 'your_password';
```

### 3. Web Server Setup

#### Apache
```apache
<VirtualHost *:80>
    ServerName plasticdb.local
    DocumentRoot /path/to/php-version
    DirectoryIndex index.html
    
    <Directory /path/to/php-version>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name plasticdb.local;
    root /path/to/php-version;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
        include fastcgi_params;
    }
}
```

## API Endpoints

### Materials
- `GET api/materials.php` - Get all materials with optional filters
- `GET api/materials.php?id=1` - Get specific material
- `POST api/materials.php` - Add new material

### Vendors
- `GET api/vendors.php` - Get all vendors
- `GET api/vendors.php?material_id=1` - Get vendors for specific material

### Available Filters
- `material_type` - Filter by material type (ABS, PC, POM, etc.)
- `manufacturer` - Filter by manufacturer
- `tensile_strength_min/max` - Filter by tensile strength range
- `melting_temp_min/max` - Filter by melting temperature range
- `density_min/max` - Filter by density range
- `fda_approved` - Filter by FDA approval (true/false)
- `ul94_rating` - Filter by UL94 rating
- `search` - Text search in name, manufacturer, description

## Usage

### Material Search
1. Open the application in your browser
2. Use the search filters to find materials
3. Click on material cards to view detailed specifications
4. Use the "Compare" button to add materials to comparison

### Property Calculator
1. Navigate to the Calculator tab
2. Enter material properties (tensile strength, elongation, etc.)
3. Click "Calculate Properties" to get engineering calculations
4. Results include Young's modulus, safety factors, and stress analysis

### Material Comparison
1. Navigate to the Compare tab
2. Select materials from the dropdown
3. View side-by-side technical specifications
4. Remove materials by clicking the × button

### Admin Panel
1. Navigate to the Admin tab
2. Fill out the material form with technical specifications
3. Click "Add Material" to save to database

## Database Schema

The application includes these main tables:

- **materials**: Core material properties and specifications
- **vendors**: Supplier information
- **material_vendors**: Pricing and vendor relationships
- **favorites**: User favorite materials (optional)
- **reviews**: User reviews and ratings (optional)

## Customization

### Adding New Material Types
Update the material type options in:
- `index.html` (filter dropdown and admin form)
- `assets/js/app.js` (getMaterialTypeColor function)

### Styling
Modify `assets/css/style.css` to customize the appearance.

### New Properties
1. Add columns to the materials table
2. Update the Material model in `models/Material.php`
3. Add form fields in the admin panel
4. Update the comparison table properties

## Sample Data

The database includes sample materials from major manufacturers:
- SABIC Cycolac ABS MG47
- BASF Ultradur B4300 G6
- DuPont Delrin 500P
- Covestro Makrolon 2405
- Celanese Hostaform C9021
- BASF Ultramid A3WG7

## Troubleshooting

### Database Connection Issues
- Verify MySQL credentials in `config/database.php`
- Check if MySQL service is running
- Ensure PDO MySQL extension is installed

### PHP Errors
- Check PHP error logs
- Verify PHP version compatibility
- Ensure all required extensions are installed

### API Not Working
- Check web server configuration
- Verify file permissions
- Test API endpoints directly in browser

## Security Considerations

- Always validate and sanitize user input
- Use prepared statements for database queries
- Implement proper authentication for admin functions
- Enable HTTPS in production
- Regular database backups

## Performance Optimization

- Add database indexes for frequently searched columns
- Implement query result caching
- Optimize images and static assets
- Use compression for CSS/JS files

## License

This project is provided as-is for educational and commercial use.