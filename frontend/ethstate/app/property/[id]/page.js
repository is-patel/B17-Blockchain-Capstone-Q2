// // 'use client';
// // import { useEffect, useState, useRef } from "react";
// // import { useRouter, useParams } from "next/navigation";
// // import { supabase } from '../../lib/supabase/client';
// // import { getContract } from "../../../components/ui/ethereum";
// // import Lock from "../../../contracts/Lock.json";


// // import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';

// // export default function PropertyReviewPage() {
// //   const { user } = useUser();
// //   const router = useRouter();
// //   const params = useParams();
// //   const fileInputRef = useRef(null);
// //   const [property, setProperty] = useState(null);
// //   const [contract, setContract] = useState(null);
// //   const [newReview, setNewReview] = useState({
// //     rating: 5,
// //     comment: ''
// //   });
// //   const [propertyImages, setPropertyImages] = useState([]);

// //   useEffect(() => {
// //     async function initPage() {
// //       try {
// //         // Initialize Ethereum contract
// //         const contract = getContract(
// //           "0x433220a86126eFe2b8C98a723E73eBAd2D0CbaDc",
// //           Lock.abi,
// //           0
// //         );
// //         setContract(contract);

// //         // Fetch property details from Supabase
// //         const { data, error } = await supabase
// //           .from('properties')
// //           .select(`
// //             *,
// //             reviews(*),
// //             property_images(*)
// //           `)
// //           .eq('id', Number(params.id))
// //           .single();

// //         if (error) throw error;

// //         setProperty(data);
// //         setPropertyImages(data.property_images.map(img => img.image_url));
// //       } catch (error) {
// //         console.error("Error fetching property:", error);
// //         router.push('/');
// //       }
// //     }
// //     initPage();
// //   }, [params.id, router]);

// //   const submitReview = async () => {
// //     if (!property) return;

// //     try {
// //       const reviewAuthor = user 
// //         ? `${user.firstName} ${user.lastName}`.trim() 
// //         : 'Anonymous';

// //       const newReviewObj = {
// //         id: `review-${property.reviews.length + 1}`,
// //         author: reviewAuthor,
// //         rating: newReview.rating,
// //         comment: newReview.comment,
// //         date: new Date().toISOString()
// //       };

// //       // Submit review to Supabase
// //       const { data, error } = await supabase
// //         .from('reviews')
// //         .insert({
// //           property_id: property.id,
// //           rating: newReview.rating,
// //           comment: newReview.comment,
// //           author: reviewAuthor // Replace with actual user authentication
// //         })
// //         .select();

// //       if (error) throw error;

// //       // Update local state
// //       const updatedProperty = {
// //         ...property,
// //         reviews: [...property.reviews, data[0]]
// //       };
// //       setProperty(updatedProperty);

// //       // Reset review form
// //       setNewReview({ rating: 5, comment: '' });
// //     } catch (error) {
// //       console.error("Error submitting review:", error);
// //     }
// //   };

// //   const buyProperty = async () => {
// //     if (!contract || !property || !property.available) return;

// //     try {
// //       // Execute Ethereum transaction
// //       const tx = await contract.increment();
// //       await tx.wait();

// //       // Update property availability in Supabase
// //       const { error } = await supabase
// //         .from('properties')
// //         .update({ available: false })
// //         .eq('id', property.id);

// //       if (error) throw error;

// //       // Update local state
// //       const updatedProperty = {
// //         ...property,
// //         available: false
// //       };
// //       setProperty(updatedProperty);
// //     } catch (error) {
// //       console.error("Error buying property:", error);
// //     }
// //   };

// //   const handleImageUpload = async (e) => {
// //     if (!property || !user) {
// //       console.log("No property or user found");
// //       return;
// //     }

// //     const files = Array.from(e.target.files);
    
// //     try {
// //       // Upload images to Supabase storage and save metadata
// //       const uploadPromises = files.map(async (file) => {
// //         // Generate a unique filename
// //         const fileExt = file.name.split('.').pop();
// //         const fileName = `${Math.random()}.${fileExt}`;
// //         const filePath = `${property.id}/${fileName}`;

// //         // Upload to Supabase storage
// //         const { data: uploadData, error: uploadError } = await supabase.storage
// //           .from('property-images')
// //           .upload(filePath, file);

// //         if (uploadError) throw uploadError;

