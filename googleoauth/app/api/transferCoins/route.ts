import { NextRequest, NextResponse } from 'next/server';
import { clerkClient } from '@clerk/nextjs/server';

export async function POST(request: NextRequest) {
  try {
    // Parse the request body
    const { senderUserId, receiverUsername, amount } = await request.json();

    if (!senderUserId || !receiverUsername || !amount) {
      return NextResponse.json(
        { error: 'Sender ID, receiver username, and amount are required' },
        { status: 400 }
      );
    }

    // Initialize clerkClient
    const client = await clerkClient();

    // Fetch the sender's metadata
    const sender = await client.users.getUser(senderUserId);
    const senderCoins = Number(sender.unsafeMetadata?.coins || 0);

    // Check if the sender has enough coins
    if (senderCoins < amount) {
      return NextResponse.json(
        { error: 'Insufficient coins' },
        { status: 400 }
      );
    }

    // Fetch the receiver by username
    const { data: receiverList, totalCount } = await client.users.getUserList({
      username: [receiverUsername],
    });

    if (totalCount === 0) {
      return NextResponse.json(
        { error: 'Receiver not found' },
        { status: 404 }
      );
    }

    const receiver = receiverList[0];
    const receiverCoins = receiver.unsafeMetadata?.coins || 0;

    // Update sender's metadata
    await client.users.updateUserMetadata(senderUserId, {
      unsafeMetadata: {
        ...sender.unsafeMetadata, // Preserve existing metadata
        coins: senderCoins - amount, // Deduct the amount
      },
    });

    // Update receiver's metadata
    await client.users.updateUserMetadata(receiver.id, {
      unsafeMetadata: {
        ...receiver.unsafeMetadata, // Preserve existing metadata
        coins: receiverCoins + amount, // Add the amount
      },
    });

    // Return the updated sender's coin balance
    return NextResponse.json({ success: true, senderCoins: senderCoins - amount });
  } catch (error) {
    console.error('Error transferring coins:', error);
    return NextResponse.json(
      { error: 'Failed to transfer coins' },
      { status: 500 }
    );
  }
}