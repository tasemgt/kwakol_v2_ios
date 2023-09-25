import { Injectable } from '@angular/core';
import { Storage } from 'node_modules/@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null;

  constructor(private storage: Storage) {
    this.init();
  }

  public async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    this._storage = await this.storage.create();
  }

  public async set(key: string, value: any){
     return this._storage?.set(key, value);
  }
  

  public async getInstant(key: string){
    if(!this._storage){
      this._storage = await this.storage.create();
      const user = await this._storage?.get(key);
      return user;
    }
    else{
      return await this._storage?.get(key);
    }
  }

  public async get(key: string){
    const user = await this._storage?.get(key);
    return user;
  }

  public async remove(key: string){
    this._storage?.remove(key);
  }

  public async clear(){
    await this._storage?.clear();
  }
}
