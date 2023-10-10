import mongoose, { Schema, Document, Model } from "mongoose";
import { CreateFoodInput } from "../dto";

interface VandorDoc extends Document {
  name: string;
  ownerName: string;
  foodType: [string];
  pincode: string;
  adress: string;
  email: string;
  password: string;
  phone: string;
  salt: string;
  serviceAvailable: boolean;
  coverImage: [string];
  rating: number;
  foods: [CreateFoodInput|string];
  lng:number
  lat:number
}

const VandorSchema = new Schema(
  {
    name: { type: String, required:true },
    ownerName: { type: String , required:true},
    foodType: { type: [], required:true },
    pincode: { type: String, required:true },
    adress: { type: String , required:true},
    email: { type: String, required:true},
    password: { type: String , required:true},
    phone: { type: String, required:true },
    salt: { type: String, required:true },
    serviceAvailable: { type: Boolean, required:true },
    coverImage: { type: [String], required:true },
    rating: { type: Number },
    foods: [{ type: Schema.Types.ObjectId, ref: "food" }], //ref to  other schema
    lat: { type: Number },
    lng: { type: Number },
    
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

const Vandor  = mongoose.model<VandorDoc>('vandor',VandorSchema)

export {Vandor}