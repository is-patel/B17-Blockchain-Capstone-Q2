import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body to get the userId
    const { userId } = await request.json();
    const client = await clerkClient()

    const user = await client.users.getUser(userId); // This should now work
    const currentCoins = user.unsafeMetadata?.coins || 0;

    // Update the user's unsafeMetadata to add 100 coins
    await client.users.updateUserMetadata(userId, {
      unsafeMetadata: {
        coins: currentCoins + 100, // Update the coins field
      },
    });

    // Return the updated coin balance
    return NextResponse.json({ success: true, coins: currentCoins + 100 });
  } catch (error) {
    console.error('Error updating coins:', error);
    return NextResponse.json({ error: 'Failed to update coins' }, { status: 500 });
  }
}