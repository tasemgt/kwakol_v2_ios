import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Platform, LoadingController } from '@ionic/angular';

import { BehaviorSubject } from 'rxjs';
import { constants } from '../models/constants';
import { User, LoginCred, RegisterCred } from '../models/user';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { UtilService } from './util.service';
import { HttpService } from './_http.service';
import { HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User;
  public authState: BehaviorSubject<boolean> = new BehaviorSubject(null);

  private baseUrl = `${constants.baseUrlV2}`;
  private currentUser = constants.currentUser;

  private headers = {'Content-Type': 'application/json'};

  constructor(
    private platform: Platform,
    private router: Router,
    private util: UtilService,
    private dataService: DataService,
    private storage: StorageService,
    private http: HttpService) {

    this.platform.ready().then(() =>{
      this.checkToken(); // Check auth state on every app instantiation
    });

  }

  public async checkToken(): Promise<void> {
    console.log('checking for token....');
    const resp = await this.storage.getInstant(this.currentUser);
    console.log(this.currentUser, resp);
    if(resp){
      this.dataService.setData(2, resp);
      this.authState.next(true);
      this.dataService.setAccessToken(resp.token);
    }
    else{
      this.authState.next(false);
    }
  }

  //Check if token has expired
  // public checkTokenExpiry(user: User): boolean{
  //   const currentDate = new Date();
  //   const expDate =  new Date(user.expiry); //new Date("2020-06-21T11:52:00.000000Z"); //NB Date is 1hr behind actual West Africa time
  //   return currentDate >= expDate ? true : false;
  // }

  //Register user
  public register(payload: RegisterCred): Promise<any>{
    return this.http.post(`${this.baseUrl}/sign-up`, payload, this.headers);
  }

  //Verify email
  public verifyEmail(payload: {email: string; verification_code: string }): Promise<any>{
    return this.http.put(`${this.baseUrl}/verification`, payload, this.headers);
  }

  // Login user
  public async login(data){
    const payload : LoginCred = data;
    // payload.notification_id = '123456';
    try{
      const resp: User = await this.http.post(`${this.baseUrl}/v1/login`, payload, this.headers);

      if(resp.new_user === 'YES'){
        this.dataService.setAccessToken(resp.token);
        this.util.showToast('Successful! Kindly reset your password to continue...', 3000, 'success');
        this.router.navigateByUrl('/change-password', {state: {url: this.router.url, user: resp, fromLogin: true}});
        return;
      }

      if(!resp.has_pin){
        this.dataService.setAccessToken(resp.token);
        // this.util.showToast('You\'ll need to set your pin to continue to application', 3000, 'warning');
        this.util.showToast('You\'ll need to set your pin to continue to application', 3000, 'warning');
        this.router.navigateByUrl('/kyc', {state: {url: this.router.url, data: resp}});
        return;
      }

      await this.storage.set(this.currentUser, resp);
      this.dataService.setData(2, resp); //Set user object into data service
      this.dataService.setAccessToken(resp.token);
      setTimeout(() =>{
        this.isAuthenticated(true); //User now authenticated and can proceed to home;
        this.storage.remove('INITIAL_REG'); //Remove any initial regs so as to begin process from scratch
      }, 500);
      return resp;
    }
    catch(err){
      return Promise.reject(err);
    }
  }

  public async doInitialRegister(payload){
    try {
      // const headers = new HttpHeaders();
      // headers.set('Authorization', `Bearer ${'ergkermlgmlrkmgkerg'}`);
      // console.log(headers.get('Authorization'));
      const resp = await this.http.post(`${this.baseUrl}/v2/register`, payload, this.headers);
      // this.dataService.setAccessToken(resp.token);
      return Promise.resolve(resp);
    } catch (error) {
      console.log(error);
      return Promise.reject(error);
    }
  }

  public async registerConfirm(otp: string, token: string){
    try {
      const initialReg = await this.storage.get('INITIAL_REG');
      const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${initialReg.token}`};
      console.log(headers);
      return this.http.post(`${this.baseUrl}/v2/register-confirm`, {otp}, headers);
    } catch (error) {
      console.log(error);
    }
  }

  public async setPin(payload){
    try {
      const initialReg = await this.storage.get('INITIAL_REG');
      const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${initialReg.token}`};
      console.log(headers);
      return this.http.post(`${this.baseUrl}/v2/create-pin`, payload, headers);
    } catch (error) {
      console.log(error);
    }
  }

  public async resendOTP(): Promise<any>{
    try {
      const initialReg = await this.storage.get('INITIAL_REG');
      const headers = {'Content-Type': 'application/json', Authorization: `Bearer ${initialReg.token}`};
      console.log(headers);
      return this.http.get(`${this.baseUrl}/v2/resend-registration-otp`, {}, headers);
    } catch (error) {
      console.log(error);
    }
  }

  //Forgot Password
  public forgotPassword(email: string): Promise<any>{
    return this.http.put(`${this.baseUrl}/request-password-reset/${email}`, {email}, this.headers);
  }

 //Logout
  public logout(){
    this.clearUserDetails();
  }

  //Returns auth state subject
  public getAuthStateSubject(){
    return this.authState;
  }

  //Returns or updates auth state value
  public isAuthenticated(param?: boolean) : boolean | void{
    return param ? this.authState.next(param) : this.authState.value;
  }

  //Reset user password
  public async newResetPassword(data){
    return await this.http.post(`${this.baseUrl}/v1/new-user-password-reset`, data, this.headers);
  }

  public changePassword(payload): Promise<any>{
    return this.http.post(`${this.baseUrl}/v2/password-reset`, payload, this.headers);
  }

  public resetPassword(email: string): Promise<any>{
    return this.http.get(`${this.baseUrl}/v1/reset-password/${email}`, {}, this.headers);
  }

  public getAccountManager(): Promise<any>{
    return this.http.get(`${this.baseUrl}/v2/account-manager`, {}, this.headers);
  }

  public async sendKYCData(payload): Promise<any>{
    const initialReg = await this.storage.get('INITIAL_REG');
    const headers = (initialReg && initialReg.token) ? {'Content-Type': 'application/json', Authorization: `Bearer ${initialReg.token}`}: this.headers;
    return this.http.post(`${this.baseUrl}/v2/kyc-data`, payload, headers);
  }

  //Clear token form storage
  private clearUserDetails(){
    this.dataService.setAccessToken('');
    this.dataService.clearData();
    this.storage.clear().then(() => {
      this.authState.next(false);
    });
  }

}
