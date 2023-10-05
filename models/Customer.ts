import mongoose, { Schema, Document, Model } from "mongoose";
import { CreateFoodInput, CustomerCreateOrderInput } from "../dto";
import { Order, OrderDoc } from "./Order";

interface CustomerDoc extends Document {
  firstName: string;
  lastName: string;
  adress: string;
  email: string;
  password: string;
  phone: string;
  salt: string;
  verified: boolean;
  otp:string,
  otpExpiry:Date
  lng:number,
  lat:number,
  orders : [OrderDoc]//[typeof Order|string]
}

const CustomerSchema = new Schema(
  {
    firstName: { type: String, required:true },
    lastName: { type: String , required:true},
    adress: { type: String , required:true},
    email: { type: String, required:true,},
    password: { type: String , required:true},
    phone: { type: String, required:true },
    salt: { type: String, required:true },
    verified: { type: Boolean},
    otp: { type: String, required:true },
    otpExpiry: { type: Date, required:true },
    lng : { type: Number, required:true },
    lat : { type: Number, required:true },
    orders : [{ type: Schema.Types.ObjectId, ref: "order" }]
  },
  {
    timestamps: true,
    toJSON: {
      transform: function (doc, ret) {
        // Exclude the 'password' and other field from the JSON representation
        delete ret.password;
        delete ret.__v
        delete ret.salt
        delete ret.createdAt
        delete ret.updatedAt
        
      },
    },
  }
);

const Customer  = mongoose.model<CustomerDoc>('customer',CustomerSchema)

export {Customer}