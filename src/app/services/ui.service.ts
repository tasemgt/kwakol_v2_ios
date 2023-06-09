import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private backdropState: BehaviorSubject<boolean> = new BehaviorSubject(null);

  constructor() {}

  public getAuthStateSubject(){
    return this.backdropState;
  }
}
