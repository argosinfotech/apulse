import { useState, useRef } from "react";
import { IntakeRequest, IntakeStatus, IntakeNote, IntakeNoteAttachment } from "./IntakeFormModal";
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
import { Calendar, Clock, User, MessageSquare, Tag, ArrowRight, Pencil, Trash2, Send, Plus, Paperclip, X, FileText, Image, File } from "lucide-react";
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
              <div className="mb-3 space-y-2 p-3 rounded-lg border border-border bg-muted/30">
                <Textarea
                  placeholder="Add a note (e.g., 'Asked client for date range requirements via email')"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="resize-none bg-background"
                  rows={2}
                />
                
                {/* File Attachment */}
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileSelect}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.txt,.csv,.xls,.xlsx"
                />
                
                {selectedFile ? (
                  <div className="flex items-center gap-2 p-2 rounded bg-background border border-border">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-foreground flex-1 truncate">{selectedFile.name}</span>
                    <span className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6"
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
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Paperclip className="h-3 w-3 mr-1" />
                    Attach File
                  </Button>
                )}

                <div className="flex items-center gap-2 pt-1">
                  <Button 
                    size="sm" 
                    onClick={handleAddNote} 
                    disabled={!newNote.trim() && !selectedFile}
                  >
                    <Send className="h-3 w-3 mr-1" />
                    Add Note
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
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

            {/* Notes List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {request.notes && request.notes.length > 0 ? (
                request.notes.map((note) => {
                  const FileIcon = note.attachment ? getFileIcon(note.attachment.type) : File;
                  return (
                    <div 
                      key={note.id} 
                      className="p-3 rounded-lg bg-muted/50 text-sm"
                    >
                      {note.text && (
                        <p className="text-foreground">{note.text}</p>
                      )}
                      {note.attachment && (
                        <div className="flex items-center gap-2 mt-2 p-2 rounded bg-background border border-border">
                          <FileIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground flex-1 truncate">
                            {note.attachment.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {note.attachment.size}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                        <span>{note.author}</span>
                        <span>•</span>
                        <span>{note.createdAt}</span>
                      </div>
                    </div>
                  );
                })
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
