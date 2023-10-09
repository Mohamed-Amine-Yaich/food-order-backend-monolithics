export interface CreateVandorInput {
name : string,
ownerName : string,
foodType : [string],
pincode: string,
adress: string,
email: string,
password : string,
phone : string

}
export interface VandorLoginInput {
    email: string,
    password : string,


}

export interface VandorAuthPayload {
    _id: string
    name : string
    email : string

}

export interface  VandorUpdateInput {
    name : string ,foodType: [string],adress: string
}

export interface CreateOfferInputs {
    offerType: string;//VENDOR //GEERIC
   // vendors  : [any] //['vendorIds',...] added when creating an offer by throwing the current vendor in the vendors arry prop of the offer 
    description: string;
    title : string,//INR 200D off on weeks days
    minValue : number,//min order amount to apply this offer is 300 
    offerAmount: number;//200
    startValidity : Date ,
    endValidity : Date,
    promoCode : string,
    promoType : string,
    bank : [any],
    bins:[any]
    pinCode :string,
    isActive : boolean
  }

  export interface UpdateOfferInputs {
   // vendors  : [any] //['vendorIds',...] added when creating an offer by throwing the current vendor in the vendors arry prop of the offer 
    offerType: string;//VENDOR //GEERIC
    description: string;
    title : string,//INR 200D off on weeks days
    minValue : number,//min order amount to apply this offer is 300 
    offerAmount: number;//200
    startValidity : Date ,
    endValidity : Date,
    promoCode : string,
    promoType : string,
    bank : [any],
    bins:[any]
    pinCode :string,
    isActive : boolean
  }