import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Trash2, Calendar, User, ExternalLink } from "lucide-react";
import { Risk, RiskStatus, Severity, RiskType } from "./RiskFormModal";

interface RiskDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  risk: Risk | null;
  onEdit: (risk: Risk) => void;
  onDelete: (riskId: string) => void;
  onStatusChange: (riskId: string, status: RiskStatus) => void;
  canEdit: boolean;
}

const severityStyles: Record<Severity, string> = {
  High: "bg-destructive text-destructive-foreground",
  Med: "bg-warning text-warning-foreground",
  Low: "bg-muted text-muted-foreground",
};

const statusStyles: Record<RiskStatus, string> = {
  Open: "bg-destructive/10 text-destructive border-destructive/20",
  Mitigating: "bg-warning/10 text-warning border-warning/20",
  Resolved: "bg-success/10 text-success border-success/20",
};

const typeStyles: Record<RiskType, string> = {
  Scope: "bg-primary/10 text-primary",
  Timeline: "bg-warning/10 text-warning",
  Tech: "bg-accent/10 text-accent",
  Client: "bg-destructive/10 text-destructive",
  Quality: "bg-muted text-muted-foreground",
  Dependency: "bg-secondary text-secondary-foreground",
};

export function RiskDetailModal({
  open,
  onOpenChange,
  risk,
  onEdit,
  onDelete,
  onStatusChange,
  canEdit,
}: RiskDetailModalProps) {
  if (!risk) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between pr-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-mono text-muted-foreground">{risk.id}</span>
                <Badge className={severityStyles[risk.severity]}>{risk.severity}</Badge>
                <Badge variant="outline" className={typeStyles[risk.type]}>
                  {risk.type}
                </Badge>
              </div>
              <DialogTitle className="text-xl">{risk.description}</DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status with inline change */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Status:</span>
              {canEdit ? (
                <Select
                  value={risk.status}
                  onValueChange={(value: RiskStatus) => onStatusChange(risk.id, value)}
                >
                  <SelectTrigger className="w-[140px] h-8">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Open">Open</SelectItem>
                    <SelectItem value="Mitigating">Mitigating</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge variant="outline" className={statusStyles[risk.status]}>
                  {risk.status}
                </Badge>
              )}
            </div>
            {canEdit && (
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    onOpenChange(false);
                    onEdit(risk);
                  }}
                >
                  <Pencil className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4 mr-1" />
                      Delete
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Risk</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this risk? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                          onDelete(risk.id);
                          onOpenChange(false);
                        }}
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
          </div>

          {/* Work Item Link */}
          <div className="p-4 rounded-lg border border-border">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Linked Work Item</h4>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{risk.workItemTitle}</p>
                <p className="text-sm text-muted-foreground">
                  {risk.workItemId} • {risk.client}
                </p>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mitigation Plan */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="text-sm font-medium text-muted-foreground mb-2">Mitigation Plan</h4>
            <p className="text-foreground">
              {risk.mitigationPlan || <span className="text-muted-foreground italic">No mitigation plan defined</span>}
            </p>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Owner:</span>
              <span className="font-medium">{risk.owner}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Due:</span>
              <span className="font-medium">{risk.dueDate}</span>
            </div>
          </div>

          {/* Timestamps */}
          <div className="pt-4 border-t text-xs text-muted-foreground">
            <div className="flex justify-between">
              <span>Created: {risk.createdAt}</span>
              <span>Last Updated: {risk.updatedAt}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
