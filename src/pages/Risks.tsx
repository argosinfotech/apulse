import { Plus, Search, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type RiskType = "Scope" | "Timeline" | "Tech" | "Client" | "Quality" | "Dependency";
type Severity = "Low" | "Med" | "High";
type RiskStatus = "Open" | "Mitigating" | "Resolved";

interface Risk {
  id: string;
  workItemId: string;
  workItemTitle: string;
  client: string;
  type: RiskType;
  severity: Severity;
  description: string;
  mitigationPlan: string;
  owner: string;
  dueDate: string;
  status: RiskStatus;
}

const risks: Risk[] = [
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
    dueDate: "Jan 18",
    status: "Open",
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
    dueDate: "Feb 1",
    status: "Mitigating",
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
    dueDate: "Jan 22",
    status: "Open",
  },
];

const severityColors: Record<Severity, string> = {
  High: "bg-destructive text-destructive-foreground",
  Med: "bg-warning text-warning-foreground",
  Low: "bg-muted text-muted-foreground",
};

const statusColors: Record<RiskStatus, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  Mitigating: "bg-warning/10 text-warning border-warning/20",
  Resolved: "bg-success/10 text-success border-success/20",
};

const typeColors: Record<RiskType, string> = {
  Scope: "bg-primary/10 text-primary",
  Timeline: "bg-warning/10 text-warning",
  Tech: "bg-accent/10 text-accent",
  Client: "bg-destructive/10 text-destructive",
  Quality: "bg-muted text-muted-foreground",
  Dependency: "bg-secondary text-secondary-foreground",
};

export default function Risks() {
  const openRisks = risks.filter((r) => r.status !== "Resolved");
  const highRisks = risks.filter((r) => r.severity === "High" && r.status !== "Resolved");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Risks & Blockers</h1>
          <p className="text-muted-foreground mt-1">
            Track and mitigate project risks
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Log Risk
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{highRisks.length}</p>
                <p className="text-sm text-muted-foreground">High Severity</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-warning/10">
                <AlertTriangle className="h-5 w-5 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{openRisks.length}</p>
                <p className="text-sm text-muted-foreground">Open Risks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-success/10">
                <AlertTriangle className="h-5 w-5 text-success" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {risks.filter((r) => r.status === "Mitigating").length}
                </p>
                <p className="text-sm text-muted-foreground">Being Mitigated</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Register */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold">Risk Register</CardTitle>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search risks..." className="pl-10" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {risks.map((risk) => (
            <div
              key={risk.id}
              className="p-4 rounded-lg bg-background border border-border hover:border-accent/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">{risk.id}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-semibold ${severityColors[risk.severity]}`}>
                    {risk.severity}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[risk.type]}`}>
                    {risk.type}
                  </span>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[risk.status]}`}>
                  {risk.status}
                </span>
              </div>

              <h4 className="font-medium text-foreground mb-1">{risk.description}</h4>
              <p className="text-sm text-muted-foreground mb-3">
                {risk.client} • {risk.workItemTitle}
              </p>

              <div className="p-3 rounded-md bg-muted/50">
                <p className="text-xs text-muted-foreground mb-1">Mitigation Plan:</p>
                <p className="text-sm text-foreground">{risk.mitigationPlan}</p>
              </div>

              <div className="flex items-center justify-between mt-3 text-xs text-muted-foreground">
                <span>Owner: {risk.owner}</span>
                <span>Due: {risk.dueDate}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
