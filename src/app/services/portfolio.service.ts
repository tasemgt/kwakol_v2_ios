import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';

@Injectable({
  providedIn: 'root'
})
export class PortfolioService {

  private baseUrl = `${constants.baseUrl}`;

  private headers = {'Content-Type': 'application/json'};

  constructor(private http: HttpService) { }

  public getPortfolio(): Promise<any>{
    return this.http.get(`${this.baseUrl}/portfolio`, {}, this.headers);
  }
}
