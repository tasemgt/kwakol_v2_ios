import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('otpModal') otpModal: IonModal;

  public fromPage: string;

  public inputFocused: boolean;

  constructor(
    private router: Router,
    private util: UtilService,
    private loading: LoadingController
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      this.fromPage = this.router.getCurrentNavigation().extras.state.url;
    }
  }

  ngOnInit() {}

  public onInputsFocus(): void {
    this.inputFocused = true;
  }

  public onInputsBlur(): void {
    this.inputFocused = false;
  }

  public continueReg() {
    this.util.presentLoading();
    setTimeout(() => {
      this.loading.dismiss();
      this.otpModal.present();
    }, 1500);
  }

  public verifyOTP() {
    this.otpModal.dismiss();
    setTimeout(() => {
      this.util.presentLoadingModal({
        loadingText: 'Setting up your account...',
        onClosePageUrl: '/kyc',
        fromPageUrl: this.router.url,
      });
    }, 100);
  }
}
