"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-8 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Link to="/home" className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" /> PetShop
          </Link>
          <p className="text-sm text-primary-foreground/80">
            Your one-stop destination for all your beloved pets' needs.
          </p>
          <p className="text-sm text-primary-foreground/60">
            &copy; {currentYear} PetShop. All rights reserved.
          </p>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
          <ul className="space-y-1">
            <li><Link to="/shop" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Shop</Link></li>
            <li><Link to="/cart" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Cart</Link></li>
            <li><Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">About Us</Link></li>
            {/* Add more links as needed */}
          </ul>
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-2">Connect With Us</h3>
          <ul className="space-y-1">
            <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Facebook</a></li>
            <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Instagram</a></li>
            <li><a href="#" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">Twitter</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;