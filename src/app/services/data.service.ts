import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private data = [];
  private authToken = '';
  private bank;
  private banks = [];
  private investment;
  private currency;

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

  setBank(bank){
    this.bank = bank;
  }

  getBank(){
    return this.bank;
  }

  clearBank(){
    this.bank = null;
  }

  setBanks(banks){
    this.banks = banks;
  }

  getBanks(){
    return this.banks;
  }

  clearBanks(){
    this.banks = [];
  }

  deselectBanks(){
    this.banks.forEach(b => b.selected = false);
  }

  setInvestment(investment){
    this.investment = investment;
  }

  getInvestment(){
    return this.investment;
  }

  clearInvestment(){
    this.investment = null;
  }

  setCurrency(currency){
    this.currency = currency;
  }

  getCurrency(){
    return this.currency;
  }

  clearCurrency(){
    this.currency = null;
  }

  clearCBI(){
    this.clearBank();
    this.clearBanks();
    this.clearCurrency();
    this.clearInvestment();
  }
}
