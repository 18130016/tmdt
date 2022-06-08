import { AddressItem } from "./address-item";
import {CartItem} from "./cart-item";
import { Discount } from "./discount";

export class User {
  uid:string;
  email:string;
  fullname:string
  phone:string;
  adress:string;
  listVoucher:Discount[];
  shippingAddress:AddressItem[];


  constructor(uid:string, email: string, fullname: string, phone: string, adress: string, listVoucher: Discount[], shippingAddress: AddressItem[]) {
    this.uid = uid;
    this.email = email;
    this.fullname = fullname;
    this.phone = phone;
    this.adress = adress;
    this.listVoucher = listVoucher;
    this.shippingAddress = shippingAddress;
  }
}
