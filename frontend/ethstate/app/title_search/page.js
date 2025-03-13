'use client';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase/client";
import { useUser } from '@clerk/nextjs';
import { ethers } from "ethers";

export default function TitleSearchPage() {
  const { user } = useUser();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [property, setProperty] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchPerformed, setSearchPerformed] = useState(false);

  const searchProperty = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");
    setSearchPerformed(true);
    
    if (!searchQuery) {
      setErrorMessage("Please enter a property ID");
      setIsLoading(false);
      return;
    }

    try {
      // Convert to number to ensure it's a valid property ID
      const propertyId = parseInt(searchQuery.trim());
      
      if (isNaN(propertyId)) {
        setErrorMessage("Please enter a valid property ID (numeric value)");
        setIsLoading(false);
        return;
      }

      // Fetch property details
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .select('*')
        .eq('id', propertyId)
        .single();

      if (propertyError) {
        if (propertyError.code === 'PGRST116') {
          setErrorMessage(`No property found with ID: ${propertyId}`);
        } else {
          console.error("Error fetching property:", propertyError);
          setErrorMessage("Error fetching property details");
        }
        setProperty(null);
        setBidHistory([]);
        setIsLoading(false);
        return;
      }

      setProperty(propertyData);

      // Fetch bid history
      const { data: bidsData, error: bidsError } = await supabase
        .from('bid_history')
        .select('*')
        .eq('property_id', propertyId)
        .order('created_at', { ascending: false });

      if (bidsError) {
        console.error("Error fetching bid history:", bidsError);
        setErrorMessage("Error fetching bid history");
        setBidHistory([]);
      } else {
        setBidHistory(bidsData || []);
      }
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const formatAmount = (amountStr) => {
    try {
      // Convert from wei to ether and format with 4 decimal places
      return parseFloat(ethers.utils.formatUnits(amountStr, 18)).toFixed(4);
    } catch (e) {
      return amountStr; // Return as is if parsing fails
    }
  };

  const getStatusBadgeClass = (status) => {
    switch(status.toLowerCase()) {
      case 'placed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'finalized':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-500';
    }
  };

  const shortenAddress = (address) => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  const shortenTxHash = (hash) => {
    if (!hash) return '';
    return `${hash.substring(0, 10)}...${hash.substring(hash.length - 6)}`;
  };

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-white shadow-md py-4 px-4 sm:px-6 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => router.push('/')}
            className="mr-4 text-gray-600 hover:text-[#FF5A5F]"
          >
            ← Back to Dashboard
          </button>
          <div className="text-xl sm:text-2xl font-bold text-[#FF5A5F]">PropChain</div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Property Title Search</h1>
          
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-semibold mb-4">Search by Property ID</h2>
            <form onSubmit={searchProperty} className="flex items-stretch mb-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter property ID"
                className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-[#FF5A5F]"
              />
              <button
                type="submit"
                className="bg-[#FF5A5F] text-white px-6 py-3 rounded-r-md hover:bg-opacity-90 transition"
                disabled={isLoading}
              >
                {isLoading ? 'Searching...' : 'Search'}
              </button>
            </form>
            {errorMessage && (
              <div className="text-red-500 mb-4">{errorMessage}</div>
            )}
          </div>

          {searchPerformed && !errorMessage && (
            <>
              {property && (
                <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg mb-8">
                  <h2 className="text-xl font-semibold mb-4">Property Details</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-600">Property ID</p>
                      <p className="font-semibold">{property.id}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Address</p>
                      <p className="font-semibold">{property.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Broker</p>
                      <p className="font-semibold">{property.broker || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Price</p>
                      <p className="text-[#FF5A5F] font-bold">${property.price}</p>
                    </div>
                    <div>
                      <p className="text-gray-600">Status</p>
                      <p className={`font-semibold ${property.available ? 'text-green-600' : 'text-red-600'}`}>
                        {property.available ? 'Available' : 'Sold'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Listed Date</p>
                      <p className="font-semibold">
                        {new Date(property.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => router.push(`/property/${property.id}`)}
                      className="text-[#FF5A5F] font-semibold hover:underline"
                    >
                      View Full Property Details →
                    </button>
                  </div>
                </div>
              )}

              {/* Bid History Section */}
              <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
                <h2 className="text-xl font-semibold mb-4">Bid History</h2>
                
                {bidHistory.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="py-3 px-4 font-semibold text-gray-700">Date & Time</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">User ID</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Wallet Address</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Amount</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">TX Hash</th>
                          <th className="py-3 px-4 font-semibold text-gray-700">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bidHistory.map((bid) => (
                          <tr key={bid.id} className="border-b border-gray-200 hover:bg-gray-50">
                            <td className="py-3 px-4">
                              {new Date(bid.created_at).toLocaleString()}
                            </td>
                            <td className="py-3 px-4">
                              {shortenAddress(bid.user_id)}
                            </td>
                            <td className="py-3 px-4">
                              <a 
                                href={`https://etherscan.io/address/${bid.wallet_address}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline"
                              >
                                {shortenAddress(bid.wallet_address)}
                              </a>
                            </td>
                            <td className="py-3 px-4 font-medium">
                              {formatAmount(bid.amount)} ETH
                            </td>
                            <td className="py-3 px-4">
                              {bid.tx_hash ? (
                                <a 
                                  href={`https://etherscan.io/tx/${bid.tx_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-600 hover:underline"
                                >
                                  {shortenTxHash(bid.tx_hash)}
                                </a>
                              ) : (
                                'N/A'
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(bid.status)}`}>
                                {bid.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-gray-500 italic">
                    {property ? "No bid history found for this property." : "Search for a property to view bid history."}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}