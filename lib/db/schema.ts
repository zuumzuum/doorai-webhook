export interface Tenant {
  id: string;
  name: string;
  domain?: string;
  settings: Record<string, any>;
  subscription_status: 'trial' | 'active' | 'past_due' | 'canceled';
  trial_ends_at?: string;
  stripe_customer_id?: string;
  stripe_subscription_id?: string;
  line_channel_access_token?: string;
  line_channel_secret?: string;
  openai_api_key?: string;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  tenant_id: string;
  user_id: string;
  message_type: 'text' | 'image' | 'sticker' | 'location' | 'other';
  user_message: string;
  bot_reply?: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface LineUser {
  id: string;
  tenant_id: string;
  line_user_id: string;
  display_name?: string;
  picture_url?: string;
  status_message?: string;
  is_blocked: boolean;
  first_interaction_at: string;
  last_interaction_at: string;
  created_at: string;
  updated_at: string;
}

export interface TenantUser {
  id: string;
  tenant_id: string;
  user_id: string;
  role: 'owner' | 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  tenant_id: string;
  email: string;
  full_name?: string;
  role: 'admin' | 'member';
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Property {
  id: string;
  tenant_id: string;
  title: string;
  description?: string;
  ai_description?: string;
  property_type?: string;
  rent_price?: number;
  deposit?: number;
  key_money?: number;
  maintenance_fee?: number;
  address?: string;
  station?: string;
  walking_minutes?: number;
  floor_plan?: string;
  area_sqm?: number;
  year_built?: number;
  structure?: string;
  facilities?: string[];
  equipment?: string[];
  images?: string[];
  status: 'available' | 'reserved' | 'rented' | 'maintenance';
  priority: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  tenant_id: string;
  line_user_id?: string;
  web_session_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  preferred_contact: 'line' | 'email' | 'phone';
  budget_min?: number;
  budget_max?: number;
  desired_area?: string;
  desired_floor_plan?: string;
  desired_features?: string[];
  move_in_date?: string;
  status: 'active' | 'inactive' | 'prospect' | 'converted';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  tenant_id: string;
  customer_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file' | 'location' | 'sticker';
  sender_type: 'customer' | 'ai' | 'human';
  channel: 'line' | 'web';
  line_message_id?: string;
  reply_token?: string;
  metadata: Record<string, any>;
  created_at: string;
}

export interface Booking {
  id: string;
  tenant_id: string;
  customer_id: string;
  property_id: string;
  booking_datetime: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';
  contact_method?: string;
  notes?: string;
  google_calendar_event_id?: string;
  created_at: string;
  updated_at: string;
}

export interface HotScore {
  id: string;
  tenant_id: string;
  customer_id: string;
  score: number;
  last_interaction_at?: string;
  factors: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface KpiDaily {
  tenant_id: string;
  date: string;
  new_inquiries_today: number;
  new_inquiries_week: number;
  new_inquiries_month: number;
  total_customers: number;
}

// Database response types for join queries
export interface CustomerWithHotScore extends Customer {
  hot_score?: HotScore;
}

export interface MessageWithCustomer extends Message {
  customer: Customer;
}

export interface BookingWithDetails extends Booking {
  customer: Customer;
  property: Property;
}

export interface PropertyWithBookings extends Property {
  bookings: Booking[];
  booking_count: number;
}

// Form input types
export interface CreatePropertyInput {
  title: string;
  description?: string;
  property_type?: string;
  rent_price?: number;
  deposit?: number;
  key_money?: number;
  maintenance_fee?: number;
  address?: string;
  station?: string;
  walking_minutes?: number;
  floor_plan?: string;
  area_sqm?: number;
  year_built?: number;
  structure?: string;
  facilities?: string[];
  equipment?: string[];
  images?: string[];
  priority?: number;
}

export interface CreateCustomerInput {
  line_user_id?: string;
  web_session_id?: string;
  name?: string;
  email?: string;
  phone?: string;
  preferred_contact?: 'line' | 'email' | 'phone';
  budget_min?: number;
  budget_max?: number;
  desired_area?: string;
  desired_floor_plan?: string;
  desired_features?: string[];
  move_in_date?: string;
  notes?: string;
}

export interface CreateBookingInput {
  customer_id: string;
  property_id: string;
  booking_datetime: string;
  contact_method?: string;
  notes?: string;
}

export interface CreateMessageInput {
  customer_id: string;
  content: string;
  message_type?: 'text' | 'image' | 'file' | 'location' | 'sticker';
  sender_type: 'customer' | 'ai' | 'human';
  channel: 'line' | 'web';
  line_message_id?: string;
  reply_token?: string;
  metadata?: Record<string, any>;
} 