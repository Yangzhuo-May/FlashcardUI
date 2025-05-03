import { Injectable } from '@angular/core';
import { catchError, Observable, of, BehaviorSubject } from 'rxjs';
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
  selectedCards$ = this.dataList.asObservable();

  setData(data: { stackId: number, cards: any[] }): void {
    this.dataList.next({ stackId: data.stackId, cards: data.cards });
    console.log('set data:', data);
  }

  getData(): Observable<{ stackId: number, cards: any[] }> {
    return this.dataList.asObservable(); 
  }

  getAllCards(): Observable<any> {
    return this.http.get(`${this.baseUrl}/card`);
  }

  getCardsByStack(stackId: number | null = null): Observable<any> {
    return this.http.get(`${this.baseUrl}/card/${stackId}`); 
  }

  createCard(card: Card): Observable<any> {
    const newCard = {
      question: card.question, 
      answers: card.answers, 
      correctAnswer: card.correctAnswer, 
      stackId: card.stackId
    };

    return this.http.post(`${this.baseUrl}/card`, newCard);
  }

  updateCard(cardUpdated: Card): Observable<any> {
    const newCard = {
      question: cardUpdated.question, 
      answers: cardUpdated.answers, 
      correctAnswer: cardUpdated.correctAnswer, 
      stackId: cardUpdated.stackId
    };

    return this.http.put(`${this.baseUrl}/card/${cardUpdated.cardId}`, newCard);
  }
    
  deleteCard(cardId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/card/${cardId}`);
  } 
}