// //         // Get public URL
// //         const { data: { publicUrl } } = supabase.storage
// //           .from('property-images')
// //           .getPublicUrl(filePath);

// //         // Save image metadata to database
// //         const { data: imageData, error: dbError } = await supabase
// //           .from('property_images')
// //           .insert({
// //             property_id: property.id,
// //             image_url: publicUrl,
// //             description: file.name
// //           })
// //           .select();

// //         if (dbError) throw dbError;

// //         // Handle API upload for rewards
// //         const formData = new FormData();
// //         formData.append('file', file);
// //         formData.append('userId', user.id);

// //         const response = await fetch('/api/upload', {
// //           method: 'POST',
// //           body: formData,
// //         });

// //         if (!response.ok) {
// //           const errorText = await response.text();
// //           console.error('Server response:', response.status, errorText);
// //           throw new Error(`HTTP error! status: ${response.status}`);
// //         }

// //         const apiData = await response.json();
// //         console.log("Upload response:", apiData);
        
// //         if (apiData.success) {
// //           console.log("Coins updated to:", apiData.coins);
// //         }

// //         return publicUrl;
// //       });

// //       const newImageUrls = await Promise.all(uploadPromises);

// //       // Update local state with new image URLs
// //       setPropertyImages(prev => [...prev, ...newImageUrls]);
// //     } catch (error) {
// //       console.error("Error uploading images:", error);
// //     }
// //   };

// //   const calculateAverageRating = () => {
// //     if (!property || property.reviews.length === 0) return 0;
// //     const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
// //     return (totalRating / property.reviews.length).toFixed(1);
// //   };

// //   if (!property) {
// //     return <div>Loading property details...</div>;
// //   }

// //   return (
// //     <div className="bg-white min-h-screen">
// //       <header className="bg-white shadow-md py-4 px-6 flex justify-between items-center">
// //         <div className="flex items-center">
// //           <button 
// //             onClick={() => router.push('/')}
// //             className="mr-4 text-gray-600 hover:text-[#FF5A5F]"
// //           >
// //             ← Back to Dashboard
// //           </button>
// //           <div className="text-2xl font-bold text-[#FF5A5F]">PropChain</div>
// //         </div>
// //       </header>

// //       <main className="container mx-auto px-6 py-8">
// //         <div className="grid md:grid-cols-2 gap-8">
// //           {/* Property Images Section */}
// //           <div>
// //             <div className="mb-6 w-full h-[600px]">
// //               <iframe 
// //                 src={property.url} 
// //                 className="w-full h-full rounded-xl"
// //                 title={`Property at ${property.address}`}
// //                 allowFullScreen
// //               />
// //             </div>

// //             {/* Image Upload and Horizontal Scroll */}
// //             <div className="mb-6">
// //               <div className="flex items-center mb-4">
// //                 <h2 className="text-xl font-semibold mr-4 text-gray-800">Additional Images</h2>
// //                 <button 
// //                   onClick={() => fileInputRef.current.click()}
// //                   className="bg-[#FF5A5F] text-white px-3 py-2 rounded-md hover:bg-opacity-90"
// //                 >
// //                   Upload Image
// //                 </button>
// //                 <input 
// //                   type="file" 
// //                   ref={fileInputRef}
// //                   onChange={handleImageUpload}
// //                   accept="image/*"
// //                   multiple
// //                   className="hidden"
// //                 />
// //               </div>
// //               <div className="flex overflow-x-auto space-x-4 pb-4">
// //                 {propertyImages.map((imageUrl, index) => (
// //                   <div key={index} className="flex-shrink-0 w-48 h-36">
// //                     <img 
// //                       src={imageUrl} 
// //                       alt={`Property image ${index + 1}`} 
// //                       className="w-full h-full object-cover rounded-lg"
// //                     />
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>

// //           {/* Property Details and Reviews Section */}
// //           <div>
// //             <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-lg">
// //               <div className="mb-6">
// //                 <h1 className="text-2xl font-bold text-gray-800 mb-2">{property.address}</h1>
// //                 <div className="flex items-center mb-4">
// //                   <span className="text-yellow-500 text-xl">★</span>
// //                   <span className="ml-2 text-gray-700 text-lg">
// //                     {calculateAverageRating()} ({property.reviews.length} reviews)
// //                   </span>
// //                 </div>
// //                 <div className="flex justify-between mb-4">
// //                   <div>
// //                     <p className="text-gray-600">Broker</p>
// //                     <p className="font-semibold">{property.broker}</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-gray-600">Price</p>
// //                     <p className="text-[#FF5A5F] font-bold text-xl">${property.price}</p>
// //                   </div>
// //                 </div>
                
