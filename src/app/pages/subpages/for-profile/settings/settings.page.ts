import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from 'node_modules/@ionic/angular';
import { StorageService } from 'src/app/services/storage.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  public fromPage: string;
  public autoLockApp: boolean;
  public firstLoad: boolean;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private util: UtilService,
    private loading: LoadingController
  ) {
    this.fromPage = this.router.getCurrentNavigation().extras.state.url;
  }

  ngOnInit() {
    this.firstLoad = true;
    this.storageService.getInstant('AutoLock').then((isChecked) => this.autoLockApp = isChecked );
    // this.autoLockApp = false;
  }

  public onToggle(e) {
    // if(this.firstLoad){
    //   this.firstLoad = false;
    //   return;
    // }
    const isChecked = e.detail.checked;
    console.log(e.detail.checked);
    this.util.presentLoading();
    this.storageService.set('AutoLock', isChecked);
    setTimeout(() => {
      this.loading.dismiss();
    }, 1000);
  }
}
