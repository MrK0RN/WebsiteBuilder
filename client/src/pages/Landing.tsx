import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Database, Shield, Zap } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface material-shadow sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">PlasticDB</h1>
                <p className="text-xs text-muted-foreground -mt-1">Industrial Materials Database</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/register">
                <Button variant="outline" size="sm">
                  Register
                </Button>
              </Link>
              <Button onClick={() => window.location.href = '/api/login'} size="sm">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Find the Perfect
            <span className="text-primary"> Plastic Material</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Search and compare industrial plastic materials by technical specifications. 
            Access detailed material data, certifications, and vendor information in one place.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg" 
            className="text-lg px-8 py-4 ripple"
          >
            <Search className="mr-2 h-5 w-5" />
            Start Searching Materials
          </Button>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Comprehensive Material Database
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="material-shadow hover:material-shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Database className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Extensive Database</h3>
                <p className="text-gray-600">
                  Access detailed specifications for thousands of plastic materials 
                  from leading manufacturers worldwide.
                </p>
              </CardContent>
            </Card>

            <Card className="material-shadow hover:material-shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Advanced Filtering</h3>
                <p className="text-gray-600">
                  Filter by material type, mechanical properties, thermal characteristics, 
                  certifications, and more.
                </p>
              </CardContent>
            </Card>

            <Card className="material-shadow hover:material-shadow-lg transition-shadow">
              <CardContent className="p-6 text-center">
                <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Certified Data</h3>
                <p className="text-gray-600">
                  Verified technical data sheets, safety information, and 
                  industry certifications for reliable material selection.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Material Types */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            Supported Material Types
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[
              { name: "ABS", color: "bg-blue-100 text-blue-800" },
              { name: "PLA", color: "bg-green-100 text-green-800" },
              { name: "PETG", color: "bg-purple-100 text-purple-800" },
              { name: "Nylon (PA)", color: "bg-orange-100 text-orange-800" },
              { name: "PC", color: "bg-teal-100 text-teal-800" },
              { name: "POM", color: "bg-gray-100 text-gray-800" },
              { name: "PEEK", color: "bg-indigo-100 text-indigo-800" },
              { name: "PP", color: "bg-yellow-100 text-yellow-800" },
              { name: "PE", color: "bg-red-100 text-red-800" },
              { name: "PSU", color: "bg-pink-100 text-pink-800" },
              { name: "PPS", color: "bg-cyan-100 text-cyan-800" },
              { name: "TPU", color: "bg-lime-100 text-lime-800" },
            ].map((material) => (
              <div
                key={material.name}
                className={`${material.color} px-3 py-2 rounded-full text-sm font-medium text-center`}
              >
                {material.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-primary text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Find Your Material?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of engineers and designers who trust PlasticDB 
            for their material selection needs.
          </p>
          <Button 
            onClick={() => window.location.href = '/api/login'}
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-4"
          >
            <Zap className="mr-2 h-5 w-5" />
            Get Started Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-medium mb-4">PlasticDB</h3>
              <p className="text-gray-300 text-sm">
                The comprehensive database for industrial plastic materials and their specifications.
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Material Guide</a></li>
                <li><a href="#" className="hover:text-white">Processing Tips</a></li>
                <li><a href="#" className="hover:text-white">Industry Standards</a></li>
                <li><a href="#" className="hover:text-white">API Documentation</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Feature Requests</a></li>
                <li><a href="#" className="hover:text-white">Bug Reports</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-600 pt-8 mt-8 text-center text-sm text-gray-300">
            © 2024 PlasticDB. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
