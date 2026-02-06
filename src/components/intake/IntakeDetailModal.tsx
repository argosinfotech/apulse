import { useState } from "react";
import { IntakeRequest, IntakeStatus, IntakeNote } from "./IntakeFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
import { Calendar, Clock, User, MessageSquare, Tag, ArrowRight, Pencil, Trash2, Send, Plus } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface IntakeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: IntakeRequest | null;
  onEdit: (request: IntakeRequest) => void;
  onDelete: (request: IntakeRequest) => void;
  onStatusChange: (request: IntakeRequest, status: IntakeStatus) => void;
  onConvert: (request: IntakeRequest) => void;
  onAddNote: (requestId: string, note: string) => void;
  canEdit: boolean;
}

export function IntakeDetailModal({
  open,
  onOpenChange,
  request,
  onEdit,
  onDelete,
  onStatusChange,
  onConvert,
  onAddNote,
  canEdit,
}: IntakeDetailModalProps) {
  const { user } = useAuth();
  const [newNote, setNewNote] = useState("");
  const [showNoteInput, setShowNoteInput] = useState(false);

  if (!request) return null;

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote(request.id, newNote.trim());
      setNewNote("");
      setShowNoteInput(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "Critical": return "bg-destructive text-destructive-foreground";
      case "High": return "bg-warning text-warning-foreground";
      case "Medium": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Bug": return "bg-destructive/10 text-destructive border-destructive/30";
      case "Feature": return "bg-primary/10 text-primary border-primary/30";
      case "Enhancement": return "bg-accent/10 text-accent border-accent/30";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New": return "bg-primary/10 text-primary border-primary/30";
      case "Need Client Info": return "bg-warning/10 text-warning border-warning/30";
      case "Accepted": return "bg-success/10 text-success border-success/30";
      case "Rejected": return "bg-destructive/10 text-destructive border-destructive/30";
      case "Converted": return "bg-muted text-muted-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  const statusOptions: IntakeStatus[] = ["New", "Need Client Info", "Accepted", "Rejected"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">{request.id}</DialogTitle>
            <Badge variant="outline" className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div>
            <h3 className="text-base font-medium text-foreground">{request.summary}</h3>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Client:</span>
              <span className="font-medium text-foreground">{request.client}</span>
            </div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Type:</span>
              <Badge variant="outline" className={getTypeColor(request.type)}>
                {request.type}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Source:</span>
              <span className="font-medium text-foreground">{request.source}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Age:</span>
              <span className="font-medium text-foreground">{request.daysOld} days</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">Received:</span>
              <span className="font-medium text-foreground">{request.intakeDate}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">Urgency:</span>
              <Badge className={getUrgencyColor(request.urgency)}>
                {request.urgency}
              </Badge>
            </div>
          </div>

          {/* Notes Thread */}
          <Separator />
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-foreground">Activity Notes</h4>
              {canEdit && !showNoteInput && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowNoteInput(true)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  Add Note
                </Button>
              )}
            </div>

            {/* Add Note Input */}
            {showNoteInput && canEdit && (
              <div className="mb-3 space-y-2">
                <Textarea
                  placeholder="Add a note (e.g., 'Asked client for date range requirements via email')"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="resize-none"
                  rows={2}
                />
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={handleAddNote} disabled={!newNote.trim()}>
                    <Send className="h-3 w-3 mr-1" />
                    Add Note
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={() => {
                      setShowNoteInput(false);
                      setNewNote("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {/* Notes List */}
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {request.notes && request.notes.length > 0 ? (
                request.notes.map((note) => (
                  <div 
                    key={note.id} 
                    className="p-2 rounded bg-muted/50 text-sm"
                  >
                    <p className="text-foreground">{note.text}</p>
                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                      <span>{note.author}</span>
                      <span>•</span>
                      <span>{note.createdAt}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground italic">No notes yet</p>
              )}
            </div>
          </div>

          {/* Actions */}
          {canEdit && request.status !== "Converted" && (
            <>
              <Separator />
              <div className="space-y-3">
                {/* Status Change */}
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Change Status:</span>
                  <Select
                    value={request.status}
                    onValueChange={(value) => onStatusChange(request, value as IntakeStatus)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {request.status === "Accepted" && (
                    <Button
                      onClick={() => {
                        onConvert(request);
                        onOpenChange(false);
                      }}
                      className="bg-success hover:bg-success/90"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Convert to Work Item
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      onEdit(request);
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
                      onDelete(request);
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
