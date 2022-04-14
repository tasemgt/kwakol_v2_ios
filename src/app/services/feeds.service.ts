import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';

@Injectable({
  providedIn: 'root'
})
export class FeedsService {

  private baseUrl = `${constants.baseUrl}`;

  private headers = {'Content-Type': 'application/json'};

  // private balanceSubject: BehaviorSubject<boolean> = new BehaviorSubject( false );

  constructor(private http: HttpService) { }

  public getFeeds(){
    return this.http.get(`${this.baseUrl}/feeds`, {}, this.headers);
  }
}
