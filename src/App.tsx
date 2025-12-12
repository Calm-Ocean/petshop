"use client";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, UserRole } from '@/context/AuthContext';
import { SessionContextProvider } from '@/context/SessionContext';
import { CartProvider } from '@/context/CartContext';
import MainLayout from '@/components/MainLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Toaster } from '@/components/ui/sonner';

// Pages
import Index from '@/pages/Index';
import HomePage from '@/pages/HomePage';
import ShopPage from '@/pages/ShopPage';
import ProductDetailsPage from '@/pages/ProductDetailsPage'; // This page will now render outside MainLayout
import CartPage from '@/pages/CartPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderConfirmationPage from '@/pages/OrderConfirmationPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import AboutPage from '@/pages/AboutPage';
import UserAccountPage from '@/pages/UserAccountPage';
import UserOrderHistoryPage from '@/pages/UserOrderHistoryPage';
import UserAddressPage from '@/pages/UserAddressPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AddProductPage from '@/pages/admin/AddProductPage';
import EditProductPage from '@/pages/admin/EditProductPage';
import ManageProductsPage from '@/pages/admin/ManageProductsPage';
import ManageOrdersPage from '@/pages/admin/ManageOrdersPage';
import ManageUsersPage from '@/pages/admin/ManageUsersPage';
import EditUserPage from '@/pages/admin/EditUserPage';
import NotFound from '@/pages/NotFound';

const App = () => {
  console.log("App component is rendering.");
  return (
    <BrowserRouter>
      <SessionContextProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster richColors position="top-right" />
            <Routes>
              {/* Route for ProductDetailsPage - outside MainLayout */}
              <Route path="/shop/:productId" element={<ProductDetailsPage />} />

              {/* Routes wrapped by MainLayout */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Index />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/shop" element={<ShopPage />} />
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
                  <Route path="/my-account/address" element={<UserAddressPage />} />
                </Route>

                {/* Admin Protected Routes */}
                <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                  <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                  <Route path="/admin/products" element={<ManageProductsPage />} />
                  <Route path="/admin/products/add" element={<AddProductPage />} />
                  <Route path="/admin/products/edit/:productId" element={<EditProductPage />} />
                  <Route path="/admin/orders" element={<ManageOrdersPage />} />
                  <Route path="/admin/users" element={<ManageUsersPage />} />
                  <Route path="/admin/users/edit/:userId" element={<EditUserPage />} />
                </Route>

                {/* Catch-all for 404 */}
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </SessionContextProvider>
    </BrowserRouter>
  );
};

export default App;