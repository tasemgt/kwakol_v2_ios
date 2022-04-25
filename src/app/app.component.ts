import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { OneSignalService } from './services/one-signal.service';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewInit {
  private disconnectSubscription: Subscription;
  private connectSubscription: Subscription;

  private backButtonSubscription: Subscription;

  previousUrl: string = '';
  currentUrl: string = '';

  constructor(
    private platform: Platform,
    private screenOrientation: ScreenOrientation,
    private statusBar: StatusBar,
    private router: Router,
    // private network: Network,
    private appMinimize: AppMinimize,
    private mobileAccessibility: MobileAccessibility,
    private oneSignalService: OneSignalService,
    private navController: NavController,
    private auth: AuthService
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
        });
  }

  initializeApp() {
    this.platform.ready().then(() => {

      //Lock Screen Orientation to Portriat
      this.handleScreenOrientationAndPushNotification();

      // Handles zoom fonts on android devices
      this.mobileAccessibility.usePreferredTextZoom(false);

      // Handles status bar display
      if (this.platform.is('cordova')) {
        console.log('Is cordova');
        this.statusBar.overlaysWebView(true);
        this.statusBar.styleDefault();
      }

      this.handleAppAuthState();
    });
  }

  // Handles back button to close app on android
  ngAfterViewInit() {
    this.handleHardwareBackButton();
  }

  private handleAppAuthState(): void{
    this.auth.getAuthStateSubject().subscribe((state) => {
      console.log('State', state);
      if (state === true) {
        console.log('Logged In 😇 ');
        this.router.navigateByUrl('/tabs/home');
      } else if(state === false){
        console.log('Logged Out 😢');
        this.router.navigateByUrl('/login');
      }
    });
  }

  // Handles Android HW Back button
  private handleHardwareBackButton(): void{
    this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, async () => {
      const closeAppRoutes = [ '/login', '/tabs/home', '/tabs/profile', '/tabs/history', '/tabs/portfolio', '/tabs/feed'];
      const backToLoginRoutes = ['/change-password', '/forgot-password'];
      const backToProfileRoutes = ['/account-details', '/affiliate-link'];
      const backToFeedRoutes = ['/feed-details'];
      const url = this.router.url.toString();
      if(closeAppRoutes.includes(url)){
        this.appMinimize.minimize();
      }
      else{
        this.navController.setDirection('back');
        if(backToLoginRoutes.includes(url)){
          this.router.navigateByUrl('/login');
        }
        if(backToProfileRoutes.includes(url)){
          this.router.navigateByUrl('/tabs/profile');
        }
        else if(backToFeedRoutes.includes(url)){
          this.router.navigateByUrl('/tabs/feed');
        }
        else if(url === '/new-account' || url === '/investment-details' || url === '/deposit' || url === '/withdrawal'){
          this.previousUrl.includes('/home') ? this.router.navigateByUrl('/tabs/home') : this.router.navigateByUrl('/tabs/portfolio');
        }
        else if(url === '/deposit' || url === '/withdrawal'){
          this.previousUrl.includes('/home') ? this.router.navigateByUrl('/tabs/home') : this.router.navigateByUrl('/investment-details');
        }
        else if(url === '/history-summary'){
          this.previousUrl.includes('/home') ? this.router.navigateByUrl('/tabs/home') : this.router.navigateByUrl('/tabs/history');
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

}
