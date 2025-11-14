"use client";

import React, { ReactNode } from 'react';
import Navbar from '@/components/Navbar';
import { MadeWithDyad } from '@/components/made-with-dyad';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto p-6">
        {children}
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default MainLayout;