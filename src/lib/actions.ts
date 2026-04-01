"use server";

import { connectDB } from "./mongodb";
import {
  Property,
  PropertyImage,
  User,
  Notification as NotificationModel,
} from "./models";

export async function getFeaturedProperties(limit: number = 3) {
  try {
    await connectDB();

    const properties = await Property.find({
      deleted_at: null,
      status: "active",
    })
      .sort({ created_at: -1 })
      .limit(limit)
      .lean();

    const propertyIds = properties.map((p) => String(p._id));

    const primaryImages = await PropertyImage.find({
      property_id: { $in: propertyIds },
      is_primary: true,
    }).lean();

    const imageByProperty = new Map();
    primaryImages.forEach((img) => {
      imageByProperty.set(img.property_id, img.url);
    });

    const agentIds = properties.map((p) => p.agent_id);
    const agents = await User.find({
      _id: { $in: agentIds },
      deleted_at: null,
    })
      .select("name email")
      .lean();

    const agentById = new Map();
    agents.forEach((agent) => {
      agentById.set(String(agent._id), {
        name: agent.name,
        email: agent.email,
      });
    });

    return properties.map((property) => ({
      id: String(property._id),
      title: property.title,
      price: property.price,
      address: property.address,
      city: property.city,
      state: property.state,
      bedrooms: property.bedrooms,
      bathrooms: property.bathrooms,
      area_sqft: property.area_sqft,
      property_type: property.property_type,
      image_url: imageByProperty.get(String(property._id)) || null,
      agent: agentById.get(property.agent_id) || {
        name: "Unknown Agent",
        email: "",
      },
    }));
  } catch (error) {
    console.error("Error fetching featured properties:", error);
    return [];
  }
}

const mockNotifications = [
  {
    id: "1",
    type: "inquiry_received",
    title: "New Inquiry Received",
    body: "A new inquiry has been received for Azure Pavilion property.",
    is_read: false,
    related_id: "property_1",
    created_at: new Date(),
  },
  {
    id: "2",
    type: "appointment_scheduled",
    title: "Viewing Confirmed",
    body: "Your request to view Coastal Pavilion has been confirmed for tomorrow at 10:00 AM PST.",
    is_read: false,
    related_id: "property_2",
    created_at: new Date(),
  },
];

export async function getProperties(filters?: {
  property_type?: string;
  min_price?: number;
  max_price?: number;
  city?: string;
  limit?: number;
  offset?: number;
}) {
  try {
    await connectDB();

    const query: any = { deleted_at: null };

    if (filters?.property_type) query.property_type = filters.property_type;
    if (filters?.city) query.city = new RegExp(`^${filters.city}$`, "i");
    if (filters?.min_price || filters?.max_price) {
      query.price = {};
      if (filters.min_price) query.price.$gte = filters.min_price;
      if (filters.max_price) query.price.$lte = filters.max_price;
    }

    const limit = filters?.limit || 12;
    const offset = filters?.offset || 0;

    const [properties, total] = await Promise.all([
      Property.find(query)
        .sort({ created_at: -1 })
        .skip(offset)
        .limit(limit)
        .lean(),
      Property.countDocuments(query),
    ]);

    return {
      properties: properties.map((p) => ({
        id: String(p._id),
        title: p.title,
        price: p.price,
        address: p.address,
        city: p.city,
        state: p.state,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        area_sqft: p.area_sqft,
        property_type: p.property_type,
      })),
      total,
      hasMore: offset + properties.length < total,
    };
  } catch (error) {
    console.error("Error fetching properties:", error);
    return { properties: [], total: 0, hasMore: false };
  }
}

export async function getNotifications(userId: string) {
  try {
    await connectDB();

    const notifications = await NotificationModel.find({
      user_id: userId,
      deleted_at: null,
    })
      .sort({ created_at: -1 })
      .lean();

    return notifications.map((n: any) => ({
      id: String(n._id),
      type: n.type,
      title: n.title,
      body: n.body,
      is_read: n.is_read,
      related_id: n.related_id,
      created_at: n.created_at,
    }));
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return [];
  }
}

export async function markNotificationAsRead(notificationId: string) {
  try {
    await connectDB();

    await NotificationModel.findByIdAndUpdate(notificationId, {
      is_read: true,
    });

    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark notification as read" };
  }
}
