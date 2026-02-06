import { AlertTriangle, Clock, MessageSquareWarning, ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge, PriorityBadge, HealthStatus, Priority } from "@/components/ui/status-badge";

interface WorkItem {
  id: string;
  client: string;
  title: string;
  status: string;
  risk: HealthStatus;
  riskReason: string;
  blockedBy?: string;
  priority: Priority;
  daysStale: number;
  hasEscalation: boolean;
}

const atRiskWorkItems: WorkItem[] = [
  {
    id: "WI-001",
    client: "Stephengould",
    title: "E-commerce checkout optimization",
    status: "Blocked",
    risk: "red",
    riskReason: "Waiting on client API credentials for 5 days",
    blockedBy: "Client",
    priority: "P1",
    daysStale: 5,
    hasEscalation: true,
  },
  {
    id: "WI-002",
    client: "Virtu-Meet",
    title: "Mobile app performance improvements",
    status: "In Progress",
    risk: "yellow",
    riskReason: "Technical complexity higher than estimated",
    blockedBy: "Tech",
    priority: "P0",
    daysStale: 2,
    hasEscalation: false,
  },
  {
    id: "WI-003",
    client: "TEL",
    title: "Dashboard redesign phase 2",
    status: "Client Review",
    risk: "yellow",
    riskReason: "Client unresponsive to review requests",
    blockedBy: "Client",
    priority: "P2",
    daysStale: 7,
    hasEscalation: false,
  },
];

export function AtRiskWorkItems() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <AlertTriangle className="h-5 w-5 text-warning" />
            At-Risk Work Items
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-accent hover:text-accent">
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {atRiskWorkItems.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-lg bg-background border border-border hover:border-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                <PriorityBadge priority={item.priority} />
                <StatusBadge status={item.risk} />
              </div>
              {item.hasEscalation && (
                <div className="flex items-center gap-1 text-xs text-warning">
                  <MessageSquareWarning className="h-3.5 w-3.5" />
                  <span>Escalation</span>
                </div>
              )}
            </div>

            <h4 className="font-medium text-foreground mb-1">{item.title}</h4>
            <p className="text-sm text-muted-foreground mb-3">{item.client}</p>

            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="px-2 py-1 rounded bg-muted">{item.status}</span>
              {item.blockedBy && (
                <span className="text-destructive">Blocked by: {item.blockedBy}</span>
              )}
              <span className="flex items-center gap-1 ml-auto">
                <Clock className="h-3 w-3" />
                {item.daysStale}d stale
              </span>
            </div>

            <p className="text-xs text-muted-foreground mt-3 italic border-l-2 border-warning/50 pl-2">
              {item.riskReason}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
