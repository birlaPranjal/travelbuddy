"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { useKindeAuth } from "@kinde-oss/kinde-auth-nextjs";

interface HeaderProps {
  initialIsAuthenticated: boolean;
}

export default function Header({ initialIsAuthenticated }: HeaderProps) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(initialIsAuthenticated);
  const { isLoading, isAuthenticated } = useKindeAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated ) {
      setIsLoggedIn(isAuthenticated);
    }
  }, [isLoading, isAuthenticated]);

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7eff3] px-4 py-5">
      <div className="flex items-center gap-4 text-[#0d161b]">
        <div className="size-4">
          {/* SVG logo */}
        </div>
        <h2 className="text-[#0d161b] text-2xl font-bold leading-tight tracking-[-0.015em]">Wanderlust</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <nav className="hidden md:flex items-center gap-9">
          <Link href="#" className="text-[#0d161b] text-md font-medium leading-normal">Explore</Link>
          <Link href="#" className="text-[#0d161b] text-md font-medium leading-normal">Travel Deals</Link>
          <Link href="#" className="text-[#0d161b] text-md font-medium leading-normal">Travel Alerts</Link>
          <Link href="#" className="text-[#0d161b] text-md font-medium leading-normal">Travel Guides</Link>
          <Link href="#" className="text-[#0d161b] text-md font-medium leading-normal">Travel Reviews</Link>
        </nav>
        {isLoggedIn ? (
          <Link href="/profile" className="text-[#0d161b] text-md font-medium leading-normal">Profile</Link>
        ) : (
          <>
            <Link href="/api/auth/login">
              <Button>Log in</Button>
            </Link>
            <Link href="/api/auth/register">
              <Button>Sign up</Button>
            </Link>
          </>
        )}
      </div>
    </header>
  );
}