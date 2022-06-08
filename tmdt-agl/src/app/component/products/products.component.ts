import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/models/cart-item';
import { Product } from 'src/app/models/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductsService } from 'src/app/services/products.service';
import { UserService } from 'src/app/services/user.service';
import Swal from "sweetalert2";
import {map} from "rxjs/operators";
import { Review } from 'src/app/models/review';
import { ReviewService } from 'src/app/services/review.service';
import { CheckoutService } from 'src/app/services/checkout.service';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  //ds sp
  product:Product[]=[];
  //sotrang 
  page:number =1;
  totalLength:any;
  cartItem: any;
  user:any;
  listReview:Review[]|any = [];
  arrayStar: any = [];

  listProduct:Product[]=[];


  constructor(private prodsv:ProductsService,
    private cartService:CartService,
    private userService:UserService,
    private reviewService:ReviewService,
    private checkoutservice:CheckoutService) { 
      this.user = userService.userValue;

  }
  ngOnInit(): void {
    // this.processFill();
    this.loadProduct();
    this.listProduct = this.product;
    this.totalLength = this.product.length;
    this.loadCartItem();
    this.loadReview();
  }



  loadProduct(){
    this.prodsv.getAllProducts().valueChanges().subscribe(
      i =>{ 
        this.product = i;
        this.listProduct = this.product;
      }
    )
  }


  loadCartItem(){
    this.cartService.getAllCart().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.cartItem = data;
    });

  }

 

  public add(id: any) {
    if (this.userService.userValue!=null) {
      this.AddToCart(id);
      console.log('login.....');
    } else {
      console.log('unlogin.....');
      let it: any;
      for (let i of this.product) {
        if (i.id == id) {
          it = new CartItem(i, 1, '');
        }
      }
      this.cartService.addToCart(it);
    }
    this.alert('Đã thêm sản phẩm vào giỏ', 'success')
  }

  public AddToCart(productid: number) {
    let it: any;
    let check = false;
    for (let i of this.product) {
      if (i.id == productid) {
        it = new CartItem(i, 1, this.userService.userValue.uid);
      }
    }

    for (let item of this.cartItem) {
      if (productid == item.product.id && item.userName == this.userService.userValue.uid) {
        let q = item.qty + 1;
        this.cartService.getAllCart().update(item.key,{qty:q});
        this.loadCartItem();
        check = true;
        break;
      }
    }

    if (check == false) {
      this.cartService.getAllCart().push(it);
      this.loadCartItem();
      this.cartService.addListCart(this.cartItem)

    }
  }


  buynow(id: any) {
    for (let productListElement of this.product) {
      if (id == productListElement.id) {
        let item = new CartItem(productListElement, 1, this.user.uid);
        let array = [];
        array.push(item)
        this.checkoutservice.addListCartToOrder(array);
      }
    }
  }

  loadReview(){
    this.reviewService.getAll().valueChanges().subscribe(data =>{
      this.listReview = data;
    })
  }

  
  returnArray(avgStart: any) {
    let result: any = [];
    for (let i = 0; i < avgStart; i++) {
      result.push(i);
    }
    return result;
  }

  avgStart(number: number,product:any) {
    let array=this.findProduct(product);
      let a = (this.loadStart(5,array) * 5 + this.loadStart(4,array) * 4 + this.loadStart(3,array) * 3 +
        this.loadStart(2,array) * 2 + this.loadStart(1,array) * 1) / (array.length);
      return a.toFixed(number);
  }

  findProduct(productid:any){
    let arr:any=[];
    for (let listReviewElement of this.listReview) {
      if(listReviewElement.product_id == productid){
        arr.push(listReviewElement);
      }
    }
    return arr;
  }

  loadStart(start: number,array:any) {
    let result = 0;
    for (let listReviewElement of array) {
      if (listReviewElement.rate == start) {
        result += 1;
      }
    }
    return result;
  }

  alert(mess: any, type: any) {
    Swal.fire({
      position: 'center',
      icon: type,
      title: mess,
      showConfirmButton: false,
      timer: 1500
    });
  }


  //filter
  sortKey='';
  fillCate=' ';
  fillPrice = 0;
  titlePrice ="Tất cả"; 
  searchkey='';


  fillCategory(name:string,listpro:Product[]){
    let list:Product[] =[];
    if(name != ' '){
      for(let item of listpro){
        if(item.category == name){
          list.push(item);
        }
      }
      return list;
    }
    return this.listProduct;
  }

  
 

}
