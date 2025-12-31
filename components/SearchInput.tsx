"use client";

import React, { useState, KeyboardEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search } from 'lucide-react'; // Optional: for a search icon

interface SearchInputProps {
  onLocationFound: (lat: number, lng: number, name: string) => void;
}

// Mock Database of DeKUT locations
const DEKUT_DB = [
  { name: "Science Park", lat: -0.3985, lng: 36.9605 },
  { name: "Library", lat: -0.3975, lng: 36.9620 },
  { name: "Freedom C", lat: -0.3990, lng: 36.9615 },
  { name: "Main Gate", lat: -0.3965, lng: 36.9595 },
];

export function SearchInput({ onLocationFound }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    // 1. Check Local Database
    const localMatch = DEKUT_DB.find(item => 
      item.name.toLowerCase().includes(query.toLowerCase())
    );

    if (localMatch) {
      onLocationFound(localMatch.lat, localMatch.lng, localMatch.name);
      setLoading(false);
      return;
    }

    // 2. Fallback to OpenStreetMap (Nominatim API)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const result = data[0];
        onLocationFound(parseFloat(result.lat), parseFloat(result.lon), result.display_name);
      } else {
        alert("Location not found in DeKUT or OSM.");
      }
    } catch (error) {
      console.error("Search failed:", error);
      alert("Search error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      performSearch();
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="relative">
        <Input 
          type="text"
          placeholder="Search campus or city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-slate-800 text-white border-slate-700 pr-10"
        />
        <Button 
          size="sm"
          className="absolute right-1 top-1 h-8 bg-amber-400 hover:bg-amber-500 text-green-900"
          onClick={performSearch}
          disabled={loading}
        >
          {loading ? "..." : <Search size={16} />}
        </Button>
      </div>
    </div>
  );
}