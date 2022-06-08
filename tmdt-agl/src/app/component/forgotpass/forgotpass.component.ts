import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgotpass',
  templateUrl: './forgotpass.component.html',
  styleUrls: ['./forgotpass.component.css']
})
export class ForgotpassComponent implements OnInit {
fogotForm:FormGroup|any;
  constructor(private userService:UserService) { }

  ngOnInit(): void {
    this.fogotForm = new FormGroup({
      email: new FormControl(''),
    })
  }
  resetPassword(){
    let em = this.fogotForm.value.email;
    this.userService.resetPassword(em);
  };

}
