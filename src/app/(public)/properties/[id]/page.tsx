"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  MdArrowBack,
  MdLocationOn,
  MdBed,
  MdBathroom,
  MdSquareFoot,
  MdFavorite,
  MdFavoriteBorder,
  MdClose,
} from "react-icons/md";

interface Property {
  id: string;
  title: string;
  description?: string;
  price: number;
  address?: string;
  city: string;
  state: string;
  zip_code?: string;
  country: string;
  bedrooms: number | null;
  bathrooms: number | null;
  area_sqft: number | null;
  property_type: string;
  listing_type: string;
  status: string;
  images?: { id: string; url: string; is_primary?: boolean }[];
  created_at?: string;
  updated_at?: string;
}

export default function PropertyDetailPage() {
  const params = useParams();
  const propertyId = params.id as string;
  const { data: session } = useSession();

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isFavorited, setIsFavorited] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerMessage, setOfferMessage] = useState("");
  const [offerExpiry, setOfferExpiry] = useState("");
  const [offerLoading, setOfferLoading] = useState(false);
  const [offerError, setOfferError] = useState<string | null>(null);
  const [offerSuccess, setOfferSuccess] = useState(false);

  useEffect(() => {
    async function loadProperty() {
      if (!propertyId) return;

      try {
        setLoading(true);
        const response = await fetch(`/api/properties/${propertyId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Property not found");
          }
          throw new Error("Failed to fetch property");
        }

        const data = await response.json();
        setProperty(data);

        if (session?.user?.id) {
          const favResponse = await fetch(`/api/favorites/check/${propertyId}`);
          if (favResponse.ok) {
            const isFav = await favResponse.json();
            setIsFavorited(isFav);
          }
        }
      } catch (err) {
        console.error("Error loading property:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load property",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [propertyId]);

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(2)}M`;
    }
    return `$${price.toLocaleString()}`;
  };

  const toggleFavorite = async () => {
    if (!session?.user?.id) {
      alert("Please sign in to save favorites");
      return;
    }

    if (favoriteLoading) return;

    setFavoriteLoading(true);
    try {
      if (isFavorited) {
        const response = await fetch(`/api/favorites/${propertyId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setIsFavorited(false);
        }
      } else {
        // Add to favorites
        const response = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ property_id: propertyId }),
        });
        if (response.ok) {
          setIsFavorited(true);
        }
      }
    } catch (err) {
      console.error("Error toggling favorite:", err);
    } finally {
      setFavoriteLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const submitOffer = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("Please sign in to make an offer");
      return;
    }

    if (!offerAmount || !offerExpiry) {
      setOfferError("Please enter offer amount and expiry date");
      return;
    }

    setOfferLoading(true);
    setOfferError(null);

    try {
      const response = await fetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          property_id: propertyId,
          amount: parseFloat(offerAmount),
          message: offerMessage || null,
          expiry_date: new Date(offerExpiry).toISOString(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.error || "Failed to submit offer");
      }

      setOfferSuccess(true);
      setTimeout(() => {
        setShowOfferModal(false);
        setOfferSuccess(false);
        setOfferAmount("");
        setOfferMessage("");
        setOfferExpiry("");
      }, 2000);
    } catch (err) {
      console.error("Error submitting offer:", err);
      setOfferError(
        err instanceof Error ? err.message : "Failed to submit offer",
      );
    } finally {
      setOfferLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="min-h-screen text-white font-inter flex items-center justify-center"
        style={{ backgroundColor: "#003366" }}
      >
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-2 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
          <p className="text-white/60">Loading property...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div
        className="min-h-screen text-white font-inter flex items-center justify-center"
        style={{ backgroundColor: "#003366" }}
      >
        <div className="text-center">
          <p className="text-red-400 mb-4 text-xl">
            {error || "Property not found"}
          </p>
          <Link
            href="/properties"
            className="px-6 py-3 bg-white/10 rounded-full hover:bg-white/20 transition-colors inline-flex items-center gap-2"
          >
            <MdArrowBack /> Back to Properties
          </Link>
        </div>
      </div>
    );
  }

  const allImages =
    (property.images?.length ?? 0) > 0
      ? property.images!
      : [
          {
            id: "placeholder",
            url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%23002b55'/%3E%3Ctext x='400' y='300' font-size='24' fill='white' text-anchor='middle' dy='.3em'%3ENo Images Available%3C/text%3E%3C/svg%3E",
          },
        ];

  return (
    <div
      className="min-h-screen text-white font-inter selection:bg-white/20"
      style={{
        backgroundColor: "#003366",
        backgroundImage: `
        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)
      `,
        backgroundSize: "25% 100vh",
      }}
    >
      <nav className="fixed top-0 left-0 right-0 z-50 px-12 py-6">
        <Link
          href="/properties"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm uppercase tracking-widest"
        >
          <MdArrowBack /> Back to Listings
        </Link>
      </nav>

      <main className="pt-32 pb-24 px-12 max-w-[1600px] mx-auto">
        <header className="mb-12">
          <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-60 mb-4 block">
            {property.listing_type === "sale" ? "For Sale" : "For Rent"} •{" "}
            {property.property_type}
          </span>
          <h1
            className="text-6xl md:text-8xl mb-4"
            style={{
              fontFamily: "Oswald, sans-serif",
              textTransform: "uppercase",
              letterSpacing: "-0.02em",
              lineHeight: "0.9",
            }}
          >
            {property.title}
          </h1>
          <div className="flex items-center gap-2 text-white/60 text-lg">
            <MdLocationOn />
            <span>
              {property.address || ""}, {property.city}, {property.state}{" "}
              {property.zip_code}
            </span>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <div className="space-y-6">
            <div
              className="relative aspect-[4/3] overflow-hidden"
              style={{ borderRadius: "48px" }}
            >
              <img
                src={selectedImage || allImages[0].url}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.map((img) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImage(img.url)}
                    className={`relative aspect-square overflow-hidden rounded-2xl transition-all ${
                      selectedImage === img.url
                        ? "ring-2 ring-white"
                        : "opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={img.url}
                      alt={`${property.title} thumbnail`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-8">
            <div
              className="p-8"
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "48px",
              }}
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-2">
                    Price
                  </p>
                  <p className="text-5xl font-inter font-bold">
                    {formatPrice(property.price)}
                  </p>
                </div>
                <span
                  className={`px-4 py-2 text-[10px] font-bold uppercase tracking-widest rounded-full ${
                    property.status === "active"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-white/10 text-white/60"
                  }`}
                >
                  {property.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-6 border-t border-white/10 pt-6">
                <div className="flex items-center gap-3">
                  <MdBed className="text-2xl text-[#b2c5ff]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">
                      Bedrooms
                    </p>
                    <p className="text-xl font-bold">
                      {property.bedrooms || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MdBathroom className="text-2xl text-[#b2c5ff]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">
                      Bathrooms
                    </p>
                    <p className="text-xl font-bold">
                      {property.bathrooms || 0}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MdSquareFoot className="text-2xl text-[#b2c5ff]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40">
                      Area
                    </p>
                    <p className="text-xl font-bold">
                      {(property.area_sqft || 0).toLocaleString()}{" "}
                      <span className="text-sm font-normal opacity-60">
                        sq ft
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="p-8"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "48px",
              }}
            >
              <h2
                className="text-2xl mb-4"
                style={{
                  fontFamily: "Oswald, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                Description
              </h2>
              <p className="text-white/70 leading-relaxed">
                {property.description || "No description available."}
              </p>
            </div>

            {/* Property Info */}
            <div
              className="p-8"
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "48px",
              }}
            >
              <h2
                className="text-2xl mb-6"
                style={{
                  fontFamily: "Oswald, sans-serif",
                  textTransform: "uppercase",
                  letterSpacing: "0.02em",
                }}
              >
                Property Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Property Type</span>
                  <span className="font-medium">{property.property_type}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Listing Type</span>
                  <span className="font-medium">{property.listing_type}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Country</span>
                  <span className="font-medium">{property.country}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Status</span>
                  <span className="font-medium">{property.status}</span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Listed On</span>
                  <span className="font-medium">
                    {formatDate(property.created_at)}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/60">Last Updated</span>
                  <span className="font-medium">
                    {formatDate(property.updated_at)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={toggleFavorite}
                disabled={favoriteLoading}
                className={`flex items-center justify-center gap-2 px-6 py-5 font-bold text-[12px] uppercase tracking-[0.2em] rounded-full transition-all ${
                  isFavorited
                    ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                    : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
                } ${favoriteLoading ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {favoriteLoading ? (
                  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : isFavorited ? (
                  <>
                    <MdFavorite size={18} /> Saved
                  </>
                ) : (
                  <>
                    <MdFavoriteBorder size={18} /> Save
                  </>
                )}
              </button>
              <button
                onClick={() => setShowOfferModal(true)}
                className="flex-1 bg-[#b2c5ff] text-[#003366] py-5 font-bold text-[12px] uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all"
              >
                Make Offer
              </button>
              <button className="flex-1 bg-white text-[#003366] py-5 font-bold text-[12px] uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all">
                Contact Agent
              </button>
              <button className="flex-1 border border-white/20 py-5 font-bold text-[12px] uppercase tracking-[0.2em] rounded-full hover:bg-white/10 transition-all">
                Schedule Tour
              </button>
            </div>
          </div>
        </div>
      </main>

      {showOfferModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !offerLoading && setShowOfferModal(false)}
          />
          <div
            className="relative w-full max-w-lg p-8"
            style={{
              background: "rgba(0, 51, 102, 0.95)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "32px",
            }}
          >
            <button
              onClick={() => !offerLoading && setShowOfferModal(false)}
              disabled={offerLoading}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              <MdClose size={20} />
            </button>

            <h2
              className="text-3xl mb-2"
              style={{
                fontFamily: "Oswald, sans-serif",
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              Make an Offer
            </h2>
            <p className="text-white/60 mb-6">
              Submit your offer for {property?.title}
            </p>

            {offerSuccess ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
                  <span className="text-3xl">✓</span>
                </div>
                <p className="text-xl font-bold text-green-400">
                  Offer Submitted!
                </p>
                <p className="text-white/60 mt-2">
                  The agent will review your offer
                </p>
              </div>
            ) : (
              <form onSubmit={submitOffer} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">
                    Offer Amount ($)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={offerAmount}
                    onChange={(e) => setOfferAmount(e.target.value)}
                    placeholder="Enter your offer amount"
                    required
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white placeholder-white/40 focus:outline-none focus:border-[#b2c5ff] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">
                    Message (Optional)
                  </label>
                  <textarea
                    value={offerMessage}
                    onChange={(e) => setOfferMessage(e.target.value)}
                    placeholder="Add a message to the agent..."
                    rows={3}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-[#b2c5ff] transition-colors resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest opacity-60 mb-2">
                    Offer Expiry Date
                  </label>
                  <input
                    type="datetime-local"
                    value={offerExpiry}
                    onChange={(e) => setOfferExpiry(e.target.value)}
                    required
                    min={new Date().toISOString().slice(0, 16)}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-full text-white focus:outline-none focus:border-[#b2c5ff] transition-colors [color-scheme:dark]"
                  />
                </div>

                {offerError && (
                  <p className="text-red-400 text-sm bg-red-500/10 px-4 py-2 rounded-lg">
                    {offerError}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={offerLoading}
                  className="w-full bg-white text-[#003366] py-4 font-bold text-[12px] uppercase tracking-[0.2em] rounded-full hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {offerLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Offer"
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <footer
        className="w-full border-t bg-[#002b55] px-12 py-20"
        style={{ borderColor: "rgba(255, 255, 255, 0.1)" }}
      >
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="space-y-8">
            <span className="text-2xl font-bold uppercase tracking-tighter font-inter">
              AzureEstates
            </span>
            <p className="max-w-xs text-xs opacity-40 leading-relaxed tracking-wider uppercase">
              Curating the world's most exclusive architectural masterpieces.
            </p>
          </div>
          <div className="flex gap-20">
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest">
                Explore
              </span>
              <ul className="space-y-4 text-sm opacity-60">
                <li>
                  <Link
                    href="/properties"
                    className="hover:text-white transition-colors"
                  >
                    Properties
                  </Link>
                </li>
                <li>
                  <Link
                    href="/agents"
                    className="hover:text-white transition-colors"
                  >
                    Agents
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest">
                Legal
              </span>
              <ul className="space-y-4 text-sm opacity-60">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
