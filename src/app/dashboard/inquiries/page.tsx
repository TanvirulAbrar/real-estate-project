"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Inquiry {
  id: string;
  property: string;
  agent: string;
  subject: string;
  message: string;
  status: "pending" | "responded" | "closed";
  createdAt: string;
  lastResponse?: string;
}

export default function InquiriesPage() {
  const { data: session } = useSession();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadInquiries() {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch("/api/inquiries");

        if (!response.ok) {
          throw new Error("Failed to fetch inquiries");
        }

        const data = await response.json();

        const mappedInquiries = (data.data || []).map(
          (i: {
            id: string;
            property?: { title: string };
            agent?: { name: string };
            subject: string;
            message: string;
            status: string;
            created_at: string;
            last_response?: string;
          }) => ({
            id: i.id,
            property: i.property?.title || "Unknown Property",
            agent: i.agent?.name || "Unknown Agent",
            subject: i.subject,
            message: i.message,
            status: i.status as "pending" | "responded" | "closed",
            createdAt: i.created_at,
            lastResponse: i.last_response,
          }),
        );
        setInquiries(mappedInquiries);
      } catch (error) {
        console.error("Error loading inquiries:", error);
        setInquiries([]);
      } finally {
        setLoading(false);
      }
    }

    loadInquiries();
  }, [session]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "responded":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "closed":
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
        My Inquiries
      </h1>

      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#a9c7ff]/30 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#c2c6d3] text-sm sm:text-base">
            Loading your inquiries...
          </p>
        </div>
      ) : inquiries.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-[#c2c6d3] text-base sm:text-lg mb-4">
            No inquiries yet
          </p>
          <p className="text-white/60 text-sm">
            Start a conversation with agents about properties you're interested
            in!
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {inquiries.map((inquiry) => (
            <div
              key={inquiry.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6 hover:border-[#a9c7ff]/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                    <h3 className="text-lg sm:text-xl font-bold text-white">
                      {inquiry.subject}
                    </h3>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${getStatusColor(inquiry.status)}`}
                    >
                      {inquiry.status.charAt(0).toUpperCase() +
                        inquiry.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-[#a9c7ff] text-sm mb-2">
                    {inquiry.property}
                  </p>
                  <p className="text-[#c2c6d3] text-sm mb-3">
                    {inquiry.message}
                  </p>
                  {inquiry.lastResponse && (
                    <div className="bg-[#a9c7ff]/10 border border-[#a9c7ff]/20 rounded-lg p-3 sm:p-4 mb-3">
                      <p className="text-xs sm:text-sm text-white/60 mb-1">
                        Agent Response:
                      </p>
                      <p className="text-[#a9c7ff] text-sm">
                        {inquiry.lastResponse}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#c2c6d3]">
                  <div className="flex items-center gap-2">
                    <span className="text-white">👤</span>
                    <span>{inquiry.agent}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-white">📅</span>
                    <span>
                      {new Date(inquiry.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 sm:gap-3">
                  <button className="px-3 sm:px-4 py-2 bg-[#a9c7ff]/10 text-[#a9c7ff] rounded-full hover:bg-[#a9c7ff]/20 transition-colors text-xs sm:text-sm">
                    View Conversation
                  </button>
                  {inquiry.status === "responded" && (
                    <button className="px-3 sm:px-4 py-2 bg-green-500/10 text-green-400 rounded-full hover:bg-green-500/20 transition-colors text-xs sm:text-sm">
                      Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
