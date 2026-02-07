import { useState } from "react";
import { Plus, Pencil, Trash2, Users, Mail, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { useDCOLs, DCOL } from "@/contexts/DCOLContext";
import { DCOLFormModal } from "./DCOLFormModal";
import { toast } from "@/hooks/use-toast";

export function DCOLManagement() {
  const { dcols, clients, addDCOL, updateDCOL, deleteDCOL, getClientsByDCOL } = useDCOLs();
  
  const [formOpen, setFormOpen] = useState(false);
  const [editingDCOL, setEditingDCOL] = useState<DCOL | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dcolToDelete, setDcolToDelete] = useState<DCOL | null>(null);

  const handleAdd = () => {
    setEditingDCOL(null);
    setFormOpen(true);
  };

  const handleEdit = (dcol: DCOL) => {
    setEditingDCOL(dcol);
    setFormOpen(true);
  };

  const handleDeleteClick = (dcol: DCOL) => {
    setDcolToDelete(dcol);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (dcolToDelete) {
      deleteDCOL(dcolToDelete.id);
      toast({
        title: "Coordinator Removed",
        description: `${dcolToDelete.name} has been removed.`,
        variant: "destructive",
      });
      setDcolToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const handleFormSubmit = (data: Omit<DCOL, "id" | "createdAt">) => {
    if (editingDCOL) {
      updateDCOL(editingDCOL.id, data);
      toast({
        title: "Coordinator Updated",
        description: `${data.name} has been updated.`,
      });
    } else {
      addDCOL(data);
      toast({
        title: "Coordinator Added",
        description: `${data.name} has been added to the team.`,
      });
    }
    setEditingDCOL(null);
  };

  return (
    <>
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Users className="h-5 w-5 text-muted-foreground" />
                Team Management
              </CardTitle>
              <CardDescription>Manage Delivery Coordinators and their client assignments</CardDescription>
            </div>
            <Button
              size="sm"
              className="bg-accent hover:bg-accent/90"
              onClick={handleAdd}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Coordinator
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {dcols.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Users className="h-12 w-12 mx-auto mb-3 opacity-30" />
              <p>No Delivery Coordinators added yet</p>
              <p className="text-sm">Add your first coordinator to get started</p>
            </div>
          ) : (
            <div className="space-y-3">
              {dcols.map((dcol) => {
                const assignedClients = getClientsByDCOL(dcol.id);
                return (
                  <div
                    key={dcol.id}
                    className="p-4 rounded-lg border border-border bg-background hover:border-accent/30 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold">
                            {dcol.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-medium text-foreground flex items-center gap-2">
                              {dcol.name}
                              <Badge
                                variant="outline"
                                className={
                                  dcol.status === "active"
                                    ? "bg-success/10 text-success border-success/30"
                                    : "bg-muted text-muted-foreground"
                                }
                              >
                                {dcol.status}
                              </Badge>
                            </h4>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {dcol.email}
                            </p>
                          </div>
                        </div>

                        {/* Assigned Clients */}
                        <div className="flex items-center gap-2 flex-wrap pt-2">
                          <span className="text-xs text-muted-foreground">Clients:</span>
                          {assignedClients.length === 0 ? (
                            <span className="text-xs text-muted-foreground italic">None assigned</span>
                          ) : (
                            assignedClients.map((client) => (
                              <Badge key={client.id} variant="secondary" className="text-xs">
                                {client.name}
                              </Badge>
                            ))
                          )}
                        </div>

                        <p className="text-xs text-muted-foreground flex items-center gap-1 pt-1">
                          <Calendar className="h-3 w-3" />
                          Added {dcol.createdAt}
                        </p>
                      </div>

                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleEdit(dcol)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive hover:text-destructive"
                          onClick={() => handleDeleteClick(dcol)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Form Modal */}
      <DCOLFormModal
        open={formOpen}
        onOpenChange={setFormOpen}
        dcol={editingDCOL}
        clients={clients}
        onSubmit={handleFormSubmit}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Coordinator</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove {dcolToDelete?.name}? Their client assignments will be cleared. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive hover:bg-destructive/90"
            >
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
