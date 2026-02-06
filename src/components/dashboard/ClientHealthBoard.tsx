import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge, HealthStatus } from "@/components/ui/status-badge";
import { Calendar, ExternalLink } from "lucide-react";

interface Client {
  id: string;
  name: string;
  health: HealthStatus;
  healthReason?: string;
  lastTouch: string;
  nextMilestone: string;
  activeWorkItems: number;
  openEscalations: number;
}

const clients: Client[] = [
  {
    id: "C-001",
    name: "Stephengould",
    health: "red",
    healthReason: "Blocked work item, unresponsive for 5 days",
    lastTouch: "5 days ago",
    nextMilestone: "Checkout launch - Jan 30",
    activeWorkItems: 3,
    openEscalations: 1,
  },
  {
    id: "C-002",
    name: "Virtu-Meet",
    health: "yellow",
    healthReason: "Performance issues taking longer than expected",
    lastTouch: "2 days ago",
    nextMilestone: "App Store submission - Feb 15",
    activeWorkItems: 2,
    openEscalations: 0,
  },
  {
    id: "C-003",
    name: "TEL",
    health: "green",
    lastTouch: "Today",
    nextMilestone: "Phase 2 review - Feb 5",
    activeWorkItems: 4,
    openEscalations: 0,
  },
  {
    id: "C-004",
    name: "SOLI",
    health: "green",
    lastTouch: "1 day ago",
    nextMilestone: "MVP launch - Feb 28",
    activeWorkItems: 2,
    openEscalations: 0,
  },
];

export function ClientHealthBoard() {
  const atRiskClients = clients.filter((c) => c.health === "red" || c.health === "yellow");

  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Client Health</CardTitle>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success" />
              <span className="text-muted-foreground">{clients.filter(c => c.health === "green").length} Healthy</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-warning" />
              <span className="text-muted-foreground">{clients.filter(c => c.health === "yellow").length} At Risk</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-destructive" />
              <span className="text-muted-foreground">{clients.filter(c => c.health === "red").length} Critical</span>
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {clients.map((client) => (
            <div
              key={client.id}
              className="flex items-center gap-4 p-3 rounded-lg bg-background border border-border hover:border-accent/30 transition-colors cursor-pointer"
            >
              <StatusBadge status={client.health} />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-medium text-foreground">{client.name}</h4>
                  <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
                {client.healthReason && (
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">{client.healthReason}</p>
                )}
              </div>

              <div className="flex items-center gap-6 text-sm shrink-0">
                <div className="text-center">
                  <p className="font-semibold text-foreground">{client.activeWorkItems}</p>
                  <p className="text-xs text-muted-foreground">Work Items</p>
                </div>
                <div className="hidden md:block text-right">
                  <p className="text-xs text-muted-foreground">Last touch</p>
                  <p className="text-sm text-foreground">{client.lastTouch}</p>
                </div>
                <div className="hidden lg:flex items-center gap-1.5 text-muted-foreground">
                  <Calendar className="h-3.5 w-3.5" />
                  <span className="text-xs">{client.nextMilestone}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
