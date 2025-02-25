'use client';

import localFont from "next/font/local";
import "./globals.css";
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs'
import { useState, useEffect } from 'react';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const CustomSignInButton = () => {
  return (
    <SignInButton>
      <button
        className="py-2 px-4 rounded-lg text-white font-medium bg-rose-500 hover:bg-rose-600 transition-colors duration-200"
      >
        Sign In
      </button>
    </SignInButton>
  );
};

// Create a new component for the signed-in header content
const SignedInContent = () => {
  const { user } = useUser();
  const [coins, setCoins] = useState(0);

  useEffect(() => {
    if (user) {
      setCoins(user.unsafeMetadata?.coins || 0);
    }
  }, [user?.unsafeMetadata?.coins]);

  return (
    <div className="flex items-center gap-4">
      <span className="text-gray-700 font-medium">
        Coins: {coins}
      </span>
      <UserButton />
    </div>
  );
};

function RootLayoutContent({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased relative`}>
        <header className="absolute top-0 right-0 p-4 z-50">
          <SignedOut>
            <CustomSignInButton />
          </SignedOut>
          <SignedIn>
            <SignedInContent />
          </SignedIn>
        </header>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <RootLayoutContent>{children}</RootLayoutContent>
    </ClerkProvider>
  );
}


// export default function RootLayout({ children }) {
//   return (
//     <ClerkProvider>
//       <html lang="en">
//         <body>
//           <header>
//             <SignedOut>
//               <SignInButton />
//             </SignedOut>
//             <SignedIn>
//               <UserButton />
//             </SignedIn>
//           </header>
//           {children}
//         </body>
//       </html>
//     </ClerkProvider>
//   );