// //                 {/* Buy Property Button */}
// //                 <button
// //                   onClick={buyProperty}
// //                   disabled={!property.available}
// //                   className={`w-full py-3 rounded-md text-white font-semibold ${
// //                     property.available 
// //                       ? 'bg-[#FF5A5F] hover:bg-opacity-90' 
// //                       : 'bg-gray-400 cursor-not-allowed'
// //                   }`}
// //                 >
// //                   {property.available ? 'Buy Property' : 'Sold'}
// //                 </button>
// //               </div>

// //               {/* Reviews Section */}
// //               <div className="border-t pt-6">
// //                 <h2 className="text-xl font-semibold mb-4 text-gray-800">User Reviews</h2>
// //                 {property.reviews.map((review) => (
// //                   <div key={review.id} className="border-b pb-4 mb-4">
// //                     <div className="flex justify-between mb-2">
// //                       <div className="font-semibold text-gray-700">{review.author}</div>
// //                       <div className="text-gray-500 text-sm">
// //                         {new Date(review.date).toLocaleDateString()}
// //                       </div>
// //                     </div>
// //                     <div className="text-yellow-500 mb-2">
// //                       {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
// //                     </div>
// //                     <p className="text-gray-600">{review.comment}</p>
// //                   </div>
// //                 ))}
// //               </div>

// //               {/* Write a Review Section */}
// //               <div className="mt-6">
// //                 <h3 className="text-xl font-semibold mb-4 text-gray-800">Write a Review</h3>
// //                 <div className="mb-4">
// //                   <label className="block mb-2 text-gray-700">Rating</label>
// //                   <div className="flex">
// //                     {[1, 2, 3, 4, 5].map((star) => (
// //                       <button
// //                         key={star}
// //                         onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
// //                         className={`text-2xl ${newReview.rating >= star ? 'text-yellow-500' : 'text-gray-300'}`}
// //                       >
// //                         ★
// //                       </button>
// //                     ))}
// //                   </div>
// //                 </div>
// //                 <div className="mb-4">
// //                   <label className="block mb-2 text-gray-700">Comment</label>
// //                   <textarea
// //                     value={newReview.comment}
// //                     onChange={(e) => setNewReview(prev => ({ ...prev, comment: e.target.value }))}
// //                     className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#FF5A5F]"
// //                     rows={4}
// //                     placeholder="Share your experience with this property"
// //                   />
// //                 </div>
// //                 <button
// //                   onClick={submitReview}
// //                   className="w-full bg-[#FF5A5F] text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition"
// //                 >
// //                   Submit Review
// //                 </button>
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       </main>
// //     </div>
// //   );
// // }

// 'use client';
// import { useEffect, useState, useRef } from "react";
// import { useRouter, useParams } from "next/navigation";
// import { supabase } from '../../lib/supabase/client';
// import { getContract } from "../../../components/ui/ethereum";
// import Lock from "../../../contracts/Lock.json";
// import { useUser } from '@clerk/nextjs';

// export default function PropertyReviewPage() {
//   const { user } = useUser();
//   const router = useRouter();
//   const params = useParams();
//   const fileInputRef = useRef(null);
//   const carouselRef = useRef(null);
//   const [property, setProperty] = useState(null);
//   const [contract, setContract] = useState(null);
//   const [newReview, setNewReview] = useState({
//     rating: 5,
//     comment: ''
//   });
//   const [propertyImages, setPropertyImages] = useState([]);
//   const [currentImageIndex, setCurrentImageIndex] = useState(0);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     async function initPage() {
//       setIsLoading(true);
//       try {
//         // Initialize Ethereum contract
//         const contract = getContract(
//           "0x433220a86126eFe2b8C98a723E73eBAd2D0CbaDc",
//           Lock.abi,
//           0
//         );
//         setContract(contract);

//         // Fetch property details from Supabase
//         const { data, error } = await supabase
//           .from('properties')
//           .select(`
//             *,
//             reviews(*),
//             property_images(*)
//           `)
//           .eq('id', Number(params.id))
//           .single();

