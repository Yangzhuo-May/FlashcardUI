import { Injectable } from '@angular/core';
import { registerRequestDto } from '../../models/registerRequestDto';
import { Observable, catchError, BehaviorSubject } from 'rxjs';
import { loginRequest } from '../../models/loginRequest';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router'; // 导入 Router

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {
  private baseUrl = environment.apiUrl;
  private tokenKey = 'authToken';
  private userSubject = new BehaviorSubject<string | null>(this.getUsernameFromToken()); // 保存用户名
  public user$ = this.userSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated()); // 新的 Subject
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  token: string | null = localStorage.getItem(this.tokenKey);

  constructor(private http: HttpClient, private router: Router) { }

  private getUsernameFromToken(): string | null {
    const token = this.getToken();
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.sub || payload.email || null; 
      } catch (error) {
        console.error('Error decoding token:', error);
        return null;
      }
    }
    return null;
  }

  saveToken(token: string) {
    this.token = token;
    localStorage.setItem(this.tokenKey, token);
    console.log('Token saved to localStorage:', token);
    this.updateUsername(); 
    this.isAuthenticatedSubject.next(true); 
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUsername(): string | null {
    return this.userSubject.getValue();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  loginSuccess(token: string) {
    this.saveToken(token);
    this.router.navigate(['user']); 
  }

  logout() {
    this.token = null;
    localStorage.removeItem(this.tokenKey);
    this.userSubject.next(null);
    this.isAuthenticatedSubject.next(false); 
    this.router.navigate(['/login']); 
  }

  private updateUsername() {
    this.userSubject.next(this.getUsernameFromToken());
  }

  register(registerRequest: registerRequestDto): Observable <any> {
    const newRegisterRequest = {
      Username : registerRequest.username,
      Email : registerRequest.email,
      Password : registerRequest.password,
      ConfirmPassword : registerRequest.confirmPassword
    }

    return this.http.post<any>(`${this.baseUrl}/auth/register`, newRegisterRequest)
    .pipe(
      catchError(error => {
        console.error('Raw error:', error);
        console.error('Error body:', error.error); 
        throw error;
      })
    )
  }

  login(loginRequest: loginRequest): Observable <any> {
    const newLoginRequest = {
      Email : loginRequest.email,
      Password : loginRequest.password
    }

    return this.http.post<any>(`${this.baseUrl}/auth/login`, newLoginRequest)
    .pipe(
      catchError(error => {
        console.error('Raw error:', error);
        console.error('Error body:', error.error); 
        throw error;
      })
    )
  }
}
