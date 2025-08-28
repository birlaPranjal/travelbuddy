"use client"; // This makes the component a Client Component
import Header from "@/components/Header";
import "../globals.css";
import { SessionProvider } from 'next-auth/react';
import { WalletProvider } from "../lib/wallet-context";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <WalletProvider>
        <html lang="en">
          <body className="bg-gray-900">
            <Header />
            <div className="h-20"></div>
            {children}
          </body>
        </html>
      </WalletProvider>
    </SessionProvider>
  );
}
