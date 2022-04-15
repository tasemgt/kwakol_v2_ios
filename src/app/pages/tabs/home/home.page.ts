import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { historyIcons, investmentIcons } from 'src/app/models/constants';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { HomeService } from 'src/app/services/home.service';
import { SubscriptionService } from 'src/app/services/subscription.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit{

  public user: User;
  public home: any;

  public toastShown = false;

  public childPage;

  constructor(
    private router: Router,
    private dataService: DataService,
    private auth: AuthService,
    private util: UtilService,
    private loading: LoadingController,
    private subService: SubscriptionService,
    private homeService: HomeService) {}

  ngOnInit(): void {
    this.auth.getAuthStateSubject().subscribe((state) =>{
      if(state){
        this.getUser();
        this.getHome();
      }
    });

    this.subService.getBalanceSubject().subscribe((state) =>{
      if(state){
        this.getHome();
      }
    });
  }

  public async getUser() {
    this.user = this.dataService.getData(2);
  }

  public getIconForType(type: string){
    return historyIcons[type];
  }


  public getIconForInvName(inv: string){
    return investmentIcons[inv.toLowerCase()];
  }

  public async getHome(){
    try {
      const resp = await this.homeService.getHome();
      if(resp.code === '100'){
        this.home = resp.data.home;
        const top = await this.loading.getTop();
        if(top){ 
          this.loading.dismiss();
          this.goToPage(this.childPage);
        }
        console.log(this.home);
      }
    } catch (error) {
      console.log(error);
      if(error.status === 0){
       !this.toastShown ? this.util.showToast('Please check your network connection', 4000, 'danger') : '';
        this.toastShown = true;
        setTimeout(() => this.getHome(), 10000);
      }
    }
  }

  public goToPage(page: string){
    this.childPage = page;
    if(!this.home){
      this.util.presentLoading2('Please wait...');
      return;
    }
    const subscriber = this.home.user_details.subscriber;
    this.router.navigateByUrl(page, {state: {url: this.router.url, subscriber}});
  }

}
