import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private baseUrl = `${constants.baseUrlV2}`;

  private headers = {'Content-Type': 'application/json'};
  
  private profileUpdateSubject: BehaviorSubject<{username: string}> = new BehaviorSubject(null);

  constructor(private http: HttpService) {}


  public getProfileUpdateSubject(){
    return this.profileUpdateSubject;
  }

  public getAccountInfo(){
    return this.http.get(`${this.baseUrl}/v1/account-and-affiliate`, {}, this.headers);
  }

  public requestPasswordReset(email: string){
    return this.http.get(`${this.baseUrl}/v1/reset-password/${email}`, {}, this.headers);
  }

  public updatePin(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/update-pin`, payload, this.headers);
  }

  public addNextOfKin(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/next-of-kin`, payload, this.headers);
  }

  // public passwordReset(payload): Promise<any>{
  //   return this.http.post(`${this.baseUrl}/v2/update-pin`, payload, this.headers);
  // }

  public doEditProfile(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/edit-profile`, payload, this.headers);
  }
}
