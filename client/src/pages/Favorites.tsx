import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import MaterialCard from "@/components/MaterialCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Favorites() {
  const { isAuthenticated } = useAuth();

  const { data: favorites = [], isLoading } = useQuery({
    queryKey: ['/api/favorites'],
    enabled: isAuthenticated,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Heart className="h-8 w-8 mr-3 text-red-500" />
            My Favorite Materials
          </h1>
          <p className="text-gray-600">
            Materials you've saved for easy access and comparison
          </p>
        </div>

        {favorites.length > 0 ? (
          <>
            <div className="mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {favorites.length} Favorite Material{favorites.length !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-blue-700">
                        Click on any material to view detailed specifications
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-blue-700 border-blue-300 hover:bg-blue-100"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear All
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {favorites.map((favorite: any) => (
                <MaterialCard 
                  key={favorite.id} 
                  material={favorite.material} 
                  viewMode="grid"
                />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-600 mb-6">
              Start exploring materials and add them to your favorites for quick access
            </p>
            <Button onClick={() => window.location.href = '/'}>
              Browse Materials
            </Button>
          </div>
        )}
      </main>
    </div>
  );
}