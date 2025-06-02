import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Card } from '../../models/card';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  private dataList = new BehaviorSubject<{ stackId: number, cards: any[] }>({ stackId: 0, cards: [] });
  dataList$ = this.dataList.asObservable();

  private editingCard = new BehaviorSubject<any | null>(null);
  editingCard$ = this.editingCard.asObservable();

  setEditingCard(data: any): void {
    this.editingCard.next(data);
  }

  setData(data: { stackId: number, cards: any }): void {
    this.dataList.next({ stackId: data.stackId, cards: data.cards });
  }

  getAllCards(): Observable<any> {
    return this.http.get(`${this.baseUrl}/card`);
  }

  getCardsByStack(stackId: number | null = null): Observable<any> {
    return this.http.get(`${this.baseUrl}/card/${stackId}`); 
  }

  createCard(card: Card): Observable<any> {
    return this.http.post(`${this.baseUrl}/card`, card);
  }
  
  createMultiCard(cards: Card[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/card/cards`, { cards });
  }

  updateCard(cardUpdated: Card): Observable<any> {
    return this.http.put(`${this.baseUrl}/card/${cardUpdated.cardId}`, cardUpdated);
  }
    
  deleteCard(cardId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/card/${cardId}`);
  } 
}
