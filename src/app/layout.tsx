import type { Metadata } from "next";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Inter as FontSans } from "next/font/google";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "TravelBuddy App",
  description: "Discover your next adventure with Wanderlust",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(
        "min-h-screen bg-background font-sans antialiased sm:px-[3vw] md:px-[5vw] lg:px-[7vw]",
        fontSans.variable
      )}>
        <HeaderWrapper />
        {children}
        <Footer />
      </body>
    </html>
  );
}