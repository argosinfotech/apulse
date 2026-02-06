import { useState } from "react";
import { Plus, Eye, Clock, CheckCircle, User, ArrowRight, FileEdit } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { canEdit as checkCanEdit, hasPermission } from "@/config/permissions";
import { EscalationFormModal, Escalation, EscalationType, DecisionStatus, EscalationFormData } from "@/components/escalations/EscalationFormModal";
import { EscalationDetailModal } from "@/components/escalations/EscalationDetailModal";
import { toast } from "@/hooks/use-toast";

const initialEscalations: Escalation[] = [
  {
    id: "ESC-001",
    client: "Stephengould",
    workItemId: "WI-001",
    workItemTitle: "E-commerce checkout optimization",
    type: "Scope",
    context: "Client requesting additional payment gateway integration (Apple Pay) not in original scope. This will require additional development time and potential third-party integration costs.",
    options: [
      { label: "Option A", description: "Accept with change order (+$8K, +2 weeks)" },
      { label: "Option B", description: "Defer to Phase 2" },
      { label: "Option C", description: "Include in current scope, absorb cost" },
    ],
    recommendation: "Accept with change order (+$8K, +2 weeks) - maintains project timeline and fair compensation",
    createdBy: "DCOL",
    createdAt: "Jan 15, 2025",
    status: "Pending",
    daysOpen: 3,
    updatedAt: "Jan 15, 2025",
  },
  {
    id: "ESC-002",
    client: "Virtu-Meet",
    workItemId: "WI-002",
    workItemTitle: "Mobile app performance improvements",
    type: "Architecture",
    context: "Performance issues require significant refactoring. Need to decide between native rebuild vs. optimization of existing React Native codebase.",
    options: [
      { label: "Option A", description: "Full native rebuild (Swift/Kotlin) - 12 weeks, higher cost" },
      { label: "Option B", description: "Targeted RN optimization - 4 weeks, moderate cost" },
      { label: "Option C", description: "Hybrid approach - native for critical paths only" },
    ],
    recommendation: "Proceed with targeted optimization (Option B) - lower risk, faster delivery, can reassess if insufficient",
    createdBy: "DCOL",
    createdAt: "Jan 14, 2025",
    status: "Pending",
    daysOpen: 4,
    updatedAt: "Jan 14, 2025",
  },
  {
    id: "ESC-003",
    client: "TEL",
    workItemId: "WI-003",
    workItemTitle: "Dashboard redesign phase 1",
    type: "Pricing",
    context: "Client requested 20% discount on Phase 2 citing budget constraints.",
    options: [
      { label: "Option A", description: "Accept 20% discount" },
      { label: "Option B", description: "Counter with 10% discount" },
      { label: "Option C", description: "Offer reduced scope at current price" },
    ],
    recommendation: "Counter with 10% discount - preserves relationship while maintaining fair margins",
    createdBy: "DCOL",
    createdAt: "Jan 10, 2025",
    status: "Decided",
    decision: "Accepted Option B - 10% discount agreed upon. Phase 2 contract signed.",
    decisionNotes: "Client appreciated the compromise. Good outcome for relationship.",
    decisionDate: "Jan 12, 2025",
    daysOpen: 0,
    updatedAt: "Jan 12, 2025",
  },
  {
    id: "ESC-004",
    client: "SOLI",
    workItemId: "WI-004",
    workItemTitle: "API integration for payments",
    type: "Client Risk",
    context: "Client has missed last two payment milestones. Currently 30 days overdue on $15K.",
    options: [
      { label: "Option A", description: "Pause work until payment received" },
      { label: "Option B", description: "Continue with formal payment plan agreement" },
      { label: "Option C", description: "Escalate to legal/collections" },
    ],
    recommendation: "Pause work with formal notice - protect ourselves while giving client opportunity to resolve",
    createdBy: "DCOL",
    createdAt: "Jan 16, 2025",
    status: "Draft",
    daysOpen: 1,
    updatedAt: "Jan 16, 2025",
  },
];

