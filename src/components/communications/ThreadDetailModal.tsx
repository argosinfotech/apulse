import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RichTextEditor } from "@/components/ui/rich-text-editor";
import { Badge } from "@/components/ui/badge";
import { useCommunications, CommunicationThread } from "@/contexts/CommunicationsContext";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Copy, ExternalLink, Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThreadDetailModalProps {
  thread: CommunicationThread | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ThreadDetailModal({ thread, open, onOpenChange }: ThreadDetailModalProps) {
  const { addMessage, markMessagesAsRead, closeThread } = useCommunications();
  const { user } = useAuth();
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    if (thread && open) {
      // Mark client messages as read when DCOL views the thread
      markMessagesAsRead(thread.id, "client");
    }
  }, [thread, open, markMessagesAsRead]);

  if (!thread) return null;

  const handleSendReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Empty message",
        description: "Please write a message before sending.",
        variant: "destructive",
      });
      return;
    }

    addMessage(thread.id, replyContent, "dcol", user?.name || "Unknown");
    setReplyContent("");
    toast({
      title: "Reply sent",
      description: "Your message has been added to the thread.",
    });
  };

  const handleCloseThread = () => {
    closeThread(thread.id);
    toast({
      title: "Thread closed",
      description: "This communication thread has been closed.",
    });
    onOpenChange(false);
  };

  const copyLink = () => {
    const link = `${window.location.origin}/c/${thread.accessToken}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Client access link has been copied to clipboard.",
    });
  };

  const getPublicLink = () => `${window.location.origin}/c/${thread.accessToken}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-lg mb-1">{thread.subject}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{thread.clientName}</span>
                <span>•</span>
                <span>{thread.clientEmail}</span>
                {thread.workItemTitle && (
                  <>
                    <span>•</span>
                    <Badge variant="outline" className="text-xs">
                      {thread.workItemId}: {thread.workItemTitle}
                    </Badge>
                  </>
                )}
              </div>
            </div>
            <Badge variant={thread.status === "active" ? "default" : "secondary"}>
              {thread.status}
            </Badge>
          </div>

          {/* Public link section */}
          <div className="flex items-center gap-2 mt-3 p-2 bg-muted/50 rounded-lg text-xs">
            <span className="text-muted-foreground">Client Link:</span>
            <code className="flex-1 truncate">{getPublicLink()}</code>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyLink}>
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => window.open(getPublicLink(), "_blank")}
            >
              <ExternalLink className="h-3 w-3" />
            </Button>
          </div>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 py-4 -mx-6 px-6">
          <div className="space-y-4">
            {thread.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.sender === "dcol" ? "justify-end" : "justify-start"
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg p-4",
                    message.sender === "dcol"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  )}
                >
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <span className={cn(
                      "text-xs font-medium",
                      message.sender === "dcol" ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {message.senderName}
                    </span>
                    <span className={cn(
                      "text-xs",
                      message.sender === "dcol" ? "text-primary-foreground/60" : "text-muted-foreground/60"
                    )}>
                      {message.createdAt}
                    </span>
                  </div>
                  <div
                    className={cn(
                      "prose prose-sm max-w-none",
                      message.sender === "dcol" && "prose-invert",
                      "[&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5"
                    )}
                    dangerouslySetInnerHTML={{ __html: message.content }}
                  />
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Reply section */}
        {thread.status === "active" ? (
          <div className="pt-4 border-t space-y-3">
            <RichTextEditor
              value={replyContent}
              onChange={setReplyContent}
              placeholder="Write your reply..."
              minHeight="80px"
            />
            <div className="flex justify-between">
              <Button variant="outline" size="sm" onClick={handleCloseThread}>
                <X className="h-4 w-4 mr-2" />
                Close Thread
              </Button>
              <Button size="sm" onClick={handleSendReply}>
                <Send className="h-4 w-4 mr-2" />
                Send Reply
              </Button>
            </div>
          </div>
        ) : (
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground text-center">
              This thread has been closed.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
