import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
import { countries } from 'src/app/models/constants';
import { RegisterCred } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  @ViewChild('otpModal') otpModal: IonModal;
  @ViewChild('selectCountryModal') selectCountryModal: IonModal;
  @ViewChild('selectDOBModal') selectDOBModal: IonModal;

  public fromPage: string;
  public regCreds = new RegisterCred();
  public selectedCountryImg = '';
  public currentDate: Date | null;
  public selectedDate: Date | null;

  public countries = countries;

  public otp: string;
  public otp1: string;
  public otp2: string;
  public otp3: string;
  public otp4: string;
  public otp5: string;
  public otp6: string;

  public pinResendSecs = 59;
  public resendOTPText = 'Resend OTP in';
  public isResendingOTP = false;
  public countTimerValue;

  public otpComplete = false;
  public initialToken = '';

  public inputFocused: boolean;

  constructor(
    private router: Router,
    private auth: AuthService,
    private util: UtilService,
    private storage: StorageService,
    private loading: LoadingController
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.regCreds.email = state.userInfo.email;
      this.regCreds.password = state.userInfo.password;
      this.regCreds.password_confirmation = state.userInfo.confirmPassword;
      this.regCreds.notification_id = '12345';
      this.regCreds.remember_me = true;

      console.log(this.regCreds);
    }
  }

  ngOnInit() {
    console.log('Im here na');
    this.otp = '';
    this.currentDate = new Date();
  }

  public onInputsFocus(): void {
    this.inputFocused = true;
  }

  public onInputsBlur(): void {
    this.inputFocused = false;
  }

  public selectDOB() {
    this.regCreds.date_of_birth = this.util.getSimpleDate(this.selectedDate);
    this.selectDOBModal.dismiss();
  }

  public closeDateModal() {
    // this.regCreds.date_of_birth = 'Date of Birth';
    this.selectDOBModal.dismiss();
  }

  public selectCountry(country) {
    console.log(country);
    this.regCreds.country = country.name;
    this.selectedCountryImg = country.img;
    this.selectCountryModal.dismiss();
  }

  public async continueReg() {
    console.log(this.regCreds);
    if (this.util.checkUndefinedProperties(this.regCreds)) {
      this.util.showToast('Kindly ensure no empty fields', 2500, 'danger');
      return;
    }
    const initialReg = await this.storage.get('INITIAL_REG');
    if (initialReg) {
      // this.otpModal.present();
      this.openOTPModal();
      return;
    }
    this.util.presentLoading();
    try {
      const resp = await this.auth.doInitialRegister(this.util.trimProperties(this.regCreds));
      this.loading.dismiss();
      if (resp.code === '100') {
        console.log(resp.data);
        this.storage.set('INITIAL_REG', resp.data);
        this.initialToken = resp.data.token;
        // this.otpModal.present();
        this.openOTPModal();
      } else if (resp.code === '418') {
        console.log(resp);
      }
    } catch (error) {
      this.loading.dismiss();
      console.log('ERROR', error);
      if (error.error.message.includes('Duplicate entry')) {
        this.util.showToast(
          'Email or phone number already taken',
          3000,
          'danger'
        );
      }
    }

    // setTimeout(() => {
    //   this.loading.dismiss();
    //   this.otpModal.present();
    // }, 1500);
  }

  public onPinInputChange() {
    if (
      this.otp1 &&
      this.otp2 &&
      this.otp3 &&
      this.otp4 &&
      this.otp5 &&
      this.otp6
    ) {
      this.otp =
        this.otp1 + this.otp2 + this.otp3 + this.otp4 + this.otp5 + this.otp6;
      this.otpComplete = true;
      console.log(this.otp);
      return;
    }
    this.otpComplete = false;
  }

  public async openOTPModal() {
    this.otpModal.present();
    this.countTimerValue = this.countdownTimer();
    await this.otpModal.onDidDismiss();
    this.otp = '';
    this.otp1 = '';
    this.otp2 = '';
    this.otp3 = '';
    this.otp4 = '';
    this.otp5 = '';
    this.otp6 = '';
    this.otpComplete = false;
    clearInterval(this.countTimerValue);
    this.pinResendSecs = 59;
  }

  public async verifyOTP() {
    const tempUser = await this.storage.get('INITIAL_REG');
    this.otpModal.dismiss();
    this.util.presentLoading();
    try {
      const resp = await this.auth.registerConfirm(this.otp, this.initialToken);
      this.loading.dismiss();
      if (resp.code == '100') {
        setTimeout(() => {
          this.util.presentLoadingModal({
            loadingText: 'Setting up your account...',
            onClosePageUrl: '/kyc',
            fromPageUrl: this.router.url,
            data: tempUser,
          });
        }, 100);
      }
    } catch (error) {
      this.loading.dismiss();
      this.util.showToast(
        'OTP entered is likely to be incorrect',
        2500,
        'danger'
      );
      console.log(error);
    }
  }

  public countdownTimer() {
    const timer = setInterval(() => {
      console.log(this.pinResendSecs + 's');

      if (this.pinResendSecs === 1) {
        clearInterval(timer);
        console.log('Time is up!');
        setTimeout(() => {
          this.isResendingOTP = true;
          this.resendOTPText = 'Resending OTP...';

          setTimeout(() => {
            this.util.showToast('Your OTP has been resent...', 2000, 'success');
            this.resendOTPText = 'Resend OTP in';
            this.isResendingOTP = false;
            this.pinResendSecs = 59;
            this.countTimerValue = this.countdownTimer();
          }, 1500);
        }, 100);
      }
      this.pinResendSecs--;
    }, 1000);
    return timer;
  }
}
