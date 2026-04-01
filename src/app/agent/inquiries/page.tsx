"use client";

import { useState, useEffect } from "react";
import {
  MdChatBubble,
  MdDashboard,
  MdDomain,
  MdCalendarToday,
  MdPayments,
  MdAdd,
  MdSettings,
  MdContactSupport,
  MdSearch,
  MdStar,
  MdPerson,
  MdEmail,
  MdPhone,
  MdSchedule,
  MdArrowForward,
} from "react-icons/md";

interface Inquiry {
  id: string;
  property_id: string;
  client_id: string;
  agent_id: string;
  message: string;
  contact_phone?: string;
  status: string;
  created_at: string;
  updated_at: string;
  property?: {
    title: string;
    city: string;
    state: string;
  };
  client?: {
    name: string;
    email: string;
  };
}

export default function AgentInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await fetch("/api/inquiries");
        if (response.ok) {
          const data = await response.json();
          setInquiries(data);
        } else {
          setError("Failed to fetch inquiries");
        }
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        setError("Error loading inquiries");
      } finally {
        setLoading(false);
      }
    };

    fetchInquiries();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "hot":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      case "new":
        return "text-emerald-400 bg-emerald-400/10 border-emerald-400/20";
      case "follow-up":
        return "text-amber-400 bg-amber-400/10 border-amber-400/20";
      case "scheduled":
        return "text-blue-400 bg-blue-400/10 border-blue-400/20";
      case "closed":
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-400";
      case "medium":
        return "text-amber-400";
      case "low":
        return "text-emerald-400";
      default:
        return "text-gray-400";
    }
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

  const hotLeads = inquiries.filter((inq) => inq.status === "hot").length;
  const newInquiries = inquiries.filter((inq) => inq.status === "new").length;
  const scheduledTours = inquiries.filter(
    (inq) => inq.status === "scheduled",
  ).length;

  if (loading) {
    return (
      <div className="flex-1 flex flex-col min-w-0 items-center justify-center">
        <div className="text-white">Loading inquiries...</div>
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

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
      <header className="sticky top-0 z-50 flex justify-between items-center px-4 sm:px-6 lg:px-8 w-full border-b border-[#122a4c]/20 bg-[#00132e]/60 backdrop-blur-xl h-16 sm:h-20">
        <div className="flex items-center gap-4 sm:gap-8 flex-1">
          <span className="hidden md:block text-lg sm:text-xl font-inter text-white tracking-tighter">
            AESTHETE
          </span>
          <div className="relative w-full max-w-md focus-within:ring-1 focus-within:ring-[#a9c7ff]/30 transition-all rounded-full overflow-hidden">
            <MdSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-[#a9c7ff]/50 text-lg" />
            <input
              className="w-full bg-[#191c21]/50 border-none pl-9 sm:pl-12 pr-3 sm:pr-4 py-2 sm:py-2.5 text-xs sm:text-sm rounded-full text-[#a9c7ff] placeholder-[#a9c7ff]/30 focus:ring-0"
              placeholder="Search inquiries..."
              type="text"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-6 ml-2 sm:ml-4">
          <button className="relative text-[#a9c5ff] hover:text-white transition-colors p-1">
            <MdChatBubble size={18} />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#a9c7ff] rounded-full"></span>
          </button>
          <button className="text-[#a9c5ff] hover:text-white transition-colors p-1 hidden sm:block">
            <MdSettings size={18} />
          </button>
        </div>
      </header>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-x-hidden">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-4xl font-inter text-white mb-1 sm:mb-2">
            Client Inquiries
          </h1>
          <p className="text-[#c2c6d3] text-sm sm:text-base mb-4 sm:mb-6">
            Manage and respond to potential buyer inquiries
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
                <p className="text-xs sm:text-sm text-[#c2c6d3]">Hot Leads</p>
                <MdStar className="text-red-400" size={14} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white">
                {hotLeads}
              </p>
              <p className="text-[10px] sm:text-xs text-red-400 mt-1">
                Immediate attention
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
                  New Inquiries
                </p>
                <MdChatBubble className="text-emerald-400" size={14} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white">
                {newInquiries}
              </p>
              <p className="text-[10px] sm:text-xs text-emerald-400 mt-1">
                Awaiting response
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
                  Scheduled Tours
                </p>
                <MdCalendarToday className="text-blue-400" size={14} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white">
                {scheduledTours}
              </p>
              <p className="text-[10px] sm:text-xs text-blue-400 mt-1">
                This week
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
                  Total Inquiries
                </p>
                <MdPerson className="text-[#a9c7ff]" size={14} />
              </div>
              <p className="text-xl sm:text-3xl font-bold text-white">
                {inquiries.length}
              </p>
              <p className="text-[10px] sm:text-xs text-[#a9c7ff] mt-1">
                All time
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="p-4 sm:p-6 rounded-xl sm:rounded-2xl border border-white/5 hover:transform hover:scale-[1.01] transition-all duration-300"
              style={{
                background: "rgba(25, 28, 33, 0.4)",
                backdropFilter: "blur(24px)",
              }}
            >
              <div className="flex flex-col gap-4">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-3">
                    <h3 className="text-base sm:text-xl font-bold text-white">
                      {inquiry.client?.name || "Unknown Client"}
                    </h3>
                    <span
                      className={`px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold border w-fit ${getStatusColor(inquiry.status)}`}
                    >
                      {inquiry.status.charAt(0).toUpperCase() +
                        inquiry.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-6 text-xs sm:text-sm text-[#c2c6d3] mb-3">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MdEmail size={12} />
                      <span className="truncate max-w-[150px] sm:max-w-none">
                        {inquiry.client?.email || "No email"}
                      </span>
                    </div>
                    {inquiry.contact_phone && (
                      <div className="flex items-center gap-1 sm:gap-2">
                        <MdPhone size={12} />
                        <span>{inquiry.contact_phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1 sm:gap-2">
                      <MdSchedule size={12} />
                      <span>{formatTimeAgo(inquiry.created_at)}</span>
                    </div>
                  </div>

                  <div className="mb-2 sm:mb-3">
                    <p className="text-xs sm:text-sm text-[#c2c6d3] mb-1">
                      <span className="font-medium">Property:</span>{" "}
                      {inquiry.property?.title || "Unknown Property"}
                    </p>
                  </div>

                  <div className="mb-3 sm:mb-4">
                    <p className="text-white text-xs sm:text-sm leading-relaxed line-clamp-2">
                      {inquiry.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#a9c7ff] text-[#003063] font-bold text-xs sm:text-sm rounded-full hover:bg-white transition-colors flex items-center gap-1 sm:gap-2">
                    <MdChatBubble size={14} />
                    Reply
                  </button>
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-emerald-500/20 text-emerald-400 font-bold text-xs sm:text-sm rounded-full hover:bg-emerald-500/30 transition-colors flex items-center gap-1 sm:gap-2">
                    <MdCalendarToday size={14} />
                    Schedule
                  </button>
                  <button className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs sm:text-sm font-bold hover:bg-white/10 transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 flex justify-center">
          <button className="px-4 sm:px-6 py-1.5 sm:py-2 bg-white/5 border border-white/10 text-white font-bold text-xs sm:text-sm rounded-full hover:bg-white/10 transition-colors">
            Load More Inquiries
          </button>
        </div>
      </main>
    </div>
  );
}
