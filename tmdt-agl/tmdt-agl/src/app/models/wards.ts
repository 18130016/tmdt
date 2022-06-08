export class Wards {
  name: string;
  code:number;
  division_type:string;
  short_codename:string;
  district_code:number;

  constructor(name: string, code: number, division_type: string, short_codename: string, district_code: number) {
    this.name = name;
    this.code = code;
    this.division_type = division_type;
    this.short_codename = short_codename;
    this.district_code = district_code;
  }
}
