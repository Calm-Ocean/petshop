"use client";

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { MenuIcon } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const { user, role, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNavLinks = () => {
    if (!user) return [];

    const baseLinks = [
      { name: 'Dashboard', path: '/dashboard' },
    ];

    if (role === 'admin') {
      return [
        ...baseLinks,
        { name: 'Manage Users', path: '/admin/users' },
        { name: 'Manage Courses', path: '/admin/courses' },
      ];
    } else if (role === 'teacher') {
      return [
        ...baseLinks,
        { name: 'My Courses', path: '/teacher/courses' }, // Updated path
        { name: 'Assignments', path: '/teacher/assignments' },
      ];
    } else if (role === 'student') {
      return [
        ...baseLinks,
        { name: 'My Courses', path: '/student/courses' }, // Updated path
        { name: 'Grades', path: '/student/grades' },
      ];
    }
    return baseLinks;
  };

  const navLinks = getNavLinks();

  return (
    <nav className="bg-primary text-primary-foreground p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold">
          LMS Portal
        </Link>

        {isMobile ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-primary-foreground">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{user?.name || 'Guest'}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {navLinks.map((link) => (
                <DropdownMenuItem key={link.path} asChild>
                  <Link to={link.path}>{link.name}</Link>
                </DropdownMenuItem>
              ))}
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center space-x-4">
            <ul className="flex space-x-4">
              {navLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="hover:underline">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.username} ({role})
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;