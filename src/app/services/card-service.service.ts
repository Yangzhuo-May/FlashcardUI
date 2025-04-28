import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { catchError, Observable, of, BehaviorSubject } from 'rxjs';
import { Card } from '../../models/card';

@Injectable({
  providedIn: 'root'
})
export class CardServiceService {

  constructor(private apiService: ApiService) { }

  private dataList = new BehaviorSubject<{ stackId: number, cards: any[] }>({ stackId: 0, cards: [] });
  selectedCards$ = this.dataList.asObservable();

  setData(data: { stackId: number, cards: any[] }): void {
    this.dataList.next({ stackId: data.stackId, cards: data.cards });
    console.log('set data:', data);
  }

  getData(): Observable<{ stackId: number, cards: any[] }> {
    return this.dataList.asObservable(); 
  }

  getAllCards(): Observable<any> {
    return this.apiService.getAllCards();
  }

  getCardsByStack(stackId: number | null = null): Observable<any> {
    return this.apiService.getCardsByStack(stackId);  
  }

  createCard(card: Card): Observable<any> {
    return this.apiService.createCard(card);
  }
    
  // Update a post
  updateCard(cardUpdated: Card): Observable<any> {
    return this.apiService.updateCard(cardUpdated);
  }
    
  // Delete a post
  deleteCard(cardId: number): Observable<any> {
    return this.apiService.deleteCard(cardId);
  } 
}
