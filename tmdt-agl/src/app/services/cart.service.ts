import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { CartItem } from '../models/cart-item';
import { Observable,of,map } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems:AngularFireList<CartItem>;
  listcartData:any;
  constructor(private db:AngularFireDatabase,
    private userService: UserService) {
    this.cartItems = db.list('cart');
   }
   // lay du lieu
  getAllCart():AngularFireList<CartItem>{
    return this.cartItems;
  }
  // update cart
  update(id:any,cart:CartItem){
    this.cartItems.set(id,cart);
  }
  //xoa item
  remove(id:any){
    this.cartItems.remove(id);
  }



  
  //khi chưa đăng nhập
  cartItem: CartItem | any;
  items: CartItem[] = [];
  listItem:CartItem[]=[];


  addToCart(cartI: any) {
    let check = false;
    for (let i = 0; i < this.items.length; i++) {
      if (cartI.product.id == this.items[i].product.id) {
        this.items[i].qty=this.items[i].qty + cartI.qty;
        check = true;
        break;
      }
    }
    if (!check) {
      this.items.push(cartI);
    }
  }


//lay list CartItem tu cartoff
  getItemsOff() {
    return this.items;
  }


//xoa toan bo
  clearCart() {
    this.items = [];
    return this.items;
  }

//xoa CartItem trong cart off
  deleteItemOfOff(id: number) {
    for (let x = 0; x < this.items.length; x++) {
      if (id == this.items[x].product.id) {
        this.items.splice(x, 1);
      }
    }
  }

//tăng so luong trong cart off
  pluss(id: number) {
    for (let i = 0; i < this.items.length; i++) {
      if (id == this.items[i].product.id) {
        this.items[i].qty++;
      
      }
    }
  }

//giảm so luong trong cart off
  minus(id: number) {
    for (let i = 0; i < this.items.length; i++) {
      if (id == this.items[i].product.id) {
        if(this.items[i].qty>1){
          this.items[i].qty--;
        }
      }
    }
  }


  addListCart(list:CartItem[]){
    return this.listItem = list;
  }

  getListCart():Observable<any>{
    return of(this.listItem);
  }


  getUserName() {
    if (this.userService.userValue) {
      return this.userService.userValue.uid;
    } else
      return '';
  }

}

