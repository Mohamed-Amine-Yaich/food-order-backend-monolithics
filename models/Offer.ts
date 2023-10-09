import mongoose, { Schema, Document, Model } from "mongoose";
import multer from "multer";

type Ifile = Express.Multer.File

export interface OfferDoc extends Document {
  offerType: string;//VENDOR //GEERIC
  vendors  : [any] //['vendorIds',...]
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

const OfferSchema = new Schema(
  {

    offerType:  {type : String},//VENDOR //GENERIC
    vendors  :[ {type : Schema.Types.ObjectId, ref:'vandor'}],//'typo'  //['vendorIds',...]
    description:  {type : String},
    title :  {type : String},//INR 200D off on weeks days
    minValue : {type : Number},//min order amount to apply this offer is 300 
    offerAmount: {type : Number},//200
    startValidity :  {type : Date} ,
    endValidity :   {type : Date} ,
    promoCode :   {type : String},//week200
    promoType :   {type : String},//ALL,USER,BANC,CARD
    bank :[{type : String}],//any[]
    bins:[{type : Number}],//any[]
    pinCode :{type : String},
    isActive : {type : Boolean},
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Exclude the 'password' and other field from the JSON representation
        delete ret.__v
        delete ret.createdAt
        delete ret.updatedAt
        
      },
    },
  }
);

const Offer  = mongoose.model<OfferDoc>('offer',OfferSchema)

export {Offer}