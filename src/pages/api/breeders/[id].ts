import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid breeder ID" });
  }

  const { data: breeder } = await supabaseAdmin
    .from("breeder_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!breeder) {
    return res.status(404).json({ message: "Breeder not found" });
  }

  const { data: user } = await supabaseAdmin
    .from("profiles")
    .select("id, first_name, last_name, email, avatar_url")
    .eq("id", breeder.user_id)
    .single();

  const { data: listings } = await supabaseAdmin
    .from("listings")
    .select("*")
    .eq("breeder_id", id)
    .eq("status", "approved");

  const { data: reviews } = await supabaseAdmin
    .from("reviews")
    .select("*")
    .eq("breeder_id", id);

  res.status(200).json({
    breeder: {
      id: breeder.id,
      userId: breeder.user_id,
      kennelName: breeder.kennel_name,
      about: breeder.about,
      location: breeder.location,
      experienceYears: breeder.years_experience || 0,
      breeds: breeder.breeds || [],
      verified: breeder.verified,
      createdAt: breeder.created_at,
      updatedAt: breeder.updated_at,
    },
    user: user ? {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email,
      avatarUrl: user.avatar_url,
    } : null,
    listings: (listings || []).map(l => ({
      id: l.id,
      breederId: l.breeder_id,
      breederName: l.breeder_name,
      breederVerified: l.breeder_verified,
      title: l.title,
      animalType: l.animal_type,
      breed: l.breed,
      gender: l.gender,
      dateOfBirth: l.date_of_birth,
      price: l.price,
      location: l.location,
      description: l.description,
      photos: l.photos || [],
      vaccinated: l.vaccinated,
      microchipped: l.microchipped,
      pedigree: l.pedigree,
      status: l.status,
      isBoosted: l.is_boosted,
      createdAt: l.created_at,
      updatedAt: l.updated_at,
    })),
    reviews: reviews || [],
  });
}