import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import {
  AnimationController,
  IonModal,
  LoadingController,
  ModalController,
} from '@ionic/angular';
import { LoginPinPage } from '../login-pin/login-pin.page';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-onboarding',
  templateUrl: './onboarding.page.html',
  styleUrls: ['./onboarding.page.scss'],
})
export class OnboardingPage implements OnInit {
  @ViewChild('pinLoginModal') pinLoginModal: IonModal;
  @ViewChild('passwordLoginModal') passwordLoginModal: IonModal;

  @ViewChild('loginPasswordDiv') loginPasswordDiv: ElementRef;
  @ViewChild('registerDiv') registerDiv: ElementRef;

  public pin: string;
  public inputPinTypePassword = true;
  public showLoginPasswordForm = false;
  public showRegisterForm = false;

  public passwordType = 'password';
  public passwordIcon = 'eye-close';

  public inputFocused: boolean;

  private modal: HTMLIonModalElement;

  constructor(
    private modalCtrl: ModalController,
    private animationCtrl: AnimationController,
    private router: Router,
    private util: UtilService,
    private loading: LoadingController,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit() {
    this.pin = '';
  }

  public onInputsFocus(): void {
    this.inputFocused = true;
  }

  public onInputsBlur(): void {
    this.inputFocused = false;
  }

  public hideShowPassword() {
    const deets = this.util.hideShowPassword(
      this.passwordType,
      this.passwordIcon
    );
    this.passwordType = deets.passwordType;
    this.passwordIcon = deets.passwordIcon;
  }

  public async openLoginWithPin() {
    this.modal = await this.modalCtrl.create({
      component: LoginPinPage,
      breakpoints: [0, 0.2, 0.4, 0.7, 0.9],
      mode: 'ios',
      initialBreakpoint: 0.4,
      backdropBreakpoint: 0.2,
      backdropDismiss: true,
      swipeToClose: true,
      keyboardClose: true,
      cssClass: 'kwakol-modal-bottom-drawer',
      componentProps: {},
    });
    await this.modal.present();
    const { data } = await this.modal.onWillDismiss();
    if (!data) return;
  }

  //Login with Pin
  public getPressedKey(key: string): void {
    console.log(key);
    if (key === 'cancel') {
      this.pin = this.pin.slice(0, -1);
    } else if (key === 'clear') {
      this.pin = '';
    } else {
      this.pin.length < 4 ? (this.pin += key) : '';
      // if(this.pin.length === 4){
      //   //Implement login auth call
      //   this.doLogin();
      // }
    }
  }

  public loginWithPin() {
    if (this.pin.length === 4) {
      //Implement login auth call
      this.doLogin();
    }
  }

  public onTapPinInput(): void {
    this.inputPinTypePassword = !this.inputPinTypePassword;
  }

  //Login With Password

  public showLoginWithPassword() {
    this.showLoginPasswordForm = true;
  }

  public closeLoginPasswordForm() {
    const loginPasswordDiv = this.loginPasswordDiv.nativeElement;
    this.renderer.removeClass(loginPasswordDiv, 'animate__slideInUp');
    this.renderer.addClass(loginPasswordDiv, 'animate__zoomOut');
    // this.renderer.setStyle(registerDiv, 'display', 'none');
    setTimeout(() => (this.showLoginPasswordForm = false), 400);
  }

  public async openLoginPasswordModal() {
    await this.pinLoginModal.dismiss();
    this.showLoginPasswordForm = true;
    setTimeout(() => this.showLoginWithPassword(), 100);
    // ;
  }

  public async openLoginPinModal() {
    this.closeLoginPasswordForm();
    setTimeout(() => this.pinLoginModal.present(), 100);
    // ;
  }

  public async loginWithPassword(form: NgForm) {}

  //Register
  public showRegister() {
    this.showRegisterForm = true;
  }

  public closeRegisterForm() {
    const registerDiv = this.registerDiv.nativeElement;
    this.renderer.removeClass(registerDiv, 'animate__slideInUp');
    this.renderer.addClass(registerDiv, 'animate__zoomOut');
    // this.renderer.setStyle(registerDiv, 'display', 'none');
    setTimeout(() => (this.showRegisterForm = false), 400);
  }

  public proceedRegistration() {
    this.util.presentLoading();
    setTimeout(() => {
      this.loading.dismiss();
      this.router.navigateByUrl('/register');
    }, 1000);
  }

  enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(300)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

  //Fake call
  private doLogin() {
    this.util.presentLoading('');
    setTimeout(() => {
      this.loading.dismiss();
      this.pinLoginModal.dismiss();
      // this.router.navigateByUrl('/tabs/home');
    }, 2000);
  }
}
