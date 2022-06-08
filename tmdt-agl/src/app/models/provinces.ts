import {Districts} from "./districts";

export class Provinces {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  phone_code:number;
  districts:Districts;

  constructor(name: string, code: number, codename: string, division_type: string, phone_code: number, districts: Districts) {
    this.name = name;
    this.code = code;
    this.codename = codename;
    this.division_type = division_type;
    this.phone_code = phone_code;
    this.districts = districts;
  }
}
