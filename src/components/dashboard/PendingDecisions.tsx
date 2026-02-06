import { ArrowRight, Clock, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Escalation {
  id: string;
  client: string;
  workItem: string;
  type: "Architecture" | "Pricing" | "Scope" | "Client Risk" | "Legal";
  context: string;
  recommendation: string;
  createdBy: string;
  createdAt: string;
  daysOpen: number;
}

const pendingDecisions: Escalation[] = [
  {
    id: "ESC-001",
    client: "Stephengould",
    workItem: "E-commerce checkout optimization",
    type: "Scope",
    context: "Client requesting additional payment gateway integration not in original scope.",
    recommendation: "Accept with change order (+$8K, +2 weeks)",
    createdBy: "DCOL",
    createdAt: "2024-01-15",
    daysOpen: 3,
  },
  {
    id: "ESC-002",
    client: "Virtu-Meet",
    workItem: "Mobile app performance improvements",
    type: "Architecture",
    context: "Need to decide between native rebuild vs. optimization of existing React Native.",
    recommendation: "Proceed with targeted optimization (lower risk, faster delivery)",
    createdBy: "DCOL",
    createdAt: "2024-01-14",
    daysOpen: 4,
  },
];

const typeColors: Record<Escalation["type"], string> = {
  Architecture: "bg-primary/10 text-primary",
  Pricing: "bg-success/10 text-success",
  Scope: "bg-warning/10 text-warning",
  "Client Risk": "bg-destructive/10 text-destructive",
  Legal: "bg-muted text-muted-foreground",
};

export function PendingDecisions() {
  return (
    <Card className="shadow-card">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">
            Pending Decisions
          </CardTitle>
          <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-destructive text-destructive-foreground">
            {pendingDecisions.length} awaiting
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {pendingDecisions.map((escalation) => (
          <div
            key={escalation.id}
            className="p-4 rounded-lg bg-background border border-border hover:border-accent/30 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-foreground">{escalation.id}</span>
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[escalation.type]}`}>
                  {escalation.type}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                {escalation.daysOpen}d open
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-1">{escalation.client}</p>
            <h4 className="font-medium text-foreground mb-3">{escalation.workItem}</h4>

            <div className="p-3 rounded-md bg-muted/50 mb-3">
              <p className="text-sm text-foreground mb-2">{escalation.context}</p>
              <div className="flex items-start gap-2 pt-2 border-t border-border">
                <ArrowRight className="h-4 w-4 text-accent mt-0.5 shrink-0" />
                <p className="text-sm font-medium text-accent">{escalation.recommendation}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="flex items-center gap-1 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                Filed by {escalation.createdBy}
              </span>
              <Button size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                Make Decision
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
