import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private baseUrl = `${constants.baseUrl}`;

  private headers = {'Content-Type': 'application/json'};

  // private balanceSubject: BehaviorSubject<boolean> = new BehaviorSubject( false );

  constructor(private http: HttpService) { }

  public getHistories(param: string){
    return this.http.get(`${this.baseUrl}/history/${param}`, {}, this.headers);
  }

  public getHistoriesByDate(payload){
    return this.http.post(`${this.baseUrl}/history`, payload, this.headers);
  }
}
