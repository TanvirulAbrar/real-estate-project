"use client";

import { useState, useEffect } from "react";
import {
  MdPayments,
  MdDashboard,
  MdDomain,
  MdChatBubble,
  MdCalendarToday,
  MdAdd,
  MdSettings,
  MdContactSupport,
  MdSearch,
  MdTrendingUp,
  MdArrowUpward,
  MdArrowDownward,
  MdMoreVert,
  MdCheck,
  MdClose,
  MdSchedule,
} from "react-icons/md";

interface Offer {
  id: string;
  property_id: string;
  buyer_id: string;
  amount: number;
  message?: string;
  expiry_date: string;
  status: string;
  created_at: string;
  updated_at: string;
  property?: {
    id: string;
    title: string;
    city: string;
    state: string;
    images: { url: string }[];
  };
  primary_image_url?: string;
}

export default function AgentOffers() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/api/offers");
        if (response.ok) {
          const data = await response.json();
          setOffers(data.data || []);
        } else {
          setError("Failed to fetch offers");
        }
      } catch (error) {
        console.error("Error fetching offers:", error);
        setError("Error loading offers");
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();

    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else if (diffInDays === 1) {
      return "1 day ago";
    } else {
      return `${diffInDays} days ago`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "accepted":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "rejected":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "counter-offer":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const pendingOffers = offers.filter((o) => o.status === "pending").length;
  const acceptedOffers = offers.filter((o) => o.status === "accepted").length;
  const totalValue = offers.reduce((sum, o) => sum + o.amount, 0);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-w-0 items-center justify-center">
        <div className="text-white">Loading offers...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col min-w-0 items-center justify-center">
        <div className="text-red-400">{error}</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <MdCheck size={16} />;
      case "pending":
        return <MdSchedule size={16} />;
      case "counter-offer":
        return <MdTrendingUp size={16} />;
      case "rejected":
        return <MdClose size={16} />;
      case "expired":
        return <MdClose size={16} />;
      default:
        return <MdSchedule size={16} />;
    }
  };

  const pendingOffersCount = offers.filter(
    (offer) => offer.status === "pending" || offer.status === "counter-offer",
  ).length;
  const acceptedOffersCount = offers.filter(
    (offer) => offer.status === "accepted",
  ).length;
  const totalCommission = offers.reduce((sum, offer) => {
    return sum + offer.amount * 0.03;
  }, 0);

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
      <div className="h-8"></div>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-inter text-white mb-1 sm:mb-2">
            Property Offers
          </h1>
          <p className="text-[#c2c6d3] text-sm sm:text-base mb-4 sm:mb-6">
            Track and manage offers on your listings
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            <div
              className="p-4 sm:p-6 rounded-xl border border-white/5"
              style={{
                background: "rgba(25, 28, 33, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-[#c2c6d3]">
                  Pending Offers
                </p>
                <MdSchedule className="text-amber-400" size={14} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white">
                {pendingOffersCount}
              </p>
              <p className="text-[10px] sm:text-xs text-amber-400 mt-1">
                Need attention
              </p>
            </div>
            <div
              className="p-4 sm:p-6 rounded-xl border border-white/5"
              style={{
                background: "rgba(25, 28, 33, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-[#c2c6d3]">
                  Accepted Offers
                </p>
                <MdCheck className="text-emerald-400" size={14} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white">
                {acceptedOffersCount}
              </p>
              <p className="text-[10px] sm:text-xs text-emerald-400 mt-1">
                This month
              </p>
            </div>
            <div
              className="p-4 sm:p-6 rounded-xl border border-white/5"
              style={{
                background: "rgba(25, 28, 33, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-[#c2c6d3]">
                  Total Commission
                </p>
                <MdPayments className="text-[#a9c7ff]" size={14} />
              </div>
              <p className="text-lg sm:text-3xl font-bold text-white truncate">
                {formatCurrency(totalCommission)}
              </p>
              <p className="text-[10px] sm:text-xs text-[#a9c7ff] mt-1">
                Potential earnings
              </p>
            </div>
            <div
              className="p-4 sm:p-6 rounded-xl border border-white/5"
              style={{
                background: "rgba(25, 28, 33, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs sm:text-sm text-[#c2c6d3]">
                  Avg. Offer Price
                </p>
                <MdTrendingUp className="text-[#ffb68b]" size={14} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white">97.5%</p>
              <p className="text-[10px] sm:text-xs text-[#ffb68b] mt-1">
                Of asking price
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {offers.map((offer) => {
            const commission = formatCurrency(offer.amount * 0.03);

            return (
              <div
                key={offer.id}
                className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5 hover:transform hover:scale-[1.01] transition-all duration-300"
                style={{
                  background: "rgba(25, 28, 33, 0.4)",
                  backdropFilter: "blur(24px)",
                }}
              >
                <div className="flex flex-col gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                      <h3 className="text-base sm:text-xl font-bold text-white truncate">
                        {offer.property?.title || "Unknown Property"}
                      </h3>
                      <span
                        className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border flex items-center gap-1 w-fit ${getStatusColor(offer.status)}`}
                      >
                        {getStatusIcon(offer.status)}
                        <span className="hidden sm:inline">
                          {offer.status.charAt(0).toUpperCase() +
                            offer.status.replace("-", " ").slice(1)}
                        </span>
                        <span className="sm:hidden">
                          {offer.status.charAt(0).toUpperCase()}
                        </span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 mb-4">
                      <div>
                        <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mb-1">
                          Offer Amount
                        </p>
                        <p className="text-xl sm:text-2xl font-bold text-white">
                          {formatCurrency(offer.amount)}
                        </p>
                        <p className="text-xs sm:text-sm text-[#c2c6d3] mt-1">
                          {offer.property?.city}, {offer.property?.state}
                        </p>
                      </div>

                      <div className="hidden sm:block">
                        <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mb-1">
                          Buyer
                        </p>
                        <p className="text-sm sm:text-lg font-medium text-white truncate">
                          {offer.buyer_id.slice(0, 8)}...
                        </p>
                        <p className="text-xs sm:text-sm text-[#c2c6d3]">
                          {formatTimeAgo(offer.created_at)}
                        </p>
                      </div>

                      <div className="hidden lg:block">
                        <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mb-1">
                          Commission
                        </p>
                        <p className="text-sm sm:text-lg font-bold text-[#a9c7ff]">
                          {commission}
                        </p>
                        <p className="text-xs sm:text-sm text-[#c2c6d3]">
                          Expires: {formatTimeAgo(offer.expiry_date)}
                        </p>
                      </div>
                    </div>

                    {offer.message && (
                      <div className="mb-3 sm:mb-4">
                        <p className="text-[10px] sm:text-xs text-white/40 uppercase tracking-widest mb-2">
                          Message
                        </p>
                        <p className="text-xs sm:text-sm text-[#c2c6d3] leading-relaxed line-clamp-2">
                          {offer.message}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3">
                    <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#a9c7ff] text-[#003063] font-bold text-xs sm:text-sm rounded-full hover:bg-white transition-colors">
                      View Details
                    </button>
                    {offer.status === "pending" && (
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/20 text-emerald-400 font-bold text-xs sm:text-sm rounded-full hover:bg-emerald-500/30 transition-colors">
                        Accept
                      </button>
                    )}
                    {offer.status === "counter-offer" && (
                      <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-blue-500/20 text-blue-400 font-bold text-xs sm:text-sm rounded-full hover:bg-blue-500/30 transition-colors">
                        Respond
                      </button>
                    )}
                    <button className="p-2 sm:p-3 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors">
                      <MdMoreVert size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-xl border border-white/5"
          style={{
            background: "rgba(25, 28, 33, 0.4)",
            backdropFilter: "blur(24px)",
          }}
        >
          <h3 className="text-base sm:text-lg font-bold text-white mb-3 sm:mb-4">
            Offer Summary
          </h3>
          <div className="grid grid-cols-3 gap-3 sm:gap-6">
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-emerald-400">
                {acceptedOffersCount}
              </p>
              <p className="text-xs sm:text-sm text-[#c2c6d3]">
                Offers Accepted
              </p>
            </div>
            <div className="text-center">
              <p className="text-xl sm:text-3xl font-bold text-amber-400">
                {pendingOffersCount}
              </p>
              <p className="text-xs sm:text-sm text-[#c2c6d3]">
                Offers Pending
              </p>
            </div>
            <div className="text-center">
              <p className="text-lg sm:text-3xl font-bold text-[#a9c7ff] truncate">
                {formatCurrency(totalCommission)}
              </p>
              <p className="text-xs sm:text-sm text-[#c2c6d3]">
                Total Commission
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
