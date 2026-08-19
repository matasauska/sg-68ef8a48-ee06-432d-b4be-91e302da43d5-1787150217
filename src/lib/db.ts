import { supabaseAdmin } from "@/integrations/supabase/server";
import { v4 as uuidv4 } from "uuid";

export function generateId(): string {
  return uuidv4();
}

export async function getDb() {
  const [
    { data: listings },
    { data: users },
    { data: conversations },
    { data: messages },
    { data: favorites },
    { data: breederProfiles },
    { data: reviews },
    { data: notifications },
    { data: payments },
    { data: animalTypes },
    { data: breeds },
    { data: supportTickets },
    { data: reports },
  ] = await Promise.all([
    supabaseAdmin.from("listings").select("*"),
    supabaseAdmin.from("profiles").select("*"),
    supabaseAdmin.from("conversations").select("*"),
    supabaseAdmin.from("messages").select("*"),
    supabaseAdmin.from("favorites").select("*"),
    supabaseAdmin.from("breeder_profiles").select("*"),
    supabaseAdmin.from("reviews").select("*"),
    supabaseAdmin.from("notifications").select("*"),
    supabaseAdmin.from("payments").select("*"),
    supabaseAdmin.from("animal_types").select("*"),
    supabaseAdmin.from("breeds").select("*"),
    supabaseAdmin.from("support_tickets").select("*"),
    supabaseAdmin.from("reports").select("*"),
  ]);

  const data = {
    listings: (listings || []).map(supabaseToListing),
    users: (users || []).map(supabaseToUser),
    conversations: conversations || [],
    messages: messages || [],
    favorites: favorites || [],
    breederProfiles: (breederProfiles || []).map(supabaseToBreederProfile),
    reviews: reviews || [],
    notifications: notifications || [],
    payments: payments || [],
    animalTypes: animalTypes || [],
    breeds: breeds || [],
    supportTickets: supportTickets || [],
    reports: reports || [],
  };

  const write = async () => {
    // The shim writes all data back to Supabase
    // For new records, we upsert everything. This is coarse but works for compatibility.
    if (data.listings.length > 0) {
      await supabaseAdmin.from("listings").upsert(data.listings.map(listingToSupabase));
    }
    if (data.users.length > 0) {
      await supabaseAdmin.from("profiles").upsert(data.users.map(userToSupabase));
    }
    if (data.conversations.length > 0) {
      await supabaseAdmin.from("conversations").upsert(data.conversations);
    }
    if (data.messages.length > 0) {
      await supabaseAdmin.from("messages").upsert(data.messages);
    }
    if (data.favorites.length > 0) {
      await supabaseAdmin.from("favorites").upsert(data.favorites);
    }
    if (data.breederProfiles.length > 0) {
      await supabaseAdmin.from("breeder_profiles").upsert(data.breederProfiles.map(breederProfileToSupabase));
    }
    if (data.reviews.length > 0) {
      await supabaseAdmin.from("reviews").upsert(data.reviews);
    }
    if (data.notifications.length > 0) {
      await supabaseAdmin.from("notifications").upsert(data.notifications);
    }
    if (data.payments.length > 0) {
      await supabaseAdmin.from("payments").upsert(data.payments);
    }
    if (data.animalTypes.length > 0) {
      await supabaseAdmin.from("animal_types").upsert(data.animalTypes);
    }
    if (data.breeds.length > 0) {
      await supabaseAdmin.from("breeds").upsert(data.breeds);
    }
    if (data.supportTickets.length > 0) {
      await supabaseAdmin.from("support_tickets").upsert(data.supportTickets);
    }
    if (data.reports.length > 0) {
      await supabaseAdmin.from("reports").upsert(data.reports);
    }
  };

  return { data, write };
}

