export interface DashboardSummary {
  totalContacts: number;
  activeContacts: number;
  interactionsThisWeek: number;
  followUpsDue: number;
}

export interface DailyInteractionCount {
  date: string;
  count: number;
}

export interface TopContact {
  contactId: string;
  contactName: string;
  interactionCount: number;
  lastInteractionDate: string;
}