const typeStyles: Record<EscalationType, string> = {
  Architecture: "bg-primary/10 text-primary",
  Pricing: "bg-success/10 text-success",
  Scope: "bg-warning/10 text-warning",
  "Client Risk": "bg-destructive/10 text-destructive",
  Legal: "bg-muted text-muted-foreground",
  Resource: "bg-secondary text-secondary-foreground",
};

export default function Escalations() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const userCanEdit = user ? checkCanEdit(user.role, "escalations") : false;
  const userCanApprove = user ? hasPermission(user.role, "escalations", "approve") : false;

  const [escalations, setEscalations] = useState<Escalation[]>(initialEscalations);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedEscalation, setSelectedEscalation] = useState<Escalation | null>(null);
  const [editingEscalation, setEditingEscalation] = useState<Escalation | null>(null);

  // Filter based on role - Founders don't see Drafts
  const visibleEscalations = user?.role === "founder"
    ? escalations.filter((e) => e.status !== "Draft")
    : escalations;

  const drafts = escalations.filter((e) => e.status === "Draft");
  const pending = visibleEscalations.filter((e) => e.status === "Pending");
  const decided = visibleEscalations.filter((e) => e.status === "Decided");

  const handleCreate = () => {
    setEditingEscalation(null);
    setFormModalOpen(true);
  };

  const handleEdit = (escalation: Escalation) => {
    setEditingEscalation(escalation);
    setFormModalOpen(true);
  };

  const handleViewDetails = (escalation: Escalation) => {
    setSelectedEscalation(escalation);
    setDetailModalOpen(true);
  };

  const handleFormSubmit = (data: EscalationFormData) => {
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

    if (editingEscalation) {
      setEscalations((prev) =>
        prev.map((e) =>
          e.id === editingEscalation.id
            ? { ...e, ...data, updatedAt: now }
            : e
        )
      );
      toast({ title: "Escalation Updated", description: `${editingEscalation.id} has been updated.` });
      
      // Notify Founder if status changed to Pending
      if (data.status === "Pending" && editingEscalation.status === "Draft") {
        addNotification({
          type: "escalation",
          title: "Escalation Submitted",
          message: `${editingEscalation.id}: ${data.type} - ${data.workItemTitle}`,
          link: "/escalations",
          forRole: "founder",
        });
      }
    } else {
      const newEscalation: Escalation = {
        ...data,
        id: `ESC-${String(escalations.length + 1).padStart(3, "0")}`,
        createdBy: "DCOL",
        createdAt: now,
        updatedAt: now,
        daysOpen: 0,
      };
      setEscalations((prev) => [newEscalation, ...prev]);
      toast({
        title: data.status === "Draft" ? "Draft Saved" : "Escalation Filed",
        description: `${newEscalation.id} has been ${data.status === "Draft" ? "saved as draft" : "submitted for decision"}.`,
      });

      // Notify Founder when new escalation is filed (not draft)
      if (data.status === "Pending") {
        addNotification({
          type: "escalation",
          title: "New Escalation Filed",
          message: `${newEscalation.id}: ${data.type} - ${data.workItemTitle}`,
          link: "/escalations",
          forRole: "founder",
        });
      }
    }
    setEditingEscalation(null);
  };

  const handleDelete = (escalationId: string) => {
    setEscalations((prev) => prev.filter((e) => e.id !== escalationId));
    toast({ title: "Escalation Deleted", description: `${escalationId} has been removed.`, variant: "destructive" });
  };

  const handleDecision = (escalationId: string, selectedOption: string, notes: string) => {
    const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    const escalation = escalations.find((e) => e.id === escalationId);
    
    setEscalations((prev) =>
      prev.map((e) =>
        e.id === escalationId
          ? {
              ...e,
              status: "Decided" as DecisionStatus,
              decision: `Selected ${selectedOption}`,
              decisionNotes: notes,
              decisionDate: now,
              updatedAt: now,
              daysOpen: 0,
            }
          : e
      )
    );
    toast({ title: "Decision Made", description: `${escalationId} has been resolved.` });

    // Notify DCOL that a decision was made
    if (escalation) {
      addNotification({
        type: "decision",
        title: "Decision Made",
        message: `${escalationId}: ${selectedOption} - ${escalation.workItemTitle}`,
        link: "/escalations",
        forRole: "dcol",
      });
    }
  };

  const renderEscalationCard = (escalation: Escalation, showDaysOpen = true) => (
    <Card
      key={escalation.id}
      className="shadow-card cursor-pointer hover:border-accent/30 transition-colors"
      onClick={() => handleViewDetails(escalation)}
    >
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-muted-foreground">{escalation.id}</span>
            <Badge variant="outline" className={typeStyles[escalation.type]}>
              {escalation.type}
            </Badge>
            {escalation.status === "Decided" && (
              <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                <CheckCircle className="h-3 w-3 mr-1" />
                Decided
              </Badge>
            )}
            {escalation.status === "Draft" && (
              <Badge variant="outline" className="bg-muted text-muted-foreground">
                <FileEdit className="h-3 w-3 mr-1" />
                Draft
              </Badge>
            )}
          </div>
          {showDaysOpen && escalation.status === "Pending" && (
            <div className="flex items-center gap-1 text-sm text-warning">
              <Clock className="h-4 w-4" />
              {escalation.daysOpen} days open
            </div>
          )}
        </div>

        <div className="mb-4">
          <p className="text-sm text-muted-foreground">{escalation.client}</p>
          <h3 className="text-lg font-semibold text-foreground">{escalation.workItemTitle}</h3>
        </div>

        {escalation.status !== "Decided" ? (
          <>
            <div className="p-4 rounded-lg bg-muted/50 mb-4">
              <p className="text-sm text-muted-foreground line-clamp-2">{escalation.context}</p>
            </div>

            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20 mb-4">
              <div className="flex items-start gap-2">
                <ArrowRight className="h-5 w-5 text-accent shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">DCOL Recommendation</p>
                  <p className="text-sm font-medium text-accent line-clamp-2">{escalation.recommendation}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="p-4 rounded-lg bg-success/5 border border-success/20">
            <p className="text-xs text-muted-foreground mb-1">Decision ({escalation.decisionDate})</p>
            <p className="text-sm font-medium text-foreground">{escalation.decision}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            Filed by {escalation.createdBy} on {escalation.createdAt}
          </span>
          {userCanApprove && escalation.status === "Pending" && (
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleViewDetails(escalation);
              }}
            >
              Make Decision
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">Escalations & Decisions</h1>
            {!userCanEdit && !userCanApprove && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                View Only
              </Badge>
            )}
          </div>
          <p className="text-muted-foreground mt-1">
            {userCanApprove
              ? "Review and decide on escalated items"
              : "File strategic escalations for Founder decision"}
          </p>
        </div>
        {userCanEdit && (
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-2" />
            File Escalation
          </Button>
        )}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          {userCanEdit && drafts.length > 0 && (
            <TabsTrigger value="drafts" className="relative">
              Drafts
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                {drafts.length}
              </span>
            </TabsTrigger>
          )}
          <TabsTrigger value="pending" className="relative">
            Pending
            {pending.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-destructive text-destructive-foreground">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="decided">Decided</TabsTrigger>
        </TabsList>

        {userCanEdit && (
          <TabsContent value="drafts" className="space-y-4">
            {drafts.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">No draft escalations.</div>
            ) : (
              drafts.map((e) => renderEscalationCard(e, false))
            )}
          </TabsContent>
        )}

        <TabsContent value="pending" className="space-y-4">
          {pending.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No pending escalations.</div>
          ) : (
            pending.map((e) => renderEscalationCard(e))
          )}
        </TabsContent>

        <TabsContent value="decided" className="space-y-4">
          {decided.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">No decided escalations yet.</div>
          ) : (
            decided.map((e) => renderEscalationCard(e, false))
          )}
        </TabsContent>
      </Tabs>

      {/* Form Modal */}
      <EscalationFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        escalation={editingEscalation}
        onSubmit={handleFormSubmit}
      />

      {/* Detail Modal */}
      <EscalationDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        escalation={selectedEscalation}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onDecision={handleDecision}
        canEdit={userCanEdit}
        canApprove={userCanApprove}
      />
    </div>
  );
}
