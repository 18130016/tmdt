import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartItem } from 'src/app/models/cart-item';
import { User } from 'src/app/models/user';
import { CartService } from 'src/app/services/cart.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Input() searchkey='';
  islogin:boolean = false;
  user:User|undefined;
  private cartlist:CartItem[]=[];
  cartLenht:any;


  constructor(private userService:UserService,
    private cartService:CartService,
    private route:Router) {
   }
  ngOnInit(): void {
    this.update();
    this.loadCartLength();
  }

  logout(){
    this.userService.logout();
  }
  update(){
    setInterval(() => {
      this.user = this.userService.userValue;
      if(this.user!=null){
        this.loadCartLength();
      }
      else{
        this.cartLenht = this.cartService.getItemsOff().length;
      }
    }, 500);
  }

  loadCartLength(){
    this.cartService.getAllCart().valueChanges().subscribe(
      (data) => {
        this.cartlist = data;
        this.cartLenht = this.loadCartByUser();
      }
    )
  }

  loadCartByUser():number{
    let count = 0;
    for(let i of this.cartlist){
      if(i.userName == this.user?.uid){
        count++;
      }
    }
    return count;
  }

  setSearchKey(){
    localStorage.setItem('searchkey',this.searchkey);
    this.route.navigate(['/search']);
  }


  // loadUser(){
  //   let id = JSON.parse(<string>localStorage.getItem('user'));
  //   for(let i of this.userlist){
  //     if(id == i.uid){
  //       this.user = i;
  //       break;
  //     }
  //   }
  // }
  name() {
    let id = JSON.parse(<string>localStorage.getItem('user'));
    return id;
  }



}
