import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'price'
})
export class PricePipe implements PipeTransform {

  transform(value: any, price:number): any {

    if(price == 0 )
      return value;
    const proArray:any[]=[];
    for (let i = 0; i <value.length ; i++) {
      let proPrice:number = value[i].pricesale;
      // if(price <= proPrice && proPrice <= prices){
      //   proArray.push(value[i]);
      // }
      if(price == 1){
        if(0 < proPrice && proPrice <= 500000){
          proArray.push(value[i]);
        }
      }
      if (price ==2){
        if(500000 < proPrice && proPrice <= 1000000){
          proArray.push(value[i]);
        }
      }

      if (price == 3){
        if(1000000 < proPrice){
          proArray.push(value[i]);
        }
      }
    }
    return proArray;
  }


}
