import type { NextApiRequest, NextApiResponse } from "next";
import { getDb, generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const db = await getDb();

  const conversation = db.data.conversations.find((c) => c.id === id);
  if (!conversation) {
    return res.status(404).json({ message: "Conversation not found" });
  }

  if (req.method === "GET") {
    return requireAuth(async (req, res, user) => {
      if (!conversation.participantIds.includes(user.id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const messages = db.data.messages
        .filter((m) => m.conversationId === id)
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());

      messages.forEach((m) => {
        if (m.senderId !== user.id && !m.read) {
          m.read = true;
        }
      });
      await db.write();

      const otherId = conversation.participantIds.find((pid) => pid !== user.id);
      const otherUser = otherId ? db.data.users.find((u) => u.id === otherId) : null;
      const otherParticipantName = otherUser ? `${otherUser.firstName} ${otherUser.lastName}` : "Unknown";

      res.status(200).json({ messages, conversation: { ...conversation, otherParticipantName } });
    })(req, res);
  }

  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      if (!conversation.participantIds.includes(user.id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const { content } = req.body;
      const now = new Date().toISOString();

      const message = {
        id: generateId(),
        conversationId: conversation.id,
        senderId: user.id,
        senderName: `${user.firstName} ${user.lastName}`,
        content,
        read: false,
        createdAt: now,
      };

      db.data.messages.push(message);
      conversation.lastMessageAt = now;
      await db.write();

      res.status(201).json({ message });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}