import { Component, OnInit } from '@angular/core';
import {UserService} from "../../services/user.service";
import {ActivatedRoute, Router} from "@angular/router";
import {User} from "../../models/user";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Order} from "../../models/order";
import {CartItem} from "../../models/cart-item";
import {Provinces} from "../../models/provinces";
import {Districts} from "../../models/districts";
import {Wards} from "../../models/wards";
import {AddressItem} from "../../models/address-item";
import Swal from "sweetalert2";
import { OrderService } from 'src/app/services/order.service';
import { AngularFireAuth} from "@angular/fire/auth";
import { map } from 'rxjs';
import { ReviewService } from 'src/app/services/review.service';
import { formatDate } from '@angular/common';
import { Review } from 'src/app/models/review';

@Component({
  selector: 'app-myacount',
  templateUrl: './myacount.component.html',
  styleUrls: ['./myacount.component.css']
})
export class MyacountComponent implements OnInit {
  user:User|any;
  userID :any;
  userFirebase:any;
  form: FormGroup | any;
  check:boolean = false;
  is_edit: boolean = true;
  model: any = {};
  shippingAddress: AddressItem[] = [];
  address_check: boolean = false;
  address_check1: boolean = false;
  province: Provinces[] = [];
  listdistricts: Districts[] = [];
  districts: Districts[] = [];
  wards: Wards[] = [];
  listWards: Wards[] = [];
  listOrder: Order[]|any = [];
  isChange: boolean = false;
  taget: CartItem[] | any;
  paymentAddress: string | any;
  address: any = {phone: '', province: '', districts: '', wards: '', addressDetails: '', name: ''};

  lengthStatusOrderPipe:any;
  userName ='';




    //lọc và chia order theo trạng thái
    countFillStatus:any;
    orderStatus: string = '';
    orderStatus_1: Order[] = [];//cho xac nhan
    orderStatus_2: Order[] = [];//dang giao
    orderStatus_3: Order[] = [];//da giao
    orderStatus_4: Order[] = [];//da huy

  constructor(private userService:UserService,
    private orderService:OrderService, private router:ActivatedRoute ,
    private auth:AngularFireAuth,private reviewservice:ReviewService
    ) {
      this.userID  =  this.router.snapshot.paramMap.get('uid');
      this.userService.getAllUser().valueChanges().subscribe(
        usesr =>{
          this.user =  usesr.find(us=> this.user = (us.uid == this.userID));
          this.loadAddress();
        }
      ) 
      this.loadAddressVietNam(); 
  }

  ngOnInit(): void {
   this.getOrder();
  }

  updateInfo() {
    this.is_edit = false;
    this.check = true;
// @ts-ignore
    document.getElementById('btnUpd').style.display = 'none'
    // @ts-ignore
    document.getElementById('btnExit').style.display = 'inline'
    // @ts-ignore
    document.getElementById('btn-updateaccount').style.display = 'inline'
  }

  back() {
    this.is_edit = true;
    this.check = false;
    // @ts-ignore
    document.getElementById('btnUpd').style.display = 'inline'

    // @ts-ignore
    document.getElementById('btnExit').style.display = 'none'
    // @ts-ignore
    document.getElementById('btn-updateaccount').style.display = 'none'

  }

  updateAccount() {
    if((this.model.phoneup == undefined  && this.model.address != undefined)
      || (this.model.phoneup == '' && this.model.address != '')){
        this.userService.getAllUser().update(this.userID,{adress:this.model.address}).then(()=>{
          console.log(this.model)
          this.alert('Đã thay đổi thông tin địa chỉ','success');
        });
      }
      if((this.model.phoneup != undefined  && this.model.address == undefined)
      || (this.model.phoneup != '' && this.model.address == '')){
        this.userService.getAllUser().update(this.userID,{phone:this.model.phoneup}).then(()=>{
          console.log(this.model)
          this.alert('Đã thay đổi thông tin số điện thoại','success');
        });
      }
      else{
        this.userService.getAllUser().update(this.userID,{adress:this.model.address,phone:this.model.phoneup}).then(()=>{
          console.log(this.model);
          this.alert('Đã thay đổi thông tin user','success');
        });
      }
  }

