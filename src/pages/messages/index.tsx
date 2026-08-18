import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { Header } from "@/components/Header";
import { MessageCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import type { Conversation } from "@/types";

export default function MessagesPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) router.push("/login");
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    fetch("/api/messages").then(r => r.json()).then(d => {
      setConversations(d.conversations || []);
      setLoading(false);
    });

    // Handle ?breeder= param for starting new conversation
    const breederId = router.query.breeder as string;
    if (breederId) {
      fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipientId: breederId }),
      }).then(r => {
        if (r.ok) {
          router.replace("/messages", undefined, { shallow: true });
          // Refresh conversations
          fetch("/api/messages").then(r => r.json()).then(d => setConversations(d.conversations || []));
        }
      });
    }
  }, [user, router.query.breeder]);

  if (loading) return <div className="min-h-screen bg-background"><Header /><div className="p-8 text-center">Loading...</div></div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-3xl font-bold mb-6">Messages</h1>

        {conversations.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No conversations yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversations.map(c => (
              <Link key={c.id} href={`/messages/${c.id}`} className="block bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{c.listingTitle || "Conversation"}</p>
                      {c.unread && c.unread > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-primary text-primary-foreground text-xs font-medium">{c.unread}</span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate mt-1">{c.lastMessage?.content || "No messages yet"}</p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 ml-4">{new Date(c.lastMessageAt).toLocaleDateString()}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}