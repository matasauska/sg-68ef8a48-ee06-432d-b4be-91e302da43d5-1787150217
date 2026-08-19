import type { NextApiRequest, NextApiResponse } from "next";
import { generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";
import type { Listing } from "@/types";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(3),
  animalType: z.string(),
  breed: z.string(),
  gender: z.enum(["Male", "Female"]),
  dateOfBirth: z.string(),
  price: z.number().min(0),
  location: z.string(),
  description: z.string().min(10),
  photos: z.array(z.string()).min(1),
  videoUrl: z.string().optional(),
  vaccinated: z.boolean(),
  microchipped: z.boolean(),
  pedigree: z.boolean(),
  healthInfo: z.string().optional(),
  parentsInfo: z.string().optional(),
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { type, breed, gender, minPrice, maxPrice, location, verified, sort } = req.query;

    let query = supabaseAdmin.from("listings").select("*").eq("status", "approved");

    if (type && type !== "all") {
      query = query.eq("animal_type", type as string);
    }
    if (breed && breed !== "all") {
      query = query.eq("breed", breed as string);
    }
    if (gender && gender !== "all") {
      query = query.eq("gender", gender as string);
    }
    if (minPrice) {
      query = query.gte("price", Number(minPrice));
    }
    if (maxPrice) {
      query = query.lte("price", Number(maxPrice));
    }
    if (location) {
      query = query.ilike("location", `%${location}%`);
    }
    if (verified === "true") {
      query = query.eq("breeder_verified", true);
    }

    const { data: listings, error } = await query;
    if (error) return res.status(500).json({ message: error.message });

    const results = (listings || []).map(supabaseToListing);

    if (sort === "newest") {
      results.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === "price_asc") {
      results.sort((a, b) => a.price - b.price);
    } else if (sort === "price_desc") {
      results.sort((a, b) => b.price - a.price);
    } else {
      results.sort((a, b) => {
        if (a.isPremium !== b.isPremium) return b.isPremium ? 1 : -1;
        if (a.isBoosted !== b.isBoosted) return b.isBoosted ? 1 : -1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    }

    return res.status(200).json({ listings: results });
  }

  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      if (user.role !== "breeder" && user.role !== "admin") {
        return res.status(403).json({ message: "Only breeders can create listings" });
      }

      const data = createSchema.parse(req.body);

      const { data: breederProfile } = await supabaseAdmin
        .from("breeder_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      const breederName = breederProfile?.kennel_name || `${user.firstName} ${user.lastName}`;
      const breederVerified = breederProfile?.verified || false;

      const now = new Date().toISOString();
      const listing: Listing = {
        id: generateId(),
        breederId: breederProfile?.id || user.id,
        breederName,
        breederVerified,
        title: data.title,
        animalType: data.animalType,
        breed: data.breed,
        gender: data.gender,
        dateOfBirth: data.dateOfBirth,
        price: data.price,
        location: data.location,
        description: data.description,
        photos: data.photos,
        videoUrl: data.videoUrl,
        vaccinated: data.vaccinated,
        microchipped: data.microchipped,
        pedigree: data.pedigree,
        healthInfo: data.healthInfo,
        parentsInfo: data.parentsInfo,
        status: "pending",
        isBoosted: false,
        isPremium: false,
        featured: false,
        viewCount: 0,
        createdAt: now,
        updatedAt: now,
      };

      const { error } = await supabaseAdmin.from("listings").insert(listingToSupabase(listing));
      if (error) return res.status(500).json({ message: error.message });

      res.status(201).json({ listing });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}

function supabaseToListing(row: any): Listing {
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

function listingToSupabase(l: Listing) {
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
    video_url: l.videoUrl || null,
    vaccinated: l.vaccinated,
    microchipped: l.microchipped,
    pedigree: l.pedigree,
    health_info: l.healthInfo || null,
    parents_info: l.parentsInfo || null,
    status: l.status,
    is_boosted: l.isBoosted,
    is_premium: l.isPremium,
    is_featured: l.featured,
    view_count: l.viewCount,
    created_at: l.createdAt,
    updated_at: l.updatedAt,
  };
}