//         if (error) throw error;

//         setProperty(data);
//         setPropertyImages(data.property_images.map(img => img.image_url));
//       } catch (error) {
//         console.error("Error fetching property:", error);
//         router.push('/');
//       } finally {
//         setIsLoading(false);
//       }
//     }
//     initPage();
//   }, [params.id, router]);

//   const scrollToPrevImage = () => {
//     if (propertyImages.length === 0) return;
    
//     setCurrentImageIndex(prev => {
//       const newIndex = prev === 0 ? propertyImages.length - 1 : prev - 1;
//       return newIndex;
//     });
    
//     if (carouselRef.current) {
//       const itemWidth = carouselRef.current.offsetWidth;
//       carouselRef.current.scrollTo({
//         left: currentImageIndex * itemWidth,
//         behavior: 'smooth'
//       });
//     }
//   };

//   const scrollToNextImage = () => {
//     if (propertyImages.length === 0) return;
    
//     setCurrentImageIndex(prev => {
//       const newIndex = prev === propertyImages.length - 1 ? 0 : prev + 1;
//       return newIndex;
//     });
    
//     if (carouselRef.current) {
//       const itemWidth = carouselRef.current.offsetWidth;
//       carouselRef.current.scrollTo({
//         left: currentImageIndex * itemWidth,
//         behavior: 'smooth'
//       });
//     }
//   };

//   const submitReview = async () => {
//     if (!property) return;

//     try {
//       const reviewAuthor = user 
//         ? `${user.firstName} ${user.lastName}`.trim() 
//         : 'Anonymous';

//       const newReviewObj = {
//         id: `review-${property.reviews.length + 1}`,
//         author: reviewAuthor,
//         rating: newReview.rating,
//         comment: newReview.comment,
//         date: new Date().toISOString()
//       };

//       // Submit review to Supabase
//       const { data, error } = await supabase
//         .from('reviews')
//         .insert({
//           property_id: property.id,
//           rating: newReview.rating,
//           comment: newReview.comment,
//           author: reviewAuthor // Replace with actual user authentication
//         })
//         .select();

//       if (error) throw error;

//       // Update local state
//       const updatedProperty = {
//         ...property,
//         reviews: [...property.reviews, data[0]]
//       };
//       setProperty(updatedProperty);

//       // Reset review form
//       setNewReview({ rating: 5, comment: '' });
//     } catch (error) {
//       console.error("Error submitting review:", error);
//     }
//   };

//   const buyProperty = async () => {
//     if (!contract || !property || !property.available) return;

//     try {
//       // Execute Ethereum transaction
//       const tx = await contract.increment();
//       await tx.wait();

//       // Update property availability in Supabase
//       const { error } = await supabase
//         .from('properties')
//         .update({ available: false })
//         .eq('id', property.id);

//       if (error) throw error;

//       // Update local state
//       const updatedProperty = {
//         ...property,
//         available: false
//       };
//       setProperty(updatedProperty);
//     } catch (error) {
//       console.error("Error buying property:", error);
//     }
//   };

//   const handleImageUpload = async (e) => {
//     if (!property || !user) {
//       console.log("No property or user found");
//       return;
//     }

//     const files = Array.from(e.target.files);
    
//     try {
//       // Upload images to Supabase storage and save metadata
//       const uploadPromises = files.map(async (file) => {
//         // Generate a unique filename
//         const fileExt = file.name.split('.').pop();
//         const fileName = `${Math.random()}.${fileExt}`;
//         const filePath = `${property.id}/${fileName}`;

//         // Upload to Supabase storage
//         const { data: uploadData, error: uploadError } = await supabase.storage
//           .from('property-images')
//           .upload(filePath, file);

//         if (uploadError) throw uploadError;

//         // Get public URL
//         const { data: { publicUrl } } = supabase.storage
//           .from('property-images')
//           .getPublicUrl(filePath);

//         // Save image metadata to database
//         const { data: imageData, error: dbError } = await supabase
//           .from('property_images')
//           .insert({
//             property_id: property.id,
//             image_url: publicUrl,
//             description: file.name
//           })
//           .select();

//         if (dbError) throw dbError;

//         // Handle API upload for rewards
//         const formData = new FormData();
//         formData.append('file', file);
//         formData.append('userId', user.id);

