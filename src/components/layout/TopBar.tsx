import { Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotificationDropdown } from "@/components/notifications/NotificationDropdown";

export function TopBar() {
  return (
    <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm flex items-center justify-between px-6 shrink-0">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search clients, work items, escalations..."
            className="pl-10 bg-background/50 border-border/50 focus:border-accent"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <NotificationDropdown />
        <Button variant="ghost" size="icon">
          <HelpCircle className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  );
}
