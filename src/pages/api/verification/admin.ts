import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return res.status(401).json({ message: "Unauthorized" });

  const { data: profile } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  if (!profile?.is_admin) return res.status(403).json({ message: "Forbidden" });

  if (req.method === "GET") {
    const { data, error } = await supabase
      .from("breeder_verifications")
      .select("*, profiles:user_id(full_name, email)")
      .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data);
  }

  if (req.method === "PATCH") {
    const { id, status, adminNotes } = req.body;
    const { data, error } = await supabase
      .from("breeder_verifications")
      .update({ status, admin_notes: adminNotes, reviewed_at: new Date().toISOString(), reviewed_by: user.id })
      .eq("id", id)
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });

    if (status === "verified") {
      const { data: ver } = await supabase
        .from("breeder_verifications")
        .select("user_id")
        .eq("id", id)
        .single();

      if (ver?.user_id) {
        await supabase.from("profiles").update({ role: "breeder", breeder_verified: true }).eq("id", ver.user_id);
      }
    }

    return res.status(200).json(data);
  }

  res.status(405).json({ message: "Method not allowed" });
}