//         const response = await fetch('/api/upload', {
//           method: 'POST',
//           body: formData,
//         });

//         if (!response.ok) {
//           const errorText = await response.text();
//           console.error('Server response:', response.status, errorText);
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }

//         const apiData = await response.json();
//         console.log("Upload response:", apiData);
        
//         if (apiData.success) {
//           console.log("Coins updated to:", apiData.coins);
//         }

//         return publicUrl;
//       });

//       const newImageUrls = await Promise.all(uploadPromises);

//       // Update local state with new image URLs
//       setPropertyImages(prev => [...prev, ...newImageUrls]);
//     } catch (error) {
//       console.error("Error uploading images:", error);
//     }
//   };

//   const calculateAverageRating = () => {
//     if (!property || property.reviews.length === 0) return 0;
//     const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
//     return (totalRating / property.reviews.length).toFixed(1);
//   };

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-xl">Loading property details...</div>
//       </div>
//     );
//   }

//   if (!property) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="text-xl">Property not found</div>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-white min-h-screen">
//       <header className="bg-white shadow-md py-4 px-4 sm:px-6 flex justify-between items-center">
//         <div className="flex items-center">
//           <button 
//             onClick={() => router.push('/')}
//             className="mr-4 text-gray-600 hover:text-[#FF5A5F]"
//           >
//             ← Back to Dashboard
//           </button>
//           <div className="text-xl sm:text-2xl font-bold text-[#FF5A5F]">PropChain</div>
//         </div>
//       </header>

//       <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
//         <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
//           {/* Property Images Section */}
//           <div>
//             <div className="mb-6 w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
//               <iframe 
//                 src={property.url} 
//                 className="w-full h-full rounded-xl"
//                 title={`Property at ${property.address}`}
//                 allowFullScreen
//               />
//             </div>

//             {/* Custom Mobile-Friendly Carousel */}
//             <div className="mb-6">
//               <div className="flex items-center mb-4">
//                 <h2 className="text-lg sm:text-xl font-semibold mr-4 text-gray-800">Additional Images</h2>
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
              
//               {propertyImages.length > 0 ? (
//                 <div className="relative">
//                   {/* Main featured image */}
//                   <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 mb-2 relative">
//                     <img 
//                       src={propertyImages[currentImageIndex]} 
//                       alt={`Property featured image`} 
//                       className="w-full h-full object-cover rounded-lg"
//                     />
                    
//                     {/* Navigation arrows for mobile and desktop */}
//                     <button 
//                       onClick={scrollToPrevImage}
//                       className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
//                       aria-label="Previous image"
//                     >
//                       ←
//                     </button>
//                     <button 
//                       onClick={scrollToNextImage}
//                       className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
//                       aria-label="Next image"
//                     >
//                       →
//                     </button>
//                   </div>
                  
//                   {/* Thumbnail indicator */}
//                   <div className="flex justify-center gap-1">
//                     {propertyImages.map((_, index) => (
//                       <div 
//                         key={index}
//                         onClick={() => setCurrentImageIndex(index)}
//                         className={`h-2 rounded-full cursor-pointer ${
//                           currentImageIndex === index ? 'w-4 bg-[#FF5A5F]' : 'w-2 bg-gray-300'
//                         }`}
//                       />
//                     ))}
//                   </div>
                  
//                   {/* Horizontal thumbnails scroll for desktop */}
//                   <div 
//                     ref={carouselRef}
//                     className="hidden sm:flex mt-4 overflow-x-auto space-x-2 pb-2"
//                   >
//                     {propertyImages.map((imageUrl, index) => (
//                       <div 
//                         key={index}
//                         className={`flex-shrink-0 cursor-pointer transition-all ${
//                           currentImageIndex === index 
//                             ? 'w-24 h-20 border-2 border-[#FF5A5F]' 
//                             : 'w-20 h-16 border border-gray-200'
//                         } rounded-md overflow-hidden`}
//                         onClick={() => setCurrentImageIndex(index)}
//                       >
//                         <img 
//                           src={imageUrl} 
//                           alt={`Property thumbnail ${index + 1}`} 
//                           className="w-full h-full object-cover"
//                         />
//                       </div>
//                     ))}
//                   </div>
//                 </div>
//               ) : (
//                 <div className="text-gray-500 italic">No additional images available</div>
//               )}
//             </div>
//           </div>

