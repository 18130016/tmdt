import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import { Router } from '@angular/router';
import { AddressItem } from 'src/app/models/address-item';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
import {Discount} from "../../models/discount";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  listUsers: User[] = [];
  registerForm: FormGroup | any;
  // newUser:User={uid: '',email: '', fullname: '', phone: '', adress: '', shippingAddress: [], listVoucher: []};
  validate: any = {mFullname: '', mUser: '', mPass: '', mPhone: '', mEmail: '', mAddress: '', mConfirmPass: ''}
  count: number = 0;
  checkStt: boolean = false;

  constructor(private formBuilder: FormBuilder,
    private router: Router,
    private userL:UserService) {
      this.userL.getAllUser().valueChanges().subscribe(user=>{
        this.listUsers = user;
      })
     }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      fullname: new FormControl(''),
      username: new FormControl(''),
      email: new FormControl(''),
      password: new FormControl(''),
      address: new FormControl(''),
      phone: new FormControl(''),
    })
  }

  checkExist(): number {
    for (var i = 0; i < this.listUsers.length; i++) {
      if (this.listUsers[i].email == this.registerForm.value.email) {
        this.count += 1;
      } else {
        this.count += 0;
      }
    }
    return this.count
  }
  checkuser() {
    if (this.validateData() && this.confirmPass()) {
      let a = this.checkExist();
      console.log(a, this.listUsers.length)
      if (this.count != 0) {
        window.alert('Tên tài khoản ' + this.registerForm.value.username + ' đã được tạo');
        this.count=0;
      } else {
        this.register();
      }
    }
  }

  validateData() {

    if (this.registerForm.value.username == '') {
      this.validate.mUser = ('Nhập tên tài khoản đăng nhập');
    } else {
      this.validate.mUser = '';
    }
    if (this.registerForm.value.fullname == '') {
      this.validate.mFullname = ('Nhập họ và tên ');
    } else {
      this.validate.mFullname = '';
    }
    if (this.registerForm.value.password == '') {
      this.validate.mPass = ('Mật khẩu không được bỏ trống');
    } else {
      this.validate.mPass = '';
    }
    if (this.registerForm.value.phone == '') {
      this.validate.mPhone = ('Nhập số điện thoại');
    } else {
      this.validate.mPhone = '';
    }
    if (this.registerForm.value.email == '') {
      this.validate.mEmail = ('Email không được để trống');
    } else {
      this.validate.mEmail = '';
    }
    if (this.registerForm.value.address == '') {
      this.validate.mAddress = ('Nhập địa chỉ của bạn');
    } else {
      this.validate.mAddress = '';
    }


    if (
      this.registerForm.value.fullname != '' &&
      this.registerForm.value.email != '' &&
      this.registerForm.value.password != '' &&
      this.registerForm.value.address != '' &&
      this.registerForm.value.phone != '') {
      return this.checkStt = true;
    }


    return this.checkStt;
  }

  register() {
    let discountNewUser = new Discount('NEWACCOUNT', 15, 1);
    let discount1 = new Discount('LTFRONTEND', 10, 2);
    let discount2 = new Discount('NBSTORE', 15, 2);
    let listDiscount: Discount[] = [];
    listDiscount.push(discountNewUser);
    listDiscount.push(discount1);
    listDiscount.push(discount2);
    let listadd:AddressItem[]=[];
    listadd.push(new AddressItem(this.registerForm.value.fullname,"null","null","null",this.registerForm.value.phone,this.registerForm.value.address));

    let user = new User('',this.registerForm.value.email,
      this.registerForm.value.fullname,this.registerForm.value.phone,
      this.registerForm.value.address,listDiscount,listadd);
    this.userL.signUp(this.registerForm.value.password,user);
    this.alert1('Đăng ký tài khoản thành công \n vui lòng xác thực Email để đăng nhập','success')
    this.router.navigate(['/login']);
  }

  confirmPass() {
    // @ts-ignore
    if( document.getElementById('password').value !== document.getElementById('confirm_password').value){
      this.validate.mConfirmPass=("Mật khẩu không trùng khớp");
      return false;
    }else {
      this.validate.mConfirmPass=("");
      return true;
    }
    ;
  }

  alert1(mess: any, type: any) {
    Swal.fire({
      position: 'center',
      icon: type,
      title: mess,
      showConfirmButton: false,
      timer: 3000
    })
  }


}
