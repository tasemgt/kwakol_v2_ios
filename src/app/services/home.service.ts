import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseUrl = `${constants.baseUrlV2}`;

  private headers = {'Content-Type': 'application/json'};

  private reopenSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(private http: HttpService) {}

  public getReopenStateSubject(){
    return this.reopenSubject;
  }

  public getHome(): Promise<any>{
    return this.http.get(`${this.baseUrl}/v1/home`, {}, this.headers);
  }

  //TRANSFER FROM WALLET
  public initiateTransferToUser(payload: string): Promise<any>{ //payload = email or username
    return this.http.get(`${this.baseUrl}/v2/user-transfer-info/${payload}`, {}, this.headers);
  }

  public doTransferToUser(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/make-wallet-transfer`, payload , this.headers);
  }

  public getSubscriptions(): Promise<any>{
    return this.http.get(`${this.baseUrl}/v2/list-subscriptions`, {}, this.headers);
  }

  public doTransferToSubscription(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/fund-subscription`, payload , this.headers);
  }

  public createBeneficiary(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/create-beneficiary`, payload, this.headers);
  }

  public getBeneficiaries(): Promise<any>{
    return this.http.get(`${this.baseUrl}/v2/list-beneficiaries`, {}, this.headers);
  }

  public doTransferToBeneficiary(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/fund-beneficiary`, payload , this.headers);
  }

  //DEPOSIT TO WALLET
  public initiateWalletDeposit(payload: any): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/make-wallet-deposit`, payload, this.headers);
  }

  public makeWalletDepositUSD(payload: any): Promise<any>{
    const headers = {'Content-Type' : false, processData : false}; //Needed to upload file as file and not converted to string
    return this.http.post(`${this.baseUrl}/v2/make-wallet-deposit-dollar`, payload, headers);
  }


  // WITHDRAW FROM WALLET

  public getMyBanks(): Promise<any>{
    return this.http.get(`${this.baseUrl}/v2/get-bank-account`, {}, this.headers);
  }

  public createBank(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/create-bank-account`, payload, this.headers);
  }

  public withdrawFromWallet(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/withdraw-to-bank-account`, payload, this.headers);
  }

}
