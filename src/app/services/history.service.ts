import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HistoryService {

  private baseUrl = `${constants.baseUrlV2}`;

  private headers = {'Content-Type': 'application/json'};

  private activeSegmentSubject: BehaviorSubject<{activeSegment: string}> = new BehaviorSubject(null);
  // private balanceSubject: BehaviorSubject<boolean> = new BehaviorSubject( false );

  constructor(private http: HttpService) { }

  public getActiveSegmentSubject(){
    return this.activeSegmentSubject;
  }

  public getHistories(){
    return this.http.get(`${this.baseUrl}/v2/transaction-history`, {}, this.headers);
  }

  public getHistoriesByDate(payload){
    return this.http.post(`${this.baseUrl}/history`, payload, this.headers);
  }

  public getSubscriptionHistories(subId){
    console.log('Buggy!! ', subId);
    return this.http.get(`${this.baseUrl}/subscription-history/${subId}`, {}, this.headers);
  }
}
