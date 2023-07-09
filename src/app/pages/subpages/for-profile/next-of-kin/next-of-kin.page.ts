import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NextOfKin } from 'src/app/models/user';

@Component({
  selector: 'app-next-of-kin',
  templateUrl: './next-of-kin.page.html',
  styleUrls: ['./next-of-kin.page.scss'],
})
export class NextOfKinPage implements OnInit {

  public fromPage: string;
  public nextOfKin =  new NextOfKin();

  constructor(private router: Router) {
    if (this.router.getCurrentNavigation().extras.state) {
      const state = this.router.getCurrentNavigation().extras.state;
      this.fromPage = state.url;
    }
  }

  ngOnInit() {
    console.log('HEre now');
  }

}
