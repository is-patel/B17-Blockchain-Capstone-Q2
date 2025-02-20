import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const userId = formData.get('userId');

    if (!file || !userId) {
      return NextResponse.json(
        { error: 'File and user ID are required' },
        { status: 400 }
      );
    }

    try {
      const clerk = await clerkClient();
      const user = await clerk.users.getUser(userId as string);
      // Fix the type by ensuring currentCoins is a number
      const currentCoins = Number(user.unsafeMetadata?.coins) || 0;

      await clerk.users.updateUserMetadata(userId as string, {
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
        { error: 'Failed to update user metadata' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Detailed error:', error);
    return NextResponse.json(
      { error: 'Failed to upload photo' },
      { status: 500 }
    );
  }
}