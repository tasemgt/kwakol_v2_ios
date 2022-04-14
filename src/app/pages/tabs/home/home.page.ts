import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { historyIcons } from 'src/app/models/constants';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { DataService } from 'src/app/services/data.service';
import { HomeService } from 'src/app/services/home.service';
import { SubscriptionService } from 'src/app/services/subscription.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss']
})
export class HomePage implements OnInit{

  public user: User;
  public home: any;

  constructor(
    private router: Router,
    private dataService: DataService,
    private auth: AuthService,
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

  public async getHome(){
    try {
      const resp = await this.homeService.getHome();
      if(resp.code === '100'){
        this.home = resp.data.home;
        console.log(this.home);
      }
    } catch (error) {
      console.log(error);
    }
  }

  public goToPage(page: string){
    const subscriber = this.home.user_details.subscriber;
    this.router.navigateByUrl(page, {state: {url: this.router.url, subscriber}});
  }

}
