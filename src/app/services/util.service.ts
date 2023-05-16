import { Injectable } from '@angular/core';
import { AlertController, AnimationController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';

import { AlertModalPage } from '../pages/modals/alert-modal/alert-modal.page';
import { alertPageParams } from '../models/constants';
import { Router } from '@angular/router';
import { LoadingPage } from '../pages/modals/loading/loading.page';
import { LoadModalAnimation } from '../animation/loadModalAnimation';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public keyboardOpen: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public lockSubject: BehaviorSubject<boolean> = new BehaviorSubject( false );
  public verifyMeterButtonSubject = new Subject<boolean>();

  private loadModalAnimator: LoadModalAnimation;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private animationCtrl: AnimationController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private platform: Platform) {
      this.loadModalAnimator = new LoadModalAnimation(this.animationCtrl);
    }

  

  public getLockSubject(){
    return this.lockSubject;
  }

  public async showToast(message: string, duration: number, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: 'middle',
      color,
      duration,
      mode: 'ios',
      // icon: 'assets/icon/logo.svg'
    });
    toast.present();
  }


  public async presentLoading(message?: string){
    const loading = await this.loadingCtrl.create({
      message: `
      <div class="container">
        <div class="switchbox">
          <div class="switch"></div>
          <div class="switch"></div>
          <div class="switch"></div>
        </div>
      </div>
      `,
      translucent: true,
      cssClass: 'kwakol-main-loader'
    });
    return loading.present();
  }

  public async presentLoading2(message: string){
    const loading = await this.loadingCtrl.create({
      message,
      translucent: true,
    });
    loading.present();
    return loading;
  }

  public async presentLoadingModal(params: {loadingText: string; onClosePageUrl: string; fromPageUrl: string}){
    // ModalLoaderParams {loadingText, onClosePage}
    try {
      const modal = await this.modalCtrl.create({
        component: LoadingPage,
        animated: true,
        cssClass: 'transp-modal',
        enterAnimation: this.loadModalAnimator.enterAnimation,
        // leaveAnimation: this.loadModalAnimator.leaveAnimation
        componentProps: {loadingText: params.loadingText}
      });
      await modal.present();
      const {data} = await modal.onWillDismiss();
      data ? this.router.navigateByUrl(params.onClosePageUrl, { state: {url: params.fromPageUrl}}) : '';
    }
    catch (error) {
      console.log('Error: ', error);
    }
  }

  public async presentAlertConfirm(header: string, message: string, okayCallBack: () => void, noBut?:string, yesBut?:string) {
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
            }
          }, {
            text: yesBut || 'Yes',
            cssClass: 'yes-button',
            handler: () => {
              okayCallBack();
            }
          }
        ]
      });
    await alert.present();
  }

  public async presentAlert(message: string, onDismiss?: () => void) {
    const alert = await this.alertCtrl.create({
      // header,
      // subHeader: 'Subtitle',
      message,
      buttons: ['Ok']
    });
    await alert.present();
    alert.onWillDismiss().then(() => onDismiss());
  }

  public async presentAlertModal(alertTriggerPage: string, datas?: any){ //datas = any extra info needed to be pased to modal
    const params = alertPageParams[alertTriggerPage];
    try {
      const modal = await this.modalCtrl.create({
        component: AlertModalPage,
        animated: true,
        componentProps: {params, datas}
      });
      await modal.present();
      const {data} = await modal.onWillDismiss();
      this.router.navigateByUrl(params.btn.url);
      // await modal.onDidDismiss();
    }
    catch (error) {
      console.log('Error: ', error);
    }
  }

  public validatePhone(phone): boolean{
    if(isNaN(Number(phone))){
      return false;
    }
    if(phone.length < 11){
      return false;
    }
    return true;
  }

  public validateEmail(email): boolean{
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  public validateStrongPassword(password: string){
    const regX =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{6,15}$/;
    if(password.match(regX)){
      return true;
    }
    return false;
  }

  public numberWithCommas(x): string{
    x = x.toString().replace(/,/g, '');
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  public hideShowPassword(passwordType: string, passwordIcon: string) {
    passwordType = passwordType === 'text' ? 'password' : 'text';
    passwordIcon = passwordIcon === 'eye-open' ? 'eye-close' : 'eye-open';
    return { passwordType, passwordIcon };
  }

  public greetMessage(currentTime = new Date()): string{
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

}
