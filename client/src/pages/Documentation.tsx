import Header from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Search, Database, Settings, Heart, BarChart3, ExternalLink } from "lucide-react";

export default function Documentation() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <FileText className="h-8 w-8 mr-3 text-primary" />
            Documentation
          </h1>
          <p className="text-gray-600">
            Complete guide to using the PlasticDB materials database
          </p>
        </div>

        <Tabs defaultValue="getting-started" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="search">Search & Filter</TabsTrigger>
            <TabsTrigger value="materials">Material Data</TabsTrigger>
            <TabsTrigger value="features">Features</TabsTrigger>
            <TabsTrigger value="api">API Reference</TabsTrigger>
          </TabsList>

          <TabsContent value="getting-started">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Welcome to PlasticDB</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p>
                    PlasticDB is a comprehensive database for industrial plastic materials. 
                    Find detailed specifications, compare properties, and locate suppliers for 
                    thousands of engineering plastics.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Search className="h-5 w-5 mr-2 text-primary" />
                        Search Materials
                      </h4>
                      <p className="text-sm text-gray-600">
                        Use advanced filters to find materials by type, properties, certifications, and more.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <Heart className="h-5 w-5 mr-2 text-red-500" />
                        Save Favorites
                      </h4>
                      <p className="text-sm text-gray-600">
                        Save materials to your favorites list for quick access and future reference.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <BarChart3 className="h-5 w-5 mr-2 text-green-500" />
                        Compare Properties
                      </h4>
                      <p className="text-sm text-gray-600">
                        Compare technical specifications of multiple materials side by side.
                      </p>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-2 flex items-center">
                        <ExternalLink className="h-5 w-5 mr-2 text-blue-500" />
                        Find Suppliers
                      </h4>
                      <p className="text-sm text-gray-600">
                        Access vendor information, pricing, and direct links to purchase materials.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="search">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Search and Filtering</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <h4 className="font-semibold">Basic Filters</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Material Type:</strong> ABS, PLA, PETG, Nylon (PA), Polycarbonate (PC), POM, PEEK, PP, PE</li>
                    <li><strong>Manufacturer:</strong> Filter by major polymer manufacturers like BASF, SABIC, DuPont, Covestro</li>
                    <li><strong>Temperature Range:</strong> Set minimum and maximum melting temperatures</li>
                    <li><strong>Tensile Strength:</strong> Filter by mechanical strength requirements</li>
                  </ul>
                  
                  <h4 className="font-semibold">Advanced Filters</h4>
                  <ul className="space-y-2 text-sm">
                    <li><strong>Melt Flow Rate (MFR):</strong> Processing parameter for injection molding</li>
                    <li><strong>Density:</strong> Material weight per unit volume</li>
                    <li><strong>Impact Strength:</strong> Resistance to impact loading</li>
                    <li><strong>Certifications:</strong> FDA approval, UL94 flame ratings</li>
                    <li><strong>Color Options:</strong> Natural, Black, White, Transparent, Custom</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="materials">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Material Properties Guide</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Mechanical Properties</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Badge variant="outline" className="mb-2">Tensile Strength (MPa)</Badge>
                        <p className="text-sm text-gray-600">Maximum stress a material can withstand while being stretched</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">Flexural Strength (MPa)</Badge>
                        <p className="text-sm text-gray-600">Resistance to deformation under bending</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">Impact Strength (kJ/m²)</Badge>
                        <p className="text-sm text-gray-600">Energy absorbed before fracturing under impact</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">Elongation at Break (%)</Badge>
                        <p className="text-sm text-gray-600">Maximum strain before material failure</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Thermal Properties</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Badge variant="outline" className="mb-2">Melting Temperature (°C)</Badge>
                        <p className="text-sm text-gray-600">Temperature at which material transitions to liquid</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">Heat Deflection Temperature (°C)</Badge>
                        <p className="text-sm text-gray-600">Temperature at which material deforms under load</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">Vicat Softening Point (°C)</Badge>
                        <p className="text-sm text-gray-600">Temperature at which material softens</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">Thermal Expansion (/°C)</Badge>
                        <p className="text-sm text-gray-600">Dimensional change per degree temperature change</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Physical Properties</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Badge variant="outline" className="mb-2">Density (g/cm³)</Badge>
                        <p className="text-sm text-gray-600">Mass per unit volume</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">MFR (g/10 min)</Badge>
                        <p className="text-sm text-gray-600">Melt flow rate for processing assessment</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">Water Absorption (%)</Badge>
                        <p className="text-sm text-gray-600">Percentage of water absorbed under standard conditions</p>
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-2">Shore Hardness</Badge>
                        <p className="text-sm text-gray-600">Surface hardness measurement</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="features">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Platform Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Database className="h-5 w-5 mr-2" />
                      Material Database
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 ml-7">
                      <li>• Comprehensive database of engineering plastics</li>
                      <li>• Detailed technical specifications</li>
                      <li>• Authentic data from manufacturer datasheets</li>
                      <li>• Regular updates with new materials</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Search className="h-5 w-5 mr-2" />
                      Advanced Search
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 ml-7">
                      <li>• Multi-parameter filtering</li>
                      <li>• Range-based property searches</li>
                      <li>• Certification and compliance filters</li>
                      <li>• Manufacturer and brand filtering</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2" />
                      Comparison Tools
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 ml-7">
                      <li>• Side-by-side property comparison</li>
                      <li>• Visual property highlighting</li>
                      <li>• Export comparison tables</li>
                      <li>• Material selection assistance</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Settings className="h-5 w-5 mr-2" />
                      Admin Features
                    </h4>
                    <ul className="space-y-1 text-sm text-gray-600 ml-7">
                      <li>• Add new materials and vendors</li>
                      <li>• Update material specifications</li>
                      <li>• Manage vendor relationships</li>
                      <li>• Quality control and validation</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="api">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>API Reference</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Materials Endpoints</h4>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <code className="font-medium">GET /api/materials</code>
                        <p className="text-gray-600 mt-1">Retrieve materials with optional filtering parameters</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <code className="font-medium">GET /api/materials/:id</code>
                        <p className="text-gray-600 mt-1">Get detailed information for a specific material</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <code className="font-medium">POST /api/materials</code>
                        <p className="text-gray-600 mt-1">Create a new material entry (admin only)</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Vendor Endpoints</h4>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <code className="font-medium">GET /api/vendors</code>
                        <p className="text-gray-600 mt-1">List all registered vendors</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <code className="font-medium">GET /api/materials/:id/vendors</code>
                        <p className="text-gray-600 mt-1">Get vendor information and pricing for a material</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Favorites Endpoints</h4>
                    <div className="space-y-3 text-sm">
                      <div className="p-3 bg-gray-50 rounded">
                        <code className="font-medium">GET /api/favorites</code>
                        <p className="text-gray-600 mt-1">Get user's favorite materials</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <code className="font-medium">POST /api/favorites</code>
                        <p className="text-gray-600 mt-1">Add a material to favorites</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded">
                        <code className="font-medium">DELETE /api/favorites/:id</code>
                        <p className="text-gray-600 mt-1">Remove a material from favorites</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}