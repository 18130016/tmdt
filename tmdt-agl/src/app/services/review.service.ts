import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { Review } from '../models/review';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  reviews:AngularFireList<Review>;
  constructor(private db:AngularFireDatabase)
  {
    this.reviews = this.db.list('review');
   }

   getAll(){
     return this.reviews;
   }

   newReview(rv:Review){
     this.reviews.push(rv);
   }
   deleteReview(key:string){
    return this.reviews.remove(key);
   }
   editReview(data:any){
     return this.reviews.update(data.key,{content:data.content,user:data.user,rate:data.rate,product_id:data.product_id,name:data.name})
   }
   getReviewWithProduct(id:any):Observable<Review[]|any>{
    let list;
    this.reviews.valueChanges().subscribe(rs=>{
      list = rs.find(t=>{t.product_id = id});
    });
    return of(list);
   }
}
