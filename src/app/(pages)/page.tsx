import React from "react";
import Link from "next/link";

export default function Page() {
  return (
    <div className="flex items-center">
      <div>
        <h1 className="text-4xl font-bold text-center">Welcome to the dashboard</h1>
        <Link href="/sign-in" className="p-5">Sign In</Link>
        <Link href="/signout" className="p-5">Log In</Link>
      </div>
    </div>
  );
}