import { Component, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { IonTabs } from '@ionic/angular';
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
  public showLoadingModal: boolean;
  public infoModalData: any;
  // public showLoadingModal: boolean;

  public tabList = {
    home: false,
    // portfolio: false,
    history: false,
    explore: false,
    profile: false,
  };

  constructor(
    private uiService: UiService,
    private renderer: Renderer2,
    public util: UtilService
  ) {
    this.infoModalData = {};

    this.uiService.getInfoStateSubject().subscribe((payload) => {
      if (payload) {
        this.openInfoModal(payload.data.type, payload.data.data);
        this.backdropActive = payload.active;
        this.openedFrom = 'info';
      }
    });

    this.uiService.getLoadingStateSubject().subscribe((payload) => {
      if (payload) {
        this.openLoadingModal();
        this.backdropActive = payload;
        this.openedFrom = 'loading';
      }
    });

    // this.uiService.getLoadingStateSubject().subscribe((payload) => {
    //   if (payload) {
    //     this.openLoadingModal();
    //     this.backdropActive = payload;
    //   }
    // });
  }

  public onTabChange(): void {
    this.previousTab = this.selectedTab;
    this.selectedTab = this.tabs.getSelected() === 'feed' ? 'explore' : this.tabs.getSelected();
    console.log(this.selectedTab);
    this.tabList[this.selectedTab] = true;
    this.tabList[this.previousTab] = false;
  }

  public openInfoModal(type, data) {
    console.log('DATA', data);
    switch (type) {
      case 'deposit':
        this.infoModalData.icon = 'trans-deposit.svg';
        this.infoModalData.title = 'Deposit';
        this.infoModalData.content = [
          { item: 'Account Name', value: data.fullname },
          { item: 'Bank Name', value: '---' },
          { item: 'Reference', value: data.ref },
          { item: 'Deposit Type', value: data.type },
          { item: 'Rate', value: '----' },
          { item: 'Fee', value: '$'+data.amount },
        ];
        this.infoModalData.amount = '560';
        this.infoModalData.date = '16 Feb 2023 - 9:03am';
        break;
      case 'withdrawal':
        this.infoModalData.icon = 'trans-withdraw.svg';
        this.infoModalData.title = 'Withdrawal';
        this.infoModalData.content = [
          { item: 'Account Name', value: data.fullname },
          { item: 'Account Number', value: 'Akim John' },
          { item: 'Bank Name', value: '----' },
          { item: 'Reference', value: data.ref },
          { item: 'Withdrawal Type', value: data.type },
          { item: 'Fee', value: '$'+data.amount },
        ];
        this.infoModalData.amount = '560';
        this.infoModalData.date = '16 Feb 2023 - 9:03am';
        break;
      case 'transfer':
        this.infoModalData.icon = 'trans-transfer-user.svg';
        this.infoModalData.title = 'Wallet Transfer';
        this.infoModalData.content = [
          { item: 'Username', value: data.email },
          { item: 'Profile Name', value: data.fullname },
          { item: 'Reference', value: data.ref },
        ];
        this.infoModalData.amount = data.amount;
        this.infoModalData.date = data.created_at;
        break;
      case 'bonus':
        this.infoModalData.icon = 'trans-bonus.svg';
        this.infoModalData.title = 'Bonus';
        this.infoModalData.content = [
          { item: 'Bonus Type', value: 'Referral' },
          { item: 'Reference', value: 'Akim John' },
        ];
        this.infoModalData.amount = '1200';
        this.infoModalData.date = '16 Feb 2023 - 9:03am';
    }

    setTimeout(() => {
      this.showInfoModal = true;
      console.log(this.infoModalData);
    }, 10);
  }

  public openLoadingModal(){
    setTimeout(() => {
      this.showLoadingModal = true;
      // console.log(this.infoModalData);
    }, 10);
  }

  public closeModal() {
    const modalDiv = this.openedFrom === 'info' ? this.infoModalDiv.nativeElement : this.loadingModalDiv.nativeElement;
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
    }, 100);
  }

}
