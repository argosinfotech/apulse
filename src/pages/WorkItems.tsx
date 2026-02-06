import { useState } from "react";
import { Plus, Search, ExternalLink, Clock, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { StatusBadge, PriorityBadge, SizeBadge, HealthStatus, Priority } from "@/components/ui/status-badge";

type WorkItemStatus = "Triage" | "In Progress" | "Blocked" | "Ready for Review" | "Client Review" | "Done";

interface WorkItem {
  id: string;
  client: string;
  title: string;
  category: "Bug" | "Feature" | "SEO" | "Ops" | "Product";
  priority: Priority;
  size: "S" | "M" | "L" | "XL";
  status: WorkItemStatus;
  risk: HealthStatus;
  riskReason?: string;
  blockedBy?: "Client" | "Tech" | "Dependency" | "Waiting";
  jiraLinks: string[];
  targetDate: string;
  lastUpdated: string;
  daysStale: number;
}

const workItems: WorkItem[] = [
  {
    id: "WI-001",
    client: "Stephengould",
    title: "E-commerce checkout optimization",
    category: "Feature",
    priority: "P1",
    size: "L",
    status: "Blocked",
    risk: "red",
    riskReason: "Waiting on client API credentials for 5 days",
    blockedBy: "Client",
    jiraLinks: ["STEPH-123", "STEPH-124"],
    targetDate: "Jan 30",
    lastUpdated: "5 days ago",
    daysStale: 5,
  },
  {
    id: "WI-002",
    client: "Virtu-Meet",
    title: "Mobile app performance improvements",
    category: "Bug",
    priority: "P0",
    size: "M",
    status: "In Progress",
    risk: "yellow",
    riskReason: "Technical complexity higher than estimated",
    blockedBy: "Tech",
    jiraLinks: ["VM-456"],
    targetDate: "Feb 15",
    lastUpdated: "2 days ago",
    daysStale: 2,
  },
  {
    id: "WI-003",
    client: "TEL",
    title: "Dashboard redesign phase 2",
    category: "Feature",
    priority: "P2",
    size: "XL",
    status: "Client Review",
    risk: "yellow",
    riskReason: "Client unresponsive to review requests",
    blockedBy: "Client",
    jiraLinks: ["TEL-789", "TEL-790", "TEL-791"],
    targetDate: "Feb 5",
    lastUpdated: "7 days ago",
    daysStale: 7,
  },
  {
    id: "WI-004",
    client: "SOLI",
    title: "User authentication system",
    category: "Feature",
    priority: "P1",
    size: "M",
    status: "In Progress",
    risk: "green",
    jiraLinks: ["SOLI-101"],
    targetDate: "Feb 28",
    lastUpdated: "Today",
    daysStale: 0,
  },
  {
    id: "WI-005",
    client: "SpiritWorx",
    title: "Beta analytics dashboard",
    category: "Product",
    priority: "P3",
    size: "S",
    status: "Ready for Review",
    risk: "green",
    jiraLinks: ["SW-55"],
    targetDate: "Mar 10",
    lastUpdated: "1 day ago",
    daysStale: 1,
  },
];

const statusColumns: WorkItemStatus[] = ["Triage", "In Progress", "Blocked", "Ready for Review", "Client Review", "Done"];

export default function WorkItems() {
  const [view, setView] = useState<"board" | "list">("board");
  const [searchQuery, setSearchQuery] = useState("");

  const getItemsByStatus = (status: WorkItemStatus) => {
    return workItems.filter((item) => item.status === status);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Work Items</h1>
          <p className="text-muted-foreground mt-1">
            Track delivery roll-up across all clients
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <Button
              variant={view === "board" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("board")}
              className="rounded-none"
            >
              Board
            </Button>
            <Button
              variant={view === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
              className="rounded-none"
            >
              List
            </Button>
          </div>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
            <Plus className="h-4 w-4 mr-2" />
            New Work Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search work items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Board View */}
      {view === "board" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {statusColumns.map((status) => (
            <div key={status} className="min-w-[300px] shrink-0">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-foreground">{status}</h3>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
                  {getItemsByStatus(status).length}
                </span>
              </div>
              <div className="space-y-3">
                {getItemsByStatus(status).map((item) => (
                  <Card
                    key={item.id}
                    className="shadow-card hover:shadow-soft transition-all cursor-pointer"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{item.id}</span>
                          <PriorityBadge priority={item.priority} />
                        </div>
                        <StatusBadge status={item.risk} />
                      </div>

                      <h4 className="font-medium text-foreground text-sm mb-1 line-clamp-2">
                        {item.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-3">{item.client}</p>

                      {item.riskReason && (
                        <p className="text-xs text-muted-foreground mb-3 italic border-l-2 border-warning/50 pl-2">
                          {item.riskReason}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <SizeBadge size={item.size} />
                          {item.jiraLinks.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <ExternalLink className="h-3 w-3" />
                              {item.jiraLinks.length} Jira
                            </span>
                          )}
                        </div>
                        <span className={`flex items-center gap-1 text-xs ${item.daysStale > 2 ? "text-warning" : "text-muted-foreground"}`}>
                          <Clock className="h-3 w-3" />
                          {item.daysStale}d
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                {getItemsByStatus(status).length === 0 && (
                  <div className="p-4 text-center text-sm text-muted-foreground border border-dashed border-border rounded-lg">
                    No items
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* List View */}
      {view === "list" && (
        <Card className="shadow-card">
          <CardContent className="pt-4">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Title</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Priority</th>
                    <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Risk</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Target</th>
                  </tr>
                </thead>
                <tbody>
                  {workItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <td className="py-4 px-4 text-sm font-mono text-muted-foreground">{item.id}</td>
                      <td className="py-4 px-4 text-sm text-foreground">{item.client}</td>
                      <td className="py-4 px-4 text-sm font-medium text-foreground max-w-xs truncate">{item.title}</td>
                      <td className="py-4 px-4 text-center"><PriorityBadge priority={item.priority} /></td>
                      <td className="py-4 px-4 text-center"><StatusBadge status={item.risk} /></td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{item.status}</td>
                      <td className="py-4 px-4 text-sm text-muted-foreground">{item.targetDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
