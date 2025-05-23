 import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'node_modules/rxjs';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  private baseUrl = `${constants.baseUrlV2}`;

  private headers = {'Content-Type': 'application/json'};

  private balanceSubject: BehaviorSubject<boolean> = new BehaviorSubject( false );

  constructor(private http: HttpService) {}

  public getDepositData(){
    return this.http.get(`${this.baseUrl}/deposit`, {}, this.headers);
  }

  public doDeposit(payload): Promise<any>{
    const headers = {'Content-Type' : false, processData : false}; //Needed to upload file as file and not converted to string
    return this.http.post(`${this.baseUrl}/deposit`, payload, headers);
  }

  public doWithdraw(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/withdraw`, payload, this.headers);
  }

  public getInvestmentAccounts(): Promise<any>{
    return this.http.get(`${this.baseUrl}/v1/new-subscription`, {}, this.headers);
  }

  public createInvestmentAccount(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/new-subscription`, payload, this.headers);
  }

  public doNewSubscription(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v1/new-subscription`, payload, this.headers);
  }

  public getBalanceSubject(){
    return this.balanceSubject;
  }
}
