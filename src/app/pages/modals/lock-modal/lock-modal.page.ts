import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { ModalController, Platform } from '@ionic/angular';
import { BehaviorSubject } from 'rxjs';
import { alertPageParams, constants } from 'src/app/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-lock-modal',
  templateUrl: './lock-modal.page.html',
  styleUrls: ['./lock-modal.page.scss'],
})
export class LockModalPage implements OnInit {

  public constants = constants;

  image: string;
  title: string;
  desc: string;
  btn: { text: string; url: string };

  private biometrics = ['biometric', 'face', 'finger'];

  constructor(
    private platform: Platform,
    private router: Router,
    private util: UtilService,
    private ui: UiService,
    private storageService: StorageService,
    private modalCtrl: ModalController,
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
    console.log('Im here');
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
          if(bio === 'Success'){ //ios specific fix
            // Unlock app
            // this.util.getLockSubject().next(true); //To re-initialize locking.
            this.modalCtrl.dismiss();
            this.ui.getAppLockModalOpenStateSubject().next(true);
            this.storageService.remove(this.constants.lockedState);
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}
