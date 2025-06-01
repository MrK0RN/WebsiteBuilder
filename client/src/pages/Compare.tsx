import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Plus, BarChart3 } from "lucide-react";
import type { Material } from "@shared/schema";

export default function Compare() {
  const [selectedMaterials, setSelectedMaterials] = useState<Material[]>([]);

  const { data: materials = [] } = useQuery({
    queryKey: ['/api/materials'],
  });

  const addMaterial = (materialId: string) => {
    const material = materials.find((m: Material) => m.id.toString() === materialId);
    if (material && !selectedMaterials.find(m => m.id === material.id)) {
      setSelectedMaterials([...selectedMaterials, material]);
    }
  };

  const removeMaterial = (materialId: number) => {
    setSelectedMaterials(selectedMaterials.filter(m => m.id !== materialId));
  };

  const getMaterialTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'ABS': 'bg-blue-100 text-blue-800',
      'PLA': 'bg-green-100 text-green-800',
      'PETG': 'bg-purple-100 text-purple-800',
      'PA': 'bg-orange-100 text-orange-800',
      'PC': 'bg-teal-100 text-teal-800',
      'POM': 'bg-gray-100 text-gray-800',
      'PBT': 'bg-indigo-100 text-indigo-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.default;
  };

  const properties = [
    { key: 'manufacturer', label: 'Manufacturer', unit: '' },
    { key: 'materialType', label: 'Material Type', unit: '' },
    { key: 'tensileStrength', label: 'Tensile Strength', unit: 'MPa' },
    { key: 'flexuralStrength', label: 'Flexural Strength', unit: 'MPa' },
    { key: 'impactStrength', label: 'Impact Strength', unit: 'kJ/m²' },
    { key: 'elongationAtBreak', label: 'Elongation at Break', unit: '%' },
    { key: 'meltingTemperature', label: 'Melting Temperature', unit: '°C' },
    { key: 'heatDeflectionTemp', label: 'Heat Deflection Temp', unit: '°C' },
    { key: 'density', label: 'Density', unit: 'g/cm³' },
    { key: 'mfr', label: 'Melt Flow Rate', unit: 'g/10 min' },
    { key: 'waterAbsorption', label: 'Water Absorption', unit: '%' },
    { key: 'fdaApproved', label: 'FDA Approved', unit: '' },
    { key: 'ul94Rating', label: 'UL94 Rating', unit: '' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-primary" />
            Compare Materials
          </h1>
          <p className="text-gray-600">
            Compare technical specifications of different plastic materials side by side
          </p>
        </div>

        {/* Material Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Select Materials to Compare</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4 items-center">
              <Select onValueChange={addMaterial}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Add material to compare" />
                </SelectTrigger>
                <SelectContent>
                  {materials
                    .filter((material: Material) => !selectedMaterials.find(m => m.id === material.id))
                    .map((material: Material) => (
                      <SelectItem key={material.id} value={material.id.toString()}>
                        {material.name} - {material.manufacturer}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>

              {selectedMaterials.map((material) => (
                <div key={material.id} className="flex items-center bg-primary/10 text-primary px-3 py-2 rounded-full">
                  <span className="text-sm font-medium mr-2">{material.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMaterial(material.id)}
                    className="h-4 w-4 p-0 text-primary hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}

              {selectedMaterials.length === 0 && (
                <p className="text-gray-500 text-sm">
                  Select at least 2 materials to start comparing
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Table */}
        {selectedMaterials.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Comparison Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left p-3 font-medium text-gray-900">Property</th>
                      {selectedMaterials.map((material) => (
                        <th key={material.id} className="text-center p-3 font-medium text-gray-900 min-w-48">
                          <div className="flex flex-col items-center">
                            <span className="font-semibold mb-1">{material.name}</span>
                            <span className="text-sm text-gray-600">{material.manufacturer}</span>
                            <Badge className={`${getMaterialTypeColor(material.materialType)} mt-1`}>
                              {material.materialType}
                            </Badge>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {properties.map((property, index) => (
                      <tr key={property.key} className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                        <td className="p-3 font-medium text-gray-900">
                          {property.label}
                          {property.unit && <span className="text-gray-500 ml-1">({property.unit})</span>}
                        </td>
                        {selectedMaterials.map((material) => {
                          const value = (material as any)[property.key];
                          let displayValue = value;

                          if (property.key === 'fdaApproved') {
                            displayValue = value ? 'Yes' : 'No';
                          } else if (property.key === 'materialType') {
                            displayValue = (
                              <Badge className={getMaterialTypeColor(value)}>
                                {value}
                              </Badge>
                            );
                          } else if (value === null || value === undefined) {
                            displayValue = '-';
                          }

                          return (
                            <td key={material.id} className="p-3 text-center">
                              {displayValue}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedMaterials.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <BarChart3 className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No materials selected</h3>
            <p className="text-gray-600 mb-6">
              Choose materials from the dropdown above to start comparing their properties
            </p>
          </div>
        )}
      </main>
    </div>
  );
}