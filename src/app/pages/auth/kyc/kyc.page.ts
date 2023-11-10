import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { IonModal, LoadingController, Platform } from '@ionic/angular';
import { KeypadComponent } from 'src/app/components/keypad/keypad.component';
import { constants } from 'src/app/models/constants';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';
import { MetaMapCapacitor } from 'metamap-capacitor-plugin';

// declare const cordova: any;

@Component({
  selector: 'app-kyc',
  templateUrl: './kyc.page.html',
  styleUrls: ['./kyc.page.scss'],
})
export class KycPage implements OnInit {
  @ViewChild('setPinModal') setPinModal: IonModal;
  @ViewChild('appKeypad') appKeypad: KeypadComponent;
  @ViewChild('enterUsernameModal') enterUsernameModal: IonModal;
  @ViewChild('enterUsernameModalRef') enterUsernameModalRef: ElementRef;

  public pinText: string;

  public fromPage: string;
  public tempUser: any;
  public constants = constants;

  public inputs = ['', '', '', ''];

  public usernameEnterValue: string;


  public pin = '';
  public confirmPin = '';

  public showConfirm = false;
  public kycVerified;;

  constructor(
    private keyboard: Keyboard,
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
      this.kycVerified = state.kycVerified || this.tempUser.verified_kyc;
      this.kycVerified = typeof this.kycVerified === 'string' ? this.kycVerified.toLowerCase() : this.kycVerified;

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

  public async openEnterUsernameModal() {
    setTimeout(async() => {
      await this.enterUsernameModal.present();
      if(this.enterUsernameModalRef?.nativeElement){
        this.enterUsernameModalRef.nativeElement.focus();
        this.keyboard.show();
      }
    }, 100);
    await this.enterUsernameModal.onWillDismiss();
    this.usernameEnterValue = '';
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
          await this.setPinModal.dismiss();
          this.tempUser.has_pin = true;
          if(!this.tempUser.username){
            this.openEnterUsernameModal();
          }
          else{
            this.router.navigateByUrl('/onboarding');
          }
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

  public async handleEnterUsername(){
    const usernameRegex = /^[a-zA-Z0-9]+$/;
    if(!this.usernameEnterValue){
      this.util.showToast('Please enter your username', 2000, 'danger');
      return;
    }

    if (!usernameRegex.test(this.usernameEnterValue)) {
      this.util.showToast('Username can only contain alphanumeric characters', 2500, 'danger');
      return;
    }

    this.util.presentLoading();
    try {
      const resp = await this.auth.doSetUsername({username: this.usernameEnterValue});
      this.loading.dismiss();
      if(resp.code == '100'){
        this.usernameEnterValue = '';
        this.util.showToast('Username set successfully', 2500, 'success');
        this.enterUsernameModal.dismiss();
        this.router.navigateByUrl('/onboarding');
        // this.openLoginPasswordModal();
      }
      else{
        this.util.showToast(resp.data, 2000, 'danger');
      }
    } catch (e) {
      this.loading.dismiss();
      console.log('ERR >>', e);
      this.util.showToast('Could not set username..', 2000, 'danger');
    }
  }

  public doCleanup(){
    //
  }

  public callMetaMap() {
    this.platform.ready().then(() => {
      if (this.platform.is('ios')) {
        this.startMetaMapVerification();
        return;
      }
      console.log('You\'ll need cordova or capacitor here!');
    });
  }

  //Start Meta map verification
  private startMetaMapVerification() {

    const metadataParams = { buttonColor: '#51AF4E' };

    const metaMapButtinParams = {
      clientId: constants.metaMapClientId,
      flowId: constants.metaMapFlowId,
      metadata: metadataParams
    };

    MetaMapCapacitor.showMetaMapFlow(metaMapButtinParams)
      .then(async res => {
        console.log('verification success:' + res.verificationID);

        //Send IDs to backend for storage and confirmation in future..
        const payload = {
          identityId: res.identityId,
          verificationId: res.verificationID
        };

        try {
          const resp = await this.auth.sendKYCData(payload) //Send kyc info to back
          if(resp.code == '100'){
            this.util.showToast(resp.message, 2500, 'success');
            //if(this.tempUser.has)
            this.util.presentLoading();
            this.kycVerified = 'pending';
            setTimeout(() =>{
              this.loading.dismiss();
              this.openSetPinModal();
            },1000);
          }
          else{
            this.util.showToast(resp.message, 2500, 'danger');
          }
        } catch (error) {
          console.log('Verification data send error> ', 'danger');
          this.util.showToast('Verification could not be completed', 2500, 'danger');
        }
      })
      .catch(() => console.log('verification cancelled'));


    // cordova.plugins.MetaMapGlobalIDSDK.showMetaMapFlow(metaMapButtinParams);

    // // register to callback
    // cordova.plugins.MetaMapGlobalIDSDK.setMetaMapCallback(
    //   (params) => {
    //     console.log('setMetaMapCallback success Params: ', params);
    //     console.log('setMetaMapCallback success ID: ' + params.identityId);
    //     console.log(
    //       'setMetaMapCallback success Verification: ' + params.verificationID
    //     );
    //     this.util.showToast('KYC verification successful..', 2500, 'success');

    //     this.openSetPinModal();
    //   },

    //   //Send IDs to backend for storage and confirmation in future..

    //   (error) => {
    //     console.log('setMetaMapCallback error: ' + error);
    //   }
    // );
  }


}
