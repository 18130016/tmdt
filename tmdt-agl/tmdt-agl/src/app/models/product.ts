export class Product {

  id:number;
  productname:string;
  img:string;
  pricesale:number
  price:number;
  description:string;
  manufacturer:string;
  listsize:[];
  listcolor:[];
  category:string;
  timeupload:string;


  constructor(id: number, productname: string, img: string, pricesale: number, price: number,
              description: string, manufacturer: string,listsize:Array<string>, listcolor:Array<string>,category:string,timeupload:string) {

    this.id = id;
    this.productname = productname;
    this.img = img;
    this.pricesale = pricesale;
    this.price = price;
    this.description = description;
    this.manufacturer = manufacturer;
    this.listsize = [];
    this.listcolor = [];
    this.category =category;
    this.timeupload = timeupload;
  }
}

