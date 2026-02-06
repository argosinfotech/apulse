import { WorkItem, WorkItemStatus } from "./WorkItemFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, Clock, User, Tag, Pencil, Trash2, ExternalLink, 
  AlertTriangle, Flag, Layers, MessageSquare
} from "lucide-react";

interface WorkItemDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workItem: WorkItem | null;
  onEdit: (workItem: WorkItem) => void;
  onDelete: (workItem: WorkItem) => void;
  onStatusChange: (workItem: WorkItem, status: WorkItemStatus) => void;
  canEdit: boolean;
}

export function WorkItemDetailModal({
  open,
  onOpenChange,
  workItem,
  onEdit,
  onDelete,
  onStatusChange,
  canEdit,
}: WorkItemDetailModalProps) {
  if (!workItem) return null;

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "red": return "bg-destructive text-destructive-foreground";
      case "yellow": return "bg-warning text-warning-foreground";
      default: return "bg-success text-success-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "P0": return "bg-destructive text-destructive-foreground";
      case "P1": return "bg-warning text-warning-foreground";
      case "P2": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Bug": return "bg-destructive/10 text-destructive border-destructive/30";
      case "Feature": return "bg-primary/10 text-primary border-primary/30";
      case "SEO": return "bg-success/10 text-success border-success/30";
      case "Ops": return "bg-muted text-muted-foreground";
      default: return "bg-accent/10 text-accent border-accent/30";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Triage": return "bg-muted text-muted-foreground";
      case "In Progress": return "bg-primary/10 text-primary border-primary/30";
      case "Blocked": return "bg-destructive/10 text-destructive border-destructive/30";
      case "Ready for Review": return "bg-warning/10 text-warning border-warning/30";
      case "Client Review": return "bg-accent/10 text-accent border-accent/30";
      case "Done": return "bg-success/10 text-success border-success/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const statusOptions: WorkItemStatus[] = [
    "Triage", "In Progress", "Blocked", "Ready for Review", "Client Review", "Done"
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{workItem.id}</DialogTitle>
            <Badge variant="outline" className={getStatusColor(workItem.status)}>
              {workItem.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <h3 className="text-base font-medium text-foreground">{workItem.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">{workItem.client}</p>
          </div>

          <Separator />

          {/* Key Info */}
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Badge className={getPriorityColor(workItem.priority)}>{workItem.priority}</Badge>
              <p className="text-xs text-muted-foreground mt-1">Priority</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Badge className={getRiskColor(workItem.risk)}>
                {workItem.risk.charAt(0).toUpperCase() + workItem.risk.slice(1)}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">Risk</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <Badge variant="outline">{workItem.size}</Badge>
              <p className="text-xs text-muted-foreground mt-1">Size</p>
            </div>
          </div>

          {/* Risk Reason */}
          {workItem.riskReason && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/30">
              <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-warning">Risk Reason</p>
                <p className="text-sm text-foreground">{workItem.riskReason}</p>
              </div>
            </div>
          )}

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="outline" className={getCategoryColor(workItem.category)}>
                {workItem.category}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Owner:</span>
              <span className="font-medium text-foreground">{workItem.owner}</span>
            </div>
            {workItem.blockedBy && (
              <div className="flex items-center gap-2">
                <Flag className="h-4 w-4 text-destructive" />
                <span className="text-muted-foreground">Blocked By:</span>
                <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                  {workItem.blockedBy}
                </Badge>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Target:</span>
              <span className="font-medium text-foreground">{workItem.targetDate}</span>
            </div>
            {workItem.startedDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Started:</span>
                <span className="font-medium text-foreground">{workItem.startedDate}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Updated:</span>
              <span className="font-medium text-foreground">{workItem.lastUpdated}</span>
            </div>
          </div>

          {/* Jira Links */}
          {workItem.jiraLinks.length > 0 && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Jira Links
                </p>
                <div className="flex flex-wrap gap-2">
                  {workItem.jiraLinks.map((link) => (
                    <a
                      key={link}
                      href={link.startsWith("http") ? link : `#${link}`}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {link}
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Notes */}
          {(workItem.clientStatusNote || workItem.internalNotes) && (
            <>
              <Separator />
              <div className="space-y-3">
                {workItem.clientStatusNote && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Client Status Note
                    </p>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      {workItem.clientStatusNote}
                    </p>
                  </div>
                )}
                {workItem.internalNotes && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                      <Layers className="h-4 w-4" />
                      Internal Notes
                    </p>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-2 rounded">
                      {workItem.internalNotes}
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Actions */}
          {canEdit && (
            <>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Change Status:</span>
                  <Select
                    value={workItem.status}
                    onValueChange={(value) => onStatusChange(workItem, value as WorkItemStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      onEdit(workItem);
                      onOpenChange(false);
                    }}
                  >
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => {
                      onDelete(workItem);
                      onOpenChange(false);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
