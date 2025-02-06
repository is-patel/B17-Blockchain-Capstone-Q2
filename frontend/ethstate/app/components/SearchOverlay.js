'use client';
import { Search, X } from "lucide-react";

export const SearchOverlay = ({ 
  isOpen, 
  searchTerm, 
  onSearch, 
  onClose, 
  properties, 
  onSelectProperty, 
  formatPrice 
}) => (
  isOpen && (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      <div className="p-4">
        <div className="flex items-center gap-4">
          <div className="relative flex-1">
            <input
              type="text"
              value={searchTerm}
              onChange={onSearch}
              autoFocus
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              placeholder="Search by address or broker..."
            />
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4">
        {properties.map((property) => (
          <div
            key={property.id}
            className="p-4 hover:bg-gray-50 cursor-pointer border-b"
            onClick={() => onSelectProperty(property)}
          >
            <h4 className="font-medium text-gray-900">{property.address}</h4>
            <p className="text-sm text-gray-500">{property.broker}</p>
            <p className="text-rose-600 font-medium">{formatPrice(property.price)}</p>
          </div>
        ))}
        {properties.length === 0 && searchTerm && (
          <div className="p-4 text-center text-gray-500">
            No properties found matching your search
          </div>
        )}
      </div>
    </div>
  )
);
