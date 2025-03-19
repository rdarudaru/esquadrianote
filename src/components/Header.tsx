
import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from "@/lib/utils";

interface HeaderProps {
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <header className="bg-black w-full py-4 px-6 fixed top-0 left-0 right-0 z-40">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="text-white text-2xl font-semibold animate-fade-in">
          EsquadriaNote
        </div>
        
        <form 
          onSubmit={handleSearch} 
          className={cn(
            "flex-1 max-w-2xl mx-6",
            "bg-white/10 backdrop-blur-sm",
            "border border-white/20",
            "rounded-lg overflow-hidden transition-all duration-400",
            "focus-within:ring-2 focus-within:ring-white/20 focus-within:bg-white/15"
          )}
        >
          <div className="flex items-center w-full px-3">
            <Search className="w-5 h-5 text-white/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar pedidos por cliente, data ou material..."
              className="flex-1 bg-transparent border-none outline-none py-2 px-3 text-white placeholder:text-white/50"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={clearSearch}
                className="p-1 rounded-full hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4 text-white/60" />
              </button>
            )}
            <button 
              type="submit"
              className={cn(
                "ml-1 py-1.5 px-4 rounded-md font-medium text-sm",
                "bg-white/15 text-white",
                "hover:bg-white/20 transition-colors",
                "active:scale-95 transform duration-100"
              )}
            >
              Buscar
            </button>
          </div>
        </form>
        
        <div className="flex">
          {/* Placeholder for additional header items */}
        </div>
      </div>
    </header>
  );
};

export default Header;
