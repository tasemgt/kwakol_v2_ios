import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  public passwordType = 'password';
  public passwordIcon = 'eye-close';

  constructor(
    private auth: AuthService,
    private util: UtilService,
    private loading: LoadingController) { }

  ngOnInit() {
  }


  public async login(form: NgForm): Promise<void>{
    if(!form.valid){
      this.util.showToast('Email or password cannot be empty', 3000, 'danger');
      return;
    }
    // try{
    //   await this.util.presentLoading('Hi Mikie...');
    //   const resp  = await this.auth.login('phone', {phone: form.value.phone, password: form.value.password});
    //   form.reset();
    //   this.loading.dismiss();
    //   if(!resp.token){
    //     this.util.showToast(resp.message, 3000, 'danger');
    //     return;
    //   }
    // }
    // catch(err){
    //   this.loading.dismiss();
    //   if(err.status === 401){
    //     this.util.showToast('Invalid phone number of password', 3000, 'danger');
    //   }
    //   if(err.status === 0 || err.status === -3){
    //     this.util.showToast('Ooops! something went wrong, please check your connection and try again.', 3000, 'danger');
    //   } 
    // }
    
  }
}
