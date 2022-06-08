import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import {HttpClient} from "@angular/common/http";
import { Provinces } from '../models/provinces';
import { Districts } from '../models/districts';
import { Wards } from '../models/wards';
import firebase from 'firebase';
import Swal from 'sweetalert2';
import { FirebaseApp } from '@angular/fire';
import { Discount } from '../models/discount';
import { AddressItem } from '../models/address-item';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  valueChanges() {
    throw new Error('Method not implemented.');
  }
  public userData: any;
  userList:AngularFireList<User>;
  userInf :User|undefined;
  public isLogin:boolean = false;
  userItem:User[]=[];

  constructor(
    public auth:AngularFireAuth,
    public db:AngularFireDatabase,
    public route:Router,
    public ngZone:NgZone,
    private http:HttpClient
    
  ) {

    this.userList = this.db.list('user');
    this.auth.authState.subscribe( user => {
        this.userData = user;
      }
    )
    this.getAllUser().valueChanges().subscribe(us=>{
      this.userItem = us;
    })

   }

   getAllUser():AngularFireList<User>{
     return this.userList;
   }

   public get userValue(): User {
    let item:any;
    for(let i of this.userItem){
      let id = JSON.parse(<string>localStorage.getItem('user'));
      if(i.uid == id){
        item = i;
        break;
      }
    }
    return item;
  }

   loginWithEmail(email:string,password:string){
     this.auth.signInWithEmailAndPassword(email,password).then(
       (user)=>{
        this.userData = user;
        localStorage.setItem('user',JSON.stringify(user.user?.uid));
        this.isLogin = true;
       }
     ).catch(error => {
      console.log(error)
      window.alert('sai tài khoản email hoặc mật khẩu');
      throw error
    });
   }

  logout(){
    this.auth.signOut();
    this.isLogin = false;
    localStorage.removeItem('user');
    this.route.navigate(['/login']);
  }

  signUp(password:string,users:User){
    return this.auth.createUserWithEmailAndPassword(users.email,password).then(
      (result)=>{
        let id:any = result.user?.uid;
        result.user?.sendEmailVerification().then(()=>{});
          let us= new User(id, users.email,users.fullname,users.phone,users.adress,users.listVoucher,users.shippingAddress);
          this.createNewUser(id, us);
      })
  }
  createNewUser(uid:string,user:User){
   return this.userList.set(uid,user);
  }

  getProvince():Observable<Provinces[]>{
    return this.http.get<Provinces[]>('https://provinces.open-api.vn/api/p/')
  }
  getDistricts():Observable<Districts[]>{
    return  this.http.get<Districts[]>('https://provinces.open-api.vn/api/d/')
  }
  getWards():Observable<Wards[]>{
    return this.http.get<Wards[]>('https://provinces.open-api.vn/api/w/')
  }

  resetPassword(email:any){
    this.auth.sendPasswordResetEmail(email).then(()=>{
      this.alert('Đã xác nhận yêu cầu \n Kiểm tra email của bạn','success');
    }).catch((error) => {
      console.log(error);
    });
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

  loginGoogle(){
    return this.authLogin(new firebase.auth.GoogleAuthProvider);
  }

  authLogin(provider:any){
    return this.auth.signInWithPopup(provider).then((result)=>{
     let uid:any = result.user?.uid;
     let email:any =result.user?.email;
     let name:any = result.user?.displayName;
     let phone:any = result.user?.phoneNumber;
     let user =new User(uid, email, name, phone,'null',[new Discount('newmemver',3,2)],
     [new AddressItem(<string>result.user?.displayName,'null','null','null',123123,'null')]);
     this.checkExitUser(user);
     localStorage.setItem('user',JSON.stringify(result.user?.uid));
    });
  }

  checkExitUser(use:User){
    let check=true;
    for(let i = 0; i < this.userItem.length;i++){
      if(this.userItem[i].uid!=use.uid && i== this.userItem.length-1){
        check =false;
      }
    }
    if(!check){
      this.createNewUser(use.uid,use);
    }
  }
  

  loginFacebook(){
    return this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider).then((result)=>{
      let uid:any = result.user?.uid;
     let email:any =result.user?.email;
     let name:any = result.user?.displayName;
     let phone:any = result.user?.phoneNumber;
     let user =new User(uid, email, name, phone,'null',[new Discount('newmemver',3,2)],
     [new AddressItem(<string>result.user?.displayName,'null','null','null',123123,'null')]);
     this.checkExitUser(user);
     localStorage.setItem('user',JSON.stringify(result.user?.uid));
    })
  }




}
