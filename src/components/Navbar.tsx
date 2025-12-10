"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, User, LogOut, Home, Package, LayoutDashboard, UserCircle, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useQuery } from '@tanstack/react-query';
import { getCategories } from '@/lib/supabase/products';
import SearchBar from '@/components/SearchBar'; // Import SearchBar
import { ANIMAL_CATEGORIES } from '@/constants/categories'; // Import ANIMAL_CATEGORIES

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  // We still fetch all categories for potential future use or other parts of the app
  const { data: allCategories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  });

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md sticky top-0 z-50">
      <div className="container mx-auto flex flex-wrap justify-between items-center gap-y-4">
        <Link to="/home" className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" /> PetShop
        </Link>
        
        {/* Search Bar in Navbar */}
        <div className="flex-grow max-w-md mx-4">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4 ml-auto"> {/* Pushed to the right */}
          <Link to="/home">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
              <Home className="h-4 w-4 mr-2" /> Home
            </Button>
          </Link>

          {/* Shop with Animal Category Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
                Shop <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuItem asChild>
                <Link to="/shop">All Products</Link>
              </DropdownMenuItem>
              {/* Display predefined animal categories */}
              {ANIMAL_CATEGORIES.map((categoryName) => (
                <DropdownMenuItem key={categoryName} asChild>
                  <Link to={`/shop?animalCategory=${categoryName}`}>{categoryName}</Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/cart">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80 relative">
              <ShoppingCart className="h-4 w-4 mr-2" /> Cart
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 rounded-full bg-accent text-accent-foreground">
                  {cartItemCount}
                </Badge>
              )}
            </Button>
          </Link>

          {user ? (
            <>
              {role === 'admin' && (
                <Link to="/admin/dashboard">
                  <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
                    <LayoutDashboard className="h-4 w-4 mr-2" /> Admin
                  </Button>
                </Link>
              )}
              <Link to="/my-account">
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
                  <UserCircle className="h-4 w-4 mr-2" /> My Account
                </Button>
              </Link>
              <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
                  <User className="h-4 w-4 mr-2" /> Login
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;