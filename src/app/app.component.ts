import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { BnNgIdleService } from 'bn-ng-idle';
// import { FingerprintAIO  } from '@ionic-native/fingerprint-aio/ngx';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { OneSignalService } from './services/one-signal.service';

import { filter } from 'rxjs/operators';
import { StorageService } from './services/storage.service';
import { UtilService } from './services/util.service';
import { UiService } from './services/ui.service';
import { constants } from './models/constants';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {

  public constants = constants;

  previousUrl = '';
  currentUrl = '';

  private disconnectSubscription: Subscription;
  private connectSubscription: Subscription;

  private backButtonSubscription: Subscription;
  private pauseSubscription: Subscription;
  private resumeSubscription: Subscription;
  private lockModalOpenSubscription: Subscription;

  private lockTimer = 6; //1min
  private timer;
  private lockModal = null;
  private lockModalOpen = false;

  private lightContentList = [
    '/login',
    '/tabs/profile',
    '/tabs/feed',
    '/tabs/history',
    '/tabs/portfolio'
  ];

  constructor(
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private statusBar: StatusBar,
    private router: Router,
    private storageService: StorageService,
    private splashScreen: SplashScreen,
    // private network: Network,
    private appMinimize: AppMinimize,
    private mobileAccessibility: MobileAccessibility,
    private oneSignalService: OneSignalService,
    // private faio: FingerprintAIO,
    private util: UtilService,
    private uiService: UiService,
    private navController: NavController,
    private modalCtrl: ModalController,
    private auth: AuthService,
    private bnIdle: BnNgIdleService
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {

    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd)
        ).subscribe((event: NavigationEnd) => {
          this.previousUrl = this.currentUrl;
          this.currentUrl = event.url;

          console.log('Current ', this.currentUrl);
          console.log('Previous ', this.previousUrl);

          // Handles status bar display
          if (this.platform.is('cordova')) {
            console.log('Is cordova');
            this.statusBar.overlaysWebView(true);
            this.handleStatusBarForPages();
          }
        });

        // this.util.getLockSubject().subscribe((res) =>{
        //   if(res){
        //     this.setupInactivityWatch();
        //   }
        // });
  }

  initializeApp() {
    this.platform.ready().then(() => {

      setTimeout(() => {
        this.splashScreen.hide();
      }, 3000);

      //Lock Screen Orientation to Portriat
      this.handleScreenOrientationAndPushNotification();

      // Handles zoom fonts on android devices
      this.mobileAccessibility.usePreferredTextZoom(false);

      // Handles status bar display
      // if (this.platform.is('cordova')) {
      //   console.log('Is cordova');
      //   this.statusBar.overlaysWebView(true);
      //   this.handleStatusBarForPages();
      // }

      this.handleAppAuthState();
      // this.listenForSettingsChange();
      console.log('dfdfgfg, ', this.currentUrl );
      // this.setupInactivityWatch();
    });
  }

  // Handles back button to close app on android
  ngAfterViewInit() {
    this.handleHardwareBackButton();
  }

  private handleAppAuthState(): void{
    this.checkAppAuthState();
  }

  private checkAppAuthState(){
    this.auth.getAuthStateSubject().subscribe((state) => {
      console.log('State', state);
      if (state === true) {
        console.log('Logged In 😇 ');
        this.router.navigateByUrl('/tabs/home');
        this.checkLockSettings();
        this.checkAutoLockState(); //Check whether app is locked already so as to show locked screen or not to proceed to home
      } else if(state === false){
        console.log('Logged Out 😢');
        this.router.navigateByUrl('/onboarding');
        this.deactivateLockSubscriptions();
      }
    });
  }

  private setupInactivityWatch(){
    this.bnIdle.startWatching(10).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        console.log('session expired');
        this.bnIdle.stopTimer();
        if(!(this.currentUrl === '/lock-modal')){
          this.util.presentAlert('App is locked due to inactivity..', () =>{
            this.autoLockApp();
          });
        }
      }
    });
  }

  // Handles Android HW Back button
   private handleHardwareBackButton(): void{
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, async () => {
      const closeAppRoutes = [ '/onboarding', '/tabs/home', '/tabs/profile', '/tabs/history', '/tabs/portfolio', '/tabs/feed'];
      const backToRegisterRoutes = ['/kyc'];
      // const backToOnboardingRoutes = ['/register'];
      const backToProfileRoutes = ['/account-details', '/affiliate-link', '/settings'];
      const backToFeedRoutes = ['/feed-details'];
      const url = this.router.url.toString();


      if (this.lockModalOpen) {
        this.appMinimize.minimize();
      }

      if(closeAppRoutes.includes(url)){
        this.appMinimize.minimize();
      }
      else{
        this.navController.setDirection('back');
        // if(backToOnboardingRoutes.includes(url)){
        //   this.router.navigateByUrl('/onboarding');
        // }
        if(backToProfileRoutes.includes(url)){
          this.router.navigateByUrl('/tabs/profile');
        }
        else if(backToFeedRoutes.includes(url)){
          this.router.navigateByUrl('/tabs/feed');
        }
        else if(url === '/new-account' || url === '/investment-details'){
          this.previousUrl.includes('/home') || this.previousUrl.includes('add-new-account') ? this.router.navigateByUrl('/tabs/home') : this.router.navigateByUrl('/tabs/portfolio');
        }
        else if(url === '/deposit' || url === '/withdrawal'){
          this.previousUrl.includes('/home') ? this.router.navigateByUrl('/tabs/home') : this.router.navigateByUrl('/investment-details');
        }
        else if(url === '/history-summary'){
          this.previousUrl.includes('/home') ? this.router.navigateByUrl('/tabs/home') : this.router.navigateByUrl('/tabs/history');
        }
        else if(url === '/add-new-account'){
          this.router.navigateByUrl('/new-account');
        }
      }
    });
  }

  // Sets the screen orientation for devices
  private handleScreenOrientationAndPushNotification(): void{
    if(this.platform.is('cordova') || this.platform.is('capacitor')){
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.oneSignalService.setupPushNotifications();
    }
  }

  private handleStatusBarForPages(){
    if(this.lightContentList.includes(this.currentUrl)){
      console.log('here on light');
      this.statusBar.styleLightContent();
    }
    else{
      console.log('here on dark');
      this.statusBar.styleDefault();
    }
  }

  private listenForSettingsChange(){
    this.uiService.getAutolockOnSettingsSubject().subscribe((autoOn) =>{
      if(autoOn){
        console.log('Auto lock settings on');
        if(this.pauseSubscription){
          return;
        }
        //Can start listening to lock
        this.activateLockSubscriptions();
      }
      else{
        console.log('Auto lock settings off');
        if(!this.pauseSubscription){
          return;
        }
        //Can stop listening to lock
        this.deactivateLockSubscriptions();
      }
    });
  }

  private activateLockSubscriptions(){
    this.pauseSubscription = this.platform.pause.subscribe(() => {
      console.log('App paused');
      if (this.lockModalOpen) {
        console.log('Thers lock modal already');
        return; //App already locked, skip timer countdown..
      }
      this.timer = this.startLockTimer();
    });

    this.resumeSubscription = this.platform.resume.subscribe(() => {
      // App resumed, do something here
      console.log('App resumed');
      clearInterval(this.timer);
      this.resetTimer();
    });

    this.lockModalOpenSubscription = this.uiService.getAppLockModalOpenStateSubject().subscribe((state) =>{
      if(state){
        //State is true, means lock modal has been closed.
        this.lockModalOpen = false;
      }
    });
  }

  private deactivateLockSubscriptions(){
    this.pauseSubscription ? this.pauseSubscription.unsubscribe() : '';
    this.resumeSubscription ? this.resumeSubscription.unsubscribe() : '';
    this.lockModalOpenSubscription ? this.lockModalOpenSubscription.unsubscribe() : '';
  }

  private checkLockSettings(){
    this.storageService.get(this.constants.kwakolAuto).then((autoOn) =>{
      if(autoOn){
        console.log('Auto lock settings on');
        //Can start listening to lock
        this.activateLockSubscriptions();
      }
      else{
        console.log('Auto lock settings off');
        //Can stop listening to lock
        this.deactivateLockSubscriptions();
      }
    });
  }

  private checkAutoLockState(){
    this.storageService.get(this.constants.lockedState).then((locked) =>{
      if(locked){
        this.autoLockApp(); //Lock app if its already locked
      }
    });
  }

  private async autoLockApp(){
    this.util.presentAlertModal('lockedScreen', {action: 'login'});
    this.lockModalOpen = true;
    this.storageService.set(this.constants.lockedState, {isAppLocked:true});
    // this.router.navigateByUrl('/lock-modal', {replaceUrl: true});
    // this.checkAppAuthState();
  }

  private startLockTimer(){
    const timer = setInterval(() => {
      console.log(this.lockTimer + 's');

      if (this.lockTimer === 1) {
        clearInterval(timer);
        console.log('Time is up!');
        this.autoLockApp();
        this.resetTimer();
      }
      this.lockTimer--;
    }, 1000);
    return timer;
  }

  private resetTimer(){
    this.lockTimer = 6;
  }

}