// Type converters: Supabase snake_case -> App camelCase
function supabaseToListing(row: any) {
  return {
    id: row.id,
    breederId: row.breeder_id,
    breederName: row.breeder_name,
    breederVerified: row.breeder_verified,
    title: row.title,
    animalType: row.animal_type,
    breed: row.breed,
    gender: row.gender,
    dateOfBirth: row.date_of_birth,
    price: row.price,
    location: row.location,
    description: row.description,
    photos: row.photos || [],
    videoUrl: row.video_url,
    vaccinated: row.vaccinated,
    microchipped: row.microchipped,
    pedigree: row.pedigree,
    healthInfo: row.health_info,
    parentsInfo: row.parents_info,
    status: row.status,
    isBoosted: row.is_boosted,
    isPremium: row.is_premium || row.is_boosted,
    featured: row.is_featured,
    viewCount: row.view_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function listingToSupabase(l: any) {
  return {
    id: l.id,
    breeder_id: l.breederId,
    breeder_name: l.breederName,
    breeder_verified: l.breederVerified,
    title: l.title,
    animal_type: l.animalType,
    breed: l.breed,
    gender: l.gender,
    date_of_birth: l.dateOfBirth,
    price: l.price,
    location: l.location,
    description: l.description,
    photos: l.photos,
    video_url: l.videoUrl,
    vaccinated: l.vaccinated,
    microchipped: l.microchipped,
    pedigree: l.pedigree,
    health_info: l.healthInfo,
    parents_info: l.parentsInfo,
    status: l.status,
    is_boosted: l.isBoosted,
    is_premium: l.isPremium,
    is_featured: l.featured,
    view_count: l.viewCount,
    created_at: l.createdAt,
    updated_at: l.updatedAt,
  };
}

function supabaseToUser(row: any) {
  return {
    id: row.id,
    email: row.email,
    passwordHash: row.password_hash,
    firstName: row.first_name,
    lastName: row.last_name,
    fullName: row.full_name,
    role: row.role,
    breederVerified: row.breeder_verified,
    isAdmin: row.role === "admin",
    isSuspended: row.is_suspended,
    phone: row.phone,
    location: row.location,
    avatarUrl: row.avatar_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function userToSupabase(u: any) {
  return {
    id: u.id,
    email: u.email,
    password_hash: u.passwordHash,
    first_name: u.firstName,
    last_name: u.lastName,
    full_name: u.fullName || `${u.firstName} ${u.lastName}`,
    role: u.role,
    breeder_verified: u.breederVerified,
    is_suspended: u.isSuspended,
    phone: u.phone,
    location: u.location,
    avatar_url: u.avatarUrl,
    created_at: u.createdAt,
    updated_at: u.updatedAt,
  };
}

function supabaseToBreederProfile(row: any) {
  return {
    id: row.id,
    userId: row.user_id,
    kennelName: row.kennel_name,
    about: row.about,
    location: row.location,
    website: row.website,
    phone: row.phone,
    email: row.email,
    breeds: row.breeds || [],
    yearsExperience: row.years_experience,
    verified: row.verified,
    registrationNumber: row.registration_number,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function breederProfileToSupabase(bp: any) {
  return {
    id: bp.id,
    user_id: bp.userId,
    kennel_name: bp.kennelName,
    about: bp.about,
    location: bp.location,
    website: bp.website,
    phone: bp.phone,
    email: bp.email,
    breeds: bp.breeds,
    years_experience: bp.yearsExperience,
    verified: bp.verified,
    registration_number: bp.registrationNumber,
    created_at: bp.createdAt,
    updated_at: bp.updatedAt,
  };
}

export async function seedDemoData() {
  const { data: existing } = await supabaseAdmin.from("profiles").select("id").limit(1);
  if (existing && existing.length > 0) return;

  const now = new Date().toISOString();

  const breeder1Id = generateId();
  const breeder2Id = generateId();
  const buyerId = generateId();

  const users = [
    {
      id: breeder1Id,
      email: "breeder1@breedela.demo",
      full_name: "Maria Schneider",
      first_name: "Maria",
      last_name: "Schneider",
      role: "breeder",
      breeder_verified: true,
      is_verified_breeder: true,
      phone: "+49 89 12345678",
      location: "Munich, Germany",
      created_at: now,
      updated_at: now,
      is_suspended: false,
    },
    {
      id: breeder2Id,
      email: "breeder2@breedela.demo",
      full_name: "Jan Van Dijk",
      first_name: "Jan",
      last_name: "Van Dijk",
      role: "breeder",
      breeder_verified: true,
      is_verified_breeder: true,
      phone: "+31 20 87654321",
      location: "Amsterdam, Netherlands",
      created_at: now,
      updated_at: now,
      is_suspended: false,
    },
    {
      id: buyerId,
      email: "buyer@breedela.demo",
      full_name: "Emma Johnson",
      first_name: "Emma",
      last_name: "Johnson",
      role: "buyer",
      created_at: now,
      updated_at: now,
      is_suspended: false,
    },
  ];

  await supabaseAdmin.from("profiles").upsert(users);

  const listings = [
    {
      id: generateId(),
      breeder_id: breeder1Id,
      breeder_name: "Greenfield Retrievers",
      breeder_verified: true,
      title: "Max - Golden Retriever Puppy",
      animal_type: "dogs",
      breed: "Golden Retriever",
      gender: "Male",
      date_of_birth: "2026-04-15",
      price: 1800,
      location: "Munich, Germany",
      description: "Beautiful golden retriever puppy with champion bloodlines. Very playful and well-socialized.",
      photos: ["https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=800&h=600&fit=crop"],
      vaccinated: true,
      microchipped: true,
      pedigree: true,
      health_info: "Hip and elbow scores: Both parents HD-A, ED-0.",
      parents_info: "Sire: CH Greenfield's Golden Boy. Dam: Greenfield's Sunshine.",
      status: "approved",
      is_boosted: false,
      is_featured: false,
      view_count: 245,
      created_at: now,
      updated_at: now,
    },
    {
      id: generateId(),
      breeder_id: breeder1Id,
      breeder_name: "Greenfield Retrievers",
      breeder_verified: true,
      title: "Charlie - Labrador Retriever",
      animal_type: "dogs",
      breed: "Labrador Retriever",
      gender: "Male",
      date_of_birth: "2026-04-01",
      price: 1500,
      location: "Munich, Germany",
      description: "Chocolate Labrador with excellent retrieving instinct.",
      photos: ["https://images.unsplash.com/photo-1591769225440-811ad7d6eca6?w=800&h=600&fit=crop"],
      vaccinated: true,
      microchipped: true,
      pedigree: true,
      health_info: "All vaccinations up to date.",
      parents_info: "Both parents are working gundogs.",
      status: "approved",
      is_boosted: true,
      is_featured: false,
      view_count: 189,
      created_at: now,
      updated_at: now,
    },
    {
      id: generateId(),
      breeder_id: breeder2Id,
      breeder_name: "Royal Maine Coons",
      breeder_verified: true,
      title: "Luna - Silver Tabby Maine Coon",
      animal_type: "cats",
      breed: "Maine Coon",
      gender: "Female",
      date_of_birth: "2026-03-20",
      price: 1200,
      location: "Amsterdam, Netherlands",
      description: "Stunning silver tabby Maine Coon with excellent bone structure.",
      photos: ["https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=800&h=600&fit=crop"],
      vaccinated: true,
      microchipped: true,
      pedigree: true,
      health_info: "HCM and SMA negative.",
      parents_info: "Sire: CH Royal Nordic Thunder. Dam: Royal Bella.",
      status: "approved",
      is_boosted: true,
      is_featured: false,
      view_count: 312,
      created_at: now,
      updated_at: now,
    },
    {
      id: generateId(),
      breeder_id: breeder2Id,
      breeder_name: "Royal Maine Coons",
      breeder_verified: true,
      title: "Nala - British Shorthair",
      animal_type: "cats",
      breed: "British Shorthair",
      gender: "Female",
      date_of_birth: "2026-01-15",
      price: 950,
      location: "Amsterdam, Netherlands",
      description: "Blue British Shorthair with dense coat and round face.",
      photos: ["https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=800&h=600&fit=crop"],
      vaccinated: true,
      microchipped: true,
      pedigree: true,
      health_info: "PKD negative.",
      parents_info: "Imported lines from UK and Germany.",
      status: "approved",
      is_boosted: false,
      is_featured: false,
      view_count: 156,
      created_at: now,
      updated_at: now,
    },
  ];

  await supabaseAdmin.from("listings").upsert(listings);
}