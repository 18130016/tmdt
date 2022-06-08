import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { Order } from '../models/order';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  listOrder:AngularFireList<Order>;
  constructor(private db:AngularFireDatabase) {
    this.listOrder = this.db.list('order');
   }

  getOrder(){
    return this.listOrder;
  }

  addNewOrder(order:Order){
    this.listOrder.push(order);
  }
}
