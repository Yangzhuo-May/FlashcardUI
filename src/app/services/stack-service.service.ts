import { Injectable } from '@angular/core';
import { catchError, Observable, BehaviorSubject } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StackServiceService {

  private baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  private dataList = new BehaviorSubject<any[]>([]);
  stackList$ = this.dataList.asObservable();

  private editingStack = new BehaviorSubject<any[]>([]);
  editingStack$ = this.editingStack.asObservable();

  setEditingStack(data: any[]): void {
    this.editingStack.next(data);
    console.log('editingStack is', data)
  }

  getEditingStack(): Observable<any[]> {
    return this.editingStack.asObservable(); 
  }
  
  setData(data: any[]): void {
    this.dataList.next(data);  }

  getData(): Observable<any[]> {
    return this.dataList.asObservable(); 
  }

  getStacks(): Observable<any> {
    return this.http.get(`${this.baseUrl}/stack`); 
  }

  createStack(name: string): Observable<any> {
    const newStack = {
      newStackName : name
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
      StackId: stackId,
      NewStackName : stackName
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
}
