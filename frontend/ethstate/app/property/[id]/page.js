// 'use client';

// import { useState, useEffect } from 'react';
// import { useParams } from 'next/navigation';
// import { getContract } from "../../../components/ui/ethereum";
// import Lock from "../../../contracts/Lock.json";
// import { realProperties } from "../../components/data";

// export default function PropertyReviewPage() {
//   const params = useParams();
//   const [property, setProperty] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [newReview, setNewReview] = useState({
//     rating: 5,
//     comment: ''
//   });

//   useEffect(() => {
//     async function initPage() {
//       const contract = getContract(
//         "0x433220a86126eFe2b8C98a723E73eBAd2D0CbaDc",
//         Lock.abi,
//         0
//       );
//       setContract(contract);

//       console.log("Params:", params);

//       const propertyId = Number(params.id);
     
//       const foundProperty = realProperties.find(p => p.id === propertyId);
//       console.log("Found property:", foundProperty);
//       setProperty(foundProperty || null);
//     }
//     initPage();
//   }, [params.propertyId]);

//   const submitReview = async () => {
//     if (!contract || !property) return;

//     try {
//       const newReviewObj = {
//         id: `review-${property.reviews.length + 1}`,
//         author: 'Current User',
//         rating: newReview.rating,
//         comment: newReview.comment,
//         date: new Date().toISOString()
//       };

//       const updatedProperty = {
//         ...property,
//         reviews: [...property.reviews, newReviewObj]
//       };
//       setProperty(updatedProperty);

//       setNewReview({ rating: 5, comment: '' });
//     } catch (error) {
//       console.error("Error submitting review:", error);
//     }
//   };

//   const calculateAverageRating = () => {
//     if (!property || property.reviews.length === 0) return 0;
//     const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
//     return (totalRating / property.reviews.length).toFixed(1);
//   };

//   if (!property) {
//     return <div>Loading property details...</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-4">
//       <h1 className="text-2xl font-bold mb-4">{property.address}</h1>
//       <div className="bg-white shadow-md rounded-lg p-6">
//         <div className="mb-4">
//           <h2 className="text-xl font-semibold">Property Details</h2>
//           <p>{property.details}</p>
//           <p>Broker: {property.broker}</p>
//           <p>Price: ${property.price}</p>
//         </div>

//         <div className="mb-4">
//           <h2 className="text-xl font-semibold">Reviews</h2>
//           <div className="flex items-center mb-4">
//             <span className="text-2xl font-bold mr-2">{calculateAverageRating()}</span>
//             <span>/ 5 stars ({property.reviews.length} reviews)</span>
//           </div>

//           {property.reviews.map((review) => (
//             <div key={review.id} className="border-b py-4">
//               <div className="flex justify-between">
//                 <div className="font-semibold">{review.author}</div>
//                 <div className="text-gray-500">{new Date(review.date).toLocaleDateString()}</div>
//               </div>
//               <div className="text-yellow-500">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
//               <p>{review.comment}</p>
//             </div>
//           ))}
//         </div>

//         <div className="mt-6">
//           <h3 className="text-lg font-semibold mb-4">Write a Review</h3>
//           <div className="mb-4">
//             <label className="block mb-2">Rating</label>
//             <div className="flex">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <button
//                   key={star}
//                   onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
//                   className={`text-2xl ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
//                 >
//                   ★
//                 </button>
//               ))}
//             </div>
//           </div>
//           <div className="mb-4">
//             <label className="block mb-2">Comment</label>
//             <textarea
//               value={newReview.comment}
//               onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
//               className="w-full p-2 border rounded"
//               rows={4}
//               placeholder="Share your experience with this property"
//             />
//           </div>
//           <button
//             onClick={submitReview}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Submit Review
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getContract } from "../../../components/ui/ethereum";
import Lock from "../../../contracts/Lock.json";
import { realProperties } from "../../components/data";

// export default function PropertyReviewPage() {
//   const router = useRouter();
//   const params = useParams();
//   const fileInputRef = useRef(null);
//   const [property, setProperty] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [newReview, setNewReview] = useState({
//     rating: 5,
//     comment: ''
//   });
//   const [propertyImages, setPropertyImages] = useState([]);

