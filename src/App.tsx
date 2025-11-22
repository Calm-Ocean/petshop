"use client";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, UserRole } from '@/context/AuthContext';
import { SessionContextProvider } from '@/context/SessionContext'; // New import
import { CartProvider } from '@/context/CartContext';
import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner'; // For toast notifications

// Pages
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailsPage from '@/pages/ProductDetailsPage';
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AboutPage from '@/pages/AboutPage';
import UserAccountPage from '@/pages/UserAccountPage';
import UserOrderHistoryPage from '@/pages/UserOrderHistoryPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AddProductPage from '@/pages/admin/AddProductPage';
import EditProductPage from '@/pages/admin/EditProductPage';
import ManageProductsPage from '@/pages/admin/ManageProductsPage';
import ManageOrdersPage from '@/pages/admin/ManageOrdersPage';
import ManageUsersPage from '@/pages/admin/ManageUsersPage';
import EditUserPage from '@/pages/admin/EditUserPage'; // New import for EditUserPage
import NotFound from '@/pages/NotFound';

const App = () => {
  return (
    <BrowserRouter>
      <SessionContextProvider> {/* Wrap with SessionContextProvider */}
        <AuthProvider>
          <CartProvider>
            <Toaster richColors position="top-right" /> {/* Global toast notifications */}
            <MainLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
                <Route path="/shop/:productId" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<AboutPage />} />
                
                {/* User Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['user', 'admin']} />}>
                  <Route path="/my-account" element={<UserAccountPage />} />
                  <Route path="/my-orders" element={<UserOrderHistoryPage />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/products" element={<ManageProductsPage />} />
                  <Route path="/admin/products/add" element={<AddProductPage />} />
                  <Route path="/admin/products/edit/:productId" element={<EditProductPage />} />
                  <Route path="/admin/orders" element={<ManageOrdersPage />} />
                  <Route path="/admin/users" element={<ManageUsersPage />} />
                  <Route path="/admin/users/edit/:userId" element={<EditUserPage />} /> {/* Corrected route for EditUserPage */}
                </Route>

                {/* Catch-all for 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          </CartProvider>
        </AuthProvider>
      </SessionContextProvider>
    </BrowserRouter>
  );
};

export default App;