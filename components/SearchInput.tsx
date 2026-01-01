"use client";

import React, { useState, KeyboardEvent } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Search, Loader2 } from 'lucide-react';
// Import your server action
import { getLandmarksFromDB } from '@/app/action'; 

interface SearchInputProps {
  onLocationFound: (lat: number, lng: number, name: string) => void;
}

export function SearchInput({ onLocationFound }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const performSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);

    try {
      // 1. Search across all MongoDB collections via the Server Action
      const results = await getLandmarksFromDB(query);

      if (results && results.length > 0) {
        // Pick the best match (first result)
        const bestMatch = results[0];
        onLocationFound(bestMatch.lat, bestMatch.lng, bestMatch.name);
        
        // Optional: clear query after finding
        setQuery(""); 
      } else {
        alert("Location not found in the DeKUT database.");
      }
    } catch (error) {
      console.error("Database search failed:", error);
      alert("Error connecting to the database.");
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
          placeholder="Search campus buildings..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="bg-slate-800 text-white border-slate-700 pr-10 focus:ring-amber-400"
        />
        <Button 
          size="sm"
          className="absolute right-1 top-1 h-8 bg-amber-400 hover:bg-amber-500 text-green-900"
          onClick={performSearch}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : <Search size={16} />}
        </Button>
      </div>
      
      {/* Visual Indicator of DB status */}
      <p className="text-[10px] text-slate-500 pl-1 uppercase font-bold tracking-tighter">
        Connected to DeKUT Landmark Registry
      </p>
    </div>
  );
}