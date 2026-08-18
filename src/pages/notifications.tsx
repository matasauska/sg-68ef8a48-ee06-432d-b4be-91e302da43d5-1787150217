import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { useAuth } from "@/contexts/AuthContext";
import { Bell, MessageSquare, CheckCircle, AlertTriangle, Star } from "lucide-react";
import Link from "next/link";

interface NotificationItem {
  id: string;
  type: "message" | "listing" | "system" | "review";
  title: string;
  description: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export default function NotificationsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    // Demo notifications based on user role
    const demo: NotificationItem[] = [
      {
        id: "1",
        type: "system",
        title: "Welcome to Breedela",
        description: "Complete your profile to get started.",
        read: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        link: "/dashboard",
      },
      {
        id: "2",
        type: "listing",
        title: "Listing approved",
        description: "Your listing 'Luna - Maine Coon' has been approved.",
        read: false,
        createdAt: new Date(Date.now() - 172800000).toISOString(),
        link: "/dashboard",
      },
      {
        id: "3",
        type: "message",
        title: "New message",
        description: "You received a message about Golden Retriever puppy.",
        read: true,
        createdAt: new Date(Date.now() - 259200000).toISOString(),
        link: "/messages",
      },
    ];
    setNotifications(demo);
  }, [user]);

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (loading || !user) return null;

  const iconMap = {
    message: MessageSquare,
    listing: CheckCircle,
    system: Bell,
    review: Star,
    alert: AlertTriangle,
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold">Notifications</h1>
          <button onClick={markAllRead} className="text-sm text-primary hover:underline">Mark all read</button>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-2xl">
            <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No notifications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map(n => {
              const Icon = iconMap[n.type] || Bell;
              const Wrapper = n.link ? Link : "div";
              return (
                <Wrapper
                  key={n.id}
                  href={n.link || "#"}
                  onClick={() => markRead(n.id)}
                  className={`block rounded-2xl border p-4 transition-colors ${n.read ? "bg-card border-border" : "bg-primary/5 border-primary/20"}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${n.read ? "text-muted-foreground" : "text-primary"}`} />
                    <div className="flex-1">
                      <p className={`font-medium ${n.read ? "text-muted-foreground" : "text-foreground"}`}>{n.title}</p>
                      <p className="text-sm text-muted-foreground">{n.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                    </div>
                    {!n.read && <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />}
                  </div>
                </Wrapper>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}