import {User} from "./user";
import {Product} from "./product";
import {Timestamp} from "rxjs";

export class Review {
  key:any;
  content: string;
  user: string;
  rate: number;
  product_id: number;
  time: string;
  name: string;

  constructor(content: string, user: string, rate: number, product_id: number, time: string, name: string) {
    this.content = content;
    this.user = user;
    this.rate = rate;
    this.product_id = product_id;
    this.time = time;
    this.name = name;
  }
}
