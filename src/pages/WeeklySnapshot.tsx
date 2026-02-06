import { useNavigate } from "react-router-dom";
import { Download, TrendingUp, TrendingDown, Minus, Users, Briefcase, AlertTriangle, MessageSquareWarning, History } from "lucide-react";
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
  if (trend === "Up") return <TrendingUp className="h-3.5 w-3.5 text-destructive" />;
  if (trend === "Down") return <TrendingDown className="h-3.5 w-3.5 text-success" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

export default function WeeklySnapshot() {
  const navigate = useNavigate();
  const { metrics } = currentSnapshot;

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-foreground">Weekly Snapshot</h1>
          <p className="text-sm text-muted-foreground">
            {currentSnapshot.week} • {currentSnapshot.dateRange}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/snapshot-history")}>
            <History className="h-4 w-4 mr-1" />
            History
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid - Compact */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Card className="shadow-card p-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-primary/10">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground leading-none">{metrics.activeClients}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Active Clients</p>
            </div>
          </div>
        </Card>
        <Card className="shadow-card p-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-accent/10">
              <Briefcase className="h-4 w-4 text-accent" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground leading-none">{metrics.openWorkItems}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Open Work Items</p>
            </div>
          </div>
        </Card>
        <Card className="shadow-card p-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-destructive/10">
              <AlertTriangle className="h-4 w-4 text-destructive" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground leading-none">{metrics.blockedWorkItems}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Blocked Items</p>
            </div>
          </div>
        </Card>
        <Card className="shadow-card p-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded bg-warning/10">
              <MessageSquareWarning className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-xl font-bold text-foreground leading-none">{metrics.decisionsPending}</p>
              <p className="text-xs text-muted-foreground mt-0.5">Decisions Pending</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Health Overview & Backlog - Compact */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Card className="shadow-card">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Client Health</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-success" />
                  Healthy
                </span>
                <span className="font-semibold">{metrics.activeClients - metrics.redClients - metrics.yellowClients}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-warning" />
                  At Risk
                </span>
                <span className="font-semibold">{metrics.yellowClients}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-destructive" />
                  Critical
                </span>
                <span className="font-semibold">{metrics.redClients}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Request Pipeline</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span>Open Requests</span>
                <span className="font-semibold">{metrics.openRequests}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Escalations</span>
                <span className="font-semibold">{metrics.escalationsRaised}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-xs font-medium text-muted-foreground">Backlog Trend</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <div className="flex items-center gap-2">
              <TrendIcon trend={metrics.backlogTrend} />
              <div>
                <p className="font-semibold text-sm text-foreground">{metrics.backlogTrend}</p>
                <p className="text-xs text-muted-foreground">vs last week</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Priorities and Commentary - Compact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="shadow-card">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-sm font-semibold">Top 5 Priorities</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <ol className="space-y-1.5">
              {currentSnapshot.topPriorities.map((priority, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="flex items-center justify-center w-5 h-5 rounded bg-accent/10 text-accent text-xs font-semibold shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-foreground leading-tight">{priority}</span>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="py-2 px-3">
            <CardTitle className="text-sm font-semibold">DCOL Commentary</CardTitle>
          </CardHeader>
          <CardContent className="px-3 pb-3 pt-0">
            <ul className="space-y-1.5">
              {currentSnapshot.commentary.map((comment, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-muted-foreground mt-1.5 shrink-0" />
                  <span className="text-sm text-muted-foreground leading-tight">{comment}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
