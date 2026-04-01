import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { Property, User, Offer, Inquiry } from "@/lib/models";
import { connectDB } from "@/lib/mongodb";
import { IPropertyLean, IOfferLean, IInquiryLean } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const user = await User.findOne({
      email: session.user.email,
      deleted_at: null,
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.role !== "agent") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const properties = await Property.find({
      agent: user._id,
      deleted_at: null,
    }).lean<IPropertyLean[]>();

    const propertyIds = properties.map((p) => String(p._id));

    const offers = await Offer.find({
      property_id: { $in: propertyIds },
      deleted_at: null,
    }).lean<IOfferLean[]>();

    const inquiries = await Inquiry.find({
      property_id: { $in: propertyIds },
      deleted_at: null,
    }).lean<IInquiryLean[]>();

    const totalPortfolioValue = properties.reduce((sum, property) => {
      return sum + (property.price || 0);
    }, 0);

    const activeListings = properties.filter(
      (p) => p.status === "active",
    ).length;
    const completedDeals = properties.filter((p) => p.status === "sold").length;
    const pendingOffers = offers.filter((o) => o.status === "pending").length;

    const recentOffers = offers
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5)
      .map((offer) => ({
        id: String(offer._id),
        type: "offer",
        title: "Offer Received",
        property:
          properties.find((p) => String(p._id) === offer.property_id)?.title ||
          "Unknown Property",
        time: formatTimeAgo(offer.created_at),
        status: offer.status,
        amount: offer.amount,
      }));

    const recentInquiries = inquiries
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )
      .slice(0, 5)
      .map((inquiry) => ({
        id: String(inquiry._id),
        type: "inquiry",
        title: "Client Inquiry",
        property:
          properties.find((p) => String(p._id) === inquiry.property_id)
            ?.title || "Unknown Property",
        time: formatTimeAgo(inquiry.created_at),
        status: inquiry.status,
        message: inquiry.message,
      }));

    const recentActivities = [...recentOffers, ...recentInquiries]
      .sort((a, b) => {
        const timeA = getTimeAgoInMs(a.time);
        const timeB = getTimeAgoInMs(b.time);
        return timeA - timeB;
      })
      .slice(0, 6);

    const stats = [
      {
        id: 1,
        title: "Total Portfolio Value",
        value: formatCurrency(totalPortfolioValue),
        change: "+8.2%",
        icon: "MdAccountBalanceWallet",
        color: "text-blue-400",
      },
      {
        id: 2,
        title: "Active Listings",
        value: activeListings.toString(),
        change: "+3",
        icon: "MdHouse",
        color: "text-green-400",
      },
      {
        id: 3,
        title: "Completed Deals",
        value: completedDeals.toString(),
        change: "+12",
        icon: "MdAssignmentTurnedIn",
        color: "text-purple-400",
      },
      {
        id: 4,
        title: "Pending Offers",
        value: pendingOffers.toString(),
        change: "+5",
        icon: "MdLocalOffer",
        color: "text-yellow-400",
      },
    ];

    return NextResponse.json({
      stats,
      recentActivities,
      recentInquiries: recentInquiries.slice(0, 3),
    });
  } catch (error) {
    console.error("Error fetching agent dashboard data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// Helper functions
function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`;
  }
  return `$${amount.toFixed(0)}`;
}

function formatTimeAgo(date: Date | string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInMs = now.getTime() - past.getTime();

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
}

function getTimeAgoInMs(timeAgo: string): number {
  if (timeAgo.includes("minutes")) {
    const minutes = parseInt(timeAgo.match(/\d+/)?.[0] || "0");
    return minutes * 60 * 1000;
  } else if (timeAgo.includes("hours")) {
    const hours = parseInt(timeAgo.match(/\d+/)?.[0] || "0");
    return hours * 60 * 60 * 1000;
  } else if (timeAgo.includes("days")) {
    const days = parseInt(timeAgo.match(/\d+/)?.[0] || "0");
    return days * 24 * 60 * 60 * 1000;
  }
  return 0;
}
