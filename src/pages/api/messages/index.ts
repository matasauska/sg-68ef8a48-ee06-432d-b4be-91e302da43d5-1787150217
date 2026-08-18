import type { NextApiRequest, NextApiResponse } from "next";
import { getDb, generateId } from "@/lib/db";
import { requireAuth } from "@/lib/api-helpers";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    return requireAuth(async (req, res, user) => {
      const db = await getDb();
      const conversations = db.data.conversations.filter((c) =>
        c.participantIds.includes(user.id)
      );

      const enriched = conversations.map((c) => {
        const lastMessage = db.data.messages
          .filter((m) => m.conversationId === c.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
        const unread = db.data.messages.filter(
          (m) => m.conversationId === c.id && m.senderId !== user.id && !m.read
        ).length;
        return { ...c, lastMessage, unread };
      });

      res.status(200).json({ conversations: enriched });
    })(req, res);
  }

  if (req.method === "POST") {
    return requireAuth(async (req, res, user) => {
      const { recipientId, listingId, content } = req.body;
      const db = await getDb();

      let conversation = db.data.conversations.find(
        (c) =>
          c.participantIds.includes(user.id) &&
          c.participantIds.includes(recipientId) &&
          c.listingId === listingId
      );

      const now = new Date().toISOString();

      if (!conversation) {
        const listing = db.data.listings.find((l) => l.id === listingId);
        conversation = {
          id: generateId(),
          participantIds: [user.id, recipientId],
          listingId,
          listingTitle: listing?.title,
          lastMessageAt: now,
          createdAt: now,
        };
        db.data.conversations.push(conversation);
      }

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

      res.status(201).json({ message, conversation });
    })(req, res);
  }

  res.status(405).json({ message: "Method not allowed" });
}