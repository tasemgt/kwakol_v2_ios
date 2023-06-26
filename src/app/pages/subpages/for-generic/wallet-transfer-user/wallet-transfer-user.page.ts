import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonModal, Platform } from '@ionic/angular';
import { HomeService } from 'src/app/services/home.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-wallet-transfer-user',
  templateUrl: './wallet-transfer-user.page.html',
  styleUrls: ['./wallet-transfer-user.page.scss'],
})
export class WalletTransferUserPage implements OnInit {
  @ViewChild('content', { static: false }) content: IonContent;

  @ViewChild('pinEnterModal') enterPinModal: IonModal;
  @ViewChild('LoadingModalDiv') loadingModalDiv: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  public fromPage: string;
  public transferUser: any;
  public transferHistory;

  public pin: string;
  public floatUp: boolean;
  public keyboardHeight: number;

  public showLoadingModal: boolean;
  public backdropActive = false;

  public inputPinTypePassword = true;

  public isSending = false;
  public sendAmount;

  constructor(
    private router: Router,
    private platform: Platform,
    private uiService: UiService,
    private homeService: HomeService,
    private subService: SubscriptionService,
    public util: UtilService,
    private renderer: Renderer2,
  ) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.transferUser = state.user;
      this.transferHistory = this.transferUser.transfer_history.reverse();
      console.log(this.transferHistory);
    }
  }

  ngOnInit() {
    this.pin = '';

    setTimeout(() => this.scrollToBottom(), 500);

    this.platform.keyboardDidShow.subscribe((ev) => {
      const { keyboardHeight } = ev;
      this.keyboardHeight = keyboardHeight;
      this.floatUp = true;
    });

    this.platform.keyboardDidHide.subscribe(() => {
      this.floatUp = false;
    });
  }

  public footerStyles() {
    if (this.floatUp) {
      return { bottom: this.keyboardHeight + 30 + 'px' };
    } else {
      return { bottom: 0 + 'px' };
    }
  }

  public sendUserFunds() {
    if(!this.sendAmount){
      this.util.showToast('Please enter a transfer amount.', 2500, 'danger');
      return;
    }
    this.openTransferPinModal();
  }

  public async doSendUserFunds() {
    if(!this.pin){
      return;
    }
    if(!this.sendAmount){
      return;
    }
    const payload = {
      pin: this.pin,
      user: this.transferUser.email,
      amount: this.sendAmount
    };
    this.openLoadingModal();
    console.log(payload);
    try {
      const resp = await this.homeService.doTransferToUser(payload);
      if(resp.code == '100'){
        console.log(resp.message);
        this.subService.getBalanceSubject().next(true);
        this.isSending =false;
      }
      else if(resp.code == '418'){
        console.log(resp);
      }
    } catch (error) {
      console.log(error);
      this.closeLoadingModal(false);
      this.util.showToast(error.error.message, 2000, 'danger');
    }
  }

  public async getUserToTransferTo(usernameOrEmail: string){
    try {
      const resp = await this.homeService.initiateTransferToUser(usernameOrEmail);
      if(resp.code === '100'){
        console.log(resp.data);
        this.transferUser = resp.data;
        this.transferHistory = this.transferUser.transfer_history.reverse();
        this.scrollToBottom();
      }
      else if(resp.code === '418'){
        console.log(resp);
      }
    } catch (error) {
      console.log(error);
    }
}

  public openTransferPinModal() {
    this.enterPinModal.present();
  }

  public closerTransferPinModal() {
    this.enterPinModal.dismiss();
  }

  public onTapPinInput(): void {
    this.inputPinTypePassword = !this.inputPinTypePassword;
  }

  public getPressedKey(key: string): void {
    console.log(key);
    if (key === 'cancel') {
      this.pin = this.pin.slice(0, -1);
    } else if (key === 'clear') {
      this.pin = '';
    } else {
      this.pin.length < 4 ? (this.pin += key) : '';
      if (this.pin.length === 4) {
        console.log('Loadinf up', this.pin);
        this.closerTransferPinModal();
        this.doSendUserFunds();
      }
    }
  }

  public openLoadingModal() {
    this.pin = '';
    this.isSending = true;
    setTimeout(() => {
      this.backdropActive = true;
      this.showLoadingModal = true;
    }, 10);
  }

  public closeLoadingModal(doReload: boolean) {
    const loadingModalDiv = this.loadingModalDiv.nativeElement;
    const backdrop = this.backdrop.nativeElement;

    this.renderer.removeClass(loadingModalDiv, 'animate__slideInUp');
    this.renderer.addClass(loadingModalDiv, 'animate__slideOutDown');
    this.renderer.removeClass(backdrop, 'animate__fadeIn');
    this.renderer.addClass(backdrop, 'animate__fadeOut');
    setTimeout(() => {
      this.backdropActive = false;
      this.showLoadingModal = false;
    }, 100);

    if(doReload){
      this.getUserToTransferTo(this.transferUser.email);
    }
  }

  private scrollToBottom() {
    this.content.scrollToBottom(200);
  }
}
