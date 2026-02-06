import { useState } from "react";
import { Plus, Search, AlertTriangle, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { useNotifications } from "@/contexts/NotificationContext";
import { canEdit as checkCanEdit } from "@/config/permissions";
import { RiskFormModal, Risk, RiskType, Severity, RiskStatus } from "@/components/risks/RiskFormModal";
import { RiskDetailModal } from "@/components/risks/RiskDetailModal";
import { toast } from "@/hooks/use-toast";

const initialRisks: Risk[] = [
  {
    id: "R-001",
    workItemId: "WI-001",
    workItemTitle: "E-commerce checkout optimization",
    client: "Stephengould",
    type: "Client",
    severity: "High",
    description: "Client unresponsive for 5 days, blocking API integration",
    mitigationPlan: "Escalate to primary contact, set deadline for response",
    owner: "DCOL",
    dueDate: "2025-01-18",
    status: "Open",
    createdAt: "Jan 10, 2025",
    updatedAt: "Jan 15, 2025",
  },
  {
    id: "R-002",
    workItemId: "WI-002",
    workItemTitle: "Mobile app performance improvements",
    client: "Virtu-Meet",
    type: "Tech",
    severity: "Med",
    description: "React Native optimization more complex than estimated",
    mitigationPlan: "Brought in senior developer for code review",
    owner: "DCOL",
    dueDate: "2025-02-01",
    status: "Mitigating",
    createdAt: "Jan 12, 2025",
    updatedAt: "Jan 14, 2025",
  },
  {
    id: "R-003",
    workItemId: "WI-003",
    workItemTitle: "Dashboard redesign phase 2",
    client: "TEL",
    type: "Timeline",
    severity: "Med",
    description: "Client review taking longer than planned",
    mitigationPlan: "Schedule call to walk through changes live",
    owner: "DCOL",
    dueDate: "2025-01-22",
    status: "Open",
    createdAt: "Jan 8, 2025",
    updatedAt: "Jan 16, 2025",
  },
];

const severityStyles: Record<Severity, string> = {
  High: "bg-destructive text-destructive-foreground",
  Med: "bg-warning text-warning-foreground",
  Low: "bg-muted text-muted-foreground",
};

const statusStyles: Record<RiskStatus, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  Mitigating: "bg-warning/10 text-warning border-warning/20",
  Resolved: "bg-success/10 text-success border-success/20",
};

const typeStyles: Record<RiskType, string> = {
  Scope: "bg-primary/10 text-primary",
  Timeline: "bg-warning/10 text-warning",
  Tech: "bg-accent/10 text-accent",
  Client: "bg-destructive/10 text-destructive",
  Quality: "bg-muted text-muted-foreground",
  Dependency: "bg-secondary text-secondary-foreground",
};

