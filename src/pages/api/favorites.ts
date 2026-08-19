import type { NextApiRequest, NextApiResponse } from "next";
import { generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return requireAuth(async (req, res, user) => {
      const { data: favorites } = await supabaseAdmin
        .from("favorites")
        .select("listing_id")
        .eq("user_id", user.id);

      const listingIds = (favorites || []).map(f => f.listing_id);
      if (listingIds.length === 0) {
        return res.status(200).json({ listings: [] });
      }

      const { data: listings } = await supabaseAdmin
        .from("listings")
        .select("*")
        .in("id", listingIds);

      res.status(200).json({ listings: (listings || []).map(supabaseToListing) });
    })(req, res);
  }

  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      const { listingId } = req.body;

      const { data: existing } = await supabaseAdmin
        .from("favorites")
        .select("*")
        .eq("user_id", user.id)
        .eq("listing_id", listingId)
        .single();

      if (existing) {
        await supabaseAdmin.from("favorites").delete().eq("id", existing.id);
        return res.status(200).json({ favorited: false });
      }

      await supabaseAdmin.from("favorites").insert({
        id: generateId(),
        user_id: user.id,
        listing_id: listingId,
        created_at: new Date().toISOString(),
      });

      res.status(201).json({ favorited: true });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}

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
    videoUrl: row.video_url || undefined,
    vaccinated: row.vaccinated,
    microchipped: row.microchipped,
    pedigree: row.pedigree,
    healthInfo: row.health_info || undefined,
    parentsInfo: row.parents_info || undefined,
    status: row.status,
    isBoosted: row.is_boosted,
    isPremium: row.is_premium || row.is_boosted,
    featured: row.is_featured,
    viewCount: row.view_count || 0,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}