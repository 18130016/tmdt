import {CartItem} from "./cart-item";
import {Discount} from "./discount";
import {AddressItem} from "./address-item";

export class Order{
  userName:string;
  discount:Discount;
  status:string;
  cartItem:CartItem[];
  key:string|any;
  code:string;
  addressShip:AddressItem;
  priceOrder:number;
  time:string

  constructor(userName: string, discount: Discount, status: string, cartItem: CartItem[], code: string, addressShip: AddressItem,priceOrder:number,time:string) {
    this.userName = userName;
    this.discount = discount;
    this.status = status;
    this.cartItem = cartItem;
    this.code = code;
    this.addressShip = addressShip;
    this.priceOrder= priceOrder;
    this.time=time;
  }
}