export default function Risks() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const userCanEdit = user ? checkCanEdit(user.role, "risks") : false;

  const [risks, setRisks] = useState<Risk[]>(initialRisks);
  const [searchQuery, setSearchQuery] = useState("");
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);
  const [editingRisk, setEditingRisk] = useState<Risk | null>(null);

  const filteredRisks = risks.filter(
    (risk) =>
      risk.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.workItemTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      risk.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openRisks = risks.filter((r) => r.status !== "Resolved");
  const highRisks = risks.filter((r) => r.severity === "High" && r.status !== "Resolved");
  const mitigatingRisks = risks.filter((r) => r.status === "Mitigating");

  const handleCreate = () => {
    setEditingRisk(null);
    setFormModalOpen(true);
  };

  const handleEdit = (risk: Risk) => {
    setEditingRisk(risk);
    setFormModalOpen(true);
  };

  const handleViewDetails = (risk: Risk) => {
    setSelectedRisk(risk);
    setDetailModalOpen(true);
  };

  const handleFormSubmit = (data: Omit<Risk, "id" | "createdAt" | "updatedAt">) => {
    if (editingRisk) {
      // Update existing
      setRisks((prev) =>
        prev.map((r) =>
          r.id === editingRisk.id
            ? { ...r, ...data, updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
            : r
        )
      );
      toast({ title: "Risk Updated", description: `${editingRisk.id} has been updated.` });
    } else {
      // Create new
      const newRisk: Risk = {
        ...data,
        id: `R-${String(risks.length + 1).padStart(3, "0")}`,
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      setRisks((prev) => [newRisk, ...prev]);
      toast({ title: "Risk Logged", description: `${newRisk.id} has been created.` });

      // Notify Founder for High severity risks
      if (data.severity === "High") {
        addNotification({
          type: "risk",
          title: "High Severity Risk Logged",
          message: `${newRisk.id}: ${data.type} - ${data.client}`,
          link: "/risks",
          forRole: "founder",
        });
      }
    }
    setEditingRisk(null);
  };

  const handleDelete = (riskId: string) => {
    setRisks((prev) => prev.filter((r) => r.id !== riskId));
    toast({ title: "Risk Deleted", description: `${riskId} has been removed.`, variant: "destructive" });
  };

  const handleStatusChange = (riskId: string, status: RiskStatus) => {
    setRisks((prev) =>
      prev.map((r) =>
        r.id === riskId
          ? { ...r, status, updatedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }
          : r
      )
    );
    setSelectedRisk((prev) => (prev?.id === riskId ? { ...prev, status } : prev));
    toast({ title: "Status Updated", description: `Risk status changed to ${status}.` });
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground">Risks & Blockers</h1>
            {!userCanEdit && (
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <Eye className="h-3 w-3" />
                View Only
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">Track and mitigate project risks</p>
        </div>
        {userCanEdit && (
          <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground" onClick={handleCreate}>
            <Plus className="h-4 w-4 mr-1" />
            Log Risk
          </Button>
        )}
      </div>

      {/* Summary Stats - Compact */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="shadow-card p-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground leading-none">{highRisks.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">High Severity</p>
            </div>
          </div>
        </Card>
        <Card className="shadow-card p-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-warning/10">
              <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground leading-none">{openRisks.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Open Risks</p>
            </div>
          </div>
        </Card>
        <Card className="shadow-card p-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-success/10">
              <AlertTriangle className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground leading-none">{mitigatingRisks.length}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Mitigating</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Risk Register */}
      <Card className="shadow-card">
        <CardHeader className="py-3 px-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-semibold">Risk Register</CardTitle>
            <div className="relative w-56">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search risks..."
                className="pl-8 h-8 text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 space-y-2">
          {filteredRisks.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground text-sm">
              {searchQuery ? "No risks match your search." : "No risks logged yet."}
            </div>
          ) : (
            filteredRisks.map((risk) => (
              <div
                key={risk.id}
                onClick={() => handleViewDetails(risk)}
                className="p-3 rounded border border-border hover:bg-muted/50 transition-colors cursor-pointer"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">{risk.id}</span>
                    <Badge className={`${severityStyles[risk.severity]} text-xs px-1.5 py-0`}>{risk.severity}</Badge>
                    <Badge variant="outline" className={`${typeStyles[risk.type]} text-xs px-1.5 py-0`}>
                      {risk.type}
                    </Badge>
                  </div>
                  <Badge variant="outline" className={`${statusStyles[risk.status]} text-xs px-1.5 py-0`}>
                    {risk.status}
                  </Badge>
                </div>

                <p className="font-medium text-sm text-foreground line-clamp-1">{risk.description}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {risk.client} • {risk.workItemTitle}
                </p>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
                  <div className="flex-1 min-w-0 pr-4">
                    <p className="text-[10px] text-muted-foreground">Mitigation:</p>
                    <p className="text-xs text-foreground line-clamp-1">
                      {risk.mitigationPlan || <span className="italic text-muted-foreground">Not defined</span>}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground shrink-0">
                    <span>{risk.owner}</span>
                    <span>Due {risk.dueDate}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <RiskFormModal
        open={formModalOpen}
        onOpenChange={setFormModalOpen}
        risk={editingRisk}
        onSubmit={handleFormSubmit}
      />

      {/* Detail Modal */}
      <RiskDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        risk={selectedRisk}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onStatusChange={handleStatusChange}
        canEdit={userCanEdit}
      />
    </div>
  );
}
