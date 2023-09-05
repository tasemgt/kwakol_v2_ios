import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController } from '@ionic/angular';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { HomeService } from 'src/app/services/home.service';
import { ProfileService } from 'src/app/services/profile.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  @ViewChild('accountManagerModal') accountManagerModal: IonModal;
  @ViewChild('setPinModal') setPinModal: IonModal;
  @ViewChild('otpModal') otpModal: IonModal;

  public user: User;
  public accountDeets;

  public myBeneficiaries = [];

  public pinText: string;
  public inputs = ['', '', '', ''];
  public currentPin = '';
  public newPin = '';
  public confirmPin = '';
  public showConfirm = false;
  public showingStatus = 'current'; //current view of the pin modal

  // public pinMode = 'change';

  public otp: string;
  public otp1: string;
  public otp2: string;
  public otp3: string;
  public otp4: string;
  public otp5: string;
  public otp6: string;

  public otpComplete = false;

  public pinResendSecs = 59;
  public resendOTPText = 'Resend OTP in';
  public isResendingOTP = false;
  public countTimerValue;

  private execptions = ['/settings'];

  constructor(
    private router: Router,
    private auth: AuthService,
    private profileService: ProfileService,
    private util: UtilService,
    private uiService: UiService,
    private homeService: HomeService,
    private dataService: DataService,
    private loading: LoadingController
  ) {}

  ngOnInit(): void {
    this.auth.getAuthStateSubject().subscribe((state) => {
      if (state) {
        this.getUser();
      }
    });

    this.profileService.getProfileUpdateSubject().subscribe((state) => {
      if (state) {
        this.user.username = state.username;
      }
    });
  }

  public async getUser() {
    this.user = this.dataService.getData(2);
  }

  public editProfile() {}

  public requestPasswordReset() {
    this.util.presentAlertConfirm(
      'Reset Password',
      'You will be required to login and create a new password. Proceed?',
      async () => {
        this.util.presentLoading('Logging you out');
        try {
          const resp = await this.profileService.requestPasswordReset(
            this.user.email
          );
          if (resp.code === '100') {
            this.loading.dismiss();
            this.util.showToast(resp.message, 3000, 'success');
            this.auth.logout();
          }
        } catch (err) {
          this.loading.dismiss();
          console.log(err);
        }
      },
      'No',
      'Yes'
    );
  }

  public goToPage(page: string) {
    // if(this.accountDeets){
    //   this.router.navigateByUrl(page, {state: {url: this.router.url, accountDeets : this.accountDeets}});
    //   return;
    // }
    if (this.execptions.includes(page)) {
      this.router.navigateByUrl(page, { state: { url: this.router.url } });
      return;
    }
    this.getAccountDetails(page);
  }

  public logOut() {
    this.uiService
      .getLoadingStateSubject()
      .next({ active: true, data: { type: 'logout', data: null } });
    // this.util.presentAlertConfirm(
    //   'Logout',
    //   'Checking out of Kwakol Funds?',
    //   () => {
    //     this.util.presentLoading();
    //     setTimeout(() => {
    //       this.loading.dismiss();
    //       this.auth.logout();
    //     }, 1500);
    //   },
    //   'Cancel',
    //   'Yes'
    // );
  }

  public async getAccountDetails(page) {
    try {
      this.util.presentLoading('Please wait...');
      const resp = await this.profileService.getAccountInfo();
      this.loading.dismiss();
      if (resp.code === '100') {
        this.accountDeets = resp.data.details;
        this.router.navigateByUrl(page, {
          state: { url: this.router.url, accountDeets: this.accountDeets },
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  public async goToEditProfile() {
    this.router.navigateByUrl('/edit-profile', {
      state: { url: this.router.url, user: this.user },
    });
  }

  public async goToNextOfKin() {
    this.router.navigateByUrl('/next-of-kin', {
      state: { url: this.router.url },
    });
  }

  public goToLinks(link: string): void {
    window.open(link, '_system', 'location=yes');
  }

  public openAccountManagerModal() {
    this.accountManagerModal.present();
  }

  public async goToBeneficiariesPage() {
    this.util.presentLoading();
    try {
      const resp = await this.homeService.getBeneficiaries();
      this.loading.dismiss();
      if (resp.code == 100) {
        this.myBeneficiaries = resp.data;
        this.router.navigateByUrl('/beneficiaries', {
          state: { url: this.router.url, beneficiaries: this.myBeneficiaries },
        });
      }
    } catch (e) {
      this.loading.dismiss();
      this.util.showToast('Please try again', 2000, 'danger');
      console.log(e);
    }
  }

  public goToChangePasswordPage() {
    this.router.navigateByUrl('/change-password', {
      state: { url: this.router.url, user: this.user },
    });
  }

  public async openSetPinModal(mode) {
    // this.pinMode = mode;
    setTimeout(() => {
      if (mode === 'reset') {
        this.showingStatus = 'new';
      }
      this.setPinModal.present();
    }, 100);
    await this.setPinModal.onWillDismiss();
    this.inputs = ['', '', '', ''];
    this.confirmPin = '';
    this.currentPin = '';
    this.newPin = '';
    await this.setPinModal.onDidDismiss();
    // if(this.pinMode === 'reset'){
    //   this.showingStatus = 'new';
    // }
    // else{
    this.showingStatus = 'current';
    // }
  }

  public fillInputFields(text: string) {
    const texts = text.split('');
    console.log(this.inputs);
    for (let i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i] !== '*') {
        // Check if * already exists in input and skip if it is
        this.inputs[i] = texts[i];
        if (this.inputs[i]) {
          setTimeout(() => (this.inputs[text.length - 1] = '*'), 200);
        }
      }
      if (!text[i]) {
        //Account for when there's an undefined in iteration due to backspace of pin.
        this.inputs[i] = texts[i];
      }
      console.log('PIN SET>> ', text);
      if (text.length === 4) {
        if (this.showingStatus === 'current') {
          this.currentPin = text;
        } else if (this.showingStatus === 'new') {
          this.newPin = text;
        } else {
          this.confirmPin = text;
        }
      }
    }
  }

  public onKeypadChanged(eventData: { keypadText: string }) {
    console.log('Changedd....', eventData);
    this.pinText = eventData.keypadText;
    this.fillInputFields(this.pinText);
  }

  public async handlePinSubmit(type) {
    if (type === 'current') {
      console.log('>>>', type);
      if (this.currentPin.length === 4) {
        this.inputs = ['', '', '', ''];
        this.pinText = '';
        this.showingStatus = 'new';
      } else {
        this.util.showToast(
          'A 4 digit pin is required to continue',
          2000,
          'danger'
        );
      }
    } else if (type === 'new') {
      if (this.newPin.length === 4) {
        this.inputs = ['', '', '', ''];
        this.pinText = '';
        this.showingStatus = 'confirm';
      } else {
        this.util.showToast(
          'A 4 digit pin is required to continue',
          2000,
          'danger'
        );
      }
    } else {
      // Confirm part
      console.log('Every>> ', this.currentPin, this.newPin, this.confirmPin);
      if (this.newPin !== this.confirmPin) {
        this.util.showToast(
          'New and confirm PINS do not match',
          2000,
          'danger'
        );
        return;
      }
      const payload = {
        pin: this.currentPin,
        new_pin: this.newPin,
        new_pin_confirmation: this.confirmPin,
      };
      console.log(payload);
      this.util.presentLoading();
      try {
        const resp = await this.profileService.updatePin(payload);
        this.loading.dismiss();
        if (resp.code == 100) {
          // this.util.showToast('Pin set successfully', 3000, 'success');
          await this.setPinModal.dismiss();
          this.uiService
            .getLoadingStateSubject()
            .next({ active: true, data: { type: 'pin', data: null } });
        } else {
          this.util.showToast(resp.data, 2000, 'danger');
        }
      } catch (error) {
        console.log('FAILED>', error);
        this.loading.dismiss();
      }
    }
  }

  public async openOTPModal() {
    this.setPinModal.dismiss();
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

  public onOTPInputChange() {
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

  public async verifyOTP() {
    this.util.presentLoading();
    setTimeout(() => {
      this.loading.dismiss();
      this.otpModal.dismiss();
      this.openSetPinModal('reset');
    }, 1000);
    // try {
    //   const resp = await this.auth.registerConfirm(this.otp, this.initialToken);
    //   this.loading.dismiss();
    //   if(resp.code == '100'){
    //     setTimeout(() => {
    //       this.util.presentLoadingModal({
    //         loadingText: 'Setting up your account...',
    //         onClosePageUrl: '/kyc',
    //         fromPageUrl: this.router.url,
    //         data : tempUser
    //       });
    //     }, 100);
    //   }
    // } catch (error) {
    //   this.loading.dismiss();
    //   this.util.showToast('OTP entered is likely to be incorrect', 2500, 'danger');
    //   console.log(error);
    // }
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

  // this.countdownTimer();
}
