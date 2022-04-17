import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  public passwordType = 'password';
  public passwordIcon = 'eye-close';

  public fromPage: string;
  public user: User;

  constructor(
    private router: Router,
    private auth: AuthService,
    private util: UtilService,
    private loading: LoadingController) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.user = this.router.getCurrentNavigation().extras.state.user;
    }
  }

  ngOnInit() {
  }

  public async changePassword(form: NgForm){
    if(!form.valid){
      this.util.showToast('Please, kindly fill in both fields', 2000, 'danger');
      return;
    }
    try{
      await this.util.presentLoading();
      const resp  = await this.auth.newResetPassword({password: form.value.password, password_confirmation: form.value.password_confirmation});
      // form.reset();
      this.loading.dismiss();
      if(resp.code === '100'){
        this.util.presentAlertModal('passwordChanged');
      }
      else if(resp.code === 418){
        this.util.showToast(resp.message, 3000, 'danger');
        return;
      }
    }
    catch(err){
      this.loading.dismiss();
      if(err.status === 401){
        this.util.showToast('Unauthenticated', 3000, 'danger');
      }
      if(err.status === 0 || err.status === -3){
        this.util.showToast('Ooops! something went wrong, please check your connection and try again.', 3000, 'danger');
      } 
    }
  }

  public hideShowPassword() {
    const deets = this.util.hideShowPassword(
      this.passwordType,
      this.passwordIcon
    );
    this.passwordType = deets.passwordType;
    this.passwordIcon = deets.passwordIcon;
  }

}
