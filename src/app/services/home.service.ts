import { Injectable } from '@angular/core';
import { constants } from '../models/constants';
import { HttpService } from './_http.service';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  private baseUrl = `${constants.baseUrl}`;

  private headers = {'Content-Type': 'application/json'};

  constructor(private http: HttpService) { }

  public getHome(): Promise<any>{
    return this.http.get(`${this.baseUrl}/home`, {}, this.headers);
  }
}
