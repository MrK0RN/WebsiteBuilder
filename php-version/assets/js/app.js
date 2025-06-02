// PlasticDB JavaScript Application
class PlasticDB {
    constructor() {
        this.materials = [];
        this.selectedMaterials = [];
        this.favorites = new Set();
        this.currentView = 'grid';
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadMaterials();
        this.showPage('home');
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = e.target.closest('.nav-link').dataset.page;
                this.showPage(page);
            });
        });

        // Search and filters
        document.getElementById('search-btn').addEventListener('click', () => this.searchMaterials());
        document.getElementById('clear-filters').addEventListener('click', () => this.clearFilters());

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.view-btn').dataset.view;
                this.toggleView(view);
            });
        });

        // Calculator
        document.getElementById('calculate-btn').addEventListener('click', () => this.calculateProperties());

        // Admin form
        document.getElementById('material-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addMaterial();
        });

        // Modal close
        document.querySelector('.close').addEventListener('click', () => this.closeModal());
        document.getElementById('material-modal').addEventListener('click', (e) => {
            if (e.target.id === 'material-modal') this.closeModal();
        });

        // Compare selector
        document.getElementById('compare-select').addEventListener('change', (e) => {
            if (e.target.value) {
                this.addToComparison(parseInt(e.target.value));
                e.target.value = '';
            }
        });

        // Auto-search on filter change
        ['search', 'material-type', 'manufacturer', 'fda-approved', 'ul94-rating'].forEach(id => {
            document.getElementById(id).addEventListener('change', () => this.searchMaterials());
        });

        ['tensile-min', 'tensile-max', 'temp-min', 'temp-max', 'density-min', 'density-max'].forEach(id => {
            document.getElementById(id).addEventListener('input', this.debounce(() => this.searchMaterials(), 500));
        });
    }

    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    showPage(page) {
        // Update navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        document.querySelector(`[data-page="${page}"]`).classList.add('active');

        // Show page
        document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
        document.getElementById(`${page}-page`).classList.add('active');

        // Load page-specific data
        if (page === 'compare') {
            this.loadCompareOptions();
        }
    }

    async loadMaterials(filters = {}) {
        try {
            const params = new URLSearchParams(filters);
            const response = await fetch(`api/materials.php?${params}`);
            this.materials = await response.json();
            this.renderMaterials();
        } catch (error) {
            console.error('Error loading materials:', error);
            this.showError('Failed to load materials');
        }
    }

    searchMaterials() {
        const filters = {};

        const search = document.getElementById('search').value.trim();
        if (search) filters.search = search;

        const materialType = document.getElementById('material-type').value;
        if (materialType) filters.material_type = materialType;

        const manufacturer = document.getElementById('manufacturer').value;
        if (manufacturer) filters.manufacturer = manufacturer;

        const tensileMin = document.getElementById('tensile-min').value;
        if (tensileMin) filters.tensile_strength_min = tensileMin;

        const tensileMax = document.getElementById('tensile-max').value;
        if (tensileMax) filters.tensile_strength_max = tensileMax;

        const tempMin = document.getElementById('temp-min').value;
        if (tempMin) filters.melting_temp_min = tempMin;

        const tempMax = document.getElementById('temp-max').value;
        if (tempMax) filters.melting_temp_max = tempMax;

        const densityMin = document.getElementById('density-min').value;
        if (densityMin) filters.density_min = densityMin;

        const densityMax = document.getElementById('density-max').value;
        if (densityMax) filters.density_max = densityMax;

        const fdaApproved = document.getElementById('fda-approved').value;
        if (fdaApproved) filters.fda_approved = fdaApproved;

        const ul94Rating = document.getElementById('ul94-rating').value;
        if (ul94Rating) filters.ul94_rating = ul94Rating;

        this.loadMaterials(filters);
    }

    clearFilters() {
        document.getElementById('search').value = '';
        document.getElementById('material-type').value = '';
        document.getElementById('manufacturer').value = '';
        document.getElementById('tensile-min').value = '';
        document.getElementById('tensile-max').value = '';
        document.getElementById('temp-min').value = '';
        document.getElementById('temp-max').value = '';
        document.getElementById('density-min').value = '';
        document.getElementById('density-max').value = '';
        document.getElementById('fda-approved').value = '';
        document.getElementById('ul94-rating').value = '';
        this.loadMaterials();
    }

    renderMaterials() {
        const grid = document.getElementById('materials-grid');
        
        if (this.materials.length === 0) {
            grid.innerHTML = '<div class="loading">No materials found matching your criteria</div>';
            return;
        }

        grid.innerHTML = this.materials.map(material => this.createMaterialCard(material)).join('');
    }

    createMaterialCard(material) {
        const typeColor = this.getMaterialTypeColor(material.material_type);
        
        return `
            <div class="material-card" onclick="app.showMaterialDetails(${material.id})">
                <div class="material-header">
                    <div class="material-title">
                        <h3>${material.name}</h3>
                        <p>${material.manufacturer}</p>
                    </div>
                    <span class="material-type" style="background-color: ${typeColor}">
                        ${material.material_type}
                    </span>
                </div>
                
                <div class="material-properties">
                    ${material.tensile_strength ? `
                        <div class="property">
                            <div class="property-label">Tensile Strength</div>
                            <div class="property-value">${material.tensile_strength} MPa</div>
                        </div>
                    ` : ''}
                    ${material.density ? `
                        <div class="property">
                            <div class="property-label">Density</div>
                            <div class="property-value">${material.density} g/cm³</div>
                        </div>
                    ` : ''}
                    ${material.melting_temperature ? `
                        <div class="property">
                            <div class="property-label">Melting Temp</div>
                            <div class="property-value">${material.melting_temperature}°C</div>
                        </div>
                    ` : ''}
                    ${material.fda_approved ? `
                        <div class="property">
                            <div class="property-label">FDA Approved</div>
                            <div class="property-value">✓ Yes</div>
                        </div>
                    ` : ''}
                </div>
                
                <div class="material-actions">
                    <button class="btn btn-primary btn-small" onclick="event.stopPropagation(); app.showMaterialDetails(${material.id})">
                        <i class="fas fa-eye"></i> View Details
                    </button>
                    <button class="btn btn-secondary btn-small" onclick="event.stopPropagation(); app.addToComparison(${material.id})">
                        <i class="fas fa-chart-bar"></i> Compare
                    </button>
                    <button class="btn btn-success btn-small" onclick="event.stopPropagation(); app.toggleFavorite(${material.id})">
                        <i class="fas fa-heart"></i> Favorite
                    </button>
                </div>
            </div>
        `;
    }

    getMaterialTypeColor(type) {
        const colors = {
            'ABS': '#3182ce',
            'PC': '#38a169',
            'POM': '#d69e2e',
            'PBT': '#805ad5',
            'PA': '#e53e3e'
        };
        return colors[type] || '#718096';
    }

    async showMaterialDetails(id) {
        try {
            const response = await fetch(`api/materials.php?id=${id}`);
            const material = await response.json();
            
            const vendorsResponse = await fetch(`api/vendors.php?material_id=${id}`);
            const vendors = await vendorsResponse.json();

            this.renderMaterialModal(material, vendors);
            document.getElementById('material-modal').style.display = 'block';
        } catch (error) {
            console.error('Error loading material details:', error);
            this.showError('Failed to load material details');
        }
    }

    renderMaterialModal(material, vendors) {
        const details = document.getElementById('material-details');
        
        details.innerHTML = `
            <div class="material-detail-header">
                <h2>${material.name}</h2>
                <p class="manufacturer">${material.manufacturer} - ${material.material_type}</p>
                ${material.description ? `<p class="description">${material.description}</p>` : ''}
            </div>

            <div class="properties-section">
                <h3>Technical Properties</h3>
                <div class="properties-grid">
                    ${this.renderProperty('Tensile Strength', material.tensile_strength, 'MPa')}
                    ${this.renderProperty('Flexural Strength', material.flexural_strength, 'MPa')}
                    ${this.renderProperty('Impact Strength', material.impact_strength, 'kJ/m²')}
                    ${this.renderProperty('Elongation at Break', material.elongation_at_break, '%')}
                    ${this.renderProperty('Melting Temperature', material.melting_temperature, '°C')}
                    ${this.renderProperty('Heat Deflection Temp', material.heat_deflection_temp, '°C')}
                    ${this.renderProperty('Density', material.density, 'g/cm³')}
                    ${this.renderProperty('MFR', material.mfr, 'g/10 min')}
                    ${this.renderProperty('Water Absorption', material.water_absorption, '%')}
                    ${this.renderProperty('FDA Approved', material.fda_approved ? 'Yes' : 'No')}
                    ${this.renderProperty('UL94 Rating', material.ul94_rating)}
                    ${this.renderProperty('Color', material.color)}
                </div>
            </div>

            ${vendors.length > 0 ? `
                <div class="vendors-section">
                    <h3>Suppliers & Pricing</h3>
                    <div class="vendors-grid">
                        ${vendors.map(vendor => `
                            <div class="vendor-card">
                                <h4>${vendor.name}</h4>
                                <p class="price">$${vendor.price}/${vendor.currency} per kg</p>
                                <p class="min-order">Min. order: ${vendor.minimum_order} kg</p>
                                <p class="availability">Status: ${vendor.availability}</p>
                                ${vendor.product_url ? `
                                    <a href="${vendor.product_url}" target="_blank" class="btn btn-primary btn-small">
                                        <i class="fas fa-external-link-alt"></i> Buy Now
                                    </a>
                                ` : ''}
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}
        `;
    }

    renderProperty(label, value, unit = '') {
        if (value === null || value === undefined || value === '') return '';
        return `
            <div class="property-item">
                <span class="property-label">${label}:</span>
                <span class="property-value">${value}${unit ? ' ' + unit : ''}</span>
            </div>
        `;
    }

    closeModal() {
        document.getElementById('material-modal').style.display = 'none';
    }

    toggleView(view) {
        this.currentView = view;
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${view}"]`).classList.add('active');
        
        const grid = document.getElementById('materials-grid');
        if (view === 'list') {
            grid.classList.add('list-view');
        } else {
            grid.classList.remove('list-view');
        }
    }

    // Calculator functions
    calculateProperties() {
        const tensile = parseFloat(document.getElementById('calc-tensile').value) || 0;
        const elongation = parseFloat(document.getElementById('calc-elongation').value) || 0;
        const density = parseFloat(document.getElementById('calc-density').value) || 0;
        const temperature = parseFloat(document.getElementById('calc-temp').value) || 0;
        const thickness = parseFloat(document.getElementById('calc-thickness').value) || 0;
        const load = parseFloat(document.getElementById('calc-load').value) || 0;

        // Engineering calculations
        const youngModulus = elongation > 0 ? tensile / (elongation / 100) : 0;
        const stressAtBreak = thickness > 0 ? load / (thickness * thickness) : 0;
        const volumetricStress = density * 9.81 * thickness;
        const thermalExpansion = 0.00002;
        const thermalStress = youngModulus * thermalExpansion * temperature;
        const safetyFactor = tensile > 0 ? tensile / Math.max(stressAtBreak, thermalStress, 1) : 0;

        this.displayCalculationResults({
            youngModulus: Math.round(youngModulus * 100) / 100,
            stressAtBreak: Math.round(stressAtBreak * 100) / 100,
            volumetricStress: Math.round(volumetricStress * 100) / 100,
            thermalStress: Math.round(thermalStress * 100) / 100,
            safetyFactor: Math.round(safetyFactor * 100) / 100
        });
    }

    displayCalculationResults(results) {
        const container = document.getElementById('calculation-results');
        container.innerHTML = `
            <div class="result-item">
                <span class="result-label">Young's Modulus:</span>
                <span class="result-value">${results.youngModulus} MPa</span>
            </div>
            <div class="result-item">
                <span class="result-label">Stress at Break:</span>
                <span class="result-value">${results.stressAtBreak} MPa</span>
            </div>
            <div class="result-item">
                <span class="result-label">Volumetric Stress:</span>
                <span class="result-value">${results.volumetricStress} Pa</span>
            </div>
            <div class="result-item">
                <span class="result-label">Thermal Stress:</span>
                <span class="result-value">${results.thermalStress} MPa</span>
            </div>
            <div class="result-item ${results.safetyFactor > 2 ? 'safe' : 'warning'}">
                <span class="result-label">Safety Factor:</span>
                <span class="result-value">${results.safetyFactor}</span>
            </div>
        `;
    }

    // Compare functionality
    loadCompareOptions() {
        const select = document.getElementById('compare-select');
        select.innerHTML = '<option value="">Select a material...</option>' +
            this.materials.map(material => 
                `<option value="${material.id}">${material.name} - ${material.manufacturer}</option>`
            ).join('');
    }

    addToComparison(materialId) {
        const material = this.materials.find(m => m.id === materialId);
        if (material && !this.selectedMaterials.find(m => m.id === materialId)) {
            this.selectedMaterials.push(material);
            this.renderComparisonTable();
        }
    }

    renderComparisonTable() {
        const container = document.getElementById('comparison-table');
        
        if (this.selectedMaterials.length === 0) {
            container.innerHTML = '<p>No materials selected for comparison</p>';
            return;
        }

        const properties = [
            { key: 'manufacturer', label: 'Manufacturer', unit: '' },
            { key: 'material_type', label: 'Material Type', unit: '' },
            { key: 'tensile_strength', label: 'Tensile Strength', unit: 'MPa' },
            { key: 'flexural_strength', label: 'Flexural Strength', unit: 'MPa' },
            { key: 'impact_strength', label: 'Impact Strength', unit: 'kJ/m²' },
            { key: 'elongation_at_break', label: 'Elongation at Break', unit: '%' },
            { key: 'melting_temperature', label: 'Melting Temperature', unit: '°C' },
            { key: 'heat_deflection_temp', label: 'Heat Deflection Temp', unit: '°C' },
            { key: 'density', label: 'Density', unit: 'g/cm³' },
            { key: 'mfr', label: 'Melt Flow Rate', unit: 'g/10 min' },
            { key: 'water_absorption', label: 'Water Absorption', unit: '%' },
            { key: 'fda_approved', label: 'FDA Approved', unit: '' },
            { key: 'ul94_rating', label: 'UL94 Rating', unit: '' }
        ];

        let tableHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Property</th>
                        ${this.selectedMaterials.map(material => 
                            `<th>
                                ${material.name}<br>
                                <small>${material.manufacturer}</small>
                                <button onclick="app.removeFromComparison(${material.id})" class="btn btn-danger btn-small">×</button>
                            </th>`
                        ).join('')}
                    </tr>
                </thead>
                <tbody>
        `;

        properties.forEach(prop => {
            tableHTML += `
                <tr>
                    <td><strong>${prop.label}${prop.unit ? ` (${prop.unit})` : ''}</strong></td>
                    ${this.selectedMaterials.map(material => {
                        let value = material[prop.key];
                        if (prop.key === 'fda_approved') {
                            value = value ? 'Yes' : 'No';
                        } else if (value === null || value === undefined) {
                            value = '-';
                        }
                        return `<td>${value}</td>`;
                    }).join('')}
                </tr>
            `;
        });

        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    }

    removeFromComparison(materialId) {
        this.selectedMaterials = this.selectedMaterials.filter(m => m.id !== materialId);
        this.renderComparisonTable();
    }

    // Admin functionality
    async addMaterial() {
        const formData = {
            name: document.getElementById('mat-name').value,
            manufacturer: document.getElementById('mat-manufacturer').value,
            material_type: document.getElementById('mat-type').value,
            grade: document.getElementById('mat-grade').value,
            description: document.getElementById('mat-description').value,
            tensile_strength: document.getElementById('mat-tensile').value || null,
            density: document.getElementById('mat-density').value || null,
            melting_temperature: document.getElementById('mat-melting').value || null,
            fda_approved: document.getElementById('mat-fda').value === 'true'
        };

        try {
            const response = await fetch('api/materials.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            
            if (response.ok) {
                this.showSuccess('Material added successfully');
                document.getElementById('material-form').reset();
                this.loadMaterials();
            } else {
                this.showError(result.message || 'Failed to add material');
            }
        } catch (error) {
            console.error('Error adding material:', error);
            this.showError('Failed to add material');
        }
    }

    toggleFavorite(materialId) {
        if (this.favorites.has(materialId)) {
            this.favorites.delete(materialId);
            this.showSuccess('Removed from favorites');
        } else {
            this.favorites.add(materialId);
            this.showSuccess('Added to favorites');
        }
    }

    showError(message) {
        this.showNotification(message, 'error');
    }

    showSuccess(message) {
        this.showNotification(message, 'success');
    }

    showNotification(message, type) {
        // Simple notification system
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            border-radius: 6px;
            color: white;
            z-index: 10000;
            background-color: ${type === 'error' ? '#f56565' : '#48bb78'};
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the application
const app = new PlasticDB();