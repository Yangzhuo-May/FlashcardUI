import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class StackServiceService {

  constructor(private apiService: ApiService) {}

  getStacks(): Observable<any> {
    return this.apiService.getStacks();
  }

  createStack(stackName: string): Observable<any> {
    return this.apiService.createStack(stackName);
  }

  updateStack(stackName: string, stackId: number) {
    return this.apiService.updateStack( stackName,stackId);
  }

  deleteStack(stack: any): Observable<any> {
    return this.apiService.deleteStack(stack);
  }
}
