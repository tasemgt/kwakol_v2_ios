import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { StatusBar } from '@ionic-native/status-bar/ngx';


import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { IonicStorageModule } from '@ionic/storage-angular';
import { pageAnimation } from 'src/animations/nav-animations';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility/ngx';
// import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AppMinimize } from '@ionic-native/app-minimize/ngx';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { FingerprintAIO  } from '@ionic-native/fingerprint-aio/ngx';
import { Vibration } from '@awesome-cordova-plugins/vibration/ngx';
import { BnNgIdleService } from 'bn-ng-idle';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      navAnimation: pageAnimation,
      swipeBackEnabled: false
    }),
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    StatusBar,
    Clipboard,
    MobileAccessibility,
    AppMinimize,
    ScreenOrientation,
    FingerprintAIO,
    BnNgIdleService,
    Keyboard,
    Vibration
    // OneSignal
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

