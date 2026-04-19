export type ContactStatus = 'ACTIVE' | 'INACTIVE' | 'LEAD' | 'CUSTOMER';

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  status: ContactStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactRequest {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  role?: string;
  status: ContactStatus;
  notes?: string;
}

export interface UpdateContactRequest extends Partial<CreateContactRequest> {}
