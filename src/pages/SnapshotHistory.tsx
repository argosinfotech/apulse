import { useNavigate } from "react-router-dom";
import { ArrowLeft, TrendingUp, TrendingDown, Minus, Download, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SnapshotSummary {
  id: string;
  week: string;
  dateRange: string;
  activeClients: number;
  openWorkItems: number;
  blockedItems: number;
  redClients: number;
  yellowClients: number;
  backlogTrend: "Up" | "Flat" | "Down";
}

const snapshotHistory: SnapshotSummary[] = [
  {
    id: "w3",
    week: "Week 3",
    dateRange: "Jan 15-19, 2024",
    activeClients: 8,
    openWorkItems: 14,
    blockedItems: 3,
    redClients: 1,
    yellowClients: 1,
    backlogTrend: "Up",
  },
  {
    id: "w2",
    week: "Week 2",
    dateRange: "Jan 8-12, 2024",
    activeClients: 8,
    openWorkItems: 12,
    blockedItems: 2,
    redClients: 0,
    yellowClients: 2,
    backlogTrend: "Flat",
  },
  {
    id: "w1",
    week: "Week 1",
    dateRange: "Jan 1-5, 2024",
    activeClients: 7,
    openWorkItems: 10,
    blockedItems: 1,
    redClients: 0,
    yellowClients: 1,
    backlogTrend: "Down",
  },
  {
    id: "w52",
    week: "Week 52",
    dateRange: "Dec 25-29, 2023",
    activeClients: 7,
    openWorkItems: 8,
    blockedItems: 0,
    redClients: 0,
    yellowClients: 0,
    backlogTrend: "Down",
  },
  {
    id: "w51",
    week: "Week 51",
    dateRange: "Dec 18-22, 2023",
    activeClients: 6,
    openWorkItems: 11,
    blockedItems: 2,
    redClients: 1,
    yellowClients: 0,
    backlogTrend: "Up",
  },
];

const TrendIcon = ({ trend }: { trend: "Up" | "Flat" | "Down" }) => {
  if (trend === "Up") return <TrendingUp className="h-3.5 w-3.5 text-destructive" />;
  if (trend === "Down") return <TrendingDown className="h-3.5 w-3.5 text-success" />;
  return <Minus className="h-3.5 w-3.5 text-muted-foreground" />;
};

const getHealthBadge = (red: number, yellow: number) => {
  if (red > 0) return <Badge className="bg-destructive/10 text-destructive border-destructive/30 text-xs px-1.5 py-0">{red} critical</Badge>;
  if (yellow > 0) return <Badge className="bg-warning/10 text-warning border-warning/30 text-xs px-1.5 py-0">{yellow} at risk</Badge>;
  return <Badge className="bg-success/10 text-success border-success/30 text-xs px-1.5 py-0">All healthy</Badge>;
};

export default function SnapshotHistory() {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate("/snapshot")} className="h-8 w-8 p-0">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Snapshot History</h1>
            <p className="text-sm text-muted-foreground">Past weekly snapshots</p>
          </div>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-1" />
          Export All
        </Button>
      </div>

      {/* Snapshot List */}
      <div className="space-y-2">
        {snapshotHistory.map((snapshot, idx) => (
          <Card 
            key={snapshot.id} 
            className={`shadow-card cursor-pointer hover:bg-muted/50 transition-colors ${idx === 0 ? 'border-accent/50' : ''}`}
            onClick={() => navigate("/snapshot")}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="min-w-[80px]">
                    <p className="font-semibold text-sm text-foreground">{snapshot.week}</p>
                    <p className="text-xs text-muted-foreground">{snapshot.dateRange}</p>
                  </div>
                  
                  <div className="hidden sm:flex items-center gap-4 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{snapshot.activeClients}</p>
                      <p className="text-xs text-muted-foreground">Clients</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{snapshot.openWorkItems}</p>
                      <p className="text-xs text-muted-foreground">Work Items</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{snapshot.blockedItems}</p>
                      <p className="text-xs text-muted-foreground">Blocked</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {getHealthBadge(snapshot.redClients, snapshot.yellowClients)}
                  
                  <div className="flex items-center gap-1">
                    <TrendIcon trend={snapshot.backlogTrend} />
                    <span className="text-xs text-muted-foreground">{snapshot.backlogTrend}</span>
                  </div>

                  <Button variant="ghost" size="sm" className="h-7 px-2">
                    <Eye className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More */}
      <div className="text-center pt-2">
        <Button variant="outline" size="sm">
          Load Earlier Snapshots
        </Button>
      </div>
    </div>
  );
}
