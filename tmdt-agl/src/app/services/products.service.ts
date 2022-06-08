import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import {map} from "rxjs/operators";
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  productList:AngularFireList<Product>;
  product:Product|any;

  item:any;
  listpro:Product[]|any=[];
  constructor(private db:AngularFireDatabase) { 
    this.productList = this.db.list('products');
  }

  // lay tat ca sp tu firebase
  getAllProducts():AngularFireList<Product>{
    
    return this.productList;
  }

  getProductSale():AngularFireList<Product>{
    let list:AngularFireList<Product> = this.db.list('bestsale');
    return list;
  }

  getSuggetedProduct():AngularFireList<Product>{
    let list:AngularFireList<Product> =  this.db.list('suggestproduct');
    return list;
  }

  getNewProduct():AngularFireList<Product>{
    let list:AngularFireList<Product> = this.db.list('newproduct');
    return list;
  }
  




  
}
