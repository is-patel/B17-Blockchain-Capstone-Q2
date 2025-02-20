'use client';
import { useEffect, useState } from "react";
import Link from 'next/link';
import { supabase } from "../lib/supabase/client";
import { getContract } from "../../components/ui/ethereum";
import Lock from "../../contracts/Lock.json";

export default function DashboardHome() {
  const [properties, setProperties] = useState([]);
  const [contract, setContract] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProperties, setFilteredProperties] = useState([]);

  useEffect(() => {
    async function initData() {
      try {
        // Initialize Ethereum contract
        const contract = getContract(
          "0x433220a86126eFe2b8C98a723E73eBAd2D0CbaDc",
          Lock.abi,
          0
        );
        setContract(contract);

        // Fetch properties from Supabase
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            reviews(*)
          `);

        if (error) throw error;

        setProperties(data);
        setFilteredProperties(data);
      } catch (error) {
        console.error("Error initializing data:", error);
      }
    }
    initData();
  }, []);

  useEffect(() => {
    const filtered = properties.filter(property =>
      property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.broker.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProperties(filtered);
  }, [searchTerm, properties]);

  // Calculate average rating for a property
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / reviews.length).toFixed(1);
  };

  // Format price 
  const formatPrice = (price) => `$${price.replace(/,/g, ',')}`;

  // Buy property function
  async function buyProperty(propertyId) {
    if (!contract) return;
    try {
      const tx = await contract.increment();
      await tx.wait();

      // Update property availability in Supabase
      const { data, error } = await supabase
        .from('properties')
        .update({ available: false })
        .eq('id', propertyId);

      if (error) throw error;

      // Update local state
      const updatedProperties = properties.map(p =>
        p.id === propertyId ? {...p, available: false} : p
      );
      setProperties(updatedProperties);
      setFilteredProperties(updatedProperties);
    } catch (error) {
      console.error("Error buying property:", error);
    }
  }

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-2xl font-bold text-[#FF5A5F]">PropChain</div>
          <input 
            type="text"
            placeholder="Search properties"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="ml-4 px-3 py-2 border rounded-full w-96 focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
          />
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <div 
              key={property.id} 
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="relative">
                <div className="mb-6 w-full h-[600px]">
                  <iframe 
                    src={property.url} 
                    className="w-full h-full rounded-xl"
                    title={`Property at ${property.address}`}
                    allowFullScreen
                  />
                </div>
                <div className="absolute top-4 right-4 bg-white bg-opacity-80 px-2 py-1 rounded-full text-sm font-semibold">
                  {property.available ? 'Available' : 'Sold'}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-lg font-bold text-gray-800">{property.address}</h2>
                  <div className="flex items-center">
                    <span className="text-yellow-500">★</span>
                    <span className="ml-1 text-gray-600">
                      {calculateAverageRating(property.reviews)}
                    </span>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">{property.broker}</p>
                <div className="flex justify-between items-center">
                  <div className="text-lg font-semibold text-[#FF5A5F]">
                    {formatPrice(property.price)}
                  </div>
                  <div className="flex space-x-2">
                    <Link 
                      href={`/property/${property.id}`} 
                      className="bg-[#FF5A5F] text-white px-3 py-2 rounded-md hover:bg-opacity-90 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProperties.length === 0 && (
          <div className="text-center mt-8">
            <p className="text-gray-600">No properties found matching your search</p>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}
      </main>
    </div>
  );
}