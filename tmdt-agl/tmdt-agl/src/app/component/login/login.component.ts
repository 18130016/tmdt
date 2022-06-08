import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { CartItem } from 'src/app/models/cart-item';
import { User } from 'src/app/models/user';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';
import { map } from 'rxjs';
import { AddressItem } from 'src/app/models/address-item';
import { Discount } from 'src/app/models/discount';
import { AngularFireAuth } from '@angular/fire/auth';
import firebase from 'firebase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public listUsers: User[] = [];
  form: FormGroup | any;
  model: any = {};
  loading = false;
  submitted = false;
  returnUrl: string | any;
  notification: string = '';
  lenghtCart: any;
  cartList: CartItem[] = [];
  listcartData: any= [];
  check1: boolean = false;

  userItem: any;

  constructor(private userL:UserService,
    private router:Router,
    private cartService:CartService,
    private auth:AngularFireAuth
    ) {
      this.userL.getAllUser().valueChanges().subscribe(user=>{this.listUsers = user});

      this.cartService.getAllCart().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ key: c.payload.key, ...c.payload.val() })
          )
        )
      ).subscribe(data => {
        this.listcartData = data;
      });
     }

  ngOnInit(): void {
  }
  loginAccount() {
    this.userL.loginWithEmail(this.model.userName,this.model.password);
    this.getUserId(this.model.userName);
    this.cartService.clearCart();
    this.router.navigate(['/']);
    }

    getUserId(email:any){
      for(let u of this.listUsers){
        if(u.email == email){
         this.putAllCartItemToUser(u.uid);
        }
      }
    }

    putAllCartItemToUser(uid:any) {
      for(let i of this.cartService.getItemsOff()){
        let check = false;
        for(let x of this.listcartData){
          if(i.product.id == x.product.id){
            let item = x;
            item.qty = item.qty + i.qty;
            this.cartService.getAllCart().update(x.key,{qty:item.qty});
            check= true;
            break;
          }
        }
        if(!check){
          let it = new CartItem(i.product,i.qty,uid);
          this.cartService.getAllCart().push(it);
        }
      }
  }

  loginWithGoogle(){
    this.userL.loginGoogle();
    this.router.navigate(['/']);
  }
  loginWithFacebook(){
    this.userL.loginFacebook();
    this.router.navigate(['/']);
  }
 
}
