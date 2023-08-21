import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = `${constants.baseUrlV2}`;

  private headers = {'Content-Type': 'application/json'};

  constructor(private http: HttpService) { }

  public getAccountInfo(){
    return this.http.get(`${this.baseUrl}/v1/account-and-affiliate`, {}, this.headers);
  }

  public requestPasswordReset(email: string){
    return this.http.get(`${this.baseUrl}/v1/reset-password/${email}`, {}, this.headers);
  }

  public updatePin(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/update-pin`, payload, this.headers);
  }
}
