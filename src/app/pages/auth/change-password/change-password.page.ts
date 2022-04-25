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

    const {password, password_confirmation} = form.value;

    if(!form.valid){
      this.util.showToast('Please, kindly fill in both fields', 2000, 'danger');
      return;
    }
    if(password !== password_confirmation){
      this.util.showToast('Passwords do not match', 2000, 'danger');
      return;
    }
    if(!this.util.validateStrongPassword(password)){
      this.util.showToast('Password is too simple. Please include a range of characters to make it stronger', 4000, 'danger');
      // this.util.showToast('Your password must be at least 6 characters long and must contain at least ONE uppercase, ONE lowercase, ONE number and ONE special character.', 4000, 'danger');
      return;
    }
    try{
      await this.util.presentLoading();
      const resp  = await this.auth.newResetPassword({password,  password_confirmation});
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
