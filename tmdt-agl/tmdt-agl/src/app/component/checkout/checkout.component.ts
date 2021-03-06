import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLinkActive } from '@angular/router';
import { AddressItem } from 'src/app/models/address-item';
import { CartItem } from 'src/app/models/cart-item';
import { Discount } from 'src/app/models/discount';
import { Districts } from 'src/app/models/districts';
import { Order } from 'src/app/models/order';
import { Provinces } from 'src/app/models/provinces';
import { User } from 'src/app/models/user';
import { Wards } from 'src/app/models/wards';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { OrderService } from 'src/app/services/order.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  user: User | any;
  listItem: CartItem[] = [];
  model: any = {};
  address: any = {phone: '', province: '', districts: '', wards: '', addressDetails: '', name: ''};
  province: Provinces[] = [];
  listdistricts: Districts[] = [];
  districts: Districts[] = [];
  wards: Wards[] = [];
  listWards: Wards[] = [];
  shippingAddress: AddressItem[] = [];
  address_check1: boolean = false;
  userInfo: User | any;
  listDiscount: Discount[] = [];
  listOrder: Order[] = [];
  userID = JSON.parse(<string>localStorage.getItem('user'));

  selectAdress:AddressItem|any;



  constructor(private checkout: CheckoutService,
    private orderService: OrderService,
    private userService: UserService,
    private router: Router,
    private cartSer: CartService
              ) {
                this.userService.getAllUser().valueChanges().subscribe(
                  usesr =>{
                    this.user =  usesr.find(us=> this.user = (us.uid == this.userID));
                    this.getAddress();
                    this.listDiscount = this.user.listVoucher;
                    this.selectAdress = this.user.shippingAddress[0];
                  }
                ) 
               }

  ngOnInit(): void {

    this.getCartItem();
    this.loadAddressVietNam();
    
  }



  getCartItem() {
    this.checkout.getCartItemToOrder().subscribe((up) => this.listItem = up);
  }

  deleteItem(id: any) {
    for (let i of this.listItem) {
      if (i.product.id == id) {
        this.listItem.splice(this.listItem.indexOf(i), 1);
      }
    }
  }

  minusQty(id: any) {
    for (let i = 0; i < this.listItem.length; i++) {
      if (this.listItem[i].product.id == id) {
        if (this.listItem[i].qty > 1) {
          this.listItem[i].qty--;
        }
      }
    }
  }

  plussQty(id: any) {
    for (let i = 0; i < this.listItem.length; i++) {
      if (this.listItem[i].product.id == id) {
        this.listItem[i].qty++;
      }
    }
  }

  // th??m ?????a ch??? m???i
  addNewAddress() {
    // let id = 0;
    // if (this.shippingAddress.length == 0) {
    //   id = 1;
    // } else {
    //   id = this.shippingAddress[this.shippingAddress.length - 1].id + 1
    //   for (let shippingAddress1 of this.shippingAddress) {
    //     if (shippingAddress1.id == id) {
    //       id = this.shippingAddress[this.shippingAddress.length - 1].id + 2;
    //       break;
    //     }
    //   }
    // }
    let address = new AddressItem( this.model.name, this.findNameProvince(this.model.province),
      this.findNameDistricts(this.model.district_code), this.findNameWards(this.model.wards), this.model.phoneup, this.address.addressDetails)
    this.shippingAddress.push(address);

    this.userService.getAllUser().update(this.userID,{shippingAddress:this.shippingAddress}).then(()=>{
      this.alert('Th??m ?????a ch??? m???i th??nh c??ng','success');
    })
    // this.userService.addNewAddress(this.shippingAddress).subscribe((data) => {
    //   this.userInfo = data
    //   this.loadUser();
    //   this.alert('Th??m ?????a ch??? m???i th??nh c??ng', 'success')
    //   if (this.shippingAddress.length == 1) {
    //     window.location.reload();
    //   }
    // })
  }

