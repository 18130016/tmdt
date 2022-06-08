import {Product} from "./product";

export class CartItem {
  key: any;
  qty: number;
  product:Product;
  userName:string;


  constructor(product: Product, qty :number,userName:string) {
    this.qty = qty;
    this.product = product;
    this.userName = userName;
  }
}
