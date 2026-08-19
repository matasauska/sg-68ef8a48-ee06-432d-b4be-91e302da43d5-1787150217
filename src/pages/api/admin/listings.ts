import type { NextApiRequest, NextApiResponse } from "next";
import { requireAdmin } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return requireAdmin(async (req, res) => {
      const { data: listings, error } = await supabaseAdmin
        .from("listings")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) return res.status(500).json({ message: error.message });

      const enriched = await Promise.all((listings || []).map(async (l) => {
        const { data: breeder } = await supabaseAdmin
          .from("breeder_profiles")
          .select("kennel_name")
          .eq("id", l.breeder_id)
          .single();

        return {
          id: l.id,
          title: l.title,
          breed: l.breed,
          location: l.location,
          price: l.price,
          status: l.status,
          breederName: breeder?.kennel_name || "Unknown",
          createdAt: l.created_at,
        };
      }));

      res.status(200).json({ listings: enriched });
    })(req, res);
  }

  if (req.method === "PATCH") {
    return requireAdmin(async (req, res) => {
      const { id, status } = req.body;

      const { error } = await supabaseAdmin
        .from("listings")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id);

      if (error) return res.status(500).json({ message: error.message });

      res.status(200).json({ message: "Listing updated" });
    })(req, res);
  }

  if (req.method === "DELETE") {
    return requireAdmin(async (req, res) => {
      const { id } = req.query;
      if (!id || typeof id !== "string") {
        return res.status(400).json({ message: "Invalid listing ID" });
      }

      const { error } = await supabaseAdmin
        .from("listings")
        .delete()
        .eq("id", id);

      if (error) return res.status(500).json({ message: error.message });

      res.status(200).json({ message: "Deleted" });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}