"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";


// Swiper modules
import { Autoplay } from "swiper/modules";

const HomeImageSwiper = () => {
  const images = [
    '/portraits/22.svg' , 
    '/portraits/11.svg' , 
    '/portraits/1.svg' , 
    '/portraits/2.svg' , 
    '/portraits/3.svg' , 
    '/portraits/4.svg' , 
    '/portraits/5.svg' , 
    '/portraits/6.svg' , 
  ];

  return (
    <section className="py-10 relative">
      <Swiper
        spaceBetween={20} 
        loop={true}
        autoplay={{
          delay: 0,
          disableOnInteraction: false,
        }}
        speed={3000}
        modules={[Autoplay]}
        breakpoints={{
          // When the window is >= 320px
          320: {
            slidesPerView: 3,
          },
          // When the window is >= 1024px
          1024: {
            slidesPerView: 5,
          },
        }}
        className="mySwiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="overflow-hidden rounded-3xl">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-[200px] md:h-[500px] object-cover transition-transform duration-500 hover:scale-110"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 pointer-events-none z-20">
        <div className="w-full h-full bg-gradient-to-r from-black/90 via-black/10 to-black/90"></div>
      </div>
    </section>
  );
};

export default HomeImageSwiper;
