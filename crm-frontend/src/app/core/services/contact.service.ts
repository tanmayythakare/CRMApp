import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact, CreateContactRequest, UpdateContactRequest, ContactStatus } from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private apiUrl = '/api/contacts';

  constructor(private http: HttpClient) {}

  getContacts(
    page: number = 0,
    size: number = 20,
    search?: string,
    status?: ContactStatus
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (search) params = params.set('search', search);
    if (status) params = params.set('status', status);

    return this.http.get<any>(this.apiUrl, { params });
  }

  getContactById(id: string): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  createContact(contact: CreateContactRequest): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, contact);
  }

  updateContact(id: string, contact: UpdateContactRequest): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${id}`, contact);
  }

  deleteContact(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
