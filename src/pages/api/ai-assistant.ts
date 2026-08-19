import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).json({ message: "Method not allowed" });

  const { message, context } = req.body;

  const knowledgeBase = `
You are the Breedella Assistant, a helpful AI support assistant for the Breedella marketplace platform.
Breedella connects verified breeders with people looking to buy pedigree animals (dogs, cats, rabbits, birds, etc.).

PLATFORM FEATURES:
- Free listings with photos and animal information
- Featured Listing: €4.99 - higher search position, featured badge, increased visibility
- Boost Listing: €2.99 for 7 days - higher position, boosted badge
- Premium Breeder: €9.99/month - unlimited listings, priority visibility, professional profile, analytics
- Mandatory breeder verification before publishing listings
- Buyers can save listings, message breeders, leave reviews
- Internal messaging system (no personal contact info exposed)
- Support tickets for unresolved issues

VERIFICATION:
- Breeders must submit: full name, date of birth, country, address, breeder/kennel name, contact info, registration info, animal ID info
- Statuses: pending, verified, rejected, additional_info_required
- Only verified breeders can publish listings
- Rejected breeders can resubmit after fixing issues

IMPORTANT LIMITATIONS:
- You CANNOT approve/reject verification, delete listings, suspend users, change subscriptions, process refunds, access private documents, or perform admin actions
- If you cannot solve a user's problem, offer to create a support ticket
- Never invent platform policies, prices, or legal requirements

Current user context: ${context || "Not available"}
`;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: knowledgeBase },
          { role: "user", content: message },
        ],
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) throw new Error("AI service error");

    const data = await response.json();
    const reply = data.choices[0]?.message?.content || "I'm sorry, I couldn't process your request. Would you like to create a support ticket?";

    res.status(200).json({ reply });
  } catch {
    res.status(200).json({
      reply: "I'm having trouble connecting right now. Please try again later, or create a support ticket for assistance.",
    });
  }
}