//   useEffect(() => {
//     async function initPage() {
//       const contract = getContract(
//         "0x433220a86126eFe2b8C98a723E73eBAd2D0CbaDc",
//         Lock.abi,
//         0
//       );
//       setContract(contract);

//       const propertyId = Number(params.id);
//       const foundProperty = realProperties.find(p => p.id === propertyId);
//       setProperty(foundProperty || null);
//     }
//     initPage();
//   }, [params.propertyId]);

//   const submitReview = async () => {
//     if (!contract || !property) return;

//     try {
//       const newReviewObj = {
//         id: `review-${property.reviews.length + 1}`,
//         author: 'Current User',
//         rating: newReview.rating,
//         comment: newReview.comment,
//         date: new Date().toISOString()
//       };

//       const updatedProperty = {
//         ...property,
//         reviews: [...property.reviews, newReviewObj]
//       };
//       setProperty(updatedProperty);

//       setNewReview({ rating: 5, comment: '' });
//     } catch (error) {
//       console.error("Error submitting review:", error);
//     }
//   };

//   const buyProperty = async () => {
//     if (!contract || !property || !property.available) return;

//     try {
//       const tx = await contract.increment();
//       await tx.wait();

//       const updatedProperty = {
//         ...property,
//         available: false
//       };
//       setProperty(updatedProperty);
//     } catch (error) {
//       console.error("Error buying property:", error);
//     }
//   };

//   const handleImageUpload = (e) => {
//     const files = Array.from(e.target.files);
//     const newImages = files.map(file => URL.createObjectURL(file));
//     setPropertyImages(prev => [...prev, ...newImages]);
//   };

//   const calculateAverageRating = () => {
//     if (!property || property.reviews.length === 0) return 0;
//     const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
//     return (totalRating / property.reviews.length).toFixed(1);
//   };

//   if (!property) {
//     return <div>Loading property details...</div>;
//   }

//   return (
//     <div className="bg-white min-h-screen">
//       <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
//         <div className="flex items-center">
//           <button 
//             onClick={() => router.push('/')}
//             className="mr-4 text-gray-600 hover:text-[#FF5A5F]"
//           >
//             ← Back to Dashboard
//           </button>
//           <div className="text-2xl font-bold text-[#FF5A5F]">BlockBnB</div>
//         </div>
//         <nav className="flex space-x-4">
//           <a href="#" className="text-gray-700 hover:text-[#FF5A5F]">Become a host</a>
//           <a href="#" className="text-gray-700 hover:text-[#FF5A5F]">Help</a>
//           <a href="#" className="text-gray-700 hover:text-[#FF5A5F]">Sign up</a>
//           <a href="#" className="text-gray-700 hover:text-[#FF5A5F]">Log in</a>
//         </nav>
//       </header>

//       <main className="container mx-auto px-6 py-8">
//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Property Images Section */}
//           <div>
//             {/* <div className="mb-6">
//               <img 
//                 src={property.imageUrl || '/placeholder-property.jpg'} 
//                 alt={property.address} 
//                 className="w-full h-96 object-cover rounded-xl"
//               />
//             </div> */}
//             <div className="relative h-64 w-full bg-gray-200">
//                  <iframe
//                    src={property.url}
//                    title={property.address}
//                    className="w-full h-full"
//                   loading="lazy"
//                  />
//                </div>
            

