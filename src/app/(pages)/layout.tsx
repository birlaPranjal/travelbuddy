"use client"; // This makes the component a Client Component
import Header from "@/components/Header";
import "../globals.css";
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <html lang="en">
        <body className="bg-light">
          <Header />
          <div className="h-20"></div>
          {children}
        </body>
      </html>
    </SessionProvider>
  );
}
