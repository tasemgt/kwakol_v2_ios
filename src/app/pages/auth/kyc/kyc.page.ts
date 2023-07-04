import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonModal, LoadingController, Platform } from '@ionic/angular';
import { KeypadComponent } from 'src/app/components/keypad/keypad.component';
import { constants } from 'src/app/models/constants';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

declare const cordova: any;

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.page.html',
  styleUrls: ['./kyc.page.scss'],
})
export class KycPage implements OnInit {
  @ViewChild('setPinModal') setPinModal: IonModal;
  @ViewChild('appKeypad') appKeypad: KeypadComponent;

  public pinText: string;

  public fromPage: string;
  public tempUser: any;
  public constants = constants;

  public inputs = ['', '', '', ''];


  public pin = '';
  public confirmPin = '';

  public showConfirm = false;
  public isVerified = false;

  constructor(
    private router: Router,
    private util: UtilService,
    private loading: LoadingController,
    private auth: AuthService,
    private storage: StorageService,
    private platform: Platform,
    private el: ElementRef
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.tempUser = state.data;
      this.isVerified = this.tempUser.verified_kyc;

      console.log('SSSS', state);
    }
  }

  ngOnInit() {
    this.pinText = '';
    console.log('TEMP_USER', this.tempUser);
  }

  public async openSetPinModal() {
    setTimeout(() => this.setPinModal.present(), 100);
    await this.setPinModal.onWillDismiss();
    this.inputs = ['', '', '', ''];
    await this.setPinModal.onDidDismiss();
    this.showConfirm = false;
  }

  public onKeypadChanged(eventData: { keypadText: string }) {
    console.log('Changedd....', eventData);
    this.pinText = eventData.keypadText;
    this.fillInputFields(this.pinText);
  }

  public fillInputFields(text: string) {
    const texts = text.split('');
    console.log(this.inputs);
    for (let i = 0; i < this.inputs.length; i++) {
      if (this.inputs[i] !== '*') { // Check if * already exists in input and skip if it is
        this.inputs[i] = texts[i];
        if (this.inputs[i]) {
          setTimeout(() => (this.inputs[text.length - 1] = '*'), 200);
        }
      }
      if(!text[i]){ //Account for when there's an undefined in iteration due to backspace of pin.
        this.inputs[i] = texts[i];
      }
      console.log('PIN SET>> ', text);
      if(text.length === 4){
        if(!this.showConfirm){
          this.pin = text;
        }
        else{
          this.confirmPin = text;
        }
      }
    }
  }

  public async handlePinSubmit(type){
    if(type === 'continue'){
      console.log('HIIIIIIIIIII>>');
      if(this.pin.length === 4){
        this.inputs = ['', '', '', ''];
        this.pinText = '';
        this.showConfirm = true;
        this.appKeypad.onClearEmitter();
      }
      else{
        this.util.showToast('A 4 digit pin is required to continue', 2000, 'danger');
      }
    }
    else{
      //Confirm part
      console.log('Every>> ', this.pin, this.confirmPin);
      if(this.pin !== this.confirmPin){
        this.util.showToast('Both pins do not match', 2000, 'danger');
        return;
      }
      const payload = {
        pin: this.pin,
        pin_confirmation: this.confirmPin
      };
      console.log(payload);
      this.util.presentLoading();
      try {
        const resp = await this.auth.setPin(payload);
        this.loading.dismiss();
        if(resp.code == 100){
          this.util.showToast('Pin set successfully', 3000, 'success');
          this.storage.remove('INITIAL_REG');
          this.router.navigateByUrl('/onboarding');
          await this.setPinModal.dismiss();
        }
        else{
          this.util.showToast(resp.message, 2000, 'danger');
        }
      } catch (error) {
        console.log('FAILED>', error);
        this.loading.dismiss();
      }
      // setTimeout(async () => {
      //   // this.util.presentAlertModal('depositConfirm');
      // }, 1000);
      // this.storage.remove('INITIAL_REG');
    }
  }

  public doCleanup(){
    //
  }

  public callMetaMap() {
    this.platform.ready().then(() => {
      if (this.platform.is('cordova') || this.platform.is('capacitor')) {
        this.startMetaMapVerification();
        return;
      }
      console.log("You'll need cordova or capacitor here!");
    });
  }

  private startMetaMapVerification() {
    const yourMetadata = { buttonColor: '#51AF4E' };
    const metaMapButtinParams = {
      clientId: constants.metaMapClientId,
      flowId: constants.metaMapFlowId,
      metadata: yourMetadata,
    };
    cordova.plugins.MetaMapGlobalIDSDK.showMetaMapFlow(metaMapButtinParams);

    // register to callback
    cordova.plugins.MetaMapGlobalIDSDK.setMetaMapCallback(
      (params) => {
        console.log('setMetaMapCallback success Params: ', params);
        console.log('setMetaMapCallback success ID: ' + params.identityId);
        console.log(
          'setMetaMapCallback success Verification: ' + params.verificationID
        );
        this.util.showToast('KYC verification successful..', 2500, 'success');

        this.openSetPinModal();
      },

      //Send IDs to backend for storage and confirmation in future..

      (error) => {
        console.log('setMetaMapCallback error: ' + error);
      }
    );
  }
}
