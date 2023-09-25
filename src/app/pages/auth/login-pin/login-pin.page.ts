import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '_node_modules/@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login-pin',
  templateUrl: './login-pin.page.html',
  styleUrls: ['./login-pin.page.scss'],
})
export class LoginPinPage implements OnInit {

  pin: string;

  constructor(
    private router: Router,
    private util: UtilService,
    private loading: LoadingController) {}

  ngOnInit() {
    this.pin = '';
  }

  public getPressedKey(key: string): void{
    if(key === 'cancel'){
      this.pin = this.pin.slice(0, -1);
    }
    else if(key === 'clear'){
      this.pin = '';
    }
    else{
      this.pin.length < 4 ? this.pin += key : '';
      if(this.pin.length === 4){
        this.doLogin();
      }
    }
  }

  private doLogin(){
    this.util.presentLoading('');
    setTimeout(() => {
      this.loading.dismiss();
      this.router.navigateByUrl('/tabs/home');
    }, 2000);
  }

}
