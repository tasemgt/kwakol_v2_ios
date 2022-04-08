// import { Injectable } from '@angular/core';
// import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
// import { ShopsService } from '../shops.service';

// @Injectable({
//   providedIn: 'root'
// })
// export class DataResolverService implements Resolve<any>{

//   constructor(private shopsService: ShopsService) { }

//   async resolve(route: ActivatedRouteSnapshot) {
//     const id = route.paramMap.get('id');
//     const resp = await this.shopsService.getShop(id);
//     if(resp.code === '100'){
//       return resp.data.shop[0];
//     }
//   }
// }
