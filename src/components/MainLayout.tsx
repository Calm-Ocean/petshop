"use client";

import React, { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer'; // New import
// import { MadeWithDyad } from './made-with-dyad'; // Removed

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer /> {/* Added Footer */}
    </div>
  );
};

export default MainLayout;