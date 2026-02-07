import React, { createContext, useContext, useState, useCallback } from "react";

export type MessageSender = "dcol" | "client";

export interface Message {
  id: string;
  threadId: string;
  content: string;
  sender: MessageSender;
  senderName: string;
  createdAt: string;
  isRead: boolean;
}

export interface CommunicationThread {
  id: string;
  clientId: string;
  clientName: string;
  clientEmail: string;
  subject: string;
  workItemId?: string;
  workItemTitle?: string;
  accessToken: string; // For public link access
  createdBy: string; // DCOL name
  createdAt: string;
  lastMessageAt: string;
  status: "active" | "closed";
  messages: Message[];
}

interface CommunicationsContextType {
  threads: CommunicationThread[];
  getThreadById: (id: string) => CommunicationThread | undefined;
  getThreadByToken: (token: string) => CommunicationThread | undefined;
  getThreadsByClient: (clientId: string) => CommunicationThread[];
  createThread: (data: {
    clientId: string;
    clientName: string;
    clientEmail: string;
    subject: string;
    workItemId?: string;
    workItemTitle?: string;
    initialMessage: string;
    createdBy: string;
  }) => CommunicationThread;
  addMessage: (threadId: string, content: string, sender: MessageSender, senderName: string) => void;
  markMessagesAsRead: (threadId: string, sender: MessageSender) => void;
  closeThread: (threadId: string) => void;
  getUnreadCountForDCOL: () => number;
}

const CommunicationsContext = createContext<CommunicationsContextType | undefined>(undefined);

// Generate a random access token
const generateToken = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Mock data
const initialThreads: CommunicationThread[] = [
  {
    id: "THREAD-001",
    clientId: "C-001",
    clientName: "Stephengould",
    clientEmail: "contact@stephengould.com",
    subject: "Weekly Status Update - Checkout Feature",
    workItemId: "WI-001",
    workItemTitle: "E-commerce Checkout Integration",
    accessToken: "abc123def456",
    createdBy: "Alex Chen",
    createdAt: "Jan 15, 2025 09:00",
    lastMessageAt: "Jan 16, 2025 14:30",
    status: "active",
    messages: [
      {
        id: "MSG-001",
        threadId: "THREAD-001",
        content: "<p>Hi Team,</p><p>Here's your weekly update on the checkout feature:</p><ul><li>Payment gateway integration is complete</li><li>Cart sync is 80% done</li><li>Waiting on API credentials from your side</li></ul><p>Please share the production API keys at your earliest convenience.</p>",
        sender: "dcol",
        senderName: "Alex Chen",
        createdAt: "Jan 15, 2025 09:00",
        isRead: true,
      },
      {
        id: "MSG-002",
        threadId: "THREAD-001",
        content: "<p>Thanks for the update! I'll get those API credentials to you by tomorrow.</p><p>Quick question - will this affect the timeline if we're a day late?</p>",
        sender: "client",
        senderName: "John (Stephengould)",
        createdAt: "Jan 15, 2025 15:30",
        isRead: true,
      },
      {
        id: "MSG-003",
        threadId: "THREAD-001",
        content: "<p>No problem at all - a day's delay won't impact our timeline. We have buffer built in.</p><p>Looking forward to receiving the credentials!</p>",
        sender: "dcol",
        senderName: "Alex Chen",
        createdAt: "Jan 16, 2025 10:00",
        isRead: true,
      },
      {
        id: "MSG-004",
        threadId: "THREAD-001",
        content: "<p>Perfect. Here are the credentials:</p><p><strong>API Key:</strong> pk_live_xxx<br/><strong>Secret:</strong> Will send separately via secure channel</p>",
        sender: "client",
        senderName: "John (Stephengould)",
        createdAt: "Jan 16, 2025 14:30",
        isRead: false,
      },
    ],
  },
  {
    id: "THREAD-002",
    clientId: "C-002",
    clientName: "Virtu-Meet",
    clientEmail: "support@virtu-meet.com",
    subject: "Performance Issue - Mobile App",
    workItemId: "WI-003",
    workItemTitle: "Mobile App Performance",
    accessToken: "xyz789ghi012",
    createdBy: "Alex Chen",
    createdAt: "Jan 14, 2025 11:00",
    lastMessageAt: "Jan 14, 2025 16:45",
    status: "active",
    messages: [
      {
        id: "MSG-005",
        threadId: "THREAD-002",
        content: "<p>Hi,</p><p>We've identified the cause of the performance issues in the mobile app. The video rendering pipeline needs optimization.</p><p>We have two options:</p><ol><li>Quick fix - 2 days, 70% improvement</li><li>Full rewrite - 1 week, 95% improvement</li></ol><p>Please let us know which approach you'd prefer.</p>",
        sender: "dcol",
        senderName: "Alex Chen",
        createdAt: "Jan 14, 2025 11:00",
        isRead: true,
      },
      {
        id: "MSG-006",
        threadId: "THREAD-002",
        content: "<p>Thanks for the detailed analysis!</p><p>We'd prefer the full rewrite - better to do it right. Can we schedule a call to discuss the implementation plan?</p>",
        sender: "client",
        senderName: "Sarah (Virtu-Meet)",
        createdAt: "Jan 14, 2025 16:45",
        isRead: false,
      },
    ],
  },
];

