import type { NextApiRequest, NextApiResponse } from "next";
import { generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";
import type { BreederProfile } from "@/types";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    const { data: breederProfiles } = await supabaseAdmin
      .from("breeder_profiles")
      .select("*");

    return res.status(200).json({
      breederProfiles: (breederProfiles || []).map(bp => ({
        id: bp.id,
        userId: bp.user_id,
        kennelName: bp.kennel_name,
        about: bp.about,
        location: bp.location,
        experienceYears: bp.years_experience || 0,
        breeds: bp.breeds || [],
        verified: bp.verified,
        createdAt: bp.created_at,
        updatedAt: bp.updated_at,
      })),
    });
  }

  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      if (user.role !== "breeder" && user.role !== "admin") {
        return res.status(403).json({ message: "Must be a breeder" });
      }

      const { data: existing } = await supabaseAdmin
        .from("breeder_profiles")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existing) {
        return res.status(400).json({ message: "Profile already exists" });
      }

      const now = new Date().toISOString();
      const profile: BreederProfile = {
        id: generateId(),
        userId: user.id,
        kennelName: req.body.kennelName,
        about: req.body.about || "",
        location: req.body.location,
        experienceYears: req.body.experienceYears || 0,
        breeds: req.body.breeds || [],
        website: req.body.website,
        verified: false,
        verificationRequested: false,
        totalListings: 0,
        createdAt: now,
        updatedAt: now,
      };

      await supabaseAdmin.from("breeder_profiles").insert({
        id: profile.id,
        user_id: profile.userId,
        kennel_name: profile.kennelName,
        about: profile.about,
        location: profile.location,
        years_experience: profile.experienceYears,
        breeds: profile.breeds,
        website: profile.website,
        verified: profile.verified,
        created_at: profile.createdAt,
        updated_at: profile.updatedAt,
      });

      res.status(201).json({ profile });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}