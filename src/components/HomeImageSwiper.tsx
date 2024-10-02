"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";

// Swiper modules
import { Autoplay } from "swiper/modules";

const HomeImageSwiper = () => {
  const images = [
    "https://images.pexels.com/photos/7213609/pexels-photo-7213609.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/7648044/pexels-photo-7648044.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/7414272/pexels-photo-7414272.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/5711367/pexels-photo-5711367.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/5257457/pexels-photo-5257457.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/18536260/pexels-photo-18536260/free-photo-of-a-typewriter-with-the-words-neighborhood-networks-on-it.jpeg?auto=compress&cs=tinysrgb&w=800",
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
