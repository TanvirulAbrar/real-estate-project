"use client";

import { useState, useEffect } from "react";
import {
  MdDomain,
  MdDashboard,
  MdChatBubble,
  MdCalendarToday,
  MdPayments,
  MdAdd,
  MdSettings,
  MdContactSupport,
  MdSearch,
  MdEdit,
  MdVisibility,
  MdStar,
  MdLocationOn,
  MdBed,
  MdSquareFoot,
  MdBathtub,
  MdNotifications,
  MdGridOn,
  MdList,
} from "react-icons/md";
import Link from "next/link";

interface Property {
  _id: string;
  title: string;
  description: string;
  address: string;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  property_type: string;
  price: number;
  status: string;
  agent_id?: string;
  images?: { id: string; url: string; is_primary?: boolean }[];
  views?: number;
  inquiries?: number;
  offers?: number;
  created_at: Date;
  updated_at: Date;
}

export default function AgentMyProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [deletingProperty, setDeletingProperty] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true);

        const sessionResponse = await fetch("/api/debug/session");
        const sessionData = await sessionResponse.json();
        console.log("Session debug:", sessionData);

        const response = await fetch("/api/agent/properties");
        if (response.ok) {
          const data = await response.json();
          setProperties(data);
          console.log("Fetched properties:", data);
        } else {
          const errorData = await response.json();
          console.error("API Error:", response.status, errorData);
        }
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const deleteProperty = async (propertyId: string, propertyTitle: string) => {
    const confirmed = confirm(
      `Are you sure you want to delete "${propertyTitle}"?\n\nThis action cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      setDeletingProperty(propertyId);
      const response = await fetch(`/api/agent/properties?id=${propertyId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setProperties((prev) => prev.filter((p) => p._id !== propertyId));
        alert("Property deleted successfully");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to delete property");
      }
    } catch (err) {
      console.error("Error deleting property:", err);
      alert("Error deleting property");
    } finally {
      setDeletingProperty(null);
    }
  };

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.state.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-400";
      case "pending":
        return "text-yellow-400";
      case "sold":
        return "text-blue-400";
      case "off-market":
        return "text-purple-400";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] overflow-x-hidden">
      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-8"></div>

        <section className="p-4 sm:p-6 lg:p-12 max-w-7xl mx-auto w-full">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-8 mb-8 sm:mb-16">
            <div className="space-y-2 sm:space-y-4">
              <h1 className="text-4xl sm:text-6xl lg:text-8xl font-headline font-inter tracking-tighter text-on-background leading-none">
                Portfolio
              </h1>
              <p className="text-[#c2c6d3] font-body text-sm sm:text-lg max-w-xl leading-relaxed">
                Curated architectural residences currently under management.
                Every space tells a distinct story of modernism and legacy.
              </p>
            </div>
            <Link
              href="/agent/add-property"
              className="flex items-center gap-2 sm:gap-3 rounded-full bg-[#a9c7ff] text-[#001b3d] px-4 sm:px-8 py-3 sm:py-5 font-headline font-bold uppercase tracking-widest text-xs sm:text-sm shadow-xl active:scale-95 transition-all w-full sm:w-auto justify-center"
            >
              <MdAdd className="w-5 h-5 sm:w-6 sm:h-6" />
              Add New Property
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12 sm:py-20">
              <div className="text-white/60">Loading properties...</div>
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 sm:py-20 text-center">
              <div className="text-white/60 mb-4 text-sm sm:text-base">
                {properties.length === 0
                  ? "You haven't added any properties yet."
                  : "No properties match your search."}
              </div>
              {properties.length === 0 && (
                <Link
                  href="/agent/add-property"
                  className="bg-[#a9c7ff] text-[#001b3d] px-4 sm:px-6 py-2 sm:py-3 font-bold rounded-full hover:bg-white transition-colors text-sm"
                >
                  Add Your First Property
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-12">
              {filteredProperties.map((property) => (
                <div
                  key={property._id}
                  className="group relative aspect-[4/5] rounded-2xl sm:rounded-3xl overflow-hidden bg-surface-container-low flex flex-col"
                >
                  <img
                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
                    src={
                      property.images?.[0]?.url ||
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23191c21'/%3E%3Ctext x='200' y='250' font-size='14' fill='%23a9c7ff' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                    }
                    alt={property.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23191c21'/%3E%3Ctext x='200' y='250' font-size='14' fill='%23a9c7ff' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent"></div>
                  <div className="mt-auto p-4 sm:p-6 relative">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-headline font-bold text-base sm:text-xl text-white tracking-tight truncate">
                          The {property.title}
                        </h3>
                        <p className="text-white/60 text-xs sm:text-sm font-body truncate">
                          {property.address}
                        </p>
                      </div>
                      <span
                        className={`px-2 sm:px-3 py-0.5 sm:py-1 bg-[#155aaa] text-[#a9c7ff] text-[10px] font-headline font-inter uppercase tracking-widest rounded-full whitespace-nowrap`}
                      >
                        {property.status}
                      </span>
                    </div>
                  </div>
                  <div className="backdrop-blur-xl bg-white/10 border border-white/10 p-4 sm:p-6 rounded-2xl sm:rounded-3xl space-y-2 sm:space-y-3">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
                      <div className="min-w-0 flex-1">
                        <h4 className="font-headline font-bold text-base sm:text-xl text-white tracking-tight truncate">
                          {property.title}
                        </h4>
                        <p className="text-white/60 text-xs sm:text-sm font-body">
                          {property.city}, {property.state}
                        </p>
                      </div>
                      <div className="flex gap-2 sm:gap-4">
                        <Link href={`/agent/properties/${property._id}/edit`}>
                          <button className="text-[#a9c7ff] hover:text-white transition-colors duration-200 p-1">
                            <MdEdit className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </Link>
                        <Link href={`/agent/properties/${property._id}`}>
                          <button className="text-[#a9c7ff] hover:text-white transition-colors duration-200 p-1">
                            <MdVisibility className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </Link>
                        <button
                          onClick={() =>
                            deleteProperty(property._id, property.title)
                          }
                          disabled={deletingProperty === property._id}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200 disabled:opacity-50 p-1"
                          title="Delete property"
                        >
                          {deletingProperty === property._id ? (
                            <span className="inline-block w-3 h-3 sm:w-4 sm:h-4 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">
                              Delete
                            </span>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm text-white/60">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <MdLocationOn className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{property.bedrooms} bd</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <MdBathtub className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{property.bathrooms} ba</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <MdSquareFoot className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{property.area_sqft.toLocaleString()} sqft</span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <MdStar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>{property.views || 0} views</span>
                      </div>
                    </div>
                    <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <MdChatBubble
                          size={12}
                          className="text-white/40 sm:w-3.5 sm:h-3.5"
                        />
                        <span className="text-white/60">
                          {property.inquiries}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 sm:gap-2">
                        <MdPayments
                          size={12}
                          className="text-white/40 sm:w-3.5 sm:h-3.5"
                        />
                        <span className="text-white/60">{property.offers}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 sm:mt-8 flex justify-center">
            <Link
              href="/agent/add-property"
              className="px-6 sm:px-8 py-2 sm:py-3 bg-[#a9c7ff] text-[#003063] font-bold text-xs sm:text-sm rounded-full hover:bg-white transition-colors flex items-center gap-2"
            >
              <MdAdd size={16} />
              Add New Property
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
