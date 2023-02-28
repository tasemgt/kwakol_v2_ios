import { Component, Input, OnInit } from '@angular/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { ModalController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-lock-modal',
  templateUrl: './lock-modal.page.html',
  styleUrls: ['./lock-modal.page.scss'],
})
export class LockModalPage implements OnInit {

  @Input() params;

  image: string;
  title: string;
  desc: string;
  btn: { text: string; url: string };

  private biometrics = ['biometric', 'face', 'finger'];

  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private faio: FingerprintAIO) { }

  ngOnInit() {
    this.image = this.params.image;
    this.title = this.params.title;
    this.desc = this.params.desc;
    this.btn = this.params.btn;
  }

  public onClickBtn() {
    this.handleBiometricsAuth();
  }

  closeModal() {
    this.modalCtrl.dismiss();
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
            this.closeModal();
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

}
