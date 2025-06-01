import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="w-full max-w-md material-shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-primary">PlasticDB</CardTitle>
          <p className="text-sm text-muted-foreground">Industrial Materials Database</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Create Your Account</h2>
            <p className="text-gray-600 text-sm">
              Join PlasticDB to access our comprehensive material database and save your favorites.
            </p>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={() => window.location.href = '/api/login'}
              className="w-full ripple"
              size="lg"
            >
              Sign Up with Replit
            </Button>
          </div>

          <div className="text-center text-sm">
            <span className="text-gray-600">Already have an account? </span>
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </div>

          <div className="text-center">
            <Link href="/" className="text-sm text-gray-600 hover:text-primary">
              ← Back to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