export function CommunicationsProvider({ children }: { children: React.ReactNode }) {
  const [threads, setThreads] = useState<CommunicationThread[]>(initialThreads);

  const getThreadById = useCallback(
    (id: string) => threads.find((t) => t.id === id),
    [threads]
  );

  const getThreadByToken = useCallback(
    (token: string) => threads.find((t) => t.accessToken === token),
    [threads]
  );

  const getThreadsByClient = useCallback(
    (clientId: string) => threads.filter((t) => t.clientId === clientId),
    [threads]
  );

  const createThread = useCallback(
    (data: {
      clientId: string;
      clientName: string;
      clientEmail: string;
      subject: string;
      workItemId?: string;
      workItemTitle?: string;
      initialMessage: string;
      createdBy: string;
    }) => {
      const threadId = `THREAD-${String(Date.now()).slice(-6)}`;
      const messageId = `MSG-${String(Date.now()).slice(-6)}`;
      const now = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const newThread: CommunicationThread = {
        id: threadId,
        clientId: data.clientId,
        clientName: data.clientName,
        clientEmail: data.clientEmail,
        subject: data.subject,
        workItemId: data.workItemId,
        workItemTitle: data.workItemTitle,
        accessToken: generateToken(),
        createdBy: data.createdBy,
        createdAt: now,
        lastMessageAt: now,
        status: "active",
        messages: [
          {
            id: messageId,
            threadId,
            content: data.initialMessage,
            sender: "dcol",
            senderName: data.createdBy,
            createdAt: now,
            isRead: true,
          },
        ],
      };

      setThreads((prev) => [newThread, ...prev]);
      return newThread;
    },
    []
  );

  const addMessage = useCallback(
    (threadId: string, content: string, sender: MessageSender, senderName: string) => {
      const messageId = `MSG-${String(Date.now()).slice(-6)}`;
      const now = new Date().toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id !== threadId) return thread;
          return {
            ...thread,
            lastMessageAt: now,
            messages: [
              ...thread.messages,
              {
                id: messageId,
                threadId,
                content,
                sender,
                senderName,
                createdAt: now,
                isRead: false,
              },
            ],
          };
        })
      );
    },
    []
  );

  const markMessagesAsRead = useCallback(
    (threadId: string, sender: MessageSender) => {
      setThreads((prev) =>
        prev.map((thread) => {
          if (thread.id !== threadId) return thread;
          return {
            ...thread,
            messages: thread.messages.map((msg) =>
              msg.sender === sender ? { ...msg, isRead: true } : msg
            ),
          };
        })
      );
    },
    []
  );

  const closeThread = useCallback((threadId: string) => {
    setThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId ? { ...thread, status: "closed" } : thread
      )
    );
  }, []);

  const getUnreadCountForDCOL = useCallback(() => {
    return threads.reduce((count, thread) => {
      const unreadFromClient = thread.messages.filter(
        (m) => m.sender === "client" && !m.isRead
      ).length;
      return count + unreadFromClient;
    }, 0);
  }, [threads]);

  return (
    <CommunicationsContext.Provider
      value={{
        threads,
        getThreadById,
        getThreadByToken,
        getThreadsByClient,
        createThread,
        addMessage,
        markMessagesAsRead,
        closeThread,
        getUnreadCountForDCOL,
      }}
    >
      {children}
    </CommunicationsContext.Provider>
  );
}

export function useCommunications() {
  const context = useContext(CommunicationsContext);
  if (!context) {
    throw new Error("useCommunications must be used within CommunicationsProvider");
  }
  return context;
}
