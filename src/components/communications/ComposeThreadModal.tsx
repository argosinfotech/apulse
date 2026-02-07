import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { useCommunications } from "@/contexts/CommunicationsContext";
import { useDCOLs } from "@/contexts/DCOLContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Copy, ExternalLink } from "lucide-react";

interface ComposeThreadModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Mock work items - in real app would come from context/API
const mockWorkItems = [
  { id: "WI-001", title: "E-commerce Checkout Integration", clientId: "C-001" },
  { id: "WI-002", title: "Dashboard Redesign", clientId: "C-003" },
  { id: "WI-003", title: "Mobile App Performance", clientId: "C-002" },
  { id: "WI-004", title: "Authentication System", clientId: "C-004" },
];

export function ComposeThreadModal({ open, onOpenChange }: ComposeThreadModalProps) {
  const { createThread } = useCommunications();
  const { clients } = useDCOLs();
  const { user } = useAuth();

  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [selectedWorkItemId, setSelectedWorkItemId] = useState<string>("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [createdThread, setCreatedThread] = useState<{ id: string; accessToken: string } | null>(null);

  const selectedClient = clients.find((c) => c.id === selectedClientId);
  const filteredWorkItems = mockWorkItems.filter((wi) => wi.clientId === selectedClientId);
  const selectedWorkItem = mockWorkItems.find((wi) => wi.id === selectedWorkItemId);

  const handleSubmit = () => {
    if (!selectedClientId || !subject || !message || !clientEmail) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const thread = createThread({
      clientId: selectedClientId,
      clientName: selectedClient?.name || "",
      clientEmail,
      subject,
      workItemId: selectedWorkItemId || undefined,
      workItemTitle: selectedWorkItem?.title || undefined,
      initialMessage: message,
      createdBy: user?.name || "Unknown",
    });

    setCreatedThread({ id: thread.id, accessToken: thread.accessToken });

    toast({
      title: "Thread created",
      description: "Communication thread has been created successfully.",
    });
  };

  const handleClose = () => {
    setSelectedClientId("");
    setSelectedWorkItemId("");
    setSubject("");
    setMessage("");
    setClientEmail("");
    setCreatedThread(null);
    onOpenChange(false);
  };

  const copyLink = () => {
    if (createdThread) {
      const link = `${window.location.origin}/c/${createdThread.accessToken}`;
      navigator.clipboard.writeText(link);
      toast({
        title: "Link copied",
        description: "Client access link has been copied to clipboard.",
      });
    }
  };

  const getPublicLink = () => {
    if (createdThread) {
      return `${window.location.origin}/c/${createdThread.accessToken}`;
    }
    return "";
  };

  if (createdThread) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Thread Created Successfully</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground">
              Your communication thread has been created. Share this link with the client so they can view and reply:
            </p>

            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <code className="text-xs flex-1 break-all">{getPublicLink()}</code>
              <Button variant="ghost" size="icon" onClick={copyLink}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <h4 className="font-medium text-sm mb-2">What happens next?</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Client clicks the link to view your message</li>
                <li>• They can reply directly from that page</li>
                <li>• All replies appear in your Communications tab</li>
                <li>• No login required for the client</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => window.open(getPublicLink(), "_blank")}>
                <ExternalLink className="h-4 w-4 mr-2" />
                Preview Link
              </Button>
              <Button onClick={handleClose}>Done</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New Communication Thread</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Client Selection */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Client *</Label>
              <Select value={selectedClientId} onValueChange={(val) => {
                setSelectedClientId(val);
                setSelectedWorkItemId("");
              }}>
                <SelectTrigger>
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Client Email *</Label>
              <Input
                type="email"
                placeholder="client@example.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Work Item (Optional) */}
          <div className="space-y-2">
            <Label>Related Work Item (Optional)</Label>
            <Select
              value={selectedWorkItemId}
              onValueChange={setSelectedWorkItemId}
              disabled={!selectedClientId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select work item (optional)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {filteredWorkItems.map((wi) => (
                  <SelectItem key={wi.id} value={wi.id}>
                    {wi.id}: {wi.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label>Subject *</Label>
            <Input
              placeholder="e.g., Weekly Status Update"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label>Message *</Label>
            <RichTextEditor
              value={message}
              onChange={setMessage}
              placeholder="Write your message to the client..."
              minHeight="150px"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>
              Create Thread
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
