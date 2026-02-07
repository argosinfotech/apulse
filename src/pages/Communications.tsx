import { useState } from "react";
import { Plus, Search, Mail, MessageSquare, ExternalLink, Copy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useCommunications } from "@/contexts/CommunicationsContext";
import { ComposeThreadModal } from "@/components/communications/ComposeThreadModal";
import { ThreadDetailModal } from "@/components/communications/ThreadDetailModal";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";

export default function Communications() {
  const { threads, getUnreadCountForDCOL } = useCommunications();
  const [searchQuery, setSearchQuery] = useState("");
  const [composeOpen, setComposeOpen] = useState(false);
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);

  const selectedThread = threads.find((t) => t.id === selectedThreadId) || null;
  const unreadCount = getUnreadCountForDCOL();

  const filteredThreads = threads.filter((thread) => {
    const query = searchQuery.toLowerCase();
    return (
      thread.subject.toLowerCase().includes(query) ||
      thread.clientName.toLowerCase().includes(query) ||
      thread.messages.some((m) => m.content.toLowerCase().includes(query))
    );
  });

  const copyLink = (accessToken: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = `${window.location.origin}/c/${accessToken}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link copied",
      description: "Client access link has been copied to clipboard.",
    });
  };

  const openPreview = (accessToken: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`/c/${accessToken}`, "_blank");
  };

  const getUnreadCountForThread = (threadId: string) => {
    const thread = threads.find((t) => t.id === threadId);
    if (!thread) return 0;
    return thread.messages.filter((m) => m.sender === "client" && !m.isRead).length;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Communications</h1>
          <p className="text-muted-foreground mt-1">
            Client communication threads
            {unreadCount > 0 && (
              <Badge variant="destructive" className="ml-2">
                {unreadCount} unread
              </Badge>
            )}
          </p>
        </div>
        <Button 
          className="bg-accent hover:bg-accent/90 text-accent-foreground"
          onClick={() => setComposeOpen(true)}
        >
          <Plus className="h-4 w-4 mr-2" />
          New Thread
        </Button>
      </div>

      {/* Search */}
      <Card className="shadow-card">
        <CardContent className="py-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search threads..." 
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Threads List */}
      <Card className="shadow-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold">Communication Threads</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredThreads.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No communication threads found.</p>
              <p className="text-sm mt-1">Click "New Thread" to start a conversation with a client.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredThreads.map((thread) => {
                const unread = getUnreadCountForThread(thread.id);
                const lastMessage = thread.messages[thread.messages.length - 1];

                return (
                  <div
                    key={thread.id}
                    className={cn(
                      "p-4 rounded-lg border cursor-pointer transition-all",
                      unread > 0
                        ? "bg-accent/5 border-accent/30 hover:border-accent"
                        : "bg-background border-border hover:border-accent/30"
                    )}
                    onClick={() => setSelectedThreadId(thread.id)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-foreground truncate">
                            {thread.subject}
                          </span>
                          {unread > 0 && (
                            <Badge variant="destructive" className="text-xs">
                              {unread} new
                            </Badge>
                          )}
                          <Badge
                            variant={thread.status === "active" ? "outline" : "secondary"}
                            className="text-xs"
                          >
                            {thread.status}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <span className="font-medium">{thread.clientName}</span>
                          {thread.workItemTitle && (
                            <>
                              <span>•</span>
                              <span className="truncate">{thread.workItemTitle}</span>
                            </>
                          )}
                        </div>

                        {lastMessage && (
                          <p className="text-sm text-muted-foreground line-clamp-1">
                            <span className="font-medium">
                              {lastMessage.sender === "dcol" ? "You" : lastMessage.senderName}:
                            </span>{" "}
                            {lastMessage.content.replace(/<[^>]*>/g, "").substring(0, 100)}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-col items-end gap-2">
                        <span className="text-xs text-muted-foreground whitespace-nowrap">
                          {thread.lastMessageAt}
                        </span>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => copyLink(thread.accessToken, e)}
                            title="Copy client link"
                          >
                            <Copy className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={(e) => openPreview(thread.accessToken, e)}
                            title="Preview client view"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <ComposeThreadModal open={composeOpen} onOpenChange={setComposeOpen} />
      <ThreadDetailModal
        thread={selectedThread}
        open={!!selectedThreadId}
        onOpenChange={(open) => !open && setSelectedThreadId(null)}
      />
    </div>
  );
}
