import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { LoginLink , RegisterLink } from "@kinde-oss/kinde-auth-nextjs/server";

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#e7eff3] px-4 md:px-10 py-3">
      <div className="flex items-center gap-4 text-[#0d161b]">
        <div className="size-4">
          {/* SVG logo */}
        </div>
        <h2 className="text-[#0d161b] text-lg font-bold leading-tight tracking-[-0.015em]">Wanderlust</h2>
      </div>
      <div className="flex flex-1 justify-end gap-8">
        <nav className="hidden md:flex items-center gap-9">
          <Link href="#" className="text-[#0d161b] text-sm font-medium leading-normal">Explore</Link>
          <Link href="#" className="text-[#0d161b] text-sm font-medium leading-normal">Travel Deals</Link>
          <Link href="#" className="text-[#0d161b] text-sm font-medium leading-normal">Travel Alerts</Link>
          <Link href="#" className="text-[#0d161b] text-sm font-medium leading-normal">Travel Guides</Link>
          <Link href="#" className="text-[#0d161b] text-sm font-medium leading-normal">Travel Reviews</Link>
        </nav>
        <LoginLink>
          <Button>Log in</Button>
        </LoginLink>
        <RegisterLink>
          <Button>Sign in</Button>
        </RegisterLink>
      </div>
    </header>
  );
}