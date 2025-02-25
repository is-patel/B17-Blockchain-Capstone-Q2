'use client';
import { Home, Search, Filter } from "lucide-react";

export const Header = ({ onOpenSearch }) => (
  <header className="bg-white shadow-sm sticky top-0 z-10">
    <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Home className="h-8 w-8 text-rose-500" />
          <h1 className="ml-2 text-xl font-semibold text-gray-900">PropChain</h1>
        </div>
        
        <div className="flex-1 max-w-2xl mx-4">
          <button
            onClick={onOpenSearch}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-500 flex items-center"
          >
            <Search className="h-5 w-5 mr-2" />
            <span className="text-sm">Search properties...</span>
          </button>
        </div>

        <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
          <Filter className="h-5 w-5 mr-2" />
          <span>Filters</span>
        </button>

      </div>
    </div>
  </header>
);