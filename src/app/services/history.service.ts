import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';
import { BehaviorSubject } from 'node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private baseUrl = `${constants.baseUrlV2}`;

  private headers = {'Content-Type': 'application/json'};

  private activeSegmentSubject: BehaviorSubject<string> = new BehaviorSubject(null);
  private homeActionSubject: BehaviorSubject<{action: boolean; type: string}> = new BehaviorSubject(null);
  // private balanceSubject: BehaviorSubject<boolean> = new BehaviorSubject( false );

  constructor(private http: HttpService) { }

  public getActiveSegmentSubject(){
    return this.activeSegmentSubject;
  }

  public getDoHomeActionSubject(){
    return this.homeActionSubject;
  }

  public getHistories(param: string){
    return this.http.get(`${this.baseUrl}/history/${param}`, {}, this.headers);
  }

  public getWalletHistoriesV2(param: string){
    return this.http.get(`${this.baseUrl}/v2/history-wallet/${param}`, {}, this.headers);
  }

  public getInvestmentHistoriesV2(param: string){
    return this.http.get(`${this.baseUrl}/v2/history-investment/${param}`, {}, this.headers);
  }

  public getHistoriesByDate(payload){
    return this.http.post(`${this.baseUrl}/history`, payload, this.headers);
  }

  public getSubscriptionHistories(subId){
    console.log('Buggy!! ', subId);
    return this.http.get(`${this.baseUrl}/subscription-history/${subId}`, {}, this.headers);
  }
}