//           {/* Property Details and Reviews Section */}
//           <div>
//             <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-lg">
//               <div className="mb-6">
//                 <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{property.address}</h1>
//                 <div className="flex items-center mb-4">
//                   <span className="text-yellow-500 text-xl">★</span>
//                   <span className="ml-2 text-gray-700 text-lg">
//                     {calculateAverageRating()} ({property.reviews.length} reviews)
//                   </span>
//                 </div>
//                 <div className="flex justify-between mb-4">
//                   <div>
//                     <p className="text-gray-600">Broker</p>
//                     <p className="font-semibold">{property.broker}</p>
//                   </div>
//                   <div>
//                     <p className="text-gray-600">Price</p>
//                     <p className="text-[#FF5A5F] font-bold text-xl">${property.price}</p>
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
//                 <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">User Reviews</h2>
//                 {property.reviews.length > 0 ? (
//                   property.reviews.map((review) => (
//                     <div key={review.id} className="border-b pb-4 mb-4">
//                       <div className="flex justify-between mb-2">
//                         <div className="font-semibold text-gray-700">{review.author}</div>
//                         <div className="text-gray-500 text-sm">
//                           {new Date(review.date).toLocaleDateString()}
//                         </div>
//                       </div>
//                       <div className="text-yellow-500 mb-2">
//                         {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
//                       </div>
//                       <p className="text-gray-600">{review.comment}</p>
//                     </div>
//                   ))
//                 ) : (
//                   <div className="text-gray-500 italic mb-4">No reviews yet. Be the first to review!</div>
//                 )}
//               </div>

//               {/* Write a Review Section */}
//               <div className="mt-6">
//                 <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Write a Review</h3>
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

