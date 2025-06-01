import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calculator, Search, Zap } from "lucide-react";

interface AdvancedSearchProps {
  onSearchResults: (results: any[]) => void;
}

export default function AdvancedSearch({ onSearchResults }: AdvancedSearchProps) {
  // Formula Calculator State
  const [calculatorValues, setCalculatorValues] = useState({
    tensileStrength: '',
    elongation: '',
    density: '',
    temperature: '',
    thickness: '',
    load: '',
  });

  const [calculatorResults, setCalculatorResults] = useState({
    youngModulus: 0,
    stressAtBreak: 0,
    volumetricStress: 0,
    thermalStress: 0,
    safetyFactor: 0,
  });

  // Advanced Search State
  const [searchCriteria, setSearchCriteria] = useState({
    application: '',
    environment: '',
    processTemperature: '',
    chemicalResistance: '',
    mechanicalRequirement: '',
    costRange: '',
  });

  // Technical formulas for material calculations
  const calculateProperties = () => {
    const tensile = parseFloat(calculatorValues.tensileStrength) || 0;
    const elongation = parseFloat(calculatorValues.elongation) || 0;
    const density = parseFloat(calculatorValues.density) || 0;
    const temperature = parseFloat(calculatorValues.temperature) || 0;
    const thickness = parseFloat(calculatorValues.thickness) || 0;
    const load = parseFloat(calculatorValues.load) || 0;

    // Young's Modulus approximation (E = σ/ε)
    const youngModulus = elongation > 0 ? tensile / (elongation / 100) : 0;

    // Stress at break
    const stressAtBreak = thickness > 0 ? load / (thickness * thickness) : 0;

    // Volumetric stress calculation
    const volumetricStress = density * 9.81 * thickness; // ρ * g * h

    // Thermal stress approximation
    const thermalExpansion = 0.00002; // typical polymer value
    const thermalStress = youngModulus * thermalExpansion * temperature;

    // Safety factor
    const safetyFactor = tensile > 0 ? tensile / Math.max(stressAtBreak, thermalStress, 1) : 0;

    setCalculatorResults({
      youngModulus: Math.round(youngModulus * 100) / 100,
      stressAtBreak: Math.round(stressAtBreak * 100) / 100,
      volumetricStress: Math.round(volumetricStress * 100) / 100,
      thermalStress: Math.round(thermalStress * 100) / 100,
      safetyFactor: Math.round(safetyFactor * 100) / 100,
    });
  };

  const performAdvancedSearch = async () => {
    // Build search parameters based on application requirements
    const searchParams = new URLSearchParams();
    
    // Application-specific requirements
    if (searchCriteria.application === 'automotive') {
      searchParams.append('tensileStrengthMin', '40');
      searchParams.append('heatDeflectionTempMin', '80');
    } else if (searchCriteria.application === 'medical') {
      searchParams.append('fdaApproved', 'true');
      searchParams.append('waterAbsorption', '0.5');
    } else if (searchCriteria.application === 'electronics') {
      searchParams.append('ul94Rating', 'V-0');
      searchParams.append('thermalConductivity', '0.2');
    }

    // Environmental conditions
    if (searchCriteria.environment === 'outdoor') {
      searchParams.append('uvResistance', 'true');
      searchParams.append('weatherResistance', 'true');
    } else if (searchCriteria.environment === 'chemical') {
      searchParams.append('chemicalResistance', 'excellent');
    }

    // Process temperature requirements
    if (searchCriteria.processTemperature) {
      const temp = parseInt(searchCriteria.processTemperature);
      searchParams.append('meltingTempMax', (temp + 50).toString());
      searchParams.append('meltingTempMin', (temp - 20).toString());
    }

    try {
      const response = await fetch(`/api/materials?${searchParams.toString()}`);
      const materials = await response.json();
      onSearchResults(materials);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Zap className="h-6 w-6 mr-2" />
          Advanced Technical Tools
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="calculator" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calculator">
              <Calculator className="h-4 w-4 mr-2" />
              Property Calculator
            </TabsTrigger>
            <TabsTrigger value="search">
              <Search className="h-4 w-4 mr-2" />
              Application Search
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculator" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Input Parameters</h4>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="tensileStrength">Tensile Strength (MPa)</Label>
                    <Input
                      id="tensileStrength"
                      type="number"
                      value={calculatorValues.tensileStrength}
                      onChange={(e) => setCalculatorValues(prev => ({
                        ...prev,
                        tensileStrength: e.target.value
                      }))}
                      placeholder="e.g., 45"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="elongation">Elongation (%)</Label>
                    <Input
                      id="elongation"
                      type="number"
                      value={calculatorValues.elongation}
                      onChange={(e) => setCalculatorValues(prev => ({
                        ...prev,
                        elongation: e.target.value
                      }))}
                      placeholder="e.g., 3.5"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="density">Density (g/cm³)</Label>
                    <Input
                      id="density"
                      type="number"
                      step="0.01"
                      value={calculatorValues.density}
                      onChange={(e) => setCalculatorValues(prev => ({
                        ...prev,
                        density: e.target.value
                      }))}
                      placeholder="e.g., 1.05"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="temperature">Temperature (°C)</Label>
                    <Input
                      id="temperature"
                      type="number"
                      value={calculatorValues.temperature}
                      onChange={(e) => setCalculatorValues(prev => ({
                        ...prev,
                        temperature: e.target.value
                      }))}
                      placeholder="e.g., 80"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="thickness">Thickness (mm)</Label>
                    <Input
                      id="thickness"
                      type="number"
                      step="0.1"
                      value={calculatorValues.thickness}
                      onChange={(e) => setCalculatorValues(prev => ({
                        ...prev,
                        thickness: e.target.value
                      }))}
                      placeholder="e.g., 2.0"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="load">Applied Load (N)</Label>
                    <Input
                      id="load"
                      type="number"
                      value={calculatorValues.load}
                      onChange={(e) => setCalculatorValues(prev => ({
                        ...prev,
                        load: e.target.value
                      }))}
                      placeholder="e.g., 1000"
                    />
                  </div>
                </div>

                <Button onClick={calculateProperties} className="w-full">
                  Calculate Properties
                </Button>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Calculated Results</h4>
                
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Young's Modulus:</span>
                    <Badge variant="secondary">{calculatorResults.youngModulus} MPa</Badge>
                  </div>
                  
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Stress at Break:</span>
                    <Badge variant="secondary">{calculatorResults.stressAtBreak} MPa</Badge>
                  </div>
                  
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Volumetric Stress:</span>
                    <Badge variant="secondary">{calculatorResults.volumetricStress} Pa</Badge>
                  </div>
                  
                  <div className="flex justify-between p-3 bg-gray-50 rounded">
                    <span className="font-medium">Thermal Stress:</span>
                    <Badge variant="secondary">{calculatorResults.thermalStress} MPa</Badge>
                  </div>
                  
                  <div className="flex justify-between p-3 bg-blue-50 rounded border border-blue-200">
                    <span className="font-medium text-blue-900">Safety Factor:</span>
                    <Badge className={calculatorResults.safetyFactor > 2 ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}>
                      {calculatorResults.safetyFactor}
                    </Badge>
                  </div>
                </div>

                <div className="text-xs text-gray-600 p-3 bg-gray-50 rounded">
                  <p><strong>Note:</strong> Calculations are approximations for preliminary assessment. 
                  Consult material datasheets and perform testing for final applications.</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="search" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Application Requirements</h4>
                
                <div>
                  <Label htmlFor="application">Application Area</Label>
                  <Select onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, application: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select application" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="medical">Medical & Healthcare</SelectItem>
                      <SelectItem value="electronics">Electronics</SelectItem>
                      <SelectItem value="packaging">Packaging</SelectItem>
                      <SelectItem value="consumer">Consumer Goods</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="aerospace">Aerospace</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="environment">Operating Environment</Label>
                  <Select onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, environment: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select environment" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="indoor">Indoor Standard</SelectItem>
                      <SelectItem value="outdoor">Outdoor/UV Exposure</SelectItem>
                      <SelectItem value="chemical">Chemical Resistance</SelectItem>
                      <SelectItem value="high-temp">High Temperature</SelectItem>
                      <SelectItem value="food-contact">Food Contact</SelectItem>
                      <SelectItem value="electrical">Electrical Insulation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="processTemperature">Process Temperature (°C)</Label>
                  <Input
                    id="processTemperature"
                    type="number"
                    value={searchCriteria.processTemperature}
                    onChange={(e) => setSearchCriteria(prev => ({
                      ...prev,
                      processTemperature: e.target.value
                    }))}
                    placeholder="e.g., 200"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Performance Criteria</h4>
                
                <div>
                  <Label htmlFor="mechanicalRequirement">Mechanical Requirement</Label>
                  <Select onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, mechanicalRequirement: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select requirement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high-strength">High Strength</SelectItem>
                      <SelectItem value="high-impact">High Impact Resistance</SelectItem>
                      <SelectItem value="flexibility">Flexibility</SelectItem>
                      <SelectItem value="rigidity">High Rigidity</SelectItem>
                      <SelectItem value="fatigue">Fatigue Resistance</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="chemicalResistance">Chemical Resistance</Label>
                  <Select onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, chemicalResistance: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resistance level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="standard">Standard</SelectItem>
                      <SelectItem value="acids">Acid Resistant</SelectItem>
                      <SelectItem value="bases">Base Resistant</SelectItem>
                      <SelectItem value="solvents">Solvent Resistant</SelectItem>
                      <SelectItem value="oils">Oil Resistant</SelectItem>
                      <SelectItem value="excellent">Excellent (All)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="costRange">Cost Range</Label>
                  <Select onValueChange={(value) => setSearchCriteria(prev => ({ ...prev, costRange: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select cost range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="economy">Economy (< $3/kg)</SelectItem>
                      <SelectItem value="standard">Standard ($3-6/kg)</SelectItem>
                      <SelectItem value="premium">Premium (> $6/kg)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Button onClick={performAdvancedSearch} className="w-full" size="lg">
              Find Matching Materials
            </Button>

            {searchCriteria.application && (
              <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded">
                <h5 className="font-semibold text-blue-900 mb-2">Search Configuration</h5>
                <div className="flex flex-wrap gap-2">
                  {searchCriteria.application && (
                    <Badge variant="outline">App: {searchCriteria.application}</Badge>
                  )}
                  {searchCriteria.environment && (
                    <Badge variant="outline">Env: {searchCriteria.environment}</Badge>
                  )}
                  {searchCriteria.processTemperature && (
                    <Badge variant="outline">Temp: {searchCriteria.processTemperature}°C</Badge>
                  )}
                  {searchCriteria.mechanicalRequirement && (
                    <Badge variant="outline">Mech: {searchCriteria.mechanicalRequirement}</Badge>
                  )}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}