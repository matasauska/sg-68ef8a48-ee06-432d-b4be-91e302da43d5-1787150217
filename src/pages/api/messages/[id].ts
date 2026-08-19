import type { NextApiRequest, NextApiResponse } from "next";
import { generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  if (!id || typeof id !== "string") {
    return res.status(400).json({ message: "Invalid conversation ID" });
  }

  if (req.method === "GET") {
    return requireAuth(async (req, res, user) => {
      const { data: conversation } = await supabaseAdmin
        .from("conversations")
        .select("*")
        .eq("id", id)
        .single();

      if (!conversation) return res.status(404).json({ message: "Conversation not found" });

      const participantIds = [conversation.participant_1_id, conversation.participant_2_id];
      if (!participantIds.includes(user.id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const { data: messages } = await supabaseAdmin
        .from("messages")
        .select("*")
        .eq("conversation_id", id)
        .order("created_at", { ascending: true });

      await supabaseAdmin
        .from("messages")
        .update({ read: true })
        .eq("conversation_id", id)
        .neq("sender_id", user.id);

      res.status(200).json({ conversation, messages: messages || [] });
    })(req, res);
  }

  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      const { content } = req.body;

      const { data: conversation } = await supabaseAdmin
        .from("conversations")
        .select("*")
        .eq("id", id)
        .single();

      if (!conversation) return res.status(404).json({ message: "Conversation not found" });

      const participantIds = [conversation.participant_1_id, conversation.participant_2_id];
      if (!participantIds.includes(user.id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const now = new Date().toISOString();
      const message = {
        id: generateId(),
        conversation_id: id,
        sender_id: user.id,
        sender_name: `${user.firstName} ${user.lastName}`,
        content,
        read: false,
        created_at: now,
      };

      await supabaseAdmin.from("messages").insert(message);
      await supabaseAdmin
        .from("conversations")
        .update({ last_message_at: now })
        .eq("id", id);

      res.status(201).json({ message });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}