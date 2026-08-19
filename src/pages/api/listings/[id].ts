import type { NextApiRequest, NextApiResponse } from "next";
import { requireAuth } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid listing ID" });
  }

  if (req.method === "GET") {
    const { data: listing, error } = await supabaseAdmin
      .from("listings")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    return res.status(200).json({ listing: supabaseToListing(listing) });
  }

  if (req.method === "PATCH") {
    return requireAuth(async (req, res, user) => {
      const { data: existing } = await supabaseAdmin
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (!existing) return res.status(404).json({ message: "Listing not found" });
      if (user.role !== "admin" && existing.breeder_id !== user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const updateData: any = {};
      if (req.body.title !== undefined) updateData.title = req.body.title;
      if (req.body.description !== undefined) updateData.description = req.body.description;
      if (req.body.price !== undefined) updateData.price = req.body.price;
      if (req.body.location !== undefined) updateData.location = req.body.location;
      if (req.body.gender !== undefined) updateData.gender = req.body.gender;
      if (req.body.vaccinated !== undefined) updateData.vaccinated = req.body.vaccinated;
      if (req.body.microchipped !== undefined) updateData.microchipped = req.body.microchipped;
      if (req.body.pedigree !== undefined) updateData.pedigree = req.body.pedigree;
      if (req.body.healthInfo !== undefined) updateData.health_info = req.body.healthInfo;
      if (req.body.parentsInfo !== undefined) updateData.parents_info = req.body.parentsInfo;
      if (req.body.status !== undefined) updateData.status = req.body.status;
      updateData.updated_at = new Date().toISOString();

      const { error } = await supabaseAdmin.from("listings").update(updateData).eq("id", id);
      if (error) return res.status(500).json({ message: error.message });

      res.status(200).json({ message: "Listing updated" });
    })(req, res);
  }

  if (req.method === "DELETE") {
    return requireAuth(async (req, res, user) => {
      const { data: existing } = await supabaseAdmin
        .from("listings")
        .select("*")
        .eq("id", id)
        .single();

      if (!existing) return res.status(404).json({ message: "Listing not found" });
      if (user.role !== "admin" && existing.breeder_id !== user.id) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const { error } = await supabaseAdmin.from("listings").delete().eq("id", id);
      if (error) return res.status(500).json({ message: error.message });

      res.status(200).json({ message: "Listing deleted" });
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