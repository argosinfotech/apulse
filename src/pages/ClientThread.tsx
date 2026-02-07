import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useCommunications, CommunicationThread } from "@/contexts/CommunicationsContext";
import { toast } from "@/components/ui/use-toast";
import { Send, MessageSquare, Building2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.svg";

export default function ClientThread() {
  const { token } = useParams<{ token: string }>();
  const { getThreadByToken, addMessage, markMessagesAsRead } = useCommunications();
  const [thread, setThread] = useState<CommunicationThread | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [clientName, setClientName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (token) {
      const foundThread = getThreadByToken(token);
      setThread(foundThread || null);
      setIsLoading(false);

      if (foundThread) {
        // Mark DCOL messages as read when client views
        markMessagesAsRead(foundThread.id, "dcol");
      }
    }
  }, [token, getThreadByToken, markMessagesAsRead]);

  // Re-fetch thread to get updated messages
  useEffect(() => {
    if (token) {
      const interval = setInterval(() => {
        const updatedThread = getThreadByToken(token);
        if (updatedThread) {
          setThread(updatedThread);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [token, getThreadByToken]);

  const handleSendReply = () => {
    if (!replyContent.trim()) {
      toast({
        title: "Empty message",
        description: "Please write a message before sending.",
        variant: "destructive",
      });
      return;
    }

    if (!clientName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name.",
        variant: "destructive",
      });
      return;
    }

    if (thread) {
      addMessage(thread.id, `<p>${replyContent.replace(/\n/g, "</p><p>")}</p>`, "client", clientName);
      setReplyContent("");
      toast({
        title: "Reply sent",
        description: "Your message has been sent successfully.",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!thread) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardContent className="pt-6 text-center">
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Thread Not Found</h2>
            <p className="text-muted-foreground">
              This communication thread doesn't exist or the link may have expired.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-8 w-8" />
            <span className="font-semibold text-lg">Client Portal</span>
          </div>
          <Badge variant={thread.status === "active" ? "default" : "secondary"}>
            {thread.status === "active" ? "Active" : "Closed"}
          </Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Thread Info */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xl">{thread.subject}</CardTitle>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground mt-2">
              <div className="flex items-center gap-1.5">
                <Building2 className="h-4 w-4" />
                <span>{thread.clientName}</span>
              </div>
              {thread.workItemTitle && (
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>{thread.workItemTitle}</span>
                </div>
              )}
              <span>Started {thread.createdAt}</span>
            </div>
          </CardHeader>
        </Card>

        {/* Messages */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Conversation</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="max-h-[50vh]">
              <div className="space-y-4 pr-4">
                {thread.messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex",
                      message.sender === "client" ? "justify-end" : "justify-start"
                    )}
                  >
                    <div
                      className={cn(
                        "max-w-[85%] rounded-lg p-4",
                        message.sender === "client"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      )}
                    >
                      <div className="flex items-center justify-between gap-4 mb-2">
                        <span
                          className={cn(
                            "text-xs font-medium",
                            message.sender === "client"
                              ? "text-primary-foreground/80"
                              : "text-muted-foreground"
                          )}
                        >
                          {message.senderName}
                          {message.sender === "dcol" && (
                            <span className="ml-1 opacity-70">(Delivery Team)</span>
                          )}
                        </span>
                        <span
                          className={cn(
                            "text-xs",
                            message.sender === "client"
                              ? "text-primary-foreground/60"
                              : "text-muted-foreground/60"
                          )}
                        >
                          {message.createdAt}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "prose prose-sm max-w-none",
                          message.sender === "client" && "prose-invert",
                          "[&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5"
                        )}
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Reply Section */}
        {thread.status === "active" ? (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Send a Reply</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clientName">Your Name *</Label>
                <Input
                  id="clientName"
                  placeholder="Enter your name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="reply">Your Message *</Label>
                <Textarea
                  id="reply"
                  placeholder="Type your reply here..."
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  rows={4}
                />
              </div>
              <Button onClick={handleSendReply} className="w-full sm:w-auto">
                <Send className="h-4 w-4 mr-2" />
                Send Reply
              </Button>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              This conversation has been closed. Please contact support if you need further assistance.
            </CardContent>
          </Card>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          Powered by Argos InfoTech
        </div>
      </footer>
    </div>
  );
}
