export class Discount {
  codeDiscount:string;
  rate:number;
qty:number;
  constructor(codeDiscount:string,rate:number,qty:number) {
    this.codeDiscount =codeDiscount;
    this.rate = rate;
    this.qty=qty;
  }
}
