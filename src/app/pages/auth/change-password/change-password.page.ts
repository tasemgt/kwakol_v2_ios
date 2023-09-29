import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController, NavController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {

  @ViewChild('LoadingModalDiv') loadingModalDiv: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  public showLoadingModal: boolean;
  public backdropActive = false;


  public passwordType = 'password';
  public passwordIcon = 'eye-close';

  public currentPassword: string;
  public newPassword: string;
  public confirmPassword: string;
  public payload: any;

  public fromPage: string;
  public fromLogin: boolean;
  public user: User;

  constructor(
    private router: Router,
    private auth: AuthService,
    private util: UtilService,
    private loading: LoadingController,
    private navController: NavController,
    private renderer: Renderer2) {
    if(this.router.getCurrentNavigation().extras.state){
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
      this.user = this.router.getCurrentNavigation().extras.state.user;
      this.fromLogin = this.router.getCurrentNavigation().extras.state.fromLogin;
    }
  }

  ngOnInit() {
  }

  public hideShowPassword() {
    const deets = this.util.hideShowPassword(
      this.passwordType,
      this.passwordIcon
    );
    this.passwordType = deets.passwordType;
    this.passwordIcon = deets.passwordIcon;
  }

  public async continueToPrompt(){
    const payload = {
      old_password: this.currentPassword,
      password: this.newPassword,
      password_confirmation: this.confirmPassword,
    };
    if (this.util.checkUndefinedProperties(payload)) {
      this.util.showToast('Kindly ensure no empty fields', 2500, 'danger');
      return;
    }
    if(this.newPassword !== this.confirmPassword){
      this.util.showToast('New Passwords do not match', 2500, 'danger');
      return;
    }
    if(!this.util.validateStrongPassword(this.newPassword)){
      this.util.showToast('Password is simple. Please include a range of characters to make it stronger', 4000, 'danger');
      // this.util.showToast('Your password must be at least 6 characters long and must contain at least ONE uppercase, ONE lowercase, ONE number and ONE special character.', 4000, 'danger');
      return;
    }
    this.payload = payload;
    console.log(payload);
    if(this.fromLogin){
      this.changePassword(payload);
      return;
    }
    this.openLoadingModal();
    /////
  }

  public openLoadingModal() {
    setTimeout(() => {
      this.backdropActive = true;
      this.showLoadingModal = true;
    }, 10);
  }

  public closeLoadingModal(confirm) {
    const loadingModalDiv = this.loadingModalDiv.nativeElement;
    const backdrop = this.backdrop.nativeElement;

    this.renderer.removeClass(loadingModalDiv, 'animate__slideInUp');
    this.renderer.addClass(loadingModalDiv, 'animate__slideOutDown');
    this.renderer.removeClass(backdrop, 'animate__fadeIn');
    this.renderer.addClass(backdrop, 'animate__fadeOut');
    setTimeout(() => {
      this.backdropActive = false;
      this.showLoadingModal = false;
      if(confirm){
        this.changePassword(this.payload);
      }
    }, 100);
  }

  private async changePassword(payload){
    console.log(payload);
    this.util.presentLoading();
    try{
      const resp  = this.fromLogin ? await this.auth.newResetPassword(payload) : await this.auth.changePassword(payload);
      this.loading.dismiss();
      if(resp.code === '100'){
        console.log(resp);
        this.util.showToast('Password changed', 2500, 'success');
        this.currentPassword = ''; this.newPassword = ''; this.currentPassword = '';

        if(this.fromLogin){
          this.navController.setDirection('back');
          this.router.navigateByUrl('/onboarding');
          return;
        }

        //Log user out
        this.auth.logout();
      }
      else if(resp.code == 418){
        this.util.showToast(resp.message, 3000, 'danger');
        return;
      }
    }
    catch(err){
      this.loading.dismiss();
      console.log(err);
      if(err.status == 401){
        this.util.showToast('Unauthenticated', 3000, 'danger');
      }
      if(err.status == 0 || err.status == -3){
        this.util.showToast('Ooops! something went wrong, please check your connection and try again.', 3000, 'danger');
      }
    }
  }

}
