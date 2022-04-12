import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';
import { UtilService } from 'src/app/services/util.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {

  constructor(
    private router: Router,
    private auth: AuthService,
    private util: UtilService,
    private loading: LoadingController) { }

  ngOnInit() {
  }

  public editProfile(){

  }

  public goToPage(page:string){
    this.router.navigateByUrl(page, {state: {url: this.router.url}});
  }

  public logOut(){
    this.util.presentAlertConfirm('Logout', 'Checking out of Kwakol Funds?', () =>{
      this.util.presentLoading();
      setTimeout(() =>{
        this.loading.dismiss();
        this.auth.logout();
      }, 1500);
    }, 'Not yet', 'Yes!')
  }
}
