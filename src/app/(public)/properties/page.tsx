"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  MdSearch,
  MdFavorite,
  MdExpandMore,
  MdWest,
  MdEast,
} from "react-icons/md";

interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  address?: string;
  city: string;
  state: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  property_type: string;
  listing_type: string;
  images?: { id: string; url: string; is_primary?: boolean }[];
  agent?: {
    id: string;
    name: string;
    email: string;
  };
  status?: string;
  created_at?: string;
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  useEffect(() => {
    async function loadProperties() {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties?page=${page}&limit=12`);

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data.data || []);
        setTotalPages(data.pagination?.totalPages || 1);
      } catch (err) {
        console.error("Error loading properties:", err);
        setError("Failed to load properties");
      } finally {
        setLoading(false);
      }
    }

    loadProperties();
  }, [page]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const getPrimaryImage = (property: Property) => {
    const primaryImage = property.images?.find((img) => img.is_primary);
    return primaryImage?.url || property.images?.[0]?.url;
  };

  if (loading) {
    return (
      <div
        className="min-h-screen text-white font-inter flex items-center justify-center px-4"
        style={{ backgroundColor: "#003366" }}
      >
        <div className="text-center">
          <div className="inline-block w-10 h-10 sm:w-12 sm:h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-white/60 text-sm sm:text-base">
            Loading properties...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="min-h-screen text-white font-inter flex items-center justify-center px-4"
        style={{ backgroundColor: "#003366" }}
      >
        <div className="text-center">
          <p className="text-red-400 mb-4 text-sm sm:text-base">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors text-sm sm:text-base"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white font-inter selection:bg-white/20 overflow-x-hidden"
      style={{
        backgroundColor: "#003366",
        backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
      `,
        backgroundSize: "25% 100vh",
      }}
    >
      <main className="pt-32 sm:pt-40 lg:pt-60 pb-16 sm:pb-20 lg:pb-24 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-[1600px] mx-auto">
        <header className="mb-12 sm:mb-16 lg:mb-20 flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 lg:gap-12 border-l-4 border-white pl-4 sm:pl-6 lg:pl-8">
          <div className="space-y-2 sm:space-y-4">
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase opacity-60">
              Real Estate{" "}
            </span>
            <h1
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[10rem]"
              style={{
                fontFamily: "Oswald, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "-0.02em",
                lineHeight: "0.9",
              }}
            >
              Premium
              <br />
              Listings
            </h1>
            <p className="text-white/60 max-w-lg text-sm sm:text-base lg:text-lg font-light leading-relaxed">
              Curating architectural masterpieces in the world's most exclusive
              coastal and metropolitan locations.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 lg:gap-8">
            <div className="flex items-center gap-4 sm:gap-8 text-[10px] sm:text-xs font-bold uppercase tracking-widest">
              <span className="opacity-40">Showing</span>
              <span className="border-b-2 border-white pb-1">
                {properties.length} Results
              </span>
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/5 rounded-full text-xs font-bold uppercase tracking-widest"
            >
              <MdExpandMore
                className={`transition-transform ${showMobileFilters ? "rotate-180" : ""}`}
              />
              Filters
            </button>

            <button className="hidden sm:flex items-center gap-2 sm:gap-3 group px-3 sm:px-4 py-2 bg-white/5 rounded-full hover:bg-white/10 transition-colors">
              <span className="text-[10px] font-bold uppercase tracking-widest">
                Sort By: Newest
              </span>
              <MdExpandMore className="group-hover:rotate-180 transition-transform" />
            </button>
          </div>
        </header>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 xl:gap-16">
          <aside
            className={`w-full lg:w-72 xl:w-80 flex-shrink-0 ${showMobileFilters ? "block" : "hidden lg:block"}`}
          >
            <div className="lg:sticky lg:top-32 space-y-6 sm:space-y-8 lg:space-y-16">
              <div
                className="glass-panel p-6 sm:p-8 lg:p-10 space-y-6 sm:space-y-8"
                style={{
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(16px)",
                  WebkitBackdropFilter: "blur(16px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "32px",
                }}
              >
                <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.3em] opacity-40">
                  Filter By
                </h3>

                <div className="space-y-4 sm:space-y-6">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    Property Type
                  </label>
                  <div className="space-y-3 sm:space-y-4">
                    <label className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
                      <div className="w-4 h-4 border border-white/30 rounded-full flex items-center justify-center group-hover:border-white transition-colors">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                      <span className="text-xs sm:text-sm uppercase tracking-widest">
                        Luxury Villas
                      </span>
                    </label>
                    <label className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
                      <div className="w-4 h-4 border border-white/30 rounded-full flex items-center justify-center group-hover:border-white transition-colors"></div>
                      <span className="text-xs sm:text-sm uppercase tracking-widest opacity-60 group-hover:opacity-100">
                        Penthouses
                      </span>
                    </label>
                    <label className="flex items-center gap-3 sm:gap-4 cursor-pointer group">
                      <div className="w-4 h-4 border border-white/30 rounded-full flex items-center justify-center group-hover:border-white transition-colors"></div>
                      <span className="text-xs sm:text-sm uppercase tracking-widest opacity-60 group-hover:opacity-100">
                        Islands
                      </span>
                    </label>
                  </div>
                </div>

                <div className="space-y-6 sm:space-y-8">
                  <label className="text-[10px] sm:text-xs font-bold uppercase tracking-widest">
                    Price (USD)
                  </label>
                  <div className="relative h-[1px] w-full bg-white/20">
                    <div className="absolute inset-y-0 left-1/4 right-1/4 bg-white h-[2px] -top-[0.5px]"></div>
                    <div className="absolute left-1/4 -top-1 w-2 h-2 bg-white rounded-full"></div>
                    <div className="absolute right-1/4 -top-1 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                  <div className="flex justify-between text-[10px] sm:text-xs font-bold font-inter tracking-widest">
                    <span>$2.5M</span>
                    <span>$15M+</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4 px-2 sm:px-4">
                <button className="w-full bg-white text-[#003366] py-3 sm:py-4 lg:py-5 font-bold text-[10px] uppercase tracking-[0.3em] rounded-full hover:bg-opacity-90 transition-all">
                  Apply Refinement
                </button>
                <button className="w-full py-3 sm:py-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity">
                  Clear All
                </button>
              </div>
            </div>
          </aside>

          <section className="flex-1">
            {properties.length === 0 ? (
              <div className="text-center py-12 sm:py-20">
                <p className="text-white/60 text-base sm:text-lg">
                  No properties available at the moment.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 lg:gap-x-12 lg:gap-y-16">
                {properties.map((property, index) => {
                  const imageUrl = getPrimaryImage(property);

                  if (
                    index > 0 &&
                    index % 3 === 0 &&
                    property.price > 5000000
                  ) {
                    return (
                      <div
                        key={property.id}
                        className="sm:col-span-2 group pt-6 sm:pt-8 lg:pt-12"
                      >
                        <div
                          className="flex flex-col lg:flex-row h-auto lg:h-[500px] xl:h-[600px] border overflow-hidden"
                          style={{
                            borderRadius: "32px",
                            borderColor: "rgba(255, 255, 255, 0.1)",
                          }}
                        >
                          <div className="relative w-full lg:w-3/5 h-64 sm:h-80 lg:h-full overflow-hidden">
                            <img
                              className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                              src={
                                imageUrl ||
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23002b55'/%3E%3Ctext x='400' y='300' font-size='18' fill='white' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                              }
                              alt={property.title}
                            />
                            <div className="absolute inset-0 bg-[#003366]/20"></div>
                          </div>
                          <div
                            className="w-full lg:w-2/5 p-6 sm:p-8 lg:p-12 xl:p-16 flex flex-col justify-between"
                            style={{
                              background: "rgba(0, 51, 102, 0.4)",
                              backdropFilter: "blur(24px)",
                            }}
                          >
                            <div className="space-y-4 sm:space-y-6 lg:space-y-8">
                              <div className="space-y-2">
                                <span className="text-[10px] sm:text-xs font-bold tracking-[0.4em] uppercase opacity-40">
                                  {property.listing_type === "sale"
                                    ? "For Sale"
                                    : "For Rent"}
                                </span>
                                <h3
                                  className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl"
                                  style={{
                                    fontFamily: "Oswald, sans-serif",
                                    textTransform: "uppercase",
                                    letterSpacing: "-0.02em",
                                    lineHeight: "0.9",
                                  }}
                                >
                                  {property.title}
                                </h3>
                                <p className="text-[10px] sm:text-xs font-bold tracking-widest opacity-60">
                                  {property.city.toUpperCase()},{" "}
                                  {property.state.toUpperCase()}
                                </p>
                              </div>
                              <p className="text-white/60 text-sm sm:text-base font-light leading-relaxed line-clamp-3">
                                {property.description ||
                                  "A stunning property in an exclusive location."}
                              </p>
                              <div className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-inter font-bold">
                                {formatPrice(property.price)}
                              </div>
                            </div>
                            <div className="flex gap-3 sm:gap-4 mt-6 sm:mt-8">
                              <Link
                                href={`/properties/${property.id}`}
                                className="flex-1 bg-white text-[#003366] py-3 sm:py-4 lg:py-5 font-bold text-[10px] uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all text-center"
                              >
                                View Residence
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }

                  // Regular card
                  return (
                    <Link
                      key={property.id}
                      href={`/properties/${property.id}`}
                      className="group block focus:outline-none"
                    >
                      <div
                        className="relative aspect-[4/5] overflow-hidden mb-4 sm:mb-6 lg:mb-8 focus-within:ring-2 focus-within:ring-[#a9c7ff] focus-within:ring-offset-2 focus-within:ring-offset-[#003366]"
                        style={{ borderRadius: "32px" }}
                      >
                        <img
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                          src={
                            imageUrl ||
                            "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23002b55'/%3E%3Ctext x='200' y='250' font-size='14' fill='white' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                          }
                          alt={property.title}
                        />
                        <div className="absolute top-4 left-4 sm:top-6 sm:left-6 lg:top-8 lg:left-8 flex flex-col gap-2">
                          <span className="bg-white text-[#003366] px-3 sm:px-4 lg:px-5 py-1.5 sm:py-2 text-[8px] sm:text-[10px] font-bold tracking-[0.2em] uppercase rounded-full">
                            {property.listing_type === "sale"
                              ? "For Sale"
                              : "For Rent"}
                          </span>
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div
                          className="glass-panel p-4 sm:p-5 lg:p-6 absolute bottom-3 left-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0"
                          style={{
                            background: "rgba(255, 255, 255, 0.12)",
                            backdropFilter: "blur(20px)",
                            WebkitBackdropFilter: "blur(20px)",
                            border: "1px solid rgba(255, 255, 255, 0.15)",
                            borderRadius: "24px",
                          }}
                        >
                          <h3
                            className="text-base sm:text-lg lg:text-xl mb-1 truncate"
                            style={{
                              fontFamily: "Oswald, sans-serif",
                              textTransform: "uppercase",
                              letterSpacing: "-0.02em",
                            }}
                          >
                            {property.title}
                          </h3>
                          <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2 sm:mb-3">
                            {property.city}, {property.state}
                          </p>
                          <div className="flex justify-between items-center">
                            <span className="text-sm sm:text-base lg:text-lg font-inter font-bold">
                              {formatPrice(property.price)}
                            </span>
                            <span className="text-[10px] uppercase tracking-wider opacity-60">
                              {property.bedrooms} bed • {property.bathrooms}{" "}
                              bath
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            {properties.length > 0 && totalPages > 1 && (
              <div
                className="mt-16 sm:mt-20 lg:mt-32 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-8 border-t pt-8 sm:pt-12"
                style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
              >
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  <MdWest className="text-sm" /> Previous
                </button>
                <div className="flex gap-4 sm:gap-8 lg:gap-12 font-inter text-base sm:text-lg">
                  {Array.from(
                    { length: Math.min(totalPages, 5) },
                    (_, i) => i + 1,
                  ).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`${p === page ? "border-b-2 border-white pb-1" : "opacity-40 hover:opacity-100 cursor-pointer"}`}
                    >
                      {String(p).padStart(2, "0")}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-2 sm:gap-4 text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] opacity-40 hover:opacity-100 transition-opacity disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Next <MdEast className="text-sm" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
