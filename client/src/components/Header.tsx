import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Search, 
  Heart, 
  FileText, 
  Settings, 
  LogOut, 
  Menu, 
  ChevronDown,
  User,
  Database
} from "lucide-react";

export default function Header() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getUserInitials = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  };

  const getUserDisplayName = (user: any) => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    if (user?.firstName) {
      return user.firstName;
    }
    if (user?.email) {
      return user.email;
    }
    return 'User';
  };

  const navigationItems = [
    { href: "/", label: "Search", icon: Search },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/compare", label: "Compare", icon: Database },
    { href: "/documentation", label: "Documentation", icon: FileText },
  ];

  return (
    <header className="bg-surface material-shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <div>
                <h1 className="text-2xl font-bold text-primary">PlasticDB</h1>
                <p className="text-xs text-muted-foreground -mt-1">
                  Industrial Materials Database
                </p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            {isAuthenticated && (
              <nav className="hidden md:ml-10 md:flex space-x-8">
                {navigationItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <a className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium transition-colors">
                      {item.label}
                    </a>
                  </Link>
                ))}
              </nav>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {isLoading ? (
              <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            ) : isAuthenticated && user ? (
              <>
                {/* Desktop User Menu */}
                <div className="hidden md:flex items-center space-x-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center space-x-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage 
                            src={user.profileImageUrl} 
                            alt={getUserDisplayName(user)}
                          />
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                            {getUserInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {getUserDisplayName(user)}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem asChild>
                        <Link href="/profile">
                          <User className="h-4 w-4 mr-2" />
                          Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/favorites">
                          <Heart className="h-4 w-4 mr-2" />
                          Favorites
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <Settings className="h-4 w-4 mr-2" />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem 
                        onClick={() => window.location.href = '/api/logout'}
                        className="text-destructive focus:text-destructive"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                  <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <Menu className="h-6 w-6" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-80">
                      <div className="flex flex-col space-y-6 py-6">
                        {/* User Info */}
                        <div className="flex items-center space-x-3 pb-6 border-b">
                          <Avatar className="h-12 w-12">
                            <AvatarImage 
                              src={user.profileImageUrl} 
                              alt={getUserDisplayName(user)}
                            />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{getUserDisplayName(user)}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>

                        {/* Navigation */}
                        <nav className="flex flex-col space-y-2">
                          {navigationItems.map((item) => (
                            <Link key={item.href} href={item.href}>
                              <a 
                                className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                <item.icon className="h-5 w-5" />
                                <span>{item.label}</span>
                              </a>
                            </Link>
                          ))}
                        </nav>

                        {/* Actions */}
                        <div className="flex flex-col space-y-2 pt-6 border-t">
                          <Link href="/profile">
                            <a 
                              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <User className="h-5 w-5" />
                              <span>Profile</span>
                            </a>
                          </Link>
                          <Link href="/admin">
                            <a 
                              className="flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              <Settings className="h-5 w-5" />
                              <span>Admin Panel</span>
                            </a>
                          </Link>
                          <button 
                            onClick={() => window.location.href = '/api/logout'}
                            className="flex items-center space-x-3 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-md transition-colors w-full text-left"
                          >
                            <LogOut className="h-5 w-5" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </>
            ) : (
              <>
                {/* Not authenticated */}
                <div className="hidden md:flex items-center space-x-4">
                  <Link href="/register">
                    <Button variant="outline" size="sm">
                      Register
                    </Button>
                  </Link>
                  <Button 
                    onClick={() => window.location.href = '/api/login'} 
                    size="sm"
                  >
                    Sign In
                  </Button>
                </div>

                {/* Mobile sign in */}
                <div className="md:hidden">
                  <Button 
                    onClick={() => window.location.href = '/api/login'} 
                    size="sm"
                  >
                    Sign In
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
