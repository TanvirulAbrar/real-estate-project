"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Property {
  id: string;
  title: string;
  address: string;
  city: string;
  state: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  image_url?: string;
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch("/api/favorites");

        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }

        const data = await response.json();

        const mappedFavorites = (data.data || []).map(
          (f: {
            id: string;
            title: string;
            address: string | null;
            city: string;
            state: string;
            price: number;
            bedrooms: number | null;
            bathrooms: number | null;
            area_sqft: number | null;
            primary_image_url: string | null;
          }) => ({
            id: f.id,
            title: f.title,
            address: f.address || "",
            city: f.city,
            state: f.state,
            price: f.price,
            bedrooms: f.bedrooms || 0,
            bathrooms: f.bathrooms || 0,
            area_sqft: f.area_sqft || 0,
            image_url: f.primary_image_url,
          }),
        );
        setFavorites(mappedFavorites);
      } catch (error) {
        console.error("Error loading favorites:", error);
        setFavorites([]);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, [session]);

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-8">
      <h1 className="text-4xl font-bold text-white mb-8">My Favorites</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-[#a9c7ff]/30 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#c2c6d3]">
            Loading your favorite properties...
          </p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-[#c2c6d3] text-lg mb-4">
            No favorite properties yet
          </p>
          <p className="text-white/60">
            Start exploring and save properties you love!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {favorites.map((property) => (
            <div
              key={property.id}
              className="group relative overflow-hidden rounded-[32px] aspect-[4/5]"
            >
              <img
                alt={property.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                src={property.image_url || "/placeholder-property.jpg"}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#000e25] via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-0 left-0 p-8 w-full">
                <span className="bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-[10px] uppercase tracking-widest text-white mb-4 inline-block">
                  ${property.price.toLocaleString()}
                </span>
                <h3 className="font-inter text-xl font-bold text-white mb-2">
                  {property.title}
                </h3>
                <p className="text-[#c2c6d3] text-sm mb-4">
                  {property.address}, {property.city}, {property.state}
                </p>
                <div className="flex gap-4 text-sm text-[#c2c6d3]">
                  <span>{property.bedrooms} bd</span>
                  <span>{property.bathrooms} ba</span>
                  <span>{property.area_sqft.toLocaleString()} sqft</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
