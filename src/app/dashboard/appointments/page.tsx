"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Appointment {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  agent: string;
  status: "upcoming" | "completed" | "cancelled";
  property?: string;
}

export default function AppointmentsPage() {
  const { data: session } = useSession();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAppointments() {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch("/api/appointments");

        if (!response.ok) {
          throw new Error("Failed to fetch appointments");
        }

        const data = await response.json();
        setAppointments(data.data || []);
      } catch (error) {
        console.error("Error loading appointments:", error);
        setAppointments([]);
      } finally {
        setLoading(false);
      }
    }

    loadAppointments();
  }, [session]);

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

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 lg:mb-8">
        My Appointments
      </h1>

      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#a9c7ff]/30 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#c2c6d3] text-sm sm:text-base">
            Loading your appointments...
          </p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-[#c2c6d3] text-base sm:text-lg mb-4">
            No appointments scheduled
          </p>
          <p className="text-white/60 text-sm">
            Book a property viewing to get started!
          </p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6">
          {appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="bg-white/5 backdrop-blur-md rounded-xl border border-white/10 p-4 sm:p-6 hover:border-[#a9c7ff]/20 transition-all"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-3">
                <div className="flex-1">
                  <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
                    {appointment.title}
                  </h3>
                  <p className="text-[#c2c6d3] text-sm mb-1">
                    {appointment.location}
                  </p>
                  {appointment.property && (
                    <p className="text-[#a9c7ff] text-xs sm:text-sm">
                      {appointment.property}
                    </p>
                  )}
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold self-start ${getStatusColor(appointment.status)}`}
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm text-[#c2c6d3] mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-white">📅</span>
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white">🕐</span>
                  <span>{appointment.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-white">👤</span>
                  <span>{appointment.agent}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                <button className="px-3 sm:px-4 py-2 bg-[#a9c7ff]/10 text-[#a9c7ff] rounded-full hover:bg-[#a9c7ff]/20 transition-colors text-xs sm:text-sm">
                  View Details
                </button>
                {appointment.status === "upcoming" && (
                  <button className="px-3 sm:px-4 py-2 bg-red-500/10 text-red-400 rounded-full hover:bg-red-500/20 transition-colors text-xs sm:text-sm">
                    Cancel
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
