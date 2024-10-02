"use client";

import React from "react";
import navLinks from "@/assets/link";
import { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Logo from "@/assets/logo.svg";


const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className="pt-3 shadow-md h-[4rem] top-0 fixed w-screen z-50 bg-dark text-white">
      <div className="w-10/12  mx-auto flex items-center justify-between">
        <Link href="/" className="w-10/12 mx-auto md:mx-0 md:w-[60%]">
          <div className="text-4xl  flex">
            <Image src={Logo} width={40} height={40} alt="logo" className="mr-3" />
            TravelBuddy
          </div>
        </Link>
        <nav className="hidden sm:flex min-w-[50vw] justify-evenly text-xl ">
          {navLinks?.map((link) => (
            <li className="list-none" key={link.title}>
              <Link href={link.path}>{link.title}</Link>
            </li>
          ))}
          {session && <Link href="/find-people">Find People</Link>}
          {session && <Link href="/destinations">Destinations</Link>}
          {session && <Link href="/profile">Profile</Link>}
          {!session && <Link href="/sign-in">Sign In</Link>}
          {session && (
            <>
              <Link href="/signout">Sign Out</Link>
            </>
          )}
        </nav>

        <div className="sm:hidden">
          <button onClick={toggleMenu}>
            {!isOpen && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0 0 50 50"
                className="pt-2 "
              >
                <path d="M 3 9 A 1.0001 1.0001 0 1 0 3 11 L 47 11 A 1.0001 1.0001 0 1 0 47 9 L 3 9 z M 3 24 A 1.0001 1.0001 0 1 0 3 26 L 47 26 A 1.0001 1.0001 0 1 0 47 24 L 3 24 z M 3 39 A 1.0001 1.0001 0 1 0 3 41 L 47 41 A 1.0001 1.0001 0 1 0 47 39 L 3 39 z"></path>
              </svg>
            )}
            {isOpen && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                className="pt-2 "
                viewBox="0 0 40 50"
              >
                <path d="M 7.71875 6.28125 L 6.28125 7.71875 L 23.5625 25 L 6.28125 42.28125 L 7.71875 43.71875 L 25 26.4375 L 42.28125 43.71875 L 43.71875 42.28125 L 26.4375 25 L 43.71875 7.71875 L 42.28125 6.28125 L 25 23.5625 Z"></path>
              </svg>
            )}
          </button>

          {isOpen && (
            <div className="absolute text-dark bg-light shadow-md-b w-full top-[3.5rem] shadow-md left-0 z-50 ">
              <nav className="flex flex-col justify-center items-center space-y-4 px-4 pt-6 pb-8 ">
                {navLinks?.map((link) => (
                  <li className="list-none" key={link.title}>
                    <Link href={link.path}>{link.title}</Link>
                  </li>
                ))}
                {session && <Link href="/profile">Find People</Link>}
                {session && <Link href="/profile">Destinations</Link>}

                {session && <Link href="/profile">Profile</Link>}

                {!session && <Link href="/sign-in">Sign In</Link>}
                {session && (
                  <>
                    <Link href="/signout">Sign Out</Link>
                  </>
                )}
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
