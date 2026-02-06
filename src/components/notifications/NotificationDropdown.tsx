import { useNavigate } from "react-router-dom";
import { Bell, Check, Trash2, AlertTriangle, MessageSquareWarning, CheckCircle, Inbox, Briefcase, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNotifications, NotificationType } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
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

export function NotificationDropdown() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
  } = useNotifications();

  // Filter notifications based on user role
  const visibleNotifications = notifications.filter(
    (n) => n.forRole === "all" || n.forRole === user?.role
  );

  const visibleUnreadCount = visibleNotifications.filter((n) => !n.read).length;

  const handleNotificationClick = (id: string, link?: string) => {
    markAsRead(id);
    if (link) {
      navigate(link);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5 text-muted-foreground" />
          {visibleUnreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-xs font-bold flex items-center justify-center">
              {visibleUnreadCount > 9 ? "9+" : visibleUnreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0" align="end">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {visibleUnreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="text-xs text-muted-foreground hover:text-foreground"
              onClick={markAllAsRead}
            >
              <Check className="h-3 w-3 mr-1" />
              Mark all read
            </Button>
          )}
        </div>

        <ScrollArea className="max-h-[400px]">
          {visibleNotifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {visibleNotifications.map((notification) => {
                const Icon = typeIcons[notification.type];
                return (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                      !notification.read ? "bg-accent/5" : ""
                    }`}
                    onClick={() =>
                      handleNotificationClick(notification.id, notification.link)
                    }
                  >
                    <div className="flex gap-3">
                      <div
                        className={`p-2 rounded-lg shrink-0 ${typeColors[notification.type]}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={`text-sm font-medium ${
                              !notification.read
                                ? "text-foreground"
                                : "text-muted-foreground"
                            }`}
                          >
                            {notification.title}
                          </p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              clearNotification(notification.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3 text-muted-foreground" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mt-0.5">
                          {notification.message}
                        </p>
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                          })}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>

        {visibleNotifications.length > 0 && (
          <div className="p-2 border-t">
            <Button
              variant="ghost"
              size="sm"
              className="w-full text-xs text-muted-foreground"
              onClick={() => navigate("/notifications")}
            >
              View all notifications
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
