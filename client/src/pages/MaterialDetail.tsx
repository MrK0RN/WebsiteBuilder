import { useParams } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink, FileText, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Material, MaterialVendor, Vendor } from "@shared/schema";

export default function MaterialDetail() {
  const { id } = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: material, isLoading } = useQuery({
    queryKey: [`/api/materials/${id}`],
    enabled: !!id,
  });

  const { data: vendors = [] } = useQuery({
    queryKey: [`/api/materials/${id}/vendors`],
    enabled: !!id,
  });

  const { data: favoriteStatus } = useQuery({
    queryKey: [`/api/favorites/${id}/check`],
    enabled: !!id && isAuthenticated,
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (favoriteStatus?.isFavorite) {
        await apiRequest('DELETE', `/api/favorites/${id}`);
      } else {
        await apiRequest('POST', '/api/favorites', { materialId: Number(id) });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/${id}/check`] });
      queryClient.invalidateQueries({ queryKey: ['/api/favorites'] });
      toast({
        title: favoriteStatus?.isFavorite ? "Removed from favorites" : "Added to favorites",
        description: favoriteStatus?.isFavorite 
          ? "Material removed from your favorites list"
          : "Material added to your favorites list",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="space-y-4">
                <div className="h-6 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-32 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!material) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Material Not Found</h1>
            <Link href="/">
              <Button>← Back to Search</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const getMaterialTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      'ABS': 'bg-blue-100 text-blue-800',
      'PLA': 'bg-green-100 text-green-800',
      'PETG': 'bg-purple-100 text-purple-800',
      'PA': 'bg-orange-100 text-orange-800',
      'PC': 'bg-teal-100 text-teal-800',
      'POM': 'bg-gray-100 text-gray-800',
      'PEEK': 'bg-indigo-100 text-indigo-800',
      'default': 'bg-gray-100 text-gray-800'
    };
    return colors[type] || colors.default;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Search
            </Button>
          </Link>
        </div>

        <div className="bg-surface material-shadow rounded-lg overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{material.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{material.manufacturer}</p>
                <div className="flex flex-wrap gap-2">
                  <Badge className={getMaterialTypeColor(material.materialType)}>
                    {material.materialType}
                  </Badge>
                  {material.fdaApproved && (
                    <Badge className="bg-green-100 text-green-800">FDA Approved</Badge>
                  )}
                  {material.ul94Rating && (
                    <Badge className="bg-red-100 text-red-800">UL94 {material.ul94Rating}</Badge>
                  )}
                  {material.rohsCompliant && (
                    <Badge className="bg-blue-100 text-blue-800">RoHS Compliant</Badge>
                  )}
                </div>
              </div>
              {isAuthenticated && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleFavoriteMutation.mutate()}
                  disabled={toggleFavoriteMutation.isPending}
                  className={favoriteStatus?.isFavorite ? "text-red-500 border-red-500" : ""}
                >
                  <Heart 
                    className={`h-4 w-4 mr-2 ${favoriteStatus?.isFavorite ? "fill-current" : ""}`} 
                  />
                  {favoriteStatus?.isFavorite ? "Remove from Favorites" : "Add to Favorites"}
                </Button>
              )}
            </div>
          </div>

          <div className="p-6">
            {material.description && (
              <p className="text-gray-700 mb-8">{material.description}</p>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Image and Vendors */}
              <div>
                {material.imageUrl && (
                  <img 
                    src={material.imageUrl} 
                    alt={material.name}
                    className="w-full rounded-lg material-shadow mb-6"
                  />
                )}
                
                {vendors.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Suppliers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {vendors.map((vendorInfo: MaterialVendor & { vendor: Vendor }) => (
                        <div 
                          key={vendorInfo.id} 
                          className="flex justify-between items-center p-3 border border-gray-200 rounded-md"
                        >
                          <div>
                            <p className="font-medium">{vendorInfo.vendor.name}</p>
                            {vendorInfo.price && (
                              <p className="text-sm text-gray-600">
                                ${vendorInfo.price}/{vendorInfo.currency || 'USD'} per kg
                                {vendorInfo.minimumOrder && ` (Min: ${vendorInfo.minimumOrder}kg)`}
                              </p>
                            )}
                          </div>
                          {vendorInfo.productUrl && (
                            <Button size="sm" asChild>
                              <a href={vendorInfo.productUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Visit Store
                              </a>
                            </Button>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Specifications */}
              <div className="space-y-6">
                {/* Mechanical Properties */}
                <Card>
                  <CardHeader>
                    <CardTitle>Mechanical Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {material.tensileStrength && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tensile Strength:</span>
                          <span className="font-medium">{material.tensileStrength} MPa</span>
                        </div>
                      )}
                      {material.flexuralStrength && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Flexural Strength:</span>
                          <span className="font-medium">{material.flexuralStrength} MPa</span>
                        </div>
                      )}
                      {material.impactStrength && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Impact Strength:</span>
                          <span className="font-medium">{material.impactStrength} kJ/m²</span>
                        </div>
                      )}
                      {material.elongationAtBreak && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Elongation at Break:</span>
                          <span className="font-medium">{material.elongationAtBreak}%</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Thermal Properties */}
                <Card>
                  <CardHeader>
                    <CardTitle>Thermal Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {material.meltingTemperature && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Melting Temperature:</span>
                          <span className="font-medium">{material.meltingTemperature}°C</span>
                        </div>
                      )}
                      {material.heatDeflectionTemp && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Heat Deflection Temp:</span>
                          <span className="font-medium">{material.heatDeflectionTemp}°C</span>
                        </div>
                      )}
                      {material.vicatSofteningPoint && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Vicat Softening Point:</span>
                          <span className="font-medium">{material.vicatSofteningPoint}°C</span>
                        </div>
                      )}
                      {material.thermalExpansion && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Thermal Expansion:</span>
                          <span className="font-medium">{material.thermalExpansion} /°C</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Physical Properties */}
                <Card>
                  <CardHeader>
                    <CardTitle>Physical Properties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {material.density && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Density:</span>
                          <span className="font-medium">{material.density} g/cm³</span>
                        </div>
                      )}
                      {material.mfr && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Melt Flow Rate:</span>
                          <span className="font-medium">{material.mfr} g/10 min</span>
                        </div>
                      )}
                      {material.waterAbsorption && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Water Absorption:</span>
                          <span className="font-medium">{material.waterAbsorption}%</span>
                        </div>
                      )}
                      {material.shoreHardness && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Shore Hardness:</span>
                          <span className="font-medium">{material.shoreHardness}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Documents */}
                {(material.technicalDataSheetUrl || material.safetyDataSheetUrl || material.processingGuidelinesUrl) && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Technical Documents</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {material.technicalDataSheetUrl && (
                        <a 
                          href={material.technicalDataSheetUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:text-primary-dark"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Technical Data Sheet (PDF)
                        </a>
                      )}
                      {material.safetyDataSheetUrl && (
                        <a 
                          href={material.safetyDataSheetUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:text-primary-dark"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Safety Data Sheet (PDF)
                        </a>
                      )}
                      {material.processingGuidelinesUrl && (
                        <a 
                          href={material.processingGuidelinesUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center text-primary hover:text-primary-dark"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          Processing Guidelines (PDF)
                        </a>
                      )}
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
