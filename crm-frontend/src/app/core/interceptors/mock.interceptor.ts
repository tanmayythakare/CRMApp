import { HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { Observable, of, delay } from 'rxjs';

export const mockInterceptor = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const { url, method, body } = request;

  // --- AUTH ---
  if (url.includes('/api/auth/login') && method === 'POST') {
    return of(new HttpResponse({ 
      status: 200, 
      body: { 
        token: 'mock-jwt-token', 
        id: '1', 
        email: body.email, 
        fullName: 'Demo Admin' 
      } 
    })).pipe(delay(500));
  }

  // --- DASHBOARD ---
  if (url.includes('/api/dashboard/summary') && method === 'GET') {
    return of(new HttpResponse({ 
      status: 200, 
      body: { 
        totalContacts: 124, 
        activeContacts: 85, 
        interactionsThisWeek: 42, 
        followUpsDue: 12 
      } 
    })).pipe(delay(300));
  }

  if (url.includes('/api/dashboard/interactions-chart') && method === 'GET') {
    const data = Array.from({length: 30}, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
      count: Math.floor(Math.random() * 10) + 2
    }));
    return of(new HttpResponse({ status: 200, body: data }));
  }

  if (url.includes('/api/dashboard/recent-interactions') && method === 'GET') {
    return of(new HttpResponse({ 
      status: 200, 
      body: [
        { contactId: '1', contactName: 'John Doe', type: 'CALL', subject: 'Initial Consultation', interactionDate: new Date().toISOString() },
        { contactId: '2', contactName: 'Jane Smith', type: 'EMAIL', subject: 'Contract Proposal', interactionDate: new Date(Date.now() - 3600000).toISOString() },
        { contactId: '3', contactName: 'Acme Corp', type: 'MEETING', subject: 'Project Kickoff', interactionDate: new Date(Date.now() - 86400000).toISOString() }
      ] 
    }));
  }

  if (url.includes('/api/dashboard/top-contacts') && method === 'GET') {
    return of(new HttpResponse({ 
      status: 200, 
      body: [
        { contactId: '1', contactName: 'John Doe', interactionCount: 15, lastInteractionDate: new Date().toISOString() },
        { contactId: '2', contactName: 'Jane Smith', interactionCount: 12, lastInteractionDate: new Date().toISOString() }
      ] 
    }));
  }

  // --- CONTACTS ---
  if (url.includes('/api/contacts') && method === 'GET') {
    // Mock list
    return of(new HttpResponse({ 
      status: 200, 
      body: {
        content: [
          { id: '1', name: 'John Doe', email: 'john@example.com', company: 'Google', role: 'DevOps', status: 'ACTIVE' },
          { id: '2', name: 'Jane Smith', email: 'jane@example.com', company: 'Microsoft', role: 'Manager', status: 'LEAD' },
          { id: '3', name: 'Robert Brown', email: 'bob@example.com', company: 'Amazon', role: 'Engineer', status: 'CUSTOMER' }
        ],
        totalElements: 3,
        totalPages: 1
      }
    })).pipe(delay(400));
  }

  // --- INTERACTIONS ---
  if (url.includes('/api/interactions') && method === 'GET') {
    return of(new HttpResponse({ 
      status: 200, 
      body: [
        { id: '1', contactId: '1', contactName: 'John Doe', type: 'CALL', subject: 'Inquiry about pricing', interactionDate: new Date().toISOString(), outcome: 'Interested' },
        { id: '2', contactId: '1', contactName: 'John Doe', type: 'EMAIL', subject: 'Quote follow-up', interactionDate: new Date(Date.now() - 43200000).toISOString(), outcome: 'Sent' }
      ] 
    })).pipe(delay(200));
  }

  return next(request);
};
