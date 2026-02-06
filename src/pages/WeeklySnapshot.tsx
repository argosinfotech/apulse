import { Download, TrendingUp, TrendingDown, Minus, Users, Briefcase, AlertTriangle, MessageSquareWarning } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WeeklySnapshot {
  week: string;
  dateRange: string;
  metrics: {
    activeClients: number;
    openRequests: number;
    openWorkItems: number;
    blockedWorkItems: number;
    redClients: number;
    yellowClients: number;
    escalationsRaised: number;
    decisionsPending: number;
    backlogTrend: "Up" | "Flat" | "Down";
  };
  topPriorities: string[];
  commentary: string[];
}

const currentSnapshot: WeeklySnapshot = {
  week: "Week 3",
  dateRange: "January 15-19, 2024",
  metrics: {
    activeClients: 8,
    openRequests: 4,
    openWorkItems: 14,
    blockedWorkItems: 3,
    redClients: 1,
    yellowClients: 1,
    escalationsRaised: 2,
    decisionsPending: 2,
    backlogTrend: "Up",
  },
  topPriorities: [
    "Resolve Stephengould API credentials blocker",
    "Decision on Virtu-Meet architecture approach",
    "Complete TEL dashboard review",
    "SOLI auth system demo prep",
    "SpiritWorx beta release planning",
  ],
  commentary: [
    "Stephengould block is the critical path - escalated to primary contact",
    "Virtu-Meet needs architecture decision this week to stay on timeline",
    "TEL Phase 2 pricing negotiation completed - 10% discount agreed",
    "Overall workload slightly up from last week",
    "Two invoices ready for approval totaling $20,500",
  ],
};

const TrendIcon = ({ trend }: { trend: "Up" | "Flat" | "Down" }) => {
  if (trend === "Up") return <TrendingUp className="h-4 w-4 text-destructive" />;
  if (trend === "Down") return <TrendingDown className="h-4 w-4 text-success" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
};

export default function WeeklySnapshot() {
  const { metrics } = currentSnapshot;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Weekly Snapshot</h1>
          <p className="text-muted-foreground mt-1">
            {currentSnapshot.week} • {currentSnapshot.dateRange}
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export PDF
        </Button>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metrics.activeClients}</p>
                <p className="text-xs text-muted-foreground">Active Clients</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Briefcase className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metrics.openWorkItems}</p>
                <p className="text-xs text-muted-foreground">Open Work Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-4 w-4 text-destructive" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metrics.blockedWorkItems}</p>
                <p className="text-xs text-muted-foreground">Blocked Items</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <MessageSquareWarning className="h-4 w-4 text-warning" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{metrics.decisionsPending}</p>
                <p className="text-xs text-muted-foreground">Decisions Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Overview & Backlog */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Client Health</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full bg-success" />
                  Healthy
                </span>
                <span className="font-semibold">{metrics.activeClients - metrics.redClients - metrics.yellowClients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full bg-warning" />
                  At Risk
                </span>
                <span className="font-semibold">{metrics.yellowClients}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 text-sm">
                  <span className="w-3 h-3 rounded-full bg-destructive" />
                  Critical
                </span>
                <span className="font-semibold">{metrics.redClients}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Request Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Open Requests</span>
                <span className="font-semibold">{metrics.openRequests}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Escalations Raised</span>
                <span className="font-semibold">{metrics.escalationsRaised}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Backlog Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <TrendIcon trend={metrics.backlogTrend} />
              <div>
                <p className="font-semibold text-foreground">{metrics.backlogTrend}</p>
                <p className="text-xs text-muted-foreground">vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priorities and Commentary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Top 5 Priorities This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {currentSnapshot.topPriorities.map((priority, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex items-center justify-center w-6 h-6 rounded-full bg-accent/10 text-accent text-xs font-semibold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-foreground">{priority}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">DCOL Commentary</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {currentSnapshot.commentary.map((comment, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground mt-2 shrink-0" />
                  <span className="text-sm text-muted-foreground">{comment}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
