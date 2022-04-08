import { Injectable } from '@angular/core';
import { Platform, LoadingController } from '@ionic/angular';

import { BehaviorSubject } from 'rxjs';
import { constants } from '../models/constants';
import { User, LoginCred, RegisterCred } from '../models/user';
import { DataService } from './data.service';
import { StorageService } from './storage.service';
import { UtilService } from './util.service';
import { HttpService } from './_http.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user: User;
  public authState: BehaviorSubject<boolean> = new BehaviorSubject(null);

  private baseUrl = `${constants.baseUrl}`;
  private currentUser = constants.currentUser;

  private headers = {'Content-Type': 'application/json'};

  constructor(
    private platform: Platform,
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
  public async login(payload: LoginCred){
    try{
      const resp: User = await this.http.post(`${this.baseUrl}/login`, payload, this.headers);
      await this.storage.set(this.currentUser, resp);
      this.dataService.setData(2, resp); //Set user object into data service
      this.dataService.setAccessToken(resp.token); 
      setTimeout(() =>{
        this.isAuthenticated(true); //User now authenticated and can proceed to home;
      }, 500);
      return resp;
    }
    catch(err){
      return Promise.reject(err);
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

  //Clear token form storage
  private clearUserDetails(){
    this.dataService.setAccessToken('');
    this.dataService.clearData();
    this.storage.clear().then(() => {
      this.authState.next(false);
    });
  }

}