//             {/* Image Upload and Horizontal Scroll */}
//             <div className="mb-6">
//               <div className="flex items-center mb-4">
//                 <h2 className="text-xl font-semibold mr-4 text-gray-800">Additional Images</h2>
//                 <button 
//                   onClick={() => fileInputRef.current.click()}
//                   className="bg-[#FF5A5F] text-white px-3 py-2 rounded-md hover:bg-opacity-90"
//                 >
//                   Upload Image
//                 </button>
//                 <input 
//                   type="file" 
//                   ref={fileInputRef}
//                   onChange={handleImageUpload}
//                   accept="image/*"
//                   multiple
//                   className="hidden"
//                 />
//               </div>
//               <div className="flex overflow-x-auto space-x-4 pb-4">
//                 {propertyImages.map((image, index) => (
//                   <div key={index} className="flex-shrink-0 w-48 h-36">
//                     <img 
//                       src={image} 
//                       alt={`Property image ${index + 1}`} 
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Property Details and Reviews Section */}
//           <div>
//             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
//               <div className="mb-6">
//                 <h1 className="text-2xl font-bold text-gray-800 mb-2">{property.address}</h1>
//                 <div className="flex items-center mb-4">
//                   <span className="text-yellow-500 text-xl">★</span>
//                   <span className="ml-2 text-gray-700 text-lg">
//                     {calculateAverageRating()} ({property.reviews.length} reviews)
//                   </span>
//                 </div>
//                 <p className="text-gray-600 mb-4">{property.details}</p>
//                 <div className="flex justify-between mb-4">
//                   <div>
//                     <p className="text-gray-600">Broker</p>
//                     <p className="font-semibold">{property.broker}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600">Price</p>
//                     <p className="text-[#FF5A5F] font-bold text-xl">${property.price} / night</p>
//                   </div>
//                 </div>
                
//                 {/* Buy Property Button */}
//                 <button
//                   onClick={buyProperty}
//                   disabled={!property.available}
//                   className={`w-full py-3 rounded-md text-white font-semibold ${
//                     property.available 
//                       ? 'bg-[#FF5A5F] hover:bg-opacity-90' 
//                       : 'bg-gray-400 cursor-not-allowed'
//                   }`}
//                 >
//                   {property.available ? 'Buy Property' : 'Sold'}
//                 </button>
//               </div>

//               {/* Reviews Section */}
//               <div className="border-t pt-6">
//                 <h2 className="text-xl font-semibold mb-4 text-gray-800">Guest Reviews</h2>
//                 {property.reviews.map((review) => (
//                   <div key={review.id} className="border-b pb-4 mb-4">
//                     <div className="flex justify-between mb-2">
//                       <div className="font-semibold text-gray-700">{review.author}</div>
//                       <div className="text-gray-500 text-sm">
//                         {new Date(review.date).toLocaleDateString()}
//                       </div>
//                     </div>
//                     <div className="text-yellow-500 mb-2">
//                       {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
//                     </div>
//                     <p className="text-gray-600">{review.comment}</p>
//                   </div>
//                 ))}
//               </div>

//               {/* Write a Review Section */}
//               <div className="mt-6">
//                 <h3 className="text-xl font-semibold mb-4 text-gray-800">Write a Review</h3>
//                 <div className="mb-4">
//                   <label className="block mb-2 text-gray-700">Rating</label>
//                   <div className="flex">
//                     {[1, 2, 3, 4, 5].map((star) => (
//                       <button
//                         key={star}
//                         onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
//                         className={`text-2xl ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
//                       >
//                         ★
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//                 <div className="mb-4">
//                   <label className="block mb-2 text-gray-700">Comment</label>
//                   <textarea
//                     value={newReview.comment}
//                     onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
//                     className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#FF5A5F]"
//                     rows={4}
//                     placeholder="Share your experience with this property"
//                   />
//                 </div>
//                 <button
//                   onClick={submitReview}
//                   className="w-full bg-[#FF5A5F] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
//                 >
//                   Submit Review
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

