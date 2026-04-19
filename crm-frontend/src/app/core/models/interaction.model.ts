export type InteractionType = 'CALL' | 'EMAIL' | 'MEETING' | 'NOTE';

export interface Interaction {
  id: string;
  contactId: string;
  contactName: string;
  type: InteractionType;
  subject: string;
  description?: string;
  interactionDate: string;
  durationMinutes?: number;
  outcome?: string;
  createdAt: string;
}

export interface CreateInteractionRequest {
  contactId: string;
  type: InteractionType;
  subject: string;
  description?: string;
  interactionDate: string;
  durationMinutes?: number;
  outcome?: string;
}
