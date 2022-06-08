import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Observable,of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  listCart:CartItem[]|any=[];
  constructor() { }
  
    addListCartToOrder(list:CartItem[]){
    return this.listCart = list;
  }
  getCartItemToOrder():Observable<any>{
    return of(this.listCart);
  }


}
