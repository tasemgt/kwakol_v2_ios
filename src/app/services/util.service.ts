import { Injectable } from '@angular/core';
import {
  AlertController,
  AnimationController,
  LoadingController,
  ModalController,
  Platform,
  ToastController,
} from 'node_modules/@ionic/angular';
import { BehaviorSubject, Subject } from 'node_modules/rxjs';

import { AlertModalPage } from '../pages/modals/alert-modal/alert-modal.page';
import { alertPageParams } from '../models/constants';
import { Router } from '@angular/router';
import { LoadingPage } from '../pages/modals/loading/loading.page';
import { LoadModalAnimation } from '../animation/loadModalAnimation';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { UiService } from './ui.service';
import { LockModalPage } from '../pages/modals/lock-modal/lock-modal.page';

@Injectable({
  providedIn: 'root',
})
export class UtilService {
  public keyboardOpen: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public lockSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public verifyMeterButtonSubject = new Subject<boolean>();

  private loadModalAnimator: LoadModalAnimation;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private animationCtrl: AnimationController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private uiService: UiService,
    private platform: Platform,
    private callNumber: CallNumber,
    private clipboard: Clipboard
  ) {
    this.loadModalAnimator = new LoadModalAnimation(this.animationCtrl);
  }

  public getLockSubject() {
    return this.lockSubject;
  }

  public async showToast(message: string, duration: number, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: 'top',
      color,
      duration,
      mode: 'md',
      // icon: 'assets/icon/logo.svg'
    });
    toast.present();
  }

  public async presentLoading(message?: string) {
    const loading = await this.loadingCtrl.create({
      message: `
      <ion-spinner color="primary" name="crescent"></ion-spinner>
      `,
      translucent: true,
      cssClass: 'kwakol-main-loader',
    });
    return loading.present();
  }
  // public async presentLoading(message?: string){
  //   const loading = await this.loadingCtrl.create({
  //     message: `
  //     <div class="container">
  //       <div class="switchbox">
  //         <div class="switch"></div>
  //         <div class="switch"></div>
  //         <div class="switch"></div>
  //       </div>
  //     </div>
  //     `,
  //     translucent: true,
  //     cssClass: 'kwakol-main-loader'
  //   });
  //   return loading.present();
  // }

  public async presentLoading2(message: string) {
    const loading = await this.loadingCtrl.create({
      message,
      translucent: true,
    });
    loading.present();
    return loading;
  }

  public async presentLoadingModal(params: {
    loadingText: string;
    onClosePageUrl: string;
    fromPageUrl: string;
    data?: any;
  }) {
    // ModalLoaderParams {loadingText, onClosePage}
    try {
      const modal = await this.modalCtrl.create({
        component: LoadingPage,
        animated: true,
        cssClass: 'transp-modal',
        enterAnimation: this.loadModalAnimator.enterAnimation,
        // leaveAnimation: this.loadModalAnimator.leaveAnimation
        componentProps: { loadingText: params.loadingText },
      });
      await modal.present();
      const { data } = await modal.onWillDismiss();
      data
        ? this.router.navigateByUrl(params.onClosePageUrl, {
            state: { url: params.fromPageUrl, data: params.data },
          })
        : '';
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  public async presentAlertConfirm(
    header: string,
    message: string,
    okayCallBack: () => void,
    noBut?: string,
    yesBut?: string
  ) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      mode: 'md',
      cssClass: 'kwakol-alert',
      buttons: [
        {
          text: noBut || 'No',
          role: 'cancel',
          cssClass: 'no-button',
          handler: (blah) => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: yesBut || 'Yes',
          cssClass: 'yes-button',
          handler: () => {
            okayCallBack();
          },
        },
      ],
    });
    await alert.present();
  }

  public async presentAlert(message: string, onDismiss?: () => void) {
    const alert = await this.alertCtrl.create({
      // header,
      // subHeader: 'Subtitle',
      message,
      buttons: ['Ok'],
    });
    await alert.present();
    alert.onWillDismiss().then(() => onDismiss());
  }

  public async presentAlertModal(alertTriggerPage: string, datas?: any) {
    //datas = any extra info needed to be pased to modal
    const params = alertPageParams[alertTriggerPage];
    const comp = alertTriggerPage === 'emailSent' ? AlertModalPage : LockModalPage;
    try {
      const modal = await this.modalCtrl.create({
        component: comp,
        backdropDismiss: false,
        animated: true,
        componentProps: { params, datas },
      });
      await modal.present();
      const { data } = await modal.onWillDismiss();
      //used for resetting passwod
      if(alertTriggerPage === 'emailSent'){
        this.router.navigateByUrl('/onboarding');
        this.uiService.getinstructOnboardingStateStateSubject().next(true);
      }
      // await modal.onDidDismiss();
      return modal;
    } catch (error) {
      console.log('Error: ', error);
    }
  }

  public validatePhone(phone): boolean {
    if (isNaN(Number(phone))) {
      return false;
    }
    if (phone.length < 11) {
      return false;
    }
    return true;
  }

  public validateEmail(email): boolean {
    let re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public validateStrongPassword(password: string) {
    const regX =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/;
    if (password.match(regX)) {
      return true;
    }
    return false;
  }

  public numberWithCommas(x): string {
    if (x) {
      x = x.toString().replace(/,/g, '');
      const stringArr = x.split('.');
      // console.log(stringArr);
      if(stringArr.length > 1){
        return (stringArr[0].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '.' + stringArr[1]);
      }
      return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  }


  public roundUpDecimal(num): string{
    if(typeof num === 'string'){
      num = num.toString().replace(/,/g, '');
    }
    return Number(num).toFixed(2);
  }

  public hideShowPassword(passwordType: string, passwordIcon: string) {
    passwordType = passwordType === 'text' ? 'password' : 'text';
    passwordIcon = passwordIcon === 'eye-open' ? 'eye-close' : 'eye-open';
    return { passwordType, passwordIcon };
  }

  public greetMessage(currentTime = new Date()): string {
    const currentHour = currentTime.getHours();
    const splitAfternoon = 12; // 24hr time to split the afternoon
    const splitEvening = 16; // 24hr time to split the evening

    if (currentHour >= splitAfternoon && currentHour <= splitEvening) {
      // Between 12 PM and 5PM
      return 'afternoon';
    } else if (currentHour >= splitEvening) {
      // Between 5PM and Midnight
      return 'evening';
    }
    // Between dawn and noon
    return 'morning';
  }

  public getAmountSign(type: string): string {
    if (['deposit', 'bonus', 'profit'].includes(type)) {
      return '+';
    }
    return '-';
  }

  public async clipboardCopy(item: string) {
    if (item) {
      const copied = await this.clipboard.copy(item);
      if (copied) {
        // this.showToast(`Item ${item} copied...`, 2000, 'success');
        this.showToast(`Copied to clipboard`, 2000, 'success');
      }
    }
  }

  public checkUndefinedProperties(obj) {
    for (const key in obj) {
      if (key === 'middlename') {
        continue; //Skip middlename checks;
      }
      if (obj.hasOwnProperty(key)) {
        if (!obj[key]) {
          return true;
        }
      }
    }
    return false;
  }

  public trimProperties(obj) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        if (typeof obj[key] === 'boolean') {
          continue; //Skip remember me or any other bools checks;
        }
        obj[key] = obj[key].trim();
      }
    }
    return obj;
  }

  public openCall(phoneNum: string){
    if(this.platform.is('cordova') || this.platform.is('capacitor')){
      this.callNumber.callNumber(phoneNum, false)
        .then(res => console.log('Launched dialer!', res))
        .catch(err => console.log('Error launching dialer', err));
    }
    else{
      console.log('Cordova or Capacitor not found');
    }
  }

  public getSimpleDate(date) {
    // Input date string
    const inputDateString = date;

    // Parse the input date string into a Date object
    const inputDate = new Date(inputDateString);

    // Get the year, month, and day from the Date object
    const year = inputDate.getFullYear();
    const month = String(inputDate.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1 and pad with leading zeros if needed
    const day = String(inputDate.getDate()).padStart(2, '0');

    // Create the formatted date string
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  public infoModalFunc = (type, data, infoModalData): boolean => {
    console.log('DATA', data);
    switch (type) {
      case 'deposit':
        const walletCont = [
          { item: 'Account Name', value: data.fullname },
          { item: 'Bank Name', value: data.bank_account_name || 'Cash' },
          { item: 'Reference', value: data.ref },
          { item: 'Deposit Type', value: data.type },
          // {
          //   item: 'Fee',
          //   value:
          //     (data.transfer_type === 'CASH' ? '$' : 'N') +
          //     (data.fee || '0.00'),
          // },
        ];
        const invCont = [
          { item: 'Comment', value: data.comment },
          // {
          //   item: 'Fee',
          //   value:
          //     (data.transfer_type === 'CASH' ? '$' : 'N') +
          //     (data.fee || '0.00'),
          // },
        ];
        infoModalData.icon = 'trans-deposit.svg';
        infoModalData.title = 'Deposit';
        infoModalData.content = data.fromWallet ? walletCont : invCont;
        infoModalData.amount = data.amount;
        infoModalData.date = `${data.date} - ${data.time}`;
        break;
      case 'withdrawal':
        const walletContent = [
          { item: 'Account Name', value: data.fullname },
          { item: 'Account Number', value: data.bank_account || 'Cash' },
          { item: 'Bank Name', value: data.bank_account_name || 'Cash' },
          { item: 'Reference', value: data.ref },
          { item: 'Withdrawal Type', value: data.type },
          // {
          //   item: 'Fee',
          //   value:
          //     (data.transfer_type === 'CASH' ? '$' : 'N') +
          //     (data.fee || '0.00'),
          // },
        ];
        const invContent = [
          { item: 'Comment', value: data.comment },
          // {
          //   item: 'Fee',
          //   value:
          //     (data.transfer_type === 'CASH' ? '$' : 'N') +
          //     (data.fee || '0.00'),
          // },
        ];
        infoModalData.icon = 'trans-withdraw.svg';
        infoModalData.title = 'Withdrawal';
        infoModalData.content = data.fromWallet
          ? walletContent
          : invContent;
        infoModalData.amount = data.amount;
        infoModalData.date = `${data.date} - ${data.time}`;
        break;
      case 'transfer':
        infoModalData.icon = 'trans-transfer-plan.svg';
        infoModalData.title = 'Wallet Transfer';
        infoModalData.content = [
          { item: 'Username', value: data.email },
          { item: 'Profile Name', value: data.fullname },
          { item: 'Reference', value: data.ref },
        ];
        infoModalData.amount = data.amount;
        infoModalData.date = `${data.date} - ${data.time}`;
        break;
      case 'profit':
        infoModalData.icon = 'trans-profit.svg';
        infoModalData.title = 'Profit';
        infoModalData.content = [
          data.close_trade ? { item: 'Closed Trade', value: `$${(this.numberWithCommas(this.roundUpDecimal(data.close_trade)))}` } : '',
          data.commission ? { item: 'Commission', value: `$${this.numberWithCommas(this.roundUpDecimal(data.commission))}` } : '',
          { item: 'Percentage (P/L)', value: `${this.numberWithCommas(this.roundUpDecimal(data.percentage))}%` },
          { item: 'Opening Balance', value: `$${this.numberWithCommas(this.roundUpDecimal(data.opening_balance))}`},
          { item: 'Reference', value: data.ref },
          // { item: 'Month', value: 'Akim John' },
          data.net_profit ? { item: 'Profit', value: `$${this.numberWithCommas(this.roundUpDecimal(data.net_profit))}` } : '',
        ].filter((i) => i !== '');
        infoModalData.amount = data.amount;
        infoModalData.date = `${data.date} - ${data.time}`;
        break;
      case 'bonus':
        infoModalData.icon = 'trans-bonus.svg';
        infoModalData.title = 'Bonus';
        infoModalData.content = [
          { item: 'Bonus Type', value: 'Referral' },
          { item: 'Reference', value: 'Akim John' },
        ];
        infoModalData.amount = '1200';
        infoModalData.date = `${data.date} - ${data.time}`;
    }
    return true;
  };
}
