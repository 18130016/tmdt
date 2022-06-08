import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/app/models/product';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, searchkey:string): Product[]|any {
    if(searchkey==''){
      return value;
    }
    let list:Product[]=[];
    if(searchkey!=''){
      for(let item of value){
        let length = item.productname.length - 1;
        if(item.productname.indexOf(searchkey.toUpperCase())>0 && item.productname.indexOf(searchkey)<=length){
          list.push(item);
        }
      }
      return list;
    }
  }

}
