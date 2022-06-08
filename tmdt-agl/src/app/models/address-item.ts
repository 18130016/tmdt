export class AddressItem {
  key: string|any;
  name: string;
  province: string;
  districts: string;
  wards: string;
  addressDetails: string;
  phonenumber: number;

  constructor( name: string, province: string, districts: string, wards: string, phonenumber: number, addressDetails: string) {
    this.name = name;
    this.province = province;
    this.districts = districts;
    this.wards = wards;
    this.phonenumber = phonenumber;
    this.addressDetails = addressDetails;
  }



}
