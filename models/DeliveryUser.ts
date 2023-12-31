import mongoose, { Schema, Document } from "mongoose";

interface DeliveryUserDoc extends Document {
  firstName: string;
  lastName: string;
  adress: string;
  email: string;
  password: string;
  phone: string;
  salt: string;
  verified: boolean;
  isActive : boolean
  lng:number,
  lat:number,
  pincode : string
}

const DeliveryUserSchema = new Schema(
  {
    firstName: { type: String, required:true },
    lastName: { type: String , required:true},
    adress: { type: String , required:true},
    email: { type: String, required:true,},
    password: { type: String , required:true},
    phone: { type: String, required:true },
    salt: { type: String, required:true },
    verified: { type: Boolean},
    isActive: { type: Boolean},
    lng : { type: Number },
    lat : { type: Number },
    pincode: { type: String, required:true },
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

const DeliveryUser  = mongoose.model<DeliveryUserDoc>('deliveryUser',DeliveryUserSchema)

export {DeliveryUser}