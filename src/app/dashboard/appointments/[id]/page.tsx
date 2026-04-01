"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  agent: string;
  status: "upcoming" | "completed" | "cancelled";
  property?: string;
  notes?: string;
}

export default function AppointmentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setAppointment({
        id: params.id as string,
        title: "Property Viewing - Downtown Loft",
        date: "2024-03-30",
        time: "2:00 PM",
        location: "123 Main Street, New York, NY",
        agent: "Sarah Johnson",
        status: "upcoming",
        property: "Modern Downtown Loft",
        notes:
          "Client is interested in the modern amenities and city views. Parking space availability is a key concern.",
      });
      setLoading(false);
    }, 1000);
  }, [params.id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "completed":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-8">
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-2 border-[#a9c7ff]/30 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#c2c6d3]">Loading appointment details...</p>
        </div>
      </div>
    );
  }

  if (!appointment) {
    return (
      <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-8">
        <div className="text-center py-12">
          <p className="text-[#c2c6d3] text-lg mb-4">Appointment not found</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-[#a9c7ff]/10 text-[#a9c7ff] rounded-full hover:bg-[#a9c7ff]/20 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 sm:mb-8">
          <button
            onClick={() => router.back()}
            className="mb-3 sm:mb-4 text-[#a9c7ff] hover:underline flex items-center gap-2 text-sm"
          >
            ← Back to Appointments
          </button>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
            {appointment.title}
          </h1>
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(appointment.status)}`}
            >
              {appointment.status.charAt(0).toUpperCase() +
                appointment.status.slice(1)}
            </span>
            <span className="text-[#c2c6d3] text-xs sm:text-sm">
              ID: {appointment.id}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {appointment.property && (
              <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                  Property Information
                </h2>
                <div className="bg-[#a9c7ff]/10 border border-[#a9c7ff]/20 rounded-lg p-3 sm:p-4">
                  <p className="text-base sm:text-lg font-semibold text-[#a9c7ff] mb-2">
                    {appointment.property}
                  </p>
                  <p className="text-[#c2c6d3] text-sm">
                    {appointment.location}
                  </p>
                </div>
              </div>
            )}

            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Appointment Details
              </h2>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-white text-lg">📅</span>
                  <div>
                    <p className="text-[#c2c6d3] text-xs sm:text-sm">Date</p>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {appointment.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-white text-lg">🕐</span>
                  <div>
                    <p className="text-[#c2c6d3] text-xs sm:text-sm">Time</p>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {appointment.time}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-white text-lg">📍</span>
                  <div>
                    <p className="text-[#c2c6d3] text-xs sm:text-sm">
                      Location
                    </p>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {appointment.location}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 sm:gap-4">
                  <span className="text-white text-lg">👤</span>
                  <div>
                    <p className="text-[#c2c6d3] text-xs sm:text-sm">Agent</p>
                    <p className="text-white font-medium text-sm sm:text-base">
                      {appointment.agent}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {appointment.notes && (
              <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6">
                <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                  Notes
                </h2>
                <p className="text-[#c2c6d3] text-sm sm:text-base">
                  {appointment.notes}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Actions
              </h2>
              <div className="space-y-2 sm:space-y-3">
                {appointment.status === "upcoming" && (
                  <>
                    <button className="w-full px-3 sm:px-4 py-2 bg-green-500/10 text-green-400 rounded-full hover:bg-green-500/20 transition-colors text-xs sm:text-sm">
                      Confirm Attendance
                    </button>
                    <button className="w-full px-3 sm:px-4 py-2 bg-yellow-500/10 text-yellow-400 rounded-full hover:bg-yellow-500/20 transition-colors text-xs sm:text-sm">
                      Reschedule
                    </button>
                    <button className="w-full px-3 sm:px-4 py-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors text-xs sm:text-sm">
                      Cancel Appointment
                    </button>
                  </>
                )}
                {appointment.status === "completed" && (
                  <button className="w-full px-3 sm:px-4 py-2 bg-[#a9c7ff]/10 text-[#a9c7ff] rounded-full hover:bg-[#a9c7ff]/20 transition-colors text-xs sm:text-sm">
                    Leave Review
                  </button>
                )}
                <button className="w-full px-3 sm:px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors text-xs sm:text-sm">
                  Contact Agent
                </button>
                <button className="w-full px-3 sm:px-4 py-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors text-xs sm:text-sm">
                  Add to Calendar
                </button>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-3 sm:mb-4">
                Agent Contact
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <p className="text-white font-medium text-sm sm:text-base">
                  {appointment.agent}
                </p>
                <p className="text-[#c2c6d3] text-xs sm:text-sm">
                  📧 sarah.johnson@azureestates.com
                </p>
                <p className="text-[#c2c6d3] text-xs sm:text-sm">
                  📱 (555) 123-4567
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
