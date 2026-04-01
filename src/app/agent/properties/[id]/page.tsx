"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  MdArrowBack,
  MdLocationOn,
  MdBed,
  MdBathtub,
  MdSquareFoot,
  MdEdit,
  MdDelete,
} from "react-icons/md";

interface Property {
  id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  property_type: string;
  listing_type: string;
  price: number;
  status: string;
  images: { id: string; url: string; is_primary?: boolean }[];
  created_at: string;
  updated_at: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const propertyId = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${propertyId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch property");
        }

        const data = await response.json();
        setProperty(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error loading property");
        console.error("Error fetching property:", err);
      } finally {
        setLoading(false);
      }
    };

    if (propertyId) {
      fetchProperty();
    }
  }, [propertyId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this property?")) return;

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      router.push("/agent/properties");
    } catch (err) {
      alert("Failed to delete property");
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#00132e]">
        <div className="text-white text-xl">Loading property...</div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#00132e]">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">
            {error || "Property not found"}
          </div>
          <button
            onClick={() => router.push("/agent/properties")}
            className="px-6 py-3 bg-[#a9c7ff] text-[#003063] font-bold rounded-full"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const primaryImage =
    property.images?.find((img) => img.is_primary) || property.images?.[0];

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9]">
      <header className="mt-20 top-0 z-50 flex justify-end items-center px-8 w-full border-b border-[#122a4c]/20 bg-[#00132e]/60 backdrop-blur-xl h-20">
        <div className="flex items-center gap-4">
          <Link
            href={`/agent/properties/${propertyId}/edit`}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-[#a9c7ff] text-[#003063] text-xs font-bold tracking-widest uppercase  hover:opacity-90 transition-opacity"
          >
            <MdEdit size={16} />
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-red-500/20 text-red-400 text-xs font-bold tracking-widest uppercasehover:bg-red-500/30 transition-colors"
          >
            <MdDelete size={16} />
            Delete
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-8 py-12">
        <nav className="flex items-center gap-2 mb-8 text-[10px] uppercase tracking-[0.2em] text-[#a9c7ff]/40 font-bold">
          <Link href="/agent/properties" className="hover:text-[#a9c7ff]/70">
            Portfolio
          </Link>
          <span>/</span>
          <span className="text-[#a9c7ff]">{property.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-4">
            {primaryImage ? (
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-[#191c21]">
                <img
                  src={primaryImage.url}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="400" height="300" fill="%23191c21"/><text x="200" y="150" font-size="14" fill="%23a9c7ff" text-anchor="middle" dy=".3em">No Image Available</text></svg>';
                  }}
                />
              </div>
            ) : (
              <div className="aspect-[4/3] rounded-lg bg-[#191c21] flex items-center justify-center">
                <span className="text-[#a9c7ff]/50 text-sm">
                  No images available
                </span>
              </div>
            )}

            {property.images && property.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {property.images.slice(0, 4).map((image, index) => (
                  <div
                    key={image.id || index}
                    className="aspect-square rounded-md overflow-hidden bg-[#191c21]"
                  >
                    <img
                      src={image.url}
                      alt={`View ${index + 1}`}
                      className="w-full h-full object-cover opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span
                  className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                    property.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : property.status === "sold"
                        ? "bg-blue-500/20 text-blue-400"
                        : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {property.status}
                </span>
                <span className="text-[10px] text-[#a9c7ff]/50 uppercase tracking-widest">
                  ID: {property.id}
                </span>
              </div>

              <h1 className="text-4xl font-inter text-white tracking-tight mb-2">
                {property.title}
              </h1>
              <p className="text-lg text-[#a9c7ff]/70 flex items-center gap-2">
                <MdLocationOn />
                {property.address}, {property.city}, {property.state}
              </p>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-white">
                ${property.price?.toLocaleString()}
              </span>
              <span className="text-[#a9c7ff]/50 uppercase tracking-widest text-sm">
                {property.listing_type === "sale" ? "For Sale" : "For Rent"}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 py-6 border-y border-[#122a4c]/30">
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#a9c7ff] mb-1">
                  <MdBed size={20} />
                  <span className="text-2xl font-bold text-white">
                    {property.bedrooms}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#a9c7ff]/50">
                  Bedrooms
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#a9c7ff] mb-1">
                  <MdBathtub size={20} />
                  <span className="text-2xl font-bold text-white">
                    {property.bathrooms}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#a9c7ff]/50">
                  Bathrooms
                </span>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 text-[#a9c7ff] mb-1">
                  <MdSquareFoot size={20} />
                  <span className="text-2xl font-bold text-white">
                    {property.area_sqft?.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-widest text-[#a9c7ff]/50">
                  Sq Ft
                </span>
              </div>
            </div>

            <div>
              <h3 className="text-xs font-inter uppercase tracking-[0.25em] text-white mb-4">
                Description
              </h3>
              <p className="text-[#c2c6d3] leading-relaxed whitespace-pre-wrap">
                {property.description || "No description available."}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-widest text-[#a9c7ff]/50">
                Type:
              </span>
              <span className="text-white capitalize">
                {property.property_type}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
