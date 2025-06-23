import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { FavoriteStackRequest } from '../../models/favoriteStackRequest';

@Injectable({
  providedIn: 'root'
})
export class FavoriteStackServiceService {

  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getFavoriteStackList(): Observable<any> {
    return this.http.get(`${this.baseUrl}/favorite`);
  }

  addFavoriteStack(request:FavoriteStackRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/favorite`, request);
  }

  removeFavoriteStack(request:FavoriteStackRequest): Observable<any> {
    return this.http.delete(`${this.baseUrl}/favorite`)
    .pipe(
      catchError(error => {
        console.error('Raw errr:', error);
        console.error('Error body:', error.error); 
        throw error;
      })
    )
  }
}
