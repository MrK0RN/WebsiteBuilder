import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, ExternalLink } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import type { Material } from "@shared/schema";

interface MaterialCardProps {
  material: Material;
  viewMode?: 'grid' | 'list';
}

export default function MaterialCard({ material, viewMode = 'grid' }: MaterialCardProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favoriteStatus } = useQuery({
    queryKey: [`/api/favorites/${material.id}/check`],
    enabled: isAuthenticated,
  });

  const { data: vendors = [] } = useQuery({
    queryKey: [`/api/materials/${material.id}/vendors`],
  });

  const toggleFavoriteMutation = useMutation({
    mutationFn: async () => {
      if (favoriteStatus?.isFavorite) {
        await apiRequest('DELETE', `/api/favorites/${material.id}`);
      } else {
        await apiRequest('POST', '/api/favorites', { materialId: material.id });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/favorites/${material.id}/check`] });
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

  const handleVendorClick = (vendorUrl?: string) => {
    if (vendorUrl) {
      window.open(vendorUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (viewMode === 'list') {
    return (
      <Card className="material-shadow hover:material-shadow-lg transition-shadow duration-300">
        <CardContent className="p-6">
          <div className="flex items-center space-x-6">
            {material.imageUrl && (
              <img 
                src={material.imageUrl} 
                alt={material.name}
                className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
              />
            )}
            
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 truncate">{material.name}</h3>
                  <p className="text-sm text-gray-600">{material.manufacturer}</p>
                </div>
                {isAuthenticated && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleFavoriteMutation.mutate()}
                    disabled={toggleFavoriteMutation.isPending}
                    className={favoriteStatus?.isFavorite ? "text-red-500" : "text-gray-400"}
                  >
                    <Heart className={`h-4 w-4 ${favoriteStatus?.isFavorite ? "fill-current" : ""}`} />
                  </Button>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge className={getMaterialTypeColor(material.materialType)}>
                  {material.materialType}
                </Badge>
                {material.fdaApproved && (
                  <Badge className="bg-green-100 text-green-800">FDA Approved</Badge>
                )}
                {material.ul94Rating && (
                  <Badge className="bg-red-100 text-red-800">UL94 {material.ul94Rating}</Badge>
                )}
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                {material.meltingTemperature && (
                  <div>
                    <span className="text-gray-600">Melting Temp:</span>
                    <span className="font-medium ml-1">{material.meltingTemperature}°C</span>
                  </div>
                )}
                {material.tensileStrength && (
                  <div>
                    <span className="text-gray-600">Tensile Strength:</span>
                    <span className="font-medium ml-1">{material.tensileStrength} MPa</span>
                  </div>
                )}
                {material.mfr && (
                  <div>
                    <span className="text-gray-600">MFR:</span>
                    <span className="font-medium ml-1">{material.mfr} g/10 min</span>
                  </div>
                )}
                {material.density && (
                  <div>
                    <span className="text-gray-600">Density:</span>
                    <span className="font-medium ml-1">{material.density} g/cm³</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex flex-col space-y-2 flex-shrink-0">
              <Link href={`/material/${material.id}`}>
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </Link>
              {vendors.length > 0 && (
                <Button 
                  size="sm" 
                  className="w-full ripple"
                  onClick={() => handleVendorClick(vendors[0]?.productUrl)}
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="material-shadow hover:material-shadow-lg transition-shadow duration-300 overflow-hidden">
      {material.imageUrl && (
        <img 
          src={material.imageUrl} 
          alt={material.name}
          className="w-full h-48 object-cover"
        />
      )}
      
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{material.name}</h3>
          {isAuthenticated && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFavoriteMutation.mutate()}
              disabled={toggleFavoriteMutation.isPending}
              className={favoriteStatus?.isFavorite ? "text-red-500" : "text-gray-400"}
            >
              <Heart className={`h-4 w-4 ${favoriteStatus?.isFavorite ? "fill-current" : ""}`} />
            </Button>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-4">{material.manufacturer}</p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <Badge className={getMaterialTypeColor(material.materialType)}>
            {material.materialType}
          </Badge>
          {material.fdaApproved && (
            <Badge className="bg-green-100 text-green-800">FDA Approved</Badge>
          )}
          {material.ul94Rating && (
            <Badge className="bg-red-100 text-red-800">UL94 {material.ul94Rating}</Badge>
          )}
        </div>
        
        <div className="space-y-2 mb-4 text-sm">
          {material.meltingTemperature && (
            <div className="flex justify-between">
              <span className="text-gray-600">Melting Temp:</span>
              <span className="font-medium">{material.meltingTemperature}°C</span>
            </div>
          )}
          {material.tensileStrength && (
            <div className="flex justify-between">
              <span className="text-gray-600">Tensile Strength:</span>
              <span className="font-medium">{material.tensileStrength} MPa</span>
            </div>
          )}
          {material.mfr && (
            <div className="flex justify-between">
              <span className="text-gray-600">MFR:</span>
              <span className="font-medium">{material.mfr} g/10 min</span>
            </div>
          )}
          {material.density && (
            <div className="flex justify-between">
              <span className="text-gray-600">Density:</span>
              <span className="font-medium">{material.density} g/cm³</span>
            </div>
          )}
        </div>
        
        <div className="flex space-x-2">
          <Link href={`/material/${material.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
          {vendors.length > 0 ? (
            <Button 
              size="sm" 
              className="flex-1 ripple"
              onClick={() => handleVendorClick(vendors[0]?.productUrl)}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Buy Now
            </Button>
          ) : (
            <Button size="sm" className="flex-1" disabled>
              No Vendors
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
