 import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private baseUrl = `${constants.baseUrl}`;

  private headers = {'Content-Type': 'application/json'};

  private balanceSubject: BehaviorSubject<boolean> = new BehaviorSubject( false );

  constructor(private http: HttpService) { }

  public getDepositData(){
    return this.http.get(`${this.baseUrl}/deposit`, {}, this.headers);
  }

  public doDeposit(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/deposit`, payload, this.headers);
  }

  public doWithdraw(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/withdraw`, payload, this.headers);
  }

  public getInvestmentAccounts(): Promise<any>{
    return this.http.get(`${this.baseUrl}/new-subscription`, {}, this.headers);
  }

  public doNewSubscription(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/new-subscription`, payload, this.headers);
  }

  public getBalanceSubject(){
    return this.balanceSubject;
  }
}
