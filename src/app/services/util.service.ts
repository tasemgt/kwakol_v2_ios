import { Injectable } from '@angular/core';
import { AlertController, LoadingController, ModalController, Platform, ToastController } from '@ionic/angular';
import { BehaviorSubject, Subject } from 'rxjs';

import { AlertModalPage } from '../pages/modals/alert-modal/alert-modal.page';
import { alertPageParams } from '../models/constants';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UtilService {

  public keyboardOpen: BehaviorSubject<boolean> = new BehaviorSubject(null);
  public verifyMeterButtonSubject = new Subject<boolean>();

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private router: Router,
    private platform: Platform) { }

  public async showToast(message: string, duration: number, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      position: 'middle',
      color,
      duration,
      mode: 'ios',
      icon: 'assets/icon/logo.svg'
    });
    toast.present();
  }


  public async presentLoading(message?: string){
    const loading = await this.loadingCtrl.create({
      message: `
      <div class="item">
        <i class="loader --3"></i>
      </div>
      `,
      translucent: true,
      cssClass: 'artizan-main-loader'
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

  public async presentAlertConfirm(header:string, message: string, okayCallBack: Function, noBut?:string, yesBut?:string) {
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

  public async presentAlert(message: string) {
    const alert = await this.alertCtrl.create({
      // header,
      // subHeader: 'Subtitle',
      message,
      buttons: ['Ok']
    });
    await alert.present();
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

  public numberWithCommas(x): string{
    x = x.toString().replace(/,/g, '');
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }

  public hideShowPassword(passwordType: string, passwordIcon: string) {
    passwordType = passwordType === 'text' ? 'password' : 'text';
    passwordIcon = passwordIcon === 'eye-open' ? 'eye-close' : 'eye-open';
    return { passwordType, passwordIcon };
  }

}
