import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const body = req.body;
    const { data, error } = await supabase
      .from("breeder_verifications")
      .insert({
        user_id: user.id,
        full_name: body.fullName,
        date_of_birth: body.dateOfBirth,
        country: body.country,
        address: body.address,
        breeder_name: body.breederName,
        contact_info: body.contactInfo,
        registration_info: body.registrationInfo,
        animal_id_info: body.animalIdInfo,
        status: "pending",
      })
      .select()
      .single();

    if (error) return res.status(500).json({ message: error.message });
    return res.status(201).json(data);
  }

  if (req.method === "GET") {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const { data: { user } } = await supabase.auth.getUser(token);
    if (!user) return res.status(401).json({ message: "Unauthorized" });

    const { data, error } = await supabase
      .from("breeder_verifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) return res.status(500).json({ message: error.message });
    return res.status(200).json(data || null);
  }

  res.status(405).json({ message: "Method not allowed" });
}