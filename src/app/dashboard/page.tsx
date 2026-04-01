"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  MdBookmark,
  MdLocalOffer,
  MdTrendingUp,
  MdNotifications,
  MdSearch,
  MdAccountCircle,
} from "react-icons/md";
import { getFeaturedProperties, getNotifications } from "@/lib/actions";

interface Property {
  id: string;
  title: any;
  price: any;
  address: any;
  city: any;
  state: any;
  bedrooms: any;
  bathrooms: any;
  area_sqft: any;
  property_type: any;
  images?: { id: string; url: string; is_primary?: boolean }[];
  agent: any;
  status?: string;
}

interface Notification {
  id: string;
  type: any;
  title: any;
  body: any;
  is_read: any;
  related_id: any;
  created_at: any;
}

export default function ClientDashboardOverview() {
  const { data: session } = useSession();
  const [stats, setStats] = useState([
    {
      label: "Saved Favorites",
      value: 0,
      icon: MdBookmark,
      color: "text-blue-400",
    },
    {
      label: "Active Offers",
      value: 0,
      icon: MdLocalOffer,
      color: "text-green-400",
    },
    {
      label: "Market Alerts",
      value: 0,
      icon: MdTrendingUp,
      color: "text-yellow-400",
    },
  ]);
  const [recommendedProperties, setRecommendedProperties] = useState<
    Property[]
  >([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    async function loadData() {
      if (!session?.user?.id) return;

      try {
        const properties = await getFeaturedProperties(3);
        setRecommendedProperties(properties);

        const userNotifications = await getNotifications(session.user.id);
        setNotifications(userNotifications);

        const [favoritesRes, offersRes] = await Promise.all([
          fetch("/api/favorites"),
          fetch("/api/offers"),
        ]);

        const favoritesData = favoritesRes.ok
          ? await favoritesRes.json()
          : { data: [] };
        const offersData = offersRes.ok ? await offersRes.json() : { data: [] };

        const favoritesCount = favoritesData.data?.length || 0;
        const activeOffersCount =
          offersData.data?.filter(
            (o: { status: string }) => o.status === "pending",
          ).length || 0;

        setStats([
          {
            label: "Saved Favorites",
            value: favoritesCount,
            icon: MdBookmark,
            color: "text-blue-400",
          },
          {
            label: "Active Offers",
            value: activeOffersCount,
            icon: MdLocalOffer,
            color: "text-green-400",
          },
          {
            label: "Market Alerts",
            value: userNotifications.filter((n) => !n.is_read).length,
            icon: MdTrendingUp,
            color: "text-yellow-400",
          },
        ]);
      } catch (error) {
        console.error("Error loading dashboard data:", error);
      }
    }

    loadData();
  }, [session]);

  return (
    <div className="min-h-screen bg-[#00132e] text-[#e1e2e9] overflow-x-hidden">
      <header className="flex justify-between items-center w-full pl-4 sm:pl-6 lg:pl-80 pr-4 sm:pr-6 lg:pr-12 py-4 sm:py-6 lg:py-8 fixed top-0 z-40 bg-[#00132e]/80 backdrop-blur-md border-b border-white/5 lg:bg-transparent lg:border-none">
        <div></div>
        <div className="flex items-center gap-2 sm:gap-4 lg:gap-8">
          <div className="relative group hidden sm:block">
            <MdSearch className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-[#b2c7ff] w-4 h-4 lg:w-5 lg:h-5" />
            <input
              className="bg-white/5 border-none rounded-full pl-9 lg:pl-12 pr-4 py-1.5 lg:py-2 text-sm text-white focus:ring-1 focus:ring-[#b2c7ff] w-40 lg:w-64 transition-all placeholder-white/40"
              placeholder="Search Estates..."
              type="text"
            />
          </div>
          <button className="relative text-[#b2c7ff] hover:text-white transition-colors p-2">
            <MdNotifications className="w-5 h-5 lg:w-6 lg:h-6" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-[#a9c7ff] rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 lg:gap-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-white/20 bg-[#a9c7ff]/20 flex items-center justify-center">
              <MdAccountCircle className="w-5 h-5 lg:w-6 lg:h-6 text-[#a9c7ff]" />
            </div>
          </div>
        </div>
      </header>

      <main className="pl-4 sm:pl-6 lg:pl-80 pr-4 sm:pr-6 lg:pr-12 pt-20 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 space-y-8 sm:space-y-12 lg:space-y-16">
        <section className="max-w-7xl">
          <h2 className="font-headline text-3xl sm:text-5xl lg:text-7xl font-inter tracking-tighter text-white mb-2">
            Welcome back, {session?.user?.name?.split(" ")[0] || "User"}.
          </h2>
          <p className="font-body text-base sm:text-lg lg:text-xl text-[#c2c6d3] max-w-2xl">
            Manage your saved properties and track your offers. Discover new
            opportunities tailored to your preferences.
          </p>
        </section>

        <section className="max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass-card p-4 sm:p-6 lg:p-8 flex flex-col justify-between h-32 sm:h-40 lg:h-48 group hover:border-[#a9c7ff]/20 transition-all"
              >
                <div className="flex items-center gap-3 sm:gap-4">
                  <stat.icon
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 ${stat.color}`}
                  />
                  <div>
                    <h3 className="font-label text-[10px] sm:text-xs tracking-widest text-slate-500 uppercase">
                      {stat.label}
                    </h3>
                    <p className="font-headline text-2xl sm:text-3xl lg:text-4xl font-bold text-white mt-1">
                      {stat.value}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-6 lg:mb-8 gap-3">
            <h3 className="font-inter text-xl sm:text-2xl lg:text-3xl font-bold text-white tracking-tight">
              Recommended for You
            </h3>
            <button className="text-[#a9c7ff] text-xs sm:text-sm font-semibold hover:underline">
              View All Selection
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {recommendedProperties.map((property) => (
              <div
                key={property.id}
                className="group relative overflow-hidden rounded-2xl sm:rounded-[32px] aspect-[4/5]"
              >
                <img
                  alt={property.title}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  src={
                    property.images?.[0]?.url ||
                    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23191c21'/%3E%3Ctext x='200' y='250' font-size='14' fill='%23a9c7ff' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E"
                  }
                  onError={(e) => {
                    (e.target as HTMLImageElement).src =
                      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='500' viewBox='0 0 400 500'%3E%3Crect width='400' height='500' fill='%23191c21'/%3E%3Ctext x='200' y='250' font-size='14' fill='%23a9c7ff' text-anchor='middle' dy='.3em'%3ENo Image%3C/text%3E%3C/svg%3E";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#000e25] via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-0 left-0 p-4 sm:p-6 lg:p-8 w-full">
                  <span className="bg-white/10 backdrop-blur-md px-2 sm:px-3 py-1 rounded-full text-[8px] sm:text-[10px] uppercase tracking-widest text-white mb-2 sm:mb-4 inline-block">
                    {property.status === "active"
                      ? "Active"
                      : property.status === "sold"
                        ? "Sold"
                        : property.status === "pending"
                          ? "Pending"
                          : "Exclusive"}
                  </span>
                  <h3 className="font-inter text-base sm:text-lg lg:text-xl font-bold text-white mb-1 sm:mb-2 line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-[#c2c6d3] text-xs sm:text-sm mb-2 sm:mb-4 line-clamp-1">
                    {property.address}, {property.city}, {property.state}
                  </p>
                  <div className="flex gap-2 sm:gap-4 text-xs sm:text-sm text-[#c2c6d3]">
                    <span>{property.bedrooms} bd</span>
                    <span>{property.bathrooms} ba</span>
                    <span>
                      {property.area_sqft?.toLocaleString() || 0} sqft
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
