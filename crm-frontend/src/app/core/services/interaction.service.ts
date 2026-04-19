import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Interaction, CreateInteractionRequest, InteractionType } from '../models/interaction.model';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private apiUrl = '/api/interactions';

  constructor(private http: HttpClient) {}

  getInteractions(
    contactId?: string,
    days: number = 30,
    type?: InteractionType
  ): Observable<Interaction[]> {
    let params = new HttpParams().set('days', days.toString());
    if (contactId) params = params.set('contactId', contactId);
    if (type) params = params.set('type', type);

    return this.http.get<Interaction[]>(this.apiUrl, { params });
  }

  getInteractionById(id: string): Observable<Interaction> {
    return this.http.get<Interaction>(`${this.apiUrl}/${id}`);
  }

  createInteraction(interaction: CreateInteractionRequest): Observable<Interaction> {
    return this.http.post<Interaction>(this.apiUrl, interaction);
  }

  deleteInteraction(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
