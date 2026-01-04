"use client";

import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, X } from 'lucide-react';
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom';

const SearchBar = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const initialSearchTerm = searchParams.get('search') || '';
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);

  // Update local state if URL search param changes externally
  useEffect(() => {
    setSearchTerm(initialSearchTerm);
  }, [initialSearchTerm]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newSearchParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newSearchParams.set('search', searchTerm.trim());
    } else {
      newSearchParams.delete('search');
    }
    // Preserve other params like 'category' or 'animalCategory'
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete('search');
    navigate(`${location.pathname}?${newSearchParams.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-md items-center space-x-2 mx-auto">
      <Input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="flex-grow text-black"
      />
      {searchTerm && (
        <Button variant="ghost" size="icon" onClick={handleClearSearch} type="button">
          <X className="h-4 w-4" />
        </Button>
      )}
      <Button type="submit">
        <Search className="h-4 w-4 mr-2" /> Search
      </Button>
    </form>
  );
};

export default SearchBar;