import type { NextApiRequest, NextApiResponse } from "next";
import { generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";
import { supabaseAdmin } from "@/integrations/supabase/server";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return requireAuth(async (req, res, user) => {
      const { data: conversations } = await supabaseAdmin
        .from("conversations")
        .select("*")
        .or(`participant_1_id.eq.${user.id},participant_2_id.eq.${user.id}`);

      const enriched = await Promise.all((conversations || []).map(async (c) => {
        const { data: messages } = await supabaseAdmin
          .from("messages")
          .select("*")
          .eq("conversation_id", c.id)
          .order("created_at", { ascending: false })
          .limit(1);

        const { data: unreadMessages } = await supabaseAdmin
          .from("messages")
          .select("*")
          .eq("conversation_id", c.id)
          .neq("sender_id", user.id)
          .eq("read", false);

        const otherId = c.participant_1_id === user.id ? c.participant_2_id : c.participant_1_id;
        const { data: otherUser } = await supabaseAdmin
          .from("profiles")
          .select("first_name,last_name")
          .eq("id", otherId)
          .single();

        return {
          ...c,
          lastMessage: messages?.[0] || null,
          unread: (unreadMessages || []).length,
          otherParticipantName: otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : "Unknown",
        };
      }));

      res.status(200).json({ conversations: enriched });
    })(req, res);
  }

  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      const { recipientId, listingId, content } = req.body;

      const { data: existingConv } = await supabaseAdmin
        .from("conversations")
        .select("*")
        .or(`and(participant_1_id.eq.${user.id},participant_2_id.eq.${recipientId}),and(participant_1_id.eq.${recipientId},participant_2_id.eq.${user.id})`)
        .maybeSingle();

      const now = new Date().toISOString();
      let conversationId: string;

      if (existingConv) {
        conversationId = existingConv.id;
        await supabaseAdmin
          .from("conversations")
          .update({ last_message_at: now })
          .eq("id", conversationId);
      } else {
        conversationId = generateId();
        const { data: listing } = await supabaseAdmin
          .from("listings")
          .select("title")
          .eq("id", listingId)
          .single();

        await supabaseAdmin.from("conversations").insert({
          id: conversationId,
          participant_1_id: user.id,
          participant_2_id: recipientId,
          listing_id: listingId,
          listing_title: listing?.title,
          last_message_at: now,
          created_at: now,
        });
      }

      const message = {
        id: generateId(),
        conversation_id: conversationId,
        sender_id: user.id,
        sender_name: `${user.firstName} ${user.lastName}`,
        content,
        read: false,
        created_at: now,
      };

      await supabaseAdmin.from("messages").insert(message);

      res.status(201).json({ message, conversation: { id: conversationId } });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}