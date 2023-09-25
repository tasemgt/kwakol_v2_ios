import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FingerprintAIO } from '_node_modules/@ionic-native/fingerprint-aio/ngx';
import { ModalController, Platform } from '_node_modules/@ionic/angular';
import { BehaviorSubject } from '_node_modules/rxjs';
import { alertPageParams } from 'src/app/models/constants';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-lock-modal',
  templateUrl: './lock-modal.page.html',
  styleUrls: ['./lock-modal.page.scss'],
})
export class LockModalPage implements OnInit {

  image: string;
  title: string;
  desc: string;
  btn: { text: string; url: string };

  private biometrics = ['biometric', 'face', 'finger'];

  constructor(
    private platform: Platform,
    private router: Router,
    private util: UtilService,
    private faio: FingerprintAIO) { }

  ngOnInit() {
    const params = alertPageParams.lockedScreen;
    this.image = params.image;
    this.title = params.title;
    this.desc = params.desc;
    this.btn = params.btn;
  }

  public onClickBtn() {
    this.handleBiometricsAuth();
  }


  private async handleBiometricsAuth() {
    try {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        const result = await this.faio.isAvailable(); //result -> biometric, face, finger
        console.log(result);
        if (this.biometrics.includes(result)) {
          const bio = await this.faio.show({
            title: `...`,
            subtitle: `Unlock with ${result} ID`,
            disableBackup: true,
          });
          console.log('BIO>> ', bio);
          if(bio === 'biometric_success'){
            // Got to dashboard
            this.util.getLockSubject().next(true); //To re-initialize locking.
            this.router.navigateByUrl('/tabs/home');
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}
