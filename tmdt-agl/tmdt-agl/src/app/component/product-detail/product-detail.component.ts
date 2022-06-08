import { Component, OnInit } from '@angular/core';
import { ProductsService } from 'src/app/services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import value from "*.json";
import {listProducts} from "../../models/listproduct";
import {CartService} from "../../services/cart.service";
import {ProductsComponent} from "../products/products.component";
import {CartItem} from "../../models/cart-item";
import {publish} from "rxjs/operators";
import Swal from "sweetalert2";
import {Review} from "../../models/review";
import {UserService} from "../../services/user.service";
import {formatDate} from "@angular/common";
import {User} from "../../models/user";
import { map } from 'rxjs';
import { ReviewService } from 'src/app/services/review.service';
import { CheckoutService } from 'src/app/services/checkout.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  productDetail:Product|any;
  user:User|any;
  value=1;
  listProduct:Product[] = [];
  proId:number = <number><unknown>this.route.snapshot.paramMap.get('id');

  listCartItem:CartItem[]|any=[];


  listReview:Review[]|any = [];
  start:number=1;
  review:any= {};
  listRview2Item:any;
  constructor(
    private userservice: UserService,
    private route: ActivatedRoute,
    private service: ProductsService,
    private cartService: CartService,
    private productService:ProductsService,
    private reviewService:ReviewService,
    private checkout:CheckoutService
  ) {
    this.loadlistProduct();
    this.user = this.userservice.userValue;
    this.loadReview();
  }
  ngOnInit(): void {
  }

  loadCartItem(){
    this.cartService.getAllCart().valueChanges().subscribe((data)=>{this.listCartItem = data});
  }

   loadProductDetail():Product|any{
    const proId =  <number><unknown>this.route.snapshot.paramMap.get('id');
    for (let index = 0; index < this.listProduct.length; index++) {
      const element = this.listProduct[index];
      if(this.listProduct[index].id ==proId){
        return this.listProduct[index];
      }
    }
    
  }
  loadlistProduct(){
    this.productService.getAllProducts().valueChanges().subscribe(pro =>{
      this.listProduct = pro;
      this.productDetail = this.loadProductDetail();
    });
  }
  clickMinus(){
    if (this.value > 1) {
      this.value--;
    }
  }

  clickPluss(){
    this.value++;
  }

  addToCart(pro:Product){
    if(this.user!=null){
      this.putcart(pro);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Đã thêm vào giỏ hàng',
        showConfirmButton: false,
        timer: 1500
      })
    }else{
      let items = new CartItem(pro, this.value, '');
      this.cartService.addToCart(items);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Đã thêm vào giỏ hàng',
        showConfirmButton: false,
        timer: 1500
      })
    }
  }

  putcart(product:Product){
    let items = new CartItem(product,this.value,this.user.uid);
    let check=false;
    for(let item of this.listCartItem){
      if(item.product.id == product.id&& item.userName == this.user.uid){
        items.qty += item.qty;
        this.cartService.getAllCart().update(item.key,{qty:items.qty});
        check = true;
        break;
      }
    }
    if (check == false) {
      this.cartService.getAllCart().push(items);
    }
  }

  buynow(product: Product) {
    let item = new CartItem(product, this.value, this.user.uid);
    let array = [];
    array.push(item)
    this.checkout.addListCartToOrder(array)
  }

  page: number=1;
  loadReview(){
    this.reviewService.getAll().valueChanges().subscribe(data=>{
      this.listRview2Item = data;
      this.listReview = this.loadReviewById();
    })
    }
  loadReviewById():Review[]|any{
    let list:Review[]=[];
    for(let item of this.listRview2Item){
      if(item.product_id == this.proId){
        list.push(item);
      }
    }
    return list;
  }
  Ratio(start:any){
    return Math.round( (this.loadStart(start)/this.listReview.length)*100* 100)/ 100
  }

    loadStart(start:number){
      let result =0;
      for (let listReviewElement of this.listReview) {
        if(listReviewElement.rate==start){
          result+=1;
        }
      }
      return result;
    }
  clickStart(start:number){
    this.start=start;
    return this.start;
  }

  showAllReview(){
    this.listRview2Item=this.listReview;
        // @ts-ignore
        document.getElementById('btnShow').style.display = 'none'
        // @ts-ignore
        document.getElementById('btnHide').style.display = 'inline'
   }


   hideReview() {
    this.listRview2Item=[];
    this.loadReview();
    // @ts-ignore
    document.getElementById('btnHide').style.display = 'none'
    // @ts-ignore
    document.getElementById('btnShow').style.display = 'inline'
  }
  returnArray(ia:any){
    let result:any=[];
    for (let i = 0; i < ia; i++) {
      result.push(i);
    }
    return result;
  }
  
  createReview(productId:any){
    let now = new Date();
    let jstoday = formatDate(now, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
    let review =new Review(this.review.content,this.userservice.userValue.fullname,
      this.start,productId,jstoday,this.userservice.userValue.fullname);
    this.reviewService.newReview(review);
    this.loadReview();
    this.alert('Cảm ơn bạn đã đánh giá','success');
  }

  avgStart(h:any){
    let a=  (this.loadStart(5)*5+this.loadStart(4)*4+this.loadStart(3)*3+
      this.loadStart(2)*2+this.loadStart(1)*1)/(this.listReview.length);
    return a.toFixed(h);
  }


  alert(mess:any,type:any) {
    Swal.fire({
      position: 'center',
      icon: type,
      title: mess,
      showConfirmButton: false,
      timer: 1500
    });
  }
}
