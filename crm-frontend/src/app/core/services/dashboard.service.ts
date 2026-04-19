import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DashboardSummary, DailyInteractionCount, TopContact } from '../models/dashboard.model';
import { Interaction } from '../models/interaction.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = '/api/dashboard';

  constructor(private http: HttpClient) {}

  getSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.apiUrl}/summary`);
  }

  getInteractionChart(days: number = 30): Observable<DailyInteractionCount[]> {
    const params = new HttpParams().set('days', days.toString());
    return this.http.get<DailyInteractionCount[]>(`${this.apiUrl}/interactions-chart`, { params });
  }

  getRecentInteractions(limit: number = 5): Observable<Interaction[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<Interaction[]>(`${this.apiUrl}/recent-interactions`, { params });
  }

  getTopContacts(limit: number = 5): Observable<TopContact[]> {
    const params = new HttpParams().set('limit', limit.toString());
    return this.http.get<TopContact[]>(`${this.apiUrl}/top-contacts`, { params });
  }
}