  changePass() {
    let mess = '';
    let check = false;
    let lenght = false;
    if(this.model.password == this.model.confirmpass){
      check = true;
    }else{
      check = false;
      mess += ('(Password does not match)')
      this.alert('Mật khẩu mới không trùng khớp','warning')
    }

    if (this.model.password != undefined && (this.model.password.length >= 6 && this.model.password.length <= 18)) {
      lenght = true;
    } else {
      lenght = false;
      mess += (' (New password is more than 6 characters and less than 18 characters) ')
      this.alert('Mật khẩu phải dài hơn 6 ký tự','warning')
    }

    if(check ==true && lenght == true){
      this.auth.currentUser.then(us=>{
        this.userFirebase == us;
        us?.updatePassword(this.model.password).then(
          ()=>{
            mess = (' (Change password successful)');
            Swal.fire({
              title: 'Thay đổi mật khẩu thành công.',
              text: "Vui lòng đăng nhập lại tài khoản!",
              icon: 'success',
              confirmButtonColor: '#2ce1e9',
              confirmButtonText: 'Đồng ý',
            }).then((rs)=>{
              if(rs.isConfirmed){
                this.userService.logout();
              }
            });
          });
        });
    }
  }


  
  getOrder() {
    this.orderService.getOrder().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ key: c.payload.key, ...c.payload.val() })
        )
      )
    ).subscribe(data => {
      this.listOrder = data;
      this.listOrder = this.getOrderByUid();
      this.fillOrderStatus();
    });
    
  }

  getOrderByUid(){
    let list:Order[]=[];
    for(let item of this.listOrder){
      if(item.userName == this.userID ){
        list.push(item);
      }
    }
    return list;
  }

  updateOrder(id: number) {
    // if (this.isChange == true) {
    //   let item: any;
    //   for (let i of this.listOrder) {
    //     if (i.key == id) {
    //       item = new Order(i.userName, i.discount, i.status, i.cartItem, i.code, i.addressShip,i.priceOrder);
    //     }
    //   }
    //   this.getOrder();
    //   this.isChange = false;
    //   this.orderService.updateOrder(item, id).subscribe();
    // }
  }

  minus(id: any) {
    for (let i = 0; i < this.taget.length; i++) {
      if (this.taget[i].id == id) {
        this.isChange = true;
        this.taget[i].qty--;
      }
    }
  }

  pluss(id: any) {
    for (let i = 0; i < this.taget.length; i++) {
      if (this.taget[i].id == id) {
        this.isChange = true;
        this.taget[i].qty++;
      }
    }
  }

  deleteItemInOrder(id: any) {
    for (let item of this.listOrder) {
      for (let i = 0; i < item.cartItem.length; i++) {
        if (item.cartItem[i].key == id) {
          item.cartItem.splice(i, 1);
        }
      }
    }
  }

  deleteOrder(id: any) {
    // console.log(id);
    for (let item of this.listOrder) {
      if (item.key == id) {
        this.orderService.getOrder().update(id,{status:'Đã hủy'});
        this.alert('Đã hủy đơn hàng','success');
        this.fillOrderStatus();
      }
    }
  }

  public fillOrderStatus() {
    this.orderStatus_1 = [];//cho xac nhan
    this.orderStatus_2 = [];//dang giao
    this.orderStatus_3 = [];//da giao
    this.orderStatus_4 = [];//da huy

    for (const item of this.listOrder) {
      if (item.status == 'Chờ xác nhận') {
        this.orderStatus_1.push(item);
      } else if (item.status == 'Đang giao') {
        this.orderStatus_2.push(item);
      } else if (item.status == 'Đã giao') {
        this.orderStatus_3.push(item);
      } else {
        this.orderStatus_4.push(item);
      }
    }
  }

  changeOrderStatus(Sta:any){
    this.orderStatus = Sta;
  }

    //tổng tiền cho đơn hàng
    totalPrice(cart: CartItem[], discount: number) {
      let total: number = 0;
      for (let i of cart) {
        total = total + (i.qty * i.product.pricesale);
      }
      return total * discount;
  
    }

  loadAddressVietNam(){
    this.loadProvince();
    this.loadDistricts(1)
    this.loadWards(1);
    this.model.province = 1;
    this.model.district_code = 1;
    this.model.wards = 1;
  }


  //xóa địa chỉ tại vị trí index
  deleteAddress(taget: any) {
    for (let shippingAddressKey of this.shippingAddress) {
      if (shippingAddressKey == taget) {
        let index = this.shippingAddress.indexOf(shippingAddressKey)
        this.shippingAddress.splice(index, 1);
        this.userService.getAllUser().update(this.userID,{shippingAddress:this.shippingAddress}).then(()=>{
          this.alert('Đã xóa địa chỉ','success');
        })
        // this.userService.addNewAddress(this.shippingAddress).subscribe((data) => {
        //   this.userInfo = data
        //   this.alert('Đã xóa địa chỉ','success')
        //   if (this.shippingAddress.length == 0) {
        //     window.location.reload();
        //   }
        // })
      }

    }

  }

  // thêm địa chỉ mới
  addNewAddress() {
    let address = new AddressItem(this.model.name, this.findNameProvince(this.model.province),
      this.findNameDistricts(this.model.district_code), this.findNameWards(this.model.wards), this.model.phoneup, this.address.addressDetails)
    let list:AddressItem[] = this.user.shippingAddress;
    list.push(address);
    this.userService.getAllUser().update(this.userID,{shippingAddress:list}).then(()=>{
      this.alert('Thêm địa chỉ mới thành công','success');
    })
    // this.userService.addNewAddress(this.shippingAddress).subscribe((data) => {

    //   this.userInfo = data
    //   this.loadUser();
    //   this.alert('Thêm địa chỉ mới thành công','success')
    //   if (this.shippingAddress.length == 1) {
    //     window.location.reload();
    //   }
    // })
  }


  updateAddress(taget: any) {
    let address = new AddressItem(this.model.name, this.findNameProvince(this.model.province),
    this.findNameDistricts(this.model.district_code), this.findNameWards(this.model.wards), this.model.phoneup, this.address.addressDetails);

    for(let add of this.shippingAddress){
      if(add == taget){
        let index = this.shippingAddress.indexOf(add);
        this.shippingAddress.splice(index,1);
        this.shippingAddress.splice(index,0,address);
        this.userService.getAllUser().update(this.userID,{shippingAddress:this.shippingAddress}).then(()=>{
          this.alert('Cập nhật địa chỉ thành công','success');
        });
      }
    }

    // for (let shippingAddressKey of this.shippingAddress) {
    //   if (shippingAddressKey == taget) {
    //     let index = this.shippingAddress.indexOf(shippingAddressKey)
    //     this.shippingAddress.splice(index, 1);
    //     this.shippingAddress.splice(index, 0, address);

    //     this.userService.addNewAddress(this.shippingAddress).subscribe((data) => {

    //       this.userInfo = data
    //       this.loadUser();
    //       this.alert('Cập nhật địa chỉ thành công','success')

    //     })
    //   }

    // }
  }
    // load dữ liệu tỉnh thành
    loadProvince() {
      this.userService.getProvince().subscribe((data) => {
        this.province = data;

      })
    }

  loadAddress() {
    this.shippingAddress = this.user.shippingAddress;
    if (this.shippingAddress.length != 0) {
      this.address_check1 = true;
    }
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

//tìm quận huyện
  findNameDistricts(code: any) {
    let name = '';
    for (const item of this.listdistricts) {
      if (item.code == code) {
        name = item.name
      }
    }
    return name;
  }

//tìm tỉnh thành
  findNameProvince(code: any) {
    let name = '';
    for (const item of this.province) {
      if (item.code == code) {
        name = item.name
      }
    }
    return name;
  }

//tìm phường xã
  findNameWards(code: any) {
    let name = '';
    for (const item of this.listWards) {
      if (item.code == code) {
        name = item.name
      }
    }
    return name;
  }

  alert(mess: any, type: any) {
    Swal.fire({
      position: 'center',
      icon: type,
      title: mess,
      showConfirmButton: false,
      timer: 3000
    })
  }

  logout(){
    this.userService.logout();
  }

  start = 0;
  comment ='';

  clickStart(start:number){
    this.start=start;
    return this.start;
  }

  reviewid='';
  newReview(reviewID:any){
    console.log(reviewID);
    let now = new Date();
    let jstoday = formatDate(now, 'dd-MM-yyyy hh:mm:ss a', 'en-US', '+0530');
    let review = new Review(this.comment,this.userID,this.start,reviewID,jstoday,this.user.fullname);
    this.reviewservice.getAll().push(review);
    this.alert('Cảm ơn bạn đã đánh giá','success')

  }

}
