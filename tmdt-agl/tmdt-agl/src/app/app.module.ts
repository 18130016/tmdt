import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { HeaderComponent } from './component/header/header.component';
import { HomeComponent } from './component/home/home.component';
import { FooterComponent } from './component/footer/footer.component';
import { ProductsComponent } from './component/products/products.component';
import {AngularFireModule} from '@angular/fire';
import {AngularFireDatabaseModule} from "@angular/fire/database";
import { RouterModule, Routes } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProductDetailComponent } from './component/product-detail/product-detail.component';
import { CartComponent } from './component/cart/cart.component';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { MyacountComponent } from './component/myacount/myacount.component';
import {AngularFireAuthModule} from '@angular/fire/auth';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { HttpClientModule } from '@angular/common/http';
import { StatusOrderPipe } from './services/fillter/status-order.pipe';
import { ForgotpassComponent } from './component/forgotpass/forgotpass.component';
import { CategoryPipe } from './services/fillter/category.pipe';
import { PricePipe } from './services/fillter/price.pipe';
import { SearchPipe } from './services/fillter/search.pipe';
import {CarouselModule} from 'ngx-owl-carousel-2';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AdminComponent } from './component/admin/admin.component';



const appRoutes : Routes=[
  {
    path:"",
    component: HomeComponent
  },
  {
    path:"products",
    component: ProductsComponent
  },
  {
    path:'productdetail/:id',
    component:ProductDetailComponent
  },
  {
    path:'cart',
    component:CartComponent
  },
  {
    path:'register',
    component:RegisterComponent
  },
  {
    path:'login',
    component:LoginComponent
  },{
    path:"my-account/:uid",
    component:MyacountComponent
  },
  {
    path:'checkout',
    component:CheckoutComponent
  },
  {
    path:'forgotpass',
    component:ForgotpassComponent
  },
  {
    path:'admin',
    component:AdminComponent
  }


]
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    HomeComponent,
    FooterComponent,
    ProductsComponent,
    ProductDetailComponent,
    CartComponent,
    LoginComponent,
    RegisterComponent,
    MyacountComponent,
    CheckoutComponent,
    StatusOrderPipe,
    ForgotpassComponent,
    CategoryPipe,
    PricePipe,
    SearchPipe,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireDatabaseModule,
    NgxPaginationModule,
    AngularFireAuthModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CarouselModule,
    BrowserAnimationsModule,


  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
