import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { constants } from 'src/app/models/constants';
import { StorageService } from 'src/app/services/storage.service';
import { UiService } from 'src/app/services/ui.service';
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

  public kwakolAuto = constants.kwakolAuto;

  constructor(
    private router: Router,
    private storageService: StorageService,
    private util: UtilService,
    private ui: UiService,
    private loading: LoadingController
  ) {
    const state = this.router.getCurrentNavigation().extras.state;
    this.fromPage = state.url;
    this.autoLockApp = state.isChecked;
  }

  ngOnInit() {
    console.log('nginit');
    // this.storageService.getInstant(this.kwakolAuto).then((isChecked) => this.autoLockApp = isChecked );
    // this.autoLockApp = false;
  }
  
  public onToggle(e) {
    console.log(this.firstLoad);
    // if(this.firstLoad){
    //   console.log('first load');
    //   this.firstLoad = false;
    //   return;
    // }

    //Do the following when physically toggled and not on first load of the page.
    const isChecked = e.detail.checked;
    let mes = '';
    console.log(e.detail.checked);
    this.storageService.set(this.kwakolAuto, isChecked);
    this.ui.getAutolockOnSettingsSubject().next(isChecked);
    isChecked ? mes = 'Autolock is on' : mes = 'Autolock is off';
    this.util.showToast(mes, 2000, 'success');
  }
}
