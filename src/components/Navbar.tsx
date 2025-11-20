"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, User, LogOut, Home, Package, LayoutDashboard, UserCircle } from 'lucide-react'; // Added UserCircle icon
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const { cartItemCount } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully!");
    navigate('/login');
  };

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="text-2xl font-bold flex items-center gap-2">
          <Package className="h-6 w-6" /> PetShop
        </Link>
        <div className="flex items-center space-x-4">
          <Link to="/home">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
              <Home className="h-4 w-4 mr-2" /> Home
            </Button>
          </Link>
          <Link to="/shop">
            <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
              Shop
            </Button>
          </Link>
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
              <Link to="/my-account"> {/* New "My Account" link */}
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
              <Link to="/register">
                <Button variant="ghost" className="text-primary-foreground hover:bg-primary/80">
                  Register
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