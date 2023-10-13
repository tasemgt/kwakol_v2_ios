import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonTabs, LoadingController } from 'node_modules/@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UiService } from 'src/app/services/ui.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
})
export class TabsPage {
  @ViewChild('tabs', { static: false }) tabs: IonTabs;

  @ViewChild('InfoModalDiv') infoModalDiv: ElementRef;
  @ViewChild('LoadingModalDiv') loadingModalDiv: ElementRef;
  @ViewChild('backdrop') backdrop: ElementRef;

  public selectedTab: string;
  public previousTab: string;

  public backdropActive = false;
  public openedFrom: string;

  public showInfoModal: boolean;
  public infoModalData: any;
  public infoModalDataType: string;

  public showLoadingModal: boolean;
  public loadingModalType: string;
  public loadingModalData: any;
  public loadingModalPayload: any;

  public uiServiceSub: Subscription;

  public tabList = {
    home: false,
    // portfolio: false,
    history: false,
    explore: false,
    profile: false,
  };

  constructor(
    private uiService: UiService,
    private auth: AuthService,
    private subService: SubscriptionService,
    private renderer: Renderer2,
    public util: UtilService,
    private loading: LoadingController
  ) {
    this.infoModalData = {};

    this.uiService.getInfoStateSubject().subscribe((payload) => {
      if (payload) {
        this.openInfoModal(payload.data.type, payload.data.data);
        this.backdropActive = payload.active;
        this.openedFrom = 'info';
      }
    });

    // this.uiService.getLoadingStateSubject().subscribe((payload) => {
    //   if (payload) {
    //     this.openLoadingModal(payload.data.type, payload.data.data);
    //     this.backdropActive = payload.active;
    //     this.openedFrom = 'loading';
    //   }
    // });

    // this.uiService.getLoadingStateSubject().subscribe((payload) => {
    //   if (payload) {
    //     this.openLoadingModal();
    //     this.backdropActive = payload;
    //   }
    // });
  }

  ionViewDidEnter(){
    console.log('Did load');
    this.uiServiceSub = this.uiService.getLoadingStateSubject().subscribe((payload) => {
      // this.loadingModalPayload = payload;
      console.log('PAYLOAD>> ', payload);
      if (payload) {
        this.openLoadingModal(payload.data.type, payload.data.data);
        this.backdropActive = payload.active;
        this.openedFrom = 'loading';
        setTimeout(() =>{payload = null;}, 100);
      }
    });
  }

  ionViewWillLeave(){
    console.log('Did leave');
    this.uiServiceSub.unsubscribe();
  }

  public onTabChange(): void {
    this.previousTab = this.selectedTab;
    this.selectedTab =
      this.tabs.getSelected() === 'feed' ? 'explore' : this.tabs.getSelected();
    console.log(this.selectedTab);
    this.tabList[this.selectedTab] = true;
    this.tabList[this.previousTab] = false;
  }

  public openInfoModal(type, data) {
    this.infoModalDataType = type;
    const res = this.util.infoModalFunc(type, data, this.infoModalData);
    setTimeout(() => {
      if(res){
        this.showInfoModal = true;
      }
    }, 10);
  }

  public openLoadingModal(type, data) {
    this.loadingModalType = type;
    this.loadingModalData = data;
    setTimeout(() => {
      this.showLoadingModal = true;
      // console.log(this.infoModalData);
    }, 10);
  }

  public closeModal(skipBalanceLoad?: boolean) {
    const modalDiv =
      this.openedFrom === 'info'
        ? this.infoModalDiv.nativeElement
        : this.loadingModalDiv.nativeElement;
    const backdrop = this.backdrop.nativeElement;

    this.renderer.removeClass(modalDiv, 'animate__slideInUp');
    this.renderer.addClass(modalDiv, 'animate__slideOutDown');
    this.renderer.removeClass(backdrop, 'animate__fadeIn');
    this.renderer.addClass(backdrop, 'animate__fadeOut');
    // this.renderer.setStyle(registerDiv, 'display', 'none');
    setTimeout(() => {
      this.backdropActive = false;
      this.showInfoModal = false;
      this.showLoadingModal = false;
      this.openedFrom = '';
      if(!skipBalanceLoad){
        console.log('BABABAB');
        this.subService.getBalanceSubject().next(true);
      }
    }, 100);
  }

  //Instructs the Home page to perform certain action
  public continueHomeTask(task) {
    this.closeModal();
    this.uiService
      .getinstructHomeStateStateSubject()
      .next({ type: task, data: {} });
  }

  public logoutUser() {
    console.log('Logging user out....');
    this.closeModal(true); //Skip loading of balance
    this.util.presentLoading();
    setTimeout(() => {
      this.loading.dismiss();
      // this.uiService.getLoadingStateSubject().unsubscribe();
      this.auth.logout();
    }, 1500);
  }
}
