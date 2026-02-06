import React, { createContext, useContext, useState, useCallback } from "react";

export interface DCOL {
  id: string;
  name: string;
  email: string;
  assignedClients: string[]; // Client IDs
  createdAt: string;
  status: "active" | "inactive";
}

export interface ClientInfo {
  id: string;
  name: string;
}

interface DCOLContextType {
  dcols: DCOL[];
  clients: ClientInfo[];
  addDCOL: (dcol: Omit<DCOL, "id" | "createdAt">) => void;
  updateDCOL: (id: string, data: Partial<DCOL>) => void;
  deleteDCOL: (id: string) => void;
  getDCOLById: (id: string) => DCOL | undefined;
  getClientsByDCOL: (dcolId: string) => ClientInfo[];
  getDCOLByClient: (clientId: string) => DCOL | undefined;
}

const DCOLContext = createContext<DCOLContextType | undefined>(undefined);

// Mock data
const initialDCOLs: DCOL[] = [
  {
    id: "DCOL-001",
    name: "Alex Chen",
    email: "alex@company.com",
    assignedClients: ["C-001", "C-002"],
    createdAt: "Jan 1, 2025",
    status: "active",
  },
  {
    id: "DCOL-002",
    name: "Jordan Smith",
    email: "jordan@company.com",
    assignedClients: ["C-003", "C-004", "C-005"],
    createdAt: "Jan 5, 2025",
    status: "active",
  },
];

const availableClients: ClientInfo[] = [
  { id: "C-001", name: "Stephengould" },
  { id: "C-002", name: "Virtu-Meet" },
  { id: "C-003", name: "TEL" },
  { id: "C-004", name: "SOLI" },
  { id: "C-005", name: "SpiritWorx" },
];

export function DCOLProvider({ children }: { children: React.ReactNode }) {
  const [dcols, setDCOLs] = useState<DCOL[]>(initialDCOLs);
  const [clients] = useState<ClientInfo[]>(availableClients);

  const addDCOL = useCallback((data: Omit<DCOL, "id" | "createdAt">) => {
    const newDCOL: DCOL = {
      ...data,
      id: `DCOL-${String(Date.now()).slice(-6)}`,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setDCOLs((prev) => [...prev, newDCOL]);
  }, []);

  const updateDCOL = useCallback((id: string, data: Partial<DCOL>) => {
    setDCOLs((prev) =>
      prev.map((dcol) => (dcol.id === id ? { ...dcol, ...data } : dcol))
    );
  }, []);

  const deleteDCOL = useCallback((id: string) => {
    setDCOLs((prev) => prev.filter((dcol) => dcol.id !== id));
  }, []);

  const getDCOLById = useCallback(
    (id: string) => dcols.find((dcol) => dcol.id === id),
    [dcols]
  );

  const getClientsByDCOL = useCallback(
    (dcolId: string) => {
      const dcol = dcols.find((d) => d.id === dcolId);
      if (!dcol) return [];
      return clients.filter((c) => dcol.assignedClients.includes(c.id));
    },
    [dcols, clients]
  );

  const getDCOLByClient = useCallback(
    (clientId: string) => dcols.find((d) => d.assignedClients.includes(clientId)),
    [dcols]
  );

  return (
    <DCOLContext.Provider
      value={{
        dcols,
        clients,
        addDCOL,
        updateDCOL,
        deleteDCOL,
        getDCOLById,
        getClientsByDCOL,
        getDCOLByClient,
      }}
    >
      {children}
    </DCOLContext.Provider>
  );
}

export function useDCOLs() {
  const context = useContext(DCOLContext);
  if (!context) {
    throw new Error("useDCOLs must be used within DCOLProvider");
  }
  return context;
}
