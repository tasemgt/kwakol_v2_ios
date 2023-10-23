import { Component, OnInit } from '@angular/core';
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
    this.fromPage = this.router.getCurrentNavigation().extras.state.url;
  }

  ngOnInit() {
    this.firstLoad = true;
    this.storageService.getInstant(this.kwakolAuto).then((isChecked) => this.autoLockApp = isChecked );
    // this.autoLockApp = false;
  }

  public onToggle(e) {
    // if(this.firstLoad){
    //   this.firstLoad = false;
    //   return;
    // }
    const isChecked = e.detail.checked;
    console.log(e.detail.checked);
    this.storageService.set(this.kwakolAuto, isChecked);
    this.ui.getAutolockOnSettingsSubject().next(isChecked);
    
  }
}
