import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/hooks/use-i18n";
import { Ticket, MessageCircle, Clock, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

export default function SupportTicketsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const { t } = useI18n();
  const [tickets, setTickets] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/login");
    if (user) loadTickets();
  }, [user, loading, router]);

  const loadTickets = async () => {
    const res = await fetch(`/api/support/tickets?userId=${user?.id}`);
    const data = await res.json();
    setTickets(data.tickets || []);
  };

  const createTicket = async () => {
    if (!subject.trim() || !description.trim()) {
      toast({ title: t("help.fillAllFields"), variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const res = await fetch("/api/support/tickets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id, subject, description }),
    });
    setSubmitting(false);
    if (res.ok) {
      toast({ title: t("help.ticketCreated") });
      setSubject("");
      setDescription("");
      setShowForm(false);
      loadTickets();
    } else {
      toast({ title: t("help.ticketFailed"), variant: "destructive" });
    }
  };

  const statusIcon = (status: string) => {
    switch (status) {
      case "open": return <Clock className="w-4 h-4 text-yellow-500" />;
      case "in_progress": return <AlertTriangle className="w-4 h-4 text-blue-500" />;
      case "waiting_user": return <MessageCircle className="w-4 h-4 text-orange-500" />;
      case "resolved": return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "closed": return <XCircle className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-yellow-500/10 text-yellow-500";
      case "in_progress": return "bg-blue-500/10 text-blue-500";
      case "waiting_user": return "bg-orange-500/10 text-orange-500";
      case "resolved": return "bg-green-500/10 text-green-500";
      case "closed": return "bg-gray-500/10 text-gray-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  if (loading || !user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-3xl font-bold flex items-center gap-2">
            <Ticket className="w-7 h-7" /> {t("help.supportTickets")}
          </h1>
          <Button onClick={() => setShowForm(!showForm)}>
            {showForm ? t("common.cancel") : t("help.newTicket")}
          </Button>
        </div>

        {showForm && (
          <div className="bg-card rounded-2xl border border-border p-6 mb-6">
            <h2 className="font-medium mb-4">{t("help.createTicket")}</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">{t("help.subject")}</label>
                <Input value={subject} onChange={e => setSubject(e.target.value)} placeholder={t("help.subjectPlaceholder")} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">{t("help.description")}</label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} rows={4} placeholder={t("help.descriptionPlaceholder")} />
              </div>
              <Button onClick={createTicket} disabled={submitting}>
                {submitting ? t("common.submitting") : t("help.submit")}
              </Button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {tickets.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Ticket className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>{t("help.noTickets")}</p>
              <p className="text-sm">{t("help.createTicketPrompt")}</p>
            </div>
          )}
          {tickets.map(ticket => (
            <div key={ticket.id} className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-medium">{ticket.subject}</h3>
                    <Badge className={statusColor(ticket.status)} variant="secondary">
                      <span className="flex items-center gap-1">
                        {statusIcon(ticket.status)}
                        {ticket.status.replace("_", " ")}
                      </span>
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{ticket.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {t("help.created")} {new Date(ticket.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}