import { Injectable } from '@angular/core';
import { catchError, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { stackStatDto } from '../../models/stackStatDto';
import { userStatsDto } from '../../models/userStatsDto';

@Injectable({
  providedIn: 'root'
})
export class StatServiceService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getStackStat(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stat/stack`);
  }

  getUserStat(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stat/user`);
  }

  getCorrectRate(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stat/correctRate`);
  }

  createStackStat(stackStat:stackStatDto): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/stat/stack`, stackStat)
    .pipe(
      catchError(error => {
        console.error('Raw error:', error);
        console.error('Error body:', error.error); 
        throw error;
      })
    )
  }

  createUserStat(newStatDto: userStatsDto): Observable<any> {
    const newStat = {
      userId: newStatDto.userId,
      lastStudyTime: new Date(newStatDto.lastStudyTime).toISOString()
    }

    return this.http.post<any>(`${this.baseUrl}/stat/user`, newStat)
    .pipe(
      catchError(error => {
        console.error('Raw error:', error);
        console.error('Error body:', error.error); 
        throw error;
      })
    )
  }
}
