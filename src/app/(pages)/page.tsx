"use client"
import React from "react";
import RevealText from "@/components/RevealText";
import HomeImageSwiper from "@/components/HomeImageSwiper";
import FaqSection from "@/components/FaqSection";


export default function Page() {
  return (
    <div className="">
      <section
        className="flex flex-col items-center justify-center h-screen  text-center px-4 -mt-8 md:-mt-24"
        style={{
          backgroundImage: "url('",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
      <h1 className="bg-clip-text text-transparent text-center bg-gradient-to-b from-blue-700 via-blue-500 to-blue-300 text-4xl md:text-5xl lg:text-8xl font-sans py-2 md:py-10 relative z-20 font-bold tracking-tight">
        Discover the World<br />One Journey at a Time!
      </h1>
      <p className="text-lg mt-5 md:mt-0 mx-8 md:mx-0 md:text-2xl max-w-3xl mb-8 opacity-85">
        TravelBuddy is your ultimate companion for exploring new destinations, 
        experiencing diverse cultures, and making unforgettable memories.
      </p>

      </section>

      <section>
        <RevealText />
      </section>
      <section>
        <HomeImageSwiper />
      </section>

      <section className='max-w-[85vw] mx-auto mt-36'>
      <h2 className="text-4xl font-bold text-black text-center mb-12">Some Attractive Options</h2>

      <div>
      <div className="grid grid-cols-1 md:grid-cols-5">
        
        {/* Left Side - Top Card */}
        <div className="relative overflow-hidden shadow-md group md:col-span-2 h-[250px]">
          <div className="h-full">
            <img
              src="https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Growth"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="pt-10 p-1 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-tertiary opacity-90 group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-xl md:text-2xl font-bold">Growth</h3>
              <p className="text-sm md:text-base">
                Encouraging personal and professional development for all.
              </p>
            </div>
          </div>
        </div>

        {/* Left Side - Bottom Card */}
        <div className="relative overflow-hidden shadow-md group md:col-span-2 h-[250px]">
          <div className="h-full">
            <img
              src="https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Collaboration"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="pt-10 p-1 absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-tertiary opacity-90 group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-xl md:text-2xl font-bold">Collaboration</h3>
              <p className="text-sm md:text-base">
                Bringing together talents and ideas for collective success.
              </p>
            </div>
          </div>
        </div>

        {/* Center Card */}
        <div className="relative overflow-hidden shadow-md group md:col-span-1 md:row-span-2 flex">
          <div className="h-full w-full">
            <img
              src="https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Community"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="pt-10 absolute bottom-0 left-0 right-0 p-1 bg-gradient-to-t from-black via-black/70 to-transparent text-tertiary opacity-90 group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-xl md:text-2xl font-bold">Community</h3>
              <p className="text-sm md:text-base">
                Building a vibrant network.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Top Card */}
        <div className="relative overflow-hidden shadow-md group md:col-span-2 h-[250px]">
          <div className="h-full">
            <img
              src="https://images.pexels.com/photos/3184294/pexels-photo-3184294.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Innovation"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 p-1 pt-10 bg-gradient-to-t from-black via-black/70 to-transparent text-tertiary opacity-90 group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-xl font-bold md:text-2xl">Innovation</h3>
              <p className="text-sm md:text-base">
                Fostering creativity and innovative thinking for a better future.
              </p>
            </div>
          </div>
        </div>

        {/* Right Side - Bottom Card */}
        <div className="relative overflow-hidden shadow-md group md:col-span-2 h-[250px]">
          <div className="h-full">
            <img
              src="https://images.pexels.com/photos/3184295/pexels-photo-3184295.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Opportunity"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute bottom-0 left-0 right-0 p-1 pt-10 bg-gradient-to-t from-black via-black/70 to-transparent text-tertiary opacity-90 group-hover:opacity-100 transition-all duration-500">
              <h3 className="text-xl font-bold md:text-2xl">Opportunity</h3>
              <p className="text-sm md:text-base">
                Creating avenues for growth, learning, and success for everyone.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
      </section>
      <FaqSection/>
    </div>
  );
}