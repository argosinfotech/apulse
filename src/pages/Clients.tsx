import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, MoreHorizontal, ExternalLink, Pencil, Trash2, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { StatusBadge, HealthStatus } from "@/components/ui/status-badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ClientFormModal, Client, ClientFormData } from "@/components/clients/ClientFormModal";
import { useAuth } from "@/contexts/AuthContext";
import { canEdit } from "@/config/permissions";
import { toast } from "sonner";

const initialClients: Client[] = [
  {
    id: "C-001",
    name: "Stephengould",
    accountType: "Retainer",
    revenueTier: "High",
    health: "red",
    healthReason: "Blocked work item, unresponsive for 5 days",
    lastTouch: "5 days ago",
    nextMilestone: "Checkout launch - Jan 30",
    updateFrequency: "Weekly",
    activeWorkItems: 3,
    openEscalations: 1,
  },
  {
    id: "C-002",
    name: "Virtu-Meet",
    accountType: "Retainer",
    revenueTier: "High",
    health: "yellow",
    healthReason: "Performance issues taking longer than expected",
    lastTouch: "2 days ago",
    nextMilestone: "App Store submission - Feb 15",
    updateFrequency: "Weekly",
    activeWorkItems: 2,
    openEscalations: 0,
  },
  {
    id: "C-003",
    name: "TEL",
    accountType: "Project",
    revenueTier: "Med",
    health: "green",
    lastTouch: "Today",
    nextMilestone: "Phase 2 review - Feb 5",
    updateFrequency: "Bi-weekly",
    activeWorkItems: 4,
    openEscalations: 0,
  },
  {
    id: "C-004",
    name: "SOLI",
    accountType: "Project",
    revenueTier: "Med",
    health: "green",
    lastTouch: "1 day ago",
    nextMilestone: "MVP launch - Feb 28",
    updateFrequency: "Weekly",
    activeWorkItems: 2,
    openEscalations: 0,
  },
  {
    id: "C-005",
    name: "SpiritWorx",
    accountType: "Project",
    revenueTier: "Low",
    health: "green",
    lastTouch: "3 days ago",
    nextMilestone: "Beta release - Mar 10",
    updateFrequency: "Bi-weekly",
    activeWorkItems: 1,
    openEscalations: 0,
  },
];

export default function Clients() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const canEditClients = user ? canEdit(user.role, "clients") : false;
  
  const [clients, setClients] = useState<Client[]>(initialClients);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterHealth, setFilterHealth] = useState<HealthStatus | "all">("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesHealth = filterHealth === "all" || client.health === filterHealth;
    return matchesSearch && matchesHealth;
  });

  const handleAddClient = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditingClient(client);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (clientToDelete) {
      setClients(clients.filter((c) => c.id !== clientToDelete.id));
      toast.success(`${clientToDelete.name} has been deleted`);
      setClientToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleFormSubmit = (data: ClientFormData) => {
    if (editingClient) {
      // Update existing client
      setClients(clients.map((c) =>
        c.id === editingClient.id
          ? { ...c, ...data }
          : c
      ));
      toast.success(`${data.name} has been updated`);
    } else {
      // Create new client
      const newClient: Client = {
        id: `C-${String(clients.length + 1).padStart(3, "0")}`,
        name: data.name,
        accountType: data.accountType,
        revenueTier: data.revenueTier,
        health: data.health,
        healthReason: "",
        lastTouch: "Just now",
        nextMilestone: "",
        updateFrequency: data.updateFrequency,
        activeWorkItems: 0,
        openEscalations: 0,
      };
      setClients([...clients, newClient]);
      toast.success(`${data.name} has been added`);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Clients</h1>
            <p className="text-muted-foreground mt-1">
              {canEditClients ? "Manage client relationships and health status" : "View client relationships and health status"}
            </p>
          </div>
          {!canEditClients && (
            <Badge variant="outline" className="bg-muted/50">
              <Eye className="h-3 w-3 mr-1" />
              View Only
            </Badge>
          )}
        </div>
        {canEditClients && (
          <Button 
            className="bg-accent hover:bg-accent/90 text-accent-foreground"
            onClick={handleAddClient}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Client
          </Button>
        )}
      </div>

      {/* Filters */}
      <Card className="shadow-card">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={filterHealth === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterHealth("all")}
              >
                All
              </Button>
              <Button
                variant={filterHealth === "red" ? "destructive" : "outline"}
                size="sm"
                onClick={() => setFilterHealth("red")}
              >
                Critical
              </Button>
              <Button
                variant={filterHealth === "yellow" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterHealth("yellow")}
                className={filterHealth === "yellow" ? "bg-warning hover:bg-warning/90" : ""}
              >
                At Risk
              </Button>
              <Button
                variant={filterHealth === "green" ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterHealth("green")}
                className={filterHealth === "green" ? "bg-success hover:bg-success/90" : ""}
              >
                Healthy
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Client List */}
      <Card className="shadow-card">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-semibold">
            {filteredClients.length} Clients
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Health</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Client</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Last Touch</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Next Milestone</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Work Items</th>
                  <th className="text-center py-3 px-4 text-sm font-medium text-muted-foreground">Escalations</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client) => (
                  <tr
                    key={client.id}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => navigate(`/clients/${client.id}`)}
                  >
                    <td className="py-4 px-4">
                      <StatusBadge status={client.health} />
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{client.name}</span>
                        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                      {client.healthReason && (
                        <p className="text-xs text-muted-foreground mt-0.5">{client.healthReason}</p>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{client.accountType}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-foreground">{client.lastTouch}</span>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-muted-foreground">{client.nextMilestone}</span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold text-sm">
                        {client.activeWorkItems}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-center">
                      {client.openEscalations > 0 ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-destructive/10 text-destructive font-semibold text-sm">
                          {client.openEscalations}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4" onClick={(e) => e.stopPropagation()}>
                      {canEditClients ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => navigate(`/clients/${client.id}`)}>
                              <Eye className="h-4 w-4 mr-2" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditClient(client)}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteClick(client)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <Button variant="ghost" size="sm" onClick={() => navigate(`/clients/${client.id}`)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Client Form Modal */}
      <ClientFormModal
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        client={editingClient}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {clientToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
