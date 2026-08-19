import { supabaseAdmin } from "@/integrations/supabase/server";
import { v4 as uuidv4 } from "uuid";

export function generateId(): string {
  return uuidv4();
}

export async function seedDemoData() {
  // Check if data already exists
  const { data: existingUsers } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .limit(1);

  if (existingUsers && existingUsers.length > 0) return;

  const now = new Date().toISOString();

  // Create demo users in auth.users (we can't directly insert auth users, so we create profiles only)
  // In production, users would sign up via Supabase Auth
  // For demo, we'll create profiles that can be linked to auth users later

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