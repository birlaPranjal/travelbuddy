import React from "react";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import {LogoutLink} from "@kinde-oss/kinde-auth-nextjs/components";
import { Button } from "@/components/ui/button";


export default function page() {
  const { getUser } = getKindeServerSession();
  function user() {
    return getUser();
  }
  console.log(user());
  return(
  <>
    <div className="">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to TravelBuddy</h1>
        <h2 className="text-xl text-gray-600">Where are you planning to go?</h2>
        <Button>
        <LogoutLink>Log out</LogoutLink>
        </Button>
    </div>
  </>
);
}
