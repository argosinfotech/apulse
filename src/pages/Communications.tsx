import { Plus, Search, Mail, Phone, Video, MessageSquare } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type CommType = "Weekly Update" | "Issue Update" | "Demo Summary" | "Follow-up" | "Approval Request";

interface Communication {
  id: string;
  client: string;
  workItem?: string;
  type: CommType;
  date: string;
  sentBy: "DCOL" | "Manish";
  summary: string;
  channel: "Email" | "Call" | "Meeting" | "WhatsApp";
}

const communications: Communication[] = [
  {
    id: "COMM-001",
    client: "Stephengould",
    type: "Weekly Update",
    date: "Jan 15, 2024",
    sentBy: "DCOL",
    summary: "Weekly status update sent. Covered checkout progress, waiting on API credentials, timeline impact if delayed.",
    channel: "Email",
  },
  {
    id: "COMM-002",
    client: "Virtu-Meet",
    workItem: "Mobile app performance improvements",
    type: "Issue Update",
    date: "Jan 14, 2024",
    sentBy: "DCOL",
    summary: "Notified client about performance complexity. Provided options for moving forward with optimization approach.",
    channel: "Email",
  },
  {
    id: "COMM-003",
    client: "TEL",
    type: "Demo Summary",
    date: "Jan 12, 2024",
    sentBy: "Manish",
    summary: "Demoed Phase 2 dashboard redesign. Client impressed with new analytics. Requested minor color adjustments.",
    channel: "Meeting",
  },
  {
    id: "COMM-004",
    client: "SOLI",
    type: "Weekly Update",
    date: "Jan 11, 2024",
    sentBy: "DCOL",
    summary: "Auth system on track. Demo scheduled for Jan 25. No blockers.",
    channel: "Email",
  },
  {
    id: "COMM-005",
    client: "Stephengould",
    type: "Follow-up",
    date: "Jan 10, 2024",
    sentBy: "DCOL",
    summary: "Follow-up email sent requesting API credentials. Third attempt. Escalating to primary contact.",
    channel: "Email",
  },
];

const channelIcons = {
  Email: Mail,
  Call: Phone,
  Meeting: Video,
  WhatsApp: MessageSquare,
};

const typeColors: Record<CommType, string> = {
  "Weekly Update": "bg-primary/10 text-primary",
  "Issue Update": "bg-warning/10 text-warning",
  "Demo Summary": "bg-accent/10 text-accent",
  "Follow-up": "bg-muted text-muted-foreground",
  "Approval Request": "bg-destructive/10 text-destructive",
};

export default function Communications() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Communications</h1>
          <p className="text-muted-foreground mt-1">
            Client-facing communication history
          </p>
        </div>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground">
          <Plus className="h-4 w-4 mr-2" />
          Log Communication
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search communications..." className="pl-10" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">All Types</Button>
              <Button variant="outline" size="sm">All Clients</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Communication Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-border" />

            <div className="space-y-6">
              {communications.map((comm) => {
                const ChannelIcon = channelIcons[comm.channel];
                return (
                  <div key={comm.id} className="relative pl-14">
                    {/* Timeline dot */}
                    <div className="absolute left-4 w-4 h-4 rounded-full bg-accent border-4 border-background" />

                    <div className="p-4 rounded-lg bg-background border border-border hover:border-accent/30 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-muted-foreground">{comm.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${typeColors[comm.type]}`}>
                            {comm.type}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ChannelIcon className="h-4 w-4" />
                          <span>{comm.date}</span>
                        </div>
                      </div>

                      <h4 className="font-medium text-foreground mb-1">{comm.client}</h4>
                      {comm.workItem && (
                        <p className="text-xs text-muted-foreground mb-2">Re: {comm.workItem}</p>
                      )}
                      <p className="text-sm text-muted-foreground">{comm.summary}</p>

                      <div className="mt-3 pt-3 border-t border-border">
                        <span className="text-xs text-muted-foreground">Sent by {comm.sentBy}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