//c???p nh???t ?????a ch???
  updateAddress(taget: any) {
    let address = new AddressItem( this.model.name, this.findNameProvince(this.model.province),
      this.findNameDistricts(this.model.district_code), this.findNameWards(this.model.wards), this.model.phoneup, this.address.addressDetails)
    for (let shippingAddressKey of this.shippingAddress) {
      if (shippingAddressKey.key == taget) {
        let index = this.shippingAddress.indexOf(shippingAddressKey)
        this.shippingAddress.splice(index, 1);
        this.shippingAddress.splice(index, 0, address);
        // this.userService.addNewAddress(this.shippingAddress).subscribe((data) => {
        //   this.userInfo = data
        //   this.loadUser();
        //   this.alert('C???p nh???t ?????a ch??? th??nh c??ng','success')
        // })
      }

    }

  }
  

  getAddress() {
    this.shippingAddress = this.user.shippingAddress;
    if (this.shippingAddress.length != 0) {
      this.address_check1 = true;
    }
    return this.address_check1;
  }


  loadAddressVietNam() {
    this.loadProvince();
    this.loadDistricts(1)
    this.loadWards(1);
    // ?????t c??c gi?? tr??? m???c ?????nh
    this.model.province = 1;
    this.model.district_code = 1;
    this.model.wards = 1
    this.model.address1 = 0;
    this.model.discount = 1;
  }

  loadProvince() {
    this.userService.getProvince().subscribe((data) => {
      this.province = data;
    })
  }

  loadDistricts(code: any) {
    this.listdistricts = []
    this.userService.getDistricts().subscribe((data) => {
      this.districts = data;
      for (let districtsKey of this.districts) {
        if (districtsKey.province_code == code) {
          this.listdistricts.push(districtsKey);

        }
      }
    })
  }

  loadWards(code: any) {
    this.listWards = []
    this.userService.getWards().subscribe((data) => {
      this.wards = data;
      for (let item of this.wards) {
        if (item.district_code == code) {
          this.listWards.push(item);

        }
      }
    })
  }

  findNameDistricts(code: any) {
    let name = '';
    for (const item of this.listdistricts) {
      if (item.code == code) {
        name = item.name
      }
    }
    return name;
  }

  findNameProvince(code: any) {
    let name = '';
    for (const item of this.province) {
      if (item.code == code) {
        name = item.name
      }
    }
    return name;
  }

  findNameWards(code: any) {
    let name = '';
    for (const item of this.listWards) {
      if (item.code == code) {
        name = item.name
      }
    }
    return name;
  }

  checkaddress() {
    if (this.shippingAddress.length == 0 || this.model.address1 == 0) {
      return false;
    } else
      return true;
  }

//Discount
  getDiscount(discount: any) {
    let a: Discount | any;
    if (discount == 1) {
      a = 0;
    }

    for (let item of this.listDiscount) {
      if (item.codeDiscount == discount) {
        a = item;
        break;
      }
    }
    return a;
  }

// Ch???n ?????a ch??? thanh to??n
  selectAddress(address: any): AddressItem|any {
    this.selectAdress = address;
  }

//t???ng ti???n s???n ph???m
  getPrice() {
    let price = 0;
    for (const item of this.listItem) {
      price += item.qty * item.product.price
    }
    return price;
  }

  // ??p d???ng m?? gi???m gi??
  applyVoucher(code: any) {
    let result = 0
    if (code == 1) {
      result = 0;
    } else {
      for (let listDiscountElement of this.listDiscount) {
        if (listDiscountElement.codeDiscount == code) {
          result = listDiscountElement.rate / 100 * this.getPrice();
          break;
        }
      }
    }
    return result;
  }

  // ph?? v???n chuy???n
  shipCost() {
    return this.listItem.length * 30000
  }

  // t???ng gi?? tr??? ????n h??ng
  totalPrice() {
    return this.getPrice() + this.shipCost() - this.applyVoucher(this.getDiscount(this.model.discount).codeDiscount);
  }


  getOrder() {
    this.orderService.getOrder().valueChanges().subscribe((t) => this.listOrder = t);
  }


  confirmAddNewOrder(){
    Swal.fire({
      title: 'X??c nh???n ?????t h??ng?',
      text: "?????ng ?? v?? ti???p t???c ?????t h??ng",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText:'H???y',
      confirmButtonText: '?????t h??ng'

    }).then((result) => {
      if (result.isConfirmed) {
        this.addNewOrder();
      }
    })

  }
  addNewOrder() {
    this.getOrder();
    let dataAddress: AddressItem | any;
    let check = false;
    let code = (Math.floor(Math.random() * 899999) + 100000).toString()
    for (let x of this.listOrder) {
      if (code != x.code) {
        check = true;
      }
    }

    if (!check || this.listOrder.length == 0) {
      let jstoday = formatDate(new Date(), 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
      let item = new Order(this.user.uid, this.checkdiscount(this.getDiscount(this.model.discount)), "Ch??? x??c nh???n", this.listItem, code, this.selectAdress, this.totalPrice(),jstoday);
      if (this.user.uid != '') {
        if (this.listItem.length != 0) {
          this.orderService.addNewOrder(item);
          this.deleteCart(this.listItem);
          Swal.fire({
            title: '????n h??ng #'+code +' ???? ???????c t???o th??nh c??ng',
            text: "C???m ??n b???n ???? ?????t h??ng",
            icon: 'success',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#3de5cb',
            confirmButtonText: 'Ti???p t???c mua s???m',
            cancelButtonText:'????n h??ng c???a t??i'
          }).then((result) => {
            if (result.isConfirmed) {
              this.router.navigate(['/cart'])
            }
            if(result.isDismissed){

              this.router.navigate(['my-account/'+this.user.uid])
            }
          })

        } else {
          console.log('H??y ch???n s???n ph???m.');
        }
      } else {
        console.log('B???n h??y ????ng nh???p.');
      }
    }

  }
 checkdiscount(discountvalue:any ){
    let b:any ;
    if(discountvalue==0){
      b='';
    }
    if(discountvalue!=0){
      b=discountvalue
    }
    return b;
 }
  deleteCart(arr: any) {
    for (let j = 0; j < arr.length; j++) {
      // this.checkout.deleteCartItem(arr[j].id).subscribe(data => {
      //   console.log('OK')
      // })
    }
  }

  alert(mess: any, type: any) {
    Swal.fire({
      position: 'center',
      icon: type,
      title: mess,
      showConfirmButton: false,
      timer: 2000
    })
  }



}
