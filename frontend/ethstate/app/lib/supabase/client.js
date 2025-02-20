// lib/supabase/client.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fetch properties with reviews
export const fetchProperties = async () => {
  const { data, error } = await supabase
    .from('properties')
    .select(`
      *,
      reviews(*)
    `);

  if (error) {
    console.error('Error fetching properties:', error);
    return [];
  }

  return data;
};

// Add a review to a property
export const addReview = async (propertyId, reviewData) => {
  const { data, error } = await supabase
    .from('reviews')
    .insert({
      property_id: propertyId,
      ...reviewData
    })
    .select();

  if (error) {
    console.error('Error adding review:', error);
    return null;
  }

  return data[0];
};

// Upload property image
export const uploadPropertyImage = async (propertyId, file) => {
  // Generate a unique filename
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${propertyId}/${fileName}`;

  // Upload to Supabase storage
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('property-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  // Get public URL
  const { data: { publicUrl }, error: urlError } = supabase.storage
    .from('property-images')
    .getPublicUrl(filePath);

  if (urlError) {
    console.error('Error getting public URL:', urlError);
    return null;
  }

  // Save image metadata to database
  const { data: imageData, error: dbError } = await supabase
    .from('property_images')
    .insert({
      property_id: propertyId,
      image_url: publicUrl,
      description: file.name
    })
    .select();

  if (dbError) {
    console.error('Error saving image metadata:', dbError);
    return null;
  }

  return imageData[0];
};

// Fetch property images
export const fetchPropertyImages = async (propertyId) => {
  const { data, error } = await supabase
    .from('property_images')
    .select('*')
    .eq('property_id', propertyId);

  if (error) {
    console.error('Error fetching property images:', error);
    return [];
  }

  return data;
};