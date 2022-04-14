import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = `${constants.baseUrl}`;

  private headers = {'Content-Type': 'application/json'};

  constructor(private http: HttpService) { }

  public getAccountInfo(){
    return this.http.get(`${this.baseUrl}/account-and-affiliate`, {}, this.headers);
  }

  public requestPasswordReset(email: string){
    return this.http.get(`${this.baseUrl}/reset-password/${email}`, {}, this.headers);
  }
}
