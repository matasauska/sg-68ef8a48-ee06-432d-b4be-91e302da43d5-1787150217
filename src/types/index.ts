export type UserRole = "buyer" | "breeder" | "admin";

export interface User {
  id: string;
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  createdAt: string;
  updatedAt: string;
  isSuspended: boolean;
}

export interface BreederProfile {
  id: string;
  userId: string;
  kennelName: string;
  logoUrl?: string;
  location: string;
  about: string;
  experienceYears: number;
  breeds: string[];
  website?: string;
  verified: boolean;
  verificationRequested: boolean;
  verificationRequestedAt?: string;
  totalListings: number;
  createdAt: string;
  updatedAt: string;
}

export interface Listing {
  id: string;
  breederId: string;
  breederName: string;
  breederVerified: boolean;
  title: string;
  animalType: string;
  breed: string;
  gender: "Male" | "Female";
  dateOfBirth: string;
  price: number;
  location: string;
  description: string;
  photos: string[];
  videoUrl?: string;
  vaccinated: boolean;
  microchipped: boolean;
  pedigree: boolean;
  pedigreeDocs?: string[];
  healthInfo?: string;
  parentsInfo?: string;
  status: "pending" | "approved" | "rejected" | "sold";
  moderationNote?: string;
  isBoosted: boolean;
  isPremium: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  listingId: string;
  createdAt: string;
}

export interface Conversation {
  id: string;
  participantIds: string[];
  listingId?: string;
  listingTitle?: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  reviewerName: string;
  breederId: string;
  listingId?: string;
  rating: number;
  content: string;
  createdAt: string;
}

export interface Report {
  id: string;
  reporterId: string;
  reporterName: string;
  targetType: "listing" | "user" | "breeder";
  targetId: string;
  reason: string;
  details?: string;
  status: "open" | "reviewing" | "resolved" | "dismissed";
  createdAt: string;
}

export interface AnimalType {
  id: string;
  name: string;
  icon: string;
  sortOrder: number;
}

export interface Breed {
  id: string;
  animalTypeId: string;
  name: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "listing_approved" | "listing_rejected" | "message" | "verification" | "report" | "system";
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  features: string[];
  sortOrder: number;
}

export interface Payment {
  id: string;
  userId: string;
  type: "listing_boost" | "listing_premium" | "subscription";
  amount: number;
  status: "pending" | "completed" | "failed";
  description: string;
  createdAt: string;
}

export interface DatabaseSchema {
  users: User[];
  breederProfiles: BreederProfile[];
  listings: Listing[];
  favorites: Favorite[];
  conversations: Conversation[];
  messages: Message[];
  reviews: Review[];
  reports: Report[];
  animalTypes: AnimalType[];
  breeds: Breed[];
  notifications: Notification[];
  subscriptionPlans: SubscriptionPlan[];
  payments: Payment[];
}