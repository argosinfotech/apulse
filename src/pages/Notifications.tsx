import { useState } from "react";
import { Bell, Check, Trash2, AlertTriangle, MessageSquareWarning, CheckCircle, Inbox, Briefcase, Info, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNotifications, NotificationType } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";

const typeIcons: Record<NotificationType, React.ElementType> = {
  escalation: MessageSquareWarning,
  decision: CheckCircle,
  risk: AlertTriangle,
  intake: Inbox,
  workitem: Briefcase,
  info: Info,
};

const typeColors: Record<NotificationType, string> = {
  escalation: "text-warning bg-warning/10",
  decision: "text-success bg-success/10",
  risk: "text-destructive bg-destructive/10",
  intake: "text-primary bg-primary/10",
  workitem: "text-accent bg-accent/10",
  info: "text-muted-foreground bg-muted",
};

const typeLabels: Record<NotificationType, string> = {
  escalation: "Escalation",
  decision: "Decision",
  risk: "Risk",
  intake: "Intake",
  workitem: "Work Item",
  info: "Info",
};

export default function Notifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAll,
  } = useNotifications();

  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");

  // Filter notifications based on user role
  const visibleNotifications = notifications.filter(
    (n) => n.forRole === "all" || n.forRole === user?.role
  );

  const filteredNotifications = visibleNotifications.filter(
    (n) => typeFilter === "all" || n.type === typeFilter
  );

  const unreadNotifications = filteredNotifications.filter((n) => !n.read);
  const readNotifications = filteredNotifications.filter((n) => n.read);

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      navigate(link);
    }
  };

  const renderNotification = (notification: typeof notifications[0]) => {
    const Icon = typeIcons[notification.type];
    return (
      <div
        key={notification.id}
        className={`p-4 rounded-lg border transition-colors cursor-pointer ${
          !notification.read
            ? "bg-accent/5 border-accent/20 hover:border-accent/40"
            : "bg-background border-border hover:border-accent/30"
        }`}
        onClick={() => handleNotificationClick(notification.id, notification.link)}
      >
        <div className="flex gap-4">
          <div className={`p-2.5 rounded-lg shrink-0 h-fit ${typeColors[notification.type]}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h4 className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                    {notification.title}
                  </h4>
                  {!notification.read && (
                    <span className="w-2 h-2 rounded-full bg-accent" />
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                <div className="flex items-center gap-3 mt-2">
                  <Badge variant="outline" className="text-xs">
                    {typeLabels[notification.type]}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAsRead(notification.id);
                    }}
                  >
                    <Check className="h-4 w-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    clearNotification(notification.id);
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Stay updated on escalations, decisions, and risks
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadNotifications.length > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <Check className="h-4 w-4 mr-1" />
              Mark all read
            </Button>
          )}
          {visibleNotifications.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={clearAll}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Clear all
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Filter by type:</span>
            </div>
            <Select value={typeFilter} onValueChange={(v) => setTypeFilter(v as NotificationType | "all")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="escalation">Escalations</SelectItem>
                <SelectItem value="decision">Decisions</SelectItem>
                <SelectItem value="risk">Risks</SelectItem>
                <SelectItem value="intake">Intake</SelectItem>
                <SelectItem value="workitem">Work Items</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
            <div className="ml-auto text-sm text-muted-foreground">
              {unreadNotifications.length} unread • {visibleNotifications.length} total
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Tabs defaultValue="unread" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unread" className="relative">
            Unread
            {unreadNotifications.length > 0 && (
              <span className="ml-2 px-1.5 py-0.5 rounded-full text-xs font-semibold bg-accent text-accent-foreground">
                {unreadNotifications.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="read">Read</TabsTrigger>
          <TabsTrigger value="all">All</TabsTrigger>
        </TabsList>

        <TabsContent value="unread" className="space-y-3">
          {unreadNotifications.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">No unread notifications</p>
                <p className="text-sm text-muted-foreground/70">You're all caught up!</p>
              </CardContent>
            </Card>
          ) : (
            unreadNotifications.map(renderNotification)
          )}
        </TabsContent>

        <TabsContent value="read" className="space-y-3">
          {readNotifications.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">No read notifications</p>
              </CardContent>
            </Card>
          ) : (
            readNotifications.map(renderNotification)
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card className="shadow-card">
              <CardContent className="py-12 text-center">
                <Bell className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
                <p className="text-muted-foreground">No notifications</p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map(renderNotification)
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
