import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Search, Settings, ChevronDown, X } from "lucide-react";

interface MaterialSearchFilters {
  materialType?: string;
  manufacturer?: string;
  meltingTempMin?: number;
  meltingTempMax?: number;
  tensileStrengthMin?: number;
  tensileStrengthMax?: number;
  mfrMin?: number;
  mfrMax?: number;
  densityMin?: number;
  densityMax?: number;
  impactStrengthMin?: number;
  impactStrengthMax?: number;
  fdaApproved?: boolean;
  ul94Rating?: string;
  color?: string;
  search?: string;
}

interface SearchFiltersProps {
  filters: MaterialSearchFilters;
  onFiltersChange: (filters: MaterialSearchFilters) => void;
  onSearch: () => void;
  isLoading?: boolean;
}

export default function SearchFilters({ filters, onFiltersChange, onSearch, isLoading }: SearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localFilters, setLocalFilters] = useState<MaterialSearchFilters>(filters);

  const updateFilter = (key: keyof MaterialSearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const emptyFilters = {};
    setLocalFilters(emptyFilters);
    onFiltersChange(emptyFilters);
  };

  const hasActiveFilters = Object.keys(localFilters).some(key => {
    const value = localFilters[key as keyof MaterialSearchFilters];
    return value !== undefined && value !== null && value !== '';
  });

  return (
    <Card className="bg-surface material-shadow rounded-lg mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-medium text-gray-900">
          Find Your Ideal Plastic Material
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Material Type Filter */}
          <div>
            <Label htmlFor="materialType" className="block text-sm font-medium text-gray-700 mb-2">
              Material Type
            </Label>
            <Select 
              value={localFilters.materialType || ''} 
              onValueChange={(value) => updateFilter('materialType', value || undefined)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="ABS">ABS</SelectItem>
                <SelectItem value="PLA">PLA</SelectItem>
                <SelectItem value="PETG">PETG</SelectItem>
                <SelectItem value="PA">Nylon (PA)</SelectItem>
                <SelectItem value="PC">Polycarbonate (PC)</SelectItem>
                <SelectItem value="POM">POM (Acetal)</SelectItem>
                <SelectItem value="PEEK">PEEK</SelectItem>
                <SelectItem value="PP">Polypropylene (PP)</SelectItem>
                <SelectItem value="PE">Polyethylene (PE)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Manufacturer Filter */}
          <div>
            <Label htmlFor="manufacturer" className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturer
            </Label>
            <Select 
              value={localFilters.manufacturer || ''} 
              onValueChange={(value) => updateFilter('manufacturer', value || undefined)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="All Manufacturers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Manufacturers</SelectItem>
                <SelectItem value="BASF">BASF</SelectItem>
                <SelectItem value="DuPont">DuPont</SelectItem>
                <SelectItem value="SABIC">SABIC</SelectItem>
                <SelectItem value="Covestro">Covestro</SelectItem>
                <SelectItem value="Celanese">Celanese</SelectItem>
                <SelectItem value="Eastman Chemical">Eastman Chemical</SelectItem>
                <SelectItem value="Victrex">Victrex</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Temperature Range */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Melting Temperature (°C)
            </Label>
            <div className="flex space-x-2">
              <Input 
                type="number" 
                placeholder="Min" 
                value={localFilters.meltingTempMin || ''}
                onChange={(e) => updateFilter('meltingTempMin', e.target.value ? Number(e.target.value) : undefined)}
                className="w-1/2"
              />
              <Input 
                type="number" 
                placeholder="Max" 
                value={localFilters.meltingTempMax || ''}
                onChange={(e) => updateFilter('meltingTempMax', e.target.value ? Number(e.target.value) : undefined)}
                className="w-1/2"
              />
            </div>
          </div>

          {/* Tensile Strength */}
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Tensile Strength (MPa)
            </Label>
            <div className="flex space-x-2">
              <Input 
                type="number" 
                placeholder="Min" 
                value={localFilters.tensileStrengthMin || ''}
                onChange={(e) => updateFilter('tensileStrengthMin', e.target.value ? Number(e.target.value) : undefined)}
                className="w-1/2"
              />
              <Input 
                type="number" 
                placeholder="Max" 
                value={localFilters.tensileStrengthMax || ''}
                onChange={(e) => updateFilter('tensileStrengthMax', e.target.value ? Number(e.target.value) : undefined)}
                className="w-1/2"
              />
            </div>
          </div>
        </div>

        {/* Search Field */}
        <div>
          <Label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
            Search Materials
          </Label>
          <Input 
            type="text" 
            placeholder="Search by material name..." 
            value={localFilters.search || ''}
            onChange={(e) => updateFilter('search', e.target.value || undefined)}
            className="w-full"
          />
        </div>

        {/* Advanced Filters */}
        <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center text-primary font-medium hover:text-primary-dark">
              <Settings className="h-4 w-4 mr-2" />
              Advanced Filters
              <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="space-y-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {/* MFR Range */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  MFR (g/10 min)
                </Label>
                <div className="flex space-x-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    value={localFilters.mfrMin || ''}
                    onChange={(e) => updateFilter('mfrMin', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-1/2 text-sm"
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    value={localFilters.mfrMax || ''}
                    onChange={(e) => updateFilter('mfrMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-1/2 text-sm"
                  />
                </div>
              </div>

              {/* Density */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Density (g/cm³)
                </Label>
                <div className="flex space-x-2">
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Min" 
                    value={localFilters.densityMin || ''}
                    onChange={(e) => updateFilter('densityMin', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-1/2 text-sm"
                  />
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="Max" 
                    value={localFilters.densityMax || ''}
                    onChange={(e) => updateFilter('densityMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-1/2 text-sm"
                  />
                </div>
              </div>

              {/* Impact Strength */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Impact Strength (kJ/m²)
                </Label>
                <div className="flex space-x-2">
                  <Input 
                    type="number" 
                    placeholder="Min" 
                    value={localFilters.impactStrengthMin || ''}
                    onChange={(e) => updateFilter('impactStrengthMin', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-1/2 text-sm"
                  />
                  <Input 
                    type="number" 
                    placeholder="Max" 
                    value={localFilters.impactStrengthMax || ''}
                    onChange={(e) => updateFilter('impactStrengthMax', e.target.value ? Number(e.target.value) : undefined)}
                    className="w-1/2 text-sm"
                  />
                </div>
              </div>

              {/* Certifications */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Certifications
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="fdaApproved"
                      checked={localFilters.fdaApproved || false}
                      onCheckedChange={(checked) => updateFilter('fdaApproved', checked ? true : undefined)}
                    />
                    <Label htmlFor="fdaApproved" className="text-sm">
                      FDA Approved
                    </Label>
                  </div>
                  <Select 
                    value={localFilters.ul94Rating || ''} 
                    onValueChange={(value) => updateFilter('ul94Rating', value || undefined)}
                  >
                    <SelectTrigger className="w-full text-sm">
                      <SelectValue placeholder="UL94 Rating" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any UL94</SelectItem>
                      <SelectItem value="V-0">UL94 V-0</SelectItem>
                      <SelectItem value="V-1">UL94 V-1</SelectItem>
                      <SelectItem value="V-2">UL94 V-2</SelectItem>
                      <SelectItem value="HB">UL94 HB</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Color */}
              <div>
                <Label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </Label>
                <Select 
                  value={localFilters.color || ''} 
                  onValueChange={(value) => updateFilter('color', value || undefined)}
                >
                  <SelectTrigger className="w-full text-sm">
                    <SelectValue placeholder="All Colors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Colors</SelectItem>
                    <SelectItem value="Natural">Natural</SelectItem>
                    <SelectItem value="Black">Black</SelectItem>
                    <SelectItem value="White">White</SelectItem>
                    <SelectItem value="Transparent">Transparent</SelectItem>
                    <SelectItem value="Custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button 
            variant="ghost" 
            onClick={clearAllFilters}
            disabled={!hasActiveFilters}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            <X className="h-4 w-4 mr-2" />
            Clear All Filters
          </Button>
          <Button 
            onClick={onSearch}
            disabled={isLoading}
            className="bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-md font-medium ripple"
          >
            <Search className="h-4 w-4 mr-2" />
            {isLoading ? 'Searching...' : 'Search Materials'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
