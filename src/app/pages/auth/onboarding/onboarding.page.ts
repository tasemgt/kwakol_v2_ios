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
  Platform,
} from '@ionic/angular';
import { LoginPinPage } from '../login-pin/login-pin.page';
import { UtilService } from 'src/app/services/util.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { OneSignalService } from 'src/app/services/one-signal.service';
import { AuthService } from 'src/app/services/auth.service';
import { UiService } from 'src/app/services/ui.service';
import { Keyboard } from '@capacitor/keyboard';

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
  @ViewChild('resetPasswordDiv') resetPasswordDiv: ElementRef;
  @ViewChild('enterUsernameDiv') enterUsernameDiv: ElementRef;

  public pin: string;
  public inputPinTypePassword = true;
  public showLoginPasswordForm = false;
  public showRegisterForm = false;
  public showResetPasswordForm = false;
  public showEnterUsernameForm = false;

  public passwordType = 'password';
  public passwordIcon = 'eye-open';

  public slideLogo = false;

  public loginInputFocused: boolean;
  public registrationInputFocused: boolean;
  public resetPasswordInputFocused: boolean;
  public enterUsernameInputFocused: boolean;

  //Models
  public credentials: {
    email: string;
    password: string;
  };

  public regCreds: {
    email: string;
    password: string;
    confirmPassword: string;
  };

  public emailReset = '';
  public enterUsername = '';

  public keyboardHeight: number;

  private modal: HTMLIonModalElement;

  private notification_id: string;


  constructor(
    private platform: Platform,
    private modalCtrl: ModalController,
    private animationCtrl: AnimationController,
    private router: Router,
    private auth: AuthService,
    private util: UtilService,
    private uiService: UiService,
    private loading: LoadingController,
    private oneSS: OneSignalService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  async ngOnInit() {
    this.pin = '';
    this.credentials = { email: '', password: '' };
    this.regCreds = { email: '', password: '', confirmPassword: '' };

    //This opens a modal as directed from another page via the ui service (tabs page in this case)
    this.uiService.getinstructOnboardingStateStateSubject().subscribe((state) => {
      if (state) {
        // True to denote that this opens investment list modals for withdrawal and not deposit or transfer
        this.openLoginPasswordModal();
      }
    });

    Keyboard.addListener('keyboardWillShow', async info => {
      console.log('keyboard will show with height:', info.keyboardHeight);
      // if(info.keyboardHeight > 0){
      //   this.keyboardHeight = info.keyboardHeight;
      // }
      // console.log(this.keyboardHeight);

      // if(info.keyboardHeight == 0){
      //   if (this.showLoginPasswordForm) {
      //     console.log('Login up');
      //     await Keyboard.setScroll({ isDisabled: true });
      //     setTimeout(() => this.loginInputFocused = true, 100);
      //   } else if (this.showRegisterForm) {
      //     this.registrationInputFocused = true;
      //   } else {
      //     this.resetPasswordInputFocused = true;
      //   }
      // }
      // else{
      //   setTimeout(() => this.loginInputFocused = false, 100);
      // }

    });

    // Keyboard.addListener('keyboardDidShow', info => {
    //   console.log('keyboard did show with height:', info.keyboardHeight);
    // });

    Keyboard.addListener('keyboardWillHide', async () => {
      console.log('keyboard will hide');
      // await Keyboard.setScroll({ isDisabled: false });
      // setTimeout(() => this.loginInputFocused = false, 100);
    });

    // Keyboard.addListener('keyboardDidHide', () => {
    //   console.log('keyboard did hide');
    // });

    // this.platform.keyboardDidShow.subscribe((ev) => {
    //   // const { keyboardHeight } = ev;
    //   console.log('Heightttttt>>',ev);
    //   // this.keyboardHeight = keyboardHeight;
    //   // this.floatUp = true;
    //   if (this.showLoginPasswordForm) {
    //     console.log('Login up');
    //     this.loginInputFocused = true;
    //   } else if (this.showRegisterForm) {
    //     this.registrationInputFocused = true;
    //   } else {
    //     this.resetPasswordInputFocused = true;
    //   }
    // });

    // this.platform.keyboardDidHide.subscribe((ev) => {
    //   console.log('Heightttttt>>',ev);
    //   // this.floatUp = false;
    //   if (this.showLoginPasswordForm) {
    //     console.log('Login Down');
    //     this.loginInputFocused = false;
    //   } else if (this.showRegisterForm) {
    //     this.registrationInputFocused = false;
    //   } else {
    //     this.resetPasswordInputFocused = false;
    //   }
    // });

    setTimeout(() => this.slideLogo = true, 1000);
  }

  public onInputsFocus(type: string): void {
    // console.log('hi man');
    // if (type === 'login') {
    //   this.loginInputFocused = true;
    // } else if (type === 'register') {
    //   this.registrationInputFocused = true;
    // } else {
    //   this.resetPasswordInputFocused = true;
    // }
  }

  public onInputsBlur(type: string): void {
    // if (type === 'login') {
    //   this.loginInputFocused = false;
    // } else if (type === 'register') {
    //   this.registrationInputFocused = false;
    // } else {
    //   this.resetPasswordInputFocused = false;
    // }
  }

  public async disableOnKeyboardOpenScroll(){
    await Keyboard.setScroll({ isDisabled: true });
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
    // this.inputPinTypePassword = !this.inputPinTypePassword;
  }

  //Login With Password

  public showLoginWithPassword() {
    this.showLoginPasswordForm = true;
  }

  public closeLoginPasswordForm() {
    this.credentials.email = ''; this.credentials.password = '';
    const loginPasswordDiv = this.loginPasswordDiv.nativeElement;
    this.renderer.removeClass(loginPasswordDiv, 'animate__slideInUp');
    this.renderer.addClass(loginPasswordDiv, 'animate__zoomOut');
    // this.renderer.setStyle(registerDiv, 'display', 'none');
    setTimeout(() => (this.showLoginPasswordForm = false), 50);
  }

  public async openLoginPasswordModal() {
    await this.pinLoginModal.dismiss();
    // this.showLoginPasswordForm = true;
    setTimeout(() => this.showLoginWithPassword(), 100);
  }

  public async openLoginPinModal() {
    this.closeLoginPasswordForm();
    setTimeout(() => this.pinLoginModal.present(), 100);
  }

  public async doLoginWithPassword(form: NgForm) {
    if (!this.credentials.email || !this.credentials.password) {
      this.util.showToast('Email or password cannot be empty', 2000, 'danger');
      return;
    }
    try {
      // this.notification_id = '12345'; //Comment this out for production.
      console.log('Notification ID before send ', this.notification_id);
      if (!this.notification_id) {
        await this.getOneSignalPlayerID();
      }
      console.log('Notification ID before send 2 ', this.notification_id);
      await this.util.presentLoading();
      const resp = await this.auth.login({
        email: this.credentials.email.trim(),
        password: this.credentials.password.trim(),
        notification_id: this.notification_id,
      });
      this.loading.dismiss();
      setTimeout(() => form.reset(), 100);
      if (!resp?.token) {
        console.log(resp?.message);
        // this.util.showToast(resp?.message, 3000, 'danger');
        return;
      }
    } catch (err) {
      console.log('Error>> ', err);
      if (err.status === 401) {
        this.util.showToast('Email or password incorrect. Please enter the correct details.', 3000, 'danger');
      }
      else if (err.status === 0 || err.status === -3 || err.status === 500) {
        this.util.showToast(
          'Ooops! something went wrong, please check your connection and try again.',
          3000,
          'danger'
        );
      }
      else{
        this.util.showToast('Try again please...', 3000, 'danger');
      }
      if (err.status === 500) {
        console.log('Error from server,: ', err.status);
      }
      this.loading.dismiss();
    }
  }

  //Forgot / Reset Password
  public showResetPassword() {
    this.showResetPasswordForm = true;
  }

  public async openResetPasswordModal() {
    this.closeLoginPasswordForm();
    setTimeout(() => this.showResetPassword(), 400);
  }

  public closeResetPasswordForm() {
    this.emailReset = '';
    const resetPasswordDiv = this.resetPasswordDiv.nativeElement;
    this.renderer.removeClass(resetPasswordDiv, 'animate__slideInUp');
    this.renderer.addClass(resetPasswordDiv, 'animate__zoomOut');
    // this.renderer.setStyle(registerDiv, 'display', 'none');
    setTimeout(() => (this.showResetPasswordForm = false), 50);
  }

  public async doResetPassword(){
    if(!this.emailReset){
      this.util.showToast('Please enter your email address', 2000, 'danger');
      return;
    }
    this.util.presentLoading();
    try {
      const resp = await this.auth.resetPassword(this.emailReset);
      this.loading.dismiss();
      if(resp.code == '100'){
        this.emailReset = '';
        this.util.presentAlertModal('emailSent', {action: 'login'});
        this.closeResetPasswordForm();
      }
      else{
        this.util.showToast(resp.data, 2000, 'danger');
      }
    } catch (e) {
      this.loading.dismiss();
      console.log('ERR >>', e);
      this.util.showToast('Could not reset password..', 2000, 'danger');
    }
  }

  //Enter username area
  public showEnterUsername() {
    this.showEnterUsernameForm = true;
  }

  public async openEnterUsernameModal() {
    this.closeLoginPasswordForm();
    setTimeout(() => this.showEnterUsername(), 400);
  }

  public closeEnterUsernameForm() {
    this.enterUsername = '';
    const enterUsernameDiv = this.enterUsernameDiv.nativeElement;
    this.renderer.removeClass(enterUsernameDiv, 'animate__slideInUp');
    this.renderer.addClass(enterUsernameDiv, 'animate__zoomOut');
    // this.renderer.setStyle(registerDiv, 'display', 'none');
    setTimeout(() => (this.showEnterUsernameForm = false), 50);
  }

  public async doEnterUsername(){
    if(!this.enterUsername){
      this.util.showToast('Please enter your username', 2000, 'danger');
      return;
    }
    this.util.presentLoading();
    try {
      const resp = await this.auth.doSetUsername({username: this.enterUsername});
      this.loading.dismiss();
      if(resp.code == '100'){
        this.enterUsername = '';
        this.util.showToast('Username set successfully', 2500, 'success');
        this.closeEnterUsernameForm();
        this.openLoginPasswordModal();
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

  //Register
  public showRegister() {
    this.showRegisterForm = true;
  }

  public closeRegisterForm() {
    this.regCreds.email = ''; this.regCreds.password = ''; this.regCreds.confirmPassword = '';
    const registerDiv = this.registerDiv.nativeElement;
    this.renderer.removeClass(registerDiv, 'animate__slideInUp');
    this.renderer.addClass(registerDiv, 'animate__zoomOut');
    // this.renderer.setStyle(registerDiv, 'display', 'none');
    setTimeout(() => (this.showRegisterForm = false), 50);
  }

  public async proceedRegistration() {
    const email = this.regCreds.email.trim();
    const password = this.regCreds.password.trim();
    const confirmPassword = this.regCreds.confirmPassword.trim();

    if(!email || !this.util.validateEmail(email)){
      this.util.showToast('Please enter a valid email...', 2000, 'danger');
      return;
    }

    if(!password){
      this.util.showToast('Please enter a valid password', 2000, 'danger');
      return;
    }

    if(!confirmPassword){
      this.util.showToast('Please enter valid confirm password', 2000, 'danger');
      return;
    }

    if(password !== confirmPassword){
      this.util.showToast('Passwords do not match', 2000, 'danger');
      return;
    }

    const userInfo = {email, password, confirmPassword};

    await this.util.presentLoading();

    setTimeout(() => {
      this.loading.dismiss();
      this.showRegisterForm = false;
      this.regCreds.email = ''; this.regCreds.password = ''; this.regCreds.confirmPassword = '';
      setTimeout(() =>{
        console.log('USER>>', userInfo);
        this.router.navigateByUrl('/register', {
          state: { userInfo,  url: this.router.url }
        });
      }, 300);
    }, 2000);
  }

  public goToLinks(link: string): void {
    window.open(link, '_system', 'location=yes');
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



  private async getOneSignalPlayerID(){
    this.notification_id = await this.oneSS.getPlayerID();
    console.log(this.notification_id);
  }

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
