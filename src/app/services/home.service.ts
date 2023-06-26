import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseUrl = `${constants.baseUrlV2}`;

  private headers = {'Content-Type': 'application/json'};

  constructor(private http: HttpService) { }

  public getHome(): Promise<any>{
    return this.http.get(`${this.baseUrl}/v1/home`, {}, this.headers);
  }

  public initiateTransferToUser(payload: string): Promise<any>{ //payload = email or username
    return this.http.get(`${this.baseUrl}/v2/user-transfer-info/${payload}`, {}, this.headers);
  }

  public doTransferToUser(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/make-wallet-transfer`, payload , this.headers);
  }

}
