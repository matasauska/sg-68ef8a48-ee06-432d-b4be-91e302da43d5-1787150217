import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import { useI18n } from "@/hooks/use-i18n";
import { Send, Loader2, MessageSquare, Ticket, X, Trash2, User, Bot } from "lucide-react";

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
};

const suggestedQuestions = [
  "How do I create a listing?",
  "How does breeder verification work?",
  "How do I boost my listing?",
  "How do I contact a breeder?",
  "How do I change my language?",
];

export default function HelpPage() {
  const { user } = useAuth();
  const { t } = useI18n();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm the Breedella Assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTicket, setShowTicket] = useState(false);
  const [ticketSubject, setTicketSubject] = useState("");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketSubmitting, setTicketSubmitting] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg, timestamp: new Date() }]);
    setLoading(true);

    const context = user
      ? `User role: ${user.role}, verified: ${user.breederVerified}`
      : "Not logged in";

    try {
      const res = await fetch("/api/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg, context }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply, timestamp: new Date() }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm having trouble connecting. Please try again later or create a support ticket.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm the Breedella Assistant. How can I help you today?",
        timestamp: new Date(),
      },
    ]);
  };

  const submitTicket = async () => {
    if (!ticketSubject.trim() || !ticketDesc.trim()) return;
    setTicketSubmitting(true);
    await fetch("/api/support/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject: ticketSubject, description: ticketDesc }),
    });
    setTicketSubmitting(false);
    setShowTicket(false);
    setTicketSubject("");
    setTicketDesc("");
    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content: "Your support ticket has been created. Our team will respond soon!",
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{t("help.title") || "Help Center"}</h1>
        <p className="text-muted-foreground mb-6">{t("help.subtitle") || "Get help from our AI assistant or create a support ticket"}</p>

        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5 text-primary" />
              <span className="font-semibold">Breedella Assistant</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={() => setShowTicket(true)}>
                <Ticket className="w-4 h-4 mr-1" /> {t("help.createTicket") || "Ticket"}
              </Button>
              <Button variant="ghost" size="icon" onClick={clearChat}>
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div ref={scrollRef} className="h-[400px] overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : ""}`}>
                {msg.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-primary" />
                  </div>
                )}
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                  <span className="text-[10px] opacity-60 mt-1 block">
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {msg.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}
            {loading && (
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                </div>
                <div className="bg-muted rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
          </div>

          {messages.length === 1 && (
            <div className="px-4 py-2 border-t border-border">
              <p className="text-xs text-muted-foreground mb-2">Suggested questions:</p>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => {
                      setInput(q);
                    }}
                    className="text-xs px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 transition-colors"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="p-4 border-t border-border flex gap-2">
            <Input
              placeholder={t("help.typeMessage") || "Type your message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <Button onClick={sendMessage} disabled={loading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {showTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-2xl border border-border p-6 w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">{t("help.createTicket") || "Create Support Ticket"}</h2>
                <Button variant="ghost" size="icon" onClick={() => setShowTicket(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">{t("help.subject") || "Subject"}</label>
                  <Input value={ticketSubject} onChange={(e) => setTicketSubject(e.target.value)} />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">{t("help.description") || "Description"}</label>
                  <textarea
                    className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={ticketDesc}
                    onChange={(e) => setTicketDesc(e.target.value)}
                  />
                </div>
                <Button onClick={submitTicket} disabled={ticketSubmitting || !ticketSubject.trim() || !ticketDesc.trim()} className="w-full">
                  {ticketSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : t("help.submit") || "Submit Ticket"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}