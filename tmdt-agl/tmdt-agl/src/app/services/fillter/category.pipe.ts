import { Pipe, PipeTransform } from '@angular/core';
import { Product } from 'src/app/models/product';

@Pipe({
  name: 'category'
})
export class CategoryPipe implements PipeTransform {

  transform(value: any,catego:string): any {
    if(catego == ""){
      return value;
    }
    let arrSort:Product[]=value;
    if(catego == 'T'){
      arrSort.sort((a,b)=>{
        if (a.pricesale > b.pricesale) {
          return 1;
        }
        // @ts-ignore
        if (a.pricesale < b.pricesale) {
          return -1;
        }
        return 0
      });
      return arrSort;
    }
    if(catego == 'G'){
      arrSort.sort((a,b)=>{
        if (a.pricesale < b.pricesale) {
          return 1;
        }
        // @ts-ignore
        if (a.pricesale > b.pricesale) {
          return -1;
        }
        return 0
      });
      return arrSort;
    }
    }
}
