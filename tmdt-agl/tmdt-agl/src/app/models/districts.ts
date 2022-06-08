import {Wards} from "./wards";

export class Districts {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
  province_code:number
  wards: Wards[];

  constructor(name: string, code: number, codename: string, division_type: string, short_codename: string, province_code: number, wards: Wards[]) {
    this.name = name;
    this.code = code;
    this.codename = codename;
    this.division_type = division_type;
    this.short_codename = short_codename;
    this.province_code = province_code;
    this.wards = wards;
  }
}
