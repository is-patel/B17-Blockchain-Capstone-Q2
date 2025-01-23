import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';
import exifr from 'exifr';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const userId = formData.get('userId') as string;

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and user ID are required' },
        { status: 400 }
      );
    }

    // Convert the file to a buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Extract EXIF data
    const exifData = await exifr.parse(buffer);
    console.log('EXIF Data:', exifData);

    // Check if GPS data is available
    if (!exifData?.latitude || !exifData?.longitude) {
      return NextResponse.json(
        { error: 'No GPS data found in the photo' },
        { status: 400 }
      );
    }

    const { latitude, longitude } = exifData;

    // Convert GPS coordinates to a human-readable location
    let location = 'Unknown Location';
    try {
      const locationResponse = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
      );
      const locationData = await locationResponse.json();
      console.log('Location Data:', locationData);

      location = locationData.display_name || 'Unknown Location';
    } catch (error) {
      console.error('Error fetching location:', error);
    }

    // Fetch the user's current metadata
    const client = await clerkClient();

    const user = await client.users.getUser(userId);
    const currentCoins = user.unsafeMetadata?.coins || 0;

    // Update the user's metadata to add 10 coins
    await client.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        ...user.unsafeMetadata, // Preserve existing metadata
        coins: currentCoins + 10, // Add 10 coins
      },
    });

    // Return the location and updated coin balance
    return NextResponse.json({
      success: true,
      location,
      coins: currentCoins + 10,
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}