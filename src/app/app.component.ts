import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
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

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  previousUrl = '';
  currentUrl = '';
  
  private disconnectSubscription: Subscription;
  private connectSubscription: Subscription;

  private backButtonSubscription: Subscription;

  private lightContentList = [
    '/login',
    '/tabs/profile',
    '/tabs/feed',
    '/tabs/history',
    '/tabs/portfolio'
  ]

  constructor(
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private statusBar: StatusBar,
    private router: Router,
    private storageService: StorageService,
    // private network: Network,
    private appMinimize: AppMinimize,
    private mobileAccessibility: MobileAccessibility,
    private oneSignalService: OneSignalService,
    // private faio: FingerprintAIO,
    private util: UtilService,
    private navController: NavController,
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
      console.log('dfdfgfg, ', this.currentUrl );
      // this.setupInactivityWatch();

      this.platform.pause.subscribe(() => {
        console.log('App paused');
        // if(this.currentUrl === '/lock-modal'){
        //   return;
        // }
        // else{
          this.checkAutoLockState();
        // }
      });

      // this.platform.resume.subscribe(() => {
      //   // App resumed, do something here
      //   console.log('App resumed');
      // });
    });
  }

  // Handles back button to close app on android
  ngAfterViewInit() {
    this.handleHardwareBackButton();
  }

  private handleAppAuthState(): void{
    this.checkAutoLockState();
    // this.checkAppAuthState();
  }

  private checkAppAuthState(){
    this.auth.getAuthStateSubject().subscribe((state) => {
      console.log('State', state);
      if (state === true) {
        console.log('Logged In 😇 ');
        this.router.navigateByUrl('/tabs/home');
      } else if(state === false){
        console.log('Logged Out 😢');
        this.router.navigateByUrl('/onboarding');
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
      const closeAppRoutes = [ '/lock-modal', '/onboarding', '/tabs/home', '/tabs/profile', '/tabs/history', '/tabs/portfolio', '/tabs/feed'];
      const backToRegisterRoutes = ['/kyc'];
      // const backToOnboardingRoutes = ['/register'];
      const backToProfileRoutes = ['/account-details', '/affiliate-link', '/settings'];
      const backToFeedRoutes = ['/feed-details'];
      const url = this.router.url.toString();
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

  private checkAutoLockState(){
    this.storageService.get('AutoLock').then((lockedOn) =>{
      if(lockedOn){
        this.autoLockApp();
      }
      else{
        this.checkAppAuthState();
      }
    });
  }

  private async autoLockApp(){
    //Nav root lock page
    console.log('App component>>>>');
    this.router.navigateByUrl('/lock-modal', {replaceUrl: true});
    // this.checkAppAuthState();
  }

}
