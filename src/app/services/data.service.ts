import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data = [];
  private authToken = '';

  constructor() {
  }

  setData(id, data) {
    this.data[id] = data;
  }

  getData(id) {
    return this.data[id];
  }

  clearData(){
    this.data = [];
  }

  setAccessToken(token: string){
    this.authToken = token;
  }

  getAccessToken(){
    return this.authToken;
  }
}
