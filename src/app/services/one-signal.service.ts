import { Injectable } from '@angular/core';
// import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';
import _OneSignal from 'onesignal-cordova-plugin';
import { constants } from '../models/constants';

import UUID from "uuidjs";
//this.generateUUID();



@Injectable({
  providedIn: 'root'
})
export class OneSignalService {

  constructor() { }


  public setupPushNotifications(){
    _OneSignal.setAppId(constants.oneSignalAppID);

    _OneSignal.setNotificationOpenedHandler(function(jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
    });

    // iOS - Prompts the user for notification permissions.
    //    * Since this shows a generic native prompt, we recommend instead using an In-App Message to prompt for notification permission (See step 6) to better communicate to your users what notifications they will get.
    _OneSignal.promptForPushNotificationsWithUserResponse(function(accepted) {
        console.log("User accepted notifications: " + accepted);
    });
  }

  public getPlayerID(): Promise<string>{
    let playerID;
    return new Promise((resolve, reject) =>{
      _OneSignal.getDeviceState((state) =>{
        playerID = state.userId
        resolve(playerID);
      });
    })
  }

  private generateUUID(): string {
    let str: string = UUID.generate();
    let obj: UUID = UUID.genV4();
    return str;
  }
}
