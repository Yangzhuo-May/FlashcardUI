import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpHeaders  } from '@angular/common/http';
import { catchError, Observable, of } from 'rxjs';
import { Card } from '../../models/card';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private baseUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}



  

  

}
