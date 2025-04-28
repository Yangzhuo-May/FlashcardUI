import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Card } from '../../models/card';
import { environment } from '../../environments/environment';
import { registerRequestDto } from '../../models/registerRequestDto';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;
  token: string|null = null; 
  constructor(private http: HttpClient) {}

  saveToken(token: string){
    this.token = token;
    localStorage.setItem('jwt', token);
    
  }

  register(registerRequest: registerRequestDto): Observable<any> {
    const newRegisterRequest = {
      Username : registerRequest.Username,
      Email : registerRequest.Email,
      Password : registerRequest.Password,
      ConfirmPassword : registerRequest.ConfirmPassword
    }

    return this.http.post<any>(`${this.baseUrl}/register`, newRegisterRequest)
    .pipe(
      catchError(error => {
        console.error('Raw error:', error);
        console.error('Error body:', error.error); 
        throw error;
      })
    )
  }

  getStacks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stack`); 
  }

  createStack(stackName: string): Observable<any> {
    const newStack = {
      stackName: stackName
    };

    return this.http.post<any>(`${this.baseUrl}/stack`, newStack)
    .pipe(
      catchError(error => {
        console.error('Raw error:', error);
        console.error('Error body:', error.error); 
        throw error;
      })
    )
  }

  updateStack(stackName: string, stackId: number): Observable<any> {
    const updatedStack = {
      stackId: stackId,
      stackName: stackName
    };

    return this.http.put<any>(`${this.baseUrl}/stack/${stackId}`, updatedStack)
    .pipe(
      catchError(error => {
        console.error('Raw error:', error);
        console.error('Error body:', error.error); 
        throw error;
      })
    )
  }

  deleteStack(stack: any): Observable<any> {
    return this.http.delete(`${this.baseUrl}/stack/${stack.stackId}`)
    .pipe(
      catchError(error => {
        console.error('Raw errr:', error);
        console.error('Error body:', error.error); 
        throw error;
      })
    )
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
