"use client";

import Link from "next/link";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

type Property = {
  id: string;
  title: string;
  city: string;
  state: string;
  bedrooms?: number;
  area_sqft?: number;
  price: number;
  image_url?: string;
};

export default function PropertiesSelectionSection({
  featuredProperties,
}: {
  featuredProperties: Property[];
}) {
  const fallbackProperties: Property[] = [
    {
      id: "1",
      title: "The Azure Pavilion",
      city: "Amalfi",
      state: "Italy",
      bedrooms: 4,
      area_sqft: 5200,
      price: 12400000,
      image_url: "https://images.unsplash.com/photo-1505691938895-1758d7feb511",
    },
  ];

  const data =
    featuredProperties.length > 0 ? featuredProperties : fallbackProperties;

  return (
    <section className="px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-32 max-w-7xl mx-auto overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-8 mb-8 sm:mb-12 lg:mb-16">
        <div>
          <h2 className="font-inter text-3xl sm:text-4xl lg:text-5xl tracking-tighter">
            Latest Properties
          </h2>
          <p className="text-[#c2c6d3] uppercase tracking-[0.2em] text-[10px] sm:text-xs mt-2">
            Volume 04 / 2024
          </p>
        </div>

        <div className="flex gap-2 sm:gap-3">
          <button className="swiper-prev-real w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#424751]/30 flex items-center justify-center hover:bg-white/10 transition text-sm sm:text-base">
            ‹
          </button>
          <button className="swiper-next-real w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#424751]/30 flex items-center justify-center hover:bg-white/10 transition text-sm sm:text-base">
            ›
          </button>
        </div>
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        spaceBetween={24}
        loop
        autoplay={{
          delay: 3500,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-next-real",
          prevEl: ".swiper-prev-real",
        }}
        breakpoints={{
          320: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {data.map((property) => {
          const safeImage = property.image_url?.startsWith("http")
            ? property.image_url
            : "/fallback.jpg";

          return (
            <SwiperSlide key={property.id}>
              <Link href={`/properties/${property.id}`}>
                <div className="group aspect-[4/3] relative rounded-2xl overflow-hidden shadow-xl cursor-pointer">
                  <div className="relative w-full h-full">
                    <Image
                      src={safeImage}
                      alt={property.title}
                      fill
                      unoptimized
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "/fallback.jpg";
                      }}
                      className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  <div
                    className="absolute bottom-3 left-3 right-3 rounded-xl p-4 flex justify-between items-end "
                    style={{
                      background: "rgba(255, 255, 255, 0.12)",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                    }}
                  >
                    <div>
                      <span className="text-white text-[10px] uppercase tracking-widest">
                        {property.city}, {property.state}
                      </span>

                      <h3 className="text-xl font-bold text-white mt-1">
                        {property.title}
                      </h3>

                      <p className="text-white/70 text-xs mt-1">
                        {property.bedrooms || 0} Beds •{" "}
                        {property.area_sqft
                          ? `${Number(property.area_sqft).toLocaleString()} sqft`
                          : "Details"}
                      </p>
                    </div>

                    <div className="text-right text-white">
                      <span className="text-2xl font-bold">
                        ${Number(property.price).toLocaleString()}
                      </span>
                      <span className="text-[10px] block opacity-70 uppercase">
                        price
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
}
