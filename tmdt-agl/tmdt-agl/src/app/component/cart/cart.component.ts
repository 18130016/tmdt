import { Component, OnInit } from '@angular/core';
import { AddressItem } from 'src/app/models/address-item';
import { CartItem } from 'src/app/models/cart-item';
import { Districts } from 'src/app/models/districts';
import { Order } from 'src/app/models/order';
import { Product } from 'src/app/models/product';
import { Provinces } from 'src/app/models/provinces';
import { User } from 'src/app/models/user';
import { Wards } from 'src/app/models/wards';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import {map} from "rxjs/operators";
import { CheckoutService } from 'src/app/services/checkout.service';
import { OwlOptions } from 'ngx-owl-carousel-2';
import { ProductsService } from 'src/app/services/products.service';
import { Review } from 'src/app/models/review';
import { ReviewService } from 'src/app/services/review.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  cartItems: CartItem[]|any=[];
  listOrder: Order[] = [];
  btn: boolean = false;
  paymentAddress: string | any;
  shippingAddress: AddressItem[] = [];
  address_check1: boolean = false;
  user: User | any;
  userInfo: User | any;
  code: any;
  addressSuccess: any;
  model: any = {};
  address: any = {phone: '', province: '', districts: '', wards: '', addressDetails: '', name: ''};
  province: Provinces[] = [];
  listdistricts: Districts[] = [];
  districts: Districts[] = [];
  wards: Wards[] = [];
  listWards: Wards[] = [];
  taget: number | any;
  array: CartItem[] = [];
  selectt: boolean = false;
  userID = JSON.parse(<string>localStorage.getItem('user'));


  listSuggetedProduct:Product[]=[];
  listCartItem:any;
  listReview:Review[]=[] ;
  product:any;
  
public lengthCartItem:number=0;
  constructor(
    private cartService:CartService,
    private userService:UserService,
    private checkoutService:CheckoutService,
    private productservice:ProductsService,
    private reviewService:ReviewService
  ) {
    this.loadCartItems();
    this.loadSuggetProduct();
    this.loadReview();
    this.loadCartItem();
    this.productservice.getAllProducts().valueChanges().subscribe(data=>{
      this.product =data;
    })
   }

  ngOnInit(): void {
  }

  loadReview(){
    this.reviewService.getAll().valueChanges().subscribe(data =>{
      this.listReview = data;
    })
  }

  loadCartItem(){
    this.cartService.getAllCart().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.listCartItem = data;
    });
  }
  loadSuggetProduct(){
    this.productservice.getSuggetedProduct().valueChanges().subscribe(data=>{
      this.listSuggetedProduct =data;
    })
  }

  loadCartItems() {
    // return this.cartItems = this.cartService.getCart();
    if (this.userService.userValue) {
      this.cartService.getAllCart().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        this.cartItems = data;
        this.cartItems = this.cartItemByID(this.userID);
        this.cartService.addListCart(this.cartItems);
      });
      
    } else {
      this.cartItems = this.cartService.getItemsOff();
      this.cartService.addListCart(this.cartItems);
    }

  }

  cartItemByID(id:string){
    let list:CartItem[]=[];
    for(let it of this.cartItems){
      if(it.userName == id){
        list.push(it);
      }
    }
    return list;
  }


  //tăng số lượng
  clickPluss(id: number) {
    if (this.userService.userValue!=null) {
      for (let i of this.cartItems) {
        if (id == i.product.id) {
          let q = i.qty + 1;
          this.cartService.getAllCart().update(i.key,{qty:q});
        }
      }
    } else {
      this.cartService.pluss(id);
    }
  }


//giảm số lượng
  clickMinus(id: number) {
    if (this.userService.userValue!=null) {
      for (let i of this.cartItems) {
        if (id == i.product.id) {
          if (i.qty > 1) {
            let q = i.qty - 1;
          this.cartService.getAllCart().update(i.key,{qty:q});
          }
        }
      }
    } else {
      this.cartService.minus(id);
    }
  }

    //lấy list sản phẩm truyền vào checkout
    checkOut() {
      // console.log(this.array);
      this.checkoutService.addListCartToOrder(this.array);
    }

  // chọn sản phẩm để tiến hành thanh toan
  addSp(e: any, id: any) {
    if (e.target.checked) {
      for (let cartItem of this.cartItems) {
        if (cartItem.key == id) {
          this.array.push(cartItem);
        }
      }
    } else {
      for (let arr of this.array) {
        if (arr.key == id) {
          let index = this.array.indexOf(arr);
          this.array.splice(index, 1)
        }

      }
    }
  }

  deleteCartItem(id: number) {
    if (this.userService.userValue) {
      for (let i of this.cartItems) {
        if (i.product.id == id){
          this.cartService.getAllCart().remove(i.key);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: 'Đã xóa',
              showConfirmButton: false,
              timer: 1500
            })
            this.loadCartItems();

        }
      }
    } else {
      this.cartService.deleteItemOfOff(id);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Đã xóa sản phẩm',
        showConfirmButton: false,
        timer: 1500
      })
      this.loadCartItems();
    }

  }

  getPrice() {
    let price = 0;
    for (const item of this.cartItems) {
      price += item.qty * item.product.price
      if (price > 0) {
        this.btn = true;
      }
    }
    return price;
  }
  shipCost() {
    return this.cartItems.length * 30000
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

    for (let item of this.listCartItem) {
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
      this.cartService.addListCart(this.listCartItem)

    }
  }


  buynow(id: any) {
    for (let productListElement of this.product) {
      if (id == productListElement.id) {
        let item = new CartItem(productListElement, 1, JSON.parse(<string>localStorage.getItem('user')));
        let array = [];
        array.push(item)
        this.checkoutService.addListCartToOrder(array);
      }
    }
  }

  customOptions: OwlOptions = {
    loop: true,
    autoplay:true,
    mouseDrag: true,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    navSpeed: 50,
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
