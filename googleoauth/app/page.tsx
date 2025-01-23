'use client'; // Mark this as a Client Component

import { useUser, SignedIn, SignedOut } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const { user } = useUser();
  const [coins, setCoins] = useState(0); // Initialize to 0 temporarily
  const [activeTab, setActiveTab] = useState<'transfer' | 'upload' | 'add'>('transfer'); // Tab state
  const [receiverUsername, setReceiverUsername] = useState(''); // For transfer
  const [transferAmount, setTransferAmount] = useState(0); // For transfer
  const [location, setLocation] = useState(''); // For photo upload
  const [message, setMessage] = useState(''); // For general messages
  const [photoPreview, setPhotoPreview] = useState<string | null>(null); // For photo preview

  // Fetch the user's coin balance when the component mounts
  useEffect(() => {
    if (user) {
      // Set the coins state to the value from user.unsafeMetadata.coins
      setCoins(user.unsafeMetadata?.coins || 0);
    }
  }, [user]); // Run this effect whenever the user object changes

  // Function to handle transferring coins
  const handleTransferCoins = async () => {
    if (!user || !receiverUsername || transferAmount <= 0) {
      setMessage('Please enter a valid username and amount');
      return;
    }

    try {
      const requestBody = {
        senderUserId: user.id,
        receiverUsername,
        amount: transferAmount,
      };
      console.log('Request Body:', requestBody);

      const response = await fetch('/api/transferCoins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        setCoins(data.senderCoins);
        setMessage('Transfer successful!');
      } else {
        setMessage(data.error || 'Failed to transfer coins');
      }
    } catch (error) {
      console.error('Error transferring coins:', error);
      setMessage('An error occurred while transferring coins');
    }
  };

  // Function to handle photo upload
  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return;

    const file = event.target.files?.[0];
    if (!file) {
      setMessage('Please select a file');
      return;
    }

    // Generate a temporary URL for the uploaded file
    const photoUrl = URL.createObjectURL(file);
    setPhotoPreview(photoUrl);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id);

    try {
      // Call the backend API to upload the photo
      const response = await fetch('/api/uploadPhoto', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        // Update the local state with the new coin balance and location
        setCoins(data.coins);
        setLocation(data.location);
        setMessage();
      } else {
        setLocation()
        setMessage(data.error || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      setLocation()
      setMessage('An error occurred while uploading the photo');
    }
  };

  // Function to handle adding coins
  const handleAddCoins = async () => {
    if (!user) return;

    try {
      // Call the backend API to update the coin balance
      const response = await fetch('/api/updateCoins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user.id }), // Pass the userId to the API
      });

      const data = await response.json();

      if (response.ok) {
        // Update the local state with the new coin balance
        setCoins(data.coins);
        setMessage('Added 100 coins successfully!');
      } else {
        setMessage(data.error || 'Failed to add coins');
      }
    } catch (error) {
      console.error('Error adding coins:', error);
      setMessage('An error occurred while adding coins');
    }
  };

  return (
    <div>
      <SignedIn>
        <h1>Welcome, {user?.firstName}!</h1>
        <p>Your coins: {coins}</p>

        {/* Tabbed Interface */}
        <div className="mt-4">
          <div className="flex space-x-4 border-b">
            <button
              onClick={() => setActiveTab('transfer')}
              className={`px-4 py-2 ${activeTab === 'transfer' ? 'border-b-2 border-blue-500' : ''}`}
            >
              Transfer Coins
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 ${activeTab === 'upload' ? 'border-b-2 border-blue-500' : ''}`}
            >
              Upload Photo
            </button>
            <button
              onClick={() => setActiveTab('add')}
              className={`px-4 py-2 ${activeTab === 'add' ? 'border-b-2 border-blue-500' : ''}`}
            >
              Add Coins
            </button>
          </div>

          {/* Transfer Coins Tab */}
          {activeTab === 'transfer' && (
            <div className="mt-4">
              <h2>Transfer Coins</h2>
              <input
                type="text"
                placeholder="Receiver's username"
                value={receiverUsername}
                onChange={(e) => setReceiverUsername(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="number"
                placeholder="Amount"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                className="border p-2 rounded mt-2"
              />
              <button
                onClick={handleTransferCoins}
                className="bg-green-500 text-white px-4 py-2 rounded mt-2"
              >
                Transfer Coins
              </button>
            </div>
          )}

          {/* Upload Photo Tab */}
          {activeTab === 'upload' && (
            <div className="mt-4">
              <h2>Upload a Photo</h2>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="border p-2 rounded"
              />
              {/* Display the uploaded photo */}
              {photoPreview && (
                <div className="mt-4">
                  <h3>Uploaded Photo:</h3>
                  <img
                    src={photoPreview}
                    alt="Uploaded Photo"
                    className="mt-2 max-w-full h-auto rounded"
                  />
                </div>
              )}
              {location && <p>Location: {location}</p>}
            </div>
          )}

          {/* Add Coins Tab */}
          {activeTab === 'add' && (
            <div className="mt-4">
              <h2>Add Coins</h2>
              <button
                onClick={handleAddCoins}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Add 100 Coins
              </button>
            </div>
          )}

          {/* General Message Display */}
          {message && <p className="mt-2 text-red-500">{message}</p>}
        </div>
      </SignedIn>

      <SignedOut>
        <h1>Please Sign in!</h1>
      </SignedOut>
    </div>
  );
}