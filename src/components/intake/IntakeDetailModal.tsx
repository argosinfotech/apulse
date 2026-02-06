import { useState, useRef } from "react";
import { IntakeRequest, IntakeStatus, IntakeNote, IntakeNoteAttachment } from "./IntakeFormModal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
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
import { Calendar, Clock, User, MessageSquare, Tag, ArrowRight, Pencil, Trash2, Send, Plus, Paperclip, X, FileText, Image, File, Building2, Mail } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

interface IntakeDetailModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: IntakeRequest | null;
  onEdit: (request: IntakeRequest) => void;
  onDelete: (request: IntakeRequest) => void;
  onStatusChange: (request: IntakeRequest, status: IntakeStatus) => void;
  onConvert: (request: IntakeRequest) => void;
  onAddNote: (requestId: string, note: string, attachment?: IntakeNoteAttachment) => void;
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
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!request) return null;

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleAddNote = () => {
    if (newNote.trim() || selectedFile) {
      let attachment: IntakeNoteAttachment | undefined;
      if (selectedFile) {
        attachment = {
          id: `att-${Date.now()}`,
          name: selectedFile.name,
          size: formatFileSize(selectedFile.size),
          type: selectedFile.type,
        };
      }
      onAddNote(request.id, newNote.trim(), attachment);
      setNewNote("");
      setSelectedFile(null);
      setShowNoteInput(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("image/")) return Image;
    if (type.includes("pdf") || type.includes("document")) return FileText;
    return File;
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
      <DialogContent className="sm:max-w-2xl max-h-[85vh] overflow-y-auto p-0">
        {/* Header */}
        <DialogHeader className="px-4 py-3 border-b border-border bg-muted/30">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-mono text-muted-foreground">{request.id}</span>
                <Badge variant="outline" className={getTypeColor(request.type)}>
                  {request.type}
                </Badge>
                <Badge className={`${getUrgencyColor(request.urgency)} text-xs`}>
                  {request.urgency}
                </Badge>
              </div>
              <DialogTitle className="text-base font-semibold leading-tight">{request.summary}</DialogTitle>
            </div>
            <Badge variant="outline" className={`${getStatusColor(request.status)} shrink-0`}>
              {request.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="p-4 space-y-4">
          {/* Two Column Layout */}
          <div className="grid grid-cols-2 gap-4">
            {/* Left Column - Details */}
            <div className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Building2 className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Client</span>
                  <span className="font-medium text-foreground ml-auto">{request.client}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Source</span>
                  <span className="font-medium text-foreground ml-auto">{request.source}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Received</span>
                  <span className="font-medium text-foreground ml-auto">{request.intakeDate}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                  <span className="text-muted-foreground text-xs">Age</span>
                  <span className="font-medium text-foreground ml-auto">{request.daysOld} days</span>
                </div>
              </div>

              {/* Status Change */}
              {canEdit && request.status !== "Converted" && (
                <div className="pt-2 border-t border-border">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5">Change Status</p>
                  <Select
                    value={request.status}
                    onValueChange={(value) => onStatusChange(request, value as IntakeStatus)}
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

            {/* Right Column - Notes */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  Activity Notes
                </p>
                {canEdit && !showNoteInput && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="h-6 text-xs px-2"
                    onClick={() => setShowNoteInput(true)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add
                  </Button>
                )}
              </div>

              {/* Notes List */}
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {request.notes && request.notes.length > 0 ? (
                  request.notes.map((note) => {
                    const FileIcon = note.attachment ? getFileIcon(note.attachment.type) : File;
                    return (
                      <div 
                        key={note.id} 
                        className="p-2 rounded bg-muted/50 text-xs border border-border"
                      >
                        {note.text && (
                          <p className="text-foreground">{note.text}</p>
                        )}
                        {note.attachment && (
                          <div className="flex items-center gap-1.5 mt-1.5 p-1.5 rounded bg-background border border-border">
                            <FileIcon className="h-3 w-3 text-muted-foreground" />
                            <span className="text-xs text-foreground flex-1 truncate">
                              {note.attachment.name}
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-1.5 mt-1 text-[10px] text-muted-foreground">
                          <span>{note.author}</span>
                          <span>•</span>
                          <span>{note.createdAt}</span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-muted-foreground italic">No notes yet</p>
                )}
              </div>
            </div>
          </div>

          {/* Add Note Input - Full Width */}
          {showNoteInput && canEdit && (
            <div className="space-y-2 p-3 rounded border border-border bg-muted/30">
              <RichTextEditor
                placeholder="Add a note..."
                value={newNote}
                onChange={setNewNote}
                minHeight="60px"
              />
              
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
              />
              
              {selectedFile ? (
                <div className="flex items-center gap-2 p-2 rounded bg-background border border-border">
                  <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs text-foreground flex-1 truncate">{selectedFile.name}</span>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5"
                    onClick={handleRemoveFile}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="h-3 w-3 mr-1" />
                  Attach
                </Button>
              )}

              <div className="flex items-center gap-2">
                <Button 
                  size="sm" 
                  className="h-7 text-xs"
                  onClick={handleAddNote} 
                  disabled={!newNote.trim() && !selectedFile}
                >
                  <Send className="h-3 w-3 mr-1" />
                  Add Note
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost" 
                  className="h-7 text-xs"
                  onClick={() => {
                    setShowNoteInput(false);
                    setNewNote("");
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          {canEdit && request.status !== "Converted" && (
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-border">
              {request.status === "Accepted" && (
                <Button
                  size="sm"
                  className="h-7 text-xs bg-success hover:bg-success/90"
                  onClick={() => {
                    onConvert(request);
                    onOpenChange(false);
                  }}
                >
                  <ArrowRight className="h-3 w-3 mr-1" />
                  Convert to Work Item
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  onEdit(request);
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
                  onDelete(request);
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