export default function PropertyReviewPage() {
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef(null);
  const [property, setProperty] = useState(null);
  const [contract, setContract] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [propertyImages, setPropertyImages] = useState([]);

  useEffect(() => {
    async function initPage() {
      const contract = getContract(
        "0x433220a86126eFe2b8C98a723E73eBAd2D0CbaDc",
        Lock.abi,
        0
      );
      setContract(contract);

      const propertyId = Number(params.id);
      const foundProperty = realProperties.find(p => p.id === propertyId);
      setProperty(foundProperty || null);
    }
    initPage();
  }, [params.propertyId]);

  const submitReview = async () => {
    if (!contract || !property) return;

    try {
      const newReviewObj = {
        id: `review-${property.reviews.length + 1}`,
        author: 'Current User',
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString()
      };

      const updatedProperty = {
        ...property,
        reviews: [...property.reviews, newReviewObj]
      };
      setProperty(updatedProperty);

      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  const buyProperty = async () => {
    if (!contract || !property || !property.available) return;

    try {
      const tx = await contract.increment();
      await tx.wait();

      const updatedProperty = {
        ...property,
        available: false
      };
      setProperty(updatedProperty);
    } catch (error) {
      console.error("Error buying property:", error);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map(file => URL.createObjectURL(file));
    setPropertyImages(prev => [...prev, ...newImages]);
  };

  const calculateAverageRating = () => {
    if (!property || property.reviews.length === 0) return 0;
    const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / property.reviews.length).toFixed(1);
  };

  if (!property) {
    return <div>Loading property details...</div>;
  }

  return (
    <div className="bg-white min-h-screen">
      <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <button 
            onClick={() => router.push('/')}
            className="mr-4 text-gray-600 hover:text-[#FF5A5F]"
          >
            ← Back to Dashboard
          </button>
          <div className="text-2xl font-bold text-[#FF5A5F]">PropChain</div>
        </div>
        {/* <nav className="flex space-x-4">
          <a href="#" className="text-gray-700 hover:text-[#FF5A5F]">Become a host</a>
          <a href="#" className="text-gray-700 hover:text-[#FF5A5F]">Help</a>
          <a href="#" className="text-gray-700 hover:text-[#FF5A5F]">Sign up</a>
          <a href="#" className="text-gray-700 hover:text-[#FF5A5F]">Log in</a>
        </nav> */}
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Property Images Section */}
          <div>
            <div className="mb-6 w-full h-[600px]">
              <iframe 
                src={property.url} 
                className="w-full h-full rounded-xl"
                title={`Property at ${property.address}`}
                allowFullScreen
              />
            </div>

            {/* Image Upload and Horizontal Scroll */}
            <div className="mb-6">
              <div className="flex items-center mb-4">
                <h2 className="text-xl font-semibold mr-4 text-gray-800">Additional Images</h2>
                <button 
                  onClick={() => fileInputRef.current.click()}
                  className="bg-[#FF5A5F] text-white px-3 py-2 rounded-md hover:bg-opacity-90"
                >
                  Upload Image
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>
              <div className="flex overflow-x-auto space-x-4 pb-4">
                {propertyImages.map((image, index) => (
                  <div key={index} className="flex-shrink-0 w-48 h-36">
                    <img 
                      src={image} 
                      alt={`Property image ${index + 1}`} 
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Property Details and Reviews Section */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-2">{property.address}</h1>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="ml-2 text-gray-700 text-lg">
                    {calculateAverageRating()} ({property.reviews.length} reviews)
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{property.details}</p>
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="text-gray-600">Broker</p>
                    <p className="font-semibold">{property.broker}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Price</p>
                    <p className="text-[#FF5A5F] font-bold text-xl">${property.price}</p>
                  </div>
                </div>
                
                {/* Buy Property Button */}
                <button
                  onClick={buyProperty}
                  disabled={!property.available}
                  className={`w-full py-3 rounded-md text-white font-semibold ${
                    property.available 
                      ? 'bg-[#FF5A5F] hover:bg-opacity-90' 
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {property.available ? 'Buy Property' : 'Sold'}
                </button>
              </div>

              {/* Reviews Section */}
              <div className="border-t pt-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-800">Guest Reviews</h2>
                {property.reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4 mb-4">
                    <div className="flex justify-between mb-2">
                      <div className="font-semibold text-gray-700">{review.author}</div>
                      <div className="text-gray-500 text-sm">
                        {new Date(review.date).toLocaleDateString()}
                      </div>
                    </div>
                    <div className="text-yellow-500 mb-2">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
              </div>

              {/* Write a Review Section */}
              <div className="mt-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">Write a Review</h3>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700">Rating</label>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                        className={`text-2xl ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block mb-2 text-gray-700">Comment</label>
                  <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#FF5A5F]"
                    rows={4}
                    placeholder="Share your experience with this property"
                  />
                </div>
                <button
                  onClick={submitReview}
                  className="w-full bg-[#FF5A5F] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}