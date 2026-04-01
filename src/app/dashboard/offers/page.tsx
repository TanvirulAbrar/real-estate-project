"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Offer {
  id: string;
  property: string;
  address: string;
  offerAmount: number;
  status: "pending" | "accepted" | "rejected" | "countered";
  submittedDate: string;
  responseDate?: string;
  counterAmount?: number;
}

export default function OffersPage() {
  const { data: session } = useSession();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOffers() {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch("/api/offers");

        if (!response.ok) {
          throw new Error("Failed to fetch offers");
        }

        const data = await response.json();

        const mappedOffers = (data.data || []).map(
          (o: {
            id: string;
            property?: { title: string; city: string; state: string };
            amount: number;
            status: string;
            created_at: string;
            updated_at?: string;
            counter_amount?: number;
          }) => ({
            id: o.id,
            property: o.property?.title || "Unknown Property",
            address: o.property
              ? `${o.property.city}, ${o.property.state}`
              : "",
            offerAmount: o.amount,
            status: o.status as
              | "pending"
              | "accepted"
              | "rejected"
              | "countered",
            submittedDate: o.created_at?.split("T")[0] || "",
            responseDate: o.updated_at?.split("T")[0],
            counterAmount: o.counter_amount,
          }),
        );
        setOffers(mappedOffers);
      } catch (error) {
        console.error("Error loading offers:", error);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    }

    loadOffers();
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "accepted":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      case "countered":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
        My Offers
      </h1>

      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#a9c7ff]/30 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#c2c6d3] text-sm sm:text-base">
            Loading your offers...
          </p>
        </div>
      ) : offers.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-[#c2c6d3] text-base sm:text-lg mb-4">
            No offers submitted yet
          </p>
          <p className="text-white/60 text-sm">
            Start making offers on properties you're interested in!
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6 hover:border-[#a9c7ff]/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {offer.property}
                  </h3>
                  <p className="text-[#c2c6d3] text-sm">{offer.address}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${getStatusColor(offer.status)}`}
                >
                  {offer.status.charAt(0).toUpperCase() + offer.status.slice(1)}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-[#c2c6d3] text-xs sm:text-sm mb-1">
                    Your Offer
                  </p>
                  <p className="text-xl sm:text-2xl font-bold text-white">
                    ${offer.offerAmount.toLocaleString()}
                  </p>
                </div>
                {offer.counterAmount && (
                  <div>
                    <p className="text-[#c2c6d3] text-xs sm:text-sm mb-1">
                      Counter Offer
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-[#a9c7ff]">
                      ${offer.counterAmount.toLocaleString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#c2c6d3] mb-4">
                <div>
                  <span className="text-white">Submitted:</span>{" "}
                  {offer.submittedDate}
                </div>
                {offer.responseDate && (
                  <div>
                    <span className="text-white">Response:</span>{" "}
                    {offer.responseDate}
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button className="px-3 sm:px-4 py-2 bg-[#a9c7ff]/10 text-[#a9c7ff] rounded-full hover:bg-[#a9c7ff]/20 transition-colors text-xs sm:text-sm">
                  View Details
                </button>
                {offer.status === "countered" && (
                  <>
                    <button className="px-3 sm:px-4 py-2 bg-green-500/10 text-green-400 rounded-full hover:bg-green-500/20 transition-colors text-xs sm:text-sm">
                      Accept Counter
                    </button>
                    <button className="px-3 sm:px-4 py-2 bg-blue-500/10 text-blue-400 rounded-full hover:bg-blue-500/20 transition-colors text-xs sm:text-sm">
                      New Offer
                    </button>
                  </>
                )}
                {offer.status === "pending" && (
                  <button className="px-3 sm:px-4 py-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors text-xs sm:text-sm">
                    Withdraw Offer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
