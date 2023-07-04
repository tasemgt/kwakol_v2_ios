import { HttpHandler, HttpInterceptor, HttpRequest, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private dataService: DataService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler){

    const url = req.url;
    console.log('URL>> ', url);

    if(url === 'https://v2.kwml.work/api/v2/register-confirm'){
      return next.handle(req);
    }
    if(url === 'https://v2.kwml.work/api/v2/create-pin'){
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
