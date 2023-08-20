import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {

  public fromPage: string;
  public user: User;
  public username: string;
  public email: string;
  public phone: string;

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
      this.user = state.user;
    }
  }

  ngOnInit() {
    this.email = this.user.email;
    this.phone = this.user.phone;
    this.username = this.user.username;
  }

  public uploadPhoto(){

  }

}
