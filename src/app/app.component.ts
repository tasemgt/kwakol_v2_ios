import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController, Platform } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  private disconnectSubscription: Subscription;
  private connectSubscription: Subscription;

  private backButtonSubscription: Subscription;

  constructor(
    private platform: Platform,
    // private screenOrientation: ScreenOrientation,
    private statusBar: StatusBar,
    private router: Router,
    // private network: Network,
    // private appMinimize: AppMinimize,
    // private mobileAccessibility: MobileAccessibility,
    private navController: NavController,
    private auth: AuthService,
    // private util: UtilService,
    // private dataService: DataService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {

      //Lock Screen Orientation to Portriat
      this.handleScreenOrientation();

      // Handles zoom fonts on android devices
      // this.mobileAccessibility.usePreferredTextZoom(false);

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
    // this.handleHardwareBackButton();
  }

  private handleAppAuthState(): void{
    this.auth.getAuthStateSubject().subscribe((state) => {
      console.log('State', state);
      if (state === true) {
        console.log('Logged In 😇 ');
        this.router.navigateByUrl('/tabs');
      } else if(state === false){
        console.log('Logged Out 😢');
        // this.router.navigateByUrl('/service-type');
        this.router.navigateByUrl('/login');
      }
    });
  }

  // Handles Android HW Back button
  // private handleHardwareBackButton(): void{
  //   this.backButtonSubscription = this.platform.backButton.subscribeWithPriority(0, async () => {
  //     const closeAppRoutes = [ '/onboarding', '/register', '/tabs/2/home', '/tabs/2/profile', '/tabs/2/history', '/tabs/2/payment'];
  //     // const backToLoginRoutes = ['/register', '/reset-password'];
  //     const backToProfileRoutes = ['/tabs/2/profile/account-info', '/tabs/2/profile/security'];
  //     const url = this.router.url.toString();
  //     if(closeAppRoutes.includes(url)){
  //       this.appMinimize.minimize();
  //     }
  //     else{
  //       this.navController.setDirection('back');
  //       // if(backToLoginRoutes.includes(url)){
  //       //   this.router.navigateByUrl('/login');
  //       // }
  //       if(backToProfileRoutes.includes(url)){
  //         this.router.navigateByUrl('/tabs/2/profile');
  //       }
  //       else if(url === '/login'){
  //         this.router.navigateByUrl('/register', {});
  //       }
  //     }
  //   });
  // }

  // Sets the screen orientation for devices
  private handleScreenOrientation(): void{
    if(this.platform.is('cordova') || this.platform.is('capacitor')){
      // this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
    }
  }

}
