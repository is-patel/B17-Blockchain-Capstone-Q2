// 'use client';
// import React, { useState } from 'react';

// const Home = () => {
//   const [bedrooms, setBedrooms] = useState('');
//   const [city, setCity] = useState('');
//   const [state, setState] = useState('');
//   const [zipCode, setZipCode] = useState('');

//   // Sample property data - replace with your actual data
//   const properties = [
//     {
//       id: 1,
//       title: "Modern Downtown Condo",
//       bedrooms: 2,
//       city: "Austin",
//       state: "TX",
//       zipCode: "78701",
//       price: "$450,000",
//       imageUrl: "/api/placeholder/400/250"
//     },
//     {
//       id: 2,
//       title: "Suburban Family Home",
//       bedrooms: 4,
//       city: "Houston",
//       state: "TX",
//       zipCode: "77024",
//       price: "$750,000",
//       imageUrl: "/api/placeholder/400/250"
//     }
//   ];

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Navigation Bar */}
//       <nav className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center">
//               <span className="text-xl font-bold text-gray-800">Web3 Real Estate</span>
//               <div className="ml-10 flex items-center space-x-4">
//                 <button className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
//                   List Property
//                 </button>
//                 <button className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
//                   Invest
//                 </button>
//                 <button className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors">
//                   Profile
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Main Content */}
//       <main className="max-w-7xl mx-auto px-4 py-8">
//         {/* Filters */}
//         <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//           <h2 className="text-xl font-semibold mb-4">Find Your Perfect Property</h2>
//           <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//             <select 
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={bedrooms}
//               onChange={(e) => setBedrooms(e.target.value)}
//             >
//               <option value="">Bedrooms</option>
//               {[1, 2, 3, 4, 5].map((num) => (
//                 <option key={num} value={num}>
//                   {num} {num === 1 ? 'Bedroom' : 'Bedrooms'}
//                 </option>
//               ))}
//             </select>

//             <input
//               type="text"
//               placeholder="City"
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//             />

//             <select
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={state}
//               onChange={(e) => setState(e.target.value)}
//             >
//               <option value="">State</option>
//               <option value="TX">Texas</option>
//               <option value="CA">California</option>
//               <option value="NY">New York</option>
//             </select>

//             <input
//               type="text"
//               placeholder="ZIP Code"
//               className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               value={zipCode}
//               onChange={(e) => setZipCode(e.target.value)}
//             />
//           </div>
//         </div>

//         {/* Property Listings */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {properties.map((property) => (
//             <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
//               <img
//                 src={property.imageUrl}
//                 alt={property.title}
//                 className="w-full h-48 object-cover"
//               />
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold mb-2">{property.title}</h3>
//                 <p className="text-2xl font-bold text-blue-600 mb-2">
//                   {property.price}
//                 </p>
//                 <div className="text-sm text-gray-500 mb-4">
//                   <p>{property.bedrooms} Bedrooms</p>
//                   <p>{property.city}, {property.state} {property.zipCode}</p>
//                 </div>
//                 <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
//                   View Details
//                 </button>
//               </div>
//             </div>
//           ))}
//         </div>
//       </main>
//     </div>
//   );
// };

// export default Home;

// import { useEffect, useState } from "react";
// import { getContract } from "../components/ui/ethereum";
// import Lock from "../contracts/Lock.json";

// export default function Home() {
//   const [count, setCount] = useState(0);
//   const [contract, setContract] = useState(null);

//   useEffect(() => {
//     async function initContract() {
//       const contract = getContract(
//         "0x433220a86126eFe2b8C98a723E73eBAd2D0CbaDc",
//         Lock.abi,
//         0 // Use the first account as the signer
//       );
//       setContract(contract);
//       const initialCount = await contract.getCount();
//       setCount(initialCount.toNumber());
//     }
//     initContract();
//   }, []);

//   async function increment() {
//     if (!contract) return;
//     const tx = await contract.increment();
//     await tx.wait();
//     const updatedCount = await contract.getCount();
//     setCount(updatedCount.toNumber());
//   }

//   return (
//     <div style={{ textAlign: 'center'}}>
//       <h1>Counter: {count}</h1>
//       <button onClick={increment}>Increment</button>
//     </div>
//   );
// }

'use client';
import { useEffect, useState } from "react";
import { getContract } from "../components/ui/ethereum";
import Lock from "../contracts/Lock.json";
import { Search, MapPin, Home, Filter } from "lucide-react";

export default function DashboardHome() {
  const [properties, setProperties] = useState([]);
  const [contract, setContract] = useState(null);

  // Sample property data - in a real app, this would come from the blockchain
  const sampleProperties = [
    {
      id: 1,
      title: "Modern Downtown Condo",
      price: "450,000",
      location: "Downtown Miami",
      beds: 2,
      baths: 2,
      sqft: "1,200",
      available: true
    },
    {
      id: 2,
      title: "Luxury Beach Villa",
      price: "890,000",
      location: "Miami Beach",
      beds: 4,
      baths: 3,
      sqft: "2,800",
      available: true
    },
    {
      id: 3,
      title: "Cozy Studio Apartment",
      price: "275,000",
      location: "Brickell",
      beds: 1,
      baths: 1,
      sqft: "650",
      available: true
    }
  ];

  useEffect(() => {
    async function initContract() {
      const contract = getContract(
        "0x433220a86126eFe2b8C98a723E73eBAd2D0CbaDc",
        Lock.abi,
        0
      );
      setContract(contract);
      setProperties(sampleProperties);
    }
    initContract();
  }, []);

  async function buyProperty(propertyId) {
    if (!contract) return;
    try {
      const tx = await contract.increment(); // This would be replaced with actual purchase logic
      await tx.wait();
      // Update property availability
      setProperties(properties.map(p => 
        p.id === propertyId ? {...p, available: false} : p
      ));
    } catch (error) {
      console.error("Error buying property:", error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Home className="h-8 w-8 text-rose-500" />
              <h1 className="ml-2 text-xl font-semibold text-gray-900">RealEstate Chain</h1>
            </div>
            
            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  placeholder="Search for properties..."
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {/* Filter Button */}
            <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter className="h-5 w-5 mr-2" />
              <span>Filters</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              {/* Property Image */}
              <div className="h-48 w-full bg-gray-200 relative">
                <img
                  src={`/api/placeholder/400/300`}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Property Details */}
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-gray-900">{property.title}</h3>
                  <p className="text-lg font-bold text-rose-600">${property.price}</p>
                </div>

                <div className="mt-2 flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  <p>{property.location}</p>
                </div>

                <div className="mt-4 flex justify-between text-sm text-gray-500">
                  <span>{property.beds} beds</span>
                  <span>{property.baths} baths</span>
                  <span>{property.sqft} sq ft</span>
                </div>

                <button
                  onClick={() => buyProperty(property.id)}
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
          ))}
        </div>
      </main>
    </div>
  );
}