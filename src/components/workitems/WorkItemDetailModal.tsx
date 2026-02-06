import { WorkItem, WorkItemStatus } from "./WorkItemFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Calendar, Clock, User, Tag, Pencil, Trash2, ExternalLink, 
  AlertTriangle, Flag, MessageSquare, FileText, Building2
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
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">{workItem.id}</span>
                <Badge variant="outline" className={getCategoryColor(workItem.category)}>
                  {workItem.category}
                </Badge>
              </div>
              <DialogTitle className="text-base font-semibold leading-tight">{workItem.title}</DialogTitle>
            </div>
            <Badge variant="outline" className={`${getStatusColor(workItem.status)} shrink-0`}>
              {workItem.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column - Key Metrics */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center p-2 rounded bg-muted/50 border border-border">
                  <Badge className={`${getPriorityColor(workItem.priority)} text-xs`}>{workItem.priority}</Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">Priority</p>
                </div>
                <div className="text-center p-2 rounded bg-muted/50 border border-border">
                  <Badge className={`${getRiskColor(workItem.risk)} text-xs`}>
                    {workItem.risk.charAt(0).toUpperCase() + workItem.risk.slice(1)}
                  </Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">Risk</p>
                </div>
                <div className="text-center p-2 rounded bg-muted/50 border border-border">
                  <Badge variant="outline" className="text-xs">{workItem.size}</Badge>
                  <p className="text-[10px] text-muted-foreground mt-1">Size</p>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Client</span>
                  <span className="font-medium text-foreground ml-auto">{workItem.client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Owner</span>
                  <span className="font-medium text-foreground ml-auto">{workItem.owner}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Target</span>
                  <span className="font-medium text-foreground ml-auto">{workItem.targetDate}</span>
                </div>
                {workItem.startedDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground text-xs">Started</span>
                    <span className="font-medium text-foreground ml-auto">{workItem.startedDate}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Updated</span>
                  <span className="font-medium text-foreground ml-auto">{workItem.lastUpdated}</span>
                </div>
              </div>
            </div>

            {/* Right Column - Status & Actions */}
            <div className="space-y-3">
              {/* Risk Alert */}
              {workItem.riskReason && (
                <div className="flex items-start gap-2 p-2 rounded bg-warning/10 border border-warning/30">
                  <AlertTriangle className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-warning">Risk Reason</p>
                    <p className="text-xs text-foreground">{workItem.riskReason}</p>
                  </div>
                </div>
              )}

              {/* Blocked By */}
              {workItem.blockedBy && (
                <div className="flex items-start gap-2 p-2 rounded bg-destructive/10 border border-destructive/30">
                  <Flag className="h-3.5 w-3.5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-destructive">Blocked By</p>
                    <p className="text-xs text-foreground">{workItem.blockedBy}</p>
                  </div>
                </div>
              )}

              {/* Jira Links */}
              {workItem.jiraLinks.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1.5 flex items-center gap-1">
                    <ExternalLink className="h-3 w-3" />
                    Jira Links
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {workItem.jiraLinks.map((link) => (
                      <a
                        key={link}
                        href={link.startsWith("http") ? link : `#${link}`}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-primary/10 text-primary text-xs hover:bg-primary/20 transition-colors"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Status Change */}
              {canEdit && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Change Status</p>
                  <Select
                    value={workItem.status}
                    onValueChange={(value) => onStatusChange(workItem, value as WorkItemStatus)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status} className="text-xs">{status}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          {/* Notes Section - Full Width */}
          {(workItem.clientStatusNote || workItem.internalNotes) && (
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
              {workItem.clientStatusNote && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <MessageSquare className="h-3 w-3" />
                    Client Status Note
                  </p>
                  <p className="text-xs text-foreground bg-muted/50 p-2 rounded border border-border">
                    {workItem.clientStatusNote}
                  </p>
                </div>
              )}
              {workItem.internalNotes && (
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1 flex items-center gap-1">
                    <FileText className="h-3 w-3" />
                    Internal Notes
                  </p>
                  <p className="text-xs text-foreground bg-muted/50 p-2 rounded border border-border">
                    {workItem.internalNotes}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          {canEdit && (
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  onEdit(workItem);
                  onOpenChange(false);
                }}
              >
                <Pencil className="h-3 w-3 mr-1" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs text-destructive hover:bg-destructive/10"
                onClick={() => {
                  onDelete(workItem);
                  onOpenChange(false);
                }}
              >
                <Trash2 className="h-3 w-3 mr-1" />
                Delete
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
