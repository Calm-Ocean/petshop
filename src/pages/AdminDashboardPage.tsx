"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const AdminDashboardPage = () => {
  return (
    <div className="text-center py-12">
      <h1 className="text-4xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-lg text-muted-foreground mb-8">
        Manage products, users, and orders.
      </p>
      <div className="flex justify-center space-x-4">
        <Link to="/admin/products/add">
          <Button>Add New Product</Button>
        </Link>
        <Link to="/admin/products">
          <Button>Manage Products</Button>
        </Link>
        {/* Removed Manage Users link */}
        <Link to="/admin/orders">
          <Button variant="secondary">Manage Orders</Button>
        </Link>
      </div>
    </div>
  );
};

export default AdminDashboardPage;