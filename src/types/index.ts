import { Types } from "mongoose";

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  password?: string;
  name?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  role: "client" | "agent" | "admin";
  theme: "light" | "dark";
  is_demo: boolean;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IUserLean {
  _id: string;
  email: string;
  name?: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
  role: "client" | "agent" | "admin";
  theme: "light" | "dark";
  is_demo: boolean;
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IProperty {
  _id: Types.ObjectId;
  agent_id: string;
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  property_type:
    | "house"
    | "apartment"
    | "condo"
    | "townhouse"
    | "land"
    | "commercial"
    | "other";
  listing_type: "sale" | "rent";
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  year_built?: number;
  status: "active" | "pending" | "sold" | "rented" | "inactive";
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IPropertyLean {
  _id: string;
  agent_id: string;
  title: string;
  description?: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  property_type:
    | "house"
    | "apartment"
    | "condo"
    | "townhouse"
    | "land"
    | "commercial"
    | "other";
  listing_type: "sale" | "rent";
  bedrooms?: number;
  bathrooms?: number;
  area_sqft?: number;
  year_built?: number;
  status: "active" | "pending" | "sold" | "rented" | "inactive";
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IPropertyImage {
  _id: Types.ObjectId;
  property_id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
  created_at: Date;
}

export interface IPropertyImageLean {
  _id: string;
  id: string;
  property_id: string;
  url: string;
  is_primary: boolean;
  display_order: number;
  created_at: Date;
}

export interface IReview {
  _id: Types.ObjectId;
  author_id: string;
  target_type: "agent" | "property";
  target_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IReviewLean {
  _id: string;
  author_id: string;
  target_type: "agent" | "property";
  target_id: string;
  rating: number;
  comment?: string;
  created_at: Date;
  updated_at: Date;
}

export interface ITransaction {
  _id: Types.ObjectId;
  property_id: string;
  buyer_id: string;
  agent_id: string;
  offer_id?: string;
  sale_price: number;
  commission_rate: number;
  closing_date?: Date;
  status: "pending" | "in_escrow" | "closed" | "cancelled";
  created_at: Date;
  updated_at: Date;
}

export interface ITransactionLean {
  _id: string;
  property_id: string;
  buyer_id: string;
  agent_id: string;
  offer_id?: string;
  sale_price: number;
  commission_rate: number;
  closing_date?: Date;
  status: "pending" | "in_escrow" | "closed" | "cancelled";
  created_at: Date;
  updated_at: Date;
}

export interface IAppointment {
  _id: Types.ObjectId;
  property_id: string;
  client_id: string;
  agent_id: string;
  scheduled_at: Date;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IAppointmentLean {
  _id: string;
  property_id: string;
  client_id: string;
  agent_id: string;
  scheduled_at: Date;
  notes?: string;
  status: "pending" | "confirmed" | "cancelled" | "completed";
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IOffer {
  _id: Types.ObjectId;
  property_id: string;
  buyer_id: string;
  amount: number;
  message?: string;
  expiry_date: Date;
  status: "pending" | "accepted" | "rejected" | "countered" | "withdrawn";
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IOfferLean {
  _id: string;
  property_id: string;
  buyer_id: string;
  amount: number;
  message?: string;
  expiry_date: Date;
  status: "pending" | "accepted" | "rejected" | "countered" | "withdrawn";
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IInquiry {
  _id: Types.ObjectId;
  property_id: string;
  client_id: string;
  agent_id: string;
  message: string;
  contact_phone?: string;
  status: "new" | "read" | "responded" | "closed";
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IInquiryLean {
  _id: string;
  property_id: string;
  client_id: string;
  agent_id: string;
  message: string;
  contact_phone?: string;
  status: "new" | "read" | "responded" | "closed";
  deleted_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface IFavorite {
  _id: Types.ObjectId;
  user_id: string;
  property_id: string;
  created_at: Date;
}

export interface IFavoriteLean {
  _id: string;
  user_id: string;
  property_id: string;
  created_at: Date;
}

export interface IInquiryMessage {
  _id: Types.ObjectId;
  inquiry_id: string;
  sender_id: string;
  content: string;
  created_at: Date;
}

export interface IInquiryMessageLean {
  _id: string;
  inquiry_id: string;
  sender_id: string;
  content: string;
  created_at: Date;
}

export interface INotification {
  _id: Types.ObjectId;
  user_id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  related_id?: string;
  created_at: Date;
}

export interface INotificationLean {
  _id: string;
  user_id: string;
  type: string;
  title: string;
  body: string;
  is_read: boolean;
  related_id?: string;
  created_at: Date;
}
