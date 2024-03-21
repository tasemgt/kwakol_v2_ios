import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'node_modules/rxjs';
import { DataService } from './data.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private dataService: DataService, private storage: StorageService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler){

    const url = req.url;
    console.log('URL>> ', url);

    if(url === 'https://v2.kwml.work/api/v2/register-confirm'){
      return next.handle(req);
    }

    if(url === 'https://v2.kwml.work/api/v2/create-pin'){
      console.log('here create pin');
      return next.handle(req);
      // this.storage.get('INITIAL_REG').then((resp) =>{
      //   console.log('resp>> ', resp);
      //   if(resp.token){
      //   }
      // }).catch((e) =>{
      // });
    }

    if(url === 'https://v2.kwml.work/api/v2/resend-registration-otp'){
      return next.handle(req);
    }

    if(url === 'https://v2.kwml.work/api/v2/kyc-data'){
      return next.handle(req);
    }


    // if(
      //   !(url.includes('/login') ||
      //     url.includes('/onboarding') ||
      //     url.includes('/register') ||
      //     url.includes('/otp') ||
      //     url.includes('/forgot-pasword') ||
      //     url.includes('/reset-pasword') ||
      //     url.includes('/verify'))
      //   )
      //   {
      const token = this.dataService.getAccessToken();
        // console.log('TOKEN>> ', token);
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(req);
    // }


  }
}