'use client';
import { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from '../../lib/supabase/client';
import { getContract } from "../../../components/ui/ethereum";
import PropToken from "../../../contracts/PropToken.json";
import { useUser } from '@clerk/nextjs';
import { ethers } from "ethers";

export default function PropertyReviewPage() {
  const { user } = useUser();
  const router = useRouter();
  const params = useParams();
  const fileInputRef = useRef(null);
  const carouselRef = useRef(null);
  const [property, setProperty] = useState(null);
  const [contract, setContract] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: ''
  });
  const [propertyImages, setPropertyImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // New state for bid amount input (as a string to allow user input)
  const [bidAmount, setBidAmount] = useState("");

  useEffect(() => {
    async function initPage() {
      setIsLoading(true);
      try {
        // Initialize Ethereum contract
        const contract = getContract(
          "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
          PropToken.abi,
          0
        );
        setContract(contract);

        // Fetch property details from Supabase
        const { data, error } = await supabase
          .from('properties')
          .select(`
            *,
            reviews(*),
            property_images(*)
          `)
          .eq('id', Number(params.id))
          .single();

        if (error) throw error;

        setProperty(data);
        setPropertyImages(data.property_images.map(img => img.image_url));
      } catch (error) {
        console.error("Error fetching property:", error);
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    }
    initPage();
  }, [params.id, router]);

  const scrollToPrevImage = () => {
    if (propertyImages.length === 0) return;
    
    setCurrentImageIndex(prev => {
      const newIndex = prev === 0 ? propertyImages.length - 1 : prev - 1;
      return newIndex;
    });
    
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: currentImageIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const scrollToNextImage = () => {
    if (propertyImages.length === 0) return;
    
    setCurrentImageIndex(prev => {
      const newIndex = prev === propertyImages.length - 1 ? 0 : prev + 1;
      return newIndex;
    });
    
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.offsetWidth;
      carouselRef.current.scrollTo({
        left: currentImageIndex * itemWidth,
        behavior: 'smooth'
      });
    }
  };

  const submitReview = async () => {
    if (!property) return;

    try {
      const reviewAuthor = user 
        ? `${user.firstName} ${user.lastName}`.trim() 
        : 'Anonymous';

      const newReviewObj = {
        id: `review-${property.reviews.length + 1}`,
        author: reviewAuthor,
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString()
      };

      // Submit review to Supabase
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          property_id: property.id,
          rating: newReview.rating,
          comment: newReview.comment,
          author: reviewAuthor
        })
        .select();

      if (error) throw error;

      // Update local state
      const updatedProperty = {
        ...property,
        reviews: [...property.reviews, data[0]]
      };
      setProperty(updatedProperty);

      // Reset review form
      setNewReview({ rating: 5, comment: '' });
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // Bidding Functions

  // Place or update a bid for the property
  const placeBid = async () => {
    if (!contract || !property || !bidAmount) return;
    try {
      // Convert bid amount (assumed to be in tokens with 18 decimals)
      const bidValue = ethers.utils.parseUnits(bidAmount, 18);
      // Using user.id from Clerk as the user identifier (must match contract expectations)
      const tx = await contract.placeBid(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user.id)), property.id, bidValue);
      console.log("Placing bid, tx hash:", tx.hash);
      await tx.wait();
      console.log("Bid placed successfully!");
      alert(`Bid of ${ethers.utils.formatUnits(bidValue, 18)} tokens by ${user.id} placed successfully!`);
    } catch (error) {
      console.error("Error placing bid:", error);
    }
  };

  // Cancel an existing bid for the property
  const cancelBid = async () => {
    if (!contract || !property) return;
    try {
      const tx = await contract.cancelBid(ethers.utils.keccak256(ethers.utils.toUtf8Bytes(user.id)), property.id);
      console.log("Canceling bid, tx hash:", tx.hash);
      await tx.wait();
      console.log("Bid canceled successfully!");
    } catch (error) {
      console.error("Error canceling bid:", error);
    }
  };

  // Finalize bids if the connected user is the property owner.
  const finalizeBids = async () => {
    if (!contract || !property) return;
    try {
      const tx = await contract.finalizeBids(property.id, property.ownerWallet);
      console.log("Finalizing bids, tx hash:", tx.hash);
      await tx.wait();
      console.log("Bids finalized successfully. Highest bid deposited into property owner's wallet.");

      // Update property availability in Supabase to mark the property as sold.
      const { error } = await supabase
        .from('properties')
        .update({ available: false })
        .eq('id', property.id);
      if (error) throw error;

      // Update local state
      setProperty({
        ...property,
        available: false,
      });
    } catch (error) {
      console.error("Error finalizing bids:", error);
    }
  };

  // The buyProperty function now branches:
  // - If the connected wallet matches the property owner, we finalize bids.
  // - Otherwise, we treat this as placing a bid.
  const buyProperty = async () => {
    if (!contract || !property || !property.available) return;
    try {
      if (user && user.id && property.ownerWallet && 
          user.id.toLowerCase() === property.ownerWallet.toLowerCase()) {
        // If the user is the property owner, finalize bids.
        await finalizeBids();
      } else {
        // Otherwise, treat it as placing a bid.
        await placeBid();
      }
    } catch (error) {
      console.error("Error in buyProperty function:", error);
    }
  };

  const handleImageUpload = async (e) => {
    if (!property || !user) {
      console.log("No property or user found");
      return;
    }

    const files = Array.from(e.target.files);
    
    try {
      // Upload images to Supabase storage and save metadata
      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${property.id}/${fileName}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('property-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('property-images')
          .getPublicUrl(filePath);

        const { data: imageData, error: dbError } = await supabase
          .from('property_images')
          .insert({
            property_id: property.id,
            image_url: publicUrl,
            description: file.name
          })
          .select();

        if (dbError) throw dbError;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', response.status, errorText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const apiData = await response.json();
        console.log("Upload response:", apiData);
        
        if (apiData.success) {
          console.log("Coins updated to:", apiData.coins);
        }

        return publicUrl;
      });

      const newImageUrls = await Promise.all(uploadPromises);
      setPropertyImages(prev => [...prev, ...newImageUrls]);
    } catch (error) {
      console.error("Error uploading images:", error);
    }
  };

  const calculateAverageRating = () => {
    if (!property || property.reviews.length === 0) return 0;
    const totalRating = property.reviews.reduce((sum, review) => sum + review.rating, 0);
    return (totalRating / property.reviews.length).toFixed(1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading property details...</div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Property not found</div>
      </div>
    );
  }

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

      <main className="container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
          {/* Property Images Section */}
          <div>
            <div className="mb-6 w-full h-64 sm:h-80 md:h-96 lg:h-[500px]">
              <iframe 
                src={property.url} 
                className="w-full h-full rounded-xl"
                title={`Property at ${property.address}`}
                allowFullScreen
              />
            </div>

            <div className="mb-6">
              <div className="flex items-center mb-4">
                <h2 className="text-lg sm:text-xl font-semibold mr-4 text-gray-800">Additional Images</h2>
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
              
              {propertyImages.length > 0 ? (
                <div className="relative">
                  <div className="w-full h-56 sm:h-64 md:h-72 lg:h-80 mb-2 relative">
                    <img 
                      src={propertyImages[currentImageIndex]} 
                      alt="Property featured image" 
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button 
                      onClick={scrollToPrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
                      aria-label="Previous image"
                    >
                      ←
                    </button>
                    <button 
                      onClick={scrollToNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-gray-800 p-2 rounded-full shadow-md"
                      aria-label="Next image"
                    >
                      →
                    </button>
                  </div>
                  <div className="flex justify-center gap-1">
                    {propertyImages.map((_, index) => (
                      <div 
                        key={index}
                        onClick={() => setCurrentImageIndex(index)}
                        className={`h-2 rounded-full cursor-pointer ${
                          currentImageIndex === index ? 'w-4 bg-[#FF5A5F]' : 'w-2 bg-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div 
                    ref={carouselRef}
                    className="hidden sm:flex mt-4 overflow-x-auto space-x-2 pb-2"
                  >
                    {propertyImages.map((imageUrl, index) => (
                      <div 
                        key={index}
                        className={`flex-shrink-0 cursor-pointer transition-all ${
                          currentImageIndex === index 
                            ? 'w-24 h-20 border-2 border-[#FF5A5F]' 
                            : 'w-20 h-16 border border-gray-200'
                        } rounded-md overflow-hidden`}
                        onClick={() => setCurrentImageIndex(index)}
                      >
                        <img 
                          src={imageUrl} 
                          alt={`Property thumbnail ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-gray-500 italic">No additional images available</div>
              )}
            </div>
          </div>

          {/* Property Details and Reviews Section */}
          <div>
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 shadow-lg">
              <div className="mb-6">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">{property.address}</h1>
                <div className="flex items-center mb-4">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="ml-2 text-gray-700 text-lg">
                    {calculateAverageRating()} ({property.reviews.length} reviews)
                  </span>
                </div>
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
                
                {/* Buy Property / Bidding Buttons Section */}
                <div className="mt-4">
                  {property.available ? (
                    // If the connected wallet matches the property owner's wallet, show Finalize Bids.
                    // Otherwise, show Place Bid and Cancel Bid buttons along with a bid amount input.
                    user && property.ownerWallet && user.id.toLowerCase() === property.ownerWallet.toLowerCase() ? (
                      <button 
                        onClick={finalizeBids}
                        className="w-full py-3 rounded-md text-white font-semibold bg-[#FF5A5F] hover:bg-opacity-90"
                      >
                        Finalize Bids
                      </button>
                    ) : (
                      <div className="flex flex-col space-y-4">
                        <div>
                          <label className="block mb-1 text-gray-700">Bid Amount</label>
                          <input 
                            type="text" 
                            value={bidAmount} 
                            onChange={(e) => setBidAmount(e.target.value)} 
                            placeholder="Enter bid amount" 
                            className="w-full p-2 border rounded-md focus:ring-2 focus:ring-[#FF5A5F]" 
                          />
                        </div>
                        <div className="flex space-x-4">
                          <button 
                            onClick={buyProperty}
                            className="flex-1 py-3 rounded-md text-white font-semibold bg-[#FF5A5F] hover:bg-opacity-90"
                          >
                            Place Bid
                          </button>
                          <button 
                            onClick={cancelBid}
                            className="flex-1 py-3 rounded-md text-white font-semibold bg-gray-500 hover:bg-opacity-90"
                          >
                            Cancel Bid
                          </button>
                        </div>
                      </div>
                    )
                  ) : (
                    <button disabled className="w-full py-3 rounded-md text-white font-semibold bg-gray-400 cursor-not-allowed">
                      Sold
                    </button>
                  )}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="border-t pt-6">
                <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">User Reviews</h2>
                {property.reviews.length > 0 ? (
                  property.reviews.map((review) => (
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
                  ))
                ) : (
                  <div className="text-gray-500 italic mb-4">No reviews yet. Be the first to review!</div>
                )}
              </div>

              {/* Write a Review Section */}
              <div className="mt-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Write a Review</h3>
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
