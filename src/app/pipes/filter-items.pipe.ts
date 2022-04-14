import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterItems'
})
export class FilterItemsPipe implements PipeTransform {

  transform(items: any[], searchItem: string): unknown {
    if(!items || items.length === 0){
      return null;
    }
    if(!searchItem) {
      return items;
    }

    const filteredItems = items.filter(item => item.name.toLowerCase().includes(searchItem.toLowerCase()));

    return filteredItems;
  }

}
