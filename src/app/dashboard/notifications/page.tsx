"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  is_read: boolean;
  created_at: string;
  related_id?: string;
}

export default function NotificationsPage() {
  const { data: session } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadNotifications() {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch("/api/notifications");

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await response.json();

        const mappedNotifications = (data.data || []).map(
          (n: {
            id: string;
            title: string;
            body: string;
            type: string;
            is_read: boolean;
            created_at: string;
            related_id?: string;
          }) => ({
            id: n.id,
            title: n.title,
            message: n.body,
            type:
              (n.type as "info" | "success" | "warning" | "error") || "info",
            is_read: n.is_read,
            created_at: n.created_at,
            related_id: n.related_id,
          }),
        );
        setNotifications(mappedNotifications);
      } catch (error) {
        console.error("Error loading notifications:", error);
        setNotifications([]);
      } finally {
        setLoading(false);
      }
    }

    loadNotifications();
  }, [session]);

  const getTypeColor = (type: string) => {
    switch (type) {
      case "info":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "success":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "warning":
        return "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30";
      case "error":
        return "bg-red-500/20 text-red-400 border border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border border-gray-500/30";
    }
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification,
      ),
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " at " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] p-4 sm:p-6 lg:p-8 overflow-x-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
          Notifications
        </h1>
        {unreadCount > 0 && (
          <span className="bg-[#a9c7ff]/20 text-[#a9c7ff] px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
            {unreadCount} unread
          </span>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8 sm:py-12">
          <div className="inline-block w-6 h-6 sm:w-8 sm:h-8 border-2 border-[#a9c7ff]/30 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-[#c2c6d3] text-sm sm:text-base">
            Loading your notifications...
          </p>
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <p className="text-[#c2c6d3] text-base sm:text-lg mb-4">
            No notifications
          </p>
          <p className="text-white/60 text-sm">You're all caught up!</p>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`bg-white/5 backdrop-blur-md rounded-xl border p-4 sm:p-6 hover:border-[#a9c7ff]/20 transition-all ${
                !notification.is_read
                  ? "border-[#a9c7ff]/30 bg-[#a9c7ff]/5"
                  : "border-white/10"
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-3 gap-3">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-2">
                    <h3
                      className={`text-base sm:text-lg font-semibold ${!notification.is_read ? "text-white" : "text-[#c2c6d3]"}`}
                    >
                      {notification.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getTypeColor(notification.type)}`}
                    >
                      {notification.type.charAt(0).toUpperCase() +
                        notification.type.slice(1)}
                    </span>
                    {!notification.is_read && (
                      <span className="w-2 h-2 bg-[#a9c7ff] rounded-full"></span>
                    )}
                  </div>
                  <p className="text-[#c2c6d3] text-sm mb-2">
                    {notification.message}
                  </p>
                  <p className="text-xs text-white/40">
                    {formatDate(notification.created_at)}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 sm:gap-3">
                {!notification.is_read && (
                  <button
                    onClick={() => markAsRead(notification.id)}
                    className="px-3 py-1.5 bg-[#a9c7ff]/10 text-[#a9c7ff] rounded-full hover:bg-[#a9c7ff]/20 transition-colors text-xs sm:text-sm"
                  >
                    Mark as Read
                  </button>
                )}
                <button className="px-3 py-1.5 bg-white/10 text-white rounded-full hover:bg-white/20 transition-colors text-xs sm:text-sm">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
