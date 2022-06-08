import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-2';
import { map } from 'rxjs';
import { CartItem } from 'src/app/models/cart-item';
import { Product } from 'src/app/models/product';
import { Review } from 'src/app/models/review';
import { User } from 'src/app/models/user';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ProductsService } from 'src/app/services/products.service';
import { ReviewService } from 'src/app/services/review.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  listSaleProduct:Product[]=[];
  listNewProduct:Product[]=[];
  listCartItem:any;
  listReview:Review[]=[] ;
  product:any;
  user:User|any;
  

  constructor(private productservice:ProductsService,private reviewService:ReviewService,private cartservice:CartService,
    private userService:UserService,private checkoutservice: CheckoutService){
    this.loadListProduct();
    this.loadReview();
    this.loadCartItem();
    this.productservice.getAllProducts().valueChanges().subscribe(data=>{
      this.product =data;
    });
    this.user = userService.userValue;
  }

  ngOnInit(): void {
  }

  loadListProduct(){
    this.productservice.getProductSale().valueChanges().subscribe(data=>{
      this.listSaleProduct = data;
    })

    this.productservice.getNewProduct().valueChanges().subscribe(data=>{
      this.listNewProduct = data;
    })
  }

  loadReview(){
    this.reviewService.getAll().valueChanges().subscribe(data =>{
      this.listReview = data;
    })
  }

  loadCartItem(){
    this.cartservice.getAllCart().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.listCartItem = data;
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
      this.cartservice.addToCart(it);
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

    for (let item of this.listCartItem) {
      if (productid == item.product.id && item.userName == this.userService.userValue.uid) {
        let q = item.qty + 1;
        this.cartservice.getAllCart().update(item.key,{qty:q});
        this.loadCartItem();
        check = true;
        break;
      }
    }

    if (check == false) {
      this.cartservice.getAllCart().push(it);
      this.loadCartItem();
      this.cartservice.addListCart(this.listCartItem)

    }
  }


  buynow(id: any) {
    for (let productListElement of this.product) {
      if (id == productListElement.id) {
        let item = new CartItem(productListElement, 1, JSON.parse(<string>localStorage.getItem('user')));
        let array = [];
        array.push(item)
        this.checkoutservice.addListCartToOrder(array);
      }
    }
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
 


  customOptions: OwlOptions = {
    loop: true,
    autoplay:true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 600,
    navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
    responsive: {
      0: {
        items: 1,
    },
    400: {
        items: 2,
    },
    740: {
        items: 3,
    },
    940: {
        items: 4,
    },
    },
    nav: true
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


}
