import {
  Users,
  Briefcase,
  AlertTriangle,
  MessageSquareWarning,
  TrendingUp,
  Clock,
} from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { AtRiskWorkItems } from "@/components/dashboard/AtRiskWorkItems";
import { PendingDecisions } from "@/components/dashboard/PendingDecisions";
import { ClientHealthBoard } from "@/components/dashboard/ClientHealthBoard";

export default function Dashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Good morning, Manish</h1>
          <p className="text-muted-foreground mt-1">
            Founder Monday View — Week of January 15, 2024
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          Last updated: 5 minutes ago
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Active Clients"
          value={8}
          subtitle="2 need attention"
          icon={Users}
          variant="default"
        />
        <StatCard
          title="Open Work Items"
          value={14}
          subtitle="3 blocked"
          icon={Briefcase}
          trend={{ value: 12, label: "vs last week", positive: false }}
          variant="warning"
        />
        <StatCard
          title="At Risk Items"
          value={3}
          subtitle="2 yellow, 1 red"
          icon={AlertTriangle}
          variant="destructive"
        />
        <StatCard
          title="Pending Decisions"
          value={2}
          subtitle="Oldest: 4 days"
          icon={MessageSquareWarning}
          variant="accent"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <AtRiskWorkItems />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <PendingDecisions />
        </div>
      </div>

      {/* Client Health Board - Full Width */}
      <ClientHealthBoard />
    </div>
  );
}
