'use client';
import { Bed, Bath, Square } from "lucide-react";

export const PropertyCard = ({ property, onBuy, formatPrice }) => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
    <div className="relative h-64 w-full bg-gray-200">
      <iframe
        src={property.url}
        title={property.address}
        className="w-full h-full"
        loading="lazy"
      />
    </div>

    <div className="p-6">
      <div className="min-h-[4rem]">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {property.address}
        </h3>
      </div>
      
      <div className="mt-2">
        <p className="text-xl font-bold text-rose-600">{formatPrice(property.price)}</p>
        <p className="text-sm text-gray-500 mt-1">{property.broker}</p>
      </div>

      <div className="mt-4 flex justify-between text-sm text-gray-500">
        <div className="flex items-center">
          <Bed className="h-4 w-4 mr-1" />
          <span>{property.beds} beds</span>
        </div>
        <div className="flex items-center">
          <Bath className="h-4 w-4 mr-1" />
          <span>{property.baths} baths</span>
        </div>
        <div className="flex items-center">
          <Square className="h-4 w-4 mr-1" />
          <span>{property.sqft} sqft</span>
        </div>
      </div>

      <button
        onClick={() => onBuy(property.id)}
        disabled={!property.available}
        className={`mt-4 w-full py-2 px-4 rounded-lg text-white font-medium
          ${property.available 
            ? 'bg-rose-500 hover:bg-rose-600' 
            : 'bg-gray-400 cursor-not-allowed'
          } transition-colors duration-200`}
      >
        {property.available ? 'Buy Property' : 'Sold'}
      </button>
    </div>
  </div>
);