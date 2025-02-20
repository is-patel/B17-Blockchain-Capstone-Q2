import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs';

export async function POST(request: NextRequest) {
  console.log("API route hit");
  
  try {
    const formData = await request.formData();
    console.log("FormData received");

    const file = formData.get('file');
    const userId = formData.get('userId');

    console.log("Received data:", {
      hasFile: !!file,
      userId: userId,
    });

    if (!file || !userId) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: 'File and user ID are required' },
        { status: 400 }
      );
    }

    try {
      const user = await clerkClient.users.getUser(userId as string);
      const currentCoins = user.unsafeMetadata?.coins || 0;

      await clerkClient.users.updateUserMetadata(userId as string, {
        unsafeMetadata: {
          ...user.unsafeMetadata,
          coins: currentCoins + 10,
        },
      });

      return NextResponse.json({
        success: true,
        coins: currentCoins + 10,
      });
    } catch (clerkError) {
      console.error('Clerk error:', clerkError);
      return NextResponse.json(
        { error: 'Failed to update user metadata', details: clerkError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to upload photo',
        details: error.message 
      },
      { status: 500 }
    );
  }
}