import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";

function uuid() {
  return randomUUID();
}

function addIdJson(schema: Schema) {
  schema.set("toJSON", {
    virtuals: true,
    transform(_doc, ret: Record<string, unknown>) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
}

const userSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, select: false },
    name: String,
    phone: String,
    avatar_url: String,
    bio: String,
    role: {
      type: String,
      enum: ["client", "agent", "admin"],
      default: "client",
    },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    is_demo: { type: Boolean, default: false },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "users",
  },
);
addIdJson(userSchema);

const propertySchema = new Schema(
  {
    _id: { type: String, default: uuid },
    agent_id: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip_code: { type: String, default: "" },
    country: { type: String, default: "US" },
    property_type: {
      type: String,
      enum: [
        "house",
        "apartment",
        "condo",
        "townhouse",
        "land",
        "commercial",
        "other",
      ],
      required: true,
    },
    listing_type: { type: String, enum: ["sale", "rent"], required: true },
    bedrooms: Number,
    bathrooms: Number,
    area_sqft: Number,
    year_built: Number,
    status: {
      type: String,
      enum: ["active", "pending", "sold", "rented", "inactive"],
      default: "active",
    },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "properties",
  },
);
addIdJson(propertySchema);

const propertyImageSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    property_id: { type: String, required: true, index: true },
    url: { type: String, required: true },
    is_primary: { type: Boolean, default: false },
    display_order: { type: Number, default: 0 },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "property_images" },
);
addIdJson(propertyImageSchema);

const inquirySchema = new Schema(
  {
    _id: { type: String, default: uuid },
    property_id: { type: String, required: true },
    client_id: { type: String, required: true },
    agent_id: { type: String, required: true },
    message: { type: String, required: true },
    contact_phone: String,
    status: {
      type: String,
      enum: ["new", "read", "responded", "closed"],
      default: "new",
    },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "inquiries",
  },
);
addIdJson(inquirySchema);

const inquiryMessageSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    inquiry_id: { type: String, required: true, index: true },
    sender_id: { type: String, required: true },
    message: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "inquiry_messages" },
);
addIdJson(inquiryMessageSchema);

const favoriteSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    user_id: { type: String, required: true },
    property_id: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "favorites" },
);
favoriteSchema.index({ user_id: 1, property_id: 1 }, { unique: true });
addIdJson(favoriteSchema);

const reviewSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    author_id: { type: String, required: true },
    target_type: { type: String, enum: ["agent", "property"], required: true },
    target_id: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: String,
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "reviews",
  },
);
reviewSchema.index(
  { author_id: 1, target_type: 1, target_id: 1 },
  { unique: true },
);
addIdJson(reviewSchema);

const appointmentSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    property_id: { type: String, required: true },
    client_id: { type: String, required: true },
    agent_id: { type: String, required: true },
    scheduled_at: { type: Date, required: true },
    notes: String,
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "appointments",
  },
);
addIdJson(appointmentSchema);

const offerSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    property_id: { type: String, required: true },
    buyer_id: { type: String, required: true },
    amount: { type: Number, required: true },
    message: String,
    expiry_date: { type: Date, required: true },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "countered", "withdrawn"],
      default: "pending",
    },
    deleted_at: { type: Date, default: null },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "offers",
  },
);
addIdJson(offerSchema);

const transactionSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    property_id: { type: String, required: true },
    buyer_id: { type: String, required: true },
    agent_id: { type: String, required: true },
    offer_id: { type: String, unique: true, sparse: true },
    sale_price: { type: Number, required: true },
    commission_rate: { type: Number, required: true },
    closing_date: Date,
    status: {
      type: String,
      enum: ["pending", "in_escrow", "closed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
    collection: "transactions",
  },
);
addIdJson(transactionSchema);

const notificationSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    user_id: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: [
        "inquiry_received",
        "offer_received",
        "appointment_scheduled",
        "appointment_confirmed",
        "offer_accepted",
        "offer_rejected",
        "transaction_closed",
        "general",
      ],
      required: true,
    },
    title: { type: String, required: true },
    body: { type: String, required: true },
    is_read: { type: Boolean, default: false },
    related_id: String,
    created_at: { type: Date, default: Date.now },
  },
  { collection: "notifications" },
);
addIdJson(notificationSchema);

const aiChatLogSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    user_id: { type: String, required: true },
    user_message: { type: String, required: true },
    ai_response: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "ai_chat_logs" },
);
addIdJson(aiChatLogSchema);

const aiDescriptionLogSchema = new Schema(
  {
    _id: { type: String, default: uuid },
    user_id: { type: String, required: true },
    property_data: { type: Schema.Types.Mixed, required: true },
    generated_description: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
  },
  { collection: "ai_description_logs" },
);
addIdJson(aiDescriptionLogSchema);

export const User =
  mongoose.models.User || mongoose.model("User", userSchema);
export const Property =
  mongoose.models.Property || mongoose.model("Property", propertySchema);
export const PropertyImage =
  mongoose.models.PropertyImage ||
  mongoose.model("PropertyImage", propertyImageSchema);
export const Inquiry =
  mongoose.models.Inquiry || mongoose.model("Inquiry", inquirySchema);
export const InquiryMessage =
  mongoose.models.InquiryMessage ||
  mongoose.model("InquiryMessage", inquiryMessageSchema);
export const Favorite =
  mongoose.models.Favorite || mongoose.model("Favorite", favoriteSchema);
export const Review =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
export const Appointment =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
export const Offer =
  mongoose.models.Offer || mongoose.model("Offer", offerSchema);
export const TransactionModel =
  mongoose.models.Transaction ||
  mongoose.model("Transaction", transactionSchema);
export const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);
export const AiChatLog =
  mongoose.models.AiChatLog ||
  mongoose.model("AiChatLog", aiChatLogSchema);
export const AiDescriptionLog =
  mongoose.models.AiDescriptionLog ||
  mongoose.model("AiDescriptionLog", aiDescriptionLogSchema);
