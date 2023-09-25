import { Component, Input, OnInit } from '@angular/core';
import { ModalController, Platform } from 'node_modules/@ionic/angular';
import { StatusBar } from 'node_modules/@ionic-native/status-bar/ngx';

@Component({
  selector: 'app-alert-modal',
  templateUrl: './alert-modal.page.html',
  styleUrls: ['./alert-modal.page.scss'],
})
export class AlertModalPage implements OnInit {
  @Input() params;
  @Input() hi;

  image: string;
  title: string;
  desc: string;
  btn: { text: string; url: string };

  constructor(
    private modalCtrl: ModalController,
    private platform: Platform,
    private statusBar: StatusBar,
  ) {}

  ngOnInit() {
    this.image = this.params.image;
    this.title = this.params.title;
    this.desc = this.params.desc;
    this.btn = this.params.btn;

    if (this.platform.is('cordova')) {
      this.statusBar.styleLightContent();
    }
  }

  public onClickBtn() {
    this.closeModal();
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}
