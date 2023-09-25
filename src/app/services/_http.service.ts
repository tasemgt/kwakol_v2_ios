import { Injectable } from '@angular/core';
import { Platform } from 'node_modules/@ionic/angular';
import { HttpClient } from '@angular/common/http';
// import { HTTP } from '@ionic-native/http/ngx';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  private _platform: string;

  constructor(
    // private httpNative: HTTP,
    private httpBrowser: HttpClient,
    private platform: Platform) {

    this.platform.ready().then(() => {
      this._platform = this.platform.is('cordova') || this.platform.is('capacitor') ? 'native' : 'browser';
    });
  }


  public async get(url: string, params: any, headers: any): Promise<any>{
    return this.makeHTTPRequest('get', url, headers, params);
  }

  public async post(url: string, payload: any, headers: any): Promise<any>{
    return this.makeHTTPRequest('post', url, headers, payload);
  }

  public async put(url: string, payload: any, headers: any): Promise<any>{
    return this.makeHTTPRequest('put', url, headers, payload);
  }

  private async makeHTTPRequest(method: string, url: string, headers: any, options: string,): Promise<any>{
    let resp;
    try {
      // if(this._platform === 'native'){
      //   console.log('From Native');
      //   switch(method){
      //     case 'get':
      //       resp = await this.httpNative.get(url, options, headers);
      //       break;
      //     case 'put':
      //       resp = await this.httpNative.put(url, options, headers);
      //       break;
      //     case 'post':
      //       resp = await this.httpNative.post(url, options, headers);
      //       break;
      //   };
      //   return this.isJson(resp.data) ?  JSON.parse(resp.data) : resp.data;
      // }
      switch(method){
        case 'get':
          resp = await this.httpBrowser.get(url, {headers}).toPromise();
          break;
        case 'put':
          resp = await this.httpBrowser.put(url, options, {headers}).toPromise();
          break;
        case 'post':
          resp = await this.httpBrowser.post(url, options, {headers}).toPromise();
          break;
      };
      return resp;
    }
    catch(err){
      return Promise.reject(err);
    }
  }

  private isJson(str): boolean{
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
